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

@Entity('employee-contact-info')
export class EmployeeContactInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({
    name: 'contactNo',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  contactNo: string;

  @Column({
    name: 'contact_email',
    type: 'varchar',
    nullable: true,
  })
  contactEmail: string;

  @Column({
    name: 'emergency_contact_no',
    type: 'varchar',
    nullable: true,
  })
  emergencyContactNo: string;

  @Column({ name: 'emergency_contact_name', type: 'varchar', nullable: true })
  emergencyContactName: string;

  @Column({ name: 'emergency_relationship', type: 'varchar', nullable: true })
  emergencyRelationship: string;
}
