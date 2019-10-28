#!/usr/bin/env node
const fs = require("fs");

/* Drop the first 2 arguments from `/usr/bin/node path/to/this/file.js ...` */
var arguments = process.argv.slice(2);

function fail(err) {
  if (err) {
    console.log("Error: " + err.message);
    process.exit(1);
  };
};

if (arguments.length === 0) {
  console.log("Expected an argument.\nPossible commands are:\n  init\t\tInitialize a js_snarky project");
  process.exit(1);
}
else if (arguments[0] === "init") {
/*****************************************************************************
 * dune-project
 *****************************************************************************/
  /* Create dune-project file so that `dune build` doesn't walk out of this
   * directory. */
  if (!fs.existsSync("dune-project")) {
    const dune_project = "(lang dune 1.6)\n";
    fs.writeFile("dune-project", dune_project, fail);
  }
  let mk_src = function(err) {
    fail(err);
/*****************************************************************************
 * src/dune
 *****************************************************************************/
    if (!fs.existsSync("src/dune")) {
      const dune = `(executable
 (name js_snarky_project)
 (modes native)
 (libraries core_kernel snarky snarky_universe)
 (preprocess (pps ppx_snarky ppx_jane ppx_deriving ppx_deriving_yojson)))
`;
      fs.writeFile("src/dune", dune, fail);
    }
/*****************************************************************************
 * src/js_snarky_project.ml.ignore
 *****************************************************************************/
    if (!fs.existsSync("src/js_snarky_project.ml.ignore")) {
      const main = `
module rec Universe :
  (Snarky_universe.Intf.S with type Impl.prover_state = Prover_state.t) =
  Snarky_universe.Default (Prover_state) ()

and Prover_state : sig
  type t = Universe.Field.Constant.t [@@deriving yojson]
end = struct
  type t = Universe.Field.Constant.t [@@deriving yojson]
end

open! Universe.Impl
open! Universe

(* Each input needs a jsonifier and a type *)
let input : _ InputSpec.t = ([(module Field); (module Bool)] : _ InputSpec.t)

(* Test function, asserts that [Field.( * )] and [Field.inv] commute. *)
let assert_inverse_square_commutes field_elt =
  let field_elt_2 =
    let open Field in
    field_elt * field_elt
  in
  let field_elt_inv = Field.invert field_elt in
  let field_elt_inv_2 =
    let open Field in
    field_elt_inv * field_elt_inv
  in
  let product =
    let open Field in
    field_elt_2 * field_elt_inv_2
  in
  Field.assertEqual product Field.one

(* The main function. This is executed to build a proof *)
let main field_elt _bit () =
  assert_inverse_square_commutes field_elt ;
  let witness = exists Field.typ ~compute:(fun () -> As_prover.get_state ()) in
  assert_inverse_square_commutes witness

let () = InputSpec.run_main input Prover_state.of_yojson main
`;
      fs.writeFile("src/js_snarky_project.ml.ignore", main, fail);
    }
/*****************************************************************************
 * src/js_snarky_project.re
 *****************************************************************************/
    if (!fs.existsSync("src/js_snarky_project.re")) {
      const main = `module rec Universe:
  Snarky_universe.Intf.S with type Impl.prover_state = Prover_state.t =
  Snarky_universe.Default(
    Prover_state,
    {},
  )
and Prover_state: {
  [@deriving yojson]
  type t = Universe.Field.Constant.t;
} = {
  [@deriving yojson]
  type t = Universe.Field.Constant.t;
};

open! Universe.Impl;
open! Universe;

/* Each input needs a jsonifier and a type */
let input: InputSpec.t(_) = (
  [(module Field), (module Bool)]: InputSpec.t(_)
);

/* Test function, asserts that [Field.( * )] and [Field.inv] commute. */
let assert_inverse_square_commutes = field_elt => {
  let field_elt_2 = Field.(field_elt * field_elt);
  let field_elt_inv = Field.invert(field_elt);
  let field_elt_inv_2 = Field.(field_elt_inv * field_elt_inv);
  let product = Field.(field_elt_2 * field_elt_inv_2);
  Field.assertEqual(product, Field.one);
};

/* The main function. This is executed to build a proof */
let main = (field_elt, _bit, ()) => {
  assert_inverse_square_commutes(field_elt);
  let witness = exists(Field.typ, ~compute=() => {As_prover.get_state()});
  assert_inverse_square_commutes(witness);
};

let () = InputSpec.run_main(input, Prover_state.of_yojson, main);
`;
      fs.writeFile("src/js_snarky_project.re", main, fail);
    }
  };
  if (fs.existsSync("src")) {
    mk_src();
  } else {
    fs.mkdir("src", mk_src);
  }
/*****************************************************************************
 * index.js
 *****************************************************************************/
  if (!fs.existsSync("index.js")) {
    const index = `const Snarky = require("js_snarky");
const snarky = new Snarky("src/js_snarky_project.exe");

var prove_and_verify = function(statement, witness) {
  return snarky.prove({
    "statement": statement,
    "witness": witness
  }).then(function(proof) {
    console.log("Created proof for statement " + JSON.stringify(statement) + ":\\n" + proof + "\\n");
    return snarky.verify({
      "statement": statement,
      "proof": proof
    });
  }, console.log).then(function (verified) {
    console.log("Was the proof verified as correct? " + verified);
  }, console.log);
};

prove_and_verify(["2", true], "9").then(function() {
  return prove_and_verify(["4", true], "10");
}, console.log).then(function() {
  return prove_and_verify(["8", true], "12");
}, console.log).then(function() {
  process.exit(0);
}, function() {
  process.exit(1);
});
`;
    fs.writeFile("index.js", index, fail);
  }
/*****************************************************************************
 * package.json
 *****************************************************************************/
  if (!fs.existsSync("package.json")) {
    const pkg = `{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "dune build src/js_snarky_project.exe",
    "clean": "dune clean",
    "watch": "dune build -w src/js_snarky_project.exe"
  },
  "author": "you",
  "license": "UNLICENSED"
}
`;
    fs.writeFile("package.json", pkg, fail);
  }
/*****************************************************************************
 * dune
 *****************************************************************************/
  /* Ensure that symlinked node_modules folders don't kill dune. */
  if (!fs.existsSync("dune")) {
    const pkg = "(dirs :standard \\ node_modules)"
    fs.writeFile("dune", pkg, fail);
  }
} else {
  console.log("Unrecognised command " + arguments[0] + ".\nPossible commands are:\n  init\t\tInitialize a js_snarky project");
  process.exit(1);
}
