/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOCS_URL?: string
  readonly VITE_TOOLS_URL?: string
  readonly VITE_GITHUB_URL?: string
  readonly VITE_PLUGIN_DOCS_REPO?: string
  readonly VITE_BEIAN_NO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
