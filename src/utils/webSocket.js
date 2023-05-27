import { ADD_SERVER_SEND_PACK, UPDATE_SERVER_SEND_SEGINFO_LIST, UPDATE_SEND_WIN_ARRAY } from '@/utils/store'

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
            window.$vm.$store.commit(UPDATE_SERVER_SEND_SEGINFO_LIST, response.segInfoList)
        }
        // 添加发送窗口信息
        if (response.extra.sendWin) {
            console.log("更新窗口")
            console.log(response.extra.sendWin)
            window.$vm.$store.commit(UPDATE_SEND_WIN_ARRAY, response.extra.sendWin)
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

        // 发送消息到WebSocket服务器
        clientSocket.send('clientSocket: Hello, backend!');
    };

    clientSocket.onmessage = function (event) {
        const message = event.data;
        console.log('收到消息：', message);
    };

    clientSocket.onclose = function (event) {
        console.log('clientSocket连接已关闭');
    };

    clientSocket.onerror = function (error) {
        console.error('clientSocket发生错误：', error);
    };

    return clientSocket
}