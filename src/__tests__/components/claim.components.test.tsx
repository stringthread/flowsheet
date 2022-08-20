import React from 'react';
import {render,screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {useSelector} from 'react-redux';
import {Claim} from 'components/Claim';
import {mClaim, mClaimSignature} from 'models/mClaim';

jest.mock('react-redux');
const useSelectorMock=useSelector as jest.Mock<mClaim|undefined>;

test('Claim: eviIDに該当がなければ生成されない',()=>{
  useSelectorMock.mockReturnValueOnce(undefined);
  render(<Claim claimID="claim_dummy" setSelected={(_)=>{}} />);
  expect(screen.queryByTestId('evidence')).toBeNull();
});

test('Evidence: useSelectorでオブジェクトが帰ってきたら描画',()=>{
  const returned: mClaim = {
    type_signature: mClaimSignature,
    parent: 'point_dummy',
    id_obj: 'claim_dummy',
    contents: 'テスト用のクレーム',
  }
  useSelectorMock.mockReturnValueOnce(returned);
  render(<Claim claimID="evi_dummy" setSelected={(_)=>{}} />);
  expect(screen.getByDisplayValue(returned.contents as string)).toBeInTheDocument();
});
