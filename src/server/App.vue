<template>
  <div style="margin:20px;">
    <el-form :model="form" label-width="120px">
      <el-form-item label="监听端口">
        <el-col :span="5">
          <el-input-number :min="0" :max="65535" v-model="form.port" :controls="false" :disabled="isStarted">
          </el-input-number>
        </el-col>
      </el-form-item>

      <el-form-item label="发送窗口大小">
        <el-col :span="10">
          <el-input-number :min="1" :max="10" v-model="form.sendWinSize" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="changeWinSize">修改</el-button>
        </el-col>

      </el-form-item>

      <el-form-item label="发送窗口">
        <el-checkbox-group v-model="sendWin">
          <el-checkbox-button v-for="(value, index) in  sendCache " :key="value" :label="value" size="small">
            <template #default>
              <span :style="{ color: colorCompute[index], fontWeight: 'bold' }">{{ value }}</span>
            </template>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label=" 发送日志">
        <el-table :data="SendSegList" border max-height="157" style="width: 100%">
          <el-table-column prop="segment.segNo" label="序号" width="100%" />
          <el-table-column prop="segment.ackNo" label="确认号" width="100%" />
          <el-table-column prop="segment.data" label="数据" width="100%" />
          <el-table-column prop="isAck" label="是否重传" width="100%" />
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
        <el-input v-model="form.sendData" :autosize="{ minRows: 4, maxRows: 6 }" maxlength="1000" show-word-limit
          type="textarea" placeholder="请输入待发送数据" />
      </el-form-item>

      <el-form-item>
        <el-col :span="5">
          <el-checkbox label="连续发送" v-model="isContinous" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送次数">
            <el-input-number :min="1" :max="10" v-model="form.sendCnt" :disabled="!isContinous">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-divider />

      <el-row justify="center">
        <el-col :span="3" align="middle">
          <el-button type="primary" @click="start">启动</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button type="danger" @click="stop">停止</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button type="primary" @click="onSubmit">发送</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button @click="clearData">清空</el-button>
        </el-col>
        <el-col :span="3" align="middle">
          <el-button @click="shutdownAll">全部断开</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
  
<script>
import { ElNotification } from 'element-plus'
import { send, shutdown, startServer, stopServer } from '@/apis/server'
import { initServerSocket } from '@/utils/webSocket'

const window1 = []
const window2 = []

const form = {
  host: '127.0.0.1',
  port: 6666,
  sendWinSize: 3,
  sendData: "hello, client!",
  window1Display: window1,
  window2Display: window2,
  sendCnt: 1,
  logSendData: [],
  logReceiveData: [],
}

export default {
  name: 'server',
  components: {
  },
  data() {
    return {
      form: form,
      isStarted: false,
      isContinous: false,
      serverSocket: {},
      lastBeg: 100,
      cache: [],
      color: []
    }
  },
  methods: {
    start() {
      this.serverSocket = initServerSocket()
      this.isStarted = true
      startServer(this.form.port)
    },
    onSubmit() {
      if (this.form.sendData.trim().length != 0) {
        if (this.isContinous) {
          let newData = "";
          for (let i = 0; i < this.form.sendCnt; i++) {
            newData += this.form.sendData
          }
          send(newData)
        }
        else
          send(this.form.sendData)
      }
      else {
        ElNotification.error({
          message: "请输入待发送数据",
          position: 'bottom-right',
          duration: 1500,
          showClose: false,
        })
      }
    },
    stop() {
      stopServer()
      this.isStarted = false
    },
    shutdownAll() {
      shutdown()
      this.isStarted = false
    },
    checkCurWindow(row) {
      console.log(row)
      this.form.window1Display = row.window1
      this.form.window2Display = row.window2
    },
    changeWinSize() {
    },
    clearData() {
      this.$store.commit("CLEAR_ALL")
    }
  },
  computed: {
    SendSegList() {
      const res = this.$store.state.sSendInfoList
      console.log("计算属性为")
      console.log(res)
      this.$nextTick()
      return res
    },

    sendWin() {
      const { posBeg, posCur, posEnd, segmentList } = this.$store.state.sendWin
      const array = []
      // 已发送元素为绿色
      for (let i = posBeg; i < posCur; i++) {
        if (i - this.lastBeg > 0)
          this.color[i - this.lastBeg] = "#34ff00"
        array.push(segmentList[i].segment.segNo)
      }
      // 待发送窗口元素为其他颜色
      for (let i = posCur; i < posEnd; i++) {
        if (i - this.lastBeg > 0)
          this.color[i - this.lastBeg] = "#ff0000"
        array.push(segmentList[i].segment.segNo)
      }
      this.$nextTick()
      console.log("未确认窗口")
      console.log(array)
      console.log(this.color)
      return array
    },
    // 缓存元素为默认色
    sendCache() {
      if (this.$store.state.sendWinCnt == 1 || this.$store.state.sendWinCnt % 3 == 0) {
        const { posBeg, posCur, windowSize, segmentList } = this.$store.state.sendWin
        this.lastBeg = posBeg //保存上一次的缓存初始序号
        const array = []
        for (let i = 0; i < 2 * windowSize; i++) {
          array.push(segmentList[posBeg].segment.segNo + i)
          if (i + posBeg >= posCur)
            this.color[i] = "#000000"
          else
            this.color[i] = "#34ff00"
        }
        this.$nextTick()
        this.cache = array
        return array
      } else
        return this.cache
    },
    colorCompute() {
      return this.color
    }
  },
}

</script>
  
<style></style>
  