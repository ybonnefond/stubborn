import { bodyJson } from './bodyJson';
import { bodyUrlEncoded } from './bodyUrlEncoded';
import { bodyRaw } from './bodyRaw';
import { urlParser } from './urlParser';
export declare const middlewares: {
    bodyJson: typeof bodyJson;
    bodyUrlEncoded: typeof bodyUrlEncoded;
    bodyRaw: typeof bodyRaw;
    urlParser: typeof urlParser;
};
