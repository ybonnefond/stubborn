import { RequestBodyDefinition, HeaderDefinitions, PathDefinition } from './@types';
export declare type StubbornOptions = {
    host?: string;
    defaultHeaders?: HeaderDefinitions;
};
export declare class Stubborn {
    private server;
    private port;
    private router;
    private options;
    /**
     * @class Stubborn
     * @example
     * ```js
     * const { Stubborn } = require('stubborn-ws');
     * const stb = new Stubborn();
     * ```
     */
    constructor(options?: StubbornOptions);
    /**
     * Returns the server port.
     *
     * If the server is initialized with options.port set to 0 this method
     * will return the randomly affected port only after the server is started
     * @returns {number | null} Listening port or null if the server is not started
     */
    getPort(): number | null;
    /**
     * Returns the server origin (http://<options.host>:<port>)
     * @returns {string}
     */
    getOrigin(): string;
    /**
     * Remove all routes from the server
     *
     * @returns {this}
     */
    clear(): this;
    /**
     * Create and Register a new DELETE route
     *
     * @param {string} path Stubbed resource path
     * @returns {Route}
     */
    delete(path: PathDefinition): import("./Route").Route;
    /**
     * Create and Register a new GET route
     *
     * @param {string} path Stubbed resource path
     * @returns {Route}
     */
    get(path: PathDefinition): import("./Route").Route;
    /**
     * Create and Register a new PACH route
     *
     * @param {string} path Stubbed resource path
     * @param {RequestBodyDefinition} body Expected request body
     * @returns {Route}
     */
    patch(path: PathDefinition, body?: RequestBodyDefinition): import("./Route").Route;
    /**
     * Create and Register a new POST route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    post(path: PathDefinition, body?: RequestBodyDefinition): import("./Route").Route;
    /**
     * Create and Register a new PUT route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    put(path: PathDefinition, body?: RequestBodyDefinition): import("./Route").Route;
    /**
     * Start the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is started
     */
    start(port?: number): Promise<unknown>;
    /**
     * Stop the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is stopped
     */
    stop(): Promise<unknown>;
}
