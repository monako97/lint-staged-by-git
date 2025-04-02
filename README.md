# lint-staged-by-git

[![npm](https://img.shields.io/npm/v/lint-staged-by-git)](https://www.npmjs.com/package/lint-staged-by-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

根据 Git 提交历史智能执行 Lint 的工具，仅检查与当前改动相关的代码，让代码检查更高效精准。

---

## 🚀 特性

- **智能增量检查** - 基于 Git 提交记录，仅检查变更相关的文件
- **无缝集成** - 兼容 ESLint/Prettier/Stylelint 等主流工具
- **多规则配置** - 支持文件类型匹配和自定义任务
- **极简性能损耗** - 避免全量检查，节省 60%+ 的 CI/CD 时间
- **提交范围自由定义** - 支持分支对比、Tag 对比、Commit Hash 对比

---

## 📦 安装

```bash
npm install lint-staged-by-git --save-dev
# 或
yarn add lint-staged-by-git -D
```

## 📦 配置和使用

在 package.json 中添加配置：

```json
{
  "script": {
   "precommit": "lint-git mode=commit",
   "ci": "lint-git mode=ci",
  }
}
```

执行检查命令

```bash
npm run precommit #只检查当前 commit 的文件（适用于代码提交）
# 或
npm run ci # 只检查上次 commit 的文件（适用于CI CD）
```

## 🛠 CI/CD 集成示例

### GitHub Actions 示例

```yaml
- name: Lint Changed Files
  run: npm run ci
```
