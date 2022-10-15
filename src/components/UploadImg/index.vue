<template>
  <div>
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      list-type="picture-card"
      :on-preview="onPictureCardPreview"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :limit="1"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="新增学科"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <img style="width:100%" :src="previewImg" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID45yiIiB83oUPL8lCYovvkOsIf2MXZR9l',
  SecretKey: 'Xs1ykMm15412znU3VsAMOEtWFvUwOiwz'
})
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      previewImg: '',
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ]
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default',
        url: this.defaultUrl
      })
    }
  },
  methods: {
    onPictureCardPreview(file) {
      this.dialogVisible = true
      this.previewImg = file.url
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // 1.本地选择上传图片 原来有一个数据+选择数据
    // 本地上传完会自动发请求
    // 2.请求上传 成功/失败 原来有一个数据
    onChange(file, fileList) {
    //   this.fileList.push(file)
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'hz-33myl-1314348566', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // err上传失败的信息，如果上传成功err为null
        // data上传成功的信息
        if (err) return this.$message.error('上传失败')
        this.$emit('on-success', {
          // https://hz-33myl-1314348566.cos.ap-shanghai.myqcloud.com/5d8de63e9930117384126491cf16737.jpg
          imgUrl: 'https://' + data.Location
        })
        this.loading = false
        console.log(data)
      })
    },
    beforeUpload(file) {
      // 限制上传文件类型
      const allowType = ['image/jpeg', 'image/jif']
      //  循环 查找某一个数据是否在数组中
      // 1. some() 某一个数据是否在数组中 可以是复杂类型数组
      // 2.find() 查找，返回找到的那一项
      // 3.findIndex() 查找，找到那一项的索引 用于复杂类型数组的查找
      // 4.indexOf('1') 查找， 返回的索引[{id:1},{id:2}] 用于简单类型数组
      // 5.includes 查找，返回的是布尔值  简单类型数组
      if (!allowType.includes(file.type)) {
        this.$message.error('亲，请输入' + allowType.join('、') + '类型文件')
        return false
      }

      // 限制上传大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传的图片不能超过1Mb')
        return false
      }
    }

  }

}
</script>

<style>
.uploadImg{
    width: 148px;
    height: 148px;
    overflow: hidden;
}
</style>
