/**
 * Created by Administrator on 2019/10/25.
 */
//是否公共菜单
const IS_PUBLIC = {
    NO: '0',
    YES: '1'
};
const IS_PUBLIC_NAMES = {
    [IS_PUBLIC.NO]: '私有菜单',
    [IS_PUBLIC.YES]: '公共菜单',
};


//状态
const STATES = {
    DISABLED:'0',
    ENABLED: '1'
};
const STATES_NAME = {
    [STATES.ENABLED]: '启用',
    [STATES.DISABLED]: '禁用',
};


//是否节点
const IS_NODE = {
    YES: '1',
    NO: '0'
};
const IS_NODE_NAMES = {
    [IS_NODE.YES]: '是',
    [IS_NODE.NO]: '否'
};


export {
    IS_PUBLIC,
    IS_PUBLIC_NAMES,
    STATES,
    STATES_NAME,
    IS_NODE,
    IS_NODE_NAMES
}