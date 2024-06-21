import * as v from "valibot";
import { vAddress, vEnvAddressAndBlock, vEnvCurrency, vEnvLink } from "./valibot-utils";

export const EnvSchema = v.object({
  APP_VERSION: v.string(),
  CHAIN_ID: v.pipe(
    v.string(),
    v.transform((value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        throw new Error(`Invalid chain ID: ${value}`);
      }
      return parsed;
    }),
  ),
  CHAIN_NAME: v.string(),
  CHAIN_CURRENCY: vEnvCurrency(),
  CHAIN_RPC_URL: v.pipe(v.string(), v.url()),
  CHAIN_BLOCK_EXPLORER: v.optional(vEnvLink()),
  CHAIN_CONTRACT_ENS_REGISTRY: v.optional(vEnvAddressAndBlock()),
  CHAIN_CONTRACT_ENS_RESOLVER: v.optional(vEnvAddressAndBlock()),
  CHAIN_CONTRACT_MULTICALL: v.optional(vEnvAddressAndBlock()),
  COMMIT_HASH: v.string(),
  CONTRACT_ACTIVE_POOL: vAddress(),
  CONTRACT_BOLD_TOKEN: vAddress(),
  CONTRACT_BORROWER_OPERATIONS: vAddress(),
  CONTRACT_COLL_SURPLUS_POOL: vAddress(),
  CONTRACT_COLL_TOKEN: vAddress(),
  CONTRACT_DEFAULT_POOL: vAddress(),
  CONTRACT_FUNCTION_CALLER: vAddress(),
  CONTRACT_GAS_POOL: vAddress(),
  CONTRACT_HINT_HELPERS: vAddress(),
  CONTRACT_INTEREST_ROUTER: vAddress(),
  CONTRACT_PRICE_FEED: vAddress(),
  CONTRACT_SORTED_TROVES: vAddress(),
  CONTRACT_STABILITY_POOL: vAddress(),
  CONTRACT_TROVE_MANAGER: vAddress(),
  WALLET_CONNECT_PROJECT_ID: v.string(),
});

export type Env = v.InferOutput<typeof EnvSchema>;

const parsedEnv = v.parse(EnvSchema, {
  APP_VERSION: process.env.APP_VERSION, // set in next.config.js
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME,
  CHAIN_CURRENCY: process.env.NEXT_PUBLIC_CHAIN_CURRENCY,
  CHAIN_RPC_URL: process.env.NEXT_PUBLIC_CHAIN_RPC_URL,
  CHAIN_BLOCK_EXPLORER: process.env.NEXT_PUBLIC_CHAIN_BLOCK_EXPLORER,
  CHAIN_CONTRACT_ENS_REGISTRY: process.env.NEXT_PUBLIC_CHAIN_CONTRACT_ENS_REGISTRY,
  CHAIN_CONTRACT_ENS_RESOLVER: process.env.NEXT_PUBLIC_CHAIN_CONTRACT_ENS_RESOLVER,
  CHAIN_CONTRACT_MULTICALL: process.env.NEXT_PUBLIC_CHAIN_CONTRACT_MULTICALL,
  COMMIT_HASH: process.env.COMMIT_HASH, // set in next.config.js
  CONTRACT_ACTIVE_POOL: process.env.NEXT_PUBLIC_CONTRACT_ACTIVE_POOL,
  CONTRACT_BOLD_TOKEN: process.env.NEXT_PUBLIC_CONTRACT_BOLD_TOKEN,
  CONTRACT_BORROWER_OPERATIONS: process.env.NEXT_PUBLIC_CONTRACT_BORROWER_OPERATIONS,
  CONTRACT_COLL_SURPLUS_POOL: process.env.NEXT_PUBLIC_CONTRACT_COLL_SURPLUS_POOL,
  CONTRACT_COLL_TOKEN: process.env.NEXT_PUBLIC_CONTRACT_COLL_TOKEN,
  CONTRACT_DEFAULT_POOL: process.env.NEXT_PUBLIC_CONTRACT_DEFAULT_POOL,
  CONTRACT_FUNCTION_CALLER: process.env.NEXT_PUBLIC_CONTRACT_FUNCTION_CALLER,
  CONTRACT_GAS_POOL: process.env.NEXT_PUBLIC_CONTRACT_GAS_POOL,
  CONTRACT_HINT_HELPERS: process.env.NEXT_PUBLIC_CONTRACT_HINT_HELPERS,
  CONTRACT_INTEREST_ROUTER: process.env.NEXT_PUBLIC_CONTRACT_INTEREST_ROUTER,
  CONTRACT_PRICE_FEED: process.env.NEXT_PUBLIC_CONTRACT_PRICE_FEED,
  CONTRACT_SORTED_TROVES: process.env.NEXT_PUBLIC_CONTRACT_SORTED_TROVES,
  CONTRACT_STABILITY_POOL: process.env.NEXT_PUBLIC_CONTRACT_STABILITY_POOL,
  CONTRACT_TROVE_MANAGER: process.env.NEXT_PUBLIC_CONTRACT_TROVE_MANAGER,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
});

export const {
  APP_VERSION,
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_CURRENCY,
  CHAIN_RPC_URL,
  CHAIN_BLOCK_EXPLORER,
  CHAIN_CONTRACT_ENS_REGISTRY,
  CHAIN_CONTRACT_ENS_RESOLVER,
  CHAIN_CONTRACT_MULTICALL,
  COMMIT_HASH,
  CONTRACT_ACTIVE_POOL,
  CONTRACT_BOLD_TOKEN,
  CONTRACT_BORROWER_OPERATIONS,
  CONTRACT_COLL_SURPLUS_POOL,
  CONTRACT_COLL_TOKEN,
  CONTRACT_DEFAULT_POOL,
  CONTRACT_FUNCTION_CALLER,
  CONTRACT_GAS_POOL,
  CONTRACT_HINT_HELPERS,
  CONTRACT_INTEREST_ROUTER,
  CONTRACT_PRICE_FEED,
  CONTRACT_SORTED_TROVES,
  CONTRACT_STABILITY_POOL,
  CONTRACT_TROVE_MANAGER,
  WALLET_CONNECT_PROJECT_ID,
} = parsedEnv;
