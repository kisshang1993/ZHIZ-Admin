<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
/* .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
} */
.layout-title{
    height: 30px;
    line-height: 30px;
    float: left;
    color: #FFF;
    font-size: 24px;
    position: relative;
    top: 17px;
    left: -20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <!-- <div class="layout-logo"></div> -->
                    <div class="layout-title">
                       HLDPIC ADMIN
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            Item 2
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                            Item 4
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                内容管理
                            </template>
                            <MenuItem name="1-1" to='/index/user-list/'>
                                <Icon type="md-people" />
                                用户管理
                            </MenuItem>
                            <MenuItem name="1-2" to='/index/articles-list/'>
                                <Icon type="md-document" />
                                文章管理
                            </MenuItem>
                            <MenuItem name="1-3" to='/index/comments-list/'>
                                <Icon type="md-chatbubbles" />
                                评论管理
                            </MenuItem>
                            <MenuItem name="1-4" to='/index/invitation-code/'>
                                <Icon type="md-battery-charging" />
                                邀请码
                            </MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                工具集
                            </template>
                            <MenuItem name="2-1" to="https://www.iloveimg.com/zh-cn/watermark-image" target="_blank">
                                <Icon type="ios-link" />
                                添加水印
                            </MenuItem>
                            <MenuItem name="2-2" to="https://www.iloveimg.com/zh-cn/watermark-image" target="_blank">
                                <Icon type="ios-link" />
                                微博图床
                            </MenuItem>
                            <MenuItem name="2-3" to="https://sm.ms/" target="_blank">
                                <Icon type="ios-link" />
                                sm.ms图床
                            </MenuItem>
                            <MenuItem name="2-4" to="https://www.superbed.cn/" target="_blank">
                                <Icon type="ios-link" />
                                聚合图床
                            </MenuItem>
                            <MenuItem name="2-5" to="https://portal.qiniu.com/bucket/hldpic-oss/resource" target="_blank">
                                <Icon type="ios-link" />
                                七牛云存储
                            </MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                维护
                            </template>
                            <MenuItem name="3-1" to='/index/backup/'>备份</MenuItem>
                            <MenuItem name="3-2" to='/index/support/'>辅助功能</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '24px'}">
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff', position: 'relative'}">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
        
    }
</script>
