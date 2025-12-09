import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BeforeInsert,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
  PayFrequencyEnum,
  WorkScheduleEnum,
} from '../enums/employee.enum';
import { Employee } from './employee.entity';

@Entity('employee-core-work-info')
export class EmployeeCoreWorkInfo extends BaseEntity {
  @Column({ name: 'position', type: 'varchar', nullable: false })
  position: string;

  @Column({ name: 'department', type: 'varchar', nullable: false })
  department: string;

  @Column({
    type: 'enum',
    enum: EmploymentTypeEnum,
    enumName: 'employment_type',
  })
  employmentType: EmploymentTypeEnum;

  @Column({
    type: 'enum',
    enum: EmploymentStatusEnum,
    enumName: 'employment_status',
  })
  employmentStatus: EmploymentStatusEnum;

  // Employment Start Dates
  @Column({
    name: 'date_hired',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  dateHired: Date;

  @Column({
    name: 'date_regularized',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  dateRegularized: Date;

  @Column({
    name: 'contract_start_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  contractStartDate: Date;

  @Column({
    name: 'contract_end_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  contractEndDate: Date;

  @Column({
    name: 'probation_end_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  probationPeriodEnd: Date;

  // Employment Exit Dates
  @Column({
    name: 'resigned_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  resignedDate: Date;

  @Column({
    name: 'resignation_reason',
    type: 'varchar',
    nullable: true,
  })
  resignationReason?: string;

  @Column({
    name: 'resignation_notes',
    type: 'text',
    nullable: true,
  })
  resignationNotes?: string;

  @Column({
    name: 'terminated_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  terminatedDate: Date;

  // NEW: Termination Details
  @Column({
    name: 'termination_reason',
    type: 'enum',
    enum: ['for_cause', 'without_cause'],
    nullable: true,
  })
  terminationReason?: 'for_cause' | 'without_cause';

  @Column({
    name: 'termination_notes',
    type: 'text',
    nullable: true,
  })
  terminationNotes?: string;

  @Column({
    name: 'retired_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  retiredDate: Date;

  @Column({
    name: 'retirement_notes',
    type: 'text',
    nullable: true,
  })
  retirementNotes?: string;

  // Verification
  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({
    name: 'verified_at',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  verifiedAt?: Date | null;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'prepared_by_id' })
  preparedBy: User;

  @ManyToOne(() => Employee, (employee) => employee.coreWorkInfo, {
    eager: true,
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
