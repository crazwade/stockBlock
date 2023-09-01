import { createApp } from 'vue';
import './style/style.css';
import './style/tailwindCSS.css';
import ElementPlus from 'element-plus';
import * as echarts from 'echarts/core';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.config.globalProperties.$echarts = echarts;
app.mount('#app');
