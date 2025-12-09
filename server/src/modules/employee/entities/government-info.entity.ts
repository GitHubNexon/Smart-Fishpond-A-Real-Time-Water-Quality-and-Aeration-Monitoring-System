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

@Entity('employee-government-info')
export class EmployeeGovernmentInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({ type: 'varchar', nullable: true })
  sss: string;

  @Column({ type: 'varchar', nullable: true })
  pagIbig: string;

  @Column({ type: 'varchar', nullable: true })
  philHealth: string;

  @Column({ type: 'varchar', nullable: true })
  tin: string;

  @Column({ type: 'varchar', nullable: true })
  passportNo: string;

  @Column({ type: 'varchar', nullable: true })
  driversLicense: string;

  @Column({ type: 'varchar', nullable: true })
  postalId: string;

  @Column({ type: 'varchar', nullable: true })
  votersId: string;

  @Column({ type: 'varchar', nullable: true })
  nbi: string;

  @Column({ type: 'varchar', nullable: true })
  policeClearance: string;
}
