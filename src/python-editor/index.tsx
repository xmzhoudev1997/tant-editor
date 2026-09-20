import React, { FC } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import TantEditor from '../editor';
import { PYTHON_EDITOR } from "./props";

const Index: FC<PYTHON_EDITOR> = (props) => {
  const {
    className, ...extProps
  } = props;
  const {
    handleInit, handleEditorChange,
  } = useData(props);

  return (
    <TantEditor
      {...extProps}
      className={classnames('python-editor', className)}
      language="python"
      onInit={handleInit}
      onEditorChange={handleEditorChange}
    />
  );
};

export default Index;
