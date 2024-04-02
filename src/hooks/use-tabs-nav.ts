import { useEffect, useRef } from "react";
import { XM_TAB } from "xm-tabs/tabs-nav/props";
import { XM_TABS_PANEL_REF } from "xm-tabs/tabs-panel/props";

export interface USE_TABS_NAV {
    update: (tabKey: XM_TAB['key'], params: Partial<XM_TAB>) => void | Promise<void>,
    add: (tab: XM_TAB) => void | Promise<void>,
    close: (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean) => boolean | Promise<boolean>,
    closeAll: (check: (tab: XM_TAB) => Promise<boolean> | boolean) => void | Promise<void>,
    closeOther: (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean) => void | Promise<void>,
    closeRight: (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean) => void | Promise<void>,
    closeSaved: () => void | Promise<void>,
    fixed: (tabKey: XM_TAB['key'], fixed: boolean) => void | Promise<void>,
    edited: (tabKey: XM_TAB['key'], edited: boolean) => void | Promise<void>,
}

export default (
    activeKey: string,
    list: XM_TAB[],
    onChange: (activeKey: string, list: XM_TAB[]) => void | Promise<void> = () => { },
    panelFunc: React.MutableRefObject<XM_TABS_PANEL_REF> = {
        current: {
            open: () => { },
            close: () => { },
            update: () => { },
        }
    },
): USE_TABS_NAV => {
    const dataRef = useRef({
        activeKey,
        list,
    });
    // 放ref避免实际使用时的闭包问题
    dataRef.current.activeKey = activeKey;
    dataRef.current.list = list;

    const handleUpdate = async (tabKey: XM_TAB['key'], params: Partial<XM_TAB>) => {
        const tab = dataRef.current.list?.find(t => t.key === tabKey);
        if (!tab) {
            return;
        }
        let flag = false;
        Object.entries(params).forEach(([k, v]) => {
            if ((tab as any)[k] === v) {
                return;
            }
            (tab as any)[k] = v;
            flag = true;
        });
        if (flag) {
            onChange(dataRef.current.activeKey, [...dataRef.current.list]);
        }
    }
    const handleAdd = async (tab: XM_TAB) => {
        if (tab.key === null || tab.key === undefined || tab.key === '' || Number.isNaN(tab.key)) { // key无效时跳过
            return;
        }
        const oldTab = dataRef.current.list.find(t => t.key === tab.key);
        if (oldTab) { // key重复时跳更新并跳转
            handleUpdate(tab.key, tab);
            onChange(tab.key, [...dataRef.current.list]);
            return;
        }
        dataRef.current.list.push(tab);
        onChange(tab.key, [...dataRef.current.list]);
    }
    const handleClose = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
        if (!await check(tab)) {
            return false;
        }
        const idx = dataRef.current.list.findIndex(t => t.key === tab.key);
        dataRef.current.list.splice(idx, 1);
        let newKey = dataRef.current.activeKey;
        const oldIdx = dataRef.current.list.findIndex(t => t.key === dataRef.current.activeKey);
        if (oldIdx === -1) {
            if (!dataRef.current.list[idx]) {
                const newIdx = idx - 1 < 0 ? 0 : idx - 1;
                newKey = dataRef.current.list[newIdx]?.key;
            } else {
                newKey = dataRef.current.list[idx]?.key;
            }
        }
        onChange(newKey, [...dataRef.current.list]);
        panelFunc?.current?.close(tab.key);
        return true;
    }
    const handleCloseAll = async (check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
        let tabFilterList = dataRef.current.list.filter(d => !d.fixed);
        while (tabFilterList.length > 0) {
            const t = tabFilterList[0];
            if (!t) {
                break;
            }
            if (!await handleClose(t, check)) {
                break;
            }
            tabFilterList = dataRef.current.list.filter(d => !d.fixed);
        }
    }
    const handleCloseOther = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
        while (dataRef.current.list.length > 1) {
            const t = dataRef.current.list.find(t => t.key !== tab.key && !t.fixed);
            if (!t) {
                break;
            }
            if (!await handleClose(t, check)) {
                break;
            }
        }
    }
    const handleCloseRight = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
        const idx = dataRef.current.list.findIndex(t => t.key === tab.key);
        let deleteList = dataRef.current.list.slice(idx + 1).filter(d => !d.fixed);
        while (deleteList.length > 0) {
            const t = deleteList[0];
            if (!t) {
                break;
            }
            if (!await handleClose(t, check)) {
                break;
            }
            deleteList = dataRef.current.list.slice(idx + 1);
        }
    }
    const handleCloseSaved = async () => {
        let tabFilterList = dataRef.current.list.filter(d => !d.fixed && !d.edited);
        while (tabFilterList.length > 0) {
            const t = tabFilterList[0];
            if (!t) {
                break;
            }
            if (!await handleClose(t)) {
                break;
            }
            tabFilterList = dataRef.current.list.filter(d => !d.fixed && !d.edited);
        }
    }
    const handleFixed = async (tabKey: XM_TAB['key'], fixed: boolean) => {
        handleUpdate(tabKey, { fixed });
        const tab = dataRef.current.list.find(t => t.key === tabKey);
        panelFunc?.current?.open(dataRef.current.activeKey, tab);
    }
    const handleEdited = async (tabKey: XM_TAB['key'], edited: boolean) => {
        handleUpdate(tabKey, { edited });
        const tab = dataRef.current.list.find(t => t.key === tabKey);
        panelFunc?.current?.open(dataRef.current.activeKey, tab);
    }
    const handleFixedTabSort = (list: XM_TAB[]) => {
        const fixedList = list.filter(d => d.fixed);
        const unFixedList = list.filter(d => !d.fixed);
        return [...fixedList, ...unFixedList];
    }
    useEffect(() => {
        let flag = false;
        list?.forEach((d, i) => {
            if (d.fixed && (list[i - 1] && !list[i - 1].fixed)) {
                flag = true;
            }
        });
        if (flag) {
            onChange(activeKey, handleFixedTabSort(list));
        }
    }, [list]);
    useEffect(() => {
        const tab = dataRef.current.list.find(t => t.key === activeKey);
        panelFunc?.current?.open(activeKey, tab);
    }, [activeKey, panelFunc]);
    return {
        update: handleUpdate,
        add: handleAdd,
        close: handleClose,
        closeAll: handleCloseAll,
        closeOther: handleCloseOther,
        closeRight: handleCloseRight,
        closeSaved: handleCloseSaved,
        fixed: handleFixed,
        edited: handleEdited,
    };
}