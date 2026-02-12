## 当前内容

- [ ] 将 redux 转换为 zustand
- [ ] 将 _helpers 中的内容全部迁移到对应的模块内
- [ ] 搜索 useSelector，用 zustand 的 useDictStore 替换
- [ ] 用 zustand 的 useDictStore 替换 useDispatch
- [ ] 使用 @tanstack/react-router 实现路由
- [ ] 使用 css 变量替代 scss 的变量
- [ ] 先能跑通一个组件 NoteBook
  - [ ] 发现需要更新 database
  - [ ] 发现需要更新 i18n
- [ ] 需要移除的 package
  - [ ] react-redux 原因，使用 zustand 代替，更好的 React 支持
  - [ ] react-transition-group 原因，之后会使用新的动画，motion 代替
  - [ ] observable-hooks 原因，作者自己写的库，不具有普遍性，和 rxjs 深度绑定，额外增加软件复杂度
- [ ] 当点击托盘图标的时候，展示翻译 panel
- [ ] 当前有一个配置页面，如果可以作为组件使用，可以通过操作生成对应的配置