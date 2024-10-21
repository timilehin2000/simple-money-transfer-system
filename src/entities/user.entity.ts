import crypto from 'crypto';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    OneToMany,
    OneToOne,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { BaseEntity } from './base.entity';
import { Transfer } from './transfer.entity';
import { Wallet } from './wallet.entity';

@Entity('users')
export class User extends BaseEntity {
    @Index('username_index')
    @Column({
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, select: false })
    password: string;

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    wallet: Wallet;

    @OneToMany(() => Transfer, (transfer) => transfer.sender)
    sentTransfers: Transfer[];

    @OneToMany(() => Transfer, (transfer) => transfer.receiver)
    receivedTransfers: Transfer[];

    @BeforeInsert()
    transform_fields_to_lower_case() {
        if (this.username) this.username = this.username.toLowerCase();
    }

    @BeforeInsert()
    async hashPassword() {
        const salt = bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string,
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}
