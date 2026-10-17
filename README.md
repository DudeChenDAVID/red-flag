# 红旗学苑

React 18 + React Router 6 + Framer Motion 11 + Tailwind CSS 3。

## 运行

```sh
npm install
npm run dev
npm run build
```

## 当前目录与组件树

```text
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js
src/
  main.jsx              # React 18 入口、BrowserRouter
  App.jsx               # 路由定义与临时页面
  components/
    Layout.jsx          # 全局导航、底纹、Outlet、页脚
  styles/
    index.css           # Tailwind 入口、全局主题、Layout 样式
```

```text
StrictMode
└── BrowserRouter
    └── App / Routes
        └── Layout
            ├── 装饰文字底纹（aria-hidden）
            ├── Header / NavLink
            ├── Main
            │   ├── Breadcrumb
            │   └── Motion / Outlet → 当前页面
            ├── Footer
            └── MobileNav
```

## 路由

以下六个主路由现已可访问，业务内容暂为占位：

| 路径 | 模块 | 后续内容 |
| --- | --- | --- |
| / | 首页 | 轮播头条、四大入口、每日金句、进度卡片 |
| /history | 党史馆 | 时间轴、红色故事、微党课、英烈名录 |
| /rules | 党章党规 | 分类阅读、搜索、正文高亮 |
| /quiz | 答题中心 | 章节练习、模拟测试、错题本、积分榜 |
| /report | 思想报告助手 | 主题、提纲、素材、润色，仅辅助个人写作 |
| /profile | 个人中心 | 时长、积分、支部排名、报告历史 |
| * | 未匹配地址 | replace 跳转首页 |

后续业务页面建议放在 src/pages/{Home,History,Rules,Quiz,Report,Profile}/，各目录包含 index.jsx 与 index.css。公共卡片、页标题等放在 src/components/，内容来源、题目与示例数据放在 src/data/，学习状态放在 src/hooks/。这些目录在逐页开发时建立。

## 设计说明

- 文字底纹使用本机 STKaiti / KaiTi 等字体，以 6.5% 透明度竖排展示完整五字；不使用原迹扫描图，也不将底纹用作品牌标识。
- 金色细边、半透明卡片、毛玻璃与轻微阴影构成全局材质。
- 页面切换采用 0.6 秒淡入，尊重 prefers-reduced-motion。
- 字体可回退至本机字体；Google Fonts 不可达不影响功能运行。
- 当前不收集学习记录、不连接 AI 服务、不计算真实积分；业务能力将在后续页面开发中接入。
- BrowserRouter 部署需要服务器将前端路径回退到 index.html。
