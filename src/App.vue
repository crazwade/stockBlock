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
    <el-button @click="fetchData">Fetch Data</el-button>
    <div class=" w-full">
      <div ref="barChartRef" id="chart" style="height: 600px;" class=" mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { get_MI_INDEX } from './api/api';
import type { BWIBBU_ALL_TYPE, MI_INDEX_TYPE } from './api/api';

type dataType = {
  指數: string;
  收盤指數: string;
  漲跌: string;
  漲跌點數: string;
  漲跌百分比: string;
  特殊處理註記: string;
};

// Initialize the echarts instance by passing in the DOM element
let Chart: any;

const dialogVisible = ref(false);

const barChartRef = ref();
const filteredData = ref<BWIBBU_ALL_TYPE[] | MI_INDEX_TYPE[]>([]);
const target = ref('');

const handleClose = () => {
  dialogVisible.value = false;
};

function setBarChartLayOut () {
  Chart.setOption({
    title: {
      // Set the chart title
      text: '股票樹狀地圖',
    },
    series: [
      {
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
    tooltip: {},
  });
}

const fetchData = (async () => {
  // 可能會有多個不同的 API 也代表回傳的 RES 格式不同
  const resp = await get_MI_INDEX('+');

  if (resp.filteredData.length === 0) {
    // error
  }

  filteredData.value = resp.filteredData;
  target.value = resp.target;

  Chart.setOption({
    series: [
      {
        data: filteredData.value.map(item => ({
          name: item.指數,
          value: parseFloat(item.漲跌百分比),
          itemStyle: {
            color: getColor(Number(item.漲跌百分比)),
          },
        })),
      },
    ],
    tooltip: {
      // Set the tooltip format
      formatter: function (params: { name: string }) {
      const item: dataType | undefined = filteredData.value.find(item => item.指數 === params.name);

      if (!item) {
        return '';
      }

      return `指數: ${item.指數}<br>
              收盤指數: ${item.收盤指數}<br>
              漲跌: ${item.漲跌}<br>
              漲跌點數: ${item.漲跌點數}<br>
              漲跌百分比: ${item.漲跌百分比}<br>
              特殊處理註記: ${item.特殊處理註記}`;
      }
    },
  });
});

function getColor(num: number) {
  const getMin = Math.min(...filteredData.value.map(item => parseFloat(item[target.value])));
  const getMax = Math.max(...filteredData.value.map(item => parseFloat(item[target.value])));
  const lightness = (num - getMin) / (getMax - getMin);
  // 顏色深淺變化 80 最淺 / 60 最深
  return `hsl(0, 100%, ${80 - lightness * (80 - 60)}%)`;
}

onMounted (async () => {
  const echarts = getCurrentInstance().appContext.config.globalProperties.$echarts;
  Chart  = echarts.init(barChartRef.value);
  setBarChartLayOut();
  // Show a loading animation while the chart is being rendered
  Chart.showLoading();
  await fetchData();
  Chart.hideLoading();
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>