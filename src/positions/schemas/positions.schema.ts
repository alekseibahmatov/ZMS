import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Device } from "../../devices/schemas/devices.schema";

@Entity()
export class Position {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  top: number;

  @Column()
  left: number;

  @OneToOne(() => Device, (device) => device.position, { onDelete: "CASCADE" })
  @JoinColumn()
  device: Device;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}