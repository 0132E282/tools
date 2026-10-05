import { afterEach, describe, expect, it } from 'vitest';
import {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosAdapter,
} from 'axios';
import apiService from './apiService';
import { getTools } from './tools';

const originalAdapter = apiService.defaults.adapter;
afterEach(() => {
  apiService.defaults.adapter = originalAdapter;
});

describe('API service', () => {
  it('uses the shared API path and preserves cancellation and session cookies', async () => {
    const controller = new AbortController();
    const adapter: AxiosAdapter = async (config) => {
      expect(config.baseURL).toBe('/api');
      expect(config.url).toBe('/tools');
      expect(config.withCredentials).toBe(true);
      expect(config.timeout).toBe(15000);
      expect(config.signal).toBe(controller.signal);
      return {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    };
    apiService.defaults.adapter = adapter;
    await expect(getTools(controller.signal)).resolves.toEqual([]);
  });

  it('turns backend validation errors into readable messages', async () => {
    apiService.defaults.adapter = async (config) => {
      throw new AxiosError(
        'Bad request',
        'ERR_BAD_REQUEST',
        config,
        undefined,
        {
          data: { message: ['Tiêu đề bắt buộc.', 'Thời gian không hợp lệ.'] },
          status: 400,
          statusText: 'Bad Request',
          headers: new AxiosHeaders(),
          config,
        },
      );
    };
    await expect(
      apiService.post('/calendar/primary/events', {}),
    ).rejects.toThrow('Tiêu đề bắt buộc. Thời gian không hợp lệ.');
  });

  it('preserves cancellation instead of reporting a network error', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getTools(controller.signal)).rejects.toBeInstanceOf(
      CanceledError,
    );
  });

  it('rejects invalid tools payloads even when the server returns 200', async () => {
    apiService.defaults.adapter = async (config) => ({
      data: [{ id: 'invalid', name: 'Tool' }],
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config,
    });
    await expect(getTools(new AbortController().signal)).rejects.toThrow(
      'Dữ liệu công cụ không hợp lệ.',
    );
  });
});
