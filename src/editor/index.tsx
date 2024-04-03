import React, { forwardRef } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { TANT_CONTEXT_MENU_ITEM, TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import { RCEditor } from '@xmzhou/rc-editor';
import { RCContextMenu } from '@xmzhou/rc-contextmenu';

const Index = forwardRef<TANT_EDITOR_REF, TANT_EDITOR>((props, ref) => {
  const {
    className, contextMenu, ...extProps
  } = props;
  const {
    editorRef, defaultOptions, handleInit, handleContextMenuChange,
    contextMenuOpen, setContextMenuOpen,
  } = useData(props, ref);

  return (
    <RCContextMenu
      menu={contextMenu}
      onChange={(v, d) => handleContextMenuChange(d as TANT_CONTEXT_MENU_ITEM)}
      visible={contextMenuOpen}
      onVisibleChange={setContextMenuOpen}
    >
      <div className="tant-editor-container">
        <RCEditor
          {...extProps}
          initOptions={defaultOptions}
          ref={editorRef}
          className={classnames('tant-editor', className)}
          onInit={handleInit}
        />
      </div>
    </RCContextMenu>
  );
});

export default Index;