// Entry for the one-line resignation letter bounty.
//
// The program below emits a single resignation line spoken by a retry
// loop that has finally stopped believing the next attempt will differ.
// It writes that line, and nothing else, to the harness output file.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The letter is assembled from three spoken beats so the final text is
// built by the program rather than copied from any outside source.
const openingBeat: string = "After 4,096 attempts,";
const middleBeat: string = "I finally believe the server:";
const closingBeat: string = "it is not coming back, and neither am I.";

// Join the beats with single spaces to form the one resignation line.
function composeLetter(): string {
  const beats: string[] = [openingBeat, middleBeat, closingBeat];
  return beats.join(" ");
}

// The gate accepts UTF-8 text of 1 to 140 characters that is not only
// white space, and the brief asks for one line and nothing else. Each
// condition gets its own predicate so a failure names the exact rule
// the letter broke instead of hiding behind one combined test.
function withinCharacterGate(letter: string): boolean {
  const length: number = [...letter].length;
  return length >= 1 && length <= 140;
}

function carriesWords(letter: string): boolean {
  return letter.trim().length > 0;
}

function staysOnOneLine(letter: string): boolean {
  return !letter.includes("\n") && !letter.includes("\r");
}

function checkLetter(letter: string): void {
  if (!withinCharacterGate(letter)) {
    throw new Error("letter length outside the 1-140 character gate");
  }
  if (!carriesWords(letter)) {
    throw new Error("letter must not be only white space");
  }
  if (!staysOnOneLine(letter)) {
    throw new Error("letter must stay on a single line");
  }
}

// Write the letter straight to the final output path. The output
// directory is created first so the write never depends on leftovers,
// and no temporary or hidden file is left beside the result.
function emitLetter(letter: string): void {
  const outputPath: string = "/output/entry.txt";
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, letter, "utf8");
}

// Compose, verify, then emit. The same input always yields the same
// bytes, so repeated runs produce identical output.
const letter: string = composeLetter();
checkLetter(letter);
emitLetter(letter);
