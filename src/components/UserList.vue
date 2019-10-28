<template>
  <div class="user-list">
    <div class="button-header">
      <h1>用户列表</h1>
    </div>
    <Table 
      border 
      :loading="loading" 
      :columns="columns" 
      :data="data" 
      size="small" 
      @on-row-click="RowClick"
    ></Table>
    <br>
    <Page 
      :total="paginate.total" 
      :page-size="paginate.page_size" 
      :page-size-opts="[15,30,46,60]" 
      :current="paginate.page" 
      show-sizer 
      show-total 
      show-elevator 
      @on-change="PageChange" 
      @on-page-size-change="PageSizeChange" 
    />
  </div>
</template>

<script>

export default {
  data () {
    return {
      paginate: {
        total: 99,
        page: 1,
        page_size: 15
      },
      loading: true,
      columns: [
          { title: 'UID', key: 'uid' },
          { title: '用户名', key: 'username' },
          { title: '邮箱', key: 'email' },
          { title: '头像', key: 'avatar' },
          { title: '等级', key: 'level', render: (h, params) => {
            const level = params.row.level;
            let quality_class = 'common';
            let quality_text = '普通';
            if(level == 1) {quality_class = 'quality-uncommon';quality_text = '优秀'}
            if(level == 2) {quality_class = 'quality-rare';quality_text = '稀有'}
            if(level == 3) {quality_class = 'quality-epic';quality_text = '史诗'}
            if(level >= 4) {quality_class = 'quality-legendary';quality_text = '传说'}
            return h('b', {class: quality_class}, quality_text);
          }},
          { title: '积分', key: 'score' },
          { title: '注册时间', key: 'date' },
          { title: '状态', key: 'status', render: (h, params) => {
            const status = params.row.status;
            let color = 'success';
            let text = '正常';
            if (status=='normal') {color = 'success';text = '正常'}
            return h('Tag', {props:{color: color}}, text);
          }}
      ],
      data: []
    }
  },
  mounted() {
    this.LoadData();
  },
  methods: {
    LoadData () {
      this.loading = true;
      this.axios.get(`/admin/user-list/?page=${this.paginate.page}&page_size=${this.paginate.page_size}`, )
      .then((res) => {
        this.loading = false;
        this.data = res.data.data.users;
        this.paginate.total = res.data.data.total;
      });
    },
    PageChange (page) {
      this.paginate.page = page;
      this.LoadData();
    },
    PageSizeChange (size) {
      this.paginate.page_size = size;
      this.LoadData();
    },
    RowClick (data, index) {
      this.$GetUserDetail(data.id);
    }
  },
}
</script>
<style scoped>

</style>
