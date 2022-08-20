import { mMatch } from "models/mMatch";

export const add_sides_and_parts = (match: mMatch, sides_and_parts: {[side: string]: string[]}) => {
  for(const side_name of Object.keys(sides_and_parts)) {
    const side_obj = match.addChild();
    side_obj?.upsert({ side: side_name });
    for(const part_name of sides_and_parts[side_name]) {
      const part_obj = side_obj?.addChild();
      part_obj?.upsert({ name: part_name });
    }
  }
};
