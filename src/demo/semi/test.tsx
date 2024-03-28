
import { TabsPanel } from '@xmzhou/rc-tabs';
import React, { useEffect, useRef } from 'react';
import { useSetState } from 'ahooks';
import { TaLanguage } from '@tant/icons';
import TabsNav from './index';
export default () => {
    const [state, setState] = useSetState<any>({
        tabList: [],
        tabKey: '',
    });
    const panelRef = useRef<any>(null);
    const navRef = useRef<any>(null);
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
                    console.log(tabKey, tabList);
                    setState({ tabKey, tabList });
                }}
                onTabAdd={() => ({
                    label: '空白标签页',
                    closeable: true,
                    fixed: false,
                    key: String(Date.now()),
                })}
                tabIconRender={() => {
                    return <TaLanguage style={{ display: 'flex' }}/>
                }}
                ref={navRef}
                panel={panelRef.current}
            />
            <TabsPanel
                ref={panelRef}
            >
                {(tabKey: string) => {
                    const tab = state.tabList.find(t => t.key === tabKey);
                    return <div
                        style={{ height: '100%' }}
                        suppressContentEditableWarning
                        contentEditable
                        onInput={(e) => {
                            navRef.current?.edited(tabKey, true)
                        }}
                    >{tab?.label}</div>;
                }}
            </TabsPanel>
        </div>
    );
}