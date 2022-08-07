<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          clearable
          v-model="queryForm.query"
          :placeholder="$t('table.placeholder')"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetUsersList">{{
        $t('table.search')
      }}</el-button>
      <el-button type="primary" @click="handleDialogValue">{{
        $t('table.adduser')
      }}</el-button>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        :prop="item.prop"
        :label="$t(`table.${item.label}`)"
        :width="item.width"
        v-for="(item, index) in options"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'">
          <el-switch
            v-model="row.mg_state"
            @change="changeState(row)"
          ></el-switch>
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'create_time'">
          {{ $filters.filterTimes(row.create_time) }}
        </template>

        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="mini"
            :icon="Edit"
            @click="handleDialogValue(row)"
          ></el-button>
          <!-- <el-button type="warning" size="mini" :icon="Setting"></el-button> -->
          <el-button
            type="danger"
            size="mini"
            :icon="Delete"
            @click="delUser(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:currentPage="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[2, 5, 10, 15]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>

  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogVisible"
    @initUserList="initGetUsersList"
    :dialogTableValue="dialogTableValue"
  />
  <!--
      v-if="dialogVisible" 把添加用户的表单置空
      dialogTableValue 把row的值传到dialog中，点击编辑的时候作为展示
   -->
</template>

<script setup>
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getUser, changeUserState, deleteUser } from '@/api/users.js'
import { options } from './options'
import { ElMessage, ElMessageBox } from 'element-plus'
import Dialog from './components/dialog.vue'
import { isNull } from '@/utils/filters'
// i18n第一种引入方式
// import i18n from '@/i18n'

// i18n第二种引入方式
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 2
})

const total = ref(0)

const tableData = ref([])

const dialogVisible = ref(false)

const dialogTitle = ref('')

// 编辑用户的时候拿到的值
const dialogTableValue = ref({})

// 初始化列表数据
const initGetUsersList = async () => {
  const res = await getUser(queryForm.value)
  // console.log(res)
  total.value = res.total
  tableData.value = res.users
}
initGetUsersList()

const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initGetUsersList()
}

const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initGetUsersList()
}

const changeState = async (row) => {
  await changeUserState(row.id, row.mg_state)
  ElMessage({
    message: i18n.t('message.updateSuccess'),
    type: 'success'
  })
}

const handleDialogValue = (row) => {
  if (isNull(row)) {
    dialogTitle.value = '添加用户'
    dialogTableValue.value = {}
  } else {
    dialogTitle.value = '编辑用户'
    dialogTableValue.value = JSON.parse(JSON.stringify(row))
  }
  dialogVisible.value = true
}

// 删除功能
const delUser = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(row.id)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })

      // 重新获取最新数据
      initGetUsersList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

::v-deep .el-input_suffix {
  align-items: center;
}

::v-deep .el-pagination {
  padding-top: 16px;
  box-sizing: border-box;
  text-align: center;
}
</style>
