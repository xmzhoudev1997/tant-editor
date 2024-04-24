import React, { useImperativeHandle, useRef, useState, useEffect } from "react";
import { RC_EDITOR, RC_EDITOR_TOOL } from '@tant/rc-editor';
import { SQL_EDITOR, SQL_EDITOR_REF } from "./props";
import { TANT_EDITOR_REF } from "xm-tabs/editor/props";
import { format as SqlFormatter } from 'sql-formatter';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/mysql/mysql';
import RunWidget from './components/run-widget';

const keywordList = [
  ...sqlLanguage.builtinFunctions,
  ...sqlLanguage.keywords,
  ...sqlLanguage.operators,
];

export default ({
  onInit, runWidget, onCompletion = () => [], completion,
}: SQL_EDITOR, ref: React.ForwardedRef<SQL_EDITOR_REF>) => {
  const [editor, setEditor] = useState<RC_EDITOR>();
  const editorRef = useRef<TANT_EDITOR_REF>({
    editor: null as any,
    changeTabSize: () => { },
    changePosition: () => { },
  });
  const runRef = useRef<RunWidget>(null);
  const tableRef = useRef<string[][]>([]);
  const languageRef = useRef<any>(null);
  const handleFormat = (formatSelection: boolean = false) => {
    if (!editor) {
      return;
    }
    const selection = editor.getSelection();
    const model = editor?.getModel();
    if (!model) {
      return;
    }
    const str = selection && formatSelection ? model.getValueInRange(selection) : model.getValue();
    const argus: string[] = [];
    const a = Date.now();

    const dealStr = str
      .replace(/\$\{.*?:.*?\}/g, (s: string) => {
        argus.push(s);
        return `${a} = ${a}`;
      })
      .replace(/\$\{.*?\}/g, (s: string) => {
        argus.push(s);
        return `${a}`;
      })
    const formatStr = SqlFormatter(dealStr);
    let i = -1;
    const originStr = formatStr.replace(new RegExp(`${a} = ${a}`, 'g'), () => {
      i += 1;
      return argus[i];
    }).replace(new RegExp(`${a}`, 'g'), () => {
      i += 1;
      return argus[i];
    });
    editor.executeEdits('formatter', [
      {
        range: model.getFullModelRange(),
        text: originStr,
      },
    ]);
    editor.setScrollLeft(0);
    editor.setScrollTop(0);
  }
  const handleTable = (editor: RC_EDITOR) => {
    const tableMap: Record<string, string[]> = {};
    const txt = editor?.getValue();
    txt.replace(/(from|FROM)[ \n ]+([0-9a-zA-Z_".`]+)[ \n ]+/g, (s, s1, s2) => {
      const table = s2.replace(/`"/g, '');
      tableMap[table] = table.split('.');
      return s;
    })
    tableRef.current = Object.values(tableMap);
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
    setEditor(editor);
    if (runWidget) {
      if (typeof runWidget === 'boolean') {
        (runRef as any).current = new RunWidget(editor);
      } else {
        (runRef as any).current = new RunWidget(editor, runWidget);
      }
      editor.onDidChangeCursorSelection(() => {
        runRef.current?.update();
      })
    }
    editor.onDidChangeModelContent(() => handleTable(editor));
    handleTable(editor); // 初始化执行一次
    const monaco: RC_EDITOR_TOOL = (window as any).monaco;
    if (languageRef.current) {
      languageRef.current.dispose();
    }
    if (completion) {
      languageRef.current = monaco.languages.registerCompletionItemProvider('mysql', {
        triggerCharacters: ['.'],
        provideCompletionItems: async (model: any, position: any) => {
          if (model.id !== editor.getModel()?.id) {
            return;
          }
          const { lineNumber, column } = position
          const arr = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column
          })?.split(' ') || [];
          const str = arr[arr.length - 1] || '';
          const list = await onCompletion(str, tableRef.current, keywordList);
          return { suggestions: list, incomplete: true, dispose: true } as any;
        },
        resolveCompletionItem: (item: any) => {
          return item;
        }
      });
    }
  }

  useImperativeHandle(ref, () => {
    return {
      ...editorRef.current,
      editor: editor as any,
      format: handleFormat,
    };
  }, [editorRef.current, editor]);
  useEffect(() => {
    return () => {
      if (languageRef.current) {
        languageRef.current.dispose();
      }
    }
  }, [])

  return {
    editorRef,
    handleInit,
  }
}