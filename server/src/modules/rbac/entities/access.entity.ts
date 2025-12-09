//src/modules/rbac/entities/access.entity.ts
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
} from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity("access")
export class Access {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
  
  @Column({
    name: "access",
    type: "varchar",
    nullable: false,
    unique: true,
  })
  access: string;

  @Column({
    name: "description",
    type: "varchar",
    nullable: false,
    default: "No description provided",
  })
  description: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @VersionColumn({ name: "version" })
  version: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt?: Date;
}


