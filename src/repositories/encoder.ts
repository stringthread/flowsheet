import { encodeMatch } from './match';
import { saveXML } from './textfileSaver';
import { mMatch } from 'models/mMatch';
import { create } from 'xmlbuilder2';

export const encode = (matchId: mMatch['id']) => {
  const xml = create({
    root: encodeMatch(matchId),
  });
  return xml.end({ prettyPrint: true });
};
export const saveMatch = (matchId: mMatch['id'], fileName: string | undefined) => {
  saveXML(encode(matchId), fileName ?? 'flowsheet.dflow');
};
