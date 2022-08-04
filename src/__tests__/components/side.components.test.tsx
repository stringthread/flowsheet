import React from 'react';
import {render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Side} from 'components/Side';
import {mSide, __RewireAPI__} from 'models/mSide';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mSide|undefined>;
jest.mock('components/Part',()=>({
  Part: ()=>(<div data-testid="part"></div>)
}));
const mSideSymbol=__RewireAPI__.__get__('mSideSymbol');

test('Side: sideIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Side sideID="side_dummy" setSelected={(_)=>{}} />);
  expect(screen.queryByTestId('side')).toBeNull();
});

test('Side: contentsがないときパート名だけ描画',()=>{
  const returned: mSide = {
    typesigniture: mSideSymbol,
    parent: 'match_dummy',
    id: 'side_0',
    side: 'aff',
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Side sideID="side_0" setSelected={(_)=>{}} />);
  const sideElement=screen.getByTestId('side')
  expect(sideElement).toBeInTheDocument();
  expect(screen.getByText(returned.side as string)).toBeInTheDocument();
  expect(screen.queryByTestId('part')).toBeNull();
});

test('Side: contentsがあるとき',()=>{
  const returned: mSide = {
    typesigniture: mSideSymbol,
    parent: 'match_dummy',
    id: 'side_0',
    side: 'aff',
    contents: ['part_0']
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Side sideID="side_0" setSelected={(_)=>{}} />);
  expect(screen.getByTestId('side')).toBeInTheDocument();
  expect(screen.getByTestId('part')).toBeInTheDocument();
});
