/**
 * Created by Administrator on 2019/7/10.
 */
//获取上传文件的显示路径
const getBase64=(img,callback)=>{
    let reader=new FileReader();
    reader.addEventListener("load",()=>callback(reader.result));
    reader.readAsDataURL(img);
};

//获取枚举列表的索引和名称
const getNameList=(list)=>{
    let result={};
    for (let k in list){
        result[list[k].index]=list[k].name;
    }
    return result;
};

//获取枚举列表的名称
const getName=(list,index,defaultVal='')=>{
    for (let k in list){
        if (list[k].index==index){
            return list[k].name;
        }
    }
    return defaultVal;
};

//判断对象是否为空
const objIsEmpty=(obj)=>{
    if (Object.keys(obj).length==0){
        return true;
    }
    return false;
};


export {
    getBase64,
    getNameList,
    getName,
    objIsEmpty
}