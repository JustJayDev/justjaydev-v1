/// <reference types="vite/client" />

declare module '*.css' {
  const classes: Record<string, string>
  export default classes
}

/*
 * The `vite/client` reference above is not merging into ImportMeta under this
 * TypeScript version, so the two values actually used at runtime are declared
 * here instead. Vite replaces both at build time: PROD becomes literal true or
 * false, and DEV is only used to keep the service worker out of local dev.
 */
interface ImportMetaEnv {
  readonly PROD: boolean
  readonly DEV: boolean
  readonly BASE_URL: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}