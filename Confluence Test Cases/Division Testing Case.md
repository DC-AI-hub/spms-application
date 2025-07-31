Division模块测试用例 (30个)
| 测试编号 | 测试名称 | 测试步骤 | 期待结果 |
|---------|---------|---------|---------|
| D001 | Division列表显示 | 1. 导航至Division模块 | 显示包含[Division Name, Division Type, Active, LastModified, Related To, Edit]列的列表 |
| D002 | Related To列验证 | 1. 查看列表 | Related To列显示正确关联的公司名称 |
| D003 | Group公司限制 | 1. 尝试在非Group公司下创建Division | 不允许创建，提示需选择Group公司 |
| D004 | Division Head分配 | 1. 创建Division<br>2. 选择用户作为Head | 分配成功，相关信息保存 |
| D005 | 批量删除功能 | 1. 选择多个Division<br>2. 点击Delete | 弹出确认框显示所有选中Division名称 |
| D006 | 删除关联检查 | 1. 尝试删除有下属Department的Division | 提示必须先删除下属Department |
| D007 | 创建表单公司选择器 | 1. 点击Create Division | 显示仅包含Group类型公司的选择器 |
| D008 | Division名称不可编辑 | 1. 编辑Division<br>2. 尝试修改名称 | Division Name字段为只读 |
| D009 | 模糊搜索功能 | 1. 搜索框输入"Eng"<br>2. 查看结果 | 显示所有包含"Eng"的Division |
| D010 | 分页功能验证 | 1. 创建超过15个Division<br>2. 查看列表 | 显示分页控件 |
| D011 | 编辑确认功能 | 1. 编辑Division<br>2. 修改Division Type<br>3. 点击Confirm | 列表数据更新 |
| D012 | 编辑取消功能 | 1. 编辑Division<br>2. 修改字段<br>3. 点击Cancel | 表单关闭，数据未变更 |
| D013 | 单个删除确认 | 1. 点击某Division的Delete | 弹出"Are you sure to delete [名称]?"确认框 |
| D014 | 状态切换验证 | 1. 编辑Division<br>2. 切换Active状态 | 列表Active列显示更新后状态 |
| D015 | 创建必填验证 | 1. 不填Division Name<br>2. 尝试提交 | 提示必填字段缺失 |
| D016 | 空列表显示 | 1. 删除所有Division<br>2. 查看列表 | 显示"无数据"提示 |
| D017 | 多语言支持 | 1. 切换系统语言<br>2. 查看列名/按钮 | 显示对应语言翻译 |
| D018 | 关联公司变更 | 1. 编辑Division<br>2. 变更关联公司 | 保存成功，Related To列更新 |
| D019 | Division Head显示 | 1. 查看Division详情 | 显示分配的Head信息 |
| D020 | 类型下拉选项 | 1. 打开创建表单 | 显示所有有效Division类型 |
| D021 | 创建后列表刷新 | 1. 创建新Division<br>2. 查看列表 | 新Division立即显示 |
| D022 | 删除后列表刷新 | 1. 删除Division<br>2. 查看列表 | 被删除项立即消失 |
| D023 | 长名称处理 | 1. 创建含50字符名称的Division | 创建成功，列表正常显示 |
| D024 | 特殊字符处理 | 1. 创建名称为"IT&D"的Division | 创建成功 |
| D025 | 关联公司必选 | 1. 创建Division不选公司 | 提示必须选择关联公司 |
| D026 | 无效用户分配 | 1. 尝试选择已离职用户作为Head | 提示无效用户 |
| D027 | 搜索特殊字符 | 1. 搜索框输入"/" | 返回含"/"的Division |
| D028 | 分页大小变更 | 1. 更改分页大小为20 | 每页显示20条记录 |
| D029 | 排序功能验证 | 1. 点击Last Modified列头 | 按修改时间排序 |
| D030 | 批量编辑状态 | 1. 选择多个Division<br>2. 批量启用/停用 | 所有选中Division状态更新 |
