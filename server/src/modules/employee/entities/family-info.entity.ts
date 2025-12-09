import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { EmployeeChildrenInfo } from './children-info.entity';

@Entity('employee-family-info')
export class EmployeeFamilyInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  // Spouse
  @Column({ name: 'spouse_first_name', type: 'varchar', nullable: true })
  spouseFirstName: string | null;

  @Column({ name: 'spouse_middle_name', type: 'varchar', nullable: true })
  spouseMiddleName: string | null;

  @Column({ name: 'spouse_last_name', type: 'varchar', nullable: true })
  spouseLastName: string | null;

  @Column({ name: 'spouse_suffix', type: 'varchar', nullable: true })
  spouseSuffix: string | null;

  // Father
  @Column({ name: 'father_first_name', type: 'varchar', nullable: false })
  fatherFirstName: string;

  @Column({ name: 'father_middle_name', type: 'varchar', nullable: true })
  fatherMiddleName: string | null;

  @Column({ name: 'father_last_name', type: 'varchar', nullable: false })
  fatherLastName: string;

  @Column({ name: 'father_suffix', type: 'varchar', nullable: true })
  fatherSuffix: string | null;

  // Mother
  @Column({ name: 'mother_first_name', type: 'varchar', nullable: false })
  motherFirstName: string;

  @Column({ name: 'mother_middle_name', type: 'varchar', nullable: true })
  motherMiddleName: string | null;

  @Column({ name: 'mother_last_name', type: 'varchar', nullable: false })
  motherLastName: string;

  @Column({ name: 'mother_maiden_name', type: 'varchar', nullable: true })
  motherMaidenName: string | null;

  // Children - OneToMany relationship
  @OneToMany(() => EmployeeChildrenInfo, (child) => child.familyInfo, {
    cascade: true,
  })
  children: EmployeeChildrenInfo[];
}
