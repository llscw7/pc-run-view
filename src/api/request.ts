import http from './http'

export const uploadImage = (image: File): Promise<ResponseParam.Result> => {
    return http.post('/upload', {
        image
    }, {
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

export const submitData = (data: submitData): Promise<ResponseParam.Result> => {
    return http.post('/submit', {
        data
    })
}

export const getAllImages = (): Promise<allImageItem[]> => {
    return http.get('/allImage')
}

export const deleteData = (data: deleteData): Promise<ResponseParam.Result> => {
    return http.post('/delete', {
        data
    })
}