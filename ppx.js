#!/usr/bin/env node

"use strict"

var spawn = require("child_process").spawn,
   path = require("path"),
   name = require("package.json").name

// I have concerns about this. This has to invoke `bsc` to determine the associated
// version of OCaml (because ppxes have to be compiled for the version of the compiler
// that they're being invoked by); but that could be a performance concern, especially if
// this file is being invoked often, in an automatic build-process, alongside a bunch of
// other ppxes ...
//
// The alternative is to shift that effort forward to write-time — publish entirely
// different versions of *this package*, where the versions are mapped specifically to the
// version of bsc they're compatible with (i.e. “You have to install ppx-blah@6.x for
// bs-platform@6.x.”) I've done this for other packages, and it has ... non-trivial
// downsides. Not sure which I prefer, here, so going with the simpler, slower one.
//
// Open an Issue if this impacts you, maybe we can come up with a better solution.
var current_ppx_id = require("./identify"),
   bin = path.join(__dirname, name + "-" + current_ppx_id, "ppx.exe"),
   input = process.argv.slice(2)

input.unshift("--as-ppx")

if (bin != null) {
   spawn(bin, input, { stdio: "inherit" }).on("exit", process.exit)
} else {
   throw new Error("Platform not supported.")
}
