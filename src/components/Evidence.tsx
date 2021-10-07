import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {RootState} from 'stores/index';
import {mEvidence} from 'models/mEvidence';
import {evidence_selectors,evidence_slice} from 'stores/slices/evidence';
import {TextInput,TextArea} from './TextInput';

type HeaderProps = {
  parentID: string;
  metadata: Omit<mEvidence, 'content'>;
}

const EvidenceHeader: React.VFC<HeaderProps> = (props)=>{
  const dispatch=useDispatch();
  return (
    <div className="evidenceHeader">
      <TextInput
        className="evidenceAbout"
        value={props.metadata.about_author??''}
        onBlur={(e)=>{
          dispatch(evidence_slice.actions.upsertOne({
            id: props.parentID,
            about_author: e.currentTarget.value,
          }));
        }}
      />
      <TextInput
        className="evidenceAuthor"
        value={props.metadata.author??''}
        onBlur={(e)=>{
          dispatch(evidence_slice.actions.upsertOne({
            id: props.parentID,
            author: e.currentTarget.value,
          }));
        }}
      />
      <TextInput
        className="evidenceYear"
        value={props.metadata.year?.toString()??''}
        onBlur={(e)=>{
          dispatch(evidence_slice.actions.upsertOne({
            id: props.parentID,
            year: e.currentTarget.value,
          }));
        }}
      />
    </div>
);
};

type Props = {
  eviID: string;
}

export const Evidence: React.VFC<Props> = (props)=>{
  const dispatch=useDispatch();
  const evidence=useSelector((state:RootState)=>evidence_selectors.selectById(state,props.eviID));
  if(evidence===undefined) return null;
  return (
    <div className='evidence' data-testid='evidence'>
      <EvidenceHeader parentID={props.eviID} metadata={evidence}/>
      <TextArea
        className="evidenceContent"
        value={evidence.content}
        onBlur={(e)=>{
          dispatch(evidence_slice.actions.upsertOne({
            id: props.eviID,
            content: e.currentTarget.value,
          }));
        }}
      />
    </div>
  );
};
