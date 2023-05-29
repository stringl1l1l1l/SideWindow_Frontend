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
export const UPDATE_RECV_WIN = 'UPDATE_RECV_WIN'
export const CLEAR_SEVER = 'CLEAR_SEVER'
export const CLEAR_CLIENT = 'CLEAR_CLIENT'

export default createStore({
    state: {
        sSendWinCnt: 0,
        cRecvWinCnt: 0,
        sSendWin: {},
        cRecvWin: {},
        sSendPackList: [], // 存储接受到的报文列表
        sRecvInfoList: [],
        sSendInfoList: [], // 只存储seginfo的列表
        cSendInfoList: [],
        cRecvInfoList: [],
        cRecvData: ""
    },

    mutations: {
        [UPDATE_RECV_DATA](state, data) {
            state.cRecvWinCnt++
            state.cRecvData = data
        },
        [UPDATE_SEND_WIN](state, sendWin) {
            state.sSendWinCnt++
            state.sSendWin = sendWin
        },
        [UPDATE_RECV_WIN](state, sendWin) {
            state.cRecvWinCnt++
            state.cRecvWin = sendWin
        },
        [ADD_SERVER_SEND_PACK](state, pack) {
            state.sSendPackList.push(pack)
        },
        [UPDATE_SERVER_SEND_SEGINFO_LIST](state, InfoList) {
            state.sSendInfoList = [...InfoList.reverse(), ...state.sSendInfoList]
        },
        [UPDATE_SERVER_RECV_SEGINFO_LIST](state, InfoList) {
            state.sRecvInfoList = [...InfoList.reverse(), ...state.sRecvInfoList]
        },
        [UPDATE_CLIENT_RECV_SEGINFO_LIST](state, InfoList) {
            state.cRecvInfoList =  [...InfoList.reverse(), ...state.cRecvInfoList]
        },
        [UPDATE_CLIENT_SEND_SEGINFO_LIST](state, InfoList) {
            state.cSendInfoList =  [...InfoList.reverse(), ...state.cSendInfoList]
        },
        [CLEAR_SEVER](state) {
            state.sRecvInfoList = []
            state.sSendPackList = []
            state.sSendInfoList = []
            state.sSendWin = {}
            state.sSendWinCnt = 0
        },
        [CLEAR_CLIENT](state) {
            state.cRecvInfoList = []
            state.cSendInfoList = []
            state.cRecvData = ""
            state.cRecvWin = {}
        }
    }
});