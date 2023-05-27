import { createStore } from 'vuex'
export const ADD_SERVER_SEND_PACK = 'ADD_SERVER_SEND_PACK'
export const UPDATE_SEND_WIN_ARRAY = 'UPDATE_SEND_WIN_ARRAY'
export const UPDATE_SERVER_SEND_SEGINFO_LIST = 'UPDATE_SERVER_SEND_SEGINFO_LIST'
export const UPDATE_SERVER_SEND_PACK_LIST = 'UPDATE_SERVER_SEND_PACK_LIST'
export const UPDATE_SERVER_RECV_SEG_LIST = 'UPDATE_SERVER_RECV_SEG_LIST'
export const CLEAR_ALL = 'CLEAR_ALL'
export const UPDATE_SEND_WIN = 'UPDATE_SEND_WIN'

export default createStore({
    state: {
        sendWinCnt: 0,
        sendWin: [[]],
        sRecvSegList: [],
        sSendPackList: [], // 存储接受到的报文列表
        sSendInfoList: [], // 只存储seginfo的列表
    },

    mutations: {
        [UPDATE_SEND_WIN_ARRAY](state, sendWin) {
            // 缓存一次之前的窗口
            if (state.sendWinCnt == 0) state.sendWin = sendWin
            else if (state.sendWinCnt == 1) {
                state.sendWin[0] = [...state.sendWin[0], ...sendWin[0]]
                state.sendWin[1] = [...state.sendWin[1], ...sendWin[1]]
            }
            else {
                for (let j = 0; j < 2; j++) {
                    // 弹出sendWin大小的数组
                    for (let i = 0; i < sendWin[j].length; i++) {
                        state.sendWin[j].shift()
                    }
                    state.sendWin[j] = [...state.sendWin[j], ...sendWin[j]]
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
            state.sendWin = [[]]
        }
    },
    actions: {

    },
    getters: {
        roles: state => state.serverSendSegList,
    }
});