<style scoped>
  iframe {
    width: 100%;
    height: 700px;
    border: none;
  }
  .code-list {
    padding: 20px 0;
  }
</style>

<template>
  <div>
    <div class="button-header">
      <h1>备份</h1>
    </div>
    <div>
      <Button type="primary" :loading="loading" @click="backupImage">提取图片链接</Button>
    </div>
    <br>
    <div>
      <Input v-model="imgs_txt" type="textarea" :rows="30" placeholder="先提取连接" />
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      imgs_txt: '',
      loading: false
    }
  },
  methods: {
    backupImage () {
      this.loading = true;
      this.axios.get('/admin/backup/getpath/')
      .then((res) => {
        this.loading = false;
        if(res.data.code == 200) {
          this.imgs_txt = res.data.data;
        }else {
          this.$Message.error(res.data.msg);
        }
      })
    }
  },
}
</script>
<style scoped>

</style>
