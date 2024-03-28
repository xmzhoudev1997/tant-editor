import React, { FC, forwardRef } from 'react';
import './index.less';
import useData from './hook';
import { XM_TABS_NAV_SEMI, XM_TABS_NAV_SEMI_MORE, XM_TABS_NAV_SEMI_REF } from './props';
import { TabsNav, XM_TAB } from '@xmzhou/rc-tabs';
import classNames from 'classnames';
import { Dropdown, Tooltip, Button, Input } from '@douyinfe/semi-ui';
import { IconChevronDown, IconPlus, IconSearch } from '@douyinfe/semi-icons';
import { TaPin, TaClose, TaAdd1, TaPinUnsave, TaUnsave } from '@tant/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


const Index: FC<XM_TABS_NAV_SEMI_MORE> = (props) => {
    const {
        tabKey, tabList, dragDisabled,
        tabOperRender, tabIconRender, onChange, tabRender,
        tabTipRender, tabContextMenuRender,
    } = props;
    const {
        contextOpen, setContextOpen, handleMoreContextMenuRender,
        handleAdd, handleClose, handleTabContextMenuRender, handleFixed,
    } = useData(props);

    const tabNodeRender = (tab: XM_TAB, dragging: boolean, provided: DraggableProvided) => {
        const operNode = tabOperRender ? tabOperRender(tab) : null;
        const iconNode = tabIconRender ? tabIconRender(tab) : null;
        const tabNode =
            <div
                className={classNames(
                    'xm-tab-semi-more-tab',
                    tabKey === tab.key ? 'xm-tab-semi-more-tab-active' : '',
                    dragging ? 'xm-tab-semi-more-tab-dragging' : '',
                )}
                ref={provided?.innerRef}
                {...(provided?.dragHandleProps || {})}
                {...(provided?.draggableProps || {})}
                style={{ ...(provided?.draggableProps?.style || {}) }}
                onClick={() => tabKey === tab.key ? null : onChange(tab.key, tabList)}
            >
                {
                    !!iconNode && <div className="xm-tab-icon">
                        {iconNode}
                    </div>
                }
                <div className="xm-tab-name">
                    {tabRender ? tabRender(tab) : tab.label}
                </div>
                {
                    !!operNode && <div className="xm-tab-oper" >
                        <div className={tabKey === tab.key ? 'xm-tab-oper-shadow-active' : 'xm-tab-oper-shadow'} />
                        <div className={tabKey === tab.key ? 'xm-tab-oper-bg-active' : 'xm-tab-oper-bg'}>
                            <div onClick={e => e.stopPropagation()}>{operNode}</div>
                        </div>
                        <div className={tabKey === tab.key ? 'xm-tab-padding-active' : 'xm-tab-padding'} />
                    </div>
                }
            </div >;
        const node = tabTipRender ? tabTipRender(tab, tabNode) : tabNode;
        return tabContextMenuRender ? tabContextMenuRender(tab, node) : node;
    }

    return (
        <div className="xm-tab-semi-more">
            <Input prefix={<IconSearch />} showClear />
            <DragDropContext
                onDragEnd={handleDragEnd}
            >
                <Droppable
                    droppableId="nav"
                    direction="horizontal"
                    isDropDisabled={dragDisabled}
                // renderClone={(provided, snapshot, descriptor) => {
                //     const index = descriptor?.source?.index;
                //     const tab = tabList[index];
                //     if (!tab) {
                //         return null;
                //     }
                //     if (provided.draggableProps.style?.transform) {
                //         provided.draggableProps.style.transform = provided.draggableProps.style?.transform.replace(/, [\-0-9]+px/, ', 0px');
                //     }
                //     console.log(provided.draggableProps.style?.transform);
                //     return tabNodeRender(tab, true, provided) as any
                // }}
                >
                    {
                        (dropProvided) => {
                            return <div className="xm-tab-semi-more-scroll"
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                            >
                                {
                                    tabList?.map((tab, index) => {
                                        return <Draggable draggableId={tab.key} index={index} key={tab.key} isDragDisabled={dragDisabled}>
                                            {
                                                (provided, snapshot) => {
                                                    return tabNodeRender(tab, snapshot.isDragging, provided) as any
                                                }
                                            }
                                        </Draggable>
                                    })
                                }
                                {
                                    dropProvided.placeholder
                                }
                            </div>
                        }
                    }
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Index;