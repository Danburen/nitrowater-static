# 部署说明 — nitrowater-static

三个纯静态 nginx 镜像：门户首页（本仓构建）、VeloChatX 文档（`nitrowater-plugin-docs` 仓产出）、
离线工具箱（`nitrowater` 仓的 `tools` bake target 产出）。没有后端、没有数据库。

## 1. 前置

```bash
docker network create nitrowater-net
cp deploy/docker/.env.example deploy/docker/.env   # 按实际域名/邮箱修改
```

`.env` 里的域名解析到服务器；启用 edge 时 80/443 必须开放（Let's Encrypt HTTP-01）。

## 2. 本地预览

```bash
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml up -d portal docs tools
# 门户 http://127.0.0.1:18080   文档 http://127.0.0.1:18081/plugin/velochatx/   工具箱 http://127.0.0.1:18082/
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml ps
```

## 3. 公网发布

```bash
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml --profile edge up -d
```

`nginx-proxy` 按容器的 `VIRTUAL_HOST` 反代，`acme-companion` 按 `LETSENCRYPT_HOST` 签发/续期证书。
文档镜像根路径 `/` 按设计是 404；当前镜像入口是 `/plugin/velochatx/`（VitePress `base=/plugin/velochatx/`）。

> ⚠️ 若 nitrowater 主栈已在本机跑 edge（80/443），**不要**在这里启用 edge profile——
> 直接让 DNS 指向已有反代即可，否则端口冲突。主栈的 `VIRTUAL_HOST` 占用了 `nitrowater.cn`，
> 本仓门户默认用 `static.nitrowater.cn`；要改为主域名时先在主栈释放该 host。

> 为什么默认走子域名：`nginx-proxy` 按 `VIRTUAL_HOST` 自动路由，一站点一域名最省事。
> 同域名走路径前缀（如 `/docs/`、`/tools/`）要额外写 `location` 反代，且两个静态包都得支持子路径
> （文档入口本身是 `/plugin/velochatx/`，工具箱 SPA 还要处理 base/publicPath），明显更复杂；
> 不同端口则要对外暴露端口，证书配置也更麻烦。所以其他方式可以做，但复杂度更高。

## 4. 更新与回滚

三个镜像独立发版，改 `.env` 里的 `*_TAG` 后只更新对应服务：

```bash
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml pull docs
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml up -d --no-build docs
```

回滚 = 把 tag 改回旧的 sha（各仓库 workflow 每次推送 `latest` + `<sha>` 两个 tag）。

## 5. GitHub Actions 构建与发布（GHCR）

### 构建期变量：仓库 Variables

`build.yml` 会把下面这些变量作为 `build-arg` 传进镜像，Vite 在构建时写进 JS。
必须设在**仓库级 Variables**（`Settings → Secrets and variables → Actions → Variables`）：
不是 Secrets，也不是某个 Environment 里的变量——`build.yml` 没有声明 `environment`。
备案号不是秘密，放 Variables 正合适。

| 变量 | 是否要填 | 说明 / 默认值 |
|---|---|---|
| `VITE_BEIAN_NO` | 想显示就填 | ICP 备案号，页脚链接到 `beian.miit.gov.cn`；留空则隐藏，无代码默认值 |
| `VITE_GONGAN_NO` | 想显示就填 | 公安备案号；留空则隐藏，无代码默认值 |
| `VITE_GONGAN_URL` | 否 | 留空时自动拼 `https://beian.mps.gov.cn/#/query/webSearch?code=<号码>` |
| `VITE_DOCS_URL` | 否 | 默认 `https://docs.nitrowater.cn/plugin/velochatx/` |
| `VITE_TOOLS_URL` | 否 | 默认 `https://tools.nitrowater.cn/` |
| `VITE_GITHUB_URL` | 否 | 默认 `https://github.com/danburen/nitrowater`（首页项目卡片 + 收藏弹窗） |
| `VITE_GITHUB_PROFILE_URL` | 否 | 默认 `https://github.com/Danburen`（首页「查看我的主页」） |
| `VITE_STATIC_REPO_URL` | 否 | 默认 `https://github.com/Danburen/nitrowater-static`（右上角角标） |

后六个都有正确代码默认，只有两个备案号需要你主动设置：

```bash
gh variable set VITE_BEIAN_NO -R Danburen/nitrowater-static --body '粤ICP备xxxxxxxx号'
gh variable set VITE_GONGAN_NO -R Danburen/nitrowater-static --body 'xxxxxxxxxxxxxxxxxx'
gh variable list -R Danburen/nitrowater-static          # 核对
gh workflow run build.yml -R Danburen/nitrowater-static # 触发构建；push main/master 也会自动跑
```

然后宿主机重新拉 portal 才生效：

```bash
export PORTAL_TAG=latest
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"
$COMPOSE pull portal
$COMPOSE up -d --no-build portal
```

`pages.yml` 只读那五个外链变量，**故意不注入备案号**（`danburen.github.io` 在境外、不是备案域名）。
本地开发者可复制根目录 `.env.example` 为 `.env.local` 做预览；`docker build` 不读该文件，需显式 `--build-arg`。

### 手动发布

`deploy.yml` 只部署已构建的镜像，不会重新构建；改备案号必须走上面的 `build.yml`：

```bash
gh workflow run deploy.yml -f tag=latest -f registry=ghcr.io
# 回滚到某次构建：gh workflow run deploy.yml -f ref=<commit-sha> -f registry=ghcr.io
```

- `registry`：workflow 默认值故意留空——CI 读不到服务器上的 `.env`，留空就完全由 `.env` 决定；
  填 `ghcr.io` 时会在 SSH 脚本里以进程 env 注入并覆盖 `.env`，`compose` 的兜底也是 `ghcr.io`。
- `tag` / `ref`：二选一；传入的 tag 以 `PORTAL_TAG` 进程 env 覆盖 `.env`，只更新门户镜像。
- `skip_preflight`：私有包或镜像源没有链接到本仓时勾上，跳过 GHCR 存在性检查；默认仍会在 `ghcr.io` 校验源镜像。
- 也可由其他 workflow 用 `workflow_call` 调用，inputs/secrets 与 `workflow_dispatch` 同名。
- GitHub Pages 是从源码构建，不拉镜像；`registry` 只作用于门户/文档/工具的 nginx 镜像。

## 6. 远程宿主机手动部署

先在本机把 `deploy/` 打到宿主机，**不要用 `rm -rf deploy` 覆盖目录**——`deploy/docker/.env`
是宿主机状态，不在 git 包里，删了就丢配置；tar/rsync 按目录合并即可。

```bash
# 本机：打包并上传（只含 git 跟踪的 docker-compose.yml / .env.example）
tar -czf /tmp/nitrowater-static-deploy.tgz -C <repo-root> deploy
scp /tmp/nitrowater-static-deploy.tgz <user>@<host>:~/

# 宿主机：一次性准备
ssh <user>@<host>
mkdir -p /opt/nitrowater-static && cd /opt/nitrowater-static
docker network inspect nitrowater-net >/dev/null 2>&1 || docker network create nitrowater-net
tar -xzf ~/nitrowater-static-deploy.tgz
cp -n deploy/docker/.env.example deploy/docker/.env   # 仅第一次，别覆盖已有 .env
vi deploy/docker/.env                                 # 域名 / SSL_EMAIL / tag
```

私有包或需要令牌时先登录 GHCR（公开包可跳过）：

```bash
printf '%s' "$CR_PAT" | docker login ghcr.io -u <github-user> --password-stdin
```

日常只更新门户镜像，等价于 CI 的进程 env 注入：

```bash
cd /opt/nitrowater-static
export REGISTRY=ghcr.io          # 不 export 就完全用 .env 的值
export PORTAL_TAG=latest         # 回滚填旧 sha；必须与 pull/up 同一次 shell 一致
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"

$COMPOSE pull portal
$COMPOSE up -d --no-build portal
$COMPOSE ps
docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' \
  nitrowater-static-portal
curl -fsS http://127.0.0.1:18080/healthz
```

首次把三个站点一起拉起；若 nitrowater 主栈已占用 80/443，**不要**加 `--profile edge`：

```bash
$COMPOSE up -d portal docs tools
# 仅当本机没有别的 edge 时才执行：
$COMPOSE --profile edge up -d
```

验证入口：门户 `/healthz`、文档 `/plugin/velochatx/`（根路径 404 是设计）、工具箱 `/`。
出问题看 `docker logs --tail 100 nitrowater-static-portal`；回滚把 `PORTAL_TAG` 改成旧 sha 再重复 pull/up。

### 备案号 / 公安备案：构建期注入

备案号、公安备案号和外链都是**构建期**变量：Vite 在 `npm run build` / `docker build`
时把值写进 JS。宿主 `.env` 改不了它们，必须在 GitHub 仓库 Variables 设置，
重跑 `build.yml` 后再重新拉镜像：

```bash
gh variable set VITE_BEIAN_NO -R Danburen/nitrowater-static --body '粤ICP备xxxxxxxx号'
gh variable set VITE_GONGAN_NO -R Danburen/nitrowater-static --body 'xxxxxxxxxxxxxxxxxx'
gh workflow run build.yml -R Danburen/nitrowater-static
```

留空则页脚隐藏对应链接；`VITE_GONGAN_URL` 可不填，会自动拼成
`https://beian.mps.gov.cn/#/query/webSearch?code=<公安备案号>`。

## 7. 线上排查

### 文档站路径：用 `/plugin/velochatx/`

当前 docs 镜像由 `DOCS_BASE_PREFIX=/plugin` 构建，VitePress 的 `base` 是构建期写死的，
nginx rewrite 改不了。**不改 docs 仓**，入口和 compose 健康检查都按 `/plugin/velochatx/` 走。

线上确认：

```bash
cd /opt/nitrowater-static
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"

docker exec nitrowater-static-docs sh -c \
  'echo "--- root:"; ls /usr/share/nginx/html; echo "--- plugin:"; ls /usr/share/nginx/html/plugin 2>/dev/null || true'
curl -s -o /dev/null -w '/plugin/velochatx/ -> %{http_code}\n' http://127.0.0.1:18081/plugin/velochatx/
curl -s -o /dev/null -w '/velochatx/        -> %{http_code}\n' http://127.0.0.1:18081/velochatx/
docker inspect -f '{{.State.Status}} / {{if .State.Health}}{{.State.Health.Status}}{{end}}' \
  nitrowater-static-docs
```

判定：

- `/plugin/velochatx/` 200：正常，旧镜像就是这套路径。
- `/velochatx/` 200 但 `/plugin/velochatx/` 404：说明以后换成空前缀镜像了，那时要反向改回来。
- 两个都 404：检查 `DOCS_REPO` / `DOCS_TAG` 是否拉到了正确镜像。
- 路径 200 但容器 unhealthy：说明宿主机上的 `docker-compose.yml` 还是旧健康检查。重新同步
  `deploy/`（tar 合并，别 `rm -rf deploy`），再 `$COMPOSE up -d --no-build docs` 重建容器即可。

首页链接同样是构建期变量：改仓库 Variables 的 `VITE_DOCS_URL` 后重跑 `build.yml`
（默认已是 `/plugin/velochatx/`），服务器 `.env` 改它没有用。

### 备案号 / 公安备案号不显示

它们被烘焙进 JS，先确认当前镜像里到底有没有：

```bash
cd /opt/nitrowater-static
docker exec nitrowater-static-portal sh -c \
  "grep -R -o 'ICP[^\"< ]*' /usr/share/nginx/html/assets 2>/dev/null | head || echo NOT_FOUND"
```

本地确认 GitHub 仓库 Variables（不是 Secrets，也不是服务器 `.env`）：

```bash
gh variable get VITE_BEIAN_NO -R Danburen/nitrowater-static
gh variable get VITE_GONGAN_NO -R Danburen/nitrowater-static
```

修复：设置变量 → 重跑 `build.yml` → 宿主机重新拉 portal：

```bash
export PORTAL_TAG=latest
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"
$COMPOSE pull portal
$COMPOSE up -d --no-build portal
```

## 8. 前端入站预览

`.github/workflows/pages.yml` 把门户发布到 GitHub Pages（`https://danburen.github.io/nitrowater-static/`）。
门户是单首页 + 相对资源路径（`base: './'`），Pages 项目站点无需任何 rewrite 配置。
Pages 只有构建期注入：外链读仓库 Variables `VITE_DOCS_URL` / `VITE_TOOLS_URL` 等；
备案号故意不注入（`danburen.github.io` 在境外、不是备案域名），页脚不显示。
镜像（`build.yml`）则把 `VITE_BEIAN_NO` / `VITE_GONGAN_NO` / `VITE_GONGAN_URL`
一起烘焙进 JS，供真实域名部署展示。
