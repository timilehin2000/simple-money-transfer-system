import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
    // @Index({})
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 1000.0,
    })
    balance: number;

    @OneToOne(() => User, (user) => user.wallet)
    @JoinColumn({ name: 'userId' })
    user: User;
}
