import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkOrderDetail } from './WorkOrderDetail';

@Index('work_orders_pkey', ['woroId'], { unique: true })
@Entity('work_orders', { schema: 'hr' })
export class WorkOrders {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'woro_id' })
  woroId: number;

  @Column('timestamp without time zone', {
    name: 'woro_start_date',
    nullable: true,
  })
  woroStartDate: Date | null;

  @Column('character varying', {
    name: 'woro_status',
    nullable: true,
    length: 15,
  })
  woroStatus: string | null;

  @Column('integer', { name: 'woro_user_id', nullable: true })
  woroUserId: number | null;

  @OneToMany(
    () => WorkOrderDetail,
    (workOrderDetail) => workOrderDetail.wodeWoro,
  )
  workOrderDetails: WorkOrderDetail[];
}
