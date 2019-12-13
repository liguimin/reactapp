/**
 * Created by Administrator on 2019/5/22.
 */

//判断是否函数
export function isFunction(obj){
    return Object.prototype.toString.call(obj)=="[object Function]";
}