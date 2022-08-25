import { mMatch } from "models/mMatch"
import { create } from "xmlbuilder2"
import { encodeMatch } from "./match"
import { saveXML } from "./textfileSaver";

export const encode = (matchId: mMatch['id']) => {
  const xml = create({
    root: encodeMatch(matchId),
  });
  return xml.end({ prettyPrint: true });
};
export const saveMatch = (matchId: mMatch['id']) => {
  saveXML(encode(matchId), 'flowsheet.dflow');
}
