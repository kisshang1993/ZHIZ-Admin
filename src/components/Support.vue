<style scoped>

</style>

<template>
  <div>
    <div class="button-header">
      <h1>辅助功能</h1>
    </div>
    <div>
      <Button type="primary" :loading="sitemap_loading" @click="generateSitemap">生成站点地图</Button>
    </div>
    <br>
    <div>
     
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      sitemap_loading: false
    }
  },
  methods: {
    generateSitemap () {
      this.sitemap_loading = true;
      this.axios.post('/admin/generate_sitemap/')
      .then((res) => {
        this.sitemap_loading = false;
        if(res.data.code == 200) {
          this.$Message.success('站点地图已更新');
        }
      })
    }
  },
}
</script>
<style scoped>

</style>
