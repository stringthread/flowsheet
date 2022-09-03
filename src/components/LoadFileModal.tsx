import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useModal } from 'react-hooks-use-modal';
import { css } from '@emotion/react';
import { FaTimes } from 'react-icons/fa';
import { string_to_mMatch } from 'repositories/loader';
import { mMatch } from 'models/mMatch';

const loadFileWrapStyle = css`
  position: relative;
  width: 70vw;
  max-width: 600px;
  max-height: 80vh;
  padding: 24px 40px 16px;
  border-radius: 8px;
  background-color: white;
`;
const loadFileCloseStyle = css`
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
const loadFileTitleStyle = css`
  font-size: 1.5em;
`;
const loadFileDropzoneStyle = css`
  width: 80%;
  height: 8em;
  border: dashed 2px #888;
  border-radius: 4px;
  text-align: center;
  > span {
    line-height: 2;
  }
`;

export type useLoadFileModal = (setMatchID: React.Dispatch<React.SetStateAction<mMatch['id']>>)=>[React.VFC<{}>, ()=>void, ()=>void, boolean];
export const useLoadFileModal: useLoadFileModal = setMatchID=>{
  const [Modal, open, close, isModalOpen] = useModal('root', {
    preventScroll: true,
  });
  const onDrop = useCallback(async (acceptedFiles: File[])=>{
    if(acceptedFiles.length<1 || !(acceptedFiles[0] instanceof File)) return;
    const text = await acceptedFiles[0].text();
    const match = await string_to_mMatch(text);
    if(match===undefined) {
      alert('ファイルの読み込みに失敗しました');
      return;
    }
    setMatchID(match);
    close();
  }, [setMatchID]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  return [useCallback(()=>(
    <Modal>
      <div id="load-file-wrap" css={loadFileWrapStyle}>
        <div className="close" css={loadFileCloseStyle} onClick={close}>
          <FaTimes title="Close the load-file modal" size={32} />
        </div>
        <div className="title" css={loadFileTitleStyle}>フローシートファイル (*.dflow) の読み込み</div>
        <div {...getRootProps({className: "dropzone", css: loadFileDropzoneStyle})}>
          <span>{isDragActive?'ここにファイルをドロップ':'ファイルをドラッグ&ドロップ または ここをクリック'}</span>
          <input {...getInputProps({ name: "load-file-input", className: "file-input" })} />
        </div>
      </div>
    </Modal>
  ), [close, getRootProps, getInputProps, isDragActive, isModalOpen]), open, close, isModalOpen];
};
