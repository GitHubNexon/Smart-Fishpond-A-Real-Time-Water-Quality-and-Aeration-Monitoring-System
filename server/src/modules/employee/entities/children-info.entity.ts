import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { EmployeeFamilyInfo } from './family-info.entity';

@Entity('employee-children')
export class EmployeeChildrenInfo {
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
  middleName: string | null;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Column({ name: 'suffix', type: 'varchar', nullable: true })
  suffix: string | null;

  @ManyToOne(() => EmployeeFamilyInfo, (familyInfo) => familyInfo.children)
  @JoinColumn({ name: 'family_info_id' })
  familyInfo: EmployeeFamilyInfo;
}
