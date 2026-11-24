import { raw } from 'body-parser';
/**
 * @internal
 */
export function bodyRaw({ limit }: { limit?: number | string } = {}) {
  return raw({ type: () => true, limit });
}
