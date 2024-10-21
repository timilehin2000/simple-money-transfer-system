import { NextFunction, Request, Response } from 'express';
import * as transferService from '../services/transfer.service';
import * as ApiResponse from '../utils/responseHandler';

export const initiateTransferHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { receiverId, amount, description } = req.body;

    const { userId } = req.user;

    try {
        const response = await transferService.initiateTransfer({
            senderId: userId,
            receiverId,
            amount,
            description,
        });

        ApiResponse.successResponse(res, 'Transfer sucessful', response, 201);
    } catch (err: any) {
        console.log(err);
        next(err);
    }
};

export const getUsersTransfersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.user;

    try {
        const transferType = req.query.transferType as string | undefined;

        const fromDate = req.query.fromDate
            ? new Date(req.query.fromDate as string)
            : undefined;
        const toDate = req.query.toDate
            ? new Date(req.query.toDate as string)
            : undefined;

        const minAmount = req.query.minAmount
            ? Number(req.query.minAmount)
            : undefined;
        const maxAmount = req.query.maxAmount
            ? Number(req.query.maxAmount)
            : undefined;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        const response = await transferService.getUsersTransfers({
            userId,
            transferType,
            fromDate,
            toDate,
            minAmount,
            maxAmount,
            page,
            limit,
        });

        ApiResponse.successResponse(
            res,
            `Fetched user's transfer history sucessful`,
            response,
            201,
        );
    } catch (err: any) {
        next(err);
    }
};
