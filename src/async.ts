import {Consumer} from "./functional";
import {TranslateService} from "ng2-translate";
/**
 * Created by beenotung on 12/26/16.
 */
export class Defer<A, E> {
  promise: Promise<A>;
  resolve: Consumer<A>;
  reject: Consumer<E>
}
export function createDefer<A, E>(): Defer<A, E> {
  let res = new Defer<A, E>();
  res.promise = new Promise<A>((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  });
  return res;
}

export async function translateAsync(translate: TranslateService, key: string): Promise<string> {
  let defer = createDefer<string, any>();
  translate.get(key).subscribe(defer.resolve, defer.reject);
  return defer.promise;
}

export async function autoRetryAsync<A>(f: () => Promise<A>, retry_delay = 0): Promise<A> {
  try {
    return await f();
  } catch (e) {
    if (retry_delay > 0) {
      let defer = createDefer<A, any>();
      setTimeout(() => {
        autoRetryAsync(f)
          .then(defer.resolve)
          .catch(defer.reject)
        ;
      }, retry_delay);
      return defer.promise;
    } else {
      return await autoRetryAsync(f);
    }
  }
}
