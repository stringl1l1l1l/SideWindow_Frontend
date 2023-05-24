<template>
  <div style="margin:20px;">
    <el-form :model="form" label-width="120px">
      <el-form-item label="服务端Socket">
        <el-col :span="10">
          <el-input maxlength="15" v-model="form.host" :disabled="isStarted">
            <template #append>:</template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-input-number :min="0" :max="65535" v-model="form.port" :controls="false" :disabled="isStarted">
          </el-input-number>
        </el-col>
      </el-form-item>

      <el-form-item label="发送窗口大小">
        <el-col :span="7">
          <el-input-number :min="1" :max="10" v-model="form.sendWinSize" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="changeWinSize">修改</el-button>
        </el-col>

      </el-form-item>

      <el-form-item label="发送窗口">
        <el-checkbox-group v-model="form.window1Display">
          <el-checkbox-button v-for="value in form.window1Display" :key="value" :label="value" />
        </el-checkbox-group>
        <el-checkbox-button v-for="value in form.window2Display" :key="value" :label="value" disabled />
      </el-form-item>

      <el-form-item label="发送日志">
        <el-table :data="form.logSendData" border max-height="157" style="width: 100%">
          <el-table-column prop="segNo" label="序号" width="100%" />
          <el-table-column prop="ackNo" label="确认号" width="100%" />
          <el-table-column prop="data" label="数据" width="100%" />
          <el-table-column prop="isReQuest" label="是否重传" width="100%" />
          <el-table-column label="查看窗口" width="100%">
            <template #default="scope">
              <el-button type="primary" size="small" @click="checkCurWindow(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="接收日志">
        <el-table :data="form.logReceiveData" border max-height="157" style="width: 100%">
          <el-table-column prop="segNo" label="序号" width="100%" />
          <el-table-column prop="ackNo" label="确认号" width="100%" />
        </el-table>
      </el-form-item>

      <el-form-item label="输入框">
        <el-input v-model="form.sendData" :autosize="{ minRows: 4 }" maxlength="1000" show-word-limit type="textarea"
          placeholder="请输入待发送数据" />
      </el-form-item>

      <el-divider />

      <el-row justify="center">
        <el-col :span="3" align="middle">
          <el-button type="primary" @click="start" :loading="isStarted" :disabled="isStarted">启动</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button type="danger" @click="stop" :disabled="!isStarted">停止</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button type="primary" @click="onSubmit">发送</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button @click="clearData">清空</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'

const window1 = ['1', '2', '3']
const window2 = ['4', '5', '6', '7']

export default {
  name: 'server',
  components: {
  },
  data() {
    return {
      form: form,
      isStarted: false,
    }
  },
  methods: {
    onSubmit() {
      if (this.$data.form.sendData.trim().length != 0) {
        console.log(this.$data.form.sendData)
        ElNotification.success({
          message: "发送成功",
          position: 'bottom-right',
          duration: 1500,
          showClose: false,
        })
      }
      else {
        ElNotification.error({
          message: "请输入待发送数据",
          position: 'bottom-right',
          duration: 1500,
          showClose: false,
        })
        this.$data.form.sendData = ""
      }
    },
    start() {
      this.$data.isStarted = true
      ElNotification({
        message: "服务端正在启动",
        position: 'bottom-right',
        duration: 1500,
        showClose: false,
      })
    },
    stop() {
      this.$data.isStarted = false
      ElNotification.error({
        message: "服务端已关闭",
        position: 'bottom-right',
        duration: 1500,
        showClose: false,
      })
    },
    checkCurWindow(row) {
      console.log(row)
      this.$data.form.window1Display = row.window1
      this.$data.form.window2Display = row.window2
    },
    changeWinSize() {
    },
    clearData() {
      this.$data.form.sendData = ""
    }
  }
}

const logData = [{
  segNo: 0,
  ackNo: 0,
  data: 'hello',
}]

const form = {
  host: '127.0.0.1',
  port: 6666,
  sendWinSize: 3,
  sendData: "hello, client!",
  window1Display: window1,
  window2Display: window2,
  logSendData: [{
    segNo: 0,
    ackNo: 0,
    data: "hello",
    isReQuest: false,
    window1: [5, 6, 7],
    window2: [8, 9]
  }],
  logReceiveData: [{
    segNo: 0,
    ackNo: 0,
  }]
}

</script>
  
<style></style>
  