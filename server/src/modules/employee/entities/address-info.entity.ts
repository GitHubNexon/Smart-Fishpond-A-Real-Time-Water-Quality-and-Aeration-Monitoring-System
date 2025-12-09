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

@Entity('employee-address-info')
export class EmployeeAddressInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({ name: 'zip_code', type: 'varchar', nullable: true })
  zipCode: string;

  @Column({ name: 'street', type: 'varchar', nullable: true })
  street: string;

  @Column({ name: 'barangay', type: 'varchar', nullable: true })
  barangay: string;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city: string;

  @Column({ name: 'province', type: 'varchar', nullable: true })
  province: string;

  @Column({ name: 'region', type: 'varchar', nullable: true })
  region: string;
}
