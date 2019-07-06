import diff from 'jest-diff';

declare global {
  namespace jest {
    interface Expect {
      toReplyWith<T>(statusCode: any, body?: any, headers?: any): Matchers<T>;
    }
    interface Matchers<R> {
      toReplyWith(
        statusCode: any,
        body?: any,
        headers?: any,
      ): CustomMatcherResult;
    }
  }
}

export async function toReplyWith(
  this: any,
  response: any,
  statusCode: any,
  body?: any,
  headers?: any,
) {
  const fail = (message: string, { expected, received }: any = {}) => {
    const extra = expected
      ? diff(expected, received, { expand: this.expand })
      : '';
    return {
      pass: false,
      message: () =>
        `${message}\n${extra}\nRequest received:\n${JSON.stringify(
          response.body,
          null,
          2,
        )}`, // eslint-disable-line no-magic-numbers
    };
  };

  if (statusCode !== response.statusCode) {
    return fail(
      `expects ${statusCode} status code, got ${response.statusCode}`,
    );
  }

  if (body && !this.equals(body, response.body)) {
    return fail('Body does not match', {
      expected: body,
      received: response.body,
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
