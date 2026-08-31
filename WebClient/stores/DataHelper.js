function Normalize(item, normData) {
  const dataMap = new Map(Object.entries(item.data));
  Object.keys(normData).forEach((date) => {
    if (dataMap.has(date)) {
      const entry = dataMap.get(date);
      entry.value = (entry.value / normData[date]) * 1000000;
    } else {
      dataMap.set(date, { dates: new Set(), value: 0.0 });
    }
  });
  item.data = Object.fromEntries(dataMap);
  return item;
}

function Prefill(item, normData) {
  const dataMap = new Map(Object.entries(item.data));
  Object.keys(normData).forEach((date) => {
    if (!dataMap.has(date)) {
      dataMap.set(date, { dates: new Set(), value: 0.0 });
    }
  });
  item.data = Object.fromEntries(dataMap);
  return item;
}

export { Normalize };
export { Prefill };