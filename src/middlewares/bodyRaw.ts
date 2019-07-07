import { raw } from 'body-parser';
/**
 * @internal
 */
export function bodyRaw() {
  return raw({ type: () => true });
}
