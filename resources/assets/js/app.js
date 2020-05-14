
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import Swal from "sweetalert2";

require('./bootstrap');

window.Vue = require('vue');

import moment from 'moment';

import { Form, HasError, AlertError } from 'vform';
window.Form = Form;

import Gate from './Gate'
Vue.prototype.$gate = new Gate(window.user);


Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueProgressbar from 'vue-progressbar'

import swal from 'sweetalert2'
window.swal = swal;



//toaster
const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000

});

window.toast = toast;





Vue.use(VueProgressbar,{
    color:'rgb(143,255,199)',
    failedColor:'red',
    height:'4px'
})




import VueRouter from 'vue-router'

Vue.use(VueRouter)



//routes
let routes = [
    { path: '/dashboard', component:require('./components/Dashboard.vue')},
    { path: '/profile', component: require('./components/Profile.vue')},
    { path: '/users', component: require('./components/Users.vue')},
    { path: '/developer', component: require('./components/Developer.vue')},
    { path: '*', component: require('./components/NotFound.vue')},

]



//passport components
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue')
);

Vue.component('pagination', require('laravel-vue-pagination'));




const router = new VueRouter({
    mode:'history',
    routes // short for `routes: routes`
})

window.Fire = new Vue();

Vue.filter('upText',function(text){
    return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('myDate',function(created){
   return moment(created).format('MMMM Do YYYY');
});
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));





const app = new Vue({
    el: '#app',
    router,
    data:{
        search:''
    },
    methods:{
        searchit:_.debounce(() =>{
            Fire.$emit('searching');
        },1000),

        printme(){
            window.print();
        }

    }

});
