import React, { ReactNode } from "react";
import { RC_EDITOR_API, RC_EDITOR } from '@xmzhou/rc-editor';
import { RC_CONTEXT_MENU_DIVIDER, RC_CONTEXT_MENU_ITEM } from '@xmzhou/rc-contextmenu';


export interface TANT_EDITOR_REF {
    /**
     * 编辑器实例
     */
    editor: RC_EDITOR,
    /**
     * 修改tab空格数
     * @returns 
     */
    changeTabSize: () => void,
    /**
     * 修改鼠标位置
     * @returns 
     */
    changePosition: () => void;
}

export interface TANT_EDITOR extends Omit<RC_EDITOR_API, 'ref'> {
  /**
   * 返回编辑器实例和常用操作函数
   */
  ref?: React.MutableRefObject<TANT_EDITOR_REF>,
  /**
   * 右击菜单配置
   */
  contextMenu?: TANT_CONTEXT_MENU[],
  /**
   * 点击右击菜单或快捷键触发
   * @param key 
   * @returns 
   */
  onContextMenuChange?: (key: string) => void;
  /**
   * 内容变化时触发
   * @param v 
   * @returns 
   */
  onChange?: (v: string) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export type TANT_CONTEXT_MENU = TANT_CONTEXT_MENU_ITEM | RC_CONTEXT_MENU_DIVIDER;

export interface TANT_CONTEXT_MENU_ITEM extends Omit<RC_CONTEXT_MENU_ITEM, 'render'> {
  /**
   * 编辑器自带功能，配置后直接触发内置操作
   */
  command?: string;
  /**
   * 非编辑器自带功能，手动注册快捷键响应
   */
  register?: boolean;
}