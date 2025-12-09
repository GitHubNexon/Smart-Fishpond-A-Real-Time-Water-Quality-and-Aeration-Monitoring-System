import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { Employee } from './employee.entity';

@Entity('employee-work-experience-info')
export class EmployeeWorkExperienceInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'from_date',
    transformer: DateTimeTransformer,
  })
  fromDate: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'to_date',
    transformer: DateTimeTransformer,
  })
  toDate: Date;

  @Column({ name: 'company_name', type: 'varchar', nullable: true })
  companyName: string;

  @Column({ name: 'position', type: 'varchar', nullable: true })
  position: string;

  @Column({ name: 'department', type: 'varchar', nullable: true })
  department: string;

  @Column({ name: 'employment_type', type: 'varchar', nullable: true })
  employmentType: string;

  @Column({
    type: 'decimal',
    name: 'salary',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    nullable: true,
  })
  salary: number;

  @ManyToOne(() => Employee, (employee) => employee.workExperienceInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
