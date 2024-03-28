import { ReactNode } from "react";
import { XM_TAB, XM_TABS_NAV } from "xm-tabs/tabs-nav/props";
import { XM_TABS_PANEL_REF } from "xm-tabs/tabs-panel/props";

export interface XM_TABS_NAV_SEMI_REF {
    update: (tabKey: XM_TAB['key'], params: Partial<XM_TAB>) => void | Promise<void>,
    add: (tab: XM_TAB) => void | Promise<void>,
    close: (tab: XM_TAB) => boolean | Promise<boolean>,
    closeAll: () => void | Promise<void>,
    closeOther: (tab: XM_TAB) => void | Promise<void>,
    closeRight: (tab: XM_TAB) => void | Promise<void>,
    closeSaved: () => void | Promise<void>,
    fixed: (tabKey: XM_TAB['key'], fixed: boolean) => void | Promise<void>,
    edited: (tabKey: XM_TAB['key'], edited: boolean) => void | Promise<void>,
}

export interface XM_TABS_NAV_SEMI extends XM_TABS_NAV {
    /**
     * 最大tab数，超过不可添加。仅不设置addRender时有效，不对底层数据处理产生限制
     */
    maxTabNum?: number;
    /**
     * 语言国际化函数
     * @param str 
     * @param params 
     * @returns 
     */
    onIntl?: (str: string, params?: any) => ReactNode;
  
    onTabAdd?: () => XM_TAB | Promise<XM_TAB>;
    onTabClose?: (tab: XM_TAB) => boolean | Promise<boolean>;
    panel?: XM_TABS_PANEL_REF,
    ref?:  XM_TABS_NAV_SEMI_REF,
  }