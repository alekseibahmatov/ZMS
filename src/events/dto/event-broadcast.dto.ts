import { State } from "../schemas/event.schema";

export class EventBroadcastDto {
  eventId: number;
  machineName: string;
  status: string;
  state: State;
}