
import './index.less';
import { debounce } from "lodash";
import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RC_EDITOR } from '@tant/rc-editor';

class Index {
  private _editor: RC_EDITOR;
  private _render: (sql: string) => ReactNode;
  private _domNode: HTMLDivElement = document.createElement('div');
  private _root = createRoot(this._domNode);
  constructor(editor: RC_EDITOR, render: (sql: string) => ReactNode = () => '') {
    this._editor = editor;
    const editorDom = editor.getDomNode();
    const lineNumberDom = editorDom?.querySelector('.overflow-guard')?.children[0];
    this._domNode.className = 'sql-editor-run-widget';
    lineNumberDom?.append(this._domNode);
    this._domNode.style.display = 'none';
    this._domNode.style.top = '0px';
    this._domNode.onmousedown =e => e.stopPropagation(); // 屏蔽鼠标事件避免点击换行
    this._render = render;
  }
  update = debounce(() => {
    const selection = this._editor.getSelection();
    const startPosition = selection?.getStartPosition();
    const endPosition = selection?.getEndPosition();
    if (!startPosition || !endPosition || startPosition.equals(endPosition)) {
      this._domNode.style.display = 'none';
      this._domNode.style.top = '0px';
      return;
    }
    const render = this._render((selection ? this._editor.getModel()?.getValueInRange(selection) : '') || '');
    if (!render) {
      return;
    }
    this._domNode.style.display = 'block';
    const lineNumber = this._editor.getPosition()?.lineNumber || 1;
    const top = this._editor.getTopForLineNumber(lineNumber);
    this._domNode.style.top = `${top}px`;
    this._root.render(render);
  }, 200);
  dispose = () => {
    this._root.unmount();
    this._domNode.remove();
  }
}

export default Index;