import {
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bank } from './Bank';
import { PaymentGateway } from './PaymentGateway';
import { UserAccounts } from './UserAccounts';

@Index('entitys_pkey', ['entityId'], { unique: true })
@Entity('entitys', { schema: 'payment' })
export class Entitys {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'entity_id' })
  entityId: number;

  @OneToOne(() => Bank, (bank) => bank.bankEntity)
  bank: Bank;

  @OneToOne(() => PaymentGateway, (paymentGateway) => paymentGateway.pagaEntity)
  paymentGateway: PaymentGateway;

  @OneToMany(() => UserAccounts, (userAccounts) => userAccounts.usacEntity)
  userAccounts: UserAccounts[];
}
