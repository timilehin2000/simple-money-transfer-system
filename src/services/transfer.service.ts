import AppDataSource from '../data-source';
import { Transfer, User, Wallet } from '../entities';
import {
    BadRequestError,
    NotFoundError,
} from '../helpers/errorHandlers/apiError';
import { PaginationOptions } from '../interfaces/pagination';
import {
    GetUsersTransferHistoryBody,
    InitiateTransferBody,
    TransferType,
} from '../interfaces/transfer.interface';

const transferRepository = AppDataSource.getRepository(Transfer);

export const initiateTransfer = async (body: InitiateTransferBody) => {
    const { senderId, username, amount, description } = body;

    const dataSource = AppDataSource;

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const receiver = await queryRunner.manager.findOne<User>('User', {
            where: { username: username.toLowerCase() },
            select: ['id'],
        });

        if (!receiver) {
            throw new BadRequestError('User not found');
        }

        if (senderId === receiver.id) {
            throw new BadRequestError(
                'You cannot transfer money to your own account',
            );
        }

        const senderWallet = await queryRunner.manager.findOne(Wallet, {
            where: { user: { id: senderId } },
            relations: ['user'],
            lock: { mode: 'pessimistic_write' },
        });

        const receiverWallet = await queryRunner.manager.findOne(Wallet, {
            where: { user: { id: receiver.id } },
            relations: ['user'],
            lock: { mode: 'pessimistic_write' },
        });

        if (!senderWallet) throw new NotFoundError('Sender wallet not found');

        if (!receiverWallet)
            throw new NotFoundError('Receiver wallet not found');

        if (senderWallet.balance < amount)
            throw new BadRequestError('Insufficient funds');

        const senderBalanceBefore = Number(senderWallet.balance);
        const receiverBalanceBefore = Number(receiverWallet.balance);
        const senderBalanceAfter = senderBalanceBefore - Number(amount);
        const receiverBalanceAfter = receiverBalanceBefore + Number(amount);

        senderWallet.balance = senderBalanceAfter;
        receiverWallet.balance = receiverBalanceAfter;

        await queryRunner.manager.save([senderWallet, receiverWallet]);

        const debitTransfer = queryRunner.manager.create(Transfer, {
            sender: senderWallet.user,
            receiver: receiverWallet.user,
            amount: amount,
            transferType: TransferType.DEBIT,
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderWallet.balance,
            description: description,
        });

        const creditTransfer = queryRunner.manager.create(Transfer, {
            sender: senderWallet.user,
            receiver: receiverWallet.user,
            amount: amount,
            transferType: TransferType.CREDIT,
            balanceBefore: receiverBalanceBefore,
            balanceAfter: receiverWallet.balance,
            description: description,
        });

        await queryRunner.manager.save([debitTransfer, creditTransfer]);

        await queryRunner.commitTransaction();

        return debitTransfer;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

export const getUsersTransfers = async (
    request: GetUsersTransferHistoryBody,
): Promise<{
    pagination: PaginationOptions;
    transfers: Transfer[];
}> => {
    const {
        userId,
        transferType,
        fromDate,
        toDate,
        minAmount,
        maxAmount,
        page = 1,
        limit = 10,
    } = request;

    const queryBuilder = transferRepository
        .createQueryBuilder('transfer')
        .leftJoinAndSelect('transfer.sender', 'sender')
        .leftJoinAndSelect('transfer.receiver', 'receiver')
        .where(
            '(transfer.sender.id = :userId AND transfer.transferType = :debitType) OR (transfer.receiver.id = :userId AND transfer.transferType = :creditType)',
            {
                userId,
                debitType: TransferType.DEBIT,
                creditType: TransferType.CREDIT,
            },
        )
        .orderBy('transfer.createdAt', 'DESC');

    if (transferType) {
        queryBuilder.andWhere('transfer.transferType = :transferType', {
            transferType,
        });
    }

    if (fromDate || toDate) {
        const tzOffset = new Date().getTimezoneOffset();

        if (fromDate && toDate) {
            const startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);
            startDate.setMinutes(startDate.getMinutes() - tzOffset);

            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            endDate.setMinutes(endDate.getMinutes() - tzOffset);

            queryBuilder.andWhere(
                'transfer.createdAt BETWEEN :startDate AND :endDate',
                {
                    startDate,
                    endDate,
                },
            );
        } else if (fromDate) {
            const startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);
            startDate.setMinutes(startDate.getMinutes() - tzOffset);

            queryBuilder.andWhere('transfer.createdAt >= :startDate', {
                startDate,
            });
        } else if (toDate) {
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            endDate.setMinutes(endDate.getMinutes() - tzOffset);

            queryBuilder.andWhere('transfer.createdAt <= :endDate', {
                endDate,
            });
        }
    }

    if (minAmount) {
        queryBuilder.andWhere('transfer.amount >= :minAmount', { minAmount });
    }

    if (maxAmount) {
        queryBuilder.andWhere('transfer.amount <= :maxAmount', { maxAmount });
    }

    const [transfers, totalCount] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        pagination: {
            page,
            totalCount,
            totalPages,
            limit,
            hasPrevPage,
            hasNextPage,
        },
        transfers,
    };
};
