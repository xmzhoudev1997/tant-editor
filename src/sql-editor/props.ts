import React, { ReactNode } from "react";
import { TANT_EDITOR, TANT_EDITOR_REF } from "xm-tabs/editor/props";
import Monaco from 'monaco-editor/esm/vs/editor/editor.api.d';

export interface SQL_EDITOR_REF extends TANT_EDITOR_REF {
    /**
     * 格式化编辑器内容
     */
    format: () => void;
}

export interface SQL_EDITOR extends Omit<Omit<TANT_EDITOR, 'ref'>, "language"> {
    /**
     * 返回编辑器实例和常用操作函数
     */
    ref?: React.MutableRefObject<SQL_EDITOR_REF>,
    /**
     * 是否展示run组件或自定义内容
     */
    runWidget?: boolean | ((sql: string) => ReactNode);
    /**
     * 是否有代码提示
     */
    completion?: boolean;
    /**
     * 代码提示函数回调
     */
    onCompletion?: (
        kwd: string,
        tables: string[][],
        keywords: string[],
    ) => Monaco.languages.CompletionItem[];
}