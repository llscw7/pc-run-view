import http from './http'

export const uploadImage = (image: File): Promise<ResponseParam.Result> => {
    return http.post('/upload', {
        image
    })
}