import '@testing-library/jest-dom/extend-expect';
import { render, screen, within } from '@testing-library/react';
import { Part } from 'components/Part';
import { mPart, mPartSignature } from 'models/mPart';
import React from 'react';
import { useSelector } from 'react-redux';

jest.mock('react-redux');
const useSelectorMock = useSelector as jest.Mock<mPart | undefined>;
jest.mock('components/Point', () => ({
  Point: () => <div data-testid='point'></div>,
}));

test('Part: partIDに該当がなければ生成されない', () => {
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Part partID='part_dummy' setSelected={(_) => {}} />);
  expect(screen.queryByTestId('part')).toBeNull();
});

test('Part: contentsがないときパート名だけ描画', () => {
  const returned: mPart = {
    type_signature: mPartSignature,
    parent: 'side_dummy',
    id: 'part_0',
    name: '1AC',
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Part partID='part_0' setSelected={(_) => {}} />);
  const partElement = screen.getByTestId('part');
  expect(partElement).toBeInTheDocument();
  expect(screen.getByText(returned.name as string)).toBeInTheDocument();
  expect(screen.queryByTestId('point')).toBeNull();
});

test('Part: contentsがあるとき', () => {
  const returned: mPart = {
    type_signature: mPartSignature,
    parent: 'side_dummy',
    id: 'part_0',
    name: '1AC',
    contents: ['point_0'],
  };
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Part partID='part_0' setSelected={(_) => {}} />);
  expect(screen.getByTestId('part')).toBeInTheDocument();
  expect(screen.getByTestId('point')).toBeInTheDocument();
});
