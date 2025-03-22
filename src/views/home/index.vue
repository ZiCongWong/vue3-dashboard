<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-section">
          <h1>校园物联网云平台</h1>
          <p>实时监控与智能管理系统</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="data-overview">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in statisticsData" :key="index">
        <el-card class="statistic-card" :body-style="{ padding: '0px' }">
          <div class="card-content">
            <el-icon class="icon" :size="40">
              <component :is="item.icon"></component>
            </el-icon>
            <div class="data">
              <div class="value">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-info">
              <span>{{ item.progress }}%</span>
              <span class="trend">
                <el-icon v-if="item.trend > 0" color="#67C23A"><ArrowUp /></el-icon>
                <el-icon v-else color="#F56C6C"><ArrowDown /></el-icon>
                {{ Math.abs(item.trend) }}%
              </span>
            </div>
            <el-progress :percentage="item.progress" :color="item.color" :stroke-width="6" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-section">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备在线状态</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-icon><More /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>查看详情</el-dropdown-item>
                    <el-dropdown-item>导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="chart-container" ref="deviceStatusChartRef"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>能源消耗趋势</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-icon><More /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>查看详情</el-dropdown-item>
                    <el-dropdown-item>导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="chart-container" ref="energyChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="alert-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近告警</span>
              <el-button type="primary" text>查看全部</el-button>
            </div>
          </template>
          <el-table :data="alertData" style="width: 100%">
            <el-table-column prop="alert_time" label="时间" width="180" />
            <el-table-column prop="device_name" label="设备" width="180" />
            <el-table-column prop="location_name" label="位置" />
            <el-table-column prop="alert_type" label="类型">
              <template #default="scope">
                <el-tag :type="getAlertTypeTag(scope.row.alert_type)">{{ scope.row.alert_type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已处理' ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default>
                <el-button type="primary" link>处理</el-button>
                <el-button type="info" link>详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="quick-access">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速访问</span>
            </div>
          </template>
          <div class="quick-access-grid">
            <div v-for="(item, index) in quickAccessItems" :key="index" class="quick-access-item">
              <el-button type="primary" :icon="item.icon" circle></el-button>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getStats } from '@/api/Dashboard'
import * as echarts from 'echarts';
import {
  Monitor,
  DataLine,
  Cpu,
  Lightning,
  More,
  ArrowUp,
  ArrowDown,
  Setting,
  VideoCamera,
  Bell,
  Document,
  Location,
  Histogram
} from '@element-plus/icons-vue';

// 定时器引用
let statsTimer = null
// 使用ref创建响应式变量
const totalDevices = ref(0)
let totalDevicePer = ref(0)
const onlineDevices = ref(0)
let onlineDevicePer = ref(0)
const todayDataPoints = ref(0)
let todayDataPer = ref(0)
const energySavedPercentage = ref('')
let energyPer = ref(0)
const devicesTrend = ref(0)
const onlineTrend = ref(0)
const dataTrend = ref(0)
let deviceStatusData =reactive([])
let alertData =ref([])
let energyTrend =ref({})
const getStat = async () => {
  try {
      let res: any = await getStats()
      if (res.code === 200) {
        totalDevices.value = res.data.totalDevices
        totalDevicePer.value = (res.data.totalDevices/500)*100
        onlineDevices.value = res.data.onlineDevices
        onlineDevicePer.value =(res.data.onlineDevices/200)*100
        todayDataPoints.value = res.data.todayDataPoints
        todayDataPer.value = (res.data.todayDataPoints/200)*100
        energySavedPercentage.value = (res.data.energySavedPercentage).toString()+"%"
        energyPer.value =(res.data.energySavedPercentage/50)*100
        devicesTrend.value = res.data.devicesTrend
        onlineTrend.value = res.data.onlineTrend
        dataTrend.value = res.data.dataTrend
        deviceStatusData.splice(0, deviceStatusData.length, ...res.data.deviceStatus)
        alertData.value=res.data.recentAlerts
        energyTrend.value =res.data.energyTrend
        return 'OK'
      } else {
        return Promise.reject(new Error(res.data))
      }

  } catch (error) {

  }
}

// 统计数据
const statisticsData = ref([
  {
    icon: 'Monitor',
    label: '设备总数',
    value: totalDevices,
    progress: totalDevicePer,
    trend: devicesTrend,
    color: '#409EFF'
  },
  {
    icon: 'DataLine',
    label: '今日数据量',
    value: todayDataPoints,
    progress: todayDataPer,
    trend: dataTrend,
    color: '#67C23A'
  },
  {
    icon: 'Cpu',
    label: '在线设备',
    value: onlineDevices,
    progress: onlineDevicePer,
    trend: onlineTrend,
    color: '#E6A23C'
  },
  {
    icon: 'Lightning',
    label: '能源节约',
    value: energySavedPercentage,
    progress: energyPer,
    trend: 0,
    color: '#F56C6C'
  }
]);



// 快速访问项
const quickAccessItems = ref([
  { icon: Setting, label: '设备管理' },
  { icon: VideoCamera, label: '视频监控' },
  { icon: Bell, label: '告警中心' },
  { icon: Document, label: '报表分析' },
  { icon: Location, label: '位置追踪' },
  { icon: Histogram, label: '能源管理' }
]);

// 图表引用
const deviceStatusChartRef = ref<HTMLElement | null>(null);
const energyChartRef = ref<HTMLElement | null>(null);

// 获取告警类型对应的标签类型
const getAlertTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '温度异常': 'danger',
    '湿度异常': 'danger',
    '未授权访问': 'warning',
    '移动检测': 'info',
    '能耗异常': 'warning',
    '电压异常': 'warning',
    '水质异常': 'danger'
  };
  return typeMap[type] || 'info';
};

// 初始化图表
onMounted(async () => {

  await getStat()

  statsTimer = setInterval(() => {
    getStat()
  }, 60000) // 60000毫秒 = 1分钟
  console.log(deviceStatusData)
  // 设备状态饼图
  if (deviceStatusChartRef.value) {
    const deviceStatusChart = echarts.init(deviceStatusChartRef.value);
    deviceStatusChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['在线', '离线', '维护中', '故障']
      },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: deviceStatusData
        }
      ]
    });

    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', () => {
      deviceStatusChart.resize();
    });
  }

  // 能源消耗趋势图
  if (energyChartRef.value) {
    const energyChart = echarts.init(energyChartRef.value);
    energyChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['电力消耗', '水资源消耗', '同比节约']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: energyTrend.value.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '电力消耗',
          type: 'line',
          data: energyTrend.value.electricity,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255, 0.1)'
              }
            ])
          }
        },
        {
          name: '水资源消耗',
          type: 'line',
          data: energyTrend.value.water,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(103, 194, 58, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(103, 194, 58, 0.1)'
              }
            ])
          }
        },
        {
          name: '同比节约',
          type: 'line',
          data: energyTrend.value.saving,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#E6A23C'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(230, 162, 60, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(230, 162, 60, 0.1)'
              }
            ])
          }
        }
      ]
    });

    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', () => {
      energyChart.resize();
    });
  }
});
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  //background-color: #f5f7fa;
  min-height: 100vh;

  .welcome-section {
    text-align: center;
    padding: 30px 0;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
    border-radius: 8px;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  .data-overview {
    margin-bottom: 20px;

    .statistic-card {
      height: 100%;
      transition: all 0.3s;
      border-radius: 8px;
      overflow: hidden;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
      }

      .card-content {
        display: flex;
        align-items: center;
        padding: 20px;

        .icon {
          margin-right: 15px;
          padding: 10px;
          border-radius: 8px;
          background-color: rgba(64, 158, 255, 0.1);
          color: #409EFF;
        }

        .data {
          flex: 1;

          .value {
            font-size: 1.8rem;
            font-weight: 600;
            line-height: 1.2;
            color: #303133;
          }

          .label {
            font-size: 0.9rem;
            color: #909399;
            margin-top: 5px;
          }
        }
      }

      .progress-section {
        padding: 0 20px 15px;

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.8rem;
          color: #606266;

          .trend {
            display: flex;
            align-items: center;
            gap: 2px;
          }
        }
      }
    }
  }

  .charts-section {
    margin-bottom: 20px;

    .chart-card {
      height: 100%;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      .chart-container {
        height: 350px;
        width: 100%;
      }
    }
  }

  .alert-section {
    margin-bottom: 20px;

    .el-card {
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
    }

    .el-table {
      --el-table-border-color: transparent;
      --el-table-header-bg-color: #f5f7fa;

      .el-button {
        padding: 4px 0;
      }
    }
  }

  .quick-access {
    .el-card {
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      .quick-access-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;

        @media (max-width: 1200px) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }

        .quick-access-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          padding: 15px;
          border-radius: 8px;

          &:hover {
            background-color: #f5f7fa;
          }

          .el-button {
            font-size: 1.5rem;
            width: 60px;
            height: 60px;
          }

          span {
            font-size: 0.9rem;
            color: #606266;
          }
        }
      }
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .data-overview {
      .el-col {
        margin-bottom: 15px;
      }
    }

    .charts-section {
      .el-col {
        margin-bottom: 15px;
      }
    }
  }
}
</style>