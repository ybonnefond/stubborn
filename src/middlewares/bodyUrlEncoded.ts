import { urlencoded } from 'body-parser';

export function bodyUrlEncoded() {
  return urlencoded({ extended: true });
}
