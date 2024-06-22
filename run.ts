#!/usr/bin/env -S ${HOME}/.asdf/shims/deno run --allow-all
import { $, Array as A, pipe, yargs } from "./deps.ts";
import {
  YabaiQueryWindowType,
  isFocused,
  isOpen,
  ordByApp,
  ordByFrame,
  ordBySpace,
} from "./lib/helper.ts";

const args = yargs(Deno.args)
  .command("<cycle>", "cycle between windows of the same app", {
    "focus": {
      alias: "f",
      type: "string",
      default: "next",
      description: "next or prev",
    },
    "app": {
      alias: "a",
      type: "string",
      description:
        "app name. e.g. 'Google Chrome', 'iTerm2', 'Code', 'IntelliJ IDEA'",
    },
    "debug": {
      alias: "d",
      type: "boolean",
    },
  })
  .strictCommands()
  .demandCommand(1)
  .parse();

const debuglog = (msg: string) => {
  if(args.debug) {
    console.error(msg);
  }
}
debuglog(`args: ${JSON.stringify(args)}`);
const windows: YabaiQueryWindowType[] = await $`yabai -m query --windows`
  .json();
const focusedWindow = windows.find(isFocused);
  if (!args.app && !focusedWindow) {
    console.error("no focused window");
    Deno.exit(1);
  }

let targetWindows: YabaiQueryWindowType[] = [];
if (args.app) {
  if (args.app instanceof Array) {
    const validApps = args.app.filter((a: string) => a !== "");
    debuglog(`validApps: ${JSON.stringify(validApps)}`);
    targetWindows = windows.filter((x) =>
      validApps.some((a: string) => x.app.includes(a))
    );
  } else {
    targetWindows = windows.filter((x) => x.app.includes(args.app));
  }
} else {
  targetWindows = windows.filter((x) => x.app === focusedWindow.app);
}
debuglog(`targetWindows: ${JSON.stringify(targetWindows.map((w) => w.id) )}`);

// https://github.com/koekeishiya/yabai/discussions/1326
const ids = pipe(
  targetWindows.filter((w) => isOpen(w)),
  A.sortBy([ordByApp, ordBySpace, ordByFrame]),
).map((w) => w.id);

debuglog(`ids: ${JSON.stringify(ids)}`);

if (ids.length === 0) {
  console.error("no windows");
} else {
  const currentIndex = ids.indexOf(focusedWindow?.id);
  const nextIndex = (currentIndex + (args.f === "prev" ? -1 : 1)) % ids.length;
  debuglog(`currentIndex: ${currentIndex}, nextIndex: ${nextIndex}`);
  console.log(ids[nextIndex]);
}
