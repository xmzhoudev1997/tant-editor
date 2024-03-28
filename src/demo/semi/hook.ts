import { XM_TAB, useTabsNav } from "@xmzhou/rc-tabs";
import { XM_TABS_NAV_SEMI, XM_TABS_NAV_SEMI_REF } from "./props";
import { useImperativeHandle, useState } from "react";


export default (props: XM_TABS_NAV_SEMI, ref:  React.ForwardedRef<XM_TABS_NAV_SEMI_REF>) => {
    const {
        tabKey, tabList, panel,
        onTabAdd, onTabClose = () => true, onIntl = v => v, onChange = () => { },
    } = props;
    const [contextOpen, setContextOpen] = useState('');
    const navFunc = useTabsNav(tabKey || '', tabList, onChange, panel)
    const handleAdd = async () => {
        const tab = onTabAdd ? await onTabAdd() : null;
        if (tab && navFunc.add) {
            navFunc.add(tab);
        }
    }
    const handleClose = async (tab: XM_TAB) => {
        if (tab && navFunc.close) {
            return navFunc.close(tab, onTabClose);
        }
        return true;
    }
    const handleTabContextMenuRender = (tab: XM_TAB) => {
        const contextMenus = [
            {
                node: 'item',
                key: 'tab-fixed',
                name: onIntl(tab.fixed ? '取消固定' : '固定标签页'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-fixed'),
            },
            {
                node: 'divider',
            },
            {
                node: 'item',
                key: 'tab-close-other',
                name: onIntl('关闭其他'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-close-other'),
            },
            {
                node: 'item',
                key: 'tab-close-right',
                name: onIntl('关闭右侧'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-close-right'),
            },
            {
                node: 'item',
                key: 'tab-close-all',
                name: onIntl('关闭所有'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-close-all'),
            },
            {
                node: 'item',
                key: 'tab-close-saved',
                name: onIntl('关闭已保存'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-close-saved'),
            },
        ];
        if (tab.closeable) {
            contextMenus.splice(2, 0, {
                node: 'item',
                key: 'tab-close',
                name: onIntl('关闭'),
                onClick: () => handleTabContextMenuClick(tab, 'tab-close'),
            });
        }
        return contextMenus;
    }
    const handleTabContextMenuClick = (tab: XM_TAB, key: string) => {
        setContextOpen('');
        if (key === 'tab-fixed' && navFunc.fixed) {
            navFunc.fixed(tab.key, !tab.fixed);
            return;
        }
        if (key === 'tab-close-all' && navFunc.closeAll) {
            navFunc.closeAll();
            return;
        }
        if (key === 'tab-close-other' && navFunc.closeOther) {
            navFunc.closeOther(tab);
            return;
        }
        if (key === 'tab-close-right' && navFunc.closeRight) {
            navFunc.closeRight(tab);
            return;
        }
        if (key === 'tab-close' && navFunc.close) {
            navFunc.close(tab);
            return;
        }
        if (key === 'tab-close-saved' && navFunc.closeSaved) {
            navFunc.closeSaved();
            return;
        }
    }
    useImperativeHandle(ref, () => ({
        update: navFunc.update,
        add: navFunc.add,
        close: (tab: XM_TAB) => navFunc.close(tab, onTabClose),
        closeAll: () => navFunc.closeAll(onTabClose),
        closeOther: (tab: XM_TAB) => navFunc.closeOther(tab, onTabClose),
        closeRight: (tab: XM_TAB) => navFunc.closeRight(tab, onTabClose),
        closeSaved: navFunc.closeSaved,
        fixed: navFunc.fixed,
        edited: navFunc.edited,
    }), []);
    return {
        handleAdd,
        handleClose,
        handleFixed: (tab: XM_TAB, fixed: boolean) => navFunc?.fixed ? navFunc?.fixed(tab.key, fixed) : null,
        handleTabContextMenuRender,
        handleTabContextMenuClick,
        contextOpen,
        setContextOpen,
    }
}