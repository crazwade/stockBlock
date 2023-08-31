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
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

type dataType = {
  指數: string;
  收盤指數: string;
  漲跌: string;
  漲跌點數: string;
  漲跌百分比: string;
  特殊處理註記: string;
};

const dialogVisible = ref(false);
const isLoading = ref(true);

const barChartRef = ref();
const filteredData = ref<dataType[]>([]);

const handleClose = () => {
  dialogVisible.value = false;
};

const fetchData = (async () => {
  const response = await fetch("/api/exchangeReport/MI_INDEX");
  const data = await response.json();

  filteredData.value = data
    .filter((item: dataType) => item.漲跌 === '+')
    .sort((a, b) => parseFloat(b.漲跌百分比) - parseFloat(a.漲跌百分比))
    .slice(0, 20);
  console.log('fetch');
});

function getColor2(num: number) {
  const getMin = Math.min(...filteredData.value.map(item => parseFloat(item['漲跌百分比'])));
  const getMax = Math.max(...filteredData.value.map(item => parseFloat(item['漲跌百分比'])));
  const lightness = (num - getMin) / (getMax - getMin);
  // 顏色深淺變化 80 最淺 / 60 最深
  return `hsl(0, 100%, ${80 - lightness * (80 - 60)}%)`;
}

onMounted (async () => {
  await fetchData();
  // Initialize the echarts instance by passing in the DOM element
  const Chart  = echarts.init(document.getElementById("chart"));
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
        data: filteredData.value.map(item => ({
          // Set the name of each data point
          name: item.指數,
          // Set the value of each data point
          value: parseFloat(item.漲跌百分比),
          itemStyle: {
            // Set the color of each data point based on its value
            color: getColor2(Number(item.漲跌百分比)),
          },
        })),
        label: {
          show: true,
          backgroundColor: 'transparent',
        },
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
  isLoading.value = false;
  // Show a loading animation while the chart is being rendered
  Chart.showLoading();
  setTimeout(() => {
    // Hide the loading animation after a delay
    Chart.hideLoading();
  }, 2000);
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>