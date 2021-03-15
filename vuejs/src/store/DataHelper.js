function Normalize(item, normData) {
  Object.keys(normData).forEach((date) => {
    if (date in item.data)
      item.data[date].value = (item.data[date].value / normData[date]) * 1000000;
    else item.data[date] = { dates: new Set(), value: 0.0 };
  });
  return item;
}

export { Normalize };
