<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="80%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div>
    <select v-model="selectValue">
      <option value="上市個股日本益比">上市個股日本益比</option>
      <option value="上市個股殖利率">上市個股殖利率</option>
      <option value="上市個股股價淨值比">上市個股股價淨值比</option>
      <option value="每日收盤行情">每日收盤行情</option>
      <option value="上市個股日成交資訊">上市個股日成交資訊</option>
    </select>
    <el-button @click="fetchData">Fetch Data</el-button>
    <div class=" w-full">
      <div ref="barChartRef" id="chart" style="height: 600px;" class=" mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get_BWIBBU_ALL, get_MI_INDEX, get_STOCK_DAY_ALL, get_FMSRFK_ALL, get_FMNPTK_ALL } from './api/api';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent } from 'echarts/components';
import { TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';

type ApiFunctionKeys = '上市個股日本益比' | '上市個股殖利率' | '上市個股股價淨值比' | '每日收盤行情' | '上市個股日成交資訊';

type dataType = {
  /** 名稱 */
  name: string,
  /** 比較的值 */
  compare: string,
  /** tooltip 內容 */
  info: string,
};

type ApiFunction = () => Promise<dataType[]>;

const apiFunctions: Record<ApiFunctionKeys, ApiFunction> = {
  上市個股日本益比: get_BWIBBU_ALL,
  上市個股殖利率: get_MI_INDEX,
  上市個股股價淨值比: get_STOCK_DAY_ALL,
  每日收盤行情: get_FMSRFK_ALL,
  上市個股日成交資訊: get_FMNPTK_ALL,
};

echarts.use([CanvasRenderer, TitleComponent, TooltipComponent, TreemapChart]);

// Initialize the echarts instance by passing in the DOM element
let Chart: echarts.ECharts;

const dialogVisible = ref(false);

const barChartRef = ref();
const filteredData = ref<dataType[]>([]);
const selectValue = ref('上市個股日本益比');

const handleClose = () => {
  dialogVisible.value = false;
};

const fetchData = (async () => {
  Chart.showLoading();
  const apiFunction = apiFunctions[selectValue.value as ApiFunctionKeys];

  if (!apiFunction) {
    console.log(selectValue.value);
    console.error('Invalid selection');
    return;
  }
  // 可能會有多個不同的 API 也代表回傳的 RES 格式不同
  const resp = await apiFunction();

  if (resp.length === 0) {
    // error
  }

  filteredData.value = resp;

  Chart.setOption({
    title: {
      // Set the chart title
      text: `${selectValue.value} 地圖`,
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
        name: selectValue.value,
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
      const item = (filteredData.value as dataType[]).find(item => item.name === params.name);

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
  const getMin = Math.min(...(filteredData.value as dataType[]).map(item => parseFloat(item.compare)));
  const getMax = Math.max(...(filteredData.value as dataType[]).map(item => parseFloat(item.compare)));
  const lightness = (num - getMin) / (getMax - getMin);
  // 顏色深淺變化 80 最淺 / 60 最深
  return `hsl(0, 100%, ${80 - lightness * (80 - 60)}%)`;
}

onMounted (async () => {
  Chart = echarts.init(document.getElementById('chart'));
  await fetchData();
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
./api