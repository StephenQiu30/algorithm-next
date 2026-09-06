# 排序算法可视化课堂 | Next.js + React + RAG

> 面向排序算法学习的 RAG 增强型交互式教学系统，提供算法可视化、复杂度分析、代码讲解和智能问答。

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

`algorithm-next` 是排序算法教学平台的用户侧前端，使用 Next.js、React、TypeScript 和 Tailwind CSS 构建。项目把排序算法动画、执行步骤、代码高亮、时间/空间复杂度和 RAG 问答组合在同一个学习流程中，适合算法入门、课堂演示和面试复习。

## 核心能力

- **排序算法可视化**：逐步展示数组比较、交换、分区、合并和排序完成等过程。
- **算法知识卡片**：展示算法原理、平均时间复杂度、空间复杂度、稳定性和适用标签。
- **智能算法问答**：围绕当前算法调用 RAG 对话面板，基于排序算法知识库生成解释。
- **代码与数学表达**：支持代码高亮、Markdown、GFM 和 KaTeX 数学公式渲染。
- **现代交互体验**：响应式布局、主题切换、动效、会话状态和前端 API 类型定义。

当前前端已覆盖冒泡排序、选择排序、插入排序、希尔排序、归并排序、快速排序、堆排序和基数排序等学习场景。

## 相关仓库

- [algorithm-cloud](https://github.com/StephenQiu30/algorithm-cloud)：Java 微服务后端、RAG 检索增强生成、知识库和基础设施。
- [algorithm-admin](https://github.com/StephenQiu30/algorithm-admin)：管理后台，用于内容、用户和知识库运营。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| Web 框架 | Next.js 16、React 19、TypeScript |
| 样式与组件 | Tailwind CSS、Radix UI、Lucide React |
| 动画 | GSAP、Framer Motion |
| 内容渲染 | React Markdown、remark-gfm、remark-math、rehype-katex |
| 数据与表单 | Redux Toolkit、Axios、React Hook Form、Zod |

## 快速开始

```bash
git clone https://github.com/StephenQiu30/algorithm-next.git
cd algorithm-next

# 推荐使用 pnpm；也可以使用 npm install
pnpm install
pnpm run dev
```

打开 <http://localhost:3000> 查看排序算法教学界面。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run start` | 启动生产服务器 |
| `pnpm run lint` | 执行 ESLint 检查 |
| `pnpm run format` | 格式化代码 |
| `pnpm run format:check` | 检查代码格式 |
| `pnpm run openapi2ts` | 根据 OpenAPI 生成 TypeScript 类型 |

## 开发说明

- 排序算法实现与执行步骤主要位于 `src/lib/algorithms/` 和 `src/lib/sortingAlgorithms.ts`。
- 可视化组件位于 `src/components/sorting/`。
- RAG、用户登录和后端请求配置请结合 `algorithm-cloud` 的 API 地址检查 `src/api/` 与 `src/lib/`。

## 参与贡献

欢迎提交 Issue 和 Pull Request，尤其欢迎补充新的排序算法、可视化步骤、教学案例和多语言文档。提交前请运行 `pnpm run lint` 与 `pnpm run format:check`。

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源。

## 维护者

[StephenQiu30](https://github.com/StephenQiu30)
