const { bn128 } = require('snarkyjs-crypto');
const Snarky = require('snarkyjs');
const snarky = new Snarky("./ex_preimage.exe");

const preImage = bn128.Field.ofInt(5);
// const statement = bn128.Hash.hash([ preImage ]);

const statement = [bn128.Field.ofInt(43), bn128.Hash.hash([ bn128.Field.ofInt(43) ])];

const witness = bn128.Field.ofInt(42);
// const statement = [bn128.Field.ofInt(100), bn128.Hash.hash()];

snarky.prove({
  statement: statement,
  witness: witness
}).then((proof) => {
  console.log("Created proof:\n" + proof + "\n");
  return snarky.verify({
    "statement": [ statement ],
    "proof": proof
  });
}, console.log).then((verified) => {
  console.log("Was the proof verified? " + verified);
  if (verified) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, () => { process.exit(1); });
