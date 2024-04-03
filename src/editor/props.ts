import React, { ReactNode } from "react";
import { RC_EDITOR_API, RC_EDITOR } from '@xmzhou/rc-editor';
import { RC_CONTEXT_MENU_DIVIDER, RC_CONTEXT_MENU_ITEM } from '@xmzhou/rc-contextmenu';


export interface TANT_EDITOR_REF {
    editor: RC_EDITOR,
    changeTabSize: () => void,
    changePosition: () => void;
}

export interface TANT_EDITOR extends Omit<RC_EDITOR_API, 'ref'> {
  ref?: React.MutableRefObject<TANT_EDITOR_REF>,
  contextMenu?: TANT_CONTEXT_MENU[],
  onContextMenuChange?: (key: string) => void
}

export type TANT_CONTEXT_MENU = TANT_CONTEXT_MENU_ITEM | RC_CONTEXT_MENU_DIVIDER;

export interface TANT_CONTEXT_MENU_ITEM extends Omit<RC_CONTEXT_MENU_ITEM, 'render'> {
  command?: string;
  register?: boolean;
}