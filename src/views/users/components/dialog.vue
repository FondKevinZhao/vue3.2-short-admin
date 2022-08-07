<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    width="40%"
    :rules="rules"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// import { addUser, editUser } from '@/api/users'
import { addUser } from '@/api/users'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'

// defineEmits 的使用
// 1. 引入
import { defineEmits, defineProps, ref, watch } from 'vue'
// 2. 更新
const emits = defineEmits(['update:modelValue', 'initUserList'])
const handleClose = () => {
  // 3. 使用，并传值
  emits('update:modelValue', false)
}

const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogTableValue: {
    type: Object,
    default: () => {}
  }
})

const handleConfirm = () => {
  // 校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求
      await addUser(form.value)
      // 成功的提示
      ElMessage({
        message: i18n.global.t('message.updateSuccess'),
        type: 'success'
      })
      emits('initUserList')
      handleClose()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const formRef = ref(null)

const form = ref({
  username: '',
  password: '',
  email: '',
  mobile: ''
})

const rules = ref({
  username: [
    {
      required: true,
      message: 'please',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'please',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: 'please',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '输入正确邮箱',
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    {
      required: true,
      message: 'please',
      trigger: 'blur'
    }
  ]
})

// 监听穿过来的row对象
watch(
  () => props.dialogTableValue,
  () => {
    // console.log(props.dialogTableValue)
    form.value = props.dialogTableValue
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
</style>
