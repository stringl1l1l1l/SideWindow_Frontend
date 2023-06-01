import http from '@/utils/request'

export async function connect(host, port) {
    return http.post('/client/connect', { extra: { host: host, port: port } })
}

export async function stopClient() {
    return http.post('/client/stop')
}

export async function check() {
    return http.post('/client/check')
}

export async function changeRecvWinSize(newSize) {
    return http.post('/client/changeRecvWinSize', { extra: { newRecvWinSize: newSize } })
}

export async function clearReceiveCache() {
    return http.post('/client/clearReceiveCache')
}

export async function openRandomError(flag) {
    return http.post('/client/openRandomError', { extra: { openRandomError: flag } })
}
