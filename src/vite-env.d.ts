/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_FORM_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
