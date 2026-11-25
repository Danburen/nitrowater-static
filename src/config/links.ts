/**
 * Outbound destinations are baked in at build time (Dockerfile build args / CI vars).
 * Empty URL values fall back to the documented defaults so a bare `npm run build` still works.
 * The 备案号 has no fallback: unset means the footer omits the link entirely.
 */
const DEFAULT_DOCS_URL = 'https://docs.nitrowater.cn/velochatx/'
const DEFAULT_TOOLS_URL = 'https://tools.nitrowater.cn/'
const DEFAULT_GITHUB_URL = 'https://github.com/danburen/nitrowater'
const DEFAULT_PLUGIN_DOCS_REPO = 'https://github.com/Danburen/nitrowater-plugin-docs'
const DEFAULT_PROFILE_URL = 'https://github.com/Danburen'
const DEFAULT_STATIC_REPO_URL = 'https://github.com/Danburen/nitrowater-static'
const BEIAN_URL = 'https://beian.miit.gov.cn/'

function orDefault(value: string | undefined, fallback: string): string {
  return value && value.trim() ? value.trim() : fallback
}

export const links = {
  docs: orDefault(import.meta.env.VITE_DOCS_URL, DEFAULT_DOCS_URL),
  tools: orDefault(import.meta.env.VITE_TOOLS_URL, DEFAULT_TOOLS_URL),
  github: orDefault(import.meta.env.VITE_GITHUB_URL, DEFAULT_GITHUB_URL),
  pluginDocsRepo: orDefault(import.meta.env.VITE_PLUGIN_DOCS_REPO, DEFAULT_PLUGIN_DOCS_REPO),
  profile: orDefault(import.meta.env.VITE_GITHUB_PROFILE_URL, DEFAULT_PROFILE_URL),
  staticRepo: orDefault(import.meta.env.VITE_STATIC_REPO_URL, DEFAULT_STATIC_REPO_URL),
  beianNo: import.meta.env.VITE_BEIAN_NO?.trim() ?? '',
  beianUrl: BEIAN_URL,
} as const
