export type Address = `0x${string}`;

export type Direction = -1 | 1;

export type Token = {
  icon: string;
  name: string;
  symbol:
    | "BOLD"
    | "ETH"
    | "LQTY"
    | "RETH"
    | "LUSD"
    | "STETH";
};

export type StatusMode = "positive" | "warning" | "negative" | "neutral";
