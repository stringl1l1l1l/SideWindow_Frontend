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

