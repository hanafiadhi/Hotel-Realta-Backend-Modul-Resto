import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobRole } from './JobRole';
import { EmployeeDepartmentHistory } from './EmployeeDepartmentHistory';
import { EmployeePayHistory } from './EmployeePayHistory';
import { WorkOrderDetail } from './WorkOrderDetail';

@Index('employee_pkey', ['empId'], { unique: true })
@Entity('employee', { schema: 'hr' })
export class Employee {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'emp_id' })
  empId: number;

  @Column('character varying', {
    name: 'emp_national_id',
    nullable: true,
    length: 25,
  })
  empNationalId: string | null;

  @Column('date', { name: 'emp_birth_date', nullable: true })
  empBirthDate: string | null;

  @Column('character varying', {
    name: 'emp_marital_status',
    nullable: true,
    length: 1,
  })
  empMaritalStatus: string | null;

  @Column('character varying', {
    name: 'emp_gender',
    nullable: true,
    length: 1,
  })
  empGender: string | null;

  @Column('timestamp without time zone', {
    name: 'emp_hire_date',
    nullable: true,
  })
  empHireDate: Date | null;

  @Column('character varying', {
    name: 'emp_salaried_flag',
    nullable: true,
    length: 1,
  })
  empSalariedFlag: string | null;

  @Column('smallint', { name: 'emp_vacation_hours', nullable: true })
  empVacationHours: number | null;

  @Column('smallint', { name: 'emp_sickleave_hourse', nullable: true })
  empSickleaveHourse: number | null;

  @Column('smallint', { name: 'emp_current_flag', nullable: true })
  empCurrentFlag: number | null;

  @Column('character varying', {
    name: 'emp_photo',
    nullable: true,
    length: 255,
  })
  empPhoto: string | null;

  @Column('timestamp without time zone', {
    name: 'emp_modified_date',
    nullable: true,
  })
  empModifiedDate: Date | null;

  @Column('integer', { name: 'emp_user_id', nullable: true })
  empUserId: number | null;

  @ManyToOne(() => Employee, (employee) => employee.employees, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'emp_emp_id', referencedColumnName: 'empId' }])
  empEmp: Employee;

  @OneToMany(() => Employee, (employee) => employee.empEmp)
  employees: Employee[];

  @ManyToOne(() => JobRole, (jobRole) => jobRole.employees, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'emp_joro_id', referencedColumnName: 'joroId' }])
  empJoro: JobRole;

  @OneToOne(
    () => EmployeeDepartmentHistory,
    (employeeDepartmentHistory) => employeeDepartmentHistory.edhiEmp,
  )
  employeeDepartmentHistory: EmployeeDepartmentHistory;

  @OneToMany(
    () => EmployeePayHistory,
    (employeePayHistory) => employeePayHistory.ephiEmp,
  )
  employeePayHistories: EmployeePayHistory[];

  @OneToMany(
    () => WorkOrderDetail,
    (workOrderDetail) => workOrderDetail.wodeEmp,
  )
  workOrderDetails: WorkOrderDetail[];
}
