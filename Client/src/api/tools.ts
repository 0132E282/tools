import apiService from './apiService';
import type { Tool, ToolInput } from '../types/tools';

function isTool(value: unknown): value is Tool {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'description' in value &&
    (typeof value.description === 'string' || value.description === null) &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    'updatedAt' in value &&
    typeof value.updatedAt === 'string'
  );
}

export async function getTools(signal: AbortSignal): Promise<Tool[]> {
  const { data } = await apiService.get<unknown>('/tools', { signal });
  if (!Array.isArray(data) || !data.every(isTool)) {
    throw new Error('Dữ liệu công cụ không hợp lệ.');
  }
  return data;
}

export async function saveTool(
  input: ToolInput,
  id?: Tool['id'],
): Promise<Tool> {
  const { data } =
    id === undefined
      ? await apiService.post<unknown>('/tools', input)
      : await apiService.patch<unknown>(`/tools/${id}`, input);
  if (!isTool(data))
    throw new Error(
      'Máy chủ trả dữ liệu không hợp lệ sau khi lưu. Tải lại danh sách để kiểm tra trước khi thử lại.',
    );
  return data;
}
