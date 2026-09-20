import React, { useRef, useEffect } from "react";
import { RC_EDITOR } from '@tant/rc-editor';
import { PYTHON_EDITOR } from "./props";
import { TANT_EDITOR_REF } from "xm-tabs/editor/props";
import formatPython from './formatter';


export default ({
  onInit, onEditorChange = () => {},
}: PYTHON_EDITOR) => {
  const editorRef = useRef<TANT_EDITOR_REF>({} as TANT_EDITOR_REF);
  const languageRef = useRef<any>(null);

  const handleFormat = (formatSelection: boolean = false) => {
    if (!editorRef.current.editor) {
      return;
    }
    const selection = editorRef.current.editor.getSelection();
    const model = editorRef.current.editor?.getModel();
    if (!model) {
      return;
    }
    const str = selection && formatSelection ? model.getValueInRange(selection) : model.getValue();
    const lineContent = selection ? model.getLineContent(selection.startLineNumber) : '';
    const lineIndent = lineContent.match(/^\s*/)?.[0].length || 0;
    const baseIndent = selection?.startColumn === 1
      ? lineIndent
      : Math.max((selection?.startColumn || 1) - 1, lineIndent);

    const text = formatPython(str, {
      indentWidth: model.getOptions()?.tabSize || 4,
      baseIndentWidth: selection && formatSelection ? baseIndent : 0,
    });

    editorRef.current.editor.executeEdits('formatter', [
      {
        range: selection && formatSelection ? selection : model.getFullModelRange(),
        text,
      },
    ]);

    editorRef.current.editor.setScrollLeft(0);
    editorRef.current.editor.setScrollTop(0);
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
    if (languageRef.current) {
      languageRef.current.dispose();
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
