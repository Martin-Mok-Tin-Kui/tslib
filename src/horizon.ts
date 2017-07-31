import {createDefer} from "./async";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";
import {Horizon} from "typestub-horizon-client";
import {objValues} from "./lang";

/**
 * @remark Hbase style operation should be deprecated, since horizon support partial update
 * @example
 *   ```
 *   const id = (await hz.store({a:1, b:2}).toPromise()).id;
 *   hz.update({id:id, a:10})
 *   ```
 *   The resulting object will be {id:id, a:10, b:2}
 */

export async function newHorizonUUID(hz: Horizon, tableName: string = "uuid"): Promise<string> {
  const defer = createDefer<string, any>();
  hz(tableName).store({}).subscribe(x => defer.resolve(x.id), e => defer.reject(e));
  return defer.promise;
}

export function removeAll(hz: Horizon, tableName: string): Observable<string> {
  const table = hz<{ id: string }>(tableName);
  return table.fetch().mergeMap(xs => table.removeAll(xs).map(x => x.id));
}

export function getHorizon(): Horizon {
  return window["Horizon"];
}

/**
 * load horizon using angular http
 * will not auto retry
 * */
export let horizon_api_size = 266826;
export const is_debug_load_horizon = false;

export function setHorizonAPISize(x: number) {
  horizon_api_size = x;
}

/**
 * load horizon without angular
 * will not auto retry
 * */
export async function load_horizon(url: string) {
  const data = await fetch(url).then(x => x.text());
  const script = document.createElement("script");
  script.innerText = data;
  document.head.appendChild(script);
  if (typeof getHorizon() != "function") {
    throw new Error("failed to inject horizon script");
  }
  horizon_api_size = data.length;
  return "ok";
}

export function isHorizonDataType(o, skipWarn = false): boolean {
  const type = typeof o;
  switch (type) {
    case "number":
    case "string":
    case "boolean":
      return true;
    case "object":
      return Array.isArray(o)
        ? o.every(x => isHorizonDataType(x))
        : objValues(o).every(x => isHorizonDataType(x, skipWarn))
        ;
    default:
      /* e.g. undefined */
      if (!skipWarn) {
        console.warn("not supported field", {
          type: type
          , value: o
        });
      }
      return false;
  }
}
