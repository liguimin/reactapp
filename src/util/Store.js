/**
 * Created by Administrator on 2019/5/23.
 */
function store() {

}

store.get = function (key) {
    return localStorage.getItem(key);
};

store.set= function (key,val) {
    return localStorage.setItem(key,val);
}

store.delete=function(key){
    return localStorage.removeItem(key);
}

export default store;
