import React, { useImperativeHandle, useRef, useState } from "react";
import { TANT_CONTEXT_MENU_ITEM, TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import ThemeVitesseLight from 'theme-vitesse/themes/vitesse-light.json';
import { RC_EDITOR } from '@xmzhou/rc-editor';
import { useEffect } from "react";
import Monaco from 'monaco-editor/esm/vs/editor/editor.api.d';
import keycode from 'keycode';

document.addEventListener('onEditorRegistered', () => {
  const monaco: any = (window as any).monaco;
  ThemeVitesseLight.colors["editor.background"] = '#F9F9FB';
  ThemeVitesseLight.colors["editorLineNumber.foreground"] = '#d0d7d9';
  ThemeVitesseLight.colors["editor.lineHighlightBackground"] = '#f1f2f5';
  ThemeVitesseLight.colors["editor.inactiveSelectionBackground"] = '#B9BECF4D';

  ThemeVitesseLight.rules.unshift({
    token: 'tant-variable',
    foreground: '#915AFF',
  });
  ThemeVitesseLight.rules.unshift({
    token: 'tant-variable-bracket',
    foreground: '#C0A9FF',
  });
  
  monaco.editor.defineTheme('tant-light', ThemeVitesseLight as any);
});


export default ({
  initOptions = {}, contextMenu, onContextMenuChange = () => { },
  onInit, disabled, onChange = () => {}
}: TANT_EDITOR, ref: React.ForwardedRef<TANT_EDITOR_REF>) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
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
  const handleContextMenuChange = (d: TANT_CONTEXT_MENU_ITEM) => {
    if (!editor) {
      return;
    }
    const command = d.command;
    if (command) {
      editor.focus();
      editor.trigger('', command, () => { })
    }
    onContextMenuChange(d.key);
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
    let code: number = NaN;
    contextMenu?.forEach((d) => {
      const shortcutKeys = (d as TANT_CONTEXT_MENU_ITEM).shortcutKeys || [];
      if (!shortcutKeys.length || !(d as TANT_CONTEXT_MENU_ITEM).register) {
        return;
      }
      const monaco: typeof Monaco = (window as any).monaco;
      const SPECIAL_KEY_MAP = {
        command: monaco.KeyMod.CtrlCmd,
        option: monaco.KeyMod.Alt,
        shift: monaco.KeyMod.Shift,
        ctrl: monaco.KeyMod.WinCtrl,
      }
      shortcutKeys.forEach((k) => {
        code |= (SPECIAL_KEY_MAP as any)[k] ?? keycode(k);
      })
      editor.addCommand(code, handleContextMenuChange);
    });
    editor.onDidScrollChange(() => {
      setContextMenuOpen(false);
    })
    editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    setEditor(editor);
  }
  useImperativeHandle(ref, () => {
    return {
      editor,
      changeTabSize: handleTabSize,
      changePosition: handlePosition,
    } as any
  }, [editor]);
  useEffect(() => {
    if (!editor) {
      return;
    }
    handleInit(editor);
  }, [contextMenu])

  const defaultOptions = {
    minimap: {
      enabled: false,
    },
    lineHeight: 21,
    fontSize: 14,
    lineNumbersMinChars: 3,
    contextmenu: false,
    suggestLineHeight: 24,
    ...initOptions,
    theme: initOptions.theme || 'tant-light',
  };
  if (disabled) {
    defaultOptions.readOnly = true;
    defaultOptions.cursorStyle = undefined;
    defaultOptions.renderValidationDecorations = 'on';
  }

  return {
    handleInit,
    handleContextMenuChange,
    contextMenuOpen,
    setContextMenuOpen,
    defaultOptions,
  }
}