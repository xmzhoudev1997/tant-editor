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
  monaco.editor.defineTheme('tant-light', ThemeVitesseLight as any);
});


export default ({
  initOptions = {}, contextMenu, onContextMenuChange = () => { },
  onInit,
}: TANT_EDITOR, ref: React.ForwardedRef<TANT_EDITOR_REF>) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const editorRef = useRef<RC_EDITOR>(null);
  const handleTabSize = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.focus();
    editor.trigger('', 'editor.action.gotoLine', () => { })
  }
  const handlePosition = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.focus();
    editor.trigger('', 'editor.action.changeTabDisplaySize', () => { })
  }
  const handleContextMenuChange = (d: TANT_CONTEXT_MENU_ITEM) => {
    const editor = editorRef.current;
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
  }
  useImperativeHandle(ref, () => {
    return {
      editor: editorRef.current,
      changeTabSize: handleTabSize,
      changePosition: handlePosition,
    } as any
  }, []);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    handleInit(editor);
  }, [contextMenu])



  return {
    editorRef,
    handleInit,
    handleContextMenuChange,
    contextMenuOpen,
    setContextMenuOpen,
    defaultOptions: {
      minimap: {
        enabled: false,
      },
      lineHeight: 21,
      fontSize: 14,
      lineNumbersMinChars: 3,
      contextmenu: false,
      cursorBlinking: 'solid',
      ...initOptions,
      theme: initOptions.theme || 'tant-light',
    },
  }
}