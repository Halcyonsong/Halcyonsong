# Halcyonsong Homepage

## 本地开发

```bash
cd homepage
npm install
npm run dev
```

浏览器打开 http://localhost:5173 查看效果。

## 构建

```bash
npm run build
```

产物输出到 `dist/`。

## 部署到 GitHub Pages

1. 将 `dist/` 内容推送到 `Halcyonsong.github.io` 仓库
2. 或使用 GitHub Actions 自动部署（后续配置）

## 目录结构

```
homepage/
├── public/
│   └── background.jpg    # 全屏背景图（需自行放入）
├── src/
│   ├── components/        # 组件目录
│   │   └── HeroSection.vue
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口
│   └── style.css         # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
