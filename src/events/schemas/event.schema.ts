import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Status } from "../../statuses/schemes/statuses.schema";
import { Device } from "../../devices/schemas/devices.schema";

export enum State {
  WAITING_FOR_ACCEPTANCE,
  PROCESSING,
  DONE
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Status, {eager: true})
  @JoinColumn()
  status: Status;

  @Column()
  state: State;

  @ManyToOne(() => Device, (device) => device.events, {eager: true})
  @JoinColumn()
  device: Device;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}