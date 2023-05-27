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