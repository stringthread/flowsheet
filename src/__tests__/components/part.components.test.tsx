import React from 'react';
import {render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Part} from 'components/Part';
import {mPart} from 'models/mPart';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mPart|undefined>;
jest.mock('components/Point',()=>({
  Point: ()=>(<div data-testid="point"></div>)
}));

test('Part: partIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Part partID="part_dummy" />);
  expect(screen.queryByTestId('part')).toBeNull();
});

test('Part: contentsがないときパート名だけ描画',()=>{
  const returned: mPart = {
    id: 'part_0',
    name: '1AC',
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Part partID="part_0" />);
  const partElement=screen.getByTestId('part')
  expect(partElement).toBeInTheDocument();
  expect(screen.getByText(returned.name as string)).toBeInTheDocument();
  expect(screen.queryByTestId('point')).toBeNull();
});

test('Part: contentsがあるとき',()=>{
  const returned: mPart = {
    id: 'part_0',
    name: '1AC',
    contents: ['point_0']
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Part partID="part_0" />);
  expect(screen.getByTestId('part')).toBeInTheDocument();
  expect(screen.getByTestId('point')).toBeInTheDocument();
});
