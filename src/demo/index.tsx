// @ts-nocheck
import { TantEditor } from '@tant/editor';
import React, { useRef } from 'react';
import { useSetState } from 'ahooks';
import './index.less';
import { registerEditor } from '@xmzhou/rc-editor';

registerEditor();

export default () => {
  return (
    <TantEditor
      className="tant-editor-demo"
      language="mysql"
      contextMenu={[
        {
          key: 'format',
          label: '格式化',
          shortcutKeys: ['command', 'F'],
          register: true,
        },
        {
          key: 'rename',
          label: '更改所有匹配项',
          command: 'editor.action.changeAll',
          shortcutKeys: ['command', 'F2'],
        },
        {
          key: 'run',
          label: '运行',
          shortcutKeys: ['command', 'enter'],
          register: true,
        },
        {
          key: 'divider1',
          type: 'divider'
        },
        {
          key: 'copy',
          label: '复制',
          command: 'editor.action.clipboardCopyAction',
          shortcutKeys: ['command', 'c'],
        },

        {
          key: 'cut',
          label: '剪切',
          command: 'editor.action.clipboardCutAction',
          shortcutKeys: ['command', 'x'],
        },

        {
          key: 'paste',
          label: '粘贴',
          command: 'editor.action.clipboardPasteAction',
          shortcutKeys: ['command', 'v'],
        },
      ]}
    />
  );
}