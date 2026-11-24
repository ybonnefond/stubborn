import { urlencoded } from 'body-parser';
/**
 * @internal
 */
export function bodyUrlEncoded(limit?: number | string) {
  return urlencoded({ extended: true, limit });
}
