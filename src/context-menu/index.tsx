import React, { forwardRef } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { TANT_EDITOR, TANT_EDITOR_REF } from "./props";
import { RCEditor } from '@xmzhou/rc-editor';

const Index = forwardRef<TANT_EDITOR_REF, TANT_EDITOR>((props, ref) => {
  const {
    className, ...extProps
  } = props;
  const {
    editorRef, defaultOptions, handleRegister,
  } = useData(props, ref);

  return (
    <RCEditor
      {...extProps}
      initOptions={defaultOptions}
      ref={editorRef}
      className={classnames('tant-editor', className)}
      beforeInit={handleRegister}
    />
  );
});

export default Index;