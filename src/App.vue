<template>
  <div>
    <el-button @click="fetchData">Fetch Data</el-button>
    <el-table :data="tableDataList" v-loading="isLoading" style="width: 100%">
      <el-table-column v-for="(field, index) in fieldData" :key="index" :prop="field" :label="field" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const isLoading = ref(true);

const tableData = ref<string[][]>([]);
const fieldData = ref<string[]>([]);
const tableDataList = ref<Record<string, string>[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch('/api/getInfo');
    const data: {
      data: string[][],
      fields: string[],
      state: string,
      title: string,
    } = await response.json();

    if (!data.state) {
      console.log('error');
    }

    tableData.value = data.data;
    fieldData.value = data.fields;

    tableDataList.value = tableData.value.map(row => {
      const rowData: Record<string, string> = {};
      fieldData.value.forEach((field, index) => {
        rowData[field] = row[index];
      });
      return rowData;
    });
  } catch (error: any) {
    console.log(error);
  }
};

onMounted (async () => {
  await fetchData();
  isLoading.value = false;
});
</script>
