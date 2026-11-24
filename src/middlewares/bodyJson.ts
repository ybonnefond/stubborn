import { json } from 'body-parser';
/**
 * @internal
 */
export function bodyJson({ limit }: { limit?: number | string } = {}) {
  return json({
    limit,
    type: [
      'json',
      'application/json',
      'application/x-amz-json-1.0',
      'application/x-amz-json-1.1',
    ],
  });
}
