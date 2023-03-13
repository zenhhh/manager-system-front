import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'dayjs/locale/zh-cn' //中文
import locale from 'element-plus/lib/locale/lang/zh-cn' //中文

import App from './App.vue';

const app = createApp(App)
app.use(ElementPlus,{ locale })
app.mount('#app')
