import React, { FC, forwardRef } from 'react';
import './index.less';
import useData from './hook';
import { XM_TABS_NAV_SEMI, XM_TABS_NAV_SEMI_REF } from './props';
import { TabsNav, XM_TAB } from '@xmzhou/rc-tabs';
import classNames from 'classnames';
import { Dropdown, Tooltip, Button, Popover } from '@douyinfe/semi-ui';
import { IconChevronDown, IconPlus } from '@douyinfe/semi-icons';
import { TaPin, TaClose, TaAdd1, TaPinUnsave, TaUnsave } from '@tant/icons';


const Index = forwardRef<XM_TABS_NAV_SEMI_REF, XM_TABS_NAV_SEMI>((props, ref) => {
    const {
        maxTabNum = 9999, className, tabList = [], tabClassName,
        tabRender, tabContextMenuRender, tabOperRender, addRender, tabTipRender,
        moreRender,
        ...extraProps
    } = props;
    const {
        contextOpen, setContextOpen, handleMoreContextMenuRender,
        handleAdd, handleClose, handleTabContextMenuRender, handleFixed,
    } = useData(props, ref);
    const defautltTabContextMenuRender = (tab: XM_TAB, tabNode: React.ReactNode) => {
        if (tabContextMenuRender) {
            return tabContextMenuRender(tab, tabNode);
        }
        return (
            <Dropdown
                key={tab.key}
                trigger="contextMenu"
                menu={handleTabContextMenuRender(tab) as any}
                visible={contextOpen === tab.key}
                onVisibleChange={v => {
                    setContextOpen(v ? tab.key : '')
                }}
            ><div>{tabNode}</div></Dropdown>
        );
    }

    const defaultTabTipRender = (tab: XM_TAB, tabNode: React.ReactNode) => {
        if (tabTipRender) {
            return tabTipRender(tab, tabNode);
        }
        if (contextOpen !== tab.key) { // 垃圾semi当hover触发tooltip时visible不起作用
            return (
                <Tooltip
                    position="bottomLeft"
                    content={tab.label}
                    mouseEnterDelay={500}
                    mouseLeaveDelay={0}
                    showArrow={false}
                    className='xm-tab-semi-tooltip'
                >{tabNode}</Tooltip>
            );
        }
        return tabNode;

    }
    const defaultTabOperRender = (tab: XM_TAB) => {
        if (tabOperRender) {
            return tabOperRender(tab);
        }
        if (tab.fixed) {
            if (tab.edited) {
                return <TaPinUnsave className="xm-tab-semi-fixed-unsave" onClick={() => handleFixed(tab, false)} />;
            }
            return <TaPin className="xm-tab-semi-fixed" onClick={() => handleFixed(tab, false)} />;
        }
        if (tab.edited) {
            if (!tab.closeable) {
                return <TaUnsave className="xm-tab-semi-unsave" />;
            }
            return <div className="xm-tab-semi-unsave-hover">
                <TaUnsave className="xm-tab-semi-unsave" />
                <TaClose className="xm-tab-semi-close" onClick={() => handleClose(tab)} />
            </div>
        }
        if (tab.closeable) {
            return <TaClose className="xm-tab-semi-close" onClick={() => handleClose(tab)} />;
        }
        return null;
    }
    const defaultAddRender = () => {
        if (addRender) {
            return addRender();
        }
        return <Button onClick={handleAdd} icon={<IconPlus />} theme='borderless' type="tertiary" disabled={tabList.length >= maxTabNum} />
    }
    const defaultMoreRender = () => {
        if (moreRender) {
            return moreRender();
        }
        return <Dropdown
            trigger="click"
            position="bottomRight"
            content={<div>124</div>}
        ><div><Button icon={<IconChevronDown />} theme='borderless' type="tertiary" /></div></Dropdown>
    }
    return (
        <TabsNav
            tabList={tabList}
            className={classNames(className, 'xm-tabs—nav-semi')}
            tabClassName={classNames(tabClassName, 'xm-tab-semi')}
            tabContextMenuRender={defautltTabContextMenuRender}
            tabOperRender={defaultTabOperRender}
            tabTipRender={defaultTabTipRender}
            addRender={defaultAddRender}
            moreRender={defaultMoreRender}
            {...extraProps}
        />
    );
});

export default Index;