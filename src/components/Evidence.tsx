import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'stores/index';
import {mEvidence} from 'models/mEvidence';
import {evidence_selectors} from 'stores/slices/evidence';

type HeaderProps = {
  metadata: Omit<mEvidence, 'content'>;
}

const EvidenceHeader: React.VFC<HeaderProps> = (props)=>(
  <div className="evidenceHeader">
    <span className="evidenceAbout">{props.metadata.about_author??''}</span>
    <span className="evidenceAuthor">{props.metadata.author??''}</span>
    <span className="evidenceYear">{props.metadata.year??''}</span>
  </div>
);

type Props = {
  eviID: string;
}

export const Evidence: React.VFC<Props> = (props)=>{
  const evidence=useSelector((state:RootState)=>evidence_selectors.selectById(state,props.eviID));
  if(evidence===undefined) return null;
  return (
    <div className='evidence'>
      <EvidenceHeader metadata={evidence}/>
      <div className="evidenceContent">{evidence.content}</div>
    </div>
  );
};
