<style scoped>

p {
  font-size: 18px;
  line-height: 35px;
}
p span:first-child{
  font-weight: bold;
  margin-right: 5px;
}
div {
  width: 300px;
  margin: 0 auto;
}
img {
  width: 200px;
  height: 200px;
}
</style>

<template>
  <div>
    <Modal
      v-model="show"
      title="用户详情"
      :footer-hide="true"
      @on-visible-change="statusChange"
    >
      <div>
        <p>
          <img :src="user.avatar_path" v-if="user.avatar">
        </p>
        <p><span>UID: </span>{{user.uid}}</p>
        <p><span>用户名: </span>{{user.username}}</p>
        <p><span>邮箱: </span>{{user.email}}</p>
        <p><span>昵称: </span>{{user.nickname}}</p>
        <p><span>等级: </span><span :class="user.level_class">{{user.level_text}}</span></p>
        <p><span>积分: </span>{{user.score}}</p>
        <p><span>注册日期: </span>{{user.date}}</p>
        <p><span>当前状态: </span>{{user.status}}</p>
      </div>
      <!-- <div>
        <Button type="error" @click="disableUser">禁用</Button>
      </div> -->
      <Spin size="large" fix v-if="loading"></Spin>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'userdetail',
  props: {
    id: {
      type: Number
    }
  },
  data () {
      return {
        loading: true,
        show: false,
        user: {}
      }
  },
  mounted() {
    if(!this.id || this.id == 0) {
      this.$Message.warning('这是个匿名用户');
      setTimeout(() => {
      this.statusChange(false);
      }, 1000);
    }else {
      this.show = true;
      this.axios.get('/admin/user-detail/?id='+this.id)
      .then((res) => {
        this.loading = false;
        this.user = res.data.data;
        this.user.avatar_path = `${this.axios.defaults.baseURL}/static/upload/avatar/${this.user.avatar}.jpg`;
        const level = this.user.level;
        let quality_class = 'common';
        let quality_text = '普通';
        if(level == 1) {quality_class = 'quality-uncommon';quality_text = '优秀'}
        if(level == 2) {quality_class = 'quality-rare';quality_text = '稀有'}
        if(level == 3) {quality_class = 'quality-epic';quality_text = '史诗'}
        if(level >= 4) {quality_class = 'quality-legendary';quality_text = '传说'}
        this.user.level_text = quality_text;
        this.user.level_class = quality_class;
      })
    }
  },
  methods: {
    statusChange (status) {
      if(status == false) {
        this.$destroy();
        document.body.removeChild(this.$el);
      }
    }
  }
}
</script>