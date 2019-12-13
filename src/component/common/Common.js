/**
 * Created by Administrator on 2019/7/10.
 */
//表格头部查询form的标签和输入框占比
const searchFormLayout={
   // labelAlign:'left',
    colon:false,
    labelCol:{
        xs: {
            span: 5
        },
        sm: {
            span: 5
        },
        md: {
            span: 8
        },
        lg: {
            span: 7
        },
        xl: {
            span: 5
        },
        xxl: {
            span: 5
        }
    },
    wrapperCol:{
        xs: {
            span: 19
        },
        sm: {
            span: 19
        },
        md: {
            span: 16
        },
        lg: {
            span: 17
        },
        xl: {
            span: 19
        },
        xxl: {
            span: 19
        }
    }
};

//表格头部查询form的col配置
const searchFormColConfig={
    xs: {
        span: 24
    },
    sm: {
        span: 24
    },
    md: {
        span: 12
    },
    lg: {
        span: 8
    },
    xl: {
        span: 8
    },
    xxl: {
        span: 6
    }
};

const searchFormConfig={
    labelAlign:'left'
};


//form表单layout
const formLayout={
    layout:'horizontal',
    labelCol: {span: 4},
    wrapperCol: {span: 18}
};

//列表的分页配置
const pagination = {
    pageSize:50,
    pageSizeOptions: ['10', '20', '30', '50', '100'],
    showLessItems: true,
    showSizeChanger: true,
    showQuickJumper: true,
};

export {
    searchFormLayout,
    searchFormColConfig,
    formLayout,
    searchFormConfig,
    pagination
};