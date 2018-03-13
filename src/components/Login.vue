<template>
	<div class="login">
		<div style="height: 15%;color: #FFFFFF;text-align: center;"></div>
		<div style="height: 50px;line-height:50px;color: #FFFFFF;text-align: center;width: 350px;margin: 0 auto;position: relative;margin-bottom: 30px;">
			<img style="display: inline-block;width: 35px;height: 45px;float:left;margin-left: 30px;padding-top: 5px;" src="../assets/jianong_friend.png" alt="" />
			<span style="font-size: 38px;float:left;margin-left: 20px;">嘉农伙伴平台</span>
		</div>
		<div class="login_main">
			<div>
				<div class="login_img"><img src="../assets/logo2.png" alt="" /></div>
				<Form ref="loginForm" :model="loginForm" :rules="ruleInline" class="login-form">
					<FormItem prop="user">
						<Input type="text" v-model="loginForm.user" placeholder="请输入用户名" style="text-align:left;padding:0;">
						<Icon type="android-person" slot="prepend" size='20'></Icon>
						</Input>
					</FormItem>
					<FormItem prop="password">
						<Input type="password" v-model="loginForm.password" placeholder="请输入密码" style="text-align:left;padding:0;">
						<Icon type="android-lock" slot="prepend" size='20'></Icon>
						</Input>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="handleSubmit('loginForm')" long>登录</Button>
					</FormItem>
				</Form>
			</div>
		</div>
	</div>
</template>

<script>
  import { loginTo } from '../api/api'
	export default {
		data() {
			return {
        is_admin: 0,
        ticket: "",
				loginForm: {
					user: '',
					password: ''
				},
				ruleInline: {
					user: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}
						//					,
						//						{
						//							type: 'string',
						//							min: 6,
						//							message: '密码最少6位数字或字母组成!',
						//							trigger: 'blur'
						//						}
					],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if(valid) {
						/*var inputCode = this.loginForm.code.toUpperCase();*/
						loginTo({
							username: this.loginForm.user,
							password: this.loginForm.password
						}).then(res => {
            if(res.retcode == 2000) {
              this.$store.state.loginStatus = true;
              this.$store.state.ticket = res.data.ticket;
              sessionStorage.setItem('ticket', res.data.ticket)
              sessionStorage.setItem('is_admin', res.data.is_admin)
              this.$router.push('/p/index')
					  	this.$Message.success('登录成功');
					  	sessionStorage.setItem('is_admin', res.data.is_admin)
              sessionStorage.setItem('user_id', res.data.id)
							this.ticket = sessionStorage.getItem('ticket')
							}else if(res.retcode == "3002"){
                this.$Message.info(res.msg);
              } else {
								this.$Message.error('用户名或者密码错误');
								}
							})
					}
				})

			},
			handleReset(name) {
				this.$refs[name].resetFields();
			},
		},
		mounted() {
      var that = this
      document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode==13){
                 that.handleSubmit('loginForm')
            }
      };
      this.ticket = sessionStorage.getItem('ticket')
      if(this.ticket != null) {
        this.$store.state.loginStatus = true;
        this.$router.push('/p/index')
      } else {
        this.$store.state.loginStatus = false;
        this.$router.push('/login')
      }
    }
	}
</script>

<style>
	.login {
		width: 100%;
		height: 100vh;
		background: url(../assets/crm_bg.jpg) no-repeat;
		background-size: cover;
	}

	.login_main {
		width: 320px;
		margin: 0 auto;
		/*		margin-top: 10%;*/
		height: 380px;
		background: #FFFFFF;
	}

	.login-form {
		padding: 0 30px;
	}

	.login_img {
		text-align: center;
		padding: 50px 0;
	}

	.login_img img {}
</style>
