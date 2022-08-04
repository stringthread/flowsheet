import React from 'react';
import {render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Match} from 'components/Match';
import {mMatch, __RewireAPI__} from 'models/mMatch';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mMatch|undefined>;
jest.mock('components/Side',()=>({
  Side: ()=>(<div data-testid="side"></div>)
}));
const mMatchSymbol=__RewireAPI__.__get__('mMatchSymbol');

test('Match: matchIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Match matchID="match_dummy" setSelected={(_)=>{}} />);
  expect(screen.queryByTestId('match')).toBeNull();
});

test('Match: contentsがないときパート名だけ描画',()=>{
  const returned: mMatch = {
    typesigniture: mMatchSymbol,
    id: 'match_0',
    topic: '一院制',
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Match matchID="match_0" setSelected={(_)=>{}} />);
  const matchElement=screen.getByTestId('match')
  expect(matchElement).toBeInTheDocument();
  expect(screen.getByTestId('matchHeader')).toBeInTheDocument();
  expect(screen.getByText(returned.topic as string)).toBeInTheDocument();
  expect(screen.queryByTestId('side')).toBeNull();
});

test('Match: contentsがあるとき',()=>{
  const returned: mMatch = {
    typesigniture: mMatchSymbol,
    id: 'match_0',
    topic: '一院制',
    contents: ['side_0']
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Match matchID="match_0" setSelected={(_)=>{}} />);
  expect(screen.getByTestId('match')).toBeInTheDocument();
  expect(screen.getByTestId('side')).toBeInTheDocument();
});
