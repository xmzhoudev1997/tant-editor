import { useScroll, useSize } from "ahooks";
import { XM_TABS_NAV } from './props'
import { useEffect, useMemo, useRef, useState } from "react";
import { DropResult } from "react-beautiful-dnd";

export default ({
  tabKey, tabList, maxTabWidth = 216, minTabWidth = 76, onChange = () => { },
}: XM_TABS_NAV) => {
  const [isRight, setIsRight] = useState(true);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const tabOperRef = useRef<HTMLDivElement>(null);
  const tabNavSize = useSize(tabNavRef);
  const tabOperSize = useSize(tabOperRef);
  const scrollDom: HTMLDivElement | undefined | null = tabNavRef.current?.querySelector('.xm-tabs-scroll');
  const tabScrollPosition = useScroll(scrollDom);
  const tabWidth = useMemo(() => {
    if (!tabNavSize?.width || !tabList?.length || !minTabWidth || !maxTabWidth) {
      return 0;
    }
    const length = tabList?.length;
    const width = tabNavSize?.width - (tabOperSize?.width || 0);
    if (length * maxTabWidth <= width) {
      return maxTabWidth;
    }
    if (length * minTabWidth <= width) {
      return Math.floor(width / length) - 24;
    }
    return minTabWidth;
  }, [tabNavSize?.width, tabOperSize?.width, tabList?.length]);
  const handleDragEnd = async (data: DropResult) => {
    const sourceIndex = data?.source?.index ?? -1;
    const targetIndex = data?.destination?.index ?? -1;
    const sourceDropId = data?.source?.droppableId;
    const sourceTab = tabList[sourceIndex];
    const targetDropId = data?.destination?.droppableId || '';
    const targetTab = tabList[targetIndex];
    if (!sourceDropId || !sourceTab || !targetDropId || !targetTab) {
      return;
    }
    tabList.splice(sourceIndex, 1);
    tabList.splice(targetIndex, 0, sourceTab);
    if (sourceTab.fixed && tabList[targetIndex - 1]) {
      targetTab.fixed = tabList[targetIndex - 1].fixed;
    }
    if (!sourceTab.fixed && tabList[targetIndex + 1]) {
      targetTab.fixed = tabList[targetIndex + 1].fixed;
    }
    onChange(tabKey, [...tabList]);
  }
  useEffect(() => {
    if (!tabKey || !scrollDom) {
      return;
    };
    const index = tabList.findIndex(t => t.key === tabKey);
    if (scrollDom.children[index]) {
      (scrollDom.children[index] as any).scrollIntoViewIfNeeded();
    }
  }, [tabKey]);
  useEffect(() => {
    const left = tabScrollPosition?.left || 0;
    const offsetWidth = scrollDom?.offsetWidth || 0;
    const scrollWidth = scrollDom?.scrollWidth || 0 - 1;
    setIsRight(scrollWidth <= offsetWidth || left + offsetWidth >= scrollWidth)
  }, [tabScrollPosition, scrollDom?.offsetWidth, scrollDom?.scrollWidth]);
  return {
    tabWidth,
    tabNavRef,
    tabOperRef,
    handleDragEnd,
    isLeft: !tabScrollPosition?.left,
    isRight,
  }
}