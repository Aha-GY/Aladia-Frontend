class Event {
  constructor(data) {
    this.start = data.start;
    this.end = data.end;
    this.startMs = +data.startDateTime;
    this.endMs = +data.endDateTime;
    this.top = data.top;
    this.height = data.height;
    this.data = data;
  }
}

function sortByRender(events) {
  const sortedByTime = events.sort((a, b) => {
    if (a.startMs !== b.startMs) {
      return a.startMs - b.startMs;
    }
    return b.endMs - a.endMs; // 长事件优先
  });

  const sorted = [];
  while (sortedByTime.length > 0) {
    const event = sortedByTime.shift();
    sorted.push(event);

    for (let i = 0; i < sortedByTime.length; i++) {
      const test = sortedByTime[i];
      if (event.endMs > test.startMs) {
        continue;
      }

      if (i > 0) {
        const nextEvent = sortedByTime.splice(i, 1)[0];
        sorted.push(nextEvent);
      }
      break;
    }
  }
  return sorted;
}

export function getStyledEvents(events) {
  const proxies = events.map((event) => new Event(event));
  const sortedEvents = sortByRender(proxies);

  const columns = []; // 每列的最后结束时间
  const columnAssignments = []; // 存储每个事件分配的列索引

  // 分配列
  for (const event of sortedEvents) {
    let columnIndex = 0;
    // 找到第一个可以放置的列
    while (columnIndex < columns.length) {
      if (event.start >= columns[columnIndex]) {
        break;
      }
      columnIndex++;
    }

    // 更新列状态
    if (columnIndex < columns.length) {
      columns[columnIndex] = event.end;
    } else {
      columns.push(event.end);
    }
    columnAssignments.push(columnIndex);
  }

  // 计算总列数
  const totalColumns = columns.length;

  // 生成最终样式
  return sortedEvents.map((event, index) => {
    const columnIndex = columnAssignments[index];

    const leftPercentage = (100 / totalColumns) * columnIndex;

    const widthPercentage = Math.min(100, 100 - leftPercentage);

    return Object.assign(event.data, {
      width: widthPercentage / 100,
      left: leftPercentage / 100,
    });
  });
}
