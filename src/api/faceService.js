import axios from 'axios'

export function faceService(token) {
  return {
    updateToken(newToken) {
      token = newToken
    },
    async searchName(name) {
      const result = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_API}/face-service/faces/info?likeName=${name}`,
        headers: {
          'Authorization': token
        }
      })
      return result.data
    },
    async getInfosWithPagination(limit = 10, offset = 0) {
      const result = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_API}/face-service/faces/info?limit=${limit}&offset=${offset}`,
        headers: {
          'Authorization': token
        }
      })
      return result.data
    },
    async postFace(imageBlob, infoId) {
      const formData = new FormData()
      formData.append('image', imageBlob, 'filename.png')
      formData.append('infoId', infoId)
      const result = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_BASE_API}/face-service/faces/face`,
        headers: {
          'Authorization': token
        },
        data: formData
      })
      return result.data
    },
    async postInfo(imageBlob, name, romanization, detail) {
      const formData = new FormData()
      if (imageBlob) formData.append('preview', imageBlob, 'filename.png')
      formData.append('name', name)
      if (!!romanization && romanization !== '') formData.append('romanization', romanization)
      if (!!detail && detail !== '') formData.append('detail', detail)
      const result = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_BASE_API}/face-service/faces/info`,
        headers: {
          'Authorization': token
        },
        data: formData
      })
      return result.data
    },
    async putInfo(imageBlob, id, name, romanization, detail) {
      const formData = new FormData()
      if (imageBlob) formData.append('preview', imageBlob, 'filename.png')
      formData.append('name', name)
      if (!!romanization && romanization !== '') formData.append('romanization', romanization)
      if (!!detail && detail !== '') formData.append('detail', detail)
      const result = await axios({
        method: 'put',
        url: `${process.env.VUE_APP_BASE_API}/face-service/faces/info/${id}`,
        headers: {
          'Authorization': token
        },
        data: formData
      })
      return result.data
    }
  }
}

export default faceService
