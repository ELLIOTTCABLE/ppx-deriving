"use strict"

var VERSION = require("./package.json").version,
   ARCH = require("arch")(),
   cp = require("child_process"),
   path = require("path");

var bsc_version_regex = /(\w+)\s+(\d+\.\d+\.\d+)(-[^\s]+)?\s+\(\s*Using\s+OCaml:?(\d+\.\d+\.\d+)\+BS\s*\)/i

var bsc_executable;

// NOTE: This doesn't invoke a shell, and thus it doesn't consider $PATH. Intentionally.
// I'd rather be subject to the vagaries of *just* npm, instead of both npm and the shell.
// First tries to resolve >= 7.2.0 location
// On fail fallbacks to < 7.2.0 location
try {
	bsc_executable = require.resolve(path.join("bs-platform", process.platform, "bsc.exe"));
} catch (e) {
	bsc_executable = require.resolve("bs-platform/lib/bsc.exe");
}

var bsc_version = cp.execFileSync(bsc_executable, ["-version"], { encoding: "utf8" }),
   mr = bsc_version.match(bsc_version_regex)

if (null == mr || null == mr[4]) {
   console.log("`bsc -version failed`, and I can't invoke the correct executable! Got:")
   console.log("   '" + bsc_version + "'")
   throw new Error("`bsc -version` parsing failed")
}

var OCAML = mr[4],
   hyphenated_id = ["v" + VERSION, process.platform, ARCH, OCAML].join("-")

module.exports = hyphenated_id
