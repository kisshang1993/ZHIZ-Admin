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
  <div class="user-list">
    <div class="button-header">
      <h1>邀请码</h1>
    </div>
    <Row :gutter="16">
        <Col span="12">
            <Table 
                border 
                :loading="loading" 
                :columns="columns" 
                :data="data" 
                size="small" 
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
        </Col>
        <Col span="12">
            <div>
              <Button type="primary" @click="add_panel=true">添加邀请码</Button>
              <Button to="https://www.2faka.com/usr/addCard?pid=152339" target="_blank">跳转加卡</Button>
            </div>
            <div class="code-list">
              <Input 
                v-model="code_list" 
                type="textarea" 
                readonly="true" 
                :autosize="{minRows: 27,maxRows: 27}" 
                placeholder="暂无待添加邀请码"
              ></Input>
            </div>
        </Col>
    </Row>
    <Modal
        v-model="add_panel"
        title="添加邀请码"
        :loading="add_loading"
        ok-text="添加"
        @on-ok="AddInvitationCode">
        <Form>
            <FormItem label="邀请码数量" :model="add_settings">
                <Input v-model="add_settings.count"></Input>
            </FormItem>
            <FormItem label="激活等级">
                <Select v-model="add_settings.level">
                    <Option value="1">优秀</Option>
                    <Option value="2">精良</Option>
                    <Option value="3">史诗</Option>
                </Select>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>

export default {
  data () {
    return {
      add_panel: false,
      add_loading: true,
      add_settings: {
        count: 1,
        level: '1'
      },
      code_list: '',
      paginate: {
        total: 99,
        page: 1,
        page_size: 15
      },
      loading: true,
      columns: [
          { title: '邀请码', key: 'code' },
          { title: '激活等级', key: 'level', render: (h, params) => {
            const level = params.row.level;
            let quality_class = 'common';
            let quality_text = '普通';
            if(level == 1) {quality_class = 'quality-uncommon';quality_text = '优秀'}
            if(level == 2) {quality_class = 'quality-rare';quality_text = '稀有'}
            if(level == 3) {quality_class = 'quality-epic';quality_text = '史诗'}
            if(level >= 4) {quality_class = 'quality-legendary';quality_text = '传说'}
            return h('b', {class: quality_class}, quality_text);
          }},
          { title: '状态', key: 'status', render: (h, params) => {
            const status = params.row.status;
            let color = 'default';
            let text = '未使用';
            if (status=='used') {color = 'success';text = '已激活'}
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
      this.axios.get(`/admin/invitation-code/?page=${this.paginate.page}&page_size=${this.paginate.page_size}`, )
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
    AddInvitationCode () {
      this.axios.post('/admin/invitation-code/', {
        count: this.add_settings.count,
        level: +this.add_settings.level
      })
      .then((res) => {
        if(res.data.code == 200) {
          this.code_list = res.data.data.join('\n');
          this.add_panel = false;
          this.LoadData();
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
