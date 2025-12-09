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
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';

@Entity('supplier')
export class Supplier extends BaseEntity {
  @Column({ name: 'supplier_name', type: 'varchar', nullable: false })
  supplierName: string;

  @Column({ name: 'supplier_contact_no', type: 'varchar', nullable: false })
  supplierContactNo: string;

  @Column({ name: 'supplier_contact_email', type: 'varchar', nullable: false })
  supplierContactEmail: string;
}

@Entity('company_profile')
export class CompanyProfile extends BaseEntity {
  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  companyName: string;

  @Column({
    name: 'registration_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  registrationNumber: string;

  @Column({
    name: 'tax_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  taxNumber: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  address: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @Column({
    name: 'website',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  website: string;
}



// export class System {}
