# 公司模块 Playwright 自动化测试

## 📋 测试概述

此测试套件基于《Company Testing Cases.md》中的40个测试用例，使用 Playwright 实现端到端自动化测试。

## 🏗️ 文件结构

```
tests/e2e/
├── specs/                  # 测试用例文件
│   └── company-management.spec.ts
├── pages/                  # 页面对象模式文件
│   └── CompanyPage.ts
├── fixtures/               # 测试数据
│   └── companies.json
├── utils/                  # 工具函数
│   ├── testData.ts
│   └── loginHelper.ts
├── reports/                # 测试报告输出
├── screenshots/            # 测试截图
└── videos/                 # 测试录制视频
```

## 📊 测试用例覆盖

已实现的测试用例：

- ✅ C001: 公司列表基本显示
- ✅ C002: 全选功能验证
- ✅ C003: 顶部按钮显示
- ✅ C004: 模糊搜索功能
- ✅ C005: 分页功能验证
- ✅ C006: 创建公司弹窗
- ✅ C007: Group类型创建
- ✅ C008: Business Entity关联验证
- ✅ C010: 公司名称不可编辑
- ✅ C011: 编辑确认功能
- ✅ C012: 编辑取消功能
- ✅ C013: 单个删除确认
- ✅ C014: 批量删除功能
- ✅ C015: 删除操作验证
- ✅ C016: 导入菜单可见性
- ✅ C017: 导入对话框显示
- ✅ C018: 文件拖放功能
- ✅ C019: 文件格式支持
- ✅ C027: 列表排序功能
- ✅ C029: 创建必填验证
- ✅ C030: 编辑必填验证
- ✅ C033: 空列表显示
- ✅ C040: 创建后列表刷新

## 🚀 安装和运行

### 1. 安装依赖

```bash
# 进入前端目录
cd frontend

# 安装 Playwright
npm install -D @playwright/test

# 安装浏览器
npx playwright install
```

### 2. 配置环境

确保以下服务正在运行：
- 前端开发服务器：`http://localhost:5173`
- 后端API服务器
- 数据库服务

### 3. 运行测试

```bash
# 运行所有公司模块测试
npx playwright test tests/e2e/specs/company-management.spec.ts

# 以可视化模式运行（推荐用于调试）
npx playwright test tests/e2e/specs/company-management.spec.ts --ui

# 运行特定测试用例
npx playwright test tests/e2e/specs/company-management.spec.ts -g "C001"

# 生成测试报告
npx playwright show-report tests/e2e/reports/html-report
```

## 🔧 测试特性

### 容错设计
- 每个测试用例都有 try-catch 包装，失败时跳过而不中断整个测试流程
- 详细的日志输出，便于调试和问题追踪
- 自动截图和视频录制（失败时）

### 数据隔离
- 使用时间戳生成唯一的测试数据
- 测试完成后自动清理（可选）

### 并行执行
- 配置了串行模式（serial）确保测试顺序
- 避免数据竞争问题

## 📝 测试配置

主要配置项（在 `playwright.config.js` 中）：

```javascript
{
  testDir: './specs',
  timeout: 300000,  // 5分钟超时
  reporter: [
    ['html', { outputFolder: './reports/html-report' }],
    ['json', { outputFile: './reports/test-results.json' }],
    ['junit', { outputFile: './reports/junit-results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
}
```

## 🐛 调试指南

### 常见问题

1. **登录失败**
   - 检查 `utils/testData.ts` 中的登录凭据
   - 确认Keycloak服务正常运行

2. **元素定位失败**
   - 使用 `--debug` 模式运行测试
   - 检查页面是否完全加载

3. **测试超时**
   - 增加 `waitForTimeout` 时间
   - 检查网络连接和服务器响应时间

### 调试命令

```bash
# 调试模式
npx playwright test --debug

# 生成测试代码
npx playwright codegen http://localhost:5173

# 查看测试报告
npx playwright show-report
```

## 📈 扩展测试

要添加新的测试用例：

1. 在 `specs/company-management.spec.ts` 中添加新的测试函数
2. 使用 `CompanyPage` 类中的方法进行页面操作
3. 在 `fixtures/companies.json` 中添加测试数据
4. 更新此README文档

## 🔄 持续集成

测试可以集成到CI/CD流水线中：

```yaml
- name: Run Playwright Tests
  run: |
    cd frontend
    npm ci
    npx playwright install --with-deps
    npx playwright test tests/e2e/specs/company-management.spec.ts
``` 