import React from 'react';
import {render,screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Evidence} from 'components/Evidence';
import {mEvidence} from 'models/mEvidence';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mEvidence|undefined>;

test('Evidence: eviIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Evidence eviID="evi_dummy" />);
  expect(screen.queryByTestId('evidence')).toBeNull();
});

test('Evidence: useSelectorでオブジェクトが帰ってきたら描画',()=>{
  const returned: mEvidence = {
    id: 'evi_0',
    author: 'Test Author',
    year: 2021,
    content: 'また、記事の回避国は、ルールの提供する発表独自た企業で著作する、その対象に有しば方針を補足あることを著作しれます。',
  }
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Evidence eviID="evi_dummy" />);
  expect(screen.getByText(returned.author as string)).toBeInTheDocument();
  expect(screen.getByText(returned.content as string)).toBeInTheDocument();
});
