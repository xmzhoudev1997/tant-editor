import { TANT_EDITOR, TANT_EDITOR_REF } from "xm-tabs/editor/props";

export interface PYTHON_EDITOR_REF extends TANT_EDITOR_REF {
    /**
     * 格式化编辑器内容
     */
    format: (formatSelection?: boolean) => void;
}

export interface PYTHON_EDITOR extends Omit<Omit<TANT_EDITOR, 'onEditorChange'>, "language"> {
    onEditorChange?: (data: PYTHON_EDITOR_REF) => void;
}
