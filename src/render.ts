import type {
  Blockquote,
  Code,
  Heading,
  List,
  ListItem,
  Paragraph,
  Root,
  RootContent,
  Table,
  TableRow,
} from "mdast";

export function renderRoot(root: Root): string {
  const out = renderBlocks(root.children);
  return postProcess(out);
}

function renderBlocks(nodes: readonly RootContent[]): string {
  return nodes
    .map(renderBlock)
    .filter((s) => s.length > 0)
    .join("\n\n");
}

function renderBlock(node: RootContent): string {
  switch (node.type) {
    case "paragraph":
      return renderInlines((node as Paragraph).children);
    case "heading":
      return renderInlines((node as Heading).children).toUpperCase();
    case "code":
      return renderCodeBlock(node as Code);
    case "list":
      return renderList(node as List);
    case "blockquote":
      return prefixLines(
        renderBlocks((node as Blockquote).children),
        "> ",
      );
    case "thematicBreak":
      return "---";
    case "table":
      return renderTable(node as Table);
    case "html":
      return "";
    default:
      return "";
  }
}

type InlineNode = { type: string; [k: string]: unknown };

function renderInlines(nodes: readonly unknown[]): string {
  return nodes.map((n) => renderInline(n as InlineNode)).join("");
}

function renderInline(node: InlineNode): string {
  switch (node.type) {
    case "text":
      return String(node.value ?? "");
    case "strong":
    case "emphasis":
    case "delete":
      return renderInlines((node.children as unknown[]) ?? []);
    case "inlineCode":
      return String(node.value ?? "");
    case "link": {
      const text = renderInlines((node.children as unknown[]) ?? []);
      const url = String(node.url ?? "");
      if (!text || text === url) return url;
      return `${text} (${url})`;
    }
    case "image": {
      const alt = String(node.alt ?? "");
      return alt ? `[image: ${alt}]` : "[image]";
    }
    case "break":
      return "\n";
    case "html":
      return "";
    default:
      return "";
  }
}

function renderCodeBlock(node: Code): string {
  return indent(node.value, "  ");
}

function indent(text: string, prefix: string): string {
  return text
    .split("\n")
    .map((line) => (line.length ? prefix + line : line))
    .join("\n");
}

function prefixLines(text: string, prefix: string): string {
  return text
    .split("\n")
    .map((line) => prefix + line)
    .join("\n");
}

function renderList(node: List): string {
  return node.children
    .map((item, i) => renderListItem(item, node, i))
    .join("\n");
}

function renderListItem(item: ListItem, list: List, index: number): string {
  const marker = list.ordered
    ? `${(list.start ?? 1) + index}. `
    : "- ";
  const content = item.children
    .map(renderBlock)
    .filter((s) => s.length > 0)
    .join("\n");
  if (!content) return marker.trimEnd();
  const pad = " ".repeat(marker.length);
  const lines = content.split("\n");
  return lines
    .map((l, i) => (i === 0 ? marker + l : l.length ? pad + l : l))
    .join("\n");
}

function renderTable(node: Table): string {
  const rows: TableRow[] = node.children;
  if (rows.length === 0) return "";
  const header = rows[0]!;
  const body = rows.slice(1);
  const headers = header.children.map((c) =>
    renderInlines(c.children).trim(),
  );
  if (body.length === 0) {
    return headers.join(" / ");
  }
  return body
    .map((row) =>
      row.children
        .map((cell, i) => {
          const h = headers[i] ?? `Column ${i + 1}`;
          const v = renderInlines(cell.children).trim();
          return `${h}: ${v}`;
        })
        .join("\n"),
    )
    .join("\n\n");
}

function postProcess(s: string): string {
  const trimmed = s
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n");
  const collapsed = trimmed.replace(/\n{3,}/g, "\n\n");
  return collapsed.trim();
}
