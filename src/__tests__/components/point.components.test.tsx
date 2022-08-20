import React from 'react';
import {render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Point} from 'components/Point';
import {mPoint, mPointSignature} from 'models/mPoint';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mPoint|undefined>;
jest.mock('components/Evidence',()=>({
  Evidence: ()=>(<div data-testid="evidence"></div>)
}));

test('Point: pointIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Point pointID="point_dummy" setSelected={(_)=>{}} />);
  expect(screen.queryByTestId('point')).toBeNull();
});

test('Point: contentsがないときナンバリングだけ描画',()=>{
  const returned_1: mPoint = {
    type_signature: mPointSignature,
    parent: 'part_dummy',
    id_obj: 'point_0',
    numbering: 'a'
  };
  useSelectorMock.mockReturnValueOnce(returned_1).mockReturnValue(undefined);
  render(<Point pointID="point_0" setSelected={(_)=>{}} />);
  const pointElement=screen.getByTestId('point')
  expect(pointElement).toBeInTheDocument();
  expect(pointElement.children[1].childElementCount).toBe(0);
});

test('Point: contentsがevidenceのみのとき',()=>{
  const returned: mPoint = {
    type_signature: mPointSignature,
    parent: 'part_dummy',
    id_obj: 'point_0',
    numbering: 'a',
    contents: ['evi_0']
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Point pointID="point_0" setSelected={(_)=>{}} />);
  expect(screen.getByTestId('point')).toBeInTheDocument();
  expect(screen.getByTestId('evidence')).toBeInTheDocument();
});

test('Point: contentsがpointのとき',()=>{
  const returned_1: mPoint = {
    type_signature: mPointSignature,
    parent: 'part_dummy',
    id_obj: 'point_0',
    numbering: 'a',
    contents: ['point_0']
  };
  const returned_2: mPoint = {
    type_signature: mPointSignature,
    parent: 'point_0',
    id_obj: 'point_1',
    contents: ['evi_0']
  };
  useSelectorMock.mockReturnValueOnce(returned_1).mockReturnValueOnce(returned_2);
  render(<Point pointID="point_0" setSelected={(_)=>{}} />);
  expect(screen.getAllByTestId('point')).toHaveLength(2);
  expect(screen.getByTestId('evidence')).toBeInTheDocument();
});

test('Point: contentsが複数のとき',()=>{
  const returned_1: mPoint = {
    type_signature: mPointSignature,
    parent: 'part_dummy',
    id_obj: 'point_0',
    numbering: 'a',
    contents: ['point_1','evi_1']
  };
  const returned_2: mPoint = {
    type_signature: mPointSignature,
    parent: 'point_0',
    id_obj: 'point_1',
    contents: ['claim_0']
  };
  useSelectorMock.mockReturnValueOnce(returned_1).mockReturnValueOnce(returned_2);
  render(<Point pointID="point_0" setSelected={(_)=>{}} />);
  expect(screen.getAllByTestId('point')[0].children[1].children).toHaveLength(2);
});
