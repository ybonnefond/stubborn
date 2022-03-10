export interface Emitter {
  setMaxListeners(nb: number): this;
  getMaxListeners(): number;
  on(event: symbol, listener: (...args: any[]) => void): this;
  once(event: symbol, listener: (...args: any[]) => void): this;
  off(event: symbol, listener: (...args: any[]) => void): this;
}
