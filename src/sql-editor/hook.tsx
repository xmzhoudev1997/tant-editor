import React, {useRef, useEffect } from "react";
import { RC_EDITOR, RC_EDITOR_TOOL } from '@tant/rc-editor';
import { SQL_EDITOR } from "./props";
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
  onInit, runWidget, onCompletion = () => [], completion, onEditorChange = () => {},
}: SQL_EDITOR) => {
  const editorRef = useRef<TANT_EDITOR_REF>({} as TANT_EDITOR_REF);
  const runRef = useRef<RunWidget>(null);
  const languageRef = useRef<any>(null);
  const handleFormat = (formatSelection: boolean = false, language: string = 'mysql') => {
    if (!editorRef.current.editor) {
      return;
    }
    const selection = editorRef.current.editor.getSelection();
    const model = editorRef.current.editor?.getModel();
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
    const formatStr = SqlFormatter(dealStr, { language: language as any });
    let i = -1;
    const originStr = formatStr.replace(new RegExp(`${a} = ${a}`, 'g'), () => {
      i += 1;
      return argus[i];
    }).replace(new RegExp(`${a}`, 'g'), () => {
      i += 1;
      return argus[i];
    });
    editorRef.current.editor.executeEdits('formatter', [
      {
        range: selection && formatSelection ? selection : model.getFullModelRange(),
        text: originStr.split('\n').map(d => {
          return d.replace(/^(  )/g, Array(model?.getOptions()?.tabSize || 4).fill(' ').join(''));
        }).join('\n'),
      },
    ]);
    editorRef.current.editor.setScrollLeft(0);
    editorRef.current.editor.setScrollTop(0);
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
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
    const monaco: RC_EDITOR_TOOL = (window as any).monaco;
    if (languageRef.current) {
      languageRef.current.dispose();
    }
    if (completion) {
      languageRef.current = monaco.languages.registerCompletionItemProvider('mysql', {
        triggerCharacters: ['.', '$', '${'],
        provideCompletionItems: async (model: any, position: any) => {
          if (model.id !== editor.getModel()?.id) {
            return;
          }
          const { lineNumber, column } = position
          const arr = model.getValueInRange({
            startLineNumber: 0,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column
          })?.split(/[ \n]+/) || [];
          const str = arr.pop() || '';
          const prefixStr = arr.pop() || '';
          const list = await onCompletion(str, prefixStr, keywordList);
          return { suggestions: list, incomplete: true, dispose: true } as any;
        },
        resolveCompletionItem: (item: any) => {
          return item;
        }
      });
    }
  }
  const handleEditorChange = (data: TANT_EDITOR_REF) => {
    editorRef.current = data;
    onEditorChange({
      ...data,
      format: handleFormat,
    })
  }
  useEffect(() => {
    return () => {
      if (languageRef.current) {
        languageRef.current.dispose();
      }
    }
  }, []);

  return {
    handleInit,
    handleEditorChange,
  }
}