import Userdetail from './template.vue';

const GetUserDetail = {};


GetUserDetail.install = function (Vue, id) {
    
    const GetUserDetailInstance = Vue.extend(Userdetail);
    const initInstance = (id) => {
        // 实例化vue实例
        let currentBox = new GetUserDetailInstance();
        currentBox.id = id;
        let msgBoxEl = currentBox.$mount().$el;
        document.body.appendChild(msgBoxEl);
    };

    // 4. 添加实例方法
    Vue.prototype.$GetUserDetail = function (id) {
        initInstance(id);
    }
}

export default GetUserDetail;