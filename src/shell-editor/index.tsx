import React, { FC } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import TantEditor from '../editor';
import { SHELL_EDITOR } from "./props";

const Index: FC<SHELL_EDITOR> = (props) => {
  const {
    className, ...extProps
  } = props;
  const {
    handleInit, handleEditorChange,
  } = useData(props);

  return (
    <TantEditor
      {...extProps}
      className={classnames('shell-editor', className)}
      language="shell"
      onInit={handleInit}
      onEditorChange={handleEditorChange}
    />
  );
};

export default Index;