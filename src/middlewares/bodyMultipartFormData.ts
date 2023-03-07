import { Form } from 'multiparty';
import { JsonObject, NextFunction, Request, Response } from '../@types';
import ReadableStream = NodeJS.ReadableStream;
/**
 * @internal
 */
export function bodyMultipartFormData() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!/^multipart\/form-data/.test(req.headers['content-type'] || '')) {
      return next();
    }

    (req as Request & { _body: boolean })._body = true;

    const form = new Form({
      autoFields: false,
      autoFiles: false,
    });

    req.body = {} as JsonObject;

    form.on('error', err => {
      next(err);
    });

    // Parts are emitted when parsing the form
    form.on('part', async part => {
      const content = await streamToString(part);

      (req.body as JsonObject)[part.name] =
        part.filename === undefined
          ? content
          : {
              content,
              filename: part.filename,
            };
    });

    // Close emitted after form parsed
    form.on('close', () => {
      next();
    });

    form.parse(req);
  };
}

function streamToString(stream: ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: ArrayBuffer) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err: Error) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}
