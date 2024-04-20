<script setup >
import * as mockjs from "mockjs";

//  mockjs 假数据
let data1 = mockjs.mock({
    "data": "@cname()",
    "age": "@integer(1,100)",
    "addr": "@city(true)",
    "email": "@email(qq.com)",
})
// console.log(data1);

let data2 = mockjs.mock({
    "list|5": [
        {
            '邮箱': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            '汉字': /[\u4E00-\u9FA5]{3}/,
            '手机号': /^1[345789]\d{9}$/,
            'IP地址': /((25[0-5]|2[0-4]\d|[01]\d?)\.){3}(25[0-5]|2[0-4]\d|[01]\d?)/
        }
    ]
})
// console.log(data2);

let data3 = mockjs.mock({
    "code": 0,
    "data|3-5": [
        {
            "id|+1": "1",
            "name": "@cname()",
            "age": "@integer(1,100)",
            "addr": "@city(true)",
            "email": "@email(qq.com)",
        }
    ]
})
console.log(data3);

</script>

<template>
    <div>
        这是测试页面
    </div>
</template>

<style lang='scss' scoped></style>