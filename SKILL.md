---
name: xsai-relay-query-skill
description: Use when an agent needs read-only Xingsuan relay balance, usage, rankings, request history, errors, or model status.
---

# 星算中转查询 Skill

这是只读查询工具。它可以查看模型状态、词元余额、日/周/月/累计消耗、模型排行、请求记录和错误记录，但没有充值、支付、购买、改价或其他写接口。

```bash
node scripts/query.mjs auth login --scope media.list_models,media.read_capabilities,media.query_balance,media.query_usage,media.query_rankings,media.query_requests,media.query_errors
node scripts/query.mjs models
node scripts/query.mjs balance
node scripts/query.mjs usage --range today|7d|30d|90d
node scripts/query.mjs rankings --range 30d
node scripts/query.mjs requests --limit 50 --days 30
node scripts/query.mjs errors --limit 50
```

查询结果只返回当前用户的数据，时间范围和分页必须显式传递或使用安全默认值。错误信息脱敏，不显示 Token、Provider、分组 Key、SQL、管理员字段或原始上游响应。
