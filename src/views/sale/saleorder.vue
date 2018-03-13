<template>
	<div class="purchase_order">
		<div class="basic_indicators">
			查询条件
		</div>
		<Row style="margin: 20px 0;">
			<Col span="5">
			<Row>
				<Col span="6" class="from-text">状态</Col>
				<Col span="18">
				<Select v-model="bill_status">
					<Option v-for="(item,index) in state_list" :value="item.code" :key="item.code">{{ item.value }}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="5" style="margin-left:20px;">
			<Row>
				<Col span="6" class="from-text">单号</Col>
				<Col span="18">
				<Input v-model="ref"></Input>
				</Col>
			</Row>
			</Col>
			<Col span="5" style="margin-left:20px;">
			<Row>
				<Col span="8" class="from-text">销售日期(起)</Col>
				<Col span="16">
				<DatePicker type="date" placeholder="" v-model='fromDT'></DatePicker>
				</Col>
			</Row>
			</Col>
			<Col span="5" style="margin-left:20px;">
			<Row>
				<Col span="8" class="from-text">销售日期(止)</Col>
				<Col span="16">
				<DatePicker type="date" placeholder="" v-model='toDT'></DatePicker>
				</Col>
			</Row>
			</Col>
		</Row>
		<Row>
			<Col span="5">
			<Row>
				<Col span="6" class="from-text">客户</Col>
				<Col span="18">
				<Select v-model="customerId">
					<Option v-for="(item,index) in user_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="5" style="margin-left:20px;">
			<Row>
				<Col span="6" class="from-text">收款方式</Col>
				<Col span="18">
				<Select v-model="receivingType">
					<Option v-for="(item,index) in pay_list" :value="item.code" :key="item.code">{{ item.value }}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="2" style="text-align: center;margin-left:30px;">
			<Button type="primary" @click="searchClick">查询</Button>
			</Col>
			<Col span="2" style="text-align: center;">
			<Button type="primary" @click="replay">重置</Button>
			</Col>
		</Row>
		<div class="basic_indicators" style="margin-bottom: 30px;">
			订单详情
			<Button type="primary" style="margin-left:50px;" @click="addOrder">新建销售订单</Button>
			<Button type="primary" style="margin-left:20px;" id="look_order" @click="lookOrder">查看</Button>
			<Button type="primary" style="margin-left:20px;" id="edit_order" @click="editOrder">编辑</Button>
			<Button type="primary" style="margin-left:20px;" id="revi_order" @click="commitSOBill">审核</Button>
			<Button type="primary" style="margin-left:20px;" id="cancle_order" @click="cancelConfirmSOBill">取消审核</Button>
			<Button type="primary" style="margin-left:20px;" id="delect_order" @click="delectSOBill">删除</Button>
			<Button type="primary" style="margin-left:20px;" id="delect_order" @click="printSOBill">打印</Button>
			<!--<Button type="primary" style="margin-left:20px;" id="buile_order" @click="addOrder">生成销售出库单</Button>-->
		</div>
		<Table :columns="columns5" @on-row-click='rowClick' :data="saleList" :row-class-name="rowClassName"></Table>
		<div class="page_unit">
			<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage" show-elevator></Page>
		</div>
		<Modal v-model="del_modal" width="360">
			<p slot="header" style="color:#2D8CF0;text-align:center">
				<span>您确认删除此销售订单吗?</span>
			</p>
			<p>您正在执行删除操作!</p>
			<div slot="footer">
				<Button type="primary" @click="delTrue">确认</Button>
				<Button type="primary" @click="delFalse">取消</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import { sobillList, getSoSelect, deleteSOBill, commitSOBill, cancelConfirmSOBill, addSOBill } from '../../api/api'
	export default {
		data() {
			return {
				options: {
					disabledDate(date) {
						return date && date.valueOf() > Date.now();
					}
				},
				model1: '',
				value: "",
				cityList: "",
				curr_row_data: {}, //当前行的数据
				curr_index: '', //当前行索引
				curr_str: '', //点击操作跳到下一页时传的字符串
				state_list: [], //状态列表
				user_list: [], //用户列表
				pay_list: [], //支付方式
				bill_status: '', //绑定状态
				ref: '', //单号
				fromDT: '', //开始时间
				toDT: '', //结束时间
				customerId: '', //客户id
				receivingType: '', //支付方式
				eidit: false,
				del_modal: false, //删除的弹窗
				curr_delectid: '', //当前点击删除行的id
				columns5: [{
						title: '序号',
						key: 'numid',
						align: "center",
					},
					{
						title: '状态',
						key: 'bill_status',
						align: "center",
					},
					{
						title: '销售订单号',
						align: "center",
						key: 'ref'
					}, {
						title: '销售日期',
						align: "center",
						key: 'deal_date'
					},
					{
						title: '客户',
						align: "center",
						key: 'customer_name',
					},
					{
						title: '总金额',
						align: "center",
						key: 'goods_money'
					},
					{
						title: '收款方式',
						align: "center",
						key: 'receiving_type'
					}, {
						title: '销售员',
						align: "center",
						key: 'biz_user_name'
					},
					{
						title: '备注',
						align: "center",
						key: 'bill_memo'
					},
					{
						title: '操作',
						key: 'action',
						width: 110,
						fixed: 'right',
						align: 'center',
						render: (h, params) => {
							return h('p', [
								h('Button', {
									props: {
										type: 'primary',
										size: 'default'
									},
									style: {
										marginRight: '8px'
									},
									on: {
										click: () => {
											this.$router.push('/x/order-user-info/' + params.row.id + '/' + params.row.ref + '/' + params.row.customer_name + '/' + params.row.receiving_type + '/' + params.row.biz_user_name + '/' + params.row.deal_date)
										}
									}
								}, '订单详情'),
								/*h('Button', {
									props: {
										type: 'primary',
										size: 'default'
									},
									style: {
										marginRight: '8px'
									},
									on: {
										click: () => {
											this.$router.push('/x/order-order-info/' + params.row.id)
										}
									}
								}, '出库详情'),*/
							]);
						}
					}
				],
				saleList: [],//销售订单首页的列表数据
				pageSize: 20,//每页的页数
				dataCount: 0,//总页数
				statusList: [],//状态的下拉列表
				pageIndex:1,//页码
			}
		},
		methods: {
			/*跳转打印页面*/
			printSOBill() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以打印')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请选择您想要打印的销售订单!')
					return;
				}
				this.$router.push('/x/add-order-print/' + this.curr_row_data.id)
			},
			//重置按钮
			replay() {
				this.bill_status = ''
				this.ref = ''
				this.fromDT = ''
				this.toDT = ''
				this.customerId = ''
				this.receivingType = ''
			},
			//点击删除按钮时
			delectSOBill() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以删除')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请选择您删除的销售订单!')
					return;
				}
				this.del_modal = true
			},
			//点击查看按钮
			lookOrder() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以查看')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请选择您需要查看的销售订单!')
					return;
				}
				this.$router.push('/x/look-order/' + this.curr_row_data.id)
			},
			//点击编辑按钮
			editOrder() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以编辑')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请选择您需要编辑的销售订单!')
					return;
				}
				this.$router.push('/x/edit-order/' + this.curr_row_data.id)
			},
			//审核指定订单
			commitSOBill() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以审核')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请先选择需要审核的销售订单!');
					return;
				} else {
					commitSOBill({
						id: this.curr_row_data.id,
						loginUserId: sessionStorage.getItem('ticket')
					}).then(res => {
						this.$Message.info(res.msg);
						this.getSaleList();
						if(res.retcode == "2000") {
							this.curr_row_data.bill_status = '已审核'
							this.buttonStatus()
						}
					})
				}
			},
			//取消审核指定订单
			cancelConfirmSOBill() {
				if(!this.saleList.length) {
					this.$Message.info('表格中没有订单可以取消审核')
					return;
				}
				if(this.curr_row_data.id == undefined || this.curr_row_data.id == "") {
					this.$Message.info('请先选择需要取消审核的销售订单!');
					return;
				} else {
					cancelConfirmSOBill({
						id: this.curr_row_data.id,
						loginUserId: sessionStorage.getItem('ticket')
					}).then(res => {
						this.$Message.info(res.msg);
						this.getSaleList();
						if(res.retcode == "2000") {
							this.curr_row_data.bill_status = '待审核'
							this.buttonStatus()
						}
					})
				}
			},
			//查询指定订单
			searchClick() {
				if(!this.fromDT == "NaN-NaN-NaN" || !this.toDT == "NaN-NaN-NaN" || !this.toDT == "" || !this.fromDT == "") {
					if(this.fromDT == "NaN-NaN-NaN" || this.fromDT == "") {
						this.$Message.info("请输入销售开始日期")
						return
					} else if(this.toDT == "NaN-NaN-NaN" || this.toDT == "") {
						this.$Message.info("请输入销售结束日期")
						return
					}
					var start = new Date(this.fromDT)
					var month1 = (start.getMonth() + 1) >= 10 ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1)
					var day1 = start.getDate() >= 10 ? start.getDate() : '0' + start.getDate()
					this.fromDT = start.getFullYear() + '-' + month1 + '-' + day1
					var end = new Date(this.toDT)
					var month2 = (end.getMonth() + 1) >= 10 ? (end.getMonth() + 1) : '0' + (end.getMonth() + 1)
					var day2 = end.getDate() >= 10 ? end.getDate() : '0' + end.getDate()
					this.toDT = end.getFullYear() + '-' + month2 + '-' + day2

					if(this.fromDT == 'NaN-NaN-NaN') {
						this.fromDT = ''
					}
					if(this.toDT == 'NaN-NaN-NaN') {
						this.toDT = ''
					}
				}
				this.saleList = [];
				this.pageIndex=1;
				this.getSaleList();
			},
			//分页
			changepage(index) {
				this.saleList = [];
				this.pageIndex=index;
				this.getSaleList();
			},
			//点击添加销售订单
			addOrder() {
				this.curr_str = 'add'
				this.$router.push('/x/add-order')
			},
			//在点击了某一行的时动态改变上方按钮状态
			rowClick(currentRow, index) {
				this.curr_row_data = currentRow
				this.eidit = true
				this.curr_index = index
				if(this.curr_row_data.bill_status == '待审核') {
					document.getElementById('look_order').disabled = true
					document.getElementById('edit_order').disabled = false
					document.getElementById('revi_order').disabled = false
					document.getElementById('cancle_order').disabled = true
					document.getElementById('delect_order').disabled = false
					//					document.getElementById('buile_order').disabled = true
				} else {
					document.getElementById('look_order').disabled = false
					document.getElementById('edit_order').disabled = true
					document.getElementById('revi_order').disabled = true
					document.getElementById('delect_order').disabled = true
					document.getElementById('cancle_order').disabled = false
					//					document.getElementById('buile_order').disabled = false
				}
			},
			buttonStatus() {
				if(this.curr_row_data.bill_status == '待审核') {
					document.getElementById('look_order').disabled = true
					document.getElementById('edit_order').disabled = false
					document.getElementById('revi_order').disabled = false
					document.getElementById('cancle_order').disabled = true
					document.getElementById('delect_order').disabled = false
					//          document.getElementById('buile_order').disabled = true
				} else {
					document.getElementById('look_order').disabled = false
					document.getElementById('edit_order').disabled = true
					document.getElementById('revi_order').disabled = true
					document.getElementById('delect_order').disabled = true
					document.getElementById('cancle_order').disabled = false
					//          document.getElementById('buile_order').disabled = false
				}
			},
			//获取销售首页列表
			getSaleList() {
				sobillList({
					loginUserId: sessionStorage.getItem('ticket'),
					bill_status: this.bill_status,
					ref: this.ref,
					fromDT: this.fromDT,
					toDT: this.toDT,
					customerId: this.customerId,
					receivingType: this.receivingType,
					limit: this.pageSize,
					page: this.pageIndex
				}).then(res => {
					this.saleList = res.data.ress
					this.dataCount = res.data.total
					var num = 1
					this.saleList.forEach((item, Index) => {
						item.numid = num++
					})
				})
			},
			//点击表格当前行的时候添加背景色
			rowClassName(row, index) {
				if(index == this.curr_index && this.eidit == true) {
					return 'demo-row-red';
				}
				return '';
			},
			//获取查询的三项下拉列表
			getSelectList() {
				getSoSelect({
					ticket: sessionStorage.getItem("ticket"),
				}).then(res => {
					this.state_list = res.data.status_bil
					this.user_list = res.data.customers
					this.pay_list.push(res.data.receiving_type[0])
				})
			},
			//弹出删除框时点击确认按钮
			delTrue() {
				deleteSOBill({
					ticket: sessionStorage.getItem("ticket"),
					id: this.curr_row_data.id
				}).then(res => {
					this.$Message.info(res.msg);
					this.del_modal = false
					this.getSaleList();
					this.curr_row_data.id = ""
				})
			},
			//弹出删除框时点击取消按钮
			delFalse() {
				this.del_modal = false
			}
		},
		mounted() {
			this.getSaleList();
			this.getSelectList();
		}
	}
</script>

<style>
	/* .purchase_order {
    padding: 0 20px;
  } */
	
	.ivu-table .demo-row-red td {
		background-color: rgb(235, 247, 255);
	}
</style>