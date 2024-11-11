import { useState } from "react";
import { TANT_EDITOR } from "./props";
import { RC_EDITOR } from '@tant/rc-editor';
import { useEffect } from "react";
import { IDisposable } from "monaco-editor";

export default ({
  initOptions = {},
  onInit, disabled, onChange = () => { }, theme, onEditorChange = () => { }
}: TANT_EDITOR) => {
  const [editor, setEditor] = useState<RC_EDITOR>();
  const handleTabSize = () => {
    if (!editor) {
      return;
    }
    editor.focus();
    editor.trigger('', 'editor.action.changeTabDisplaySize', () => { })
  }
  const handlePosition = () => {
    if (!editor) {
      return;
    }
    editor.focus();
    editor.trigger('', 'editor.action.gotoLine', () => { })
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
    onEditorChange({
      editor,
      changeTabSize: handleTabSize,
      changePosition: handlePosition,
    });
    setEditor(editor);
  }
  useEffect(() => {
    if (editor) {
      editor.updateOptions({ theme });
    }
  }, [editor, theme]);
  useEffect(() => {
    if (!editor) {
      return;
    }
    handleInit(editor);
  }, [])
  useEffect(() => {
    let func: IDisposable | null = null
    if (editor) {
      func = editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    }
    return () => {
      if (func) {
        func.dispose();
      }
    }
  }, [editor, onChange])
  const defaultOptions = {
    minimap: {
      enabled: false,
    },
    lineHeight: 21,
    fontSize: 14,
    lineNumbersMinChars: 3,
    contextmenu: false,
    suggestLineHeight: 24,
    cursorBlinking: 'solid',
    ...initOptions,
    theme: theme || 'tant-light',
  };
  if (disabled) {
    defaultOptions.readOnly = true;
    defaultOptions.cursorStyle = undefined;
    defaultOptions.renderValidationDecorations = 'on';
  }

  return {
    handleInit,
    defaultOptions,
  }
}