import SQLEditor from '../sql-editor';
import React, { FC, useEffect, useRef } from 'react';
import './index.less';
import { registerEditor } from '@xmzhou/rc-editor';
import { Button } from '@tant/ui-next';
import { TaPlay } from '@tant/icons';
import useData from './/hook';
import { Props } from './props';
import { formatMessage } from 'tant-intl';
import classNames from 'classnames';
import EditorFooter from './components/editor-footer';
import EditorHeader from './components/editor-header';

const CONTEXT_MENUS = [
  {
    key: 'format',
    label: formatMessage({ id: '编辑器-格式化' }),
    shortcutKeys: ['command', 'F'],
    register: true,
  },
  {
    key: 'rename',
    label: formatMessage({ id: '编辑器-更改所有匹配项' }),
    command: 'editor.action.changeAll',
    shortcutKeys: ['command', 'F2'],
  },
  {
    key: 'divider1',
    type: 'divider'
  },
  {
    key: 'copy',
    label: formatMessage({ id: '编辑器-复制' }),
    command: 'editor.action.clipboardCopyAction',
    shortcutKeys: ['command', 'c'],
  },

  {
    key: 'cut',
    label: formatMessage({ id: '编辑器-剪切' }),
    command: 'editor.action.clipboardCutAction',
    shortcutKeys: ['command', 'x'],
  },

  {
    key: 'paste',
    label: formatMessage({ id: '编辑器-粘贴' }),
    command: 'editor.action.clipboardPasteAction',
    shortcutKeys: ['command', 'v'],
  },
]

registerEditor();

const Index: FC<Props> = ({
  value, className,
  onChange,
}) => {
  const {
    editorRef, col, row, selection, tab,
    handleCompletion, handleContextMenuChange, handleAction, handleInit,
  } = useData();
  const renderRunWidget = () => {
    return <Button
      type="white"
      title={formatMessage({ id: '编辑器-运行' })}
      icon={<TaPlay />}
      size="small"
      className="tant-sql-editor-run"
    />
  }
  return (
    <div className={classNames('tant-sql-editor-container', className)}>
      <EditorHeader />
      <SQLEditor
        className="tant-sql-editor"
        ref={editorRef}
        runWidget={renderRunWidget}
        value={value}
        contextMenu={CONTEXT_MENUS}
        onChange={onChange}
        onCompletion={handleCompletion}
        onContextMenuChange={handleContextMenuChange}
        onInit={handleInit}
      />
      <EditorFooter
        col={col}
        row={row}
        selection={selection}
        tab={tab}
        onActionTrigger={handleAction}
      />
    </div>
  );
}

export default Index;