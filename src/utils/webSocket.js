import {
    ADD_SERVER_SEND_PACK,
    UPDATE_SERVER_SEND_SEGINFO_LIST,
    UPDATE_SEND_WIN,
    UPDATE_SERVER_RECV_SEGINFO_LIST,
    UPDATE_RECV_DATA,
    UPDATE_CLIENT_RECV_SEGINFO_LIST,
    UPDATE_CLIENT_SEND_SEGINFO_LIST,
    UPDATE_RECV_WIN
} from '@/utils/store'
const PACK = 200
const ACK = 201
export function initServerSocket() {
    const serverSocket = new WebSocket('ws://localhost:8080/SideWindows_war_exploded/server_socket');
    serverSocket.onopen = function () {
        console.log('serverSocket连接已建立');
    };

    serverSocket.onmessage = function (event) {
        const message = event.data;
        const response = JSON.parse(message)
        console.log("serverSocket接收到报文: ")
        console.log(response);
        if (response)
            window.$vm.$store.commit(ADD_SERVER_SEND_PACK, response)
        // 添加报文信息列表
        if (response.segInfoList) {
            if (response.status == PACK)
                window.$vm.$store.commit(UPDATE_SERVER_SEND_SEGINFO_LIST, response.segInfoList)
            else if (response.status == ACK)
                window.$vm.$store.commit(UPDATE_SERVER_RECV_SEGINFO_LIST, response.segInfoList)
        }
        // 添加发送窗口信息
        if (response.extra) {
            if (response.extra.sendWin) {
                console.log("更新窗口")
                console.log(response.extra.sendWin)
                window.$vm.$store.commit(UPDATE_SEND_WIN, response.extra.sendWin)
            }
        }
    };

    serverSocket.onclose = function (event) {
        console.log('serverSocket连接已关闭');
    };

    serverSocket.onerror = function (error) {
        console.error('serverSocket发生错误：', error);
    };

    return serverSocket
}

export function initClinetSocket() {
    const clientSocket = new WebSocket('ws://localhost:8080/SideWindows_war_exploded/client_socket');
    clientSocket.onopen = function () {
        console.log('clientSocket连接已建立');
    };

    clientSocket.onmessage = function (event) {
        const message = event.data;
        const response = JSON.parse(message)
        console.log("clientSocket接收到报文: ")
        console.log(response);
        // 添加报文信息列表
        if (response.segInfoList) {
            if (response.status == PACK)
                window.$vm.$store.commit(UPDATE_CLIENT_RECV_SEGINFO_LIST, response.segInfoList)
            else if (response.status == ACK)
                window.$vm.$store.commit(UPDATE_CLIENT_SEND_SEGINFO_LIST, response.segInfoList)
        }
        if (response.extra) {
            if (response.extra.recvWin) {
                console.log("更新窗口")
                console.log(response.extra.recvWin)
                window.$vm.$store.commit(UPDATE_RECV_WIN, response.extra.recvWin)
            }
            if (response.extra.data) {
                console.log("更新数据")
                console.log(response.extra.data)
                window.$vm.$store.commit(UPDATE_RECV_DATA, response.extra.data)
            }
        }
    };

    clientSocket.onclose = function (event) {
        console.log('clientSocket连接已关闭');
    };

    clientSocket.onerror = function (error) {
        console.error('clientSocket发生错误：', error);
    };

    return clientSocket
}