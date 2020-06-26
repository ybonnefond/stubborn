export interface Emitter {
  on(event: symbol, listener: (...args: any[]) => void): this;
  once(event: symbol, listener: (...args: any[]) => void): this;
  off(event: symbol, listener: (...args: any[]) => void): this;
}
