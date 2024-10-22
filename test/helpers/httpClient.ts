import FormData from 'form-data';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Stubborn } from '../../src';

export interface HttpClientRequest {
  path?: string;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  responseType?: 'json' | 'text' | 'arraybuffer';
  data?: string | Record<string, unknown> | FormData;
  query?: Record<string, string> | URLSearchParams;
}

export interface HttpClientResponse {
  status: number;
  data: string | Record<string, unknown> | Buffer;
  headers: Record<string, unknown>;
}

export class HttpClient {
  constructor(private readonly sb: Stubborn) {}

  public async request(req: HttpClientRequest): Promise<HttpClientResponse> {
    const res = await axios(this.toAxiosRequest(req));

    return this.toHttpClientResponse(res);
  }

  private toAxiosRequest(req: HttpClientRequest): AxiosRequestConfig {
    return {
      baseURL: this.sb.getOrigin(),
      url: req.path || '/',
      method: req.method || 'GET',
      data: req.data || '',
      responseType: req.responseType || 'json',
      params: req.query,
      maxRedirects: 0,
      headers: {
        accept: 'application/json',
        'content-type': null,
        ...(req.headers || {}),
      },
      validateStatus: () => true,
    };
  }

  private toHttpClientResponse(res: AxiosResponse) {
    return {
      status: res.status,
      data: res.data,
      headers: JSON.parse(JSON.stringify(res.headers)),
    };
  }
}
