import http from '@/utils/request'

export async function startServer(port) {
    return http.post('/server/start', { extra: { port: port } })
}

export async function stopServer() {
    return http.post('/server/stop')
}

export async function send(data) {
    return http.post('/server/send', { extra: { data: data } })
}

export async function shutdown() {
    http.post('/server/stop');
    return http.post('/client/stop')
}

export async function changeSendWinSize(newSize) {
    return http.post('/server/changeSendWinSize', { extra: { newSendWinSize: newSize } })
}
export async function changeMSS(newMSS) {
    return http.post('/server/changeMSS', { extra: { newMSS: newMSS } })
}