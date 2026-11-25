/**
 * Outbound destinations and footer registrations.
 *
 * Values are injected at BUILD time via VITE_* (Dockerfile build args / CI vars /
 * pages.yml env). Empty values fall back to the documented defaults so a bare
 * `npm run build` still works. Changing a value requires a rebuild + redeploy.
 */

const DEFAULT_DOCS_URL = 'https://docs.nitrowater.cn/plugin/velochatx/'
const DEFAULT_TOOLS_URL = 'https://tools.nitrowater.cn/'
const DEFAULT_GITHUB_URL = 'https://github.com/danburen/nitrowater'
const DEFAULT_PROFILE_URL = 'https://github.com/Danburen'
const DEFAULT_STATIC_REPO_URL = 'https://github.com/Danburen/nitrowater-static'
const BEIAN_URL = 'https://beian.miit.gov.cn/'
const GONGAN_QUERY_URL = 'https://beian.mps.gov.cn/#/query/webSearch?code='

function orDefault(value: string | undefined, fallback: string): string {
  return value && value.trim() ? value.trim() : fallback
}

const beianNo = import.meta.env.VITE_BEIAN_NO?.trim() ?? ''
const gonganNo = import.meta.env.VITE_GONGAN_NO?.trim() ?? ''
const gonganUrl = import.meta.env.VITE_GONGAN_URL?.trim()

export const links = {
  docs: orDefault(import.meta.env.VITE_DOCS_URL, DEFAULT_DOCS_URL),
  tools: orDefault(import.meta.env.VITE_TOOLS_URL, DEFAULT_TOOLS_URL),
  github: orDefault(import.meta.env.VITE_GITHUB_URL, DEFAULT_GITHUB_URL),
  profile: orDefault(import.meta.env.VITE_GITHUB_PROFILE_URL, DEFAULT_PROFILE_URL),
  staticRepo: orDefault(import.meta.env.VITE_STATIC_REPO_URL, DEFAULT_STATIC_REPO_URL),
  // Empty registration numbers hide the corresponding footer link.
  beianNo,
  beianUrl: BEIAN_URL,
  gonganNo,
  // Explicit URL wins; otherwise build a query URL from the number.
  gonganUrl: gonganUrl || (gonganNo ? `${GONGAN_QUERY_URL}${encodeURIComponent(gonganNo)}` : ''),
} as const
