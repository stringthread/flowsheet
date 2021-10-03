import React from 'react';
import {render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Point} from 'components/Point';
import {mPoint} from 'models/mPoint';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mPoint|undefined>;
jest.mock('components/Evidence',()=>({
  Evidence: ()=>(<div data-testid="evidence"></div>)
}));

test('Point: pointIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Point pointID="point_dummy" />);
  expect(screen.queryByTestId('point')).toBeNull();
});

test('Point: contentsがないときナンバリングだけ描画',()=>{
  const returned: mPoint = {
    id: 'point_0',
    numbering: 'a'
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Point pointID="point_0" />);
  const pointElement=screen.getByTestId('point')
  expect(pointElement).toBeInTheDocument();
  expect(within(pointElement).getAllByText('')).toHaveLength(1);
});

test('Point: contentsがevidenceのみのとき',()=>{
  const returned: mPoint = {
    id: 'point_0',
    numbering: 'a',
    contents: [['evi_0',false]]
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Point pointID="point_0" />);
  expect(screen.getByTestId('point')).toBeInTheDocument();
  expect(screen.getByTestId('evidence')).toBeInTheDocument();
});

test('Point: contentsがpointのとき',()=>{
  const returned_1: mPoint = {
    id: 'point_0',
    numbering: 'a',
    contents: [['point_0',true]]
  };
  const returned_2: mPoint = {
    id: 'point_1',
    contents: [['evi_0',false]]
  };
  useSelectorMock.mockReturnValueOnce(returned_1).mockReturnValueOnce(returned_2);
  render(<Point pointID="point_0" />);
  expect(screen.getAllByTestId('point')).toHaveLength(2);
  expect(screen.getByTestId('evidence')).toBeInTheDocument();
});

test('Point: contentsがClaimのとき',()=>{
  const returned: mPoint = {
    id: 'point_0',
    numbering: 'a',
    contents: 'A test claim'
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Point pointID="point_0" />);
  expect(screen.getByText(returned.contents as string)).toBeInTheDocument();
});

test('Point: contentsが複数のとき',()=>{
  const returned_1: mPoint = {
    id: 'point_0',
    numbering: 'a',
    contents: [['point_1',true],['evi_1',false]]
  };
  const returned_2: mPoint = {
    id: 'point_1',
    contents: 'test claim 1'
  };
  useSelectorMock.mockReturnValueOnce(returned_1).mockReturnValueOnce(returned_2);
  render(<Point pointID="point_0" />);
  expect(screen.getAllByTestId('point')[0].children).toHaveLength(3);
});
