//src/modules/rbac/entities/roles.entity.ts
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
} from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity("roles")
export class Roles {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({ name: "role", type: "varchar", nullable: false, unique: true })
  role: string;

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

/**
 * example are
 * "Administrator"
 * "Moderator",
 * "User",
 * "Guest",
 * "Editor",
 * "Manager"
 */
