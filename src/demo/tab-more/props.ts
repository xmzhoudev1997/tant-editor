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

export interface XM_TABS_NAV_SEMI_MORE {
    tabKey: string;
    tabList: XM_TAB[];
  }