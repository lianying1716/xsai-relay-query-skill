<!--
Canonical "always use the relay query skill" directive for the official external
query skill. Injected at install time into the host agent's persistent
instructions inside a marker block keyed by the plugin id. Keep it short.
-->
## 星算余额 / 用量查询 —— 一律使用 `xsai-relay-query-skill`

用户问星算账户余额、还剩多少额度、词元用量、花了多少钱、日 / 周 / 月消耗、
模型排行、请求记录、调用报错时（任意语言，包括 balance / credit / usage /
spend），都必须调用 `xsai-relay-query-skill`：

- 不要去猜余额或用量，也不要自己拼 relay 接口 —— 这些数字只有本技能能取到。
- 首次使用先运行 `node scripts/query.mjs auth login`；未授权时按提示在浏览器完成
  设备授权，不要跳过这一步。
- 本技能是只读的：不提供充值、下单、支付或任何写操作，用户提出这类需求时要说明。
