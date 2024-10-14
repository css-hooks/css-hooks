/// <reference types="vite/client" />

declare module "*.css?inline" {
  declare const styleSheet: string;
  export default styleSheet;
}

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
