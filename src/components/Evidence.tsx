import React,{useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {css} from '@emotion/react';
import {RootState} from 'stores/index';
import {mEvidence} from 'models/mEvidence';
import {evidence_selectors,evidence_slice} from 'stores/slices/evidence';
import {StretchTextInput,StretchTextArea} from './TextInput';
import {typeSelected} from './App';

type HeaderProps = {
  parentID: string;
  metadata: Omit<mEvidence, 'content'>;
}

const styleEvidenceHeadContent=css`
  display: inline-block;
  min-width: 2em;
  width: 1em;
  height: 1em;
  flex-grow: 0;
  flex-shrink: 0;
  &:not(:placeholder-shown):not(:focus){
    padding-right: 0;
    padding-left: 0;
    border: none;
  }
`;

const styleEvidenceHeader=css`
  border-bottom: solid 1px black;
  &>*:not(:last-child)::after{
    content: ',';
    display: inline;
    padding: 0 0.2em;
  }
`;

const EvidenceHeader: React.VFC<HeaderProps> = (props)=>{
  const dispatch=useDispatch();
  return (
    <div className="evidenceHeader" css={styleEvidenceHeader}>
      <span className="evidenceAbout">
        <StretchTextInput
          value={props.metadata.about_author??''}
          onBlur={(e)=>{
            dispatch(evidence_slice.actions.upsertOne({
              id: props.parentID,
              about_author: e.currentTarget.value,
            }));
          }}
          css={styleEvidenceHeadContent}
        />
      </span>
      <span className="evidenceAuthor">
        <StretchTextInput
          className="evidenceAuthor"
          value={props.metadata.author??''}
          onBlur={(e)=>{
            dispatch(evidence_slice.actions.upsertOne({
              id: props.parentID,
              author: e.currentTarget.value,
            }));
          }}
          css={styleEvidenceHeadContent}
        />
      </span>
      <span className="evidenceYear">
        <StretchTextInput
          className="evidenceYear"
          value={props.metadata.year?.toString()??''}
          onBlur={(e)=>{
            dispatch(evidence_slice.actions.upsertOne({
              id: props.parentID,
              year: e.currentTarget.value,
            }));
          }}
          css={styleEvidenceHeadContent}
        />
      </span>
    </div>
);
};

type Props = {
  eviID: string;
  setSelected: (_:typeSelected)=>void;
}

const styleEvidence=css`
  width: 100%;
`;

const styleEvidenceContent=css`
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  border: none !important;
  border-left: solid 1px black !important;
  border-bottom: solid 1px black !important;
  padding-left: 0.5em;
  padding-bottom: 0.5em;
  margin-top: 0.5em;
`;

export const Evidence: React.VFC<Props> = (props)=>{
  const dispatch=useDispatch();
  const evidence=useSelector((state:RootState)=>evidence_selectors.selectById(state,props.eviID));
  const onClick=useCallback((e: React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
    props.setSelected([props.eviID,'evidence']);
  },[props.eviID,props.setSelected]);
  if(evidence===undefined) return null;
  return (
    <div className='evidence' data-testid='evidence' onClick={onClick} css={styleEvidence}>
      <EvidenceHeader parentID={props.eviID} metadata={evidence}/>
      <StretchTextArea
        className="evidenceContent"
        value={evidence.content}
        onBlur={(e)=>{
          dispatch(evidence_slice.actions.upsertOne({
            id: props.eviID,
            content: e.currentTarget.value,
          }));
        }}
        css={styleEvidenceContent}
      />
    </div>
  );
};
