import { raw } from 'body-parser';

export function bodyRaw() {
  return raw({ type: () => true });
}
