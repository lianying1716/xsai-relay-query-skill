# xsai-relay-query-skill

星算中转只读查询 Skill，作为独立 GitHub 仓库发布。仓库已经内置运行时，克隆后不依赖 `xsai-external-skills-pack` 或其他仓库。

- 入口：`scripts/query.mjs`
- 查询：模型状态、余额、日/周/月/累计用量、模型排行、请求记录、错误记录
- 安全：只读 Scope；不提供充值、支付、购买或其他写操作

支持 Node.js 18+。发布版本使用 GitHub tag，例如 `v1.0.0`。
