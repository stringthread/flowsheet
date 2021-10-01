import React from 'react';
import {mEvidence} from 'models/mEvidence'

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
  evi: mEvidence;
}

export const Evidence: React.VFC<Props> = (props)=>(
  <div className='evidence'>
    <EvidenceHeader metadata={props.evi}/>
    <div className="evidenceContent">{props.evi.content}</div>
  </div>
);
