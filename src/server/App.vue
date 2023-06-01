<template>
  <div style="margin:10px;">
    <el-form :model="form" label-width="120px">
      <el-form-item label="监听端口">
        <el-col :span="5">
          <el-input-number :min="0" :max="65535" v-model="form.port">
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

      <el-form-item label="报文段MSS">
        <el-col :span="10">
          <el-input-number :min="1" :max="10" v-model="form.MSS" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="changeMSS">修改</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="发送窗口">
        <el-checkbox-group v-model="getSendWin">
          <el-checkbox-button v-for="(value, index) in cache" :key="value" :label="value" size="small">
            <template #default>
              <span :style="{ color: getColor[index], fontWeight: 'bold' }">{{ value }}</span>
            </template>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label=" 发送日志">
        <el-table highlight-current-row size="small" ref="recvLog" :data="getSendSegList" border max-height="150">
          <el-table-column prop="segment.segNo" label="序号" width="100%" />
          <el-table-column prop="segment.ackNo" label="确认号" width="100%" />
          <el-table-column prop="segment.data" label="数据" width="100%" />
          <el-table-column prop="isSend" label="已发送" width="100%" />
          <el-table-column prop="isRepeat" label="是否重传" width="100%" />
        </el-table>
      </el-form-item>

      <el-form-item label="接收日志">
        <el-table highlight-current-row ref="recvLog" size="small" :data="getRecvSegList" border max-height="150">
          <el-table-column prop="segment.segNo" label="序号" width="100%" />
          <el-table-column prop="segment.ackNo" label="确认号" width="100%" />
          <el-table-column prop="segment.data" label="数据" width="100%" />
          <el-table-column prop="isRepeat" label="是否重传" width="100%" />
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
        <!-- <el-col :span="3" align="middle">
          <el-button @click="shutdownAll">全部断开</el-button>
        </el-col> -->
      </el-row>
    </el-form>

  </div>
</template>
  
<script>
import { ElNotification } from 'element-plus'
import { changeMSS, changeSendWinSize, send, startServer, stopServer } from '@/apis/server'
import { stopClient } from '@/apis/client'
import { initServerSocket } from '@/utils/webSocket'
import { CLEAR_SEVER } from '@/utils/store'

const form = {
  host: '127.0.0.1',
  port: 6666,
  sendData: "hello, client!",
  sendCnt: 1,
  MSS: {},
}

const initCache = [100, 101, 102, 103, 104, 105, 106, 107, 108]

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
      lastCacheBeg: 0,
      lastPosBeg: 0,
      cache: initCache,
      cacheSize: 9,
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
          let newData = ""
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
      this.lastCacheBeg = 0
      this.lastPosBeg = 0
      this.isStarted = false
      this.cache = initCache
      this.color = []
      this.clearData()
      stopServer()
    },
    changeWinSize() {
      changeSendWinSize(this.form.sendWinSize)
    },
    changeMSS() {
      changeMSS(this.form.MSS)
    },
    clearData() {
      this.$store.commit(CLEAR_SEVER)
      this.color = []
    },
    handleEnter() {
      this.form.sendData += '\n'
    }
  },
  computed: {
    getSendSegList() {
      const res = this.$store.state.sSendInfoList
      this.$nextTick()
      return res
    },
    getRecvSegList() {
      const res = this.$store.state.sRecvInfoList
      console.log("接收到的ACK报文为")
      console.log(res)
      this.$nextTick()
      return res
    },
    // 窗口元素为选中状态
    getSendWin() {
      const { posBeg, posCur, posEnd, windowSize, segmentList } = this.$store.state.sSendWin
      const array = []
      // 如果窗口即将越界，更新窗口缓存
      const offset = posEnd - this.lastCacheBeg - this.cacheSize
      if (offset > 0) {
        const newCache = []
        this.lastCacheBeg = posBeg
        for (let i = 0; i < this.cacheSize; i++) {
          newCache.push(segmentList[posBeg].segNo + i)
        }
        this.cache = newCache
        this.color = []
      }

      // 已确认报文为绿色
      for (let i = this.lastPosBeg; i < posBeg; i++) {
        if (i - this.lastCacheBeg >= 0) {
          this.color[i - this.lastCacheBeg] = "#34ff00"
        }
        if (segmentList[i]) {
          array.push(segmentList[i].segment.segNo)
        }
      }
      // 已发送元素但未确认为红色
      for (let i = posBeg; i < posCur; i++) {
        if (i - this.lastCacheBeg >= 0)
          this.color[i - this.lastCacheBeg] = "#ff0000"
        if (segmentList[i])
          array.push(segmentList[i].segment.segNo)
      }
      // 待发送窗口元素为默认
      for (let i = posCur; i < posEnd; i++) {
        if (segmentList[i])
          array.push(segmentList[i].segNo)
      }

      this.$nextTick()
      this.form.sendWinSize = windowSize
      this.lastPosBeg = posBeg
      return array
    },
    getColor() {
      return this.color
    }
  }
}

</script>
  
<style></style>
  