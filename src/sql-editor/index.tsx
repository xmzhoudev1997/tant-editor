import React, { FC } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import TantEditor from '../editor';
import { SQL_EDITOR } from "./props";

const Index: FC<SQL_EDITOR> = (props) => {
  const {
    className, ...extProps
  } = props;
  const {
    handleInit, handleEditorChange,
  } = useData(props);

  return (
    <TantEditor
      {...extProps}
      className={classnames('sql-editor', className)}
      language="mysql"
      onInit={handleInit}
      onEditorChange={handleEditorChange}
    />
  );
};

export default Index;