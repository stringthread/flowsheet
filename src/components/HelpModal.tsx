import { css } from '@emotion/react';
import React, { useCallback } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { FaTimes } from 'react-icons/fa';

const wrapStyle = css`
  position: relative;
  width: 70vw;
  max-width: 600px;
  max-height: 80vh;
  padding: 24px 40px 16px;
  border-radius: 8px;
  background-color: white;
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
const titleStyle = css`
  font-size: 1.5em;
`;
const shortcutTableStyle = css`
  & > tr > td {
    padding: 0.5em;
    &:first-of-type {
      text-align: right;
    }
  }
  & .key {
    margin: 0 0.5em;
    padding: 0.2em 0.5em;
    background-color: #666;
    color: white;
    border-radius: 0.2em;
  }
`;

export type useHelpModal = () => [React.VFC<{}>, () => void, () => void, boolean];
export const useHelpModal: useHelpModal = () => {
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
            <div css={titleStyle}>ヘルプ</div>
            <div>
              <section>
                <h2>ショートカットキーの一覧</h2>
                <table css={shortcutTableStyle}>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>C</span>
                    </td>
                    <td>現在の位置にクレームを追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>E</span>
                    </td>
                    <td>現在の位置にエビデンスを追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>P</span>
                    </td>
                    <td>現在の位置に論点を追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>Ctrl</span>
                      <span className='key'>P</span>
                    </td>
                    <td>現在の子要素に論点を追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>Shift</span>
                      <span className='key'>P</span>
                    </td>
                    <td>現在の親要素に論点を追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>Ctrl</span>
                      <span className='key'>Shift</span>
                      <span className='key'>P</span>
                    </td>
                    <td>パート直下に論点を追加</td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Alt</span>
                      <span className='key'>L</span>
                    </td>
                    <td>
                      反駁先の線を追加
                      <br />
                      （反駁先を選択すれば確定）
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className='key'>Esc</span>
                    </td>
                    <td>反駁・全画面表示などを終了</td>
                  </tr>
                </table>
              </section>
            </div>
          </div>
        </Modal>
      ),
      [close, isModalOpen],
    ),
    open,
    close,
    isModalOpen,
  ];
};
