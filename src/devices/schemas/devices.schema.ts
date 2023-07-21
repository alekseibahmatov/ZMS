import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Position } from "../../positions/schemas/positions.schema";
import { Input } from "../../inputs/schemas/inputs.schema";
import { Event } from "../../events/schemas/event.schema";
import { Machine } from "../../machines/schemes/machine.schema";

export enum deviceTypes {
  MOXA
}

@Entity()
export class Device {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ip: string;

  @Column()
  type: deviceTypes;

  @OneToOne(() => Machine, (machine) => machine.device)
  machine: Machine;

  @OneToMany(() => Event, (event) => event.device)
  events: Event[];

  @OneToOne(() => Position, (pos) => pos.device, { eager: true, cascade: true })
  position: Position;

  @OneToMany(() => Input, (input) => input.device, { eager: true, cascade: true })
  inputs: Input[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}

