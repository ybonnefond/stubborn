import { raw } from 'body-parser';
/**
 * @internal
 */
export function bodyRaw(limit?: number | string) {
  return raw({ type: () => true, limit });
}
