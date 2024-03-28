
import { TabsNav, TabsPanel, useTabsNav } from '@xmzhou/rc-tabs';
import React, { useRef } from 'react';
import { useSetState } from 'ahooks';
export default () => {
  const [state, setState] = useSetState<any>({
    tabList: [{
      key: '1',
      label: '标签页1',
      closeable: true,
    },
    {
      key: '2',
      label: '标签页2',
      closeable: true,
    },
    {
      key: '3',
      label: '标签页3',
      closeable: true,
    },
    {
      key: '5',
      label: '标签页5',
      closeable: true,
    },
    {
      key: '6',
      label: '标签页6',
      closeable: true,
    },
    {
      key: '7',
      label: '标签页7',
      closeable: true,
    },
    {
      key: '8',
      label: '标签页8',
      closeable: true,
    },
    {
      key: '4',
      label: '标签页4',
      closeable: true,
      fixed: true,
    },],
    tabKey: '1',
  });
  const panelRef = useRef<any>(null);
  const nacFunc = useTabsNav(state.tabKey, state.tabList, (key, list) => setState({ tabKey: key, tabList: list }), panelRef.current);
  return (
    <div style={{
      display: 'flex',
      height: 400,
      flexDirection: 'column',
    }}>
      <TabsNav
        tabKey={state.tabKey}
        tabList={state.tabList}
        onChange={(tabKey, tabList) => {
          setState({ tabKey, tabList });
        }}
        panel={panelRef.current}
      />
      <TabsPanel
        ref={panelRef}
      >
        {(tabKey, data, handleUpdate) => {
          const tab = state.tabList.find(t => t.key === tabKey);
          return <div style={{ height: '100%' }}  suppressContentEditableWarning contentEditable >{tab?.label}</div>;
        }} 
      </TabsPanel>
    </div>
  );
}