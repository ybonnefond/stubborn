import { urlencoded } from 'body-parser';
/**
 * @internal
 */
export function bodyUrlEncoded({ limit }: { limit?: number | string } = {}) {
  return urlencoded({ extended: true, limit });
}
