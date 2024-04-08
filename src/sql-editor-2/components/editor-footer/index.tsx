
import React, { FC } from 'react';
import './index.less';
import { TaCode } from '@tant/icons';
import useData from './/hook';
import { formatMessage } from 'tant-intl';

interface Props {
  row: number;
  col: number;
  tab: number;
  selection: number;
  onActionTrigger: (k: string) => void;
}

const Index: FC<Props> = ({
  row, col, tab, onActionTrigger = () => {}, selection,
}) => {
  const { } = useData();
  return (
    <div className="tant-editor-footer">
      <div className="footer-left">
        <TaCode />
        SQL
      </div>
      <div className="footer-right">
        <div className="footer-position" onClick={() => onActionTrigger('changePosition')}>
          {
            selection ? formatMessage({ id: '编辑器-位置-带选择' }, { row, col, selection }) : formatMessage({ id: '编辑器-位置' }, { row, col })
          }
        </div>
        <div className="footer-tab" onClick={() => onActionTrigger('changeTabSize')}>
          {formatMessage({ id: '编辑器-空格' }, { tab })}
        </div>
      </div>
    </div>
  );
}

export default Index;