import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeDepartmentHistory } from './EmployeeDepartmentHistory';

@Index('shift_shift_end_time_key', ['shiftEndTime'], { unique: true })
@Index('shift_pkey', ['shiftId'], { unique: true })
@Index('shift_shift_name_key', ['shiftName'], { unique: true })
@Index('shift_shift_start_time_key', ['shiftStartTime'], { unique: true })
@Entity('shift', { schema: 'hr' })
export class Shift {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'shift_id' })
  shiftId: number;

  @Column('character varying', {
    name: 'shift_name',
    nullable: true,
    unique: true,
    length: 25,
  })
  shiftName: string | null;

  @Column('time without time zone', {
    name: 'shift_start_time',
    nullable: true,
    unique: true,
  })
  shiftStartTime: string | null;

  @Column('time without time zone', {
    name: 'shift_end_time',
    nullable: true,
    unique: true,
  })
  shiftEndTime: string | null;

  @OneToMany(
    () => EmployeeDepartmentHistory,
    (employeeDepartmentHistory) => employeeDepartmentHistory.edhiShift,
  )
  employeeDepartmentHistories: EmployeeDepartmentHistory[];
}
