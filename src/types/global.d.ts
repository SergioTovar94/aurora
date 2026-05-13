import type { Iti } from "intl-tel-input";

declare global {
  interface Window {
    iti?: Iti;
  }
}

export {};