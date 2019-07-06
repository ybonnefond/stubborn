/// <reference types="jest" />
declare global {
    namespace jest {
        interface Matchers<R> {
            toReplyWith(statusCode: any, body?: any, headers?: any): CustomMatcherResult;
        }
    }
}
export {};
