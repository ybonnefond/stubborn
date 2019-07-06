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

export class Stubborn {
  private server: Server;
  private port: number | null;
  private router: Router;
  private options: StubbornOptions;

  /**
   * @class Stubborn
   * @example
   * ```js
   * const { Stubborn } = require('stubborn-ws');
   * const stb = new Stubborn();
   * ```
   */
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
   * @returns {number | null} Listening port or null if the server is not started
   */
  public getPort(): number | null {
    return getServerPort(this.server);
  }

  /**
   * Returns the server origin (http://<options.host>:<port>)
   * @returns {string}
   */
  public getOrigin(): string {
    return `http://${this.options.host}:${this.getPort()}`;
  }

  /**
   * Remove all routes from the server
   *
   * @returns {this}
   */
  public clear() {
    this.router.clear();

    return this;
  }

  /**
   * Create and Register a new DELETE route
   *
   * @param {string} path Stubbed resource path
   * @returns {Route}
   */
  public delete(path: PathDefinition) {
    return this.router.createRoute(METHODS.DELETE, path).setBody(null);
  }

  /**
   * Create and Register a new GET route
   *
   * @param {string} path Stubbed resource path
   * @returns {Route}
   */
  public get(path: PathDefinition) {
    return this.router.createRoute(METHODS.GET, path).setBody(null);
  }

  /**
   * Create and Register a new PACH route
   *
   * @param {string} path Stubbed resource path
   * @param {RequestBodyDefinition} body Expected request body
   * @returns {Route}
   */
  public patch(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.PATCH, path).setBody(body);
  }

  /**
   * Create and Register a new POST route
   *
   * @param {string} path Stubbed resource path
   * @param {string|object} body Expected request body
   * @returns {Route}
   */
  public post(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.POST, path).setBody(body);
  }

  /**
   * Create and Register a new PUT route
   *
   * @param {string} path Stubbed resource path
   * @param {string|object} body Expected request body
   * @returns {Route}
   */
  public put(path: PathDefinition, body: RequestBodyDefinition = '') {
    return this.router.createRoute(METHODS.PUT, path).setBody(body);
  }

  /**
   * Start the Stubborn server
   *
   * @returns {Promise} Promise object resolved when server is started
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
   * @returns {Promise} Promise object resolved when server is stopped
   */
  public stop() {
    return new Promise(resolve => {
      this.server.close(() => resolve());
    });
  }
}
