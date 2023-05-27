<template>
  <div style="margin:20px;">
    <el-form :model="form" label-width="120px">

      <el-form-item label="目标Socket">
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

      <el-form-item label="接收窗口大小">
        <el-col :span="10">
          <el-input-number :min="1" :max="10" v-model="form.receiveWinSize" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="changeWinSize">修改</el-button>
        </el-col>

      </el-form-item>

      <el-form-item label="接收窗口">
        <el-checkbox-group v-model="form.windowDisplay">
          <el-checkbox-button v-for="value in form.windowDisplay" :key="value" :label="value" disabled />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="接收内容">
        <el-input v-model="form.receiveData" disabled :autosize="{ minRows: 4 }" type="textarea" />
      </el-form-item>

      <el-form-item label="接收日志">
        <el-table :data="form.logReceiveData" border max-height="157" style="width: 500px">
          <el-table-column prop="segNo" label="序号" width="100%" />
          <el-table-column prop="data" label="数据" width="100%" />
          <el-table-column prop="isRepeat" label="是否重复" width="100%" />
          <el-table-column prop="random" label="随机情况" width="100%" />
          <el-table-column label="查看窗口" width="100%">
            <template #default="scope">
              <el-button type="primary" size="small" @click="checkCurWindow(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="发送日志">
        <el-table :data="form.logSendData" border max-height="157" style="width: 500px">
          <el-table-column prop="segNo" label="序号" width="100%" />
          <el-table-column prop="ackNo" label="确认号" width="100%" />
        </el-table>
      </el-form-item>
      <el-divider />

      <el-row justify="center">
        <el-col :span="3" align="middle">
          <el-button type="primary" @click="start">连接</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button type="danger" @click="stop">停止</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
  
<script>
import { connect, stopClient } from '@/apis/client'

const window = ['1', '2', '3']

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
    start() {
      this.$data.isStarted = true
      connect(form.host, form.port)
      // check().then(response => {
      //   this.form.receiveData = response.extra.data
      //   console.log(response)
      // })
    },
    stop() {
      this.$data.isStarted = false
      stopClient()
    },
    checkCurWindow(row) {
      console.log(row)
      this.$data.form.windowDisplay = row.window
    },
    changeWinSize() {
    }
  }
}

const form = {
  host: "127.0.0.1",
  port: 6666,
  receiveWinSize: 3,
  receiveData: "111",
  windowDisplay: window,
  logReceiveData: [{
    segNo: 0,
    ackNo: 0,
    data: "hello",
    isRepeat: false,
    random: 0,
    window: [5, 6, 7],
  }],
  logSendData: [{
    segNo: 0,
    ackNo: 0,
    data: "hello",
    isReQuest: false,
    window: [8, 9]
  }]
}

</script>
  
<style></style>
  