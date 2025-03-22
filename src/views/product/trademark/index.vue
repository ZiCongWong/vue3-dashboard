<script setup lang="ts" name="trademark">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqAddOrUpdateTrademark, reqHasTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type.ts'
import useLayoutSettingStore from '@/store/modules/setting.ts'
import { ElMessage, UploadProps } from 'element-plus'

let layoutSettingStore = useLayoutSettingStore()
let pageNo = ref<number>(1)
let limit = ref<number>(layoutSettingStore.pageSize)
let formRef = ref()
let total = ref<number>(0)
let trademark = ref<Records>([])
const getHasTrademark = async () => {
  let res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    trademark.value = res.data.records
  }
}
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

const rules = {
  tmName: [
    { trigger: 'blur', validator: validatorTmName, required: true },

  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl },
  ],
}


onMounted(() => {
  getHasTrademark()
})

const changePageNo = () => {
  getHasTrademark()
}
const sizeChanger = (a) => {
  layoutSettingStore.changePageSize(a)
  pageNo.value = 1
  getHasTrademark()
}

let dialogFormVisible = ref<boolean>(false)

const addTradeMark = () => {
  tradeMarkParams.id = null
  tradeMarkParams.logoUrl = ''
  tradeMarkParams.tmName = ''
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

}

const updateTradeMark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  Object.assign(tradeMarkParams, row)

}

const cancel = () => {
  dialogFormVisible.value = false

}

const confirmSubmit = async () => {
  await formRef.value.validate()
  let res: any = await reqAddOrUpdateTrademark(tradeMarkParams)
  if (res.code === 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: tradeMarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    await getHasTrademark()
  } else {
    ElMessage({
      type: 'error',
      message: '添加品牌失败',
    })
  }
}

let tradeMarkParams = reactive<TradeMark>({
  tmName: '',
  id: null,
  logoUrl: '',
})

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4MB',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式为png,jpg,gif',
    })
  }
}


const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  tradeMarkParams.logoUrl = response.data

  formRef.value.clearValidate('logoUrl')
}
const removeTrademark = async (id: number) => {
  console.log(id)
  let res = await reqDeleteTrademark(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasTrademark(trademark.value.length > 1 ? pageNo.value : pageNo - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<template>
  <div>
    <el-card class="box-card" style="border-radius: 9px">
      <el-button type="primary" size="default" icon="Plus" @click="addTradeMark">添加品牌</el-button>
      <!--表格组件-->
      <el-table style="margin:10px 0" border :data="trademark">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{row,$index}">
            <pre style="color: rebeccapurple">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template #="{row,$index}">
            <img :src="row.logoUrl" alt="未有图片" style="width: 100px;height: 100px;" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{row,$index}">
            <el-button type="primary" size="small" icon="Edit" @click="updateTradeMark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="auto" @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
      <!--分页器组件-->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :default-page-size="3"
        :background="true"
        layout="prev, pager, next,->,sizes,total,"
        :total="total"
        :pager-count="9"
        :page-sizes="[3,5,7,9]"
        @current-change="changePageNo"
        @size-change="sizeChanger"
      />
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="tradeMarkParams.id?'修改品牌':'添加品牌'">
      <el-form style="width: 80%" :model="tradeMarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="tradeMarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tradeMarkParams.logoUrl" :src="tradeMarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirmSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>