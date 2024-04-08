// @ts-nocheck
import { SQLEditor } from '@tant/editor';
import React, { useEffect, useRef } from 'react';
import './index.less';
import { registerEditor } from '@xmzhou/rc-editor';
import { Button } from '@tant/ui-next';
import { TaPlay } from '@tant/icons';

registerEditor();

export default () => {
  const editorRef = useRef(null);

  return (
    <SQLEditor
      className="tant-editor-demo"
      ref={editorRef}
      runWidget={() => {
        return <Button type="white" title="运行" icon={<TaPlay />} size="small" style={{ width: 32 }} />
      }}
      value={"SELECT \"#user_id\" , sum(\"pay_amount_sum\") as \"pay_amount_sum\" FROM /* 增量数据 */ ( SELECT \"#user_id\" , sum(\"pay_amount\") as FROM ta_dim.datatable WHERE \"$part_event\" = \"payment\" GROUP BY \"#user_id\" UNION ALL /* 现有数据 */ SELECT \"#user_id\",\"pay_amount_sum\" FROM ta_dim.datatable WHERE \"#user_id\" = ${Variable1} ) GROUP BY \"#user_id\""}
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
      onChange={(v) => {
      }}
      onCompletion={(
        kwd: string,
        tables: string[],
        keywords: string[],
      ) => {
        // const list = []
        const list  = keywords.map(d => ({
          label: {
            label: d,
            description: '关键字',
          },
          kind: 17,
          insertText: d,
        }));
        // tables.forEach((d) => {
        //   list.push({
        //     label: {
        //       label: d,
        //       description: '表',
        //     },
        //     kind: 3,
        //     insertText: d,
        //   })
        // })
        list.push({
          label: {
            label: kwd,
            description: '字段',
          },
          kind: 18,
          insertText: kwd,
        })

        list.push({
          label: {
            label: kwd,
            description: '函数',
          },
          kind: 1,
          insertText: kwd,
        })
        list.push({
          label: {
            label: kwd,
            description: '表',
          },
          kind: 3,
          insertText: kwd,
        })
        console.log(list);
        return list;
      }}
      onContextMenuChange={(key) => {
        if (key === 'format' && editorRef.current?.format) {
          editorRef.current.format();
        }
      }}
    />
  );
}