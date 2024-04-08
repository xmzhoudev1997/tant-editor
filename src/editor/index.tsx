import React, { forwardRef } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { TANT_CONTEXT_MENU_ITEM, TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import { RCEditor } from '@xmzhou/rc-editor';
import { RCContextMenu } from '@xmzhou/rc-contextmenu';

const Index = forwardRef<TANT_EDITOR_REF, TANT_EDITOR>((props, ref) => {
  const {
    className, contextMenu, initOptions, ...extProps
  } = props;
  const {
    defaultOptions, handleInit, handleContextMenuChange,
    contextMenuOpen, setContextMenuOpen,
  } = useData(props, ref);

  return (
    <RCContextMenu
      menu={contextMenu}
      onChange={(v, d) => handleContextMenuChange(d as TANT_CONTEXT_MENU_ITEM)}
      visible={contextMenuOpen}
      onVisibleChange={setContextMenuOpen}
    >
      <div className={classnames('tant-editor-container', initOptions?.theme || 'tant-light')}>
        <RCEditor
          {...extProps as any}
          initOptions={defaultOptions as any}
          className={classnames('tant-editor', className)}
          onInit={handleInit}
        />
      </div>
    </RCContextMenu>
  );
});

export default Index;