<style>
  .ivu-modal-wrap .ivu-modal {
    top: 35%;
  }
</style>
<template>
	<div>
		<topheader></topheader>
		<div style="clear: both;margin-top: 70px;">
			<div class="layout-content">
				<Row>
					<Col span="3" class="nav_bor">
					<Menu width="auto" :active-name="active_name" :open-names="['1','2','3','4']">
						<Submenu name="1">
							<template slot="title">
								<!--<Icon type="ios-navigate"></Icon>-->
								文件
							</template>
							<router-link v-for='(nav,index) in nav_list' :to='nav.to' style='color: #333;' :key="nav.name">
								<!--<MenuItem :name="nav.name" v-if='index==1' @click='reLogin'>
								<Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
								</MenuItem>-->
								<MenuItem :name="nav.name" @click.native="nav.handler">
								<Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
								</MenuItem>
							</router-link>
						</Submenu>
					</Menu>
					</Col>
					<Col span="21" style="height:1200px;overflow-y:scroll">
					<router-view></router-view>
					</Col>
				</Row>
			</div>
		</div>
    <Modal
        title="退出登录"
        v-model="logoutStatus"
        class-name="vertical-center-modal"
        :mask-closable="false"
        @on-ok="loginout"
        @on-cancel="cancel">
        <p style="color:rgb(51,110,218);font-size:25px">请确认是否退出登录？</p>
    </Modal>
	</div>
</template>
<script>
	import topheader from '../common/header'
	export default {
		components: {
			topheader
		},
		methods: {
      loginout(){
        sessionStorage.removeItem('ticket')
        sessionStorage.removeItem('is_admin')
        this.$router.push("/login")
      },
      cancel(){
        this.logoutStatus = false;
      }
		},
		mounted() {
			this.nav_list.forEach((item, index) => {
				if(item.to == this.$route.path) {
					this.active_name = item.name;
				}
			})
		},
		data() {
			return {
        logoutStatus: false,
				nav_list: [{
						to: '/p/index',
						name: '1-1',
						text: '首页',
						icon: 'ios-home',
            handler:function(){}
					},
					{
						to: '',
						name: '1-2',
						text: '退出登录',
						icon: 'refresh',
            handler:() => {
              /*console.log(this.logoutStatus)*/
              this.logoutStatus = true
            }
					},
				/*	{
						to: '/p/revisepassword',
						name: '1-3',
						text: '修改密码',
						icon: 'key',
            handler:function(){}
					}*/
				],
				active_name: "1-1",
			}
		}
	}
</script>
