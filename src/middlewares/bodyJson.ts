import { json } from 'body-parser';
/**
 * @internal
 */
export function bodyJson() {
  return json({
    type: [
      'json',
      'application/json',
      'application/x-amz-json-1.0',
      'application/x-amz-json-1.1',
    ],
  });
}
