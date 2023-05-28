import { createStore } from 'vuex'
export const ADD_SERVER_SEND_PACK = 'ADD_SERVER_SEND_PACK'
export const UPDATE_SEND_WIN_ARRAY = 'UPDATE_SEND_WIN_ARRAY'
export const UPDATE_SERVER_SEND_SEGINFO_LIST = 'UPDATE_SERVER_SEND_SEGINFO_LIST'
export const UPDATE_SERVER_RECV_SEGINFO_LIST = 'UPDATE_SERVER_RECV_SEGINFO_LIST'
export const UPDATE_SERVER_SEND_PACK_LIST = 'UPDATE_SERVER_SEND_PACK_LIST'
export const UPDATE_CLIENT_RECV_SEGINFO_LIST = 'UPDATE_CLIENT_RECV_SEGINFO_LIST'
export const UPDATE_CLIENT_SEND_SEGINFO_LIST = 'UPDATE_CLIENT_SEND_SEGINFO_LIST'
export const UPDATE_SEND_WIN = 'UPDATE_SEND_WIN'
export const UPDATE_RECV_DATA = 'UPDATE_RECV_DATA'
export const CLEAR_SEVER = 'CLEAR_SEVER'
export const CLEAR_CLIENT = 'CLEAR_CLIENT'

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
        sSendWinCnt: 0,
        sSendWin: [],
        sSendPackList: [], // 存储接受到的报文列表
        sRecvInfoList: [],
        sSendInfoList: [], // 只存储seginfo的列表
        cSendInfoList: [],
        cRecvInfoList: [],
        cRecvData: ""
    },

    mutations: {
        [UPDATE_RECV_DATA](state, data) {
            state.cRecvData = data
        },
        [UPDATE_SEND_WIN](state, sendWin) {
            state.sSendWinCnt++
            state.sSendWin = sendWin
        },
        [ADD_SERVER_SEND_PACK](state, pack) {
            state.sSendPackList.push(pack)
        },
        [UPDATE_SERVER_SEND_SEGINFO_LIST](state, InfoList) {
            state.sSendInfoList = [...state.sSendInfoList, ...InfoList]
        },
        [UPDATE_SERVER_RECV_SEGINFO_LIST](state, InfoList) {
            state.sRecvInfoList = [...state.sRecvInfoList, ...InfoList]
        },
        [UPDATE_CLIENT_RECV_SEGINFO_LIST](state, InfoList) {
            state.cRecvInfoList = [...state.cRecvInfoList, ...InfoList]
        },
        [UPDATE_CLIENT_SEND_SEGINFO_LIST](state, InfoList) {
            state.cSendInfoList = [...state.cSendInfoList, ...InfoList]
        },
        [CLEAR_SEVER](state) {
            state.sRecvInfoList = []
            state.sSendPackList = []
            state.sSendInfoList = []
            state.sSendWin = []
            state.sSendWinCnt = 0
        },
        [CLEAR_CLIENT](state) {
            state.cRecvInfoList = []
            state.cSendInfoList = []
        }
    },
    actions: {

    },
    getters: {
        roles: state => state.serverSendSegList,
    }
});