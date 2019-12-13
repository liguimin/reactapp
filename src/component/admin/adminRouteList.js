/**
 * Created by Administrator on 2019/11/12.
 */

import Home from "./Home";
import User from '../user/User';
import Role from '../role/Role';
import Permission from '../permission/Index';

export default [
    //{
    //    title:'主页',
    //    path:'/admin/home',
    //    component:Home
    //},
    {
        title:'用户管理',
        path:'/admin/user',
        component:User
    },
    {
        title:'角色管理',
        path:'/admin/role',
        component:Role
    },
    {
        title:'权限管理',
        path:'/admin/permission',
        component:Permission
    },
];