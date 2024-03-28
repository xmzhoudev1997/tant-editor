# xm-tabs
# 介绍
组件采用的是导航栏和内容面板分开的模式设计。导航栏组件可以使用`TabsNav`，面板组件使用`TabsPanel`，同时提供标签页基本操作函数HOOK`useTabsNav`，请按需取用。  

组件支持标签新增、修改、关闭（自己、其他，已保存，右侧）、固定、编辑等，但是本组件是底层组件，不包含任何第三方UI组件，如需开箱即用的组件，可以使用上层封装组件`@xmzhou/semi-tabs`。



## 安装
``` shell
npm instal @xmzhou/rc-tabs
```

## API
### 标签页-配置内容
参数|是否必填|类型|说明|默认值
-|:-:|:-:|-|:-:
key|<font color="red">必填</font>|string|当标签的唯一标识|''
label|<font color="red">必填</font>|string|标签的名称|''
closeable|<font color="grey">可选</font>|boolean|标签是否可关闭|true
fixed|<font color="grey">可选</font>|boolean|标签是否固定|false
edited|<font color="grey">可选</font>|boolean|标签是否已编辑|false

### TabsNav-API
参数|是否必填|类型|说明|默认值
-|:-:|:-|-|:-:
tabKey|<font color="grey">可选</font>|<font color="blue">标签配置</font> ['key']|当前活动标签key，需要唯一|-
tabList|<font color="red">必填</font>|<font color="blue">标签配置</font> []|标签列表|[]
className|<font color="grey">可选</font>|string|组件样式|''
maxTabWidth|<font color="grey">可选</font>|number|最大标签宽度|226
minTabWidth|<font color="grey">可选</font>|number|最小标签宽度|76
tabRender|<font color="grey">可选</font>|(tab: <font color="blue">标签配置</font>) => ReactNode|自定义标签渲染函数|-
addRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染标签添加|-
moreRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染更多内容|-
extraRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染标签页右侧内容|-
tabOperRender|<font color="grey">可选</font>|(tab: <font color="blue">标签配置</font>) => ReactNode|自定义渲染标签后面的操作区域|-
tabContextMenuRender|<font color="grey">可选</font>|(tab: <font color="blue">标签配置</font>, tabNode: ReactNode) => ReactNode|自定义渲染标签右击下拉组件|-
tabTipRender|<font color="grey">可选</font>|(tab: <font color="blue">标签配置</font>, tabNode: ReactNode) => ReactNode|自定义渲染标签炫富内容|-
onChange|<font color="grey">可选</font>|(tabKey: <font color="blue">标签配置</font> ['key'] \| undefined, tabList: 标签配置[]) => void|数据变动时触发，提供最新选中标签key和列表，标签拖动后触发|-

### TabsPanel-API
参数|是否必填|类型|说明|默认值
-|:-:|:-|-|:-:
cacheNum|<font color="grey">可选</font>|number|普通标签缓存数量，超过的将被清除dom|5
fixedCacheNum|<font color="grey">可选</font>|number|固定标签缓存数量，超过的将被清除dom|5
children|<font color="red">必填</font>|(tabKey: <font color="blue">标签配置</font> ['key'], data: any, hanleChange: (tabKey: <font color="blue">标签配置</font> ['key'], data: any) => void | Promise\<void\>) => ReactNode|内容渲染函数|-
onChange|<font color="grey">可选</font>|(tabKey: <font color="blue">标签配置</font> ['key'], data: any, isClose?: boolean) => void | Promise\<void\>|修改标签内容修改时触发|-
onInit|<font color="grey">可选</font>|(tabKey: <font color="blue">标签配置</font> ['key'], tab: <font color="blue">标签配置</font>) => any | Promise\<any\>|标签初次渲染时触发，用以返回内容相关数据|-
ref|<font color="grey">可选</font>|<font color="blue">标签配置</font>|内部缓存操作函数|-

### TabsPanel REF参数
参数|类型|说明
-|:-|-
add|(tab: 标签配置) => void \| Promise\<void\>|新增标签
update|(oldTab: 标签配置, newTab: Partial<标签配置>) => void \| Promise\<void\>|更新标签信息
close|(tab: 标签配置, check: (tab: 标签配置) => Promise\<boolean\>) => boolean \| Promise\<boolean\>|关闭标签，返回结果告知是否需要中断后续操作，当关闭未保存标签可能会用到
closeAll|(check: (tab: 标签配置) => Promise\<boolean\>) => void \| Promise\<void\>|关闭所有标签，不包含固定标签
closeOther|(tab: 标签配置, ccheck: (tab: 标签配置) => Promise\<boolean\>) => void \| Promise\<void\>|关闭其他标签，不包含固定标签
fixed|(tab: 标签配置, fixed: boolean) => void \| Promise\<void\>|固定/取消固定标签
closeRight|(tab: 标签配置, ccheck: (tab: 标签配置) => Promise\<boolean\>) => void \| Promise\<void\>|关闭右侧标签，不包含固定标签
closeSaved|() => void \| Promise\<void\>|关闭已保存标签，不包含固定标签
edited|(tab: 标签配置, edited: boolean) => void \| Promise\<void\>|标签修改

### useTabsNav 返回参数
参数|类型|说明
-|:-|-
update|(tabKey: 标签配置['key'], data: any) => void|更新内容
update|(tabKey: 标签配置['key'], tab?: 标签配置) => void|打开标签或更新标签，用以触发内容渲染
close|(tabKey: 标签配置['key']) => void|标签关闭