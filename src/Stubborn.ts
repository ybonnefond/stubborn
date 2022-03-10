import { EventEmitter } from 'events';
import { createServer, Server } from 'http';

import { Emitter } from './@types/Emitter';
import { BodyDefinition, HeadersDefinition, PathDefinition } from './@types';
import { EVENTS, METHODS } from './constants';
import { Route } from './Route';
import { Router } from './Router';
import { getServerPort } from './utils';

export type StubbornOptions = {
  host?: string;
  defaultHeaders?: HeadersDefinition;
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
export class Stubborn implements Emitter {
  private server: Server;
  private port: number | null;
  private router: Router;
  private options: StubbornOptions;
  private emitter: EventEmitter = new EventEmitter();

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
    this.router = new Router({ host: this.options.host }, this.emitter);
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

    this.emitter.emit(EVENTS.CLEARED);

    return this;
  }

  /**
   * Create and Register a new DELETE route
   *
   * @param path Path matching definition
   */
  public delete(path: PathDefinition) {
    return this.router.createRoute(METHODS.DELETE, path);
  }

  /**
   * Create and Register a new GET route
   *
   * @param path Path matching definition
   */
  public get(path: PathDefinition) {
    return this.router.createRoute(METHODS.GET, path);
  }

  /**
   * Create and Register a new PACH route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public patch(path: PathDefinition, body: BodyDefinition = '') {
    return this.router.createRoute(METHODS.PATCH, path).setBody(body);
  }

  /**
   * Create and Register a new POST route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public post(path: PathDefinition, body: BodyDefinition = '') {
    return this.router.createRoute(METHODS.POST, path).setBody(body);
  }

  /**
   * Create and Register a new PUT route
   *
   * @param path Path matching definition
   * @param body Request body definition
   */
  public put(path: PathDefinition, body: BodyDefinition = '') {
    return this.router.createRoute(METHODS.PUT, path).setBody(body);
  }
  /**
   * Register a new route
   *
   * @param route Route a Route object
   */
  public addRoute(route: Route) {
    return this.router.addRoute(route);
  }

  /**
   * Remove an existing route
   *
   * @param route Route a Route object
   */
  public removeRoute(route: Route) {
    return this.router.removeRoute(route);
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
      resolve(null);
    });
  }

  /**
   * Stop the Stubborn server
   *
   * @returns Promise object resolved when server is stopped
   */
  public stop() {
    return new Promise(resolve => {
      this.server.close(() => resolve(null));
    });
  }

  public on(event: symbol, listener: (...args: any[]) => void): this {
    this.emitter.on(event, listener);
    return this;
  }

  public once(event: symbol, listener: (...args: any[]) => void): this {
    this.emitter.once(event, listener);
    return this;
  }

  public off(event: symbol, listener: (...args: any[]) => void): this {
    this.emitter.off(event, listener);
    return this;
  }

  public setMaxListeners(nb: number): this {
    this.emitter.setMaxListeners(nb);

    return this;
  }

  public getMaxListeners(): number {
    return this.emitter.getMaxListeners();
  }
}
