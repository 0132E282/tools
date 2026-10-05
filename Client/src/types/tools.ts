export interface Tool {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ToolInput = Pick<Tool, 'name'> & { description?: string };
