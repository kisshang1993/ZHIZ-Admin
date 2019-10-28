<style scoped>
  h1 {
    text-align: center;
  }
  .login-form {
    margin-top: 100px;
  }
</style>
<template>
<div class="login-form">
  <h1>HLDPIC Management</h1>
  <Divider />
  <Form ref="LoginFormData" :model="LoginFormData" :rules="ruleValidate" :label-width="80">
      <FormItem label="账号" prop="username">
          <Input v-model="LoginFormData.username" placeholder="请输入账号"></Input>
      </FormItem>
      <FormItem label="密码" prop="passwd">
          <Input type="password" v-model="LoginFormData.passwd" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem label="主机">
        <Select v-model="pick_host">
            <Option v-for="item in hosts" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem>
          <Button type="primary" :loading="loading" @click="login('LoginFormData')">登录</Button>
      </FormItem>
  </Form>
</div>
</template>
<script>
    export default {
      data() {
        return {
          hosts: ['https://zhiz.xyz', 'http://127.0.0.1:5000'],
          pick_host: 'https://zhiz.xyz',
          LoginFormData: {
            username: '',
            passwd: ''
          },
          loading: false,
          ruleValidate: {
            username: [{
              required: true,
              message: '账号不能为空',
              trigger: 'blur'
            }],
            passwd: [{
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            }]
          }
        }
      },
      mounted() {
        const state = this.$route.query.state;
        if (state && state == 'expired') {
          this.$Message.warning({
                    content: '登录已过期',
                    duration: 3,
                    closable: true
                })
        }
      },
      methods: {
        login (name) {
          this.$store.commit('set_host', this.pick_host);
          this.axios.defaults.baseURL = this.pick_host;
          this.$refs[name].validate((valid) => {
              if (valid) {
                  this.loading = true;
                  let data = new FormData();
                  data.append('login_username', this.LoginFormData.username);
                  data.append('login_passwd', this.LoginFormData.passwd);
                  this.axios.post('/admin/login/', data
                    ).then((res) => {
                      if(res.data.code === 200) {
                        //this.axios.defaults.headers.token = res.data.token;
                        this.$store.commit('set_token', res.data.token);
                        this.$router.push({path:'/index/articles-list/'});
                      }else {
                        this.$Message.error('登录失败!');
                      }
                      this.loading = false;
                    }).catch((err) => {
                      this.loading = false;
                      console.log(err)
                      this.$Message.error('登录失败!');
                    })
              } else {
                  this.$Message.error('登录失败!');
              }
          })
        }
      }
    }
</script>
<style scope>
.login-form {
  width: 400px;
  margin: 0 auto;
}
</style>
