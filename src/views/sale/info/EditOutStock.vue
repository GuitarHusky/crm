<template>
	<div class="purchase_order">
		<div class="basic_indicators">
			编辑销售出库单
		</div>
		<Row style="margin: 20px 0;line-height: 32px;">
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;">单号</Col>
				<Col span="16">{{odd_number}}</Col>
			</Row>
			</Col>
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;"><span style="color: red;">*</span> 业务日期</Col>
				<Col span="16">
				<DatePicker type="date" placeholder="请输入日期" v-model='bizDT'></DatePicker>
				</Col>
			</Row>
			</Col>
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;"><span style="color: red;">*</span> 业务员</Col>
				<Col span="16">
				<Select v-model='bizUserId'>
					<Option v-for="(item,index) in alluserslist" :value="item.value" :key="item.value">{{item.label}}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;"><span style="color: red;">*</span> 出库仓库</Col>
				<Col span="16">
				<Select v-model="warehouseId">
					<Option v-for="(item,index) in stock_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
		</Row>
		<Row style="margin: 20px 0;line-height: 32px;">
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;"><span style="color: red;">*</span> 客户</Col>
				<Col span="16">
				<Select v-model="customerId">
					<Option v-for="(item,index) in customerslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="4">
			<Row>
				<Col span="8" style="text-align: center;">收款方式</Col>
				<Col span="16">
				<Select v-model='receivingType'>
					<Option v-for="(item,index) in paymentlist" :value="item.value" :key="item.value">{{item.label}}</Option>
				</Select>
				</Col>
			</Row>
			</Col>
			<Col span="8">
			<Row>
				<Col span="4" style="text-align: center;">送货地址</Col>
				<Col span="20">
				<Input v-model="dealAddress"></Input>
				</Col>
			</Row>
			</Col>
		</Row>
		<Row style="margin: 20px 0;line-height: 32px;">
			<Col span="16">
			<Col span="2" style="text-align: center;">备注</Col>
			<Col span="22">
			<Input v-model="billMemo"></Input>
			</Col>
			</Col>
		</Row>
		<div class="ivu-table-wrapper">
			<div class="ivu-table ivu-table-stripe">
				<div class="ivu-table-header">
					<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
						<thead>
							<tr>
								<th class="">
									<div class="ivu-table-cell">
										<span>序号</span>
									</div>
								</th>
								<th class="" style="width: 220px;">
									<div class="ivu-table-cell">
										<span>选择商品</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>商品编码</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>商品名称</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>规格型号</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>销售数量</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>单位</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>销售单价</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>销售金额</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>序列号</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>备注</span>
									</div>
								</th>
								<th class="">
									<div class="ivu-table-cell">
										<span>操作</span>
									</div>
								</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="ivu-table-tip">
					<div class='Modal'>
						<table cellspacing="0" cellpadding="0">
							<tbody>
								<tr class='tr_parent_trash' v-for="(list, key) in table.lists">
									<td>{{key+1}}</td>
									<td style="width: 220px;">
										<i-button type="ghost" icon="ios-search" v-on:click="showProduct(key)">选择商品</i-button>
										<i-button type="ghost" icon="qr-scanner" @click='showSan(key)'>扫码入库</i-button>
									</td>
									<td class="">{{list.goodsCode}}</td>
									<td class="">{{list.goodsName}}</td>
									<td class="">{{list.goodsSpec}}</td>
									<td class="">
										<Input placeholder="数量" class='modea_input' @on-keyup="sumTotalPrice(key)" v-model='list.goodsCount'></Input>
									</td>
									<td class="">{{list.unitName}}</td>
									<td class="">
										<Input placeholder="单价" class='modea_input' @on-keyup="sumTotalPrice(key)" v-model="list.goodsPrice"></Input>
									</td>
									<td class="">
										{{list.goodsMoney | filterByNumber}}
									</td>
									<td class="">{{list.sn}}</Input>
									</td>
									<td class="">
										<Input placeholder="备注" class='modea_input' v-model="list.memo"></Input>
									</td>
									<td class="">
										<span v-on:click="addInput"><Icon type="android-add-circle" style='font-size:25px;margin-right:10px;' ></Icon></span>
										<span v-on:click="delInput(key)" v-if="key > 0"><Icon type="ios-trash" style='font-size:25px;'></Icon></span>
										<span v-else><Icon type="ios-trash-outline" style='font-size:25px;color: #ccc;'></Icon></span>
									</td>
								</tr>
								<tr>
									<td></td>
									<td>

									</td>
									<td class=""></td>
									<td class=""></td>
									<td class=""></td>
									<td class="">
									</td>
									<td class=""></td>
									<td class="">销售金额合计：
									</td>
									<td class="">
										{{totalPrice | filterByNumber}}
									</td>
									<td class=""></td>
									<td class="">
									</td>
									<td class=""></td>
								</tr>
							</tbody>
						</table>
						<Modal v-model="add_orders" width="1000">
							<p slot="header" style="color:#2D8CF0;text-align:left">
								<span>选择商品</span>
							</p>
							<i-table border :columns="goodsTitle" :data="goods_list" height="400" :highlight-row="hrow" @on-row-click="appendTitle"></i-table>
						</Modal>
						<Modal v-model="scanmodal" width="700">
							<p slot="header" style="color:#2D8CF0;text-align:left;font-size:20px;">
								<span>扫描商品码</span>
							</p>
							<div slot="footer">
							</div>
							<input @change='chooseGoods' style="width: 100%;height: 30px;line-height: 30px;border-radius: 5px;border: 1px solid #CCCCCC;" v-model="scancode" type="" name="getfoucs" id="getfoucs" value="" placeholder="请扫描商品码" autofocus />
						</Modal>
					</div>
				</div>
			</div>
		</div>
		<div style="float: right;margin: 30px;">
			<Button type="primary" @click="submitAddOrder">提交</Button>
			<Button type="primary" style="margin-left:30px;" @click="escquit">取消</Button>
		</div>
	</div>
</template>

<script>
	import { getGoods, allCustomer, getAllOrgs, getAllUsers,getUser, editWSBill, getAllStock, wsBillInfo, getOneGoods, getZsmInfo } from '../../../api/api'
	import util from '../../../common/util.js'
	export default {
		mounted() {
      this.$store.state.ticket = sessionStorage.getItem("ticket")
			this.getGoodsList();
			this.getAllCustomers();
			this.getAllOrgsinfo();
			this.getAllUsersinfo();
			this.getStockList();
			this.getOutStockData()
		},
		data() {
			return {
				odd_number: '保存后自动添加',
				hrow: true,
				checkVriable: 0,
				totalPrice: 0,
				taxalPrice: 0,
				taxtTotalMoney: 0,
				goodsTitle: [{
						title: '商品编码',
						key: 'code',
						align: "center",
					},
					{
						title: '商品',
						key: 'name',
						align: "center",
					},
					{
						title: '规格型号',
						key: 'spec',
						align: "center",
					},
					{
						title: '单位',
						align: "center",
						key: 'unit_name'
					},
					{
						title: '建议采购价',
						align: "center",
						key: 'goodsPrice'
					},
					{
						title: '备注',
						align: "center",
						key: 'memo'
					}
				],
				table: {
					lists: []
				},
				sale_obj: {
					goodsId: '',
					goodsCode: '',
					goodsName: "",
					goodsSpec: "",
					goodsCount: 0, //采购数量
					unitName: "",
					goodsPrice: 0, //采购单价
					goodsMoney: 0, //采购总额
					soBillDetailId: '', //序列号
					sn: '',
					memo: '', //描述
				},
				add_orders: false,
				goods_list: [],
				tab_key: 0,
				tax: 0,
				customerslist: [], //客户列表
				bizDT: '', //绑定的业务时间
				customerId: '', //绑定客户id
				dealAddress: '', //交货的地址
				contact: '', //联系人
				tel: '', //电话
				fax: '', //传真
				orgId: '', //组织机构id
				bizUserId: '', //业务员id
				receivingType: '', //付款传的的id
				billMemo: "", //备注
				warehouseId: '', //仓库的id
				sobillRef: '',
				orgslist: [], //组织机构列表
				alluserslist: [], //业务员列表
				paymentlist: [/*{
					value: 0,
					label: '记应收账款'
				}, */{
					value: 1,
					label: '现金付款'
				}],
				stock_list: [], //仓库列表
				scanmodal: false,
				scancode: "",

			}
		},
		filters: {
			filterByNumber(value) {
				return isNaN(value) ? '' : parseFloat(value).toFixed(2);
			}
		},
		methods: {
			//点击取消按钮
			escquit() {
				window.history.back()
			},
			//点击扫码入库触发事件
			showSan(key) {
				this.scanmodal = true;
        this.scancode = "";
				this.getFoucs();
				this.tab_key = key
			},
			//获取焦点事件,因dom加载导致方法不能成功生效,第一:用自己写的input,第二:加30毫秒的延迟
			getFoucs() {
				setTimeout(function() {
					document.querySelector('#getfoucs').focus();
				}, 30);
			},
			//点击扫码入库时弹出扫码入库模态框,当输入内容的时候
			chooseGoods() {
        var hell = this.scancode.split('，').length
        if(hell > 1) {
          getZsmInfo({
            ticket: sessionStorage.getItem("ticket"),
            zsm: this.scancode.split('，')[0],
            pzwh: this.scancode.split('，')[2],
          }).then(res => {
            /*console.log(res)*/
            if(res.retcode == "2001") {
              this.$Message.info("没有该商品，请重新扫描!");
              this.scancode = "";
              return;
            }
            if(res.data.length>1){
              this.add_orders = true;
              this.goods_list = res.data;
              this.scanmodal = false;
              return;
            }else if(res.data[0]){
              for(var i = 0; i < this.table.lists.length; i++) {
              if(this.table.lists[i].goodsId == res.data[0].id) {
                this.$Message.info("不可选择重复商品");
                this.scancode = '';
                return;
              }
            }
              this.checkData(res.data[0]);
              return
            }
            for(var i = 0; i < this.table.lists.length; i++) {
              if(this.table.lists[i].goodsId == res.data.id) {
                this.$Message.info("不可选择重复商品");
                this.scancode = '';
                return;
              }
            }
            this.checkData(res.data);
          })
				} else {
					getOneGoods({
            ticket: sessionStorage.getItem("ticket"),
						bar_code: this.scancode
					}).then(res => {
            if(!res.data){
              this.$Message.info("没有该商品，请重新扫描!")
                  this.scancode = ""
            }
						for(var i = 0; i < this.table.lists.length; i++) {
							if(this.table.lists[i].goodsId == res.data.id) {
								this.$Message.info("不可选择重复商品")
								this.scancode = ''
								return
							}
						}
            this.checkData(res.data)
					})
				}
			},
      checkData(obj){
        this.sale_obj.goodsName = obj.name;
        this.sale_obj.goodsSpec = obj.spec;
        this.sale_obj.unitName = obj.unit_name;
        this.sale_obj.goodsCode = obj.code;
        this.sale_obj.goodsId = obj.id
        this.sale_obj.goodsPrice = obj.sale_price
        this.sale_obj.memo = obj.memo
        this.table.lists[this.tab_key] = util.deepClone(this.sale_obj)
        this.tab_key++
          this.scancode = ''
        this.scanmodal = false;
      },
			showProduct(key) {
				this.tab_key = key;
				this.add_orders = true;
        this.getGoodsList();
			},
			delInput(key) {
				if(key != 0) {
					this.table.lists.splice(key, 1);
					this.sumTotalPrice(key - 1);
				}
			},
			addInput() {
				this.table.lists.push({
					goodsId: '',
					goodsCode: '',
					goodsName: "",
					goodsSpec: "",
					goodsCount: 0, //采购数量
					unitName: "",
					goodsPrice: 0, //采购单价
					goodsMoney: 0, //采购总额
					soBillDetailId: '', //序列号
					sn: '',
					memo: '', //描述
				});
			},
			getGoodsList() {
				getGoods({
					ticket: this.$store.state.ticket,
				}).then(res => {
					this.goods_list = res.data
					var num = 1
					this.goods_list.forEach((item, index) => {
						item.unmid = num++
					})
				})
			},
			appendTitle(currentRow) {
				for(var i = 0; i < this.table.lists.length; i++) {
					if(this.table.lists[i].goodsId == currentRow.id) {
						this.$Message.info("不可选择重复商品")
						return
					}
				}
				this.table.lists[this.tab_key].goodsName = currentRow.name;
				this.table.lists[this.tab_key].goodsSpec = currentRow.spec;
				this.table.lists[this.tab_key].unitName = currentRow.unit_name;
				this.table.lists[this.tab_key].goodsCode = currentRow.code;
        this.table.lists[this.tab_key].goodsId = currentRow.id
				this.table.lists[this.tab_key].goodsPrice = currentRow.sale_price
				this.table.lists[this.tab_key].memo = currentRow.memo
				this.table.lists[this.tab_key].soBillDetailId = ''
				this.table.lists[this.tab_key].sn = ''
				this.add_orders = false;
			},
			sumTotalPrice(key) {
				this.table.lists[key].goodsMoney =
					parseFloat(this.table.lists[key].goodsCount) * parseFloat(this.table.lists[key].goodsPrice);
				this.table.lists[key].tax =
					parseFloat(this.table.lists[key].goodsCount) * parseFloat(this.table.lists[key].goodsPrice) * 0.17;
				this.table.lists[key].moneyWithTax = this.table.lists[key].goodsMoney + this.table.lists[key].tax;
				this.totalPrice = 0, this.taxalPrice = 0, this.taxtTotalMoney = 0;
				this.table.lists.forEach((item, index) => {
					this.totalPrice += parseFloat(item.goodsMoney)
					this.taxalPrice += item.tax;
					this.taxtTotalMoney += item.moneyWithTax;
				})
			},
			submitAddOrder() {
				if(this.customerId.trim() == '') {
					this.$Message.info("请选择用户!")
					return;
				}
				if(this.bizDT == '') {
					this.$Message.info("请选择业务时间!")
					return;
				}
				if(this.warehouseId.trim() == '') {
					this.$Message.info("请选择出库仓库!")
					return;
				}
				if(this.bizUserId == '') {
					this.$Message.info("请选择业务员!")
					return;
				}
				if(this.table.lists[0].name == '') {
					this.$Message.info("请选择商品!")
					return;
				}
        for(var i=0;i<this.table.lists.length;i++){
          if(this.table.lists[i].goodsCount == "" || this.table.lists[i].goodsCount == 0){
            this.$Message.info("请选择采购数量")
            return
          }
          }
          for(var i=0;i<this.table.lists.length;i++){
          if(this.table.lists[i].goodsPrice == "" || this.table.lists[i].goodsPrice == 0){
            this.$Message.info("请选择采购单价")
            return
          }
          }
				/*console.log(this.table.lists)*/
				var adduser = {}
				var datenow = new Date(this.bizDT)
				this.bizDT = datenow.getFullYear() + '-' + (datenow.getMonth() + 1) + '-' + datenow.getDate()
				adduser.id = this.$route.params.edit_out_id;
				adduser.bizDT = this.bizDT;
				adduser.customerId = this.customerId;
				adduser.warehouseId = this.warehouseId;
				adduser.bizUserId = this.bizUserId;
				adduser.receivingType = this.receivingType;
				adduser.billMemo = this.billMemo;
				adduser.dealAddress = this.dealAddress;
				adduser.sobillRef = this.sobillRef;
				adduser.items = this.table.lists;
				editWSBill({
					jsonStr: adduser,
          loginUserId: sessionStorage.getItem('ticket'),
				}).then(res => {
					if(res.retcode == 2000) {
						this.$Message.info(res.msg)
						this.$router.push('/x/saleoutstock')
					} else {
						this.$Message.info(res.msg)
					}

				})
			},
			/*获取客户数据*/
			getAllCustomers() {
				allCustomer({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
					res.data.forEach((item, index) => {
						var temp = {}
						temp.label = item.name
						temp.value = item.id
						this.customerslist.push(temp)
					})
				})
			},
			/*获取组织机构列表*/
			getAllOrgsinfo() {
				getAllOrgs({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
					res.data.forEach((item, index) => {
						var temp = {}
						temp.value = item.id
						temp.label = item.name
						this.orgslist.push(temp)
					})
				})
			},
			/*获取业务员列表*/
			getAllUsersinfo() {
				getUser({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
					res.data.forEach((item, index) => {
						var temp = {}
						temp.value = item.id
						temp.label = item.nickname
						this.alluserslist.push(temp)
					})
				})
			},
			//获取仓库列表
			getStockList() {
				getAllStock({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
					this.stock_list = res.data;
				})
			},
			getOutStockData() {
				wsBillInfo({
					id: this.$route.params.edit_out_id,
          ticket: sessionStorage.getItem("ticket"),
				}).then(res => {
					this.odd_number = res.data.ref
					this.bizDT = res.data.bizDT
					this.customerId = res.data.customerId
					this.bizUserId = res.data.bizUserId
					this.warehouseId = res.data.warehouseId
					this.receivingType = res.data.receivingType
					this.dealAddress = res.data.dealAddress
					this.billMemo = res.data.memo
					this.table.lists = res.data.items
					this.totalPrice = parseFloat(res.data.totalMoney)
				})
			}
		}
	}
</script>

<style>
	input::-ms-input-placeholder {
		text-align: center;
	}

	input::-webkit-input-placeholder {
		text-align: center;
	}

	.Modal td {
		border-right: 1px solid #e9eaec;
	}

	.modea_input {
		width: 80%;
		text-align: center;
	}
</style>
