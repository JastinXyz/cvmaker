// import the original type declarations
import "i18next";
import type en from "~/i18n/en";
import type id from "~/i18n/id";
// import all namespaces (for the default language, only)

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "en";
    // custom resources type
    resources: {
      en: typeof en;
      id: typeof id;
    };
    // other
  }
}