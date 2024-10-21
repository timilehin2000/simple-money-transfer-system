import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { TransferType } from '../interfaces/transfer.interface';

@Entity('transfers')
export class Transfer extends BaseEntity {
    @ManyToOne(() => User, (user) => user.sentTransfers)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedTransfers)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: TransferType })
    transferType: TransferType;

    @Column('decimal', { precision: 10, scale: 2 })
    balanceBefore: number;

    @Column('decimal', { precision: 10, scale: 2 })
    balanceAfter: number;
}
