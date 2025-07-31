# Page snapshot

```yaml
- dialog "Create New Company":
  - heading "Create New Company" [level=2]
  - text: Company Name
  - textbox "Company Name": 测试公司-34602-B
  - text: Description
  - textbox "Description": 自动化测试创建的公司 - 34602-B
  - checkbox "Active Status" [checked]
  - text: Active Status Company Type
  - combobox "companyTypes.Group"
  - text: English
  - textbox "English"
  - text: Chinese
  - textbox "Chinese"
  - text: Traditional Chinese
  - textbox "Traditional Chinese"
  - text: Key
  - textbox "Key"
  - text: Value
  - textbox "Value"
  - button [disabled]
  - button "company.form.addProfile"
  - button "Save"
  - button "Cancel"
```