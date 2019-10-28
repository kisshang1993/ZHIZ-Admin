import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login'
import Index from '@/pages/Index'
import UserList from '@/components/UserList'
import ArticlesList from '@/components/ArticlesList'
import ArticleDetail from '@/components/ArticleDetail'
import CommentList from '@/components/CommentList'
import InvitationCode from '@/components/InvitationCode'
import Backup from '@/components/Backup'
import Support from '@/components/Support'



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/index',
      name: 'Index',
      component: Index,
      children:[
        { path: 'user-list', component: UserList },
        { path: 'articles-list', component: ArticlesList },
        { path: 'article-detail', component: ArticleDetail },
        { path: 'comments-list', component: CommentList},
        { path: 'invitation-code', component: InvitationCode },
        { path: 'backup', component: Backup },
        { path: 'support', component: Support }
      ]
    },

  ]
})
