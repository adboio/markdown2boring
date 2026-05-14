import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { markdownToBoring } from "../src/index.js";

const fixturesDir = join(fileURLToPath(new URL(".", import.meta.url)), "fixtures");

const fixtureNames = readdirSync(fixturesDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

describe("markdownToBoring fixtures", () => {
  for (const name of fixtureNames) {
    it(name, () => {
      const md = readFileSync(join(fixturesDir, `${name}.md`), "utf8");
      const expected = readFileSync(join(fixturesDir, `${name}.txt`), "utf8");
      expect(markdownToBoring(md)).toBe(expected);
    });
  }
});

describe("markdownToBoring edge cases", () => {
  it("returns empty string for empty input", () => {
    expect(markdownToBoring("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(markdownToBoring("   \n\n  \n")).toBe("");
  });

  it("passes through a single word", () => {
    expect(markdownToBoring("hello")).toBe("hello");
  });

  it("strips inline emphasis markers", () => {
    expect(markdownToBoring("This is **bold** and *italic*.")).toBe(
      "This is bold and italic.",
    );
  });

  it("renders a thematic break as a dashed line", () => {
    expect(markdownToBoring("before\n\n---\n\nafter")).toBe(
      "before\n\n---\n\nafter",
    );
  });

  it("renders a hard line break", () => {
    expect(markdownToBoring("line one  \nline two")).toBe("line one\nline two");
  });
});
