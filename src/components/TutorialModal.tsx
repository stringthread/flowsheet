import { css } from '@emotion/react';
import React, { useCallback, useEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { FaTimes } from 'react-icons/fa';
import YouTube from 'react-youtube';

const wrapStyle = css`
  position: relative;
  width: 70vw;
  height: 70vh;
  max-width: 1000px;
  padding: 24px 40px 16px;
  border-radius: 8px;
  background-color: white;
  & > div:not(:first-of-type) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & iframe {
    width: 90%;
    height: 90%;
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
  const videoOptions = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
      loop: 0,
    },
  };
  useEffect(() => open(), []);
  return [
    useCallback(
      () => (
        <Modal>
          <div id='help-wrap' css={wrapStyle}>
            <div css={closeStyle} onClick={close}>
              <FaTimes title='Close the help modal' size={32} />
            </div>
            <YouTube videoId='Xe7SfJouB7M' onEnd={() => setTimeout(close, 3000)} opts={videoOptions} />
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
