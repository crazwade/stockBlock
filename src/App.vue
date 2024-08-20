<template>
  <div class=" flex flex-col justify-center items-center h-full w-full">
    <div class=" flex flex-col justify-center items-center mb-5">
      <div class=" w-full mb-5">
        <select v-model="apiFunction" class=" h-full w-full text-black">
          <option value="">==主題選擇==</option>
          <option value="get_FMNPTK_ALL">上市個股年成交資訊</option>
          <option value="get_FMSRFK_ALL">上市個股月成交資訊</option>
          <option value="get_MI_INDEX">每日收盤行情-大盤統計資訊</option>
          <option value="get_BWIBBU_ALL">上市個股日本益比、殖利率及股價淨值比</option>
          <option value="get_STOCK_DAY_ALL">上市個股日成交資訊</option>
        </select>
      </div>
      <div class="w-full mb-5">
        <select v-model="type" class="h-full w-full text-black">
          <option value="">==細項選擇==</option>
          <option
            v-for="(option, index) in typeOptions"
            :key="index"
            :value="option.value"
          >
            {{ option.title }}
          </option>
        </select>
      </div>
      <div>
        <el-button @click="fetchData">Fetch Data</el-button>
      </div>
    </div>
    <div>
      <div ref="barChartRef" id="chart" style="height: 600px; width: calc(100vw - 120px);" class=" mx-auto" />
    </div>
    <div class="version">{{ version }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { get_BWIBBU_ALL, get_MI_INDEX, get_STOCK_DAY_ALL, get_FMSRFK_ALL, get_FMNPTK_ALL } from './api/api';
import type { Response as ApiData } from './api/api';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent } from 'echarts/components';
import { TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';

const mock_api_data = [
  {
    "name": "00632R 元大台灣50反1",
    "compare": "28580106044",
    "info": "證券代號: 00632R<br>\n    證券名稱: 元大台灣50反1<br>\n    成交股數: 28580106044<br>\n    成交金額: 144390694615<br>\n    成交筆數: 1331349<br>\n    最高價: 6.00<br>\n    最高價日期: 1月03日<br>\n    最低價: 4.48<br>\n    最低價日期: 12月29日<br>\n    收盤平均價: 4.99<br>"
  },
  {
    "name": "00637L 元大滬深300正2",
    "compare": "14924998574",
    "info": "證券代號: 00637L<br>\n    證券名稱: 元大滬深300正2<br>\n    成交股數: 14924998574<br>\n    成交金額: 218052014831<br>\n    成交筆數: 1738268<br>\n    最高價: 18.39<br>\n    最高價日期: 1月30日<br>\n    最低價: 10.83<br>\n    最低價日期: 12月21日<br>\n    收盤平均價: 14.48<br>"
  },
  {
    "name": "00929 復華台灣科技優息",
    "compare": "13107918359",
    "info": "證券代號: 00929<br>\n    證券名稱: 復華台灣科技優息<br>\n    成交股數: 13107918359<br>\n    成交金額: 228958906372<br>\n    成交筆數: 3816585<br>\n    最高價: 19.82<br>\n    最高價日期: 12月15日<br>\n    最低價: 15.03<br>\n    最低價日期: 6月09日<br>\n    收盤平均價: 17.19<br>"
  },
  {
    "name": "00715L 期街口布蘭特正2",
    "compare": "11496869906",
    "info": "證券代號: 00715L<br>\n    證券名稱: 期街口布蘭特正2<br>\n    成交股數: 11496869906<br>\n    成交金額: 154349407307<br>\n    成交筆數: 1351800<br>\n    最高價: 20.42<br>\n    最高價日期: 9月28日<br>\n    最低價: 11.10<br>\n    最低價日期: 6月13日<br>\n    收盤平均價: 14.59<br>"
  },
  {
    "name": "0056 元大高股息",
    "compare": "7695335744",
    "info": "證券代號: 0056<br>\n    證券名稱: 元大高股息<br>\n    成交股數: 7695335744<br>\n    成交金額: 253720257119<br>\n    成交筆數: 4488342<br>\n    最高價: 37.54<br>\n    最高價日期: 12月28日<br>\n    最低價: 25.19<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 32.01<br>"
  },
  {
    "name": "00712 復華富時不動產",
    "compare": "5612358765",
    "info": "證券代號: 00712<br>\n    證券名稱: 復華富時不動產<br>\n    成交股數: 5612358765<br>\n    成交金額: 53960041945<br>\n    成交筆數: 1731877<br>\n    最高價: 11.18<br>\n    最高價日期: 2月03日<br>\n    最低價: 8.43<br>\n    最低價日期: 10月30日<br>\n    收盤平均價: 9.77<br>"
  },
  {
    "name": "00753L 中信中國50正2",
    "compare": "4250040288",
    "info": "證券代號: 00753L<br>\n    證券名稱: 中信中國50正2<br>\n    成交股數: 4250040288<br>\n    成交金額: 40830255402<br>\n    成交筆數: 649466<br>\n    最高價: 14.79<br>\n    最高價日期: 1月30日<br>\n    最低價: 6.71<br>\n    最低價日期: 12月22日<br>\n    收盤平均價: 9.63<br>"
  },
  {
    "name": "00650L 復華香港正2",
    "compare": "2597266931",
    "info": "證券代號: 00650L<br>\n    證券名稱: 復華香港正2<br>\n    成交股數: 2597266931<br>\n    成交金額: 30854848708<br>\n    成交筆數: 333327<br>\n    最高價: 17.42<br>\n    最高價日期: 1月30日<br>\n    最低價: 8.37<br>\n    最低價日期: 12月11日<br>\n    收盤平均價: 12.12<br>"
  },
  {
    "name": "0050 元大台灣50",
    "compare": "2433566458",
    "info": "證券代號: 0050<br>\n    證券名稱: 元大台灣50<br>\n    成交股數: 2433566458<br>\n    成交金額: 303204503195<br>\n    成交筆數: 3082855<br>\n    最高價: 136.00<br>\n    最高價日期: 12月29日<br>\n    最低價: 108.45<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 124.54<br>"
  },
  {
    "name": "00713 元大台灣高息低波",
    "compare": "1742694381",
    "info": "證券代號: 00713<br>\n    證券名稱: 元大台灣高息低波<br>\n    成交股數: 1742694381<br>\n    成交金額: 76726287666<br>\n    成交筆數: 1410709<br>\n    最高價: 51.55<br>\n    最高價日期: 12月15日<br>\n    最低價: 36.57<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 44.48<br>"
  },
  {
    "name": "00642U 期元大S&P石油",
    "compare": "1682669857",
    "info": "證券代號: 00642U<br>\n    證券名稱: 期元大S&P石油<br>\n    成交股數: 1682669857<br>\n    成交金額: 26700348631<br>\n    成交筆數: 397358<br>\n    最高價: 20.52<br>\n    最高價日期: 9月28日<br>\n    最低價: 14.06<br>\n    最低價日期: 3月20日<br>\n    收盤平均價: 16.58<br>"
  },
  {
    "name": "00633L 富邦上証正2",
    "compare": "1675207554",
    "info": "證券代號: 00633L<br>\n    證券名稱: 富邦上証正2<br>\n    成交股數: 1675207554<br>\n    成交金額: 62179580851<br>\n    成交筆數: 406101<br>\n    最高價: 46.66<br>\n    最高價日期: 1月30日<br>\n    最低價: 27.31<br>\n    最低價日期: 12月21日<br>\n    收盤平均價: 36.58<br>"
  },
  {
    "name": "00706L 期元大S&P日圓正2",
    "compare": "1461297623",
    "info": "證券代號: 00706L<br>\n    證券名稱: 期元大S&P日圓正2<br>\n    成交股數: 1461297623<br>\n    成交金額: 12046259897<br>\n    成交筆數: 169927<br>\n    最高價: 11.00<br>\n    最高價日期: 1月16日<br>\n    最低價: 7.06<br>\n    最低價日期: 11月14日<br>\n    收盤平均價: 8.60<br>"
  },
  {
    "name": "006208 富邦台50",
    "compare": "933077244",
    "info": "證券代號: 006208<br>\n    證券名稱: 富邦台50<br>\n    成交股數: 933077244<br>\n    成交金額: 67008908984<br>\n    成交筆數: 1455549<br>\n    最高價: 77.35<br>\n    最高價日期: 12月29日<br>\n    最低價: 61.35<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 71.78<br>"
  },
  {
    "name": "00631L 元大台灣50正2",
    "compare": "815831540",
    "info": "證券代號: 00631L<br>\n    證券名稱: 元大台灣50正2<br>\n    成交股數: 815831540<br>\n    成交金額: 102111855049<br>\n    成交筆數: 598277<br>\n    最高價: 151.85<br>\n    最高價日期: 12月29日<br>\n    最低價: 90.40<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 126.92<br>"
  },
  {
    "name": "00752 中信中國50",
    "compare": "721022911",
    "info": "證券代號: 00752<br>\n    證券名稱: 中信中國50<br>\n    成交股數: 721022911<br>\n    成交金額: 13200750530<br>\n    成交筆數: 209701<br>\n    最高價: 21.30<br>\n    最高價日期: 1月30日<br>\n    最低價: 15.85<br>\n    最低價日期: 12月22日<br>\n    收盤平均價: 18.20<br>"
  },
  {
    "name": "00692 富邦公司治理",
    "compare": "584863744",
    "info": "證券代號: 00692<br>\n    證券名稱: 富邦公司治理<br>\n    成交股數: 584863744<br>\n    成交金額: 18151875744<br>\n    成交筆數: 469237<br>\n    最高價: 33.40<br>\n    最高價日期: 7月17日<br>\n    最低價: 26.50<br>\n    最低價日期: 1月03日<br>\n    收盤平均價: 30.92<br>"
  },
  {
    "name": "00648R 元大S&P500反1",
    "compare": "478645593",
    "info": "證券代號: 00648R<br>\n    證券名稱: 元大S&P500反1<br>\n    成交股數: 478645593<br>\n    成交金額: 3325393304<br>\n    成交筆數: 37628<br>\n    最高價: 7.65<br>\n    最高價日期: 1月06日<br>\n    最低價: 6.15<br>\n    最低價日期: 12月28日<br>\n    收盤平均價: 6.86<br>"
  },
  {
    "name": "00757 統一FANG+",
    "compare": "353754159",
    "info": "證券代號: 00757<br>\n    證券名稱: 統一FANG+<br>\n    成交股數: 353754159<br>\n    成交金額: 19865445459<br>\n    成交筆數: 278209<br>\n    最高價: 66.35<br>\n    最高價日期: 12月20日<br>\n    最低價: 32.45<br>\n    最低價日期: 1月06日<br>\n    收盤平均價: 53.13<br>"
  },
  {
    "name": "00701 國泰股利精選30",
    "compare": "322685349",
    "info": "證券代號: 00701<br>\n    證券名稱: 國泰股利精選30<br>\n    成交股數: 322685349<br>\n    成交金額: 8012893546<br>\n    成交筆數: 178561<br>\n    最高價: 27.53<br>\n    最高價日期: 7月27日<br>\n    最低價: 22.04<br>\n    最低價日期: 3月16日<br>\n    收盤平均價: 24.54<br>"
  }
];

const version = process.env.APP_VERSION;

const apiMap = {
  get_FMNPTK_ALL: get_FMNPTK_ALL,
  get_FMSRFK_ALL: get_FMSRFK_ALL,
  get_MI_INDEX: get_MI_INDEX,
  get_BWIBBU_ALL: get_BWIBBU_ALL,
  get_STOCK_DAY_ALL: get_STOCK_DAY_ALL,
};

const apiTitleMap: {
  get_FMNPTK_ALL: string;
  get_FMSRFK_ALL: string;
  get_MI_INDEX: string;
  get_BWIBBU_ALL: string;
  get_STOCK_DAY_ALL: string;
} = {
  get_FMNPTK_ALL: '上市個股年成交資訊',
  get_FMSRFK_ALL: '上市個股月成交資訊',
  get_MI_INDEX: '每日收盤行情-大盤統計資訊',
  get_BWIBBU_ALL: '上市個股日本益比、殖利率及股價淨值比',
  get_STOCK_DAY_ALL: '上市個股日成交資訊',
};

interface Option {
  value: string;
  title: string;
}

const typeOptionsMap: {
  get_FMNPTK_ALL: Option[];
  get_FMSRFK_ALL: Option[];
  get_MI_INDEX: Option[];
  get_BWIBBU_ALL: Option[];
  get_STOCK_DAY_ALL: Option[];
} = {
  get_FMNPTK_ALL: [
    { value: 'TradeVolume', title: '成交股數' },
    { value: 'Transaction', title: '成交筆數' },
  ],
  get_FMSRFK_ALL: [
    { value: 'Transaction', title: '成交筆數' },
    { value: 'TradeVolumeB', title: '成交股數' },
  ],
  get_MI_INDEX: [
    { value: '+', title: '漲幅百分比' },
    { value: '-', title: '跌幅百分比' },
  ],
  get_BWIBBU_ALL: [
    { value: 'PEratio', title: '本益比' },
    { value: 'DividendYield', title: '殖利率%' },
    { value: 'PBratio', title: '股價淨值比' },
  ],
  get_STOCK_DAY_ALL: [
    { value: 'TradeVolume', title: '成交股數' },
    { value: 'Transaction', title: '成交筆數' },
  ],
};

echarts.use([CanvasRenderer, TitleComponent, TooltipComponent, TreemapChart]);

// Initialize the echarts instance by passing in the DOM element
let Chart: echarts.ECharts;

const barChartRef = ref();
const filteredData = ref<ApiData[]>([]);
const apiFunction = ref<
'get_FMNPTK_ALL' |
'get_FMSRFK_ALL' |
'get_MI_INDEX' |
'get_BWIBBU_ALL' |
'get_STOCK_DAY_ALL' |
''>('');
const type = ref<string>('');
const typeOptions = ref<{
  value: string,
  title: string
}[]>([]);

watch(
  () => apiFunction.value,
  () => {
  type.value = '';
  if (apiFunction.value === '') {
    typeOptions.value = [];
    return;
  }
  typeOptions.value = [...typeOptionsMap[apiFunction.value]];
});

const fetchData = (async () => {
  if (type.value === '') {
    alert('有選項尚未完成');
    return;
  }
  Chart.showLoading();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const apiFunctionToCall = apiMap[apiFunction.value];

  if (!apiFunctionToCall) {
    console.log(typeOptions.value);
    console.error('Invalid selection');
    return;
  }

  try {
    // 可能會有多個不同的 API 也代表回傳的 RES 格式不同
    const resp = await apiFunctionToCall(type.value);

    filteredData.value = resp;

  } catch(error) {
    alert(`API request failed: ${error} （使用假資料代替）`);

    filteredData.value = mock_api_data;
  }

  Chart.setOption({
    title: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text: `${apiTitleMap[apiFunction.value]} 地圖`,
      top: 20,
    },
    series: [
      {
        data: filteredData.value.map((item) => ({
          name: item.name,
          value: parseFloat(item.compare),
          itemStyle: {
            color: getColor(Number(item.compare)),
          },
        })),
        // Set the series name
        name: 'Map',
        // Set the chart type to treemap
        type: 'treemap',
        levels: [
          {
            itemStyle: {
              borderWidth: 0,
              gapWidth: 1
            }
          },
        ],
        label: {
          show: true,
          backgroundColor: 'transparent',
        },
      },
    ],
    tooltip: {
      // Set the tooltip format
      formatter: function (params: { name: string }) {
      const item = (filteredData.value as ApiData[]).find(item => item.name === params.name);

      if (!item) {
        return '';
      }

      return item.info;
      }
    },
  });
  Chart.hideLoading();
});

function getColor(num: number) {
  const getMin = Math.min(...(filteredData.value as ApiData[]).map(item => parseFloat(item.compare)));
  const getMax = Math.max(...(filteredData.value as ApiData[]).map(item => parseFloat(item.compare)));
  const lightness = (num - getMin) / (getMax - getMin);
  // 顏色深淺變化 80 最淺 / 60 最深
  return `hsl(0, 0%, ${80 - lightness * (80 - 20)}%)`;
}

onMounted (async () => {
  Chart = echarts.init(document.getElementById('chart'));
  // await fetchData();
});
</script>

<style>
.version {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 0.2rem;
  font-size: 16px;
  color: black;
  opacity: 0.5;
}
</style>
