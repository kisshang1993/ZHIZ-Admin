<template>
  <div class="user-list">
    <div class="button-header">
      <h1>文章列表</h1>
      <div class="buttom-group">
        <Button type="primary" to="/index/article-detail/">添加文章</Button>
      </div>
    </div>
    <Table border :loading="loading" :columns="columns" :data="data" size="small" ></Table>
    <br>
    <Page 
      :total="paginate.total" 
      :page-size="this.$store.state.article_page_size" 
      :page-size-opts="[15,30,46,60]" 
      :current="this.$store.state.article_page" 
      show-sizer 
      show-total 
      show-elevator 
      @on-change="PageChange"  
      @on-page-size-change="PageSizeChange" 
    />
    <!-- Article Model -->
    <Modal
        v-model="article_setting.show"
        :loading="article_setting.loading"
        title="文章设置"
        @on-ok="handleArticleChangeSetting">
        <label for="" class="mb5">文章状态</label>
        <Select v-model="article_setting.data.status">
            <Option v-for="item in article_setting.status_list" :value="item.value" :key="item.value" :style="'color:' + item.color">{{ item.label }}</Option>
        </Select>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      article_setting: {
        show: false,
        loading: true,
        data: {},
        status_list: [{
          value: 'normal',
          label: '正常'
        },{
          value: 'notice',
          label: '通知'
        },{
          value: 'deleted',
          label: '删除',
          color: '#F00'
        }]
      },
      paginate: {
        total: 99,
        filters: {}
      },
      loading: true,
      columns: [
          { title: '#', key: 'id', width: '80'},
          { title: '标题', key: 'title', width: '400', tooltip: true},
          { title: '作者', key: 'author' , width: '120',
          render: (h, params) => {
            return h('span', {
              class: 'user-detail-link',
              attrs: {title: '查看用户详情'},
              on: {click: () => {this.$GetUserDetail(params.row.author_id)}}
            }, params.row.author)
          }
          },
          { title: '发表时间', key: 'date' },
          { title: 'H', width: '70', align: 'center',
          render: (h, params) => {
            let type = '';
            let color = '';
            let content = '';
            if (params.row.has_hide) {
              if(params.row.hide_level > 0) {
                type = 'md-checkmark';
                color = '#19be6b';
                content = '有隐藏内容并且已配置权限';
              }else {
                type = 'ios-alert';
                color = '#ed4014';
                content = '隐藏内容未设置权限'
              }
              if(params.row.hide_level > 1) {
                color = '#ff9900';
                content = `设置权限为优秀以上，设置值为：${params.row.hide_level}`
              }
            }else {
              if(params.row.hide_level > 0) {
                type = 'md-help';
                color = '#ff9900';
                content = '没有隐藏内容却设置了权限？'
              }
            }
            if(params.row.tags == 0) {
                type = 'ios-alert';
                color = '#ed4014';
                content = '未添加标签'
            }
            return h('Tooltip', {
              props: {content: content, placement: 'top'},
            },[
              h('Icon', {
                props: {type: type, color: color, size: '20'},
              })
            ])
           }
          },
          { title: '状态', key: 'status',
            filters: [
                {
                    label: '正常',
                    value: 'normal'
                },
                {
                    label: '通知',
                    value: 'notice'
                },
                {
                    label: '已删除',
                    value: 'deleted'
                }
            ],
            filterMultiple: false,
            filterRemote: (value, row) => {
              this.paginate.filters.status = value[0];
              this.LoadData();
            },
            render: (h, params) => {
              const status = params.row.status;
              let color = 'success';
              let text = '正常';
              if (status=='normal') {color = 'success';text = '正常'}
              if (status=='notice') {color = 'primary';text = '通知'}
              if (status=='deleted') {color = 'error';text = '已删除'}
              return h('Tag', {props:{color: color}}, text
            );
          }},
          { title: '浏览', key: 'visited' , width: '80'},
          { title: '赞', key: 'like' , width: '80'},
          { title: '控制', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      to: `/index/article-detail/?id=${params.row.id}`
                    },
                    style: {marginRight: '5px'}
                }, '编辑'),
                h('Button', {
                    props: {
                      size: 'small',
                      to: `${this.$store.state.baseURL}/article/${params.row.id}/`,
                      target: '_blank'
                    },
                    style: {marginRight: '5px'}
                }, '预览'),
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.showArticlePanel(params.row)
                        }
                    }
                }, '控制')
            ]);
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
      let query_url = `/admin/articles-list/?page=${this.$store.state.article_page}&page_size=${this.$store.state.article_page_size}`;
      if(this.paginate.filters.status) query_url += `&status=${this.paginate.filters.status}`;
      this.loading = true;
      this.axios.get(query_url)
      .then((res) => {
        this.loading = false;
        this.data = res.data.data.list;
        this.paginate.total = res.data.data.total;
      });
    },
    PageChange (page) {
      this.$store.state.article_page = page;
      this.LoadData();
    },
    PageSizeChange (size) {
      this.$store.state.article_page_size = size;
      this.LoadData();
    },
    showArticlePanel (data) {
      this.article_setting.show = true;
      this.article_setting.data = data;
    },
    handleArticleChangeSetting () {
      console.log(this.article_setting.data)
      this.axios.post('/admin/article-update/', {
        id: this.article_setting.data.id,
        status: this.article_setting.data.status
      })
      .then((res) => {
        if(res.data.code == 200) {
          this.article_setting.show = false;
          this.$Message.success('更新成功');
        }else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  },
}
</script>
<style scoped>

</style>
