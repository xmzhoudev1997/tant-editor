// @ts-nocheck
import { ShellEditor } from '@tant/editor';
import React, { useRef } from 'react';
import './index.less';
import { Button } from '@tant/ui-next';
import { TaPlay } from '@tant/icons';

export default () => {
  const editorRef = useRef(null);

  return (
    <ShellEditor
      className="tant-editor-demo"
      onEditorChange={(d) => {
        editorRef.current = d
      }}
      value={"SELECT \"#user_id\" , sum(\"pay_amount_sum\") as \"pay_amount_sum\" FROM /* 增量数据 */ ( SELECT \"#user_id\" , sum(\"pay_amount\") as FROM ta_dim.datatable WHERE \"$part_event\" = \"payment\" GROUP BY \"#user_id\" UNION ALL /* 现有数据 */ SELECT \"#user_id\",\"pay_amount_sum\" FROM ta_dim.datatable WHERE \"#user_id\" = ${Variable1} ) GROUP BY \"#user_id\""}
      contextMenu={[
        {
          key: 'format',
          label: '格式化',
          shortcutKeys: ['option', 'shift', 'F'],
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
      initOptions={{
        theme: 'tant-dark'
      }}
      onContextMenuChange={(key) => {
        if (key === 'format' && editorRef.current?.format) {
          editorRef.current.format();
        }
      }}
    />
  );
}