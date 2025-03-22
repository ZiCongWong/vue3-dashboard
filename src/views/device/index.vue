<template>
  <div class="device-management-container">
    <el-card class="header-card">
      <div class="page-header">
        <h1>设备管理</h1>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddDevice">
            <el-icon><Plus /></el-icon>添加设备
          </el-button>
          <el-button type="success" @click="exportDeviceData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="设备名称">
          <el-input v-model="filterForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="filterForm.type" placeholder="请选择设备类型" clearable>
            <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-cascader
            v-model="filterForm.location"
            :options="locationOptions"
            placeholder="请选择位置"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetFilter">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-loading="tableLoading"
        :data="deviceList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="设备ID" width="100" />
        <el-table-column prop="name" label="设备名称" width="150" />
        <el-table-column prop="type" label="设备类型" width="120">
          <template #default="scope">
            <el-tag :type="getDeviceTypeTag(scope.row.type)">{{ getDeviceTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActive" label="最后活跃时间" width="180" />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDevice(scope.row)">
              <el-icon><View /></el-icon>查看
            </el-button>
            <el-button type="success" link @click="handleEditDevice(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" link @click="handleDeleteDevice(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 设备详情对话框 -->
    <el-dialog
      v-model="deviceDetailVisible"
      title="设备详情"
      width="70%"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备ID">{{ currentDevice.id }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentDevice.name }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">
          <el-tag :type="getDeviceTypeTag(currentDevice.type)">{{ getDeviceTypeName(currentDevice.type) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDevice.status)">{{ getStatusName(currentDevice.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="位置">{{ currentDevice.location }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentDevice.ipAddress }}</el-descriptions-item>
        <el-descriptions-item label="MAC地址">{{ currentDevice.macAddress }}</el-descriptions-item>
        <el-descriptions-item label="最后活跃时间">{{ currentDevice.lastActive }}</el-descriptions-item>
        <el-descriptions-item label="安装日期">{{ currentDevice.installDate }}</el-descriptions-item>
        <el-descriptions-item label="维护周期">{{ currentDevice.maintenanceCycle }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentDevice.manager }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ currentDevice.contact }}</el-descriptions-item>
      </el-descriptions>

      <div class="device-detail-tabs">
        <el-tabs>
          <el-tab-pane label="实时数据">
            <div class="chart-container" ref="realtimeChartRef"></div>
          </el-tab-pane>
          <el-tab-pane label="历史记录">
            <el-table :data="deviceHistoryData" border style="width: 100%">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="event" label="事件" />
              <el-table-column prop="operator" label="操作人" width="120" />
              <el-table-column prop="details" label="详情" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="告警记录">
            <el-table :data="deviceAlertData" border style="width: 100%">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="type" label="告警类型">
                <template #default="scope">
                  <el-tag :type="getAlertTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="details" label="详情" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '已处理' ? 'success' : 'danger'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      v-model="deviceFormVisible"
      :title="isEdit ? '编辑设备' : '添加设备'"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="deviceFormRef"
        :model="deviceForm"
        :rules="deviceFormRules"
        label-width="100px"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="deviceForm.type" placeholder="请选择设备类型" style="width: 100%">
            <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-cascader
            v-model="deviceForm.locationArray"
            :options="locationOptions"
            placeholder="请选择位置"
            style="width: 100%"
            @change="handleLocationChange"
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="deviceForm.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddress">
          <el-input v-model="deviceForm.macAddress" placeholder="请输入MAC地址" />
        </el-form-item>
        <el-form-item label="安装日期" prop="installDate">
          <el-date-picker
            v-model="deviceForm.installDate"
            type="date"
            placeholder="选择安装日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="维护周期" prop="maintenanceCycle">
          <el-input v-model="deviceForm.maintenanceCycle" placeholder="请输入维护周期" />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="deviceForm.manager" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="deviceForm.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="deviceForm.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeviceForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="删除确认"
      width="30%"
    >
      <div class="delete-confirm-content">
        <el-icon class="delete-icon"><WarningFilled /></el-icon>
        <p>确定要删除设备 "{{ currentDevice.name }}" 吗？此操作不可恢复！</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as echarts from 'echarts';
import {
  Plus,
  Download,
  Search,
  Refresh,
  View,
  Edit,
  Delete,
  WarningFilled
} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

// 表格加载状态
const tableLoading = ref(false);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 筛选表单
const filterForm = reactive({
  name: '',
  type: '',
  status: '',
  location: []
});

// 设备类型选项
const deviceTypes = [
  { value: 'sensor', label: '传感器' },
  { value: 'camera', label: '摄像头' },
  { value: 'access', label: '门禁系统' },
  { value: 'environment', label: '环境监测' },
  { value: 'energy', label: '能源管理' }
];

// 状态选项
const statusOptions = [
  { value: 'online', label: '在线' },
  { value: 'offline', label: '离线' },
  { value: 'maintenance', label: '维护中' },
  { value: 'fault', label: '故障' }
];

// 位置选项（级联选择器数据）
const locationOptions = [
  {
    value: 'teaching',
    label: '教学区',
    children: [
      {
        value: 'building1',
        label: '第一教学楼',
        children: [
          { value: 'floor1', label: '一楼' },
          { value: 'floor2', label: '二楼' },
          { value: 'floor3', label: '三楼' },
          { value: 'floor4', label: '四楼' }
        ]
      },
      {
        value: 'building2',
        label: '第二教学楼',
        children: [
          { value: 'floor1', label: '一楼' },
          { value: 'floor2', label: '二楼' },
          { value: 'floor3', label: '三楼' },
          { value: 'floor4', label: '四楼' }
        ]
      }
    ]
  },
  {
    value: 'dormitory',
    label: '宿舍区',
    children: [
      {
        value: 'building1',
        label: '1号宿舍楼',
        children: [
          { value: 'floor1', label: '一楼' },
          { value: 'floor2', label: '二楼' },
          { value: 'floor3', label: '三楼' },
          { value: 'floor4', label: '四楼' },
          { value: 'floor5', label: '五楼' },
          { value: 'floor6', label: '六楼' }
        ]
      },
      {
        value: 'building2',
        label: '2号宿舍楼',
        children: [
          { value: 'floor1', label: '一楼' },
          { value: 'floor2', label: '二楼' },
          { value: 'floor3', label: '三楼' },
          { value: 'floor4', label: '四楼' },
          { value: 'floor5', label: '五楼' },
          { value: 'floor6', label: '六楼' }
        ]
      }
    ]
  },
  {
    value: 'library',
    label: '图书馆',
    children: [
      { value: 'floor1', label: '一楼' },
      { value: 'floor2', label: '二楼' },
      { value: 'floor3', label: '三楼' },
      { value: 'floor4', label: '四楼' }
    ]
  },
  {
    value: 'laboratory',
    label: '实验楼',
    children: [
      { value: 'floor1', label: '一楼' },
      { value: 'floor2', label: '二楼' },
      { value: 'floor3', label: '三楼' }
    ]
  }
];

// 设备列表数据
const deviceList = ref([]);
// 选中的设备
const selectedDevices = ref([]);

// 当前设备（用于详情和编辑）
const currentDevice = ref({
  id: '',
  name: '',
  type: '',
  status: '',
  location: '',
  ipAddress: '',
  macAddress: '',
  lastActive: '',
  installDate: '',
  maintenanceCycle: '',
  manager: '',
  contact: '',
  remark: ''
});

// 设备表单相关
const deviceFormRef = ref<FormInstance>();
const deviceFormVisible = ref(false);
const isEdit = ref(false);
const deviceForm = reactive({
  id: '',
  name: '',
  type: '',
  location: '',
  locationArray: [],
  ipAddress: '',
  macAddress: '',
  installDate: '',
  maintenanceCycle: '',
  manager: '',
  contact: '',
  remark: ''
});

// 表单验证规则
const deviceFormRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择设备类型', trigger: 'change' }
  ],
  locationArray: [
    { required: true, message: '请选择设备位置', trigger: 'change' }
  ],
  ipAddress: [
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP地址格式不正确', trigger: 'blur' }
  ],
  macAddress: [
    { pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, message: 'MAC地址格式不正确', trigger: 'blur' }
  ]
});

// 对话框显示状态
const deviceDetailVisible = ref(false);
const deleteConfirmVisible = ref(false);

// 设备历史数据
const deviceHistoryData = ref([]);
// 设备告警数据
const deviceAlertData = ref([]);

// 实时数据图表引用
const realtimeChartRef = ref<HTMLElement | null>(null);
let realtimeChart: echarts.ECharts | null = null;

// 获取设备类型对应的标签类型
const getDeviceTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    'sensor': 'info',
    'camera': 'success',
    'access': 'warning',
    'environment': 'primary',
    'energy': 'danger'
  };
  return typeMap[type] || 'info';
};

// 获取设备类型名称
const getDeviceTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'sensor': '传感器',
    'camera': '摄像头',
    'access': '门禁系统',
    'environment': '环境监测',
    'energy': '能源管理'
  };
  return typeMap[type] || type;
};

// 获取状态对应的标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'online': 'success',
    'offline': 'info',
    'maintenance': 'warning',
    'fault': 'danger'
  };
  return statusMap[status] || 'info';
};

// 获取状态名称
const getStatusName = (status: string) => {
  const statusMap: Record<string, string> = {
    'online': '在线',
    'offline': '离线',
    'maintenance': '维护中',
    'fault': '故障'
  };
  return statusMap[status] || status;
};

// 获取告警类型对应的标签类型
const getAlertTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '温度异常': 'danger',
    '湿度异常': 'warning',
    '电压异常': 'danger',
    '连接中断': 'info',
    '未授权访问': 'warning'
  };
  return typeMap[type] || 'info';
};

// 处理位置选择变化
const handleLocationChange = (value: any) => {
  if (value && value.length > 0) {
    // 将级联选择器的值转换为字符串表示
    const locationLabels = [];
    let currentOptions = locationOptions;

    for (let i = 0; i < value.length; i++) {
      const currentValue = value[i];
      const found = currentOptions.find(option => option.value === currentValue);

      if (found) {
        locationLabels.push(found.label);
        currentOptions = found.children || [];
      }
    }

    deviceForm.location = locationLabels.join(' - ');
  } else {
    deviceForm.location = '';
  }
};

// 搜索处理
const handleSearch = () => {
  fetchDeviceList();
};

// 重置筛选条件
const resetFilter = () => {
  filterForm.name = '';
  filterForm.type = '';
  filterForm.status = '';
  filterForm.location = [];
  fetchDeviceList();
};

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedDevices.value = selection;
};

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchDeviceList();
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchDeviceList();
};

// 查看设备详情
const handleViewDevice = (row: any) => {
  currentDevice.value = { ...row };
  deviceDetailVisible.value = true;

  // 加载设备历史数据
  fetchDeviceHistory(row.id);
  // 加载设备告警数据
  fetchDeviceAlerts(row.id);

  // 在下一个 DOM 更新周期后初始化图表
  nextTick(() => {
    initRealtimeChart();
  });
};

// 编辑设备
const handleEditDevice = (row: any) => {
  isEdit.value = true;
  Object.assign(deviceForm, row);

  // 解析位置字符串为级联选择器数组
  const locationParts = row.location.split(' - ');
  deviceForm.locationArray = []; // 这里需要根据实际情况映射到locationOptions的value

  deviceFormVisible.value = true;
};

// 添加设备
const handleAddDevice = () => {
  isEdit.value = false;
  // 重置表单
  Object.keys(deviceForm).forEach(key => {
    if (key !== 'locationArray') {
      deviceForm[key] = '';
    } else {
      deviceForm[key] = [];
    }
  });

  deviceFormVisible.value = true;
};

// 删除设备
const handleDeleteDevice = (row: any) => {
  currentDevice.value = { ...row };
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = () => {
  // 这里应该调用API删除设备
  ElMessage.success(`设备 "${currentDevice.value.name}" 已成功删除`);
  deleteConfirmVisible.value = false;
  fetchDeviceList();
};

// 提交设备表单
const submitDeviceForm = async () => {
  if (!deviceFormRef.value) return;

  await deviceFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 这里应该调用API保存设备
      if (isEdit.value) {
        ElMessage.success(`设备 "${deviceForm.name}" 已成功更新`);
      } else {
        ElMessage.success(`设备 "${deviceForm.name}" 已成功添加`);
      }
      deviceFormVisible.value = false;
      fetchDeviceList();
    } else {
      console.log('表单验证失败', fields);
    }
  });
};

// 导出设备数据
const exportDeviceData = () => {
  ElMessage.success('设备数据导出成功');
};

// 初始化实时数据图表
const initRealtimeChart = () => {
  if (realtimeChartRef.value) {
    if (realtimeChart) {
      realtimeChart.dispose();
    }

    realtimeChart = echarts.init(realtimeChartRef.value);

    const option = {
      title: {
        text: '设备实时数据监控'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['温度', '湿度', '电压', '信号强度']
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
        data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '温度',
          type: 'line',
          data: [22, 23, 24, 25, 26, 27, 26, 25, 24, 23],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#F56C6C'
          }
        },
        {
          name: '湿度',
          type: 'line',
          data: [45, 46, 48, 50, 52, 53, 52, 51, 49, 47],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#409EFF'
          }
        },
        {
          name: '电压',
          type: 'line',
          data: [220, 220, 219, 218, 220, 221, 220, 220, 219, 220],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#67C23A'
          }
        },
        {
          name: '信号强度',
          type: 'line',
          data: [85, 86, 87, 86, 85, 84, 85, 86, 87, 88],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#E6A23C'
          }
        }
      ]
    };

    realtimeChart.setOption(option);

    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', () => {
      realtimeChart?.resize();
    });
  }
};

// 获取设备列表数据
const fetchDeviceList = () => {
  tableLoading.value = true;

  // 模拟API请求
  setTimeout(() => {
    // 这里应该是实际的API调用
    const mockData = [
      {
        id: 'DEV001',
        name: '温湿度传感器A',
        type: 'sensor',
        status: 'online',
        location: '教学区 - 第一教学楼 - 三楼',
        ipAddress: '192.168.1.101',
        macAddress: 'AA:BB:CC:DD:EE:01',
        lastActive: '2023-11-15 10:23:45',
        installDate: '2023-01-15',
        maintenanceCycle: '6个月',
        manager: '张工',
        contact: '13800138001',
        remark: '教室环境监测设备'
      },
      {
        id: 'DEV002',
        name: '监控摄像头B',
        type: 'camera',
        status: 'online',
        location: '宿舍区 - 1号宿舍楼 - 一楼',
        ipAddress: '192.168.1.102',
        macAddress: 'AA:BB:CC:DD:EE:02',
        lastActive: '2023-11-15 10:25:12',
        installDate: '2023-02-20',
        maintenanceCycle: '12个月',
        manager: '李工',
        contact: '13800138002',
        remark: '宿舍入口监控'
      },
      {
        id: 'DEV003',
        name: '门禁系统C',
        type: 'access',
        status: 'maintenance',
        location: '图书馆 - 一楼',
        ipAddress: '192.168.1.103',
        macAddress: 'AA:BB:CC:DD:EE:03',
        lastActive: '2023-11-14 18:45:30',
        installDate: '2023-03-10',
        maintenanceCycle: '3个月',
        manager: '王工',
        contact: '13800138003',
        remark: '图书馆入口门禁'
      },
      {
        id: 'DEV004',
        name: '空气质量监测仪D',
        type: 'environment',
        status: 'online',
        location: '实验楼 - 二楼',
        ipAddress: '192.168.1.104',
        macAddress: 'AA:BB:CC:DD:EE:04',
        lastActive: '2023-11-15 10:20:18',
        installDate: '2023-04-05',
        maintenanceCycle: '6个月',
        manager: '赵工',
        contact: '13800138004',
        remark: '实验室空气质量监测'
      },
      {
        id: 'DEV005',
        name: '智能电表E',
        type: 'energy',
        status: 'fault',
        location: '教学区 - 第二教学楼 - 一楼',
        ipAddress: '192.168.1.105',
        macAddress: 'AA:BB:CC:DD:EE:05',
        lastActive: '2023-11-13 09:15:42',
        installDate: '2023-05-20',
        maintenanceCycle: '12个月',
        manager: '钱工',
        contact: '13800138005',
        remark: '教学楼用电监测'
      },
      {
        id: 'DEV006',
        name: '智能电表D',
        type: 'energy',
        status: 'fault',
        location: '教学区 - 第二教学楼 - 一楼',
        ipAddress: '192.168.1.105',
        macAddress: 'AA:BB:CC:DD:EE:05',
        lastActive: '2023-11-13 09:15:42',
        installDate: '2023-05-20',
        maintenanceCycle: '12个月',
        manager: '钱工',
        contact: '13800138005',
        remark: '教学楼用电监测'
      },

    ];

    deviceList.value = mockData;
    total.value = 100; // 模拟总数据量
    tableLoading.value = false;
  }, 500);
};

// 获取设备历史数据
const fetchDeviceHistory = (deviceId: string) => {
  // 模拟API请求
  setTimeout(() => {
    // 这里应该是实际的API调用
    const mockData = [
      {
        time: '2023-11-15 10:23:45',
        event: '设备上线',
        operator: '系统',
        details: '设备自动连接到网络'
      },
      {
        time: '2023-11-14 18:45:30',
        event: '设备离线',
        operator: '系统',
        details: '设备连接中断'
      },
      {
        time: '2023-11-14 15:30:22',
        event: '参数配置',
        operator: '张工',
        details: '修改了采样频率为30秒/次'
      },
      {
        time: '2023-11-13 09:15:42',
        event: '固件更新',
        operator: '系统',
        details: '自动更新到版本v2.3.1'
      },
      {
        time: '2023-11-10 14:20:18',
        event: '设备维护',
        operator: '李工',
        details: '更换了电池'
      }
    ];

    deviceHistoryData.value = mockData;
  }, 300);
};

// 获取设备告警数据
const fetchDeviceAlerts = (deviceId: string) => {
  // 模拟API请求
  setTimeout(() => {
    // 这里应该是实际的API调用
    const mockData = [
      {
        time: '2023-11-15 08:23:12',
        type: '温度异常',
        details: '温度超过阈值(30°C)，当前值32.5°C',
        status: '未处理'
      },
      {
        time: '2023-11-14 23:12:45',
        type: '连接中断',
        details: '设备连接中断超过5分钟',
        status: '已处理'
      },
      {
        time: '2023-11-13 14:30:22',
        type: '电压异常',
        details: '电压低于阈值(200V)，当前值195V',
        status: '已处理'
      },
      {
        time: '2023-11-12 09:15:42',
        type: '湿度异常',
        details: '湿度超过阈值(70%)，当前值75%',
        status: '已处理'
      },
      {
        time: '2023-11-10 18:20:18',
        type: '未授权访问',
        details: '检测到未授权的访问尝试',
        status: '已处理'
      }
    ];

    deviceAlertData.value = mockData;
  }, 300);
};

// 页面加载时获取设备列表
onMounted(() => {
  fetchDeviceList();
});
</script>

<style scoped lang="scss">
.device-management-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .header-card {
    margin-bottom: 20px;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        margin: 0;
        font-size: 1.8rem;
        color: #303133;
      }

      .header-actions {
        display: flex;
        gap: 10px;
      }
    }
  }

  .filter-card {
    margin-bottom: 20px;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-start;

      .el-form-item {
        margin-bottom: 10px;
        margin-right: 10px;
      }
    }
  }

  .table-card {
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .el-table {
      --el-table-border-color: #ebeef5;
      --el-table-header-bg-color: #f5f7fa;

      .el-button {
        padding: 4px 0;
      }
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }

  .device-detail-tabs {
    margin-top: 20px;

    .chart-container {
      height: 350px;
      width: 100%;
    }
  }

  .delete-confirm-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 0;

    .delete-icon {
      font-size: 48px;
      color: #F56C6C;
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      color: #606266;
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .filter-form {
      flex-direction: column;

      .el-form-item {
        width: 100%;
        margin-right: 0;
      }
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;

      .header-actions {
        margin-top: 10px;
      }
    }
  }
}
</style>
