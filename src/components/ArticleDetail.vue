<style scope>
.fix-formitem {
  min-height: 34px;
}
.fix-input-width .ivu-form-item{
  width: 40%;
}
.fix-upload {
  display: inline-block;
}
.ckeditor-style {
  width: 700px;
  min-height: 500px;
}
.ckeditor-style P{
  margin: 0 !important;
}
.hide-area {
  padding-top: 20px;
  padding-right: 10px;
  margin-bottom: 20px;
  border: 1px dashed #c4c4c4;
}
</style>
<template>
  <div class="user-list">
    <div class="button-header">
      <h1>{{type_title}}</h1>
    </div>
    <Form :label-width="120" ref="article" :model="article" :rules="articleValidate" >
      <Row>
        <Col span="12">
          <!-- 正文 -->
          <div class="ckeditor-style">
            <textarea name="editor1" id="editor1" rows="10" cols="80">
                {{article.content}}
            </textarea>
          </div>
        </Col>
        <Col span="12">
          <!-- 标题 -->
          <FormItem label="标题" prop="title"> 
              <Input v-model="article.title" placeholder="最大50字节"></Input>
          </FormItem>
          <!-- 副标题 -->
          <FormItem label="副标题" prop="subtitle">
              <Input v-model="article.subtitle" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="最大150字节"></Input>
          </FormItem>
          <!-- 预览图 -->
          <FormItem
                  v-for="(item,index) in article.perview"
                  :key="index"
                  :label="'预览图 ' + (index+1)">
              <Row style="position:relative">
                  <Col span="10">
                      <Input type="text" v-model="item.path" placeholder="粘贴网络图片地址或者本地上传"></Input>
                  </Col>

                  <Col span="10" offset="1">
                      <Upload 
                        action="/admin/upload/"
                        :before-upload="(file)=>{handleUpload(file, index)}"
                        :format="['jpg','jpeg','png','gif','bmp']" 
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleOverSize"
                        class="fix-upload"
                      >
                          <Button icon="ios-cloud-upload-outline">上传本地图片</Button>
                      </Upload>
                      <Button @click="handleRemove(index)">删除此项</Button>
                  </Col>
              </Row>
          </FormItem>
          <FormItem>
              <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAddPerview" icon="md-add">添加预览</Button>
                </Col>
              </Row>
          </FormItem>
          <!-- 标签 -->
          <FormItem label="文章标签" class="fix-formitem">
            <div v-if="article.tags.length">
              <Tag color="success" v-for="item in article.tags" :key="item.id" :name="item.id" closable @on-close="handleTagRemove">{{ item.name }}</Tag>
            </div>
            <div v-else style="color:#c5c8ce;line-height:34px">暂无标签</div>
          </FormItem>
          <FormItem>
              <Row>
                  <Col span="12">
                      <Button type="dashed" long @click="handleAddTag" icon="md-add">添加标签</Button>
                  </Col>
              </Row>
          </FormItem>
          <div class="hide-area">
            <!-- 隐藏域 -->
            <FormItem label="隐藏域" prop="hide">
                <Input v-model="article.hide" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="文章隐藏信息"></Input>
            </FormItem>
            <!-- 隐藏域 阅读权限 -->
            <FormItem label="隐藏域阅读级别" prop="hide_level">
              <Select v-model="article.hide_level" :style="'width:200px;color:'+hide_level_quality_color" @on-change='handleSelectChange'>
                  <Option v-for="item in quality" :value="item.id" :key="item.id" :style="'color:' + item.color">{{ item.text }}</Option>
              </Select>
            </FormItem>
          </div>
          <!-- 文章 阅读权限 -->
          <FormItem label="文章阅读级别" prop="level">
            <Select v-model="article.level" :style="'width:200px;color:'+level_quality_color" @on-change='handleLevelSelectChange'>
                <Option v-for="item in quality" :value="item.id" :key="item.id" :style="'color:' + item.color">{{ item.text }}</Option>
            </Select>
          </FormItem>
          <Divider />
          <!-- 设置 -->
          <FormItem label="辅助功能">
            <Button size="large" @click="handleAutoFill">自动填充预览</Button>
            <Button size="large" @click="showAddMult">插入多张图片</Button>
            <Button size="large" @click="inserA">插入超链接</Button>
          </FormItem>
          <!-- 提交 -->
          <FormItem label="控制">
            <Button type="primary" size="large" icon="md-git-commit" @click="handleCommit('article')">提交</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <!-- Tags Model -->
    <Modal v-model="tag_modal" draggable title="点击标签设置为文章标签">
        <div>
          <Tag color="blue" v-for="item in tags" :key="item.id" checkable :name="item.id" @on-change="handleTagCheck">{{ item.name }}</Tag>
        </div>
        <Divider />
        <div>
          <Form inline>
            <FormItem>
                <Input v-model="new_tag" placeholder="请输入标签名"></Input>
            </FormItem> 
            <FormItem>
                <Button type="primary" :loading="tag_add_loading"  @click="handleAddTagCommit">新建标签</Button>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button @click="tag_modal=false">关闭</Button>
        </div>
    </Modal>
    <!-- Insert Images -->
    <Modal
        title="图片链接"
        v-model="multImages_show"
        @on-ok="handleAddMult"
    >
        <Input v-model="multImages" type="textarea" :rows="10" placeholder="每行一条" />
    </Modal>
    <!-- Loading -->
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type_title: '添加文章',
      loading: false,
      article: {
        id: 0,
        autofill: false,
        title: '',
        subtitle: '',
        perview: [
          {path: ''}
        ],
        tags: [],
        content: '',
        hide: '',
        hide_level: 0,
        level: 0
      },
      quality: [
        {id: 0, text: '普通', color: '#515a6e'},
        {id: 1, text: '优秀', color: '#26a65b'},
        {id: 2, text: '稀有', color: '#0081ff'},
        {id: 3, text: '史诗', color: '#c600ff'},
        {id: 4, text: '传说', color: '#ff8000'}
      ],
      hide_level_quality_color: '#515a6e',
      level_quality_color: '#515a6e',
      tag_modal: false,
      tag_add_loading: false,
      new_tag: '',
      tags: [],
      multImages_show: false,
      multImages: '',
      articleValidate: {
        title: [
          {required: true, message: '文章标题不能为空', trigger: 'blur'},
          {type: 'string', min: 2, max: 50,  message: '文章标题字数为2~50字符之间', trigger: 'blur'}],
        subtitle: [{type: 'string', max: 150,  message: '文章副标题字数最大150字符', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    //初始化编辑器
    //判断新增或编辑
    const query_id = this.$route.query.id;
    if (query_id) {
      this.loading = true;
      this.type_title = '编辑文章';
      this.axios.get('/admin/article-control/?id='+query_id)
      .then((res) => {
        if(res.data.code == 200) {
            this.loading = false;
            this.article.id = res.data.data.id;
            this.article.title = res.data.data.title;
            this.article.subtitle = res.data.data.subtitle;
            this.article.content = res.data.data.content;
            this.article.hide = res.data.data.hide;
            this.article.hide_level = res.data.data.hide_level;
            this.article.level = res.data.data.level;
            this.article.perview = res.data.data.perview;
            this.article.tags = res.data.data.tags;
            this.initCKEditor();
        }else {
          this.$Message.error({
            content: res.data.msg,
            onClose: () => {
              this.$router.push({path:'/index/article-list/'});
            }
          });
        }
        
      })
    }else this.initCKEditor();
    //获取标签列表
    this.axios.get('/admin/tags-list/')
    .then((res) => {
      this.tags = res.data.data;
    });
    this.handleSelectChange(this.article.hide_level);
    this.handleLevelSelectChange(this.article.level);
  },
  methods: {
    initCKEditor () {
        CKEDITOR.replace('editor1', {
          height: 700,
          filebrowserUploadUrl: this.$store.state.baseURL + '/admin/ckupload/',
          fileTools_requestHeaders: {
            'token': this.$store.state.token
          },
          
          allowedContent: true,
        });
    },
    handleAutoFill () {
      //填充副标题
      if(this.article.subtitle == '') {
        let content = CKEDITOR.instances.editor1.getData();
        content = content.replace(/<\/?.+?>/g,"");
        content = content.replace(/&nbsp;/ig, "");
        content = content.replace(/[\r\n]/g, "");
        this.article.subtitle = content.substr(0, 120);
      }
      //填充预览图
      if(this.article.perview.length < 3) {
        let content = CKEDITOR.instances.editor1.getData();
        content = content.replace(/<(?!img).*?>/g, '');
        let start = 0;
        let needs = 3;
        for(let p of this.article.perview) {
          if(p.path != '') needs--;
        }
        if (needs == 3) {
          this.article.perview = [];
        }
        for (let i=0;i<needs;i++) {
          let s = content.indexOf('src="', start);
          if (s > -1) {
            s += 5;
            let e = content.indexOf('"', s);
            if (e > -1) {
              start = e;
              this.article.perview.push({path: content.substring(s, e)});
            } else {
              break;
            }
          }
          
        }

      }
    },
    showAddMult () {
      this.multImages_show = true;
    },
    handleAddMult () {
      const origin_data = CKEDITOR.instances.editor1.getData();
      const urls = this.multImages.split('\n');
      let data = '';
      for (let url of urls) {
        if (url == '') continue;
        data += `<p style="text-align:center;"><img alt="" src="${url}" /></p>\n<p>&nbsp;</p>`;
      }
      const append = origin_data + data;
      CKEDITOR.instances.editor1.setData(append);
      this.multImages = '';
    },
    inserA () {
      const origin_data = CKEDITOR.instances.editor1.getData();
      let data = '';
      let link = prompt('Link');
      if(link) {
        data = `<p><a href="${link}" target="_blank">${link}</a></p>`;
        const append = origin_data + data;
        CKEDITOR.instances.editor1.setData(append);
      }
    },
    handleAddPerview () {
      if(this.article.perview.length >= 3) {
        this.$Message.warning('最多支持3张预览图');
        return;
      }
      this.article.perview.push({path: ''});
    },
    handleSelectChange (id) {
      for (let q of this.quality) {
        if (q.id === id) this.hide_level_quality_color = q.color;
      }
    },
    handleLevelSelectChange (id) {
      for (let q of this.quality) {
        if (q.id === id) this.level_quality_color = q.color;
      }
    },
    handleFormatError () {
      this.$Message.error(`仅支持'jpg','jpeg','png','gif','bmp'的图片`);
    },
    handleOverSize () {
      this.$Message.error(`图片大小不得超过2M`);
    },
    handleRemove (index) {
      this.article.perview.splice(index, 1);
    },
    handleUpload (file, index){
      let data = new FormData();
      data.append('file', file)
      this.axios.post('/admin/upload/', data
        ).then((res) => {
          if(res.data.code === 200) {
            let temp_file = res.data.data;
            this.article.perview[index].path = temp_file;
          }else {
            this.$Message.error(res.data.msg);
          }
        })
    },
    handleAddTag () {
      this.tag_modal = true;
    },
    handleAddTagCommit () {
      if(this.new_tag == '') {
        this.$Message.error('标签名不能为空');
        return;
      }
      this.tag_add_loading = true;
      this.axios.post('/admin/tags-list/',{
        tag_name: this.new_tag
      },)
      .then((res) => {
        this.tag_add_loading = false;
        if(res.data.code == 200) {
          this.tags.push(res.data.data);
        }else {
          this.$Message.error(res.data.msg);
        }
      })
    },
    handleTagCheck (checked, name) {
      let has_repeat = false;
      for(let t of this.tags) {
        if (t.id === name) {
          for(let a_t of this.article.tags) {
            if (a_t.id == name) has_repeat = true;
          }
          if(!has_repeat) this.article.tags.push(t);
        }
      }
    },
    handleTagRemove (event, name) {
      let index = 0;
      for(let a_t of this.article.tags) {
        if (a_t.id == name) break;
        index++;
      }
      this.article.tags.splice(index, 1);
    },
    handleCommit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.article.content = CKEDITOR.instances.editor1.getData();
            this.axios.post('/admin/article-control/', this.article)
            .then((res) => {
              this.loading = false;
              if(res.data.code === 200) {
                this.$Message.success('提交成功');
                this.$router.push({path:'/index/articles-list/'});
              }else {
                this.$Message.error(res.data.msg);
              }
            });
          } else {
              this.$Message.error('表单有误，请检查!');
          }
      })
    }
    
  },
}
</script>
<style scoped>

</style>
