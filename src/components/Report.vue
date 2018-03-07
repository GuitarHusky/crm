<template>
	<div class="report">
		<pheader></pheader>
		<div style="clear: both;margin-top: 70px;">
			<div class="layout-content">
				<Row>
					<Col span="3" class="nav_bor">
					<Menu width="auto" :active-name="active_name" :open-names="['1','2','3','4']" accordion>
						<Submenu name="1">
							<template slot="title">
								<!--<Icon type="ios-navigate"></Icon>-->
								销售日报表
							</template>
							<router-link v-for='(nav,index) in nav_list' :to='nav.to' style='color: #333;' :key="nav.name">
								<MenuItem :name="nav.name">
								<Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
								</MenuItem>
							</router-link>
						</Submenu>
						<Submenu name="2">
							<template slot="title">
								<!--<Icon type="ios-navigate"></Icon>-->
								销售月报表
							</template>
							<router-link v-for='(nav,index) in nav_list1' :to='nav.to' style='color: #333;'  :key="nav.name">
								<MenuItem :name="nav.name">
								<Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
								</MenuItem>
							</router-link>
						</Submenu>
						<Submenu name="3">
              <template slot="title">
                <!-- <Icon type="ios-navigate"></Icon> -->
                库存报表
              </template>
              <router-link v-for='(nav,index) in nav_list2' :to='nav.to' style='color: #333;'  :key="nav.name">
                <MenuItem :name="nav.name">
                <Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
                </MenuItem>
              </router-link>
            </Submenu>
						<Submenu name="4">
							<template slot="title">
								<!--<Icon type="ios-navigate"></Icon>-->
								资金报表
							</template>
							<router-link v-for='(nav,index) in nav_list3' :to='nav.to' style='color: #333;' :key="nav.name">
								<MenuItem :name="nav.name">
								<Icon style="display: inline-block;width: 20px;" size='16' :type="nav.icon"></Icon> <span v-html='nav.text'></span>
								</MenuItem>
							</router-link>
						</Submenu>
					</Menu>
					</Col>
					<Col span="21" style="height:1200px;overflow-y:scroll;">
					<router-view></router-view>
					</Col>
				</Row>
			</div>
		</div>
	</div>
</template>

<script>
	import pheader from '../common/header'
	export default {
		data() {
			return {
				active_name: "1-1",
				nav_list: [{
					to: '/r/saleday-goods',
					name: '1-1',
					text: '日报表(商品)',
					icon: 'clipboard'
				}, {
					to: '/r/saleday-user',
					name: '1-2',
					text: '日报表(客户)',
					icon: 'clipboard'
				}, {
					to: '/r/saleday-store',
					name: '1-3',
					text: '日报表(仓库)',
					icon: 'clipboard'
				}, {
					to: '/r/saleday-man',
					name: '1-4',
					text: '日报表(业务员)',
					icon: 'clipboard'
				}],
				nav_list1: [{
					to: '/r/salemonth-goods',
					name: '2-1',
					text: '月报表(商品)',
					icon: 'clipboard'
				}, {
					to: '/r/salemonth-user',
					name: '2-2',
					text: '月报表(客户)',
					icon: 'clipboard'
				}, {
					to: '/r/salemonth-store',
					name: '2-3',
					text: '月报表(仓库)',
					icon: 'clipboard'
				}, {
					to: '/r/salemonth-man',
					name: '2-4',
					text: '月报表(业务员)',
					icon: 'clipboard'
				}],
				nav_list2: [{
					to: '/r/stocksafe',
					name: '3-1',
					text: '安全库存明细',
					icon: 'clipboard'
				}, {
					to: '/r/stockupper',
					name: '3-2',
					text: '库存超上限明细',
					icon: 'clipboard'
				}],
				nav_list3: [{
					to: '/r/account-analysis',
					name: '4-1',
					text: '应收账款分析',
					icon: 'clipboard'
				}, {
					to: '/r/pay-analysis',
					name: '4-2',
					text: '应付账款分析',
					icon: 'clipboard'
				}],
			}
		},
		mounted() {
			this.nav_list.forEach((item, index) => {
				if(item.to == this.$route.path) {
					this.active_name = item.name;
				}
			})
			this.nav_list1.forEach((item, index) => {
				if(item.to == this.$route.path) {
					this.active_name = item.name;
				}
			})
			this.nav_list2.forEach((item, index) => {
				if(item.to == this.$route.path) {
					this.active_name = item.name;
				}
			})
			this.nav_list3.forEach((item, index) => {
				if(item.to == this.$route.path) {
					this.active_name = item.name;
				}
			})
		},
		components: {
			pheader
		}
	}
</script>

<style>

</style>
