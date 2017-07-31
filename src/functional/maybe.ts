import {createUnit, Monad, Unit} from "./monad";
import {isDefined} from "../lang";

export interface MaybeMonad<A> extends Monad<A> {
  map<B>(f: Function): MaybeMonad<B>;
}

export const MaybeUnit: Unit<MaybeMonad<any>, any> = createUnit<MaybeMonad<any>, any>(
  (monad, value) => {
    if (!isDefined(value)) {
      monad.bind = _ => monad;
    }
  })
;

export namespace MaybeMonad {
  export function fromNullable<A>(value: A | null): MaybeMonad<A> {
    return MaybeUnit(value);
  }
}
