import { css } from '@emotion/react';
import React, { useCallback, useEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { FaTimes } from 'react-icons/fa';
import YouTube from 'react-youtube';

const wrapStyle = css`
  position: relative;
  width: 70vw;
  max-width: 600px;
  max-height: 80vh;
  padding: 24px 40px 16px;
  border-radius: 8px;
  background-color: white;
  & iframe {
    width: 100%;
  }
`;
const closeStyle = css`
  display: inline-block;
  position: absolute;
  width: 32px;
  right: 8px;
  top: 8px;
  cursor: pointer;
  color: #000;
  &:hover {
    color: #333;
  }
`;

export type useTutorialModal = () => [React.VFC<{}>, () => void, () => void, boolean];
export const useTutorialModal: useTutorialModal = () => {
  const [Modal, open, close, isModalOpen] = useModal('root', {
    preventScroll: true,
  });
  return [
    useCallback(
      () => (
        <Modal>
          <div id='help-wrap' css={wrapStyle}>
            <div css={closeStyle} onClick={close}>
              <FaTimes title='Close the help modal' size={32} />
            </div>
            <YouTube videoId='Xe7SfJouB7M' onEnd={() => setTimeout(close, 3000)} />
          </div>
        </Modal>
      ),
      [Modal, close],
    ),
    open,
    close,
    isModalOpen,
  ];
};
