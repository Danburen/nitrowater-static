# 部署说明 — nitrowater-static

门户（本仓构建）、文档（`nitrowater-plugin-docs`）、工具箱（`nitrowater` 的 tools target）三个静态 nginx 镜像。

## 1. 前置

```bash
docker network create nitrowater-net
cp deploy/docker/.env.example deploy/docker/.env   # 域名 / SSL_EMAIL / *_TAG
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"
```

## 2. 本地预览

```bash
$COMPOSE up -d portal docs tools
# 门户 :18080   文档 :18081/plugin/velochatx/   工具箱 :18082
```

## 3. 公网发布

```bash
$COMPOSE --profile edge up -d
```

主栈已占用 80/443 时不要启用 edge profile，DNS 指向已有反代即可。

## 4. 更新 / 回滚

```bash
$COMPOSE pull portal
$COMPOSE up -d --no-build portal
# 回滚：PORTAL_TAG=<旧 sha> 再执行一次
```

## 5. GitHub Actions

仓库 Variables（`Settings → Secrets and variables → Actions → Variables`）：

- 必填：`VITE_BEIAN_NO`、`VITE_GONGAN_NO`
- 可选：`VITE_GONGAN_URL`、`VITE_DOCS_URL`、`VITE_TOOLS_URL`、`VITE_GITHUB_URL`、`VITE_GITHUB_PROFILE_URL`、`VITE_STATIC_REPO_URL`、`DEPLOY_ROOT`

```bash
gh variable set VITE_BEIAN_NO -R Danburen/nitrowater-static --body '粤ICP备xxxxxxxx号'
gh variable set VITE_GONGAN_NO -R Danburen/nitrowater-static --body 'xxxxxxxxxxxxxxxxxx'
gh workflow run build.yml -R Danburen/nitrowater-static
```

Environment Secrets（`Settings → Environments → app_nitrowater_static_deploy`）：

- 必填：`SSH_HOST`、`SSH_USER`、`SSH_KEY`（私钥全文）
- 可选：`SSH_PORT`（默认 22）、`SSH_PASSPHRASE`、`SSH_FINGERPRINT`、`GHCR_USER`、`GHCR_PAT`

```bash
gh secret set SSH_HOST -R Danburen/nitrowater-static --env app_nitrowater_static_deploy --body '<host>'
gh secret set SSH_USER -R Danburen/nitrowater-static --env app_nitrowater_static_deploy --body '<user>'
gh secret set SSH_KEY  -R Danburen/nitrowater-static --env app_nitrowater_static_deploy < ~/.ssh/id_ed25519
```

仓库设置 `Settings → Actions → General → Workflow permissions` 选 Read and write。

发布 / 回滚：

```bash
gh workflow run deploy.yml -R Danburen/nitrowater-static -f tag=latest -f registry=ghcr.io
gh workflow run deploy.yml -R Danburen/nitrowater-static -f ref=<commit-sha> -f registry=ghcr.io
```

`build.yml` 重建镜像后需重新 pull portal 才显示新备案号；`deploy.yml` 只部署已有镜像。Pages 是可选预览，不显示备案号。

## 6. 宿主机首次准备

```bash
mkdir -p /opt/nitrowater-static && cd /opt/nitrowater-static
tar -xzf ~/nitrowater-static-deploy.tgz
cp -n deploy/docker/.env.example deploy/docker/.env
vi deploy/docker/.env
COMPOSE="docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml"
$COMPOSE up -d portal docs tools
```

`deploy/` 按目录合并，不要 `rm -rf deploy`（`.env` 是宿主机状态）。

## 7. 验证

```bash
curl -fsS http://127.0.0.1:18080/healthz
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18081/plugin/velochatx/
docker logs --tail 100 nitrowater-static-portal
```
