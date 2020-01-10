module Universe = (val Snarky_universe.default());
open! Universe.Impl;
open! Universe;

let input = InputSpec.[(module Field), (module Hash)];

module Witness = Field;

//module Witness = {
//  type t = (Field.t, MerkleTree.MembershipProof.t);
//
//  module Constant = {
//    [@deriving yojson]
//    type t = (Field.Constant.t, MerkleTree.MembershipProof.Constant.t);
//  }
//
//  let typ = Typ.tuple2(Field.typ, MerkleTree.MembershipProof.typ(~depth));
//}

let main = (prevWork: Witness.t, work: Field.t, hash, ()) =>{
  let workBits = Field.toBits(~length=32, work);
  let prevWorkBits = Field.toBits(~length=32, prevWork);
  Bool.assertTrue(Integer.(==)(Integer.add(Integer.ofBits(prevWorkBits), Integer.ofInt(1)), Integer.ofBits(workBits)));
  Field.assertEqual(Hash.hash([|work|]), hash);
}

let () =
  runMain(input, (module Witness), main);
//46:let is_valid = verify proof (Keypair.vk keypair) (public_input ()) my_list total
