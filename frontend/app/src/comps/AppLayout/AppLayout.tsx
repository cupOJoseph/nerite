import type { ReactNode } from "react";

import { TopBar } from "@/src/comps/TopBar/TopBar";
import { css } from "@/styled-system/css";

export const LAYOUT_WIDTH = 1092;

export function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: LAYOUT_WIDTH,
        minHeight: "100vh",
        margin: "0 auto",
      })}
    >
      <div
        className={css({
          width: "100%",
          flexGrow: 0,
          flexShrink: 0,
          paddingBottom: 48,
        })}
      >
        <TopBar />
      </div>
      <div
        className={css({
          width: "100%",
          flexGrow: 1,
          flexShrink: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        })}
      >
        {children}
      </div>
    </div>
  );
}
