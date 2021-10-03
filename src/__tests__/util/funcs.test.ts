import {reorder_array} from 'util/funcs';

test('reorder_arrayのテスト: funcなし',()=>{
  const initial: Array<number>=[0,1,2,3];
  const expected: typeof initial=[0,2,1,3];
  expect(reorder_array(initial,1,3)).toEqual(expected);
});
test('reorder_arrayのテスト: 同型funcあり',()=>{
  const initial: Array<number>=[0,1,2,3];
  const expected: typeof initial=[0,2,1,3];
  expect(reorder_array(initial,0,2,(e,t)=>e===t+1)).toEqual(expected);
});
test('reorder_arrayのテスト: 別型funcあり',()=>{
  const initial: Array<string>=['0','1','2','3'];
  const expected: typeof initial=['0','2','1','3'];
  expect(reorder_array(initial,1,3,(e,t)=>e===t.toString())).toEqual(expected);
});
test('reorder_arrayのテスト: 末尾挿入',()=>{
  const initial: Array<number>=[0,1,2,3];
  const expected: typeof initial=[0,2,3,1];
  expect(reorder_array(initial,1,null)).toEqual(expected);
});
