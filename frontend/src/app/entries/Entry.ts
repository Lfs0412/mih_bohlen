import {Project} from "../projects/Project";

export interface Entry {
  id: number;
  index: string;
  entryName: string;
  pending: boolean;
  createdAt: string;
  threadId: string;
  project: Project;  // This field will contain the related project details
}
