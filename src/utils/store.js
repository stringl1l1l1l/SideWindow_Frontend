import { createStore } from 'vuex'
export const ADD_SERVER_SEND_PACK = 'ADD_SERVER_SEND_PACK'
export const UPDATE_SEND_WIN_ARRAY = 'UPDATE_SEND_WIN_ARRAY'
export const UPDATE_SERVER_SEND_SEGINFO_LIST = 'UPDATE_SERVER_SEND_SEGINFO_LIST'
export const UPDATE_SERVER_SEND_PACK_LIST = 'UPDATE_SERVER_SEND_PACK_LIST'
export const UPDATE_SERVER_RECV_SEG_LIST = 'UPDATE_SERVER_RECV_SEG_LIST'
export const UPDATE_SEND_WIN = 'UPDATE_SEND_WIN'
export const CLEAR_ALL = 'CLEAR_ALL'
const sendWinModel = {
    posBeg: 0,
    windowSize: 4,
    segmentList: [
        { segNo: 100, segment: { segNo: 100 } },
        { segNo: 101, segment: { segNo: 101 } },
        { segNo: 102, segment: { segNo: 102 } },
        { segNo: 103, segment: { segNo: 104 } }
    ]
}
export default createStore({
    state: {
        sendWinCnt: 0,
        sendWin: [],
        sendWinArray: [[]],
        sRecvSegList: [],
        sSendPackList: [], // 存储接受到的报文列表
        sSendInfoList: [], // 只存储seginfo的列表
    },

    mutations: {
        [UPDATE_SEND_WIN](state, sendWin) {
            state.sendWinCnt++
            state.sendWin = sendWin
        },
        [UPDATE_SEND_WIN_ARRAY](state, sendWinArray) {
            // 缓存一次之前的窗口
            if (state.sendWinCnt == 0) state.sendWinArray = sendWinArray
            else if (state.sendWinCnt == 1) {
                state.sendWinArray[0] = [...state.sendWinArray[0], ...sendWinArray[0]]
                state.sendWinArray[1] = [...state.sendWinArray[1], ...sendWinArray[1]]
            }
            else {
                for (let j = 0; j < 2; j++) {
                    // 弹出sendWin大小的数组
                    for (let i = 0; i < sendWinArray[j].length; i++) {
                        state.sendWinArray[j].shift()
                    }
                    state.sendWinArray[j] = [...state.sendWinArray[j], ...sendWinArray[j]]
                }
            }
            state.sendWinCnt++;
        },
        [ADD_SERVER_SEND_PACK](state, pack) {
            state.sSendPackList.push(pack)
        },
        [UPDATE_SERVER_SEND_SEGINFO_LIST](state, InfoList) {
            state.sSendInfoList = [...state.sSendInfoList, ...InfoList]
        },
        [CLEAR_ALL](state) {
            state.sRecvSegList = []
            state.sSendPackList = []
            state.sSendInfoList = []
            state.sendWinArray = [[]]
            state.sendWin = []
            state.sendWinCnt = 0
        }
    },
    actions: {

    },
    getters: {
        roles: state => state.serverSendSegList,
    }
});