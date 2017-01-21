/**
 * Created by beenotung on 12/26/16.
 */
import * as R from "ramda";
import {Supplier} from "./functional";
import {createDefer} from "./async";
import {F1} from "./typeStub-curry";

export let getProp: ((name: string, o: any) => any)|((name: string) => (o: any) => any) = R.curry((name: string, o: any) => {
  if (o[name])
    return o[name];
  else {
    return name.split('.').reduce((acc, c) => acc[c], o);
  }
});

export function first_non_null<A>(...args: A[]): A|null {
  for (let arg of args)
    if (arg) return arg;
  return null;
}

/* return b if a is null or undefined (or false) */
export function ifNull<A>(a: A, b: A): A {
  return a ? a : b;
}

export function ifNullF<A>(a: A, f: Supplier<A>): A {
  return a ? a : f();
}

/**
 * @remark won't flatten a
 * */
export async function ifNullFAsync<A>(a: A, f: Supplier<Promise<A>>): Promise<A> {
  /* not using Promise.resolve(a) directly to avoid flattening a when a is a promise */
  let defer = createDefer<A,any>();
  if (a) {
    defer.resolve(a);
  } else {
    f().then(x => defer.resolve(x));
  }
  return defer.promise;
}

export function bindFunction(f: Function): Function {
  return f.bind(f);
}

export function caseLookup<A,B>(cases: Array<[A, B]>, target: A): B {
  let xss = cases.filter(xs => xs[0] == target);
  if (xss.length == 1) {
    return xss[0][1];
  } else throw new Error('expect only 1 match, number of match:' + xss.length);
}

export function caseFunctionLookup<A,B>(cases: Array<[A, () => B]>, target: A): B {
  return caseLookup(cases, target)();
}

export function compareString(a: string, b: string): -1|0|1 {
  if (a == b)
    return 0;
  return a < b ? -1 : 1;
}

export function deepCall(f: Function) {
  while (typeof f === 'function')
    f = f();
  return f;
}

export interface Obj<A> {
  [k: string]: A;
  [k: number]: A;
}

export type ObjKey = string|number;

export function objForEach<A>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => void): (o: Obj<A>) => void {
  return o => Object.keys(o).forEach(x => f(o[x], x, o));
}

export function objMap<A,B>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => B): (o: Obj<A>) => B[] {
  return o => Object.keys(o).map(x => f(o[x], x, o));
}

export function objFilter<A>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => boolean): (o: Obj<A>) => A[] {
  return o => Object.keys(o).filter(x => f(o[x], x, o)).map(x => o[x]);
}

export function objToArray<A>(o: Obj<A>): [A, ObjKey][] {
  let xs = Object.keys(o);
  let res = new Array<[A, ObjKey]>(xs.length);
  xs.forEach((x, i) => res[i] = [o[x], x]);
  return res;
}

export function objValues<A>(o: Obj<A>): A[] {
  return Object.keys(o).map(x => o[x]);
}

export function argsToArray<A>(args: IArguments): A[] {
  const len = args.length;
  const res = new Array<A>(len);
  for (let i = 0; i < len; i++)
    res[i] = args[i];
  return res;
}
/**
 * take all from as ++ take some from args
 * */
export function concatArgs<A>(as: ArrayLike<A>, args: ArrayLike<A>, offsetArgs = 0, nArgs = args.length): A[] {
  let na = as.length;
  let res = new Array<A>(na + nArgs);
  let offset = 0;
  for (; offset < na; offset++) {
    res[offset] = as[offset];
  }
  for (let i = 0; i < nArgs; i++) {
    res[offset + offsetArgs + i] = args[i];
  }
  return res;
}

export function copyArray<A>(xs: ArrayLike<A>, offset: number = 0, count: number = xs.length): A[] {
  let res = new Array(count);
  for (let i = 0; i < count; i++)
    res[i] = xs[offset + i];
  return res;
}

export function copyToArray<A>(dest: Array<A>, destOffset = 0, src: ArrayLike<A>, srcOffset = 0, count = src.length) {
  for (let i = 0; i < count; i++) {
    dest[destOffset + i] = src[srcOffset + i];
  }
  return dest;
}

let nFuncs = <F1<Function,Function>[]> [];

export function genFunction(n: number, f: Function): Function {
  if (n < 1)
    return function fun0() {
      return f.apply(null, arguments);
    };
  if (!nFuncs[n]) {
    let args = 'a0';
    for (let i = 1; i < n; i++) {
      args += ', a' + i;
    }
    let code = `nFuncs[${n}] = function(f){
  return function fun${n}(${args}){
    return f.apply(null, arguments);
  };
}`;
    eval(code);
  }
  return nFuncs[n](f);
}

/**
 * for the sake of implicit any in object index
 * */
export function enum_i2s(e: any, i: number): string {
  return e[i];
}
export function enum_s2i(e: any, s: string): number {
  return e[s];
}
export function enum_has_s(e: any, s: string): boolean {
  return e[s] !== void 0;
}

export function isNumber(i: any): boolean {
  return Number.isFinite(+i);
}
export function toNumber(i: any): number {
  if (!isNumber(i))
    throw new TypeError("i is not a number: " + i);
  return +i;
}
