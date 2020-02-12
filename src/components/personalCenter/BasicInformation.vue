<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div class="top_button">

        <el-button icon="el-icon-edit"
                   type="primary">微信绑定</el-button>
        <el-button icon="el-icon-edit"
                   type="primary"
                   @click="showEditDialog">编辑</el-button>
        <el-button icon="el-icon-edit"
                   type="primary"
                   @click="editPasswordDialogVisible=true">修改密码</el-button>
      </div>
      <div class="hr-line-dashed"></div>
      <div>
        <el-row :gutter="20"
                style="margin-top: 30px;">
          <el-col :span="2"
                  class="first_column">
            用户名
          </el-col>
          <el-col :span="10"
                  class="second_column">
            {{userInfo.username}}
          </el-col>
        </el-row>
        <div class="hr-line-dashed"></div>
        <el-row :gutter="20">
          <el-col :span="2"
                  class="first_column">
            电话
          </el-col>
          <el-col :span="10"
                  class="second_column">
            {{userInfo.phone}}
          </el-col>
        </el-row>
        <div class="hr-line-dashed"></div>
        <el-row :gutter="20">
          <el-col :span="2"
                  class="first_column">
            邮箱
          </el-col>
          <el-col :span="10"
                  class="second_column">
            {{userInfo.mail}}
          </el-col>
        </el-row>
        <div class="hr-line-dashed"></div>
        <el-row :gutter="20">
          <el-col :span="2"
                  class="first_column">
            单位
          </el-col>
          <el-col :span="10"
                  class="second_column">
            {{userInfo.unit}}
          </el-col>
        </el-row>
        <div class="hr-line-dashed"></div>
        <el-row :gutter="20">
          <el-col :span="2"
                  class="first_column">
            学号
          </el-col>
          <el-col :span="10"
                  class="second_column">
            {{userInfo.studyNum}}
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="修改信息"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="mail">
          <el-input v-model="editForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="单位"
                      prop="unit">
          <el-input v-model="editForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="学号"
                      prop="studyNum">
          <el-input v-model="editForm.studyNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码的对话框 -->
    <el-dialog title="修改密码"
               :visible.sync="editPasswordDialogVisible"
               width="50%"
               @close="editPasswordDialogClosed">
      <el-form :model="editPasswordForm"
               :rules="editPasswordFormRules"
               ref="editPasswordFormRef"
               label-width="70px"
               label-position="top">
        <el-form-item label="原密码"
                      prop="password">
          <el-input v-model="editPasswordForm.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-input v-model="editPasswordForm.newPassword"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="newPasswordConfirm">
          <el-input v-model="editPasswordForm.newPasswordConfirm"
                    type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updatePassword">确 定</el-button>
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
      userInfo: {},
      // 获取收藏列表的参数对象
      queryInfo: {
        // 仪器名称
        machineName: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      favoriteList: [],
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        password: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editPasswordDialogVisible: false,
      editPasswordForm: {},
      editPasswordFormRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        newPasswordConfirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getUserInfoList()
  },
  methods: {
    // 获取用户信息列表
    async getUserInfoList () {
      const { data: res } = await this.$http.get('roles/usersInfo')
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败！')
      }
      this.userInfo = res.data[0]
    },
    // 展示编辑用户的对话框
    showEditDialog () {
      // console.log(id)
      this.editForm = this.userInfo
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'roles/usersInfo/',
          {
            mail: this.editForm.mail,
            phone: this.editForm.phone,
            studyNum: this.editForm.studyNum,
            unit: this.editForm.unit
          }
        )
        if (res.code !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserInfoList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    editPasswordDialogClosed () {
      this.$refs.editPasswordFormRef.resetFields()
    },
    // 更改密码
    updatePassword () {
      this.$refs.editPasswordFormRef.validate(async valid => {
        if (!valid) return
        if (this.editPasswordForm.newPassword !== this.editPasswordForm.newPasswordConfirm) {
          return this.$message.error('两次输入的密码不一致！')
        }
        const { data: res } = await this.$http.put(
          'roles/password/',
          {
            password: this.editPasswordForm.password,
            newPassword: this.editPasswordForm.newPassword
          }
        )
        if (res.code === 50002) {
          return this.$message.error('原密码有误！')
        } else if (res.code !== 200) {
          return this.$message.error('修改密码失败！')
        }
        // 关闭对话框
        this.editPasswordDialogVisible = false
        // 提示修改成功
        this.$message.success('修改密码成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.top_button {
  display: flex;
  justify-content: flex-end;
  // padding: 20px 20px;
}
.first_column {
  color: #817f7f;
  text-align: right;
  padding: 5px 7px 0px 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
.second_column {
  color: #333333;
  font-size: 14px;
  line-height: 20px;
  padding: 5px 7px 5px 0;
  display: inline-block;
}
.hr-line-dashed {
  border-top: 1px dashed #e7eaec;
  color: #ffffff;
  background-color: #ffffff;
  height: 1px;
  margin: 8px 0;
}
</style>
