
import React, { useEffect, useRef } from 'react';

export default () => {
    const editorRef = useRef(null);
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
    return {
        editorRef,
        handleCompletion,
        handleContextMenuChange,
    };

}