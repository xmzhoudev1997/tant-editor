import React, { forwardRef } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { SQL_EDITOR } from "./props";
import TantEditor from '../editor';
import { SQL_EDITOR_REF } from "./props";

const Index = forwardRef<SQL_EDITOR_REF, SQL_EDITOR>((props, ref) => {
  const {
    className, ...extProps
  } = props;
  const {
    editorRef, handleInit,
  } = useData(props, ref);

  return (
    <TantEditor
      {...extProps}
      className={classnames('sql-editor', className)}
      ref={editorRef}
      language="mysql"
      onInit={handleInit}
    />
  );
});

export default Index;