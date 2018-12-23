// 验证上传数据都不为空
function checkedQuery(queryObj) {
    for (let i in queryObj) {
        if (typeof queryObj[i] === 'string' && !queryObj[i]) {
            return false;
        }
    }
    return true;
}
//验证数据完整，无丢失（多条属性验证）
function isExistKeys(obj, attrarr) {
    for (let i = 0; i < attrarr.length; i++) {
        if (!obj.hasOwnProperty(attrarr[i])) {
            return false;
        }
    }
    return true;
}
//单条属性验证
function isExistKey(obj, attr) {
    return obj.hasOwnProperty(attr) ? true : false;
}
//数组转化为字符串
function joinArr(arr, flag = ',') {
    let str = arr.join(flag);
    return str;
}
// 对象属性值转化为字符串
function joinObj(obj, flag = ',') {
    let str = '';
    for (let i in obj) {
        str += `'${obj[i]}'${flag}`;
    }
    str = str.slice(0,-1);
    return str;
}


module.exports = {
    checkedQuery,
    isExistKeys,
    isExistKey,
    joinArr,
    joinObj,
};
