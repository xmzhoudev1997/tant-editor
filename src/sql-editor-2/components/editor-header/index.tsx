
import React, { FC } from 'react';
import './index.less';
import { TaCode, TaDManageCl, TaFormat, TaPlay, TaSave, TaUpdate } from '@tant/icons';
import useData from './hook';
import { formatMessage } from 'tant-intl';
import { Button, Input } from '@tant/ui-next';

interface Props {
}

const Index: FC<Props> = ({
}) => {
  const { } = useData();
  return (
    <div className="tant-editor-header">
      <Input
        className="header-left"
        placeholder={formatMessage({ id: '编辑器-未保存查询' })}
      />
      <div className="header-right">
        <Button
          type="white"
          icon={<TaDManageCl />}
          disabled
        >
          {formatMessage({ id: '编辑器-刷新' })}
        </Button>
        <Button
          type="white"
          icon={<TaUpdate />}
        >
          {formatMessage({ id: '编辑器-转化为节点' })}
        </Button>
        <Button
          type="white"
          icon={<TaFormat />}
        >
          {formatMessage({ id: '编辑器-格式化' })}
        </Button>
        <Button
          type="white"
          icon={<TaSave />}
        >
          {formatMessage({ id: '编辑器-保存' })}
        </Button>
        <Button
          icon={<TaPlay />}
        >
          {formatMessage({ id: '编辑器-运行' })}
        </Button>
      </div>
    </div>
  );
}

export default Index;