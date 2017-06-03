import {forI, mapI, Obj, objValues} from './lang';
import {Maybe} from './maybe';
import {CompareResult} from './number';

/**
 * inplace delete all element from the array
 * @return old elements
 * */
export function clear<A>(xs: A[]): A[] {
  return xs.splice(0, xs.length);
}

/**
 * inplace replace all element in the array
 * @return the old elements
 * */
export function replace<A>(dest: A[], src: A[]): A[] {
  clear(dest);
  dest.push(...src);
  return dest;
}

export function includes<A>(x: A, xs: A[]): boolean {
  return xs.indexOf(x) !== -1;
}

/**
 * only use `===` to compare
 * @warning slow
 * @return new array
 * */
export function unique<A>(xs: A[]): A[] {
  let res: A[] = [];
  xs.forEach(x => {
    if (!includes(x, res))
      res.push(x);
  });
  return res;
}

export function rightMost<A>(n: number, xs: A[]): A[] {
  return xs.slice(xs.length - n, xs.length);
}
export function leftMost<A>(n: number, xs: A[]): A[] {
  return xs.slice(0, n);
}

/** inplace update */
export function popN(n: number, xs: any[]): void {
  forI(_ => xs.pop(), n);
}
/** inplace update */
export function popUntilN(n: number, xs: any[]): void {
  forI(_ => xs.pop(), xs.length - n);
}
/** inplace update */
export function shiftN(n: number, xs: any[]): void {
  forI(_ => xs.shift(), n);
}
/** inplace update */
export function shiftUntilN(n: number, xs: any[]): void {
  forI(_ => xs.shift(), xs.length - n);
}

export function last<A>(xs: A[], skipCheck = false): A {
  if (skipCheck || xs.length == 0)
    throw new TypeError('xs is not non-empty array');
  return xs[xs.length - 1];
}

export function maybeLast<A>(xs: A[]): Maybe<A> {
  return Maybe.fromNullable(xs[xs.length - 1]);
}

export function fromFileList(files: FileList): File[] {
  return mapI(i => files.item(i), files.length);
}

export function array_contains<A>(xs: A[], x: A) {
  return xs.indexOf(x) != -1;
}

export function insert<A>(xs: A[], index: number, x: A): void {
  xs.splice(index, 0, x);
}
type OrderType = 'ascending' | 'descending';
/**
 * insert into Ascending sorted array
 * */
export function insert_sorted<A>(xs: A[], comparator: (a: A, b: A) => CompareResult, x: A, order: OrderType = 'ascending'): void {
  const target = (order === 'ascending')
    ? CompareResult.Larger
    : CompareResult.Smaller
  ;
  for (let i = 0; i < xs.length; i++) {
    if (comparator(xs[i], x) === target) {
      insert(xs, i, x);
      return;
    }
  }
  xs.push(x);
}
export function remove<A>(xs: A[], x: A): void {
  let idx = xs.indexOf(x);
  if (idx != -1) {
    xs.splice(idx, 1);
  }
}
export function removeBy<A>(xs: A[], f: (a: A) => boolean): void {
  for (let i = 0; i < xs.length; i++) {
    if (f(xs[i])) {
      xs.splice(i, 1);
      return;
    }
  }
}

export function nodup<A>(xs: A[]): A[] {
  let s = new Set<A>();
  xs.forEach(x => s.add(x));
  return Array.from(s.values());
}

/**
 * inplace delete all duplicated element from the array (only one copy is kept)
 * @return old array
 * */
export function removeDup<A>(xs: A[]): A[] {
  const ys = nodup(xs);
  clear(xs);
  xs.push(...ys);
  return xs;
}

/**
 * inplace insert elements into the array
 * @return old array
 * */
export function insertNoDup<A>(acc: A[], newXs: A[]): A[] {
  acc.push(...newXs);
  return removeDup(acc);
}

/**
 * inplace operation
 * @return old array
 * */
export function removeDupByKey<A>(xs: A[], key: string | number): A[] {
  const t: Obj<A> = {};
  xs.map(x => t[x[key]] = x);
  return objValues(t);
}

/**
 * inplace update
 * @return old array
 * */
export function removeByKey<A>(xs: A[], key: string | number, keys: Array<string | number>): A[] {
  return replace(xs, xs.filter(x => !array_contains(keys, x[key])));
}
