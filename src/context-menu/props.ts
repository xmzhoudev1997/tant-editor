import { ReactElement, ReactNode } from "react";
import { RC_CONTEXT_MENU_DIVIDER } from '@xmzhou/rc-contextmenu';

export interface TANT_CONTEXT_MENU_API {
    /**
     * 触发容器
     */
    children: ReactElement;
    /**
     * 弹出框功能菜单
     */
    menu?: TANT_CONTEXT_MENU[];
    /**
     * 右击菜单受控开闭
     */
    visible?: boolean;
    /**
     * 触发点击事件
     */
    onChange?: (key: string, data: TANT_CONTEXT_MENU) => void;
    /**
     * 右击菜单开闭触发
     */
    onVisibleChange?: (v: boolean) => void;
}


export type TANT_CONTEXT_MENU = TANT_CONTEXT_MENU_ITEM | RC_CONTEXT_MENU_DIVIDER;

export interface TANT_CONTEXT_MENU_ITEM {
  command?: string;
}