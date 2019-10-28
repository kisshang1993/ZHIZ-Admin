<style scoped>
  .reply-more {
    margin-bottom: 10px; 
  }
  .reply-more .name{
    font-size: 16px;
    font-weight: bold;
  }  
  .reply-more .date{
    color: #666;
    margin-left: 5px;
  }
</style>

<template>
  <div class="user-list">
    <div class="button-header">
      <h1>评论列表</h1>
    </div>
    <Table 
      border 
      :loading="loading" 
      :columns="columns" 
      :data="data" 
      size="small"
      :highlight-row="true"
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
    <!-- Reply -->
    <Modal v-model="reply_more.show" :footer-hide="true" scrollable title="此回复引用的回复">
        <div>
          <div v-for="(r, index) in reply_more.reply" :key="r.id" class="reply-more">
            <Divider dashed v-if="index==reply_more.reply.length-1">以上为引用</Divider>
            <p class="title">
              <span class="name user-detail-link" @click="()=>{checkUserDetail(r.sender_id)}">{{r.name}}</span>
              <span class="date">{{r.date}}</span>
            </p>
            <p class="content">{{r.text}}</p>
          </div>
        </div>
        <Spin size="large" fix v-if="reply_more.loading"></Spin>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      paginate: {
        total: 99,
        page: 1,
        page_size: 15,
        filters: {
          status: 'inspect'
        }
      },
      loading: true,
      reply_more: {
        id: 0,
        show: false,
        loading: false,
        reply: []
      },
      columns: [
          { title: '评论内容', key: 'content', width: 500, tooltip: true},
          { title: '评论回复', key: 'reply_id', width: 100, align: 'center', render: (h, params) => {
            if(params.row.reply_id != null) {
                return h('a', {
                  class: 'reply-more',
                  on: {
                      click: () => {
                          this.CheckReply(params.row)
                      }
                  }
                  }, '查看引用');
            }},
          },
          { title: '昵称', key: 'name', tooltip: true, 
            render: (h, params) => {
              return h('span', {
                class: 'user-detail-link',
                attrs: {title: '查看用户详情'},
                on: {click: () => {this.$GetUserDetail(params.row.sender_id)}}
              }, params.row.sender_name)
            }
          },
          { title: '等级', key: 'level', width: 66, align: 'center',render: (h, params) => {
            const level = params.row.sender_level;
            let quality_class = 'common';
            let quality_text = '普通';
            if(level == 1) {quality_class = 'quality-uncommon';quality_text = '优秀'}
            if(level == 2) {quality_class = 'quality-rare';quality_text = '稀有'}
            if(level == 3) {quality_class = 'quality-epic';quality_text = '史诗'}
            if(level >= 4) {quality_class = 'quality-legendary';quality_text = '传说'}
            return h('b', {class: quality_class}, quality_text);
          }},
          { title: '邮箱', key: 'sender_email' },
          { title: '当前状态', key: 'status', width: 130, align: 'center', 
            filters: [
                {label: '审核中', value: 'inspect'},
                {label: '已准许', value: 'allowed'},
                {label: '已拒绝', value: 'rejected'},
            ],
            filteredValue: ['inspect'],
            filterMultiple: false,
            filterRemote: (value, row) => {
              this.paginate.filters.status = value[0];
              this.LoadData();
            },
            render: (h, params) => {
              const status = params.row.status;
              let color = 'orange';
              let text = '审核中';
              if (status == 'allowed') {
                color = 'green';
                text = '已准许'
              }
              if (status == 'rejected') {
                color = 'error';
                text = '已拒绝'
              }
              return h('Tag', {props:{color: color}}, text);
            }
          },
          { title: '发送时间', key: 'date', width: 170, align: 'center'},
          { title: '审批', key: 'action', width: 200, align: 'center', render: (h, params) => {
            if (params.row.status == 'inspect' || params.row.status == 'loading') {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'success',
                          size: 'small',
                          loading: params.row.status == 'loading'
                      },
                      style: {marginRight: '10px'},
                      on: {
                          click: () => {
                              this.confirmComment(params.row, 'allowed');
                          }
                      }
                  }, '准许'),
                  h('Button', {
                      props: {
                          type: 'error',
                          size: 'small',
                          loading: params.row.status == 'loading'
                      },
                      on: {
                          click: () => {
                              this.confirmComment(params.row, 'rejected');
                          }
                      }
                  }, '拒绝')
              ]);
            }
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
      let query_url = `/admin/comments-list/?page=${this.paginate.page}&page_size=${this.paginate.page_size}`;
      if(this.paginate.filters.status) query_url += `&status=${this.paginate.filters.status}`;
      this.axios.get(query_url)
      .then((res) => {
        this.loading = false;
        this.data = res.data.data.list;
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
    CheckReply (row) {
      this.reply_more.reply = [];
      this.reply_more.id = row.reply_id;
      this.reply_more.show = true;
      this.reply_more.loading = true;
      this.axios.get(`/admin/comment-reply/?id=${row.reply_id}`)
      .then((res) => {
        if (res.data.code == 200) {
          this.reply_more.loading = false;
          this.reply_more.reply = res.data.data;
          this.reply_more.reply.push({
            id: row.id,
            name: row.sender_name,
            level: row.sender_level,
            text: row.content,
            date: row.date
          })
        }else {
          this.$Message.error('发生错误');
        }
      });
    },
    confirmComment (row, status) {
      row.status = 'loading';
      this.axios.post('/admin/comments-list/', {id: row.id, status})
      .then((res) => {
        row.loading = false;
        row.status = status;
        if(res.data.code == 200) {
          this.$Message.success('已准许');
        }else {
          this.$Message.warning('已拒绝');
        }
      }).catch(() => {
        row.loading = false;
      });
    },
    checkUserDetail (id) {
      this.$GetUserDetail(id)
    }
  },
}
</script>
<style scoped>

</style>
