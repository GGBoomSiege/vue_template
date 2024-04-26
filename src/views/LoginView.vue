<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="username">
          <el-input placeholder="请输入账号" v-model="formData.username" size="large" type="text">
            <template #prefix>
              <el-icon>
                <i-ep-user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="formData.password" size="large" type="password">
            <template #prefix>
              <el-icon>
                <i-ep-lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="check-code-panel">
            <div class="row">
              <el-input placeholder="请输入验证码" v-model="formData.checkCode" size="large" @keyup.enter.native="login()"></el-input>
              <!-- 使用验证码组件 -->
              <div class="code" @click="refreshCode">
                <SIdentify :identifyCode="identifyCode"></SIdentify>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-checkbox label="记住密码" name="type" />
        </el-form-item> -->
        <el-form-item label="">
          <el-button type="primary" style="width: 100%" @click="login()" size="large">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
// 自动导入vue相关函数, ref,reactive等
// import { ref, reactive, } from 'vue'
// Element-Plus的依赖采用的是自动导入，所以这里无需显示的引入，其他地方的element-plus引用同理
import { ElMessage } from "element-plus";
import request from "@/utils/request"; //这里使用自行封装的axios，下文已给出，照搬后修改运行端口即可
import SIdentify from "@/views/Sidentify.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

// const checkCodeUrl = "api/checkCode?" + new Date().getTime();
//表单
const formDataRef = ref();
let formData = reactive({
  username: "",
  password: "",
  checkCode: "",
});
const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};

const router = useRouter();

let identifyCode = ref(""); //图形验证码
let identifyCodes = ref("1234567890abcdefjhijklinopqrsduvwxyz"); //验证码出现的数字和字母

const login = () => {
  //验证验证码不为空
  if (!formData.checkCode) {
    ElMessage({ type: "error", message: "验证码不能为空！" });
    return;
  }

  var form_obj = JSON.parse(JSON.stringify(formData));
  // console.log(form_obj);
  // console.log(form_obj.username);
  // console.log(form_obj.password);

  request.post("/user/login", form_obj).then((res) => {
    if (formData.checkCode != identifyCode.value) {
      ElMessage({ type: "error", message: "验证码错误" });
      refreshCode();
      return;
    } else {
      if (formData.username === res.data.username && formData.password === res.data.password) {
        ElMessage({
          message: "登录成功",
          type: "success",
        });

        let tokenObj = { token: " isLogin", startTime: new Date().getTime() };
        window.localStorage.setItem("isLogin", JSON.stringify(tokenObj));
        localStorage.setItem("username", JSON.parse(JSON.stringify(formData.username)));

        // console.log(res);

        // 登录验证成功跳转到根路径
        router.push("/");
      } else {
        ElMessage.error("账号或密码错误！！！登录失败！！！");
        refreshCode();
      }
    }
  });
};

//组件挂载

onMounted(() => {
  identifyCode.value = "";

  makeCode(identifyCodes.value, 4);
});

// 生成随机数

const randomNum = (min, max) => {
  // max = max + 1

  // return Math.floor(Math.random() * (max - min) + min)

  // 参数校验
  if (typeof min !== "number" || typeof max !== "number" || min >= max) {
    throw new Error("Invalid parameters for randomNum function");
  }
  // 使用解构赋值简化代码
  [min, max] = [Math.ceil(min), Math.floor(max)];
  // 生成随机数
  return Math.round(Math.random() * (max - min) + min);
};

// 随机生成验证码字符串

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += o[randomNum(0, o.length - 1)];
  }
  // console.log(identifyCode.value)
};

// 更新验证码

const refreshCode = () => {
  identifyCode.value = "";

  makeCode(identifyCodes.value, 4);
};
</script>

<style lang="scss" scoped>
.login-body {
  background: url("../assets/bg.png") no-repeat center center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: absolute;
  left: 0;
  top: 0;

  .login-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    padding: 25px;
    width: 26%;
    min-width: 460px;
    height: 30%;
    min-height: 350px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5%;
    box-shadow: 2px 2px 10px #ddd;

    .login-title {
      font-size: 22px;
      color: #a8abb2;
      text-align: center;
      margin-top: 2px;
      margin-bottom: 28px;
    }
  }
}

.row {
  display: flex;
  align-items: center;
  /* 或其他合适的对齐方式 */
  overflow: hidden;
  /* 添加 overflow 属性 */
}

/* 可以为每个元素设置一些样式以调整它们的位置和大小 */
.el-form-item {
  margin-right: 10px;
  /* 间距调整 */
  height: auto;
}

.code {
  margin-left: 10px;
  height: 38px;
  /* 间距调整 */
  width: 580px;
}
</style>
