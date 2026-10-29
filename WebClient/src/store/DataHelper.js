function Fill(item, normData, scale) {
  const data = item.data;
  const result = {};
  for (const date in normData) {
    const entry = data[date];
    if (entry !== undefined) {
      if (scale) entry.value = (entry.value / normData[date]) * 1000000;
      result[date] = entry;
    } else {
      result[date] = { dates: new Set(), value: 0.0 };
    }
  }
  // Einträge außerhalb der Norm-Daten bleiben erhalten (wie zuvor)
  for (const date in data) {
    if (!(date in result)) result[date] = data[date];
  }
  item.data = result;
  return item;
}

function Normalize(item, normData) {
  return Fill(item, normData, true);
}

function Prefill(item, normData) {
  return Fill(item, normData, false);
}

export { Normalize };
export { Prefill };
