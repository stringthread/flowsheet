import { string_to_mMatch } from "repositories/loader";
import { store } from "stores";

test('string_to_mMatch', async ()=>{
  const xml = `
  <?xml version="1.0"?>
  <root>
    <meta>
      <topic>Topic of the round</topic>
      <members part="AC">member1</members>
      <members part="AQ">member2</members>
      <members part="1AR">member1</members>
    </meta>
    <match id="match_0">
      <side side="Aff" id="side_0">
        <part name="AC" id="part_0">
          <point id="point_1" numbering="1">
            <point id="point_2" numbering="a">
            </point>
            <claim id="claim_0">claim</claim>
            <evidence id="evi_0" author="author">evi contents</evidence>
          </point>
        </part>
        <part name="1NR" id="part_1">
          <point id="point_3" rebut_to="point_1">
            <claim id="claim_1">rebuttal claim</claim>
          </point>
        </part>
      </side>
      <side side="Neg" id="side_1"></side>
    </match>
  </root>
  `;
  const result_id = await string_to_mMatch(xml);
  expect(result_id).toBeDefined();
  if(result_id===undefined) return;
  const store_state = store.getState();
  const match = store_state.match.entities[result_id];
  expect(match).toBeDefined();
  if(match===undefined) return;
  expect(match.topic).toEqual('Topic of the round');
  expect(match.member).toMatchObject({ 'AC': 'member1', 'AQ': 'member2', '1AR': 'member1', });
  expect(match.contents).toBeDefined();
  if(match.contents===undefined) return;
  expect(match.contents).toHaveLength(2);
  const side_0 = store_state.side.entities[match.contents[0]];
  expect(side_0).toBeDefined();
  if(side_0===undefined) return;
  expect(side_0.parent).toEqual(match.id);
  expect(side_0.side).toEqual('Aff');
  expect(side_0.contents).toBeDefined;
  if(side_0.contents===undefined) return;
  expect(side_0.contents).toHaveLength(2);
  const part_0 = store_state.part.entities[side_0.contents[0]];
  expect(part_0).toBeDefined();
  if(part_0===undefined) return;
  expect(part_0.parent).toEqual(side_0.id);
  expect(part_0.name).toEqual('AC');
  expect(part_0.contents).toBeDefined();
  if(part_0.contents===undefined) return;
  expect(part_0.contents).toHaveLength(1);
  const point_1 = store_state.point.entities[part_0.contents[0]];
  expect(point_1).toBeDefined();
  if(point_1===undefined) return;
  expect(point_1.parent).toEqual(part_0.id);
  expect(point_1.numbering).toEqual("1");
  expect(point_1.rebut_to).toBeUndefined();
  expect(point_1.contents).toBeDefined();
  if(point_1.contents===undefined) return;
  expect(point_1.contents).toHaveLength(3);
  const point_2 = store_state.point.entities[point_1.contents[0]];
  expect(point_2).toBeDefined();
  if(point_2===undefined) return;
  expect(point_2.parent).toEqual(point_1.id);
  const claim_0 = store_state.claim.entities[point_1.contents[1]];
  expect(claim_0).toBeDefined();
  if(claim_0===undefined) return;
  expect(claim_0.parent).toEqual(point_1.id);
  expect(claim_0.contents).toEqual('claim');
  const evi_0 = store_state.evidence.entities[point_1.contents[2]];
  expect(evi_0).toBeDefined;
  if(evi_0===undefined) return;
  expect(evi_0.parent).toEqual(point_1.id);
  expect(evi_0.about_author).toBeUndefined();
  expect(evi_0.author).toEqual('author');
  expect(evi_0.year).toBeUndefined();
  expect(evi_0.contents).toEqual('evi contents');
  const part_1 = store_state.part.entities[side_0.contents[1]];
  expect(part_1).toBeDefined();
  if(part_1===undefined) return;
  expect(part_1.parent).toEqual(side_0.id);
  expect(part_1.name).toEqual('1NR');
  expect(part_1.contents).toBeDefined();
  if(part_1.contents===undefined) return;
  expect(part_1.contents).toHaveLength(1);
  const point_3 = store_state.point.entities[part_1.contents[0]];
  expect(point_3).toBeDefined();
  if(point_3===undefined) return;
  expect(point_3.rebut_to).toEqual(point_1.id);
});