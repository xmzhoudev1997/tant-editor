// @ts-nocheck
import { PythonEditor } from '@tant/editor';
import React, { useRef } from 'react';
import './index.less';

export default () => {
  const editorRef = useRef(null);

  return (
    <PythonEditor
      className="tant-editor-demo"
      onEditorChange={(d) => {
        editorRef.current = d;
      }}
      value={`
def query( x,y ):
    sql='SELECT id FROM users WHERE created>=\${start} AND dept=\${dept}'
    data={'x':  1,'y':\${params}}
    print( x+y )
      `}
      initOptions={{}}
      theme="vs-light"
      contextMenu={[
        {
          key: 'format',
          label: '格式化',
          shortcutKeys: ['option', 'shift', 'F'],
          register: true,
        },
      ]}
      onContextMenuChange={(key) => {
        if (key === 'format' && editorRef.current?.format) {
          editorRef.current.format();
        }
      }}
    />
  );
}
