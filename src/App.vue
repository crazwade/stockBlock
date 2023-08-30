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
    <el-table :data="tableDataList" v-loading="isLoading" style="width: 100%">
      <el-table-column v-for="(field, index) in fieldData" :key="index" :prop="field" :label="field" />
    </el-table>
    <div class=" w-full">
      <div ref="barChartRef" id="chart" style="height: 500px;" class=" mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const dialogVisible = ref(false);
const isLoading = ref(true);

const fieldData = ref<string[]>([]);
const tableDataList = ref<Record<string, string | number>[]>([]);
const barChartRef = ref();

const handleClose = () => {
  dialogVisible.value = false;
};

const fetchData = () => {
  console.log('fetch');
};

const testData = [
  { name: 'jacky', age: 20 },
  { name: 'john', age: 18 },
  { name: 'jonny', age: 38 },
  { name: 'jenny', age: 28 },
  { name: 'mike', age: 68 },
  { name: 'apple', age: 50 },
  { name: 'cindy', age: 5 },
  { name: 'jonny2', age: 38 },
  { name: 'jenny2', age: 28 },
  { name: 'mike2', age: 68 },
  { name: 'apple2', age: 50 },
  { name: 'cindy2', age: 5 },
];

onMounted (() => {
  const Chart  = echarts.init(document.getElementById("chart"));
  Chart.setOption({
    title: {
        text: '股票樹狀地圖',
      },
      series: [
        {
          name: '年紀樹狀地圖',
          top: 100,
          type: 'treemap',
          data: testData.map(item => ({
            name: item.name,
            value: item.age,
          })),
        },
      ],
  });
  isLoading.value = false;
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>