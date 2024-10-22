export enum TransferType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

export interface InitiateTransferBody {
    senderId: string;
    username: string;
    amount: number;
    description?: string;
}

export interface GetUsersTransferHistoryBody {
    userId: string;
    page: number;
    limit: number;
    transferType?: string;
    fromDate?: Date;
    toDate?: Date;
    minAmount?: number;
    maxAmount?: number;
}
