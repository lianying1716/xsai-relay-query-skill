# Changelog

## 1.2.0 - 2026-09-16

- 修复一次网络抖动就把授权状态永久毒化：只有授权真的失效(invalid_grant/401)才会要求重新授权，断网、超时、5xx 现在会保留可重试状态。
- auth login 现在能在授权状态损坏时自愈，重新走一次设备授权，不再被同一标记挡回。
- 恢复授权时不再递交可能已被消费的旧 refresh_token，避免触发 refresh replay 把整个共享 Grant 撤销。
- 不带 --scope 的 auth login 直接申请该技能的完整权限，不再出现"登录成功但查余额 403"的往返。
- 权限不足时返回可执行的修复提示(scope_required)，不再是一句看不出下一步的失败。
- SKILL.md 补中文触发词，宿主 agent 更容易命中；新增 agent-directive.md，安装时注入宿主常驻指令，确保技能真的被调用。

## 1.1.0 - 2026-09-09

Shared suite OAuth runtime, one shared permission grant, and crash-safe refresh state.


## 1.0.1 - 2026-09-09

- 修复主站设备授权域与 Relay API 域分离。
- 统一受限 Token 刷新边界。

## 1.0.0 - 2026-09-08

- 首次发布独立 GitHub 仓库版本。
- 支持模型、余额、用量、排行、请求和错误只读查询。
- 内置 runtime。
