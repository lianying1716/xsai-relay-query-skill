#!/usr/bin/env node
import process from "node:process";
import { createExternalSkillRuntime } from "../runtime/runtime.mjs";

const CLIENT_ID = "xsai-relay-skill";
const BASE_URL = process.env.XSAI_QUERY_BASE_URL || "https://api.xsai5.xyz";
const ALLOWED = new Set(["models", "balance", "usage", "rankings", "requests", "errors", "help", "auth"]);
const runtime = createExternalSkillRuntime({
  clientId: CLIENT_ID,
  defaultBaseUrl: BASE_URL,
  stateEnv: "XSAI_QUERY_STATE_DIR",
  stateName: "xsai-relay-query-skill",
  defaultScopes: ["media.list_models", "media.read_capabilities"]
});
const { readState, removeState, tokenFromRefresh, login } = runtime;

function parseQueryArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = String(argv[i]);
    if (!token.startsWith("--")) { args._.push(token); continue; }
    const body = token.slice(2); const equal = body.indexOf("=");
    if (equal >= 0) args[body.slice(0, equal)] = body.slice(equal + 1);
    else args[body] = argv[i + 1] && !String(argv[i + 1]).startsWith("--") ? argv[++i] : true;
  }
  args.command = args._[0] || "help"; args.subcommand = args._[1] || "";
  if (!ALLOWED.has(args.command) || args.command === "topup" || args.command === "pay") throw Object.assign(new Error("只支持只读查询命令"), { code: "unsupported_command" });
  return args;
}

function normalizeQueryError(error) {
  const code = String(error?.code || "query_failed").replace(/[^a-z0-9_\-]/gi, "_").slice(0, 64);
  const known = new Set(["auth_required", "unsupported_command", "invalid_request", "invalid_scope", "not_found", "timeout"]);
  return { code, message: known.has(code) ? String(error.message || "请求失败") : "查询服务暂时不可用，请稍后重试。" };
}
async function token(fetchImpl = globalThis.fetch) { return tokenFromRefresh(await readState(), fetchImpl); }
async function request(pathname, params, fetchImpl = globalThis.fetch) {
  const accessToken = await token(fetchImpl); const url = new URL(runtime.endpoint(BASE_URL, pathname)); Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined && value !== "") url.searchParams.set(key, String(value)); });
  return runtime.fetchJson(url, { headers: { accept: "application/json", authorization: `Bearer ${accessToken}` } }, fetchImpl);
}
async function main(argv = process.argv.slice(2), fetchImpl = globalThis.fetch) {
  const args = parseQueryArgs(argv);
  if (args.command === "help") return { usage: "xsai-query auth|models|balance|usage|rankings|requests|errors" };
  if (args.command === "auth" && args.subcommand === "login") return login(args, fetchImpl);
  if (args.command === "auth" && args.subcommand === "status") { const state = await readState(); return state ? { status: "configured", scopes: state.scopes || [] } : { status: "signed_out" }; }
  if (args.command === "auth" && args.subcommand === "logout") { await removeState(); return { status: "signed_out" }; }
  if (args.command === "models") return request("/v1/models", {}, fetchImpl);
  const paths = { balance: "/v1/relay/query/balance", usage: "/v1/relay/query/usage", rankings: "/v1/relay/query/rankings", requests: "/v1/relay/query/requests", errors: "/v1/relay/query/errors" };
  const params = args.command === "usage" || args.command === "rankings" ? { range: args.range || "30d" } : args.command === "requests" ? { days: args.days || 30, limit: args.limit || 50, before: args.before } : { limit: args.limit || 50 };
  return (await request(paths[args.command], params, fetchImpl)).data;
}
export { main, normalizeQueryError, parseQueryArgs };
if (import.meta.url === `file://${process.argv[1]}`) main().then((result) => process.stdout.write(`${JSON.stringify(result)}\n`)).catch((error) => { process.stderr.write(`${JSON.stringify(normalizeQueryError(error))}\n`); process.exitCode = 1; });
