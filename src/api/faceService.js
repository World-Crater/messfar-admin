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
    }
  }
}

export default faceService
