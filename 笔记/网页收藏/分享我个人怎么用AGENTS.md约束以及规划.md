---
来自: "https://linux.do/t/topic/2398570"
收藏时间: 2026年06月14日 星期日 12:32:43
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本帖由用户 **Hexon-X** 分享了其项目（HexLM）中用于约束和规划 AI Agent 行为的规范文档。
> 
> 主要内容包括：
> 1.  **环境与工具配置**：定义了在 Windows 环境下使用 Scoop 安装的现代化 CLI 工具链（如 `rg`, `fd`, `eza`, `gh`, `yq` 等），以提高文件操作和搜索效率。
> 2.  **协作规则 (`CLAUDE.md`)**：制定了 AI 协作流程，区分了何时触发 OpenSpec 流程（新功能、破坏性变更）与何时直接修复（Bug、格式化）。明确了任务分级、验证策略和 Conventional Commits 提交规范。
> 3.  **Spec-Driven 变更流程 (`OpenSpec/AGENTS.md`)**：建立了严格的提案、审批、实施和归档流程，包含任务分级（L0-L2）、验证策略、双语策略及版本发布巡航机制。
> 4.  **项目上下文 (`OpenSpec/project.md`)**：介绍了 HexLM 软件授权管理系统的技术栈（Go + Vue）、架构分层、业务概念及前后端约定。
> 5.  **路线图 (`OpenSpec/roadmap.md`)**：总结了当前已完成的治理（发布闭环、权限治理、业务验证），并计划下一阶段重点推进“可发布、可审计、可验证”方向。
> 
> 社区对此分享给予了高度评价，认为其规划文档涵盖场景全面（版本巡航、提交规范等），值得借鉴。


**这是什么？：**  
这个帖子是为了更好规范Agents行为，利用OpenSpec/Superpowers为项目做规范/规划的，Agents一般都会自动读取根目录/AGENTS.md文件，帖主分享了自己的规范/规划文件，望佬友们可以按需借鉴以及提建议。

[![PixPin_2026-06-14_00-36-04](https://cdn3.ldstatic.com/optimized/4X/5/7/1/5714ff0099b2727bbe6a9795066013528ffe4d14_2_184x500.png)

PixPin\_2026-06-14\_00-36-04300×812 30.1 KB

](https://cdn3.ldstatic.com/original/4X/5/7/1/5714ff0099b2727bbe6a9795066013528ffe4d14.png "PixPin_2026-06-14_00-36-04")

  
这是我的项目目录，红框+白框是 OpenSpec 文件夹是一些项目说明，规划路线。  
接下来的绿框是根目录AGENTS.md，里面放了指导OpenSpec以及可用工具说明

根目录 AGENTS.md 内容
```
# AGENTS.md

本仓库的 AI 协作规则统一写在 [./CLAUDE.md](./CLAUDE.md)，请先阅读。

Spec-driven 变更流程详见 [./OpenSpec/AGENTS.md](./OpenSpec/AGENTS.md)。

项目领域知识详见 [./OpenSpec/project.md](./OpenSpec/project.md)。

项目计划（缺什么、要做什么）详见 [./OpenSpec/roadmap.md](./OpenSpec/roadmap.md)。

# System Environment & Toolchain Context

You are operating in a highly customized Windows environment running modern PowerShell (pwsh). However, the user has installed a complete suite of modern, Rust-based, Linux-equivalent CLI tools via Scoop. 

**DO NOT** use traditional, verbose PowerShell cmdlets (like \`Get-ChildItem\`, \`Select-String\`, \`Get-Content\`) unless absolutely necessary for Windows-specific OS interactions.

You have full access to the following modern CLI tools. Please prioritize using them for file system operations, reading, and searching:

1. **Coreutils (\`uutils-coreutils\`)**: Native Windows ports of GNU tools. You can safely use \`cp\`, \`mv\`, \`rm -rf\`, \`mkdir\`, \`cat\`, \`head\`, \`tail\`, \`touch\` exactly as you would in Linux.
2. **Search & Find**:
   - Use \`rg\` (ripgrep) for searching file contents instead of \`grep\` or \`Select-String\`.
   - Use \`fd\` for finding files/directories instead of \`find\` or \`dir\`.
3. **Directory Listing**:
   - Use \`eza\` instead of \`ls\`.
   - Use \`eza --tree\` instead of \`tree\` to visualize directory structures (it respects \`.gitignore\`).
4. **File Reading**:
   - Use \`bat\` (which provides syntax highlighting) if you need the user to read code snippets in the terminal.
5. **Data Processing**:
   - \`jq\` is available for parsing and modifying JSON files.
6. **Version Control**:
   - \`gh\` (GitHub CLI) is authenticated and ready. You can use it to create PRs, list issues, etc.
   - \`delta\` is configured for \`git diff\`.
7. **Additional Developer Utilities**:
   - \`make\` is available and should be used for repository-defined workflows such as \`make test\` or \`make release-preflight\`.
   - \`hyperfine\` is available for command/runtime performance comparisons.
   - \`watchexec\` is available for file-watch driven test/build loops.
   - \`yq\` is available for YAML processing, especially Docker Compose, GitHub Actions, and config templates.
   - \`tokei\` is available for codebase statistics.
   - \`xh\` is available for readable HTTP/API smoke tests; \`curl\` is also available when raw curl behavior is preferred.
   - \`sd\` is available for simple find-and-replace tasks. Note: the installed Scoop package is \`sd\` 1.1.0, but the upstream Windows binary reports \`sd 1.0.0\` via \`sd --version\`; a functional smoke test confirmed replacements work.

**Execution Rules:**
- Write shell scripts or commands assuming these tools are globally available in the \`PATH\`.
- If a Codex/agent shell does not inherit the user's normal PATH, prepend the Scoop shims directory before running CLI-heavy commands:
  \` $env:Path = "$HOME\scoop\shims;$env:Path" \`
- Verify command resolution with \`Get-Command\` when behavior looks suspicious. Linux-style commands such as \`cat\`, \`cp\`, \`mv\`, \`rm\`, \`mkdir\`, \`head\`, \`tail\`, and \`touch\` should resolve to Scoop/uutils executables, not PowerShell aliases or cmdlets. If PowerShell still shadows them in the current process, call the explicit executable name (for example \`cat.exe\`, \`rm.exe\`) or fix the session PATH/alias state before continuing.
- When asked to explore the codebase, utilize \`fd\` and \`rg\` for blazing-fast context gathering.
- Maintain PowerShell script compatibility for logic (variables, loops), but use the tools above for I/O and text processing.
```
根目录 CLAUDE.md 内容
```
# CLAUDE.md

本仓库的 AI 协作规则。Claude Code、Codex 等 AI agent 在本仓库工作时遵循此文件。

## 何时触发 OpenSpec 流程

请求涉及以下情形时，先打开 \`./OpenSpec/AGENTS.md\`，按 spec-driven 流程开 change 提案，**经我（用户）审批后再动手**：

- 新能力 / 新接口 / 新模块
- 跨模块的重构、抽象重塑、依赖反转
- 数据模型、接口契约的破坏性变更
- 安全策略、认证机制、限流策略调整
- 大规模性能优化（影响行为）

可以**跳过提案直接动手**的：

- bug 修复（恢复原本预期行为）
- 拼写、注释、格式化
- 配置项调整、依赖版本升级（非破坏性）
- 已有行为的测试补充

不确定走哪条时，倾向开提案。

## Superpowers 执行增强边界

如果当前 AI agent 安装了 Superpowers，可把它作为执行增强层使用，但**不替代 OpenSpec**：

- OpenSpec 仍是本仓库新能力、跨模块重构、破坏性变更、安全 / 认证 / 限流 / 性能策略变更的唯一项目级提案、审批和归档流程。
- Superpowers 的 \`brainstorming\` 可用于 OpenSpec proposal 前的需求澄清与方案收敛。
- Superpowers 的 \`writing-plans\` 可用于把已批准的 proposal / design 细化成 \`OpenSpec/changes/<id>/tasks.md\` 中的可执行任务。
- Superpowers 的 \`test-driven-development\` 优先用于高风险业务逻辑、bug 复现修复、状态机、认证、扣费、支付、安全策略等变更；低风险文案、样式、配置微调不强制 TDD。
- Superpowers 的 \`systematic-debugging\`、\`verification-before-completion\`、\`requesting-code-review\` 可用于实施和交付前自检，但不能绕过本文件的验证策略和用户确认边界。
- 如 Superpowers 流程与本文件、\`OpenSpec/AGENTS.md\` 或用户明确指令冲突，优先遵循本仓库规则和用户指令。

## 工作风格与方法

### 基本纪律

- **证据优先**：关键判断基于代码、配置、日志、文档、命令输出和可复现现象，不基于猜测。
- **中文沟通**：面向用户的进度、计划、交付说明和风险提示默认使用中文。
- **不假装验证**：没跑过的测试、没打开过的页面、没确认过的现象，不能写成已验证。
- **规则服务于交付**：低风险小改不要过度仪式化；高风险改动必须先把范围、风险和验证讲清楚。

### 重要：先理解再动键盘

任何非琐碎任务，尤其涉及复杂系统（认证链路、状态机、并发扣费、UI 交互），**思考在前，编码在后**。

### 任务分级

| 级别 | 适用场景 | 执行要求 |
|---|---|---|
| L0 | bug 修复、文案 / 样式 / 配置微调、单文件小改 | 可直接执行并验证，交付时说明改动和结果 |
| L1 | 多文件联动、中等功能开发、局部重构 | 先收集上下文，给出简要计划，再实施和验证 |
| L2 | 新模块、跨模块重构、数据库 / 权限 / 安全 / 性能策略、核心流程调整 | 走 OpenSpec 或等价审批流程，用户确认后再实施 |

### 流程

1. **彻底分析** — 改动前读懂相关代码、调用链、边界条件。
2. **映射依赖** — 找出所有调用方、副作用、潜在回归点。
3. **澄清需求** — 任何含糊、歧义、可多解读处，**停下来问**。不假设、不猜测。
4. **完整设计** — 在脑里跑通整个方案。
5. **提出计划** — 写代码前先把策略清晰说出来。
6. **谨慎实施** — 按已认可的计划推进，逐步落地。
7. **不偏离计划** — 不为了快速修复绕过已确认的方向。

### 绝对禁止

- 没搞清楚根因就反应式改代码。
- 修一个 bug 引入新的 bug（打转）。
- 实施过程中频繁切换方案。
- "快速修复"破坏其他逻辑。
- 跳过分析直接写代码。

### 如果卡住

1. **停下** — 不要继续盲目尝试。
2. **后退** — 重新审视整个系统。
3. **加日志** — 必要时（如调试运行时行为）插入日志辅助理解，而不是猜。后端用 \`kit.Logger\` (zap)，前端调试可用 \`console.log\` 但生产代码须清理。
4. **问我** — 请用户澄清上下文或决策点。
5. **重新设计** — 基于新理解重做方案。

同类方案连续失败 2 次后，应暂停叠补丁，回到根因分析；连续失败 3 次仍无法确认方向时，必须把现象、已排除项和下一步选择说明给用户。

10 分钟的前期分析胜过 60 分钟的打转。

### 用户确认边界

默认可直接执行：

- 读取、检索、比较、总结。
- 用户已明确要求的低风险代码或文档修改。
- 测试、构建、格式化、状态查看。
- \`git status\`、\`git diff\`、\`git log\`、\`git add\`。

必须先确认：

- \`git commit\`（除非用户明确说提交）、\`git push\`、\`git reset\`、\`git rebase\`、force 系列操作。
- 删除核心文件、批量删除、破坏性移动。
- 引入新依赖、改数据库 Schema、改认证 / 权限 / 安全策略。
- 影响生产、真实数据、外部服务或付费资源的操作。
- 实施中需要明显扩大范围、改变已确认方案或牺牲既有行为。

### 验证策略

| 改动类型 | 基础验证 |
|---|---|
| 纯逻辑修改 | 单元测试 / 类型检查 |
| 接口或 service | 单元测试、集成路径或接口冒烟 |
| 前端交互 | 构建检查 + 关键路径验证 |
| 图表、地图、canvas、复杂可视化 | 真实浏览器或 Playwright 验证，并检查控制台关键错误 |
| 数据库变更 | 迁移验证、读写验证、回滚影响评估 |
| 配置 / 构建 | 构建、启动或配置解析验证 |

验证失败时，交付或中途说明必须包含失败现象、复现方式、初步原因和下一步策略。

## 提交风格

公开仓库提交信息统一使用英文，采用 Conventional Commits + 三段式正文：
```

():

What changed:

Impact:

- <affected files / modules / APIs / behavior>

Validation:

- <tests, builds, or manual checks performed>
```
\`<type>\` 取值：\`feat\` / \`fix\` / \`refactor\` / \`chore\` / \`docs\` / \`test\` / \`style\` / \`perf\`。

公开提交标题和正文不得提及内部协作文件、内部规划目录、AI 工具、提示词或本地参考仓库；这些信息只保留在本地规则、OpenSpec 和私有 exclude 中。

**不自动提交** — 仅在用户明确说"提交"或等价指令时才创建 commit。

## 工具偏好

- Shell 用 Unix 语法（仓库在 Windows 但 shell 是 bash）：路径用 \`/\`，\`/dev/null\` 而非 \`NUL\`。
- 项目内文件搜索默认用 Glob，跨项目 / 全盘定位用 everything-search。
- 内容搜索用 Grep，读文件用 Read，**禁止**用 \`find\` / \`grep\` / \`cat\` / \`sed\`。
- 代码编辑（Go / Vue / TypeScript）优先用 Serena 的符号级工具（\`find_symbol\` / \`replace_symbol_body\` / \`rename_symbol\` / \`insert_after_symbol\` 等），尤其针对大文件与跨文件重命名；非代码文件（md / yaml / json / 配置）、小颗粒度文本调整、新建文件用 Edit / Write。
- Serena 使用前确认项目已 \`activate_project\` 并完成 onboarding；LSP 异常时降级回 Edit。
- 后端结构化日志统一用 \`kit.Logger\` (zap)，不要 \`fmt.Println\`。

## 引用 OpenSpec

详细的 spec-driven 流程、change 文件模板、命名规则、双语策略、版本巡航等见 [\`./OpenSpec/AGENTS.md\`](./OpenSpec/AGENTS.md)。

项目领域知识、技术栈、架构分层、业务概念、前后端约定见 [\`./OpenSpec/project.md\`](./OpenSpec/project.md)。

项目当前缺什么、要做什么、优先级与状态见 [\`./OpenSpec/roadmap.md\`](./OpenSpec/roadmap.md)。
```

根目录AGENTS.md里面放了一些更适用于Codex用的工具  
你如果也想要，可以安装Scoop后，然后scoop install「名称」

#OpenSpec 目录

OpenSpec/AGENTS.md 内容
```markdown
# OpenSpec — Spec-driven 变更流程

本仓库的变更管理规则。任何**新能力 / 跨模块重构 / 破坏性变更 / 架构调整 / 安全或性能策略变更**都先在 \`changes/\` 下开提案，**用户审批后再动手**。

## 触发与跳过

### 任务分级与提案边界

| 级别 | 适用场景 | OpenSpec 要求 |
|---|---|---|
| L0 | bug 修复、typo、注释、格式化、单文件低风险微调、已有行为测试补充 | 可跳过提案，直接修复并验证 |
| L1 | 多文件联动、局部重构、非破坏性配置 / 依赖调整、已有能力的小范围体验优化 | 通常可直接实施；如范围或风险扩大，升级为 L2 |
| L2 | 新能力 / 新接口 / 新模块、跨模块重构、架构调整、破坏性契约变更、安全 / 认证 / 限流策略、性能策略变更 | 必须开 OpenSpec change，用户审批后再动手 |

走完整提案流程：

- 新接口、新模块、新能力域
- 跨模块重构、抽象层调整
- 数据模型 / API 契约破坏性变更
- 安全 / 认证 / 限流策略调整
- 性能策略变更，尤其是改变懒加载、缓存、条件挂载、组件生命周期、资源释放、图表 / 地图初始化时机的优化

直接动手（跳过提案）：

- bug 修复、typo、注释、格式化
- 配置项调整、非破坏性依赖升级
- 已有行为的测试补充

不确定时倾向开提案。

## 目录结构
```

OpenSpec/  
├── AGENTS.md # 本文件  
├── project.md # 项目领域知识、技术栈、约定  
├── specs/ # 已建成能力的事实档案  
│ └── /  
│ └── spec.md  
└── changes/ # 进行中的提案  
├── \_template/ # change 文件样板（复制后改名）  
├── /  
│ ├── proposal.md  
│ ├── tasks.md  
│ ├── design.md # 仅在跨模块/有迁移时写  
│ └── specs//spec.md  
└── archive/  
└── -/

```
## 工作流四阶段

### 1. 提案

- 选 change-id：kebab-case + 动词前缀（\`add-\` / \`update-\` / \`refactor-\` / \`remove-\` / \`fix-\`）。
- 创建 \`changes/<id>/\`，从 \`_template/\` 复制 \`proposal.md\`、\`tasks.md\` 起步。
- 跨模块或有迁移再加 \`design.md\`。
- 涉及能力变更时在 \`changes/<id>/specs/<capability>/spec.md\` 写 delta（\`ADDED\` / \`MODIFIED\` / \`REMOVED\` / \`RENAMED\`）。

### 2. 审批门

- 把 proposal 摘要贴在对话里，**等用户说"动手"或等价指令才进入实施**。
- 用户可能要求修改 proposal，按反馈迭代直到通过。

### 3. 实施

- 按 \`tasks.md\` 顺序推进，**完成一项立刻把 \`- [ ]\` 改成 \`- [x]\`**，不要批量勾。
- 实施中发现 proposal/tasks 需要调整，**先停下问用户**，不擅自扩展范围。
- 完成后跑 Validation 节里的命令（构建、测试等）。
- 同类验证或修复连续失败 2 次后，暂停继续叠补丁，回到根因分析；连续失败 3 次仍无法确认方向时，必须向用户说明现象、已排除项、风险和下一步选择。

### Validation 策略

\`tasks.md\` 的 Validation 节应按改动风险选择验证方式，不能只写笼统的"运行测试"：

| 改动类型 | 必要验证 |
|---|---|
| 纯逻辑 / 工具函数 | 单元测试或类型检查 |
| API / service / middleware | 单元测试、接口路径测试或冒烟验证 |
| 前端页面 / 交互 | 构建检查 + 关键路径验证 |
| 图表 / 地图 / canvas / 虚拟列表 | 真实浏览器或 Playwright 验证，并检查控制台关键错误 |
| 数据库 / 迁移 | 迁移验证、读写验证、历史数据兼容和回滚影响评估 |
| 配置 / 构建 / 部署 | 构建、启动或配置解析验证 |
| 性能优化 | 优化前后指标对比 + 关键用户行为回归验证 |

### 性能优化防回归约束

性能优化的第一目标是降低资源占用，第二目标是保持既有行为不变。只要优化会调整资源加载、组件挂载、缓存生命周期或第三方库注册方式，就按"性能策略变更"处理，proposal / tasks 必须写清：

- **保留行为**：用户原本能看到、点击、刷新后恢复的关键界面状态，优化后仍然成立。
- **依赖副作用**：懒加载或拆包后，第三方库的注册 / side effect / renderer / plugin 是否仍在首次使用前完成。
- **回归场景**：至少覆盖首屏进入、浏览器刷新、路由来回切换、空数据、有数据、接口失败后重试。
- **前端可视化验证**：涉及图表、地图、canvas、虚拟列表时，Validation 必须包含真实浏览器验证或等价的 Playwright 断言，并检查控制台关键错误。
- **资源收益边界**：记录优化前后的主要指标（如初始内存、chunk 体积、实例数），避免为了小收益牺牲核心显示。

如果优化实施后出现用户可见回归，应先撤回或隔离该优化，再按 bug 修复重新定位根因；不能在未确认根因时继续叠加修补。

### 4. 归档

- 全部任务勾完后，\`changes/<id>/\` 移到 \`changes/archive/<YYYY-MM-DD>-<id>/\`。
- 如果 change 写了 spec delta，把它合并到 \`OpenSpec/specs/<capability>/spec.md\`。
- 提交信息使用英文，例如：\`chore: archive <change-id>\`。

## Commit Message Policy

公开仓库提交信息统一使用英文，采用 Conventional Commits：

\`\`\`text
<type>(<optional scope>): <short English summary>

What changed:
- <what changed and why>

Impact:
- <affected files / modules / APIs / behavior>

Validation:
- <tests, builds, or manual checks performed>
```

`<type>` 取值：`feat` / `fix` / `refactor` / `chore` / `docs` / `test` / `style` / `perf`。

公开提交标题和正文不得提及内部协作文件、内部规划目录、AI 工具、提示词或本地参考仓库。OpenSpec、AGENTS / CLAUDE 类规则文件和本地参考资料应通过本地 ignore / exclude 留在私有工作区。

## 双语策略

| 内容 | 语言 |
| --- | --- |
| 章节标题（`## Why` / `## What Changes` / `## Impact`） | 英文 |
| Requirement 标题（`### Requirement: ...`） | 英文 |
| Scenario 标题（`#### Scenario: ...`） | 中文 OK |
| WHEN / THEN / AND 关键词 | **英文加粗** |
| 正文叙述、动机、影响、风险 | 中文 |

英文骨架保证可被 grep 锚定，中文叙述保证可读性。

## 命名

### change-id

- 前缀（必选）：`add-` / `update-` / `refactor-` / `remove-` / `fix-`
- 描述：3–5 个英文词，kebab-case
- 重名追加 `-2` / `-3`

例：`refactor-client-api-modularization` / `add-admin-login-captcha`

### capability

复合名词，单一职责，10 分钟内能讲清。需要"AND"才能说明的应当拆分。

例：`admin-authentication` / `client-api-structure` / `order-state-machine`

## Spec 文件格式

### 必备结构

```markdown
## ADDED Requirements

### Requirement: <英文名>
The system SHALL <行为描述，可中可英>。

#### Scenario: 用户做 X 的时候
- **WHEN** <触发条件>
- **THEN** <预期结果>
- **AND** <附加结果>
```

### Delta 操作前缀

- `## ADDED Requirements` — 新增
- `## MODIFIED Requirements` — 修改（**必须把整个 Requirement 块完整粘贴并改写**，不能只贴差异）
- `## REMOVED Requirements` — 移除（附 `**Reason**:` 和 `**Migration**:`）
- `## RENAMED Requirements` — 仅改名，用 `- FROM:` / `- TO:` 列出新旧标题

### 易踩的坑

- `#### Scenario:` 必须 4 个 `#`，**不要**用 `- **Scenario:**` 或 `### Scenario:`。
- 每个 Requirement 至少一个 Scenario。
- MODIFIED 要粘贴完整块（含全部 Scenario），否则归档时旧细节会丢。

## 自检清单（提交 proposal 前）

- change-id 唯一、kebab-case、有动词前缀
- `proposal.md` 三段都有：Why / What Changes / Impact
- `tasks.md` 至少有 Validation 节
- spec delta 文件每个 Requirement 至少一个 Scenario
- 跨模块或有迁移的，已写 `design.md`
- 破坏性变更已在 `What Changes` 用 `**BREAKING**:` 标注

## 不引入的东西

- `openspec` 官方 CLI（不依赖外部工具）
- `<!-- OPENSPEC:START -->` 等受管理标记
- 通用 AI 代理规范全文（OpenSpec 文件只保留变更流程相关规则）
- 强制 SHALL/MUST 全大写（自然行文即可）
- 强制全英文（保留中文叙述能力）
- 默认自动提交、强制每次进度面板、详尽注释等与本仓库规则冲突的要求

## 版本发布与更新日志巡航

项目版本号与用户可见更新日志通过"锚点 + 巡航"模式由 AI 协助维护，**AI 不在每次提交时主动写日志**。

### 真相源

- 用户可见更新日志默认模板：`assets/changelogs.json`（后端 API 首次读取；运行时编辑会写入 `data/changelogs.json`）
- 公开 Markdown 更新日志：`docs/CHANGELOG.md`（由 `assets/changelogs.json` 同步生成，供仓库浏览）
- 后端版本常量：`api/system_about.go` 的 `Version` / `BuildDate` / `BuildNumber`
- 前端版本号：`frontend/package.json` 的 `version`（与后端 `Version` 同步）
- 锚点状态：本文件末尾的"当前发布锚点"块

### 触发短语

下列任一即触发巡航，AI 收到后立即进入流程：

- `检查锚点更新`
- `巡航`
- `盘点发版`

### 巡航步骤

1. **读锚点**：从本文件"当前发布锚点"块提取 `commit` / `version` / `date` 三字段。
2. **取增量**：跑 `git log <anchor-commit>..HEAD --format='%h|%s|%b'` 取自锚点以来全部提交的标题与正文。
3. **分类与过滤**：
	- `feat:` / 含 `BREAKING` → 必收
		- `fix:` → 必收
		- `refactor:` / `perf:` → 视影响范围判断后呈用户审
		- `chore:` / `docs:` / `style:` / `test:` → 默认跳过，用户可指定纳入
4. **翻译为用户视角**：commit 标题是开发者语言，changelog 描述要面向产品视角。读 commit body 中的 `Impact` 段落辅助判断用户感知，**不要直接复制 commit 标题**。
5. **建议版本号（固定补丁递增）**：
	- 常规巡航默认只递增补丁号：`X.Y.Z` → `X.Y.(Z+1)`。
		- 即使包含 `feat:`，默认也按 `0.0.1` 节奏逐版递增，不自动提升 minor / major。
		- 仅当用户明确要求大版本 / 小版本升级、破坏性发布或重置版本线时，才建议 `X+1.0.0` 或 `X.Y+1.0`。
		- 仅作建议，**最终版本号由用户拍板**。
6. **草稿呈审**：把分类后条目和建议版本号贴入对话，等用户回 “改 / 删 / 加 / 通过”。
7. **执行（用户通过后单笔提交）**：
	- Edit `assets/changelogs.json` —— 数组开头插入 `{id, version, date, tag, changes: [{type, desc}, ...]}`
		- Regenerate `docs/CHANGELOG.md` —— 从 `assets/changelogs.json` 同步生成公开 Markdown 更新日志
		- Edit `api/system_about.go` —— 更新 `Version`、`BuildDate`（`YYYY-MM-DD`）、`BuildNumber`（`YYYYMMDD.001` 起，同日多次发布递增尾号）
		- Edit `frontend/package.json` —— `version` 同步为新版本号
		- Edit 本文件"当前发布锚点"块 —— 写入新 HEAD 的 short hash、新 version、今天的日期
		- Run release preflight —— `make release-preflight`；若当前机器无 `make`，按 `docs/RELEASE.md` 手动执行等价命令
		- 单笔 commit message：`chore: release X.Y.Z`
		- 在 commit 完成后打轻量 tag：`git tag vX.Y.Z`（Windows 下也用 Unix 语法），便于 git 工具直接按版本号回溯发布点
8. **收尾报告**：把新锚点、提交 hash 与 tag 名报给用户。

### type 字段映射

| commit prefix | `changelogs.json` 中的 `type` |
| --- | --- |
| `feat` | `feature` |
| `fix` | `fix` |
| `refactor` / `perf` / `style` | `improve` |
| 含 `BREAKING` | `breaking` |

### tag 字段选用

- 默认 `latest`
- 用户明确说"稳定版" → `stable`
- 用户明确说"测试版" → `beta`

### 异常处理

- **锚点 commit 不存在**（rebase / force-push 后丢失）→ 立即停止流程，汇报并请求用户指定新锚点。
- **锚点 == HEAD**（无增量）→ 报告"锚点之后无新提交"，不动任何文件。
- **无任何"必收"类型条目** → 报告"无用户可见变更"，询问用户是否仍要发布（如紧急 patch）。

### 当前发布锚点

- commit: `268a7aa`
- version: `3.4.6`
- date: `2026-05-31`
- note: HexLM public repository was reinitialized from the extracted source tree; earlier DragonHex/HexonExt commit history is intentionally unavailable.

OpenSpec/project.md 内容
```markdown
# HexLM (HexLM) 项目上下文

## 项目目的

HexLM 是软件授权管理系统，提供应用授权、用户管理、卡密激活、代理分销、云配置 / 云函数 / 推送 / 云存储等完整后端能力，配套统一的 Vue 管理后台。

## 技术栈

### 后端
- Go 1.25.10
- Gin 1.11（HTTP 框架）
- GORM 1.31（ORM）+ SQLite（默认嵌入式）/ MySQL（可选驱动）
- Redis 9.17（可选缓存层，不可用时降级为内存缓存）
- JWT（\`golang-jwt/jwt/v5\`）+ bcrypt（密码）+ circl（后量子加密）
- goja（云函数 JS 运行时）
- zap（结构化日志）+ lumberjack（日志切割）

### 前端
- Vue 3.5 + TypeScript 5.9，全部 Composition API + \`<script setup>\`
- Vite 7.2 / Vue Router 4 / Pinia 3
- shadcn-vue（reka-ui）+ Tailwind CSS 3.4
- Axios

## 目录结构
```

HexLM/  
├── main.go 后端入口，并在生产构建时嵌入 frontend/dist  
├── api/ HTTP handler，按业务域拆分（client\_\* / agent\_\* / system\_\* / cloud\_\* 等）  
├── config/ 配置加载、环境变量覆盖、安全预检  
├── database/  
│ ├── core/ DB / 缓存 / 安装 / 负载监控 / 版本化迁移  
│ └── models/ GORM 模型定义  
├── internal/  
│ ├── bootstrap/ 启动 + 路由注册（routes\_admin/agent/client/public/install）  
│ ├── services/ 业务服务层（订单状态机、对账、退款重试、订阅等）  
│ ├── middleware/ CSRF / 限流 / security headers / request\_id / metrics  
│ ├── kit/ 通用组件（jwt / crypto / errors / response / rate\_limiter / logger 等）  
│ ├── i18n/ 国际化消息  
│ ├── biztime/ 业务时间工具  
│ ├── maintenance/ 密钥迁移 / 轮换维护命令  
│ └── tools/ 内部工具入口  
├── payment/ 支付适配  
├── deploy/ Docker / Compose / 配置模板 / 部署脚本  
├── docs/ 公开文档  
└── frontend/  
└── src/  
├── views/ 按业务域分组（agent / apps / audit / cloud / dashboard / docs / license / market / system）  
├── components/ 可复用 UI 组件  
├── composables/ 复用逻辑（useAppData / useToast 等）  
├── stores/ Pinia store（user / app）  
├── router/ types/ utils/ lib/ config/ layout/ assets/  
└── …

```
## 架构分层

### 后端：API handler → service → database(core/models) → model

- \`api/\` 处理 HTTP 解码、参数校验、错误响应；不应承载复杂业务逻辑或多表事务。
- \`internal/services/\` 承载业务逻辑、状态机、跨表事务、对账重试；新代码优先通过 \`services.Provider\` 或显式 \`*gorm.DB\` 构造服务。
- \`database/core/\` 暴露包级 \`core.DB\` 和缓存抽象。**注意**：\`core.DB\` 当前仍是兼容全局，未来引入依赖注入需先拉齐接口契约。
- \`database/models/\` 仅 GORM 结构体定义、表名、钩子。
- \`internal/kit/\` 跨包通用工具（不依赖 \`api/\`）。

### 前端：view → store + composable → http util

- 视图按业务域分目录；store 管理跨页面状态；composable 提取重复逻辑；axios 实例集中配置在 \`lib/\`。

## 业务核心概念

| 概念 | 说明 |
|---|---|
| Application (App) | 被授权的软件产品，唯一 AppID + 密钥对 |
| LicenseUser | 终端用户，含设备绑定、时间/点数余额、试用记录 |
| Card | 预生成激活码，单次或多次使用，可充时间或点数 |
| Order | 购买交易，9 状态状态机（pending / paid / recharging / delivered / completed / refunding / refunded / refund_failed / cancelled） |
| SupplyOrder | 代理商以批发价向系统进货 |
| Agent | 分销商账户，含余额、佣金、供货历史 |
| Session | 客户端活跃连接，心跳维持 + 自动扣时 |
| Cloud * | 云配置 / 云函数 / 推送 / 云存储 |

## API 路径分层

- \`/auth/*\` — 管理员登录、令牌刷新
- \`/api/v1/*\` — 管理后台操作
- \`/api/v1/agent/*\` — 代理商门户 API
- \`/client/*\` — 软件客户端操作
- \`/api/docs/*\` — 接口文档、SDK 文档和接入指南数据
- \`/api/install/*\` — 首次安装向导
- \`/public/*\` — 无需鉴权的公开接口
- \`/api/shop/*\` — 公开商城接口
- \`/payment/callback/*\` — 支付回调

## 关键约束

### 技术
- SQLite 在高并发写场景下 \`FOR UPDATE\` 是库级锁，心跳扣费等热路径在 SQLite 下会成瓶颈。
- 单二进制部署：前后端打包在一起，不做分布式事务。
- Redis 不可用自动降级到内存缓存。
- 跨平台：通过 Go 编译支持 Windows / Linux / macOS。

### 业务
- 每个 App 的设备绑定数有上限，解绑扣费。
- 卡密可设过期日期。
- 代理商余额不足无法下供货单。
- 新用户自动获得试用时间（受试用限制策略约束）。

### 安全
- JWT 密钥 ≥32 字符，建议 6–12 个月轮换。
- 客户端 API 用 HMAC-SHA256 签名。
- 密码用 bcrypt（成本因子合理）。
- 限流：Redis 令牌桶 + 内存降级。
- 敏感 token / 签名比较应使用 constant-time；相关通用能力归入 \`internal/kit/\` 或专用服务。
- 前后端分离 + JWT，CSRF 在客户端 API 上禁用。

## 后端约定

### 命名
- 包名小写单词：\`api\` / \`models\` / \`services\`
- 导出标识符 PascalCase：\`User\` / \`GetUsers\`
- 私有标识符 camelCase：\`getUser\` / \`dbConn\`
- 文件名 snake_case：\`auth.go\` / \`license_user.go\`
- 结构体标签：\`json:"user_id" gorm:"column:user_id"\`

### 错误与日志
- 错误显式返回，不在生产代码 \`panic\`。
- 结构化日志统一用 \`kit.Logger\` / \`kit.SugaredLogger\` (zap)，不要在常规服务路径使用 \`fmt.Println\`。
- 错误响应优先用 \`internal/kit/errors.go\` / \`internal/kit/response.go\` 中已定义的语义化函数（\`kit.AccountAlreadyExist(c)\` 等），新增错误码时同步登记到 \`database/models/error_code_mapping.go\` 和 \`internal/kit/error_registry.go\`。

### 数据库
- 现有 DB 调用仍可通过 \`database/core.DB\` 包级实例；新服务代码优先通过 \`services.NewProvider(db)\` 或服务构造函数注入 \`*gorm.DB\`，测试时参考 \`internal/services/\` 已有用法。
- 涉及金额 / 余额 / 设备数等并发热点，使用事务 + \`FOR UPDATE\` 行锁；带 SQLite 部署的注意锁粒度。
- GORM 模型放 \`database/models/\`，业务方法（钩子、表名）也写在模型文件内。

## 前端约定

### 代码风格
- 全部使用 Composition API + \`<script setup lang="ts">\`，禁止 Options API。
- 组件文件 PascalCase（\`StatCard.vue\` / \`UserTable.vue\`）。
- 路径别名 \`@/\` → \`./src/\`，新代码必须用 \`@/\`，不允许相对路径 \`../../\` 跨目录引用。\`router/index.ts\` 与 \`layout/*.vue\` 中已有的相对路径属于历史遗留，渐进迁移即可。
- TypeScript 严格模式，避免 \`any\`；类型确实复杂时优先 \`unknown\` + 收窄。

### 目录组织
- \`views/\` 按业务域分子目录（\`agent\` / \`apps\` / \`audit\` / \`cloud\` / \`dashboard\` / \`docs\` / \`license\` / \`market\` / \`system\`）；登录、安装、欢迎等公共页面放根。
- \`components/\` 根目录放跨业务的可复用组件（\`StatCard\` / \`ListSearchToolbar\` / \`ListLoadingState\` / \`ListEmptyState\` / \`ListErrorState\` / \`StaleDataAlert\` 等）；\`components/ui/\` 放 shadcn-vue 组件。
- \`composables/\` 函数命名 \`useXxx\`（已有 \`useAppData\` / \`useToast\` / \`useConfirm\` / \`useModuleGate\` 等）。
- \`stores/\` 命名 \`useXxxStore\`，setup-style：\`defineStore('xxx', () => { ... return { ... } })\`，**不用** options-style。
- \`types/\` 按业务域分文件（\`user\` / \`card\` / \`order\` / \`agent\` / \`app\` / \`product\` / \`common\`），统一通过 \`types/index.ts\` re-export。调用方 \`import type { Xxx } from '@/types'\`。
- \`utils/\` 放纯函数工具（\`formatters\` / \`validators\`），可单元测试。\`lib/\` 放有副作用的运行时配置（\`axios\` 实例、样式常量）。

### 状态与数据
- 跨页面 / 跨组件共享状态进 store；页面内逻辑用 \`ref\` / \`computed\` / composable。
- localStorage 持久化只在 store 内部读写（参见 \`stores/user.ts\` 的 token / user / token_expires_at 管理），view 不直接访问 \`localStorage\`。
- 应用级数据（按 \`currentAppId\` 切换的列表）用 \`useAppData\` 复用监听逻辑，不要在每个 view 重写 \`watch(appStore.currentAppId, ...)\`。

### API 调用
- **统一 \`import api from '@/lib/axios'\`**，已内置 baseURL、token 拦截、自动刷新、错误归一化。
- 不直接用裸 \`axios\`。仅当需要绕开 token 拦截器（如游客可访问的店铺接口，参见 \`router/index.ts\` 的 \`shopApi\`）时才 \`axios.create\`，必须有注释说明原因。
- 错误处理：\`try/catch\` 在调用方，失败用 \`toast.error(err.response?.data?.error || '操作失败')\` 显示，不要静默吞掉。
- 响应类型用 \`types/\` 中已定义接口；新增字段先补类型再用。

### UI 与样式
- UI 组件优先 \`@/components/ui/*\`（shadcn-vue / reka-ui）；缺什么再写到 \`@/components/\` 根目录。
- 图标统一 \`lucide-vue-next\`，按需 named import。
- 样式用 Tailwind utility，主题色使用 CSS 变量（\`bg-background\` / \`text-foreground\` / \`border-border\` / \`bg-card\` / \`text-muted-foreground\` 等），**不要硬编码颜色**。深色模式由 CSS 变量自动适配。
- Toast 用 \`useToast()\`，按业务语义选方法：通用反馈用 \`success\` / \`error\` / \`warning\`；启停切换用 \`enabled\` / \`disabled\`；处理中态用 \`processing\`；删除成功用 \`deleted\`；过期 / 暂停 / 拒绝按需用 \`expired\` / \`paused\` / \`rejected\`。语义化文案让多状态下的用户感知更精确。

### 路由与菜单
- 登录、安装、欢迎、商店等首屏必需页面同步导入；其他页面**懒加载**（\`() => import('...')\`）。
- 路由守卫集中在 \`router/index.ts\`，view 不做手动鉴权跳转。
- 新增菜单页面需同时改两处：
  1. \`config/menu.ts\`（管理后台）或 \`config/agent-menu.ts\`（代理商）—— 菜单条目
  2. \`router/index.ts\` 的 \`componentMap\` 或 \`agentComponentMap\` —— 懒加载映射
- 不在菜单内的独立路由（如 \`/apps/info\` / \`/market/payment/add\`）直接在 \`router/index.ts\` 用 \`rootRoute.children?.push(...)\`。

### 测试
- Vitest + \`@vue/test-utils\` + jsdom 已配置。
- 工具函数测试与源同目录（\`utils/formatters.test.ts\` 是当前唯一示例，按此约定补充）。
- 组件测试可放同目录 \`Xxx.test.ts\` 或视图域下的 \`__tests__/\`；优先覆盖纯函数与 store 逻辑。

### 反模式（禁止）
- view 内 \`axios.create()\`，除非游客接口绕开 token 拦截器并加注释。
- view 内直接 \`localStorage.getItem/setItem\`，应通过 store。
- 全局 CSS 覆盖 shadcn-vue 组件样式，应通过 CSS 变量或局部 utility。
- Pinia options-style（\`state\` / \`getters\` / \`actions\` 三件套）。
- 跨目录用相对路径 \`../../\`（router 与 layout 历史遗留除外）。
- toast 全部一律 \`toast.info(...)\`，忽略业务语义。

## 提交与变更约定

- 约定式提交：\`feat\` / \`fix\` / \`refactor\` / \`chore\` / \`test\` / \`docs\` / \`style\` / \`perf\`
- 三段式正文：变更说明 / 影响范围 / 验证（参见仓库历史 commit）
- 不自动提交，需用户明确指示
- 重构、新能力、破坏性变更走 \`OpenSpec/changes/\` 提案流程
```

OpenSpec/roadmap.md 内容
```
# HexLM Roadmap

> 本文件记录“当前缺什么、接下来应治理什么”，用于统一问题视角和优先级。  
> 这里写的是方向、影响和完成标准，不直接代替 \`OpenSpec/changes/\` 中的提案与任务。

## 当前状态

上一轮基础治理已经收尾：

1. ~~数据一致性治理~~
2. ~~缓存与删除语义统一~~
3. ~~测试体系补强~~
4. ~~文档与发布事实同步~~
5. ~~发布与运维闭环~~
6. ~~权限与安全治理~~
7. ~~业务关键链路端到端验证~~

对应 change 已归档，公开代码与文档按公开提交维护；是否已推送以当前 \`git status\` 为准。

下一阶段建议从“可发布、可审计、可验证”的角度推进，不急于新增大功能。HexLM 是授权管理系统，优先级应放在发布可靠性、安全边界和真实业务闭环上。

---

## P0. ~~发布与运维闭环~~

### 状态

已完成。对应 change：\`add-release-preflight-checks\`。

### 问题

- 当前已经有测试、构建、版本巡航和发布事实校验，但它们仍依赖人工记忆按顺序执行。
- 版本号、公开 changelog、系统 about、前端版本、tag 之间虽然已有防漂移测试，但发布前还没有统一的“放行检查”入口。
- 构建产物、单二进制嵌入、部署脚本、Docker 流程之间需要一次发布前闭环验证。

### 影响

- 发版时容易漏跑某个检查，导致版本事实、构建产物或部署说明再次漂移。
- 后续补丁版本会越来越频繁，人工巡航成本会变高。
- 如果发布流程没有固定入口，协作者很难判断“现在是否可以发版”。

### 建议动作

- 增加一个发布前检查流程，统一执行后端测试、前端测试、前端构建、发布事实测试和 diff 检查。
- 明确 release checklist：版本号、changelog、tag、构建产物、部署脚本、Docker 路径。
- 将“巡航锚点 -> changelog -> version -> tag”的过程整理为可重复步骤。
- 只做流程固化，不急于引入复杂 CI/CD 平台改造。

### 完成标准

- 发布前有单一入口或清晰 checklist，能判断当前提交是否可发布。
- 版本事实、公开 changelog、前端版本、后端 about、tag 之间有自动校验或明确验证步骤。
- 发布步骤可以被后续协作者复现，而不依赖口头记忆。

### 预计后续 change

- \`add-release-preflight-checks\`
- \`update-release-cruise-checklist\`

---

## P0. ~~权限与安全治理~~

### 状态

已完成。对应 change：\`add-permission-boundary-audit\`。

本轮完成了权限边界矩阵、敏感操作清单、跨角色拒绝测试、owner / agent 作用域测试、公开商城最小暴露测试和支付回调公开边界验证。未发现必须立即改变生产行为的权限缺口；后续如新增角色模型、权限表、策略引擎或发现具体越权缺陷，再另开 hardening change。

### 问题

- HexLM 涉及管理员、代理、客户端、公开商城和支付回调，多入口权限边界复杂。
- 当前已经补了中间件测试，但还没有按业务动作系统性审计“谁能操作什么”。
- 强制删除、支付配置、卡密、余额、代理结算等敏感操作需要持续确认权限、审计和错误提示是否一致。

### 影响

- 授权系统的核心风险不是页面缺功能，而是越权、误删、敏感信息泄露和不可追溯操作。
- 如果权限边界只靠局部 handler 判断，后续新增接口容易漏掉约束。
- 敏感操作缺少统一审计语义，会增加问题追踪成本。

### 建议动作

- 盘点管理员、代理、客户端、公开接口、支付回调的访问边界。
- 检查敏感操作：应用删除、用户余额、卡密、订单、支付渠道、云函数、系统安全配置。
- 明确哪些操作必须有二次确认、审计日志、权限校验和错误码约定。
- 补充高风险接口的权限回归测试。

### 完成标准

- 核心接口有明确权限矩阵或等价说明。
- 高风险写操作都有权限测试和失败路径测试。
- 敏感操作的审计、确认和错误响应语义一致。

### 预计后续 change

- \`audit-permission-boundaries\`
- \`harden-sensitive-operation-guards\`

---

## P1. ~~业务关键链路端到端验证~~

### 状态

已完成。未单独开 OpenSpec change，因为本轮属于既有行为的测试补强和一处审计事实 bug 修复。

本轮新增了后端 service 层业务闭环测试，覆盖应用、商品、支付渠道、商城订单、支付回调、自动发货、授权余额到账、客户端会话认证、扣点、重复回调幂等和支付金额不足不更新。测试过程中发现并修复了支付回调自动发货 \`BalanceLog\` 的 before/after 余额记录错误。

### 问题

- 当前单元测试和组件测试已经明显增强，但真实业务闭环还需要更贴近用户路径的验证。
- 授权链路跨越应用配置、商品、订单、支付、卡密、客户端查询和扣点，单点测试不能完全覆盖组合风险。
- 支付回调、订单状态流转、库存或授权到账等路径一旦断裂，用户感知会非常直接。

### 影响

- 代码局部正确不代表完整交易链路可用。
- 后续改支付、商城、授权、客户端 API 时，缺少一条能快速证明核心业务没断的回归路径。
- 问题可能只在跨模块组合时出现，定位成本高。

### 建议动作

- 建立最小端到端业务场景：
  - 创建应用
  - 配置商品和支付渠道
  - 创建订单
  - 模拟支付回调
  - 验证授权到账
  - 客户端查询与扣点
- 优先做后端集成测试或可重复的本地验证脚本，不先追求浏览器全流程自动化。
- 对失败路径也覆盖一条：支付失败或回调重复时订单状态不乱跳。

### 完成标准

- 有一条可重复执行的核心业务闭环验证。
- 订单、支付、授权到账、客户端查询之间的关键不变量有断言。
- 重复回调、失败回调、余额不足或无效授权等关键失败路径有覆盖。

### 预计后续 change

- \`test-commerce-license-e2e-path\`
- \`test-payment-order-state-machine\`

---

## ~~P1. 运行时可观测与故障定位~~

状态：已完成。已补 request id 中间件和 HTTP/error/slow request 日志回归测试；新增轻量结构化日志字段 helper；商城订单支付发起失败、支付回调失败、客户端扣点失败、客户端会话登出失败均可通过 \`request_id\` / \`operation_id\` / 业务 ID / \`error_code\` 关联排查；\`docs/TROUBLESHOOTING.md\` 已补故障定位流程和敏感字段边界。

### 问题

- 系统已有日志、状态页和部分监控信息，但故障定位仍可能需要人工查数据库、查日志、看接口响应。
- 对授权、订单、支付、客户端请求这类核心链路，缺少统一的 request id / operation id 视角。
- 后台错误提示和后端结构化日志之间的关联还可以加强。

### 影响

- 用户报告“支付了没到账”“客户端扣点失败”“删除失败”时，排查路径可能过长。
- 如果日志字段不稳定，后续审计和问题复盘会困难。
- 线上问题不一定能通过单元测试复现，需要更好的现场证据。

### 建议动作

- 盘点核心链路日志字段：request id、app id、user id、order id、payment channel id、error code。
- 检查 API 错误响应是否能和日志关联。
- 在系统状态或审计页面补充必要的故障定位入口时，再另开 UI change。

### 完成标准

- 核心链路日志字段稳定，不依赖自由文本搜索。
- 常见故障能从用户可见错误追到后端日志。
- 不泄露密钥、token、密码、卡密明文等敏感信息。

### 预计后续 change

- \`audit-runtime-observability\`
- \`harden-error-and-log-correlation\`

---

## ~~P2. 后台体验与操作效率~~

### 状态

已完成。对应 change：\`improve-admin-operation-states\`。

本轮统一了共享列表 loading / error / empty 状态组件的窄屏表现，收窄确认弹窗宽度并强化长文案换行；市场商品、支付渠道、优惠活动、订单发货等高频操作补齐 in-flight 禁用和删除影响确认；授权用户封禁、卡密单条删除补齐确认与执行中禁用；应用配置和系统状态页改用明确加载/空态文案。

### 问题

- 管理后台已经修过不少列表和弹窗问题，但高频操作仍有继续打磨空间。
- 列表筛选、批量操作、空态、错误态、移动端宽度、二次确认文案等细节会影响长期使用效率。
- 有些体验问题不是 bug，但会增加误操作或重复点击。

### 影响

- 授权管理后台是重复使用工具，细节摩擦会长期累积。
- 敏感操作如果文案或布局不清楚，会增加误删、误改配置的风险。
- 移动端和窄屏体验不好时，临时运维操作会受影响。

### 建议动作

- 盘点高频页面：应用、用户、卡密、订单、商品、支付渠道、系统状态。
- 优先处理会导致误操作或状态误读的交互问题。
- 对纯视觉优化保持克制，避免在功能治理未完成时大范围改 UI。

### 完成标准

- 高频页面的空态、错误态、加载态、确认态一致。
- 敏感操作文案明确，不依赖用户猜测。
- 移动端或窄屏下关键操作不遮挡、不溢出。

### 预计后续 change

- \`improve-admin-operation-states\`
- \`polish-sensitive-action-dialogs\`

---

## 暂不优先

- 大规模 UI 主题重做
- 全站数据层重构
- 新支付渠道接入
- 新商业模式或复杂营销玩法
- 多租户架构级改造

这些都可能有价值，但现在不应抢在发布闭环、安全治理和业务闭环验证之前。

---

## 使用方式

- 当确认推进某一方向时，在 \`OpenSpec/changes/\` 下开对应 proposal / tasks / design。
- roadmap 只记录方向、影响和完成标准，不记录具体实施流水。
- 某个方向完成后，在标题和顶部清单加删除线，并归档对应 change。
```

打包文件：  
[Share the planning document.zip](https://linux.do/uploads/short-url/qT2thmRqENdUKEqJckfrksQYXnT.zip) (100.5 KB)

如果你实在不懂怎么用我上面这些文档，那么可以复制下面这段话

```css
分析一下这个「解压后目录」目录的文件，看看他[Hexon-X]的规划以及工具
以及有什么优点值得我们借鉴，然后给我一个清单，以便我优化我们的项目。
```

我自认为我写的这些涵盖了许多场景，比如版本巡航，提交信息规范…  
暂时没有想到太多，想到了再补充吧。  
我在压缩包里面留了一些archive，可以看看

佬们也可以对我的这些规划文档提出修改建议![:clown_face:](https://cdn.ldstatic.com/images/emoji/twemoji/clown_face.png?v=15 ":clown_face:")，另外更希望可以看看你的规范文档 ![:face_savoring_food:](https://cdn.ldstatic.com/images/emoji/twemoji/face_savoring_food.png?v=15 ":face_savoring_food:")

果践玉书，不移金诺：

我说过我写帖子，现在帖子写好了 [@Miuzzz   ![nerd_face](https://cdn.ldstatic.com/images/emoji/twemoji/nerd_face.png?v=15)](https://linux.do/u/miuzzz)   [@feipinxiang](https://linux.do/u/feipinxiang)

---

## Comments

> **kltion** · [2026-06-14](https://linux.do/t/topic/2398570/2)
> 
> 窝趣感谢佬的无私分享，佬太强了，已严肃学习

> **Miuzzz** · [2026-06-14](https://linux.do/t/topic/2398570/3)
> 
> 佬，终于来了。佬的一句话等到半夜![:nerd_face:](https://cdn.ldstatic.com/images/emoji/twemoji/nerd_face.png?v=15 ":nerd_face:")。严肃学习中

> **Arbonkeep** · [2026-06-14](https://linux.do/t/topic/2398570/4)
> 
> 优秀的 向佬学习一下，博采众长一下

> **Hexon-X** · [2026-06-14](https://linux.do/t/topic/2398570/5)
> 
> 昨天就编辑好了，其中有些触发系统敏感词  
> 一直在审批，刚刚才审批通过![:rofl:](https://cdn.ldstatic.com/images/emoji/twemoji/rofl.png?v=15 ":rofl:")