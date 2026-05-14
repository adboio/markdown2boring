# Status Report

Hey! Here's a summary of what I found.

## Issues

There are **three** main issues:

1. Slow database queries on the `users` table
2. Missing index on `orders.created_at`
3. Cache eviction is too aggressive

## Metrics

| Metric | Before | After |
| --- | --- | --- |
| p50 latency | 120ms | 45ms |
| p99 latency | 800ms | 210ms |

## Next steps

- Apply the index migration
- Tune the cache TTL
- Re-run the load test

See the [full report](https://example.com/report) for details.
