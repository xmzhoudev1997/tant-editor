import React, { useImperativeHandle, useState } from "react";
import { TANT_CONTEXT_MENU_ITEM, TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import { RC_EDITOR, RC_EDITOR_TOOL } from '@tant/rc-editor';
import { useEffect } from "react";

export default ({
  initOptions = {}, contextMenu, onContextMenuChange = () => { },
  onInit, disabled, onChange = () => { }, beforeInit,
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
  const handleContextMenuChange = (d: TANT_CONTEXT_MENU_ITEM, edit?: RC_EDITOR) => {
    if (!edit) {
      edit = editor;
    }
    const command = d.command;
    if (command && edit) {
      edit.focus();
      edit.trigger('', command, () => { })
    }
    onContextMenuChange(d.key);
  }
  const handleInit = async (editor: RC_EDITOR) => {
    if (onInit) {
      await onInit(editor);
    }
    let code: number = NaN;
    const monaco: RC_EDITOR_TOOL = (window as any).monaco;
    const SPECIAL_KEY_MAP = {
      command: monaco.KeyMod.CtrlCmd,
      option: monaco.KeyMod.Alt,
      shift: monaco.KeyMod.Shift,
      ctrl: monaco.KeyMod.WinCtrl,
      A: monaco.KeyCode.KeyA,
      B: monaco.KeyCode.KeyB,
      C: monaco.KeyCode.KeyC,
      D: monaco.KeyCode.KeyD,
      E: monaco.KeyCode.KeyE,
      F: monaco.KeyCode.KeyF,
      G: monaco.KeyCode.KeyG,
      H: monaco.KeyCode.KeyH,
      I: monaco.KeyCode.KeyI,
      J: monaco.KeyCode.KeyJ,
      K: monaco.KeyCode.KeyK,
      L: monaco.KeyCode.KeyL,
      M: monaco.KeyCode.KeyM,
      N: monaco.KeyCode.KeyN,
      O: monaco.KeyCode.KeyO,
      P: monaco.KeyCode.KeyP,
      Q: monaco.KeyCode.KeyQ,
      R: monaco.KeyCode.KeyR,
      S: monaco.KeyCode.KeyS,
      T: monaco.KeyCode.KeyT,
      U: monaco.KeyCode.KeyU,
      V: monaco.KeyCode.KeyV,
      W: monaco.KeyCode.KeyW,
      X: monaco.KeyCode.KeyX,
      Y: monaco.KeyCode.KeyY,
      Z: monaco.KeyCode.KeyZ,
      0: monaco.KeyCode.Digit0,
      1: monaco.KeyCode.Digit1,
      2: monaco.KeyCode.Digit2,
      3: monaco.KeyCode.Digit3,
      4: monaco.KeyCode.Digit4,
      5: monaco.KeyCode.Digit5,
      6: monaco.KeyCode.Digit6,
      7: monaco.KeyCode.Digit7,
      8: monaco.KeyCode.Digit8,
      9: monaco.KeyCode.Digit9,
    }
    contextMenu?.forEach((d) => {
      const shortcutKeys = (d as TANT_CONTEXT_MENU_ITEM).shortcutKeys || [];
      if (!shortcutKeys.length || !(d as TANT_CONTEXT_MENU_ITEM).register) {
        return;
      }
      shortcutKeys.forEach((k: string) => {
        code |= (SPECIAL_KEY_MAP as any)[k] ?? (monaco.KeyCode as any)[k];
      })
      editor.addCommand(code, () => handleContextMenuChange(d as TANT_CONTEXT_MENU_ITEM, editor));
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
    cursorBlinking: 'solid',
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