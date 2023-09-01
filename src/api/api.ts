export interface BWIBBU_ALL_TYPE {
  Code: string,
  Name: string,
  PEratio: string,
  DividendYield: string,
  PBratio: string
}

// 上市個股日本益比、殖利率及股價淨值比（依代碼查詢）
export const get_BWIBBU_ALL = (async (type: 'PEratio' | 'DividendYield' | 'PBratio'): Promise<{
  filteredData: BWIBBU_ALL_TYPE[]
}> => {
  const res = await fetch('/api/exchangeReport/BWIBBU_ALL');
  let filteredData : BWIBBU_ALL_TYPE[] = [];

  if (res.type === 'cors') {
    return { filteredData: [] };
  }

  const resData: BWIBBU_ALL_TYPE[] = await res.json();

  filteredData = resData
    .sort((a, b) => parseFloat(b[type]) - parseFloat(a[type]))
    .slice(0, 20);

  return { filteredData };
});

export interface MI_INDEX_TYPE {
  指數: string,
  收盤指數: string,
  漲跌: string,
  漲跌點數: string,
  漲跌百分比: string,
  特殊處理註記: string
}

/** 每日收盤行情-大盤統計資訊
 *
 *  @param type - '+' || '-' 漲跌百分比
 */
export const get_MI_INDEX = (async (type: '+' | '-'): Promise<{
  filteredData: MI_INDEX_TYPE[];
  target: string;
}> => {
  const res = await fetch('/api/exchangeReport/MI_INDEX');
  let filteredData : MI_INDEX_TYPE[] = [];

  if (res.type === 'cors') {
    return { filteredData: [], target: '' };
  }

  const resData: MI_INDEX_TYPE[] = await res.json();

  filteredData = resData
    .filter((item: MI_INDEX_TYPE) => type === '+'
      ? item.漲跌 === '+'
      : item.漲跌 === '+')
    .sort((a, b) => type === '+'
      ? parseFloat(b.漲跌百分比) - parseFloat(a.漲跌百分比)
      : parseFloat(a.漲跌百分比) - parseFloat(b.漲跌百分比))
    .slice(0, 20);

  return { filteredData, target: '漲跌百分比' };
});


export interface STOCK_DAY_ALL_TYPE {
  Code: string,
  Name: string,
  TradeVolume: string,
  TradeValue: string,
  OpeningPrice: string,
  HighestPrice: string,
  LowestPrice: string,
  ClosingPrice: string,
  Change: string,
  Transaction: string
}

export interface FMSRFK_ALL_TYPE {
  Code: string,
  Name: string,
  HighestPrice: string,
  LowestPrice: string,
  WeightedAvgPriceAB: string,
  Transaction: string,
  TradeValueA: string,
  TradeVolumeB: string,
  TurnoverRatio: string
}

export interface FMNPTK_ALL {
  Code: string,
  Name: string,
  TradeVolume: string,
  TradeValue: string,
  Transaction: string,
  HighestPrice: string,
  HDate: string,
  LowestPrice: string,
  LDate: string,
  AvgClosingPrice: string
}
