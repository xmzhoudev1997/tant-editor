import React, { useImperativeHandle, useRef } from "react";
import { useSetState } from "ahooks";
import { TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import ThemeVitesseLight from 'theme-vitesse/themes/vitesse-light.json';
import { RC_EDITOR } from '@xmzhou/rc-editor';

export default ({
  beforeInit, initOptions = {},
}: TANT_EDITOR, ref: React.ForwardedRef<TANT_EDITOR_REF>) => {
  const editorRef = useRef<RC_EDITOR>();
  const handleTabSize = () => {

  }
  const handlePosition = () => {

  }
  const handleRegister = async (monaco: any) => {
    if (beforeInit) {
      await beforeInit(monaco);
    }
    ThemeVitesseLight.colors["editor.background"] = '#F9F9FB';
    monaco.editor.defineTheme('tant-light', ThemeVitesseLight);
  }
  useImperativeHandle(ref, () => {
    return {
      editor: editorRef,
      changeTabSize: handleTabSize,
      changePosition: handlePosition,
    }
  }, []);
  return {
    editorRef,
    handleRegister,
    defaultOptions: {
      minimap: {
        enabled: false,
      },
      lineHeight: 21,
      fontSize: 14,
      lineNumbersMinChars: 3,
      ...initOptions,
      theme: initOptions.theme || 'tant-light',
    } as any,
  }
}