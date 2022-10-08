import { renderHook } from '@testing-library/react-hooks';
import { InvalidSymbol, useCheckDepsUpdate, useDependentObj, usePreviousValue } from 'util/hooks';

test('usePreviousValue: doUpdate = false', () => {
  const a1 = { a: 1 };
  const a2 = { a: 1 };
  const a3 = { a: 1 };
  const renderResult = renderHook((prop) => usePreviousValue(prop, false), { initialProps: a1 });
  expect(renderResult.result.current).toBe(InvalidSymbol);
  renderResult.rerender(a1);
  expect(renderResult.result.current).toBe(a1);
  renderResult.rerender(a2);
  expect(renderResult.result.current).toBe(a1);
  renderResult.rerender(a3);
  expect(renderResult.result.current).toBe(a1);
});
test('usePreviousValue: doUpdate = true', () => {
  const a1 = { a: 1 };
  const a2 = { a: 1 };
  const a3 = { a: 1 };
  const renderResult = renderHook((prop) => usePreviousValue(prop), { initialProps: a1 });
  expect(renderResult.result.current).toBe(InvalidSymbol);
  renderResult.rerender(a2);
  expect(renderResult.result.current).toBe(a1);
  renderResult.rerender(a3);
  expect(renderResult.result.current).toBe(a2);
});
test('useCheckDepsUpdate', () => {
  const obj1 = {};
  const deps1 = [obj1, 1];
  const deps2 = deps1;
  expect(Object.is(deps1, deps2)).toBeTruthy();
  const deps3 = [{}, 1];
  expect(Object.is(deps1, deps3)).toBeFalsy();
  const deps4 = [{ a: 1 }, 1];
  expect(Object.is(deps1, deps4)).toBeFalsy();
  const renderResult = renderHook((prop) => useCheckDepsUpdate(prop), { initialProps: deps1 });
  expect(renderResult.result.current).toBeTruthy();
  renderResult.rerender(deps2);
  expect(renderResult.result.current).toBeFalsy();
  renderResult.rerender(deps3);
  expect(renderResult.result.current).toBeTruthy();
  deps3[0] = { a: 1 }; // mutate
  renderResult.rerender(deps3);
  expect(renderResult.result.current).toBeTruthy();
  renderResult.rerender(deps4);
  expect(renderResult.result.current).toBeTruthy();
  renderResult.rerender(deps4);
  expect(renderResult.result.current).toBeFalsy();
});
test('useDependentObj', () => {
  const fn = (b: { b: number }) => ({ a: b });
  let b = { b: 1 };
  const renderResult = renderHook((prop) => useDependentObj(fn(prop), [b]), { initialProps: b });
  const obj = renderResult.result.current;
  renderResult.rerender(b);
  expect(renderResult.result.current).toBe(obj);
  renderResult.rerender({ b: 2 });
  expect(renderResult.result.current).toBe(obj);
  b = { b: 2 };
  renderResult.rerender(b);
  const obj2 = renderResult.result.current;
  expect(obj2).not.toBe(obj);
  expect(obj2.a.b).toEqual(2);
  renderResult.rerender({ b: 1 });
  const obj3 = renderResult.result.current;
  expect(obj3).not.toBe(obj);
  expect(obj3.a).toBe(b);
});
