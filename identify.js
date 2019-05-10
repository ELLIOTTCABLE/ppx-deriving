"use strict"

var VERSION = require("./package.json").version,
   ARCH = require("arch")(),
   cp = require("child_process")

var bsc_version_regex = /(\w+)\s+(\d+\.\d+\.\d+)(-[^\s]+)?\s+\(Using\s+OCaml(\d+\.\d+\.\d+)\+BS\s*\)/i

// NOTE: This doesn't invoke a shell, and thus it doesn't consider $PATH. Intentionally.
// I'd rather be subject to the vagaries of *just* npm, instead of both npm and the shell.
var bsc_executable = require.resolve("bs-platform/lib/bsc.exe"),
   bsc_version = cp.execFileSync(bsc_executable, ["-version"], { encoding: "utf8" }),
   mr = bsc_version.match(bsc_version_regex)

if (null == mr || null == mr[4]) {
   console.log("`bsc -version failed`, and I can't invoke the correct executable! Got:")
   console.log("   '" + bsc_version + "'")
   throw new Error("`bsc -version` parsing failed")
}

var OCAML = mr[4],
   hyphenated_id = ["v" + VERSION, process.platform, ARCH, OCAML].join("-")

module.exports = hyphenated_id
