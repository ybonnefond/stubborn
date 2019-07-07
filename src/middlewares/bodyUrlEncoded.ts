import { urlencoded } from 'body-parser';
/**
 * @internal
 */
export function bodyUrlEncoded() {
  return urlencoded({ extended: true });
}
