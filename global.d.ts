// global.d.ts
import type es from "./messages/es.json";

declare module "next-intl" {
  interface AppConfig {
    messages: typeof es;
  }
}
