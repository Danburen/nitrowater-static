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
# 门户 http://127.0.0.1:18080   文档 http://127.0.0.1:18081/velochatx/   工具箱 http://127.0.0.1:18082/
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml ps
```

## 3. 公网发布

```bash
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml --profile edge up -d
```

`nginx-proxy` 按容器的 `VIRTUAL_HOST` 反代，`acme-companion` 按 `LETSENCRYPT_HOST` 签发/续期证书。
文档镜像根路径 `/` 按设计是 404，入口是 `/velochatx/`。

> ⚠️ 若 nitrowater 主栈已在本机跑 edge（80/443），**不要**在这里启用 edge profile——
> 直接让 DNS 指向已有反代即可，否则端口冲突。主栈的 `VIRTUAL_HOST` 占用了 `nitrowater.cn`，
> 本仓门户默认用 `static.nitrowater.cn`；要改为主域名时先在主栈释放该 host。

> 为什么默认走子域名：`nginx-proxy` 按 `VIRTUAL_HOST` 自动路由，一站点一域名最省事。
> 同域名走路径前缀（如 `/docs/`、`/tools/`）要额外写 `location` 反代，且两个静态包都得支持子路径
> （文档入口本身是 `/velochatx/`，工具箱 SPA 还要处理 base/publicPath），明显更复杂；
> 不同端口则要对外暴露端口，证书配置也更麻烦。所以其他方式可以做，但复杂度更高。

## 4. 更新与回滚

三个镜像独立发版，改 `.env` 里的 `*_TAG` 后只更新对应服务：

```bash
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml pull docs
docker compose --env-file deploy/docker/.env -f deploy/docker/docker-compose.yml up -d --no-build docs
```

回滚 = 把 tag 改回旧的 sha（各仓库 workflow 每次推送 `latest` + `<sha>` 两个 tag）。

## 5. 前端入站预览

`.github/workflows/pages.yml` 把门户发布到 GitHub Pages（`https://danburen.github.io/nitrowater-static/`）。
门户是单首页 + 相对资源路径（`base: './'`），Pages 项目站点无需任何 rewrite 配置；
外链由 `VITE_DOCS_URL` / `VITE_TOOLS_URL` 仓库变量在构建期注入，改地址不用动 nginx。
备案号用 `VITE_BEIAN_NO` 注入（留空则页脚隐藏，填入后链接指向 `https://beian.miit.gov.cn/`）；
镜像构建时通过 `build-args` 传入（`build.yml` 已接好），Pages 预览则读同名仓库变量。
