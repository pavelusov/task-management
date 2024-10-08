import { Moment } from "moment";

export type UpdateTaskParam = {
  id: number;
  title: string;
  deadline:  Moment | null;
}

export type AddTaskParam = {
  title: string;
  deadline:  Moment | null;
}