<template>
  <div class="login_container">

    <div class="login_box">
      <div class="system_title">
        实验仪器共享平台
      </div>
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef"
               :model="loginForm"
               :rules="loginFormRules"
               label-width="0px"
               class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    prefix-icon="iconfont icon-3702mima"
                    type="password"></el-input>
        </el-form-item>
        <el-link type="primary"
                 @click="resetPasswordDialog">忘记密码？</el-link>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button @click="addDialogVisible = true">注册</el-button>
        </el-form-item>
      </el-form>

    </div>
    <a href="http://www.beian.miit.gov.cn"
       class="footer">闽ICP备20002687号-1</a>
    <!-- 注册用户的对话框 -->
    <el-dialog title="注册"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="mail">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="单位"
                      prop="unit">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="学号"
                      prop="studyNum">
          <el-input v-model="addForm.studyNum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="regist">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 控制注册对话框的显示与隐藏
      addDialogVisible: false,
      // 注册表单
      addForm: {
        name: '',
        password: '',
        mail: '',
        phone: '',
        unit: '',
        studyNum: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 监听注册用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，注册新用户
    regist () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起注册用户的网络请求
        const { data: res } = await this.$http.post('roles/register', this.addForm)

        if (res.code !== 200) {
          let resStr = ''
          if ((res.data & 0x01) !== 0) {
            resStr += '用户名 '
          }
          if ((res.data & 0x02) !== 0) {
            resStr += '邮箱 '
          }
          if ((res.data & 0x04) !== 0) {
            resStr += '手机 '
          }
          if ((res.data & 0x08) !== 0) {
            resStr += '学号 '
          }
          resStr += '已被注册！'
          return this.$message.error(resStr)
        }
        this.$message.success('帐号注册成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        this.loginForm.username = this.addForm.name
        this.loginForm.password = this.addForm.password
      })
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login/user', this.loginForm, { emulateJSON: true })
        if (res.code !== 200) return this.$message.error('帐号或密码不正确!')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', 'Bearer ' + res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    },
    // 忘记密码? 打开重置密码对话框
    resetPasswordDialog () {

    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -20%);
  .system_title {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: rgb(228, 210, 210);
    font-size: 50px;
    line-height: 100px; /*设置line-height与父级元素的height相等*/
    text-align: center; /*设置文本水平居中*/
    position: absolute;
    left: 50%;
    width: 800px;
    transform: translate(-50%, -190%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
.footer {
  position: absolute;
  bottom: 0;
  color: #fff;
  transform: translate(0, -50px);
  width: 100%;
  height: 10px;
  text-align: center;
}
</style>
