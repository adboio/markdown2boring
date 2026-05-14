import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { renderRoot } from "./render.js";

const processor = unified().use(remarkParse).use(remarkGfm);

export function markdownToBoring(markdown: string): string {
  const tree = processor.parse(markdown) as Root;
  return renderRoot(tree);
}
