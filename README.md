# markdown2boring

convert markdown to plaintext for all your boring channels.

imessage, sms, plain-text email, push notifs — none of them render markdown. so when your ai agent spits out `**bold**` and `| pipe | tables |`, your users see noise. this fixes that.

## install

```sh
npm install markdown2boring
```

## use

```ts
import { markdownToBoring } from "markdown2boring";

markdownToBoring(`
# status report

there are **three** issues:

1. slow queries
2. missing index
3. aggressive cache eviction

| metric | before | after |
| --- | --- | --- |
| p50 | 120ms | 45ms |
| p99 | 800ms | 210ms |

see the [full report](https://example.com/report).
`);
```

you get:

```
STATUS REPORT

there are three issues:

1. slow queries
2. missing index
3. aggressive cache eviction

metric: p50
before: 120ms
after: 45ms

metric: p99
before: 800ms
after: 210ms

see the full report (https://example.com/report).
```

## what it does

- headings → SHOUTED
- `**bold**`, `*italic*`, `~~strike~~` → bare text
- `` `code` `` and code blocks → no backticks, blocks get a 2-space indent
- `[text](url)` → `text (url)`
- `![alt](src)` → `[image: alt]`
- lists stay as lists (`-` or `1.`)
- blockquotes keep `>`
- tables flatten to `key: value` blocks, one per row

## license

mit
