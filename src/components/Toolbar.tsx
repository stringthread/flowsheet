import { ReactComponent as AddClaimSVG } from './images/AddClaim.svg';
import { ReactComponent as AddEvidenceSVG } from './images/AddEvidence.svg';
import { ReactComponent as AddPointSVG } from './images/AddPoint.svg';
import { ReactComponent as AddPointChildSVG } from './images/AddPointChild.svg';
import { ReactComponent as AddPointParentSVG } from './images/AddPointParent.svg';
import { ReactComponent as AddPointToPartSVG } from './images/AddPointToPart.svg';
import { ReactComponent as DrawLineSVG } from './images/DrawLine.svg';
import { css } from '@emotion/react';
import { SyntheticEvent, useCallback, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

type ToolBarProps = {
  operations: {
    add_claim: (e?: Event | SyntheticEvent) => void;
    add_evidence: (e?: Event | SyntheticEvent) => void;
    add_point: (e?: Event | SyntheticEvent) => void;
    add_point_child: (e?: Event | SyntheticEvent) => void;
    add_point_to_parent: (e?: Event | SyntheticEvent) => void;
    add_point_to_part: (e?: Event | SyntheticEvent) => void;
    draw_line: (e?: Event | SyntheticEvent) => void;
  };
};

const wrapStyle = css`
  position: fixed;
  width: 5em;
  right: 2em;
  bottom: 1em;
  padding: 1em;
  display: flex;
  justify-content: center;
  padding-top: 2em;
  border-radius: 0.5em;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: white;
  overflow: hidden;
`;

const topBarStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1em;
  overflow: hidden;
  display: flex;
  justify-content: center;
  color: #3f3f3f;
  background-color: #dfdfdf;
  &:hover {
    background-color: #ccc;
  }
`;

const buttonsWrapStyle = css`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const buttonStyle = css`
  width: 3em;
  height: 3em;
  padding: 0.5em;
  border-radius: 0.5em;
  color: #3f3f3f;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: lightgray;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`;

export const ToolBar = ({ operations }: ToolBarProps): JSX.Element => {
  const [isToolBarOpen, setIsToolBarOpen] = useState(true);
  return (
    <div className='ToolbarWrap' css={wrapStyle}>
      <div
        css={topBarStyle}
        onClick={useCallback(() => {
          setIsToolBarOpen(!isToolBarOpen);
        }, [isToolBarOpen])}
      >
        {isToolBarOpen ? <FaAngleDown /> : <FaAngleUp />}
      </div>
      {isToolBarOpen ? (
        <div css={buttonsWrapStyle}>
          <AddClaimSVG onClick={operations.add_claim} css={buttonStyle} />
          <AddEvidenceSVG onClick={operations.add_evidence} css={buttonStyle} />
          <AddPointSVG onClick={operations.add_point} css={buttonStyle} />
          <AddPointChildSVG onClick={operations.add_point_child} css={buttonStyle} />
          <AddPointParentSVG onClick={operations.add_point_to_parent} css={buttonStyle} />
          <AddPointToPartSVG onClick={operations.add_point_to_part} css={buttonStyle} />
          <DrawLineSVG onClick={operations.draw_line} css={buttonStyle} />
        </div>
      ) : (
        <span>Tools</span>
      )}
    </div>
  );
};
