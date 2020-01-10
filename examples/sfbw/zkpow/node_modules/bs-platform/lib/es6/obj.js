

import * as Marshal from "./marshal.js";
import * as Caml_array from "./caml_array.js";
import * as Caml_external_polyfill from "./caml_external_polyfill.js";
import * as Caml_builtin_exceptions from "./caml_builtin_exceptions.js";

function is_block(a) {
  return typeof a !== "number";
}

var double_field = Caml_array.caml_array_get;

var set_double_field = Caml_array.caml_array_set;

function marshal(obj) {
  return Caml_external_polyfill.resolve("caml_output_value_to_string")(obj, /* [] */0);
}

function unmarshal(str, pos) {
  return /* tuple */[
          Marshal.from_bytes(str, pos),
          pos + Marshal.total_size(str, pos) | 0
        ];
}

function extension_slot(x) {
  var slot = typeof x !== "number" && (x.tag | 0) !== 248 && x.length >= 1 ? x[0] : x;
  var name;
  if (typeof slot !== "number" && slot.tag === 248) {
    name = slot[0];
  } else {
    throw Caml_builtin_exceptions.not_found;
  }
  if (name.tag === 252) {
    return slot;
  } else {
    throw Caml_builtin_exceptions.not_found;
  }
}

function extension_name(x) {
  try {
    var slot = extension_slot(x);
    return slot[0];
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Obj.extension_name"
          ];
    }
    throw exn;
  }
}

function extension_id(x) {
  try {
    var slot = extension_slot(x);
    return slot[1];
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Obj.extension_id"
          ];
    }
    throw exn;
  }
}

function extension_slot$1(x) {
  try {
    return extension_slot(x);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Obj.extension_slot"
          ];
    }
    throw exn;
  }
}

var first_non_constant_constructor_tag = 0;

var last_non_constant_constructor_tag = 245;

var lazy_tag = 246;

var closure_tag = 247;

var object_tag = 248;

var infix_tag = 249;

var forward_tag = 250;

var no_scan_tag = 251;

var abstract_tag = 251;

var string_tag = 252;

var double_tag = 253;

var double_array_tag = 254;

var custom_tag = 255;

var final_tag = 255;

var int_tag = 1000;

var out_of_heap_tag = 1001;

var unaligned_tag = 1002;

export {
  is_block ,
  double_field ,
  set_double_field ,
  first_non_constant_constructor_tag ,
  last_non_constant_constructor_tag ,
  lazy_tag ,
  closure_tag ,
  object_tag ,
  infix_tag ,
  forward_tag ,
  no_scan_tag ,
  abstract_tag ,
  string_tag ,
  double_tag ,
  double_array_tag ,
  custom_tag ,
  final_tag ,
  int_tag ,
  out_of_heap_tag ,
  unaligned_tag ,
  extension_name ,
  extension_id ,
  extension_slot$1 as extension_slot,
  marshal ,
  unmarshal ,
  
}
/* No side effect */
