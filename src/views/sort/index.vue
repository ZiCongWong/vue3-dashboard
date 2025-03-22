<template>
  <div class="device-type-management-container">
    <el-card class="header-card">
      <div class="page-header">
        <h1>产品开发</h1>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddDeviceType">
            <el-icon><Plus /></el-icon>添加设备类型
          </el-button>
          <el-button type="success" @click="exportDeviceTypeData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="类型名称">
          <el-input v-model="filterForm.name" placeholder="请输入类型名称" clearable />
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

    <el-row :gutter="20" class="device-type-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in deviceTypeList" :key="item.type_id" >
        <el-card class="device-type-card" :body-style="{ padding: '0px' }">
          <div class="card-header">
            <el-icon class="type-icon" :size="24">
              <component :is="getIconComponent(item.icon)"></component>
            </el-icon>
            <span class="type-name">{{ item.name }}</span>
          </div>
          <div class="card-content">
            <p class="description">{{ item.description }}</p>
            <div class="device-count">
              <span>设备数量: {{ item.deviceCount || 0 }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button type="primary" link @click="handleViewDeviceType(item)">
              <el-icon><View /></el-icon>查看
            </el-button>
            <el-button type="success" link @click="handleEditDeviceType(item)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" link @click="handleDeleteDeviceType(item)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 12, 24, 36]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 设备类型详情对话框 -->
    <el-dialog
      v-model="deviceTypeDetailVisible"
      title="设备类型详情"
      width="70%"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="类型ID">{{ currentDeviceType.type_id }}</el-descriptions-item>
        <el-descriptions-item label="类型名称">{{ currentDeviceType.name }}</el-descriptions-item>
        <el-descriptions-item label="图标">
          <el-icon :size="24">
            <component :is="getIconComponent(currentDeviceType.icon)"></component>
          </el-icon>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentDeviceType.created_at }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentDeviceType.updated_at }}</el-descriptions-item>
        <el-descriptions-item label="设备数量">{{ currentDeviceType.deviceCount || 0 }}</el-descriptions-item>
      </el-descriptions>

      <div class="description-section">
        <h3>类型描述</h3>
        <p>{{ currentDeviceType.description }}</p>
      </div>

      <div class="device-list-section">
        <h3>设备列表</h3>
        <el-table :data="deviceListByType" border style="width: 100%">
          <el-table-column prop="device_id" label="设备ID" width="120" />
          <el-table-column prop="name" label="设备名称" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusName(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="位置" />
          <el-table-column prop="last_active" label="最后活跃时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" link @click="navigateToDevice(scope.row)">
                <el-icon><Link /></el-icon>查看设备
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="data-fields-section">
        <h3>数据字段</h3>
        <el-table :data="dataFieldsByType" border style="width: 100%">
          <el-table-column prop="field_name" label="字段名称" width="150" />
          <el-table-column prop="field_type" label="数据类型" width="120" />
          <el-table-column prop="unit" label="单位" width="100" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="is_required" label="是否必须" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.is_required ? 'danger' : 'info'">
                {{ scope.row.is_required ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 添加/编辑设备类型对话框 -->
    <el-dialog
      v-model="deviceTypeFormVisible"
      :title="isEdit ? '编辑设备类型' : '添加设备类型'"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="deviceTypeFormRef"
        :model="deviceTypeForm"
        :rules="deviceTypeFormRules"
        label-width="100px"
      >
        <el-form-item label="类型ID" prop="type_id" v-if="isEdit">
          <el-input v-model="deviceTypeForm.type_id" disabled />
        </el-form-item>
        <el-form-item label="类型ID" prop="type_id" v-else>
          <el-input v-model="deviceTypeForm.type_id" placeholder="请输入类型ID，如sensor, camera等" />
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="deviceTypeForm.name" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="deviceTypeForm.icon" placeholder="请选择图标" style="width: 100%">
            <el-option
              v-for="icon in iconOptions"
              :key="icon.value"
              :label="icon.label"
              :value="icon.value"
            >
              <div style="display: flex; align-items: center;">
                <el-icon :size="18">
                  <component :is="icon.component"></component>
                </el-icon>
                <span style="margin-left: 8px;">{{ icon.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="deviceTypeForm.description"
            type="textarea"
            placeholder="请输入设备类型描述"
            :rows="3"
          />
        </el-form-item>

        <el-divider>数据字段</el-divider>

        <div v-for="(field, index) in deviceTypeForm.dataFields" :key="index" class="data-field-item">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item :label="index === 0 ? '字段名称' : ''" :prop="`dataFields.${index}.field_name`" :rules="{ required: true, message: '请输入字段名称', trigger: 'blur' }">
                <el-input v-model="field.field_name" placeholder="字段名称" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="index === 0 ? '数据类型' : ''" :prop="`dataFields.${index}.field_type`" :rules="{ required: true, message: '请选择数据类型', trigger: 'change' }">
                <el-select v-model="field.field_type" placeholder="数据类型" style="width: 100%">
                  <el-option label="整数" value="int" />
                  <el-option label="浮点数" value="float" />
                  <el-option label="字符串" value="string" />
                  <el-option label="布尔值" value="boolean" />
                  <el-option label="日期时间" value="datetime" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="index === 0 ? '单位' : ''" :prop="`dataFields.${index}.unit`">
                <el-input v-model="field.unit" placeholder="单位" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="index === 0 ? '描述' : ''" :prop="`dataFields.${index}.description`">
                <el-input v-model="field.description" placeholder="描述" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item :label="index === 0 ? '必须' : ''">
                <el-checkbox v-model="field.is_required" />
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button
                type="danger"
                circle
                icon="Delete"
                size="small"
                @click="removeDataField(index)"
                style="margin-top: 30px;"
                v-if="index !== 0 || deviceTypeForm.dataFields.length > 1"
              />
            </el-col>
          </el-row>
        </div>

        <div style="text-align: center; margin-top: 10px;">
          <el-button type="primary" @click="addDataField">
            <el-icon><Plus /></el-icon>添加数据字段
          </el-button>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceTypeFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeviceTypeForm">确定</el-button>
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
        <p>确定要删除设备类型 "{{ currentDeviceType.name }}" 吗？</p>
        <p v-if="currentDeviceType.deviceCount > 0" class="warning-text">
          注意：该类型下有 {{ currentDeviceType.deviceCount }} 个设备，删除后这些设备将无法正常工作！
        </p>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Plus,
  Download,
  Search,
  Refresh,
  View,
  Edit,
  Delete,
  WarningFilled,
  Link,
  Monitor,
  VideoCamera,
  Lock,
  Cloudy,
  Lightning,
  Cpu,
  Connection,
  Odometer,
  Timer,
  Stopwatch
} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);

// 筛选表单
const filterForm = reactive({
  name: ''
});

// 图标选项
const iconOptions = [
  { value: 'el-icon-monitor', label: '显示器', component: Monitor },
  { value: 'el-icon-video-camera', label: '摄像头', component: VideoCamera },
  { value: 'el-icon-lock', label: '锁', component: Lock },
  { value: 'el-icon-cloudy', label: '云', component: Cloudy },
  { value: 'el-icon-lightning', label: '闪电', component: Lightning },
  { value: 'el-icon-cpu', label: 'CPU', component: Cpu },
  { value: 'el-icon-connection', label: '连接', component: Connection },
  { value: 'el-icon-odometer', label: '仪表盘', component: Odometer },
  { value: 'el-icon-thermometer', label: '温度计', component: Timer },
  { value: 'el-icon-stopwatch', label: '计时器', component: Stopwatch }
];

// 设备类型列表数据
const deviceTypeList = ref([]);

// 当前设备类型（用于详情和编辑）
const currentDeviceType = ref({
  type_id: '',
  name: '',
  icon: '',
  description: '',
  created_at: '',
  updated_at: '',
  deviceCount: 0
});

// 设备类型表单相关
const deviceTypeFormRef = ref<FormInstance>();
const deviceTypeFormVisible = ref(false);
const isEdit = ref(false);
const deviceTypeForm = reactive({
  type_id: '',
  name: '',
  icon: '',
  description: '',
  dataFields: [
    {
      field_name: '',
      field_type: '',
      unit: '',
      description: '',
      is_required: false
    }
  ]
});

// 表单验证规则
const deviceTypeFormRules = reactive<FormRules>({
  type_id: [
    { required: true, message: '请输入类型ID', trigger: 'blur' },
    { pattern: /^[a-z0-9_]+$/, message: '类型ID只能包含小写字母、数字和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请选择图标', trigger: 'change' }
  ]
});

// 对话框显示状态
const deviceTypeDetailVisible = ref(false);
const deleteConfirmVisible = ref(false);

// 特定类型下的设备列表
const deviceListByType = ref([]);
// 特定类型的数据字段
const dataFieldsByType = ref([]);

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const icon = iconOptions.find(item => item.value === iconName);
  return icon ? icon.component : Monitor;
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

// 搜索处理
const handleSearch = () => {
  fetchDeviceTypeList();
};

// 重置筛选条件
const resetFilter = () => {
  filterForm.name = '';
  fetchDeviceTypeList();
};

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchDeviceTypeList();
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchDeviceTypeList();
};

// 查看设备类型详情
const handleViewDeviceType = (row: any) => {
  currentDeviceType.value = { ...row };
  deviceTypeDetailVisible.value = true;

  // 加载该类型下的设备列表
  fetchDevicesByType(row.type_id);
  // 加载该类型的数据字段
  fetchDataFieldsByType(row.type_id);
};

// 编辑设备类型
const handleEditDeviceType = (row: any) => {
  isEdit.value = true;
  Object.assign(deviceTypeForm, {
    type_id: row.type_id,
    name: row.name,
    icon: row.icon,
    description: row.description
  });

  // 加载该类型的数据字段
  fetchDataFieldsByType(row.type_id).then(() => {
    deviceTypeForm.dataFields = [...dataFieldsByType.value];
    if (deviceTypeForm.dataFields.length === 0) {
      deviceTypeForm.dataFields = [
        {
          field_name: '',
          field_type: '',
          unit: '',
          description: '',
          is_required: false
        }
      ];
    }
    deviceTypeFormVisible.value = true;
  });
};

// 添加设备类型
const handleAddDeviceType = () => {
  isEdit.value = false;
  // 重置表单
  deviceTypeForm.type_id = '';
  deviceTypeForm.name = '';
  deviceTypeForm.icon = '';
  deviceTypeForm.description = '';
  deviceTypeForm.dataFields = [
    {
      field_name: '',
      field_type: '',
      unit: '',
      description: '',
      is_required: false
    }
  ];

  deviceTypeFormVisible.value = true;
};

// 删除设备类型
const handleDeleteDeviceType = (row: any) => {
  currentDeviceType.value = { ...row };
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = () => {
  // 这里应该调用API删除设备类型
  ElMessage.success(`设备类型 "${currentDeviceType.value.name}" 已成功删除`);
  deleteConfirmVisible.value = false;
  fetchDeviceTypeList();
};

// 添加数据字段
const addDataField = () => {
  deviceTypeForm.dataFields.push({
    field_name: '',
    field_type: '',
    unit: '',
    description: '',
    is_required: false
  });
};

// 移除数据字段
const removeDataField = (index: number) => {
  deviceTypeForm.dataFields.splice(index, 1);
};

// 提交设备类型表单
const submitDeviceTypeForm = async () => {
  if (!deviceTypeFormRef.value) return;

  await deviceTypeFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 这里应该调用API保存设备类型
      if (isEdit.value) {
        ElMessage.success(`设备类型 "${deviceTypeForm.name}" 已成功更新`);
      } else {
        ElMessage.success(`设备类型 "${deviceTypeForm.name}" 已成功添加`);
      }
      deviceTypeFormVisible.value = false;
      fetchDeviceTypeList();
    } else {
      console.log('表单验证失败', fields);
    }
  });
};

// 导出设备类型数据
const exportDeviceTypeData = () => {
  ElMessage.success('设备类型数据导出成功');
};

// 导航到设备详情页
const navigateToDevice = (device: any) => {
  router.push({
    name: 'DeviceDetail',
    params: { id: device.device_id }
  });
};

// 获取设备类型列表数据
const fetchDeviceTypeList = () => {
  // 模拟API请求
  setTimeout(() => {
    // 这里应该是实际的API调用
    const mockData = [
      {
        type_id: 'sensor',
        name: '传感器',
        icon: 'el-icon-cpu',
        description: '各类环境参数传感设备，包括温度、湿度、光照等传感器',
        created_at: '2023-01-15 10:23:45',
        updated_at: '2023-05-20 15:30:22',
        deviceCount: 35
      },
      {
        type_id: 'camera',
        name: '摄像头',
        icon: 'el-icon-video-camera',
        description: '视频监控设备，包括固定摄像头、云台摄像头等',
        created_at: '2023-01-16 11:20:15',
        updated_at: '2023-06-10 09:15:30',
        deviceCount: 28
      },
      {
        type_id: 'access',
        name: '门禁系统',
        icon: 'el-icon-lock',
        description: '出入口控制设备，包括刷卡门禁、人脸识别门禁等',
        created_at: '2023-02-05 14:30:00',
        updated_at: '2023-04-18 16:45:12',
        deviceCount: 15
      },
      {
        type_id: 'environment',
        name: '环境监测',
        icon: 'el-icon-cloudy',
        description: '空气、水质等环境监测设备',
        created_at: '2023-02-10 09:45:30',
        updated_at: '2023-05-25 11:20:45',
        deviceCount: 22
      },
      {
        type_id: 'energy',
        name: '能源管理',
        icon: 'el-icon-lightning',
        description: '电力、水资源等能源管理设备',
        created_at: '2023-03-01 10:15:20',
        updated_at: '2023-06-15 14:30:10',
        deviceCount: 18
      }
    ];

    // 如果有筛选条件，进行过滤
    if (filterForm.name) {
      const keyword = filterForm.name.toLowerCase();
      deviceTypeList.value = mockData.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    } else {
      deviceTypeList.value = mockData;
    }

    total.value = deviceTypeList.value.length;
  }, 300);
};

// 获取特定类型下的设备列表
const fetchDevicesByType = (typeId: string) => {
  // 模拟API请求
  setTimeout(() => {
    // 这里应该是实际的API调用
    const mockData = [
      {
        device_id: 'DEV001',
        name: '温湿度传感器A',
        status: 'online',
        location: '教学区 - 第一教学楼 - 三楼',
        last_active: '2023-11-15 10:23:45'
      },
      {
        device_id: 'DEV006',
        name: '温湿度传感器B',
        status: 'online',
        location: '图书馆 - 二楼',
        last_active: '2023-11-15 10:20:12'
      },
      {
        device_id: 'DEV010',
        name: '温湿度传感器C',
        status: 'offline',
        location: '宿舍区 - 1号宿舍楼 - 二楼',
        last_active: '2023-11-14 18:45:30'
      }
    ];

    deviceListByType.value = mockData;
  }, 300);
};

// 获取特定类型的数据字段
const fetchDataFieldsByType = (typeId: string) => {
  return new Promise<void>((resolve) => {
    // 模拟API请求
    setTimeout(() => {
      // 这里应该是实际的API调用
      const mockData = [
        {
          field_name: '温度',
          field_type: 'float',
          unit: '°C',
          description: '环境温度',
          is_required: true
        },
        {
          field_name: '湿度',
          field_type: 'float',
          unit: '%',
          description: '环境湿度',
          is_required: true
        },
        {
          field_name: '电池电量',
          field_type: 'int',
          unit: '%',
          description: '设备电池剩余电量',
          is_required: false
        },
        {
          field_name: '信号强度',
          field_type: 'int',
          unit: 'dBm',
          description: '设备信号强度',
          is_required: false
        }
      ];

      dataFieldsByType.value = mockData;
      resolve();
    }, 300);
  });
};

// 页面加载时获取设备类型列表
onMounted(() => {
  fetchDeviceTypeList();
});
</script>

<style scoped lang="scss">
.device-type-management-container {
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

  .device-type-list {
    margin-bottom: 20px;

    .device-type-card {
      height: 100%;
      margin-bottom: 20px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #ebeef5;

        .type-icon {
          padding: 8px;
          border-radius: 8px;
          background-color: rgba(64, 158, 255, 0.1);
          color: #409EFF;
          margin-right: 10px;
        }

        .type-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #303133;
        }
      }

      .card-content {
        padding: 15px;
        min-height: 100px;

        .description {
          color: #606266;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .device-count {
          color: #909399;
          font-size: 0.9rem;
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-around;
        padding: 10px 15px;
        border-top: 1px solid #ebeef5;
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .device-detail-tabs {
    margin-top: 20px;
  }

  .description-section, .device-list-section, .data-fields-section {
    margin-top: 20px;

    h3 {
      margin-bottom: 10px;
      font-size: 1.2rem;
      color: #303133;
      font-weight: 600;
    }

    p {
      color: #606266;
      line-height: 1.6;
    }
  }

  .data-field-item {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
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
      margin-bottom: 10px;
    }

    .warning-text {
      color: #E6A23C;
      font-weight: 600;
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
