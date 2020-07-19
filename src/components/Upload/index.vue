<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">上傳臉圖</el-button>

    <el-dialog
      title="上傳臉圖"
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
              :src="imgSrc"
            />
          </div>
          <div class="actions" />
        </section>
      </div>
      <div>
        <el-form ref="form" :model="form">
          <el-form-item>
            準備開上傳 {{ infoId }}-{{ form.name }} 的照片~
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="showFileChooser"
            >
              選圖
            </el-button>
            <el-button
              type="primary"
              @click="rotate(90)"
            >
              旋轉
            </el-button>
            <el-button
              type="primary"
              @click="reset"
            >
              重置
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="onSubmit"
            >
              上傳
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import faceService from '../../api/faceService'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueCropper
  },
  props: ['propInfoId', 'propName'],
  data() {
    return {
      dialogVisible: false,
      imgSrc: null,
      name: '',
      infoId: '',
      cropImg: '',
      cropped: null,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      faceServiceHandler: {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.faceServiceHandler = faceService(this.token)
    this.infoId = this.propInfoId
    this.form.name = this.propName
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
    reset() {
      this.$refs.cropper.reset()
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg)
    },
    isImageExist() {
      return !!this.$refs.cropper.getCroppedCanvas()
    },
    destroyedImage() {
      this.$refs.cropper.destroy()
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
    async onSubmit() {
      // Check input
      if (!this.isImageExist()) {
        window.alert('請選擇臉圖再上傳')
        return
      }

      // Business logic
      const loading = this.$loading({
        lock: true,
        text: '上傳中'
      })

      const imageBlob = await this.getImageBlob()
      await this.faceServiceHandler.postFace(imageBlob, this.infoId)

      loading.close()
      this.$message('成功')
      this.dialogVisible = false
    },
    getImageBlob() {
      return new Promise((resolve, reject) => {
        this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        }, 'image/jpeg')
      })
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
