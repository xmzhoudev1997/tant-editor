import React, { FC } from "react";
import { XM_TAB, XM_TABS_NAV } from "./props";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { DragDropContext, Droppable, Draggable, DraggableProvided } from 'react-beautiful-dnd';

const Index: FC<XM_TABS_NAV> = (props) => {
  const {
    className,
    tabClassName,
    tabKey,
    tabList,
    dragDisabled,
    tabRender,
    addRender,
    tabContextMenuRender,
    tabOperRender,
    moreRender,
    extraRender,
    onChange = () => { },
    tabIconRender,
    tabTipRender,
  } = props;
  const {
    tabWidth, tabNavRef, tabOperRef, handleDragEnd, isLeft, isRight,
  } = useData(props);
  const addNode = addRender ? addRender() : null;
  const moreNode = moreRender ? moreRender() : null;
  const extraNode = extraRender ? extraRender() : null;

  const tabNodeRender = (tab: XM_TAB, dragging: boolean, provided: DraggableProvided) => {
    const operNode = tabOperRender ? tabOperRender(tab) : null;
    const iconNode = tabIconRender ? tabIconRender(tab) : null;
    const tabNode =
      <div
        className={classnames(
          'xm-tab',
          tabClassName,
          tabKey === tab.key ? 'xm-tab-active' : '',
          dragging ? 'xm-tab-dragging' : '',
        )}
        ref={provided?.innerRef}
        {...(provided?.dragHandleProps || {})}
        {...(provided?.draggableProps || {})}
        style={{ ...(provided?.draggableProps?.style || {}), width: tabWidth }}
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
    <div className={classnames('xm-tabs-nav', className)}>
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <Droppable
          droppableId="nav"
          direction="horizontal"
          isDropDisabled={dragDisabled}
        renderClone={(provided, snapshot, descriptor) => {
          const index = descriptor?.source?.index;
          const tab = tabList[index];
          if (!tab) {
            return null;
          }
          if (provided.draggableProps.style?.transform) {
            provided.draggableProps.style.transform = provided.draggableProps.style?.transform.replace(/, [\-0-9]+px/, ', 0px');
          }
          return tabNodeRender(tab, true, provided) as any
        }}
        >
          {
            (dropProvided) => {
              return <div className="xm-tabs-bar"
                ref={(r) => {
                  (tabNavRef as any).current = r;
                  dropProvided.innerRef(r);
                }}
                {...dropProvided.droppableProps}
              >
                {
                  !isLeft && <div className="xm-tabs-scroll-left" />
                }
                <div className="xm-tabs-scroll" tabIndex={1}>
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
                <div className="xm-tabs-oper" ref={tabOperRef}>
                  {
                    !isRight && <div className="xm-tabs-scroll-right" />
                  }
                  {
                    !!addNode &&
                    <div className="xm-tabs-add">
                      {addNode}
                    </div>
                  }
                  {
                    !!moreNode && !!addNode && <div className="xm-tabs-split" />
                  }
                  {
                    !!moreNode &&
                    <div className="xm-tabs-more">
                      {moreNode}
                    </div>
                  }
                </div>
              </div>
            }
          }
        </Droppable>
        {
          !!extraNode && <div className="xm-tabs-extra">
            {extraNode}
          </div>
        }
      </DragDropContext>
    </div>
  );
};

export default Index;