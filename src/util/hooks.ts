import { useRef } from 'react';

export const InvalidSymbol = Symbol();
export const usePreviousValue = <T>(value: T, doUpdate: boolean = true): T | typeof InvalidSymbol => {
  const ref = useRef<T | typeof InvalidSymbol>(InvalidSymbol); // Tがundefinedの場合もあるため、初期化はunique symbol
  const prevValue = ref.current;
  if (doUpdate || prevValue === InvalidSymbol) ref.current = value;
  return prevValue;
};

export const useCheckDepsUpdate = <D extends any[]>(deps: D): boolean => {
  const prevDeps = usePreviousValue([...deps]);
  if (prevDeps === InvalidSymbol) return true; // 初回は必ず更新されている
  return deps.some((v, i) => !Object.is(v, prevDeps[i]));
};

export const useDependentObj = <T, D extends any[]>(obj: T, deps: D): T => {
  const is_deps_changed = useCheckDepsUpdate(deps);
  const prev_obj = usePreviousValue(obj, is_deps_changed);
  return is_deps_changed || prev_obj === InvalidSymbol ? obj : prev_obj;
};
