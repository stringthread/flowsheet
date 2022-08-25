import { saveAs } from 'file-saver';

export const saveText = (content: string, filename: string, mimetype: string):void => {
  const blob = new Blob([content], {type: mimetype});
  saveAs(blob, filename);
};

export const saveXML = (content: string, filename: string): void => saveText(content, filename, 'application/xml;charset=utf-8');
