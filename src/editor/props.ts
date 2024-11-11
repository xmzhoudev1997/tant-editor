import { RC_EDITOR_API, RC_EDITOR } from '@tant/rc-editor';

export interface TANT_EDITOR_REF {
    /**
     * 编辑器实例
     */
    editor: RC_EDITOR,
    /**
     * 修改tab空格数
     * @returns 
     */
    changeTabSize: () => void,
    /**
     * 修改鼠标位置
     * @returns 
     */
    changePosition: () => void;
}

export interface TANT_EDITOR extends Omit<RC_EDITOR_API, 'ref'> {
  /**
   * 内容变化时触发
   * @param v 
   * @returns 
   */
  onChange?: (v: string) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 主题
   */
  theme?: string;
  /**
   * 获取编辑器实例时触发
   * @param v 
   * @returns 
   */
  onEditorChange?: (d: TANT_EDITOR_REF) => void;
}