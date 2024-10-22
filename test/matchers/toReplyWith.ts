import { diff } from 'jest-diff';
import { HttpClientResponse } from '../helpers/httpClient';

declare global {
  namespace jest {
    interface Expect {
      toReplyWith<R, T>(
        statusCode: any,
        body?: any,
        headers?: any,
      ): Matchers<R, T>;
    }
    interface Matchers<R, T> {
      toReplyWith(
        statusCode: any,
        body?: any,
        headers?: any,
      ): CustomMatcherResult;
    }
  }
}

export function toReplyWith(
  this: any,
  response: HttpClientResponse,
  {
    status,
    body,
    headers,
  }: {
    status: number;
    body?: unknown;
    headers?: Record<string, string>;
  },
) {
  const fail = makeFail(this, response);

  if (status !== response.status) {
    return fail(`expects ${status} status code, got ${response.status}`);
  }

  if (body && !this.equals(body, response.data)) {
    return fail('Body does not match', {
      expected: body,
      received: response.data,
    });
  }

  if (headers && !this.equals(headers, response.headers)) {
    return fail('Headers does not match', {
      expected: headers,
      received: response.headers,
    });
  }

  return {
    message: () => 'response ok',
    pass: true,
  };
}

function makeFail(thisObj: any, response: HttpClientResponse) {
  return (message: string, { expected, received }: any = {}) => {
    const extra = expected
      ? diff(expected, received, { expand: thisObj.expand })
      : '';

    return {
      pass: false,
      message: () =>
        `${message}\n${extra}\nRequest received:\n${JSON.stringify(
          response.data,
          null,
          2,
        )}`, // eslint-disable-line no-magic-numbers
    };
  };
}
