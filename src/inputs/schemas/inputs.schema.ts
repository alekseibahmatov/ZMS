import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Device } from "../../devices/schemas/devices.schema";
import { Status } from "../../statuses/schemes/statuses.schema";

@Entity()
export class Input {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inputId: number;

  @ManyToOne(() => Device, (device) => device.inputs, { onDelete: "CASCADE" })
  device: Device;

  @ManyToOne(() => Status, { eager: true, onDelete: "SET NULL" })
  @JoinColumn()
  status: Status;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}

