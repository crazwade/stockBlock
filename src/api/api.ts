export interface BWIBBU_ALL_TYPE {
  /** 股票代號 */
  Code: string,
  /** 股票名稱 */
  Name: string,
  /** 本益比 */
  PEratio: string,
  /** 殖利率(%) */
  DividendYield: string,
  /** 股價淨值比 */
  PBratio: string
}

/** 上市個股日本益比、殖利率及股價淨值比（依代碼查詢）
 *
 *  @param type - PEratio 本益比
 *  @param type - DividendYield 殖利率%
 *  @param type - PBratio 股價淨值比
 */
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
  /** 證券代號 */
  Code: string,
  /** 證券名稱 */
  Name: string,
  /** 成交股數 */
  TradeVolume: string,
  /** 成交金額 */
  TradeValue: string,
  /** 開盤價 */
  OpeningPrice: string,
  /** 最高價 */
  HighestPrice: string,
  /** 最低價 */
  LowestPrice: string,
  /** 收盤價 */
  ClosingPrice: string,
  /** 漲跌價差 */
  Change: string,
  /** 成交筆數 */
  Transaction: string
}

/** 上市個股日成交資訊
 *
 *  @param type - TradeVolume 成交股數
 *  @param type - Transaction 成交筆數
 */
export const get_STOCK_DAY_ALL = (async (type: 'TradeVolume' | 'Transaction'): Promise<{
  filteredData: STOCK_DAY_ALL_TYPE[];
  target: string;
}> => {
  const res = await fetch('/api/exchangeReport/STOCK_DAY_ALL');
  let filteredData : STOCK_DAY_ALL_TYPE[] = [];

  if (res.type === 'cors') {
    return { filteredData: [], target: '' };
  }

  const resData: STOCK_DAY_ALL_TYPE[] = await res.json();

  filteredData = resData
    .sort((a, b) => parseFloat(b[type]) - parseFloat(a[type]))
    .slice(0, 20);

  return { filteredData, target: '漲跌百分比' };
});

export interface FMSRFK_ALL_TYPE {
  /** 證券代號 */
  Code: string,
  /** 證券名稱 */
  Name: string,
  /** 最高價 */
  HighestPrice: string,
  /** 最低價 */
  LowestPrice: string,
  /** 加權(A/B)平均價 */
  WeightedAvgPriceAB: string;
  /** 成交筆數 */
  Transaction: string,
  /** 成交金額 */
  TradeValueA: string,
  /** 成交股數 */
  TradeVolumeB: string,
  /** 周轉率 */
  TurnoverRatio: string,
}

/** 上市個股月成交資訊
 *
 *  @param type - WeightedAvgPriceAB 加權(A/B)平均價
 *  @param type - Transaction 成交股數
 */
export const get_FMSRFK_ALL = (async (type: 'WeightedAvgPriceAB' | 'Transaction'): Promise<{
  filteredData: FMSRFK_ALL_TYPE[];
  target: string;
}> => {
  const res = await fetch('/api/exchangeReport/FMSRFK_ALL');
  let filteredData : FMSRFK_ALL_TYPE[] = [];

  if (res.type === 'cors') {
    return { filteredData: [], target: '' };
  }

  const resData: FMSRFK_ALL_TYPE[] = await res.json();

  filteredData = resData
    .sort((a, b) => parseFloat(b[type]) - parseFloat(a[type]))
    .slice(0, 20);

  return { filteredData, target: '漲跌百分比' };
});

export interface FMNPTK_ALL_TYPE {
  /** 證券代號 */
  Code: string,
  /** 證券名稱 */
  Name: string,
  /** 成交股數 */
  TradeVolume: string,
  /** 成交金額 */
  TradeValue: string,
  /** 成交筆數 */
  Transaction: string,
  /** 最高價 */
  HighestPrice: string,
  /** HIGH 日期 */
  HDate: string,
  /** 最低價 */
  LowestPrice: string,
  /** LOW 日期 */
  LDate: string,
  /** 收盤平均價 */
  AvgClosingPrice: string,
}

/** 上市個股年成交資訊
 *
 *  @param type - TradeVolume 成交股數
 *  @param type - Transaction 成交筆數
 */
export const get_FMNPTK_ALL = (async (type: 'TradeVolume' | 'Transaction'): Promise<{
  filteredData: FMNPTK_ALL_TYPE[];
  target: string;
}> => {
  const res = await fetch('/api/exchangeReport/FMNPTK_ALL');
  let filteredData : FMNPTK_ALL_TYPE[] = [];

  if (res.type === 'cors') {
    return { filteredData: [], target: '' };
  }

  const resData: FMNPTK_ALL_TYPE[] = await res.json();

  filteredData = resData
    .sort((a, b) => parseFloat(b[type]) - parseFloat(a[type]))
    .slice(0, 20);

  return { filteredData, target: '漲跌百分比' };
});
