/**
 * Created by beenotung on 12/26/16.
 */

import {copyArray, concatArgs} from "./lang";
export type Consumer<A> = (a: A) => void;
export type Supplier<A> = () => A;



/* reference : http://stackoverflow.com/questions/27996544/how-to-correctly-curry-a-function-in-javascript */

export function curry(f: Function): Function {
  let arity = f.length;
  return arity == 0 ? f : partial(f, arity, []);
  // return typeof f === 'function' && f.length > 0
  //   ? partial(f, f.length, [])
  //   : f;
}

export let id: Function = curry(x => x);

/** internal func, use id instead */
function autoCurry(f: Function): Function {
  return (typeof f === 'function' && f.length > 0)
    ? partial(f, f.length, [])
    : f;
}

/**
 * if enough N param,
 *   then take LAST N param, apply to f
 *     -- also carry acc to f (as bottom of args stack), but should be ignored by f)
 *     -- the functions wrapped by f might use the stacked (extra) args
 *     if this args has extra params,
 *       then apply them to the result of f
 *   else take all param, wait for extra param
 * */
function partial<A>(f: Function, arity: number, acc: A[]|IArguments): Function {
  let next = function partialNext() {
    let args = arguments;
    let m = args.length;
    if (m < arity)
      return partial(f, arity - m, concatArgs(acc, args, 0, m));
    let result = autoCurry(f.apply(null, concatArgs(acc, args, 0, arity)));
    if (arity < m) {
      return autoCurry(result.apply(null, copyArray(args, arity, m - arity)));
    }
    return result;
  };
  return next;
}

/** take all args (ignore arity) */
export let apply = curry(f => function () {
  return autoCurry(f.apply(null, arguments));
});

export let prop = curry((name, o) => o[name]);
export let length = curry(x => x.length);
export let filter = curry((f, xs) => xs.filter(f));
export let compose = curry((f, g, x) => f(g(x)));
export let flip = curry((f, a, b) => f(b, a));
export let lift = curry(a => b => a);
export let compose2 = compose(compose, compose);
export let odd = curry(x => x % 2 == 1);
export let even = curry(x => x % 2 == 0);
export let countWhere = curry(compose2(length, filter));
