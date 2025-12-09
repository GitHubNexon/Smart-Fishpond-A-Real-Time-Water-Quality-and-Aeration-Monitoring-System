import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('employee-educational-info')
export class EmployeeEducationalInfo {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  // ELEMENTARY
  @Column({ name: 'elementary', type: 'varchar', nullable: true })
  elementary: string;

  @Column({ name: 'elementary_school_name', type: 'varchar', nullable: true })
  elementarySchoolName: string;

  @Column({ name: 'elementary_graduated', type: 'varchar', nullable: true })
  elementaryYearGraduated: string;

  // HIGH SCHOOL
  @Column({ name: 'high_school', type: 'varchar', nullable: true })
  highSchool: string;

  @Column({ name: 'high_school_name', type: 'varchar', nullable: true })
  highSchoolName: string;

  @Column({ name: 'high_school_graduated', type: 'varchar', nullable: true })
  highSchoolYearGraduated: string;

  // COLLEGE
  @Column({ name: 'college', type: 'varchar', nullable: true })
  college: string;

  @Column({ name: 'college_school_name', type: 'varchar', nullable: true })
  collegeSchoolName: string;

  @Column({ name: 'college_graduated', type: 'varchar', nullable: true })
  collegeYearGraduated: string;

  @Column({ name: 'college_course', type: 'varchar', nullable: true })
  collegeCourse: string;

  // MASTERS
  @Column({ name: 'masters', type: 'varchar', nullable: true })
  masters: string;

  @Column({ name: 'masters_school_name', type: 'varchar', nullable: true })
  mastersSchoolName: string;

  @Column({ name: 'masters_graduated', type: 'varchar', nullable: true })
  mastersYearGraduated: string;

  @Column({ name: 'masters_course', type: 'varchar', nullable: true })
  mastersCourse: string;

  // PHD
  @Column({ name: 'phd', type: 'varchar', nullable: true })
  phd: string;

  @Column({ name: 'phd_school_name', type: 'varchar', nullable: true })
  phdSchoolName: string;

  @Column({ name: 'phd_graduated', type: 'varchar', nullable: true })
  phdYearGraduated: string;

  @Column({ name: 'phd_course', type: 'varchar', nullable: true })
  phdCourse: string;
}
