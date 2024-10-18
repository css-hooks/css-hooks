/// <reference types="vite/client" />

declare module "*.css?inline" {
  declare const styleSheet: string;
  // eslint-disable-next-line import/no-default-export
  export default styleSheet;
}

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
