
import { RC_EDITOR } from '@xmzhou/rc-editor';
import { useSetState } from 'ahooks';
import React, { useEffect, useRef } from 'react';

interface State {
    row: number;
    col: number;
    tab: number;
    selection: number;
}

export default () => {
    const editorRef = useRef(null);
    const [state, setState] = useSetState<State>({
        row: 0,
        col: 0,
        tab: 4,
        selection: 0,
    });
    const handleCompletion = (
        kwd: string,
        tables: string[],
        keywords: string[],
    ) => {
        const list = keywords.map(d => ({
            label: {
                label: d,
                description: '关键字',
            },
            kind: 17,
            insertText: d,
        }));
        list.push({
            label: {
                label: kwd,
                description: '字段',
            },
            kind: 18,
            insertText: kwd,
        })

        list.push({
            label: {
                label: kwd,
                description: '函数',
            },
            kind: 1,
            insertText: kwd,
        })
        list.push({
            label: {
                label: kwd,
                description: '表',
            },
            kind: 3,
            insertText: kwd,
        })
        console.log(list);
        return list;
    }
    const handleContextMenuChange = (key: string) => {
        if (key === 'format' && editorRef.current?.format) {
            editorRef.current.format();
        }
    }
    const handleAction = (k: string) => {
        if (!editorRef.current) {
            return;
        }
        if (editorRef.current[k]) {
            editorRef.current[k]();
        }
    }
    const handleUpdatePosition = (editor: RC_EDITOR) => {
        const position = editor.getPosition();
        const selection = editor.getSelection();
        setState({
            col: position?.column || 1,
            row: position?.lineNumber || 1,
            selection: selection ? editor.getModel()?.getValueInRange(selection)?.length || 0 : 0,

        });

    }
    const handleUpdateTab = (editor: RC_EDITOR) => {
        setState({
            tab: editor.getModel()?.getOptions()?.tabSize || 4,
        });

    }
    const handleInit = (editor: RC_EDITOR) => {
        handleUpdatePosition(editor);
        handleUpdateTab(editor);
        editor.onDidChangeCursorSelection(() => {
            handleUpdatePosition(editor);
        });
        editor.getModel()?.onDidChangeOptions(() => {
            handleUpdateTab(editor);
        });
    }
    return {
        editorRef,
        handleCompletion,
        handleContextMenuChange,
        handleAction,
        handleInit,
        ...state,
    };

}