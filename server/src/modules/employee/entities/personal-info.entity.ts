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
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';
import {
  GenderEnum,
  CivilStatusEnum,
  BloodTypeEnum,
} from '../enums/employee.enum';

@Entity('employee-personal-info')
export class EmployeePersonalInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', nullable: true })
  middleName: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Column({ name: 'suffix', type: 'varchar', nullable: false })
  suffix: string;

  @Column({
    name: 'birth_date',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    enumName: 'gender',
  })
  gender: GenderEnum;

  @Column({
    type: 'enum',
    enum: CivilStatusEnum,
    enumName: 'civil_status',
  })
  civilStatus: CivilStatusEnum;

  @Column({
    type: 'enum',
    enum: BloodTypeEnum,
    enumName: 'blood_type',
  })
  bloodType: BloodTypeEnum;


  @Column({ type: 'float', nullable: true })
  height: number; // in centimeters

  @Column({ type: 'float', nullable: true })
  weight: number; // in kilograms

  @Column({ name: 'citizenship', type: 'varchar', nullable: false })
  citizenship: string;
}
