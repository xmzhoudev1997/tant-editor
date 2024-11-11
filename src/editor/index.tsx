import React, { FC } from "react";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { TANT_EDITOR } from "./props";
import { RCEditor } from '@tant/rc-editor';

const Index: FC<TANT_EDITOR> = (props) => {
  const {
    className, initOptions, theme, ...extProps
  } = props;
  const {
    defaultOptions, handleInit,
  } = useData(props);

  return (
    <div className={classnames('tant-editor-container', className, theme || 'tant-light')}>
      <RCEditor
        {...extProps as any}
        initOptions={defaultOptions as any}
        className="tant-editor"
        onInit={handleInit}
      />
    </div>
  );
};

export default Index;