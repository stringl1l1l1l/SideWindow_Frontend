<template>
  <div style="margin:10px;">
    <el-form :model="form" label-width="120px">

      <el-form-item label="目标Socket">
        <el-col :span="10">
          <el-input maxlength="15" v-model="form.host">
            <template #append>:</template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-input-number :min="0" :max="65535" v-model="form.port">
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
        <el-checkbox-group v-model="getRecvWin">
          <el-checkbox-button v-for="(value, index) in cache" :key="value" :label="value">
            <template #default>
              <span :style="{ color: getColor[index], fontWeight: 'bold' }">{{ value }}</span>
            </template>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="接收内容">
        <el-input v-model="getRecvData" disabled :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" />
      </el-form-item>

      <el-form-item label="接收日志">
        <el-table highlight-current-row size="small" :data="getRecvInfoList" border max-height="150" style="width: 500px">
          <el-table-column prop="segment.segNo" label="序号" width="100%" />
          <el-table-column prop="segment.data" label="数据" width="100%" />
          <el-table-column prop="recvStatus" label="接收状态" width="100%">
            <template #default="scope">
              {{ this.mapRecvStatus[scope.row.recvStatus] }}
            </template>
          </el-table-column>
          <el-table-column prop="random" label="随机情况" width="100%" />
        </el-table>
      </el-form-item>
      <el-form-item label="发送日志">
        <el-table highlight-current-row size="small" :data="getSendInfoList" border max-height="150" style="width: 500px">
          <el-table-column prop="segment.segNo" label="序号" width="100%" />
          <el-table-column prop="segment.ackNo" label="确认号" width="100%" />
          <el-table-column prop="segment.data" label="数据" width="100%" />
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
        <el-col :span="3" align="middle">
          <el-button @click="clearData">清空</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
  
<script>
import { changeRecvWinSize, clearReceiveCache, connect, stopClient } from '@/apis/client'
import { initClinetSocket } from '@/utils/webSocket'
import { CLEAR_CLIENT } from '@/utils/store'

const form = {
  host: "127.0.0.1",
  port: 6666,
  receiveWinSize: {}
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
      clientSockect: {},
      lastCacheBeg: 0,
      lastPosBeg: 0,
      cache: initCache,
      cacheSize: 9,
      color: [],
      mapRecvStatus: ["正常", "丢失", "错误", "重复", "拒收"]
    }
  },
  methods: {
    start() {
      this.$data.isStarted = true
      this.clientSockect = initClinetSocket()
      connect(form.host, form.port)
    },
    stop() {
      this.$data.isStarted = false
      this.lastCacheBeg = 0
      this.lastPosBeg = 0
      this.cache = initCache
      this.color = []
      stopClient()
    },
    checkCurWindow(row) {
      console.log(row)
      this.$data.form.windowDisplay = row.window
    },
    changeWinSize() {
      changeRecvWinSize(this.form.receiveWinSize)
    },
    clearData() {
      this.$store.commit(CLEAR_CLIENT)
      clearReceiveCache()
      this.color = []
    }
  },
  computed: {
    getRecvData() {
      return this.$store.state.cRecvData
    },
    getRecvInfoList() {
      return this.$store.state.cRecvInfoList
    },
    getSendInfoList() {
      return this.$store.state.cSendInfoList
    },
    getRecvWin() {
      const { posBeg, posEnd, segmentList, windowSize } = this.$store.state.cRecvWin
      const array = []
      // 越界时更新缓存
      if (posEnd - this.lastCacheBeg > this.cacheSize) {
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
      }
      // 更新窗口
      for (let i = posBeg; i < posEnd; i++) {
        array.push(segmentList[i].segNo)
      }
      console.log("接收窗口")
      console.log(array)
      this.form.receiveWinSize = windowSize
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
  