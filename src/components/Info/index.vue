<template>
  <div>
    <div v-if="propMode === 'create'">
      <el-button type="success" circle icon="el-icon-plus" @click="dialogVisible = true" />
    </div>
    <div v-else-if="propMode === 'update'">
      <el-button type="success" @click="dialogVisible = true">更新女優</el-button>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      top="2vh"
      :before-close="handleClose"
    >
      <input
        ref="input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      >
      <div class="content">
        <section class="cropper-area">
          <div class="img-cropper">
            <vue-cropper
              ref="cropper"
              :auto-crop-area="1"
              :src="imgSrc"
            />
          </div>
          <div class="actions" />
        </section>
      </div>
      <div>
        <el-form ref="form" :model="form">
          <el-form-item label="名子">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="羅馬拼音">
            <el-input v-model="form.romanization" />
          </el-form-item>
          <el-form-item label="附註">
            <el-input v-model="form.detail" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="syncFaceToken">同時上傳至辨識圖庫</el-checkbox>
            <el-button type="primary" @click="showFileChooser">選圖</el-button>
            <el-button type="success" v-if="propMode === 'create'" @click="onCreate">創建</el-button>
            <el-button type="warning" v-if="propMode === 'update'" @click="onUpload">更新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { mapGetters } from 'vuex'
import faceService from '../../api/faceService'

export default {
  components: {
    VueCropper
  },
  props: ['propMode', 'propInfoId', 'propName', 'propRomanization', 'propDetail', 'propPreview'],
  data() {
    return {
      show: true,
      dialogVisible: false,
      imgSrc: `${process.env.BASE_URL}selectImageInfo.png`,
      syncFaceToken: false,
      full: true,
      id: '',
      form: {
        name: '',
        romanization: '',
        detail: ''
      },
      faceServiceHandler: {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    dialogTitle() {
      if (this.propMode === 'create') return '新增女優'
      else if (this.propMode === 'update') return `更新女優: ${this.id}-${this.form.name}`
    }
  },
  mounted() {
    this.faceServiceHandler = faceService(this.token)
    this.form.name = this.propName
    this.form.romanization = this.propRomanization
    this.form.detail = this.propDetail
    this.imgSrc = null
    this.id = this.propInfoId
  },
  methods: {
    handleClose(done) {
      this.$confirm('確認關閉？')
        .then(_ => {
          this.destroyedImage()
          done()
        })
        .catch(_ => {})
    },
    setImage(e) {
      const file = e.target.files[0]

      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file')
        return
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = (event) => {
          this.imgSrc = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
        }

        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    showFileChooser() {
      this.$refs.input.click()
    },
    async onUpload() {
      const loading = this.$loading({
        lock: true,
        text: '上傳中'
      })

      const imageBlob = (this.isImageExist()) ? await this.getImageBlob() : null
      await this.faceServiceHandler.putInfo(imageBlob, this.id, this.form.name, this.form.romanization, this.form.detail)
      if (this.syncFaceToken) await this.uploadFaceToken()

      loading.close()
      this.$message('成功')
      this.$emit('on-success-close')
      this.dialogVisible = false
    },
    isImageExist() {
      return !!this.$refs.cropper.getCroppedCanvas()
    },
    getImageBlob() {
      return new Promise((resolve, reject) => {
        this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        }, 'image/jpeg')
      })
    },
    destroyedImage() {
      this.$refs.cropper.destroy()
    },
    async uploadFaceToken() {
      const loading = this.$loading({
        lock: true,
        text: '上傳中'
      })

      const imageBlob = await this.getImageBlob()
      await this.faceServiceHandler.postFace(imageBlob, this.id)

      loading.close()
      this.$message('成功')
      this.$emit('on-success-close')
      this.dialogVisible = false
    },
    async onCreate() {
      const loading = this.$loading({
        lock: true,
        text: '上傳中'
      })

      const imageBlob = await this.getImageBlob()
      const result = await this.faceServiceHandler.postInfo(imageBlob, this.form.name, this.form.romanization, this.form.detail)
      this.id = result.id
      if (this.syncFaceToken) await this.uploadFaceToken()

      loading.close()
      this.$message('成功')
      this.$emit('on-success-close')
      this.dialogVisible = false
    }
  }
}
</script>

<style>
input[type="file"] {
  display: none;
}

.content {
  display: flex;
  justify-content: center;
}

.cropper-area {
  width: 614px;
}

.actions {
  margin-top: 1rem;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062CC;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>
