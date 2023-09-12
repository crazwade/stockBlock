<template>
  <div class=" flex flex-col justify-center items-center h-full w-full">
    <div class=" flex flex-col justify-center items-center mb-5">
      <div class=" w-full mb-5">
        <select v-model="apiFunction" class=" h-full w-full">
          <option value="">==主題選擇==</option>
          <option value="get_FMNPTK_ALL">上市個股年成交資訊</option>
          <option value="get_FMSRFK_ALL">上市個股月成交資訊</option>
          <option value="get_MI_INDEX">每日收盤行情-大盤統計資訊</option>
          <option value="get_BWIBBU_ALL">上市個股日本益比、殖利率及股價淨值比</option>
          <option value="get_STOCK_DAY_ALL">上市個股日成交資訊</option>
        </select>
      </div>
      <div class=" w-full mb-5">
        <select v-model="type" class=" h-full w-full">
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
  const apiFunctionToCall = apiMap[apiFunction.value];

  if (!apiFunctionToCall) {
    console.log(typeOptions.value);
    console.error('Invalid selection');
    return;
  }
  // 可能會有多個不同的 API 也代表回傳的 RES 格式不同
  const resp = await apiFunctionToCall(type.value);

  if (resp.length === 0) {
    // error
  }

  filteredData.value = resp;

  Chart.setOption({
    title: {
      // Set the chart title
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
</style>
./api