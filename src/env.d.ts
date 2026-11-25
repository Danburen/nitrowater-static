/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOCS_URL?: string
  readonly VITE_TOOLS_URL?: string
  readonly VITE_GITHUB_URL?: string
  readonly VITE_GITHUB_PROFILE_URL?: string
  readonly VITE_STATIC_REPO_URL?: string
  readonly VITE_BEIAN_NO?: string
  readonly VITE_GONGAN_NO?: string
  readonly VITE_GONGAN_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
