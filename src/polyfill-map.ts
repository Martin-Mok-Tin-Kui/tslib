import { clearArray, removeByIdx } from './array'
import { Type } from './lang'
import { getWindowOrGlobal } from './runtime'

export class PolyfillMap<K, V> implements Map<K, V> {
  public [Symbol.toStringTag]: any

  public ks: K[] = []
  public vs: V[] = []

  get size(): number {
    return this.ks.length
  }

  public clear(): void {
    clearArray(this.ks)
    clearArray(this.vs)
  }

  public delete(key: K): boolean {
    const idx = this.getIndex(key)
    if (idx === -1) {
      return false
    }
    removeByIdx(this.ks, idx)
    removeByIdx(this.vs, idx)
    return true
  }

  public forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg: PolyfillMap<K, V> = this,
  ): void {
    for (let i = thisArg.size; i >= 0; i--) {
      callbackfn(thisArg.vs[i], thisArg.ks[i], thisArg)
    }
  }

  public get(key: K): V | undefined {
    const idx = this.getIndex(key)
    return idx === -1 ? undefined : this.vs[idx]
  }

  public has(key: K): boolean {
    return this.getIndex(key) !== -1
  }

  public set(key: K, value: V): this {
    let idx = this.getIndex(key)
    // const res = idx === -1 ? undefined : this.vs[idx];
    if (idx === -1) {
      idx = this.ks.length
    }
    this.ks[idx] = key
    this.vs[idx] = value
    return this
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    let idx = 0

    return {
      next: () => {
        const k: K = this.ks[idx]
        const v: V = this.vs[idx]
        idx++
        const value: [K, V] = [k, v]
        return {
          done: idx >= this.size,
          value,
        }
      },
      [Symbol.iterator]() {
        return this
      },
    }
  }

  public entries(): IterableIterator<[K, V]> {
    return this[Symbol.iterator]()
  }

  public keys(): IterableIterator<K> {
    return this.ks[Symbol.iterator]()
  }

  public values(): IterableIterator<V> {
    return this.vs[Symbol.iterator]()
  }

  /**
   * return -1 if not found
   * */
  private getIndex(key: K): number {
    return this.ks.indexOf(key)
  }
}

export function polyfillMap<K, V>(): Type<Map<K, V>> {
  if (typeof Map === 'function') {
    return Map
  }
  const parent = getWindowOrGlobal()
  Object.assign(parent, { Map: PolyfillMap })
  return PolyfillMap
}
