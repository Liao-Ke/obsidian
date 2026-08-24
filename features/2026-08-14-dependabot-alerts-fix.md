# 修复 10 条 Dependabot Alerts

## 目标

消除 GitHub Dependabot 报告的 10 条安全告警（均为 devDependencies 传递依赖）。

## 修改范围

- `package.json`：新增 `overrides` 强制传递依赖升至安全版本
- `package-lock.json`：重新解析依赖树

## 核心实现

| 包 | 原版本 | 新版本 | 修复的告警 |
|---|---|---|---|
| vite | 5.4.21 | 6.4.3 | GHSA-4w7w-66w2-5vf9 / GHSA-fx2h-pf6j-xcff / GHSA-v6wh-96g9-6wx3 |
| js-yaml | 3.14.2 | 3.15.1 | GHSA-h67p-54hq-rp68 / GHSA-52cp-r559-cp3m / GHSA-5p4m-2wfm-xmqj |
| postcss | 8.5.13 | 8.5.26 | GHSA-r28c-9q8g-f849 / GHSA-fxqj-rqcc-2cmp |
| linkify-it | 5.0.0 | 5.0.2 | GHSA-v245-v573-v5vm |
| markdown-it | 14.1.1 | 14.3.0 | GHSA-6v5v-wf23-fmfq |
| less | 4.6.4 | 4.9.0 | 附带修复 image-size（GHSA-w3rx-r6r6-pgpr / GHSA-5p2g-fcmc-qvqq） |

方案参照已验证的 everyday 仓库：vitepress 1.6.4 硬锁 `vite ^5.4.14`，而 vite 5.x 已 EOL 无安全补丁，故用 npm overrides 强制升 vite 6.4.3。

## 影响范围

- 仅影响构建工具链，不涉及笔记内容
- vitepress 保持 1.6.4 不变，vite 6.4.3 已实测构建通过

## 验证方式

- `npm audit`：0 vulnerabilities
- `npm run docs:build`：构建成功（30.8s）

## 已知限制

- `allowScripts` 字段（npm 12 新增）记录 esbuild 安装脚本已批准，为 npm 自动生成
- vite 7/8 的修复版本更新，待 vitepress 2.x 稳定后可考虑继续跟进
