import { createServer, Server } from 'http';

import {
  HeaderDefinitions,
  PathDefinition,
  RequestBodyDefinition,
} from './@types';
import { METHODS } from './constants';
import { Router } from './Router';
import { getServerPort } from './utils';

export type StubbornOptions = {
  host?: string;
  defaultHeaders?: HeaderDefinitions;
};

/**
 * @example
 * ```typescript
 * import { Stubborn } from 'stubborn-ws';
 * const sb = new Stubborn();
 *
 * sb.get('/').setResponseBody({ some: 'body' });
 *
 * const res = await got(`${sb.getOrigin()}`, { json: true });
 *
 * expect(res.body).toEqual({ some: 'body' });
 * ```
 */
export class Stubborn {
  private server: Server;
  private port: number | null;
  private router: Router;
  private options: StubbornOptions;

  constructor(options: StubbornOptions = {}) {
    this.options = Object.assign(
      {
        host: 'localhost',
        defaultHeaders: {},
      },
      options,
    );

    this.port = null;
    this.server = createServer();
    this.router = new Router({ host: this.options.host });
  }

  /**
   * Returns the server port.
   *
   * If the server is initialized with options.port set to 0 this method
   * will return the randomly affected port only after the server is started
   * @returns Listening port or null if the server is not started
   */
  public getPort(): number | null {
    return getServerPort(this.server);
  }

  /**
   * Returns the server origin (http://<options.host>:<port>)
   * @returns the server origin
   */
  public getOrigin(): string {
    return `http://${this.options.host}:${this.getPort()}`;
  }

  /**
   * Remove all routes from the server
   */
  public clear() {
    this.router.clear();

    return this;
  }

  /**
   * Create and Register a new DELETE route
   *
   * @param path Path matching definition
   */
  public delete(path: PathDefinition) {
    return this.router.createRoute(METHODS.DELETE, path).setBody(null);
  }

  /**
   * Create and Register a new GET route
   *
   * @param path Path matching definition
   */
  public get(path: PathDefinition) {
    return this.router.createRoute(METHODS.GET, path).setBody(null);
  }

  /**
   * Create and Register a new PACH route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public patch(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.PATCH, path).setBody(body);
  }

  /**
   * Create and Register a new POST route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public post(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.POST, path).setBody(body);
  }

  /**
   * Create and Register a new PUT route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public put(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.PUT, path).setBody(body);
  }

  /**
   * Start the Stubborn server
   * @returns Promise object resolved when server is started
   */
  public start(port: number = 0) {
    this.port = port;

    return new Promise(resolve => {
      this.server.listen(this.port);
      this.router.handle(this.server);
      resolve();
    });
  }

  /**
   * Stop the Stubborn server
   *
   * @returns Promise object resolved when server is stopped
   */
  public stop() {
    return new Promise(resolve => {
      this.server.close(() => resolve());
    });
  }
}
