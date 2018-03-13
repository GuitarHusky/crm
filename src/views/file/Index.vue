<template>
	<div class="purchase_order">
		<div class="basic_indicators">
			数据概览
		</div>
		<div>
			<ul class="file_data">
				<li>
					<div class="file_data_left"><img src="../../assets/file_one.png" alt="" /></div>
					<div class="file_data_right">
						<p><span  class="file_data_num">{{sale_total|filterNumber}}</span></p>
						<p>销售总额</p>
					</div>
				</li>
				<li>
					<div class="file_data_left"><img src="../../assets/file_two.png" alt="" /></div>
					<div class="file_data_right">
						<p class=""><span class="file_data_num">{{inventoryMoney|filterNumber}}</span></p>
						<p>库存总额</p>
					</div>
				</li>
				<li>
					<div class="file_data_left"><img src="../../assets/file_three.png" alt="" /></div>
					<div class="file_data_right">
						<p><span class="file_data_num">{{purchaseMoney|filterNumber}}</span></p>
						<p>采购总额</p>
					</div>
				</li>
				<!-- <li>
          <div class="file_data_left"><img src="../../assets/file_four.png" alt="" /></div>
          <div class="file_data_right">
            <p><span class="file_data_num">{{balanceMoney_shou|filterNumber}}</span></p>
            <p>应收账款</p>
          </div>
        </li> -->
			<!--   <li>
        <div class="file_data_left"><img src="../../assets/file_five.png" alt="" /></div>
        <div class="file_data_right">
          <p class="file_data_num"><span class="file_data_num">{{balanceMoney_fu|filterNumber}}</span></p>
          <p>应付账款</p>
        </div>
      </li> -->
			</ul>
		</div>
		<div style="height: 1px;"></div>
		<div>
			<Tabs value="sale">
				<TabPane label="销售看板" name="sale" style='padding-top: 20px;'>
					<Table stripe :columns="saleList" :data="saleData"></Table>
				</TabPane>
				<TabPane label="库存看板" name="stock" style='padding-top: 20px;'>
					<Table stripe :columns="inventoryList" :data="inventoryData"></Table>
				</TabPane>
				<TabPane label="采购看板" name="purchase" style='padding-top: 20px;'>
					<Table stripe :columns="purchaseList" :data="purchaseData"></Table>
				</TabPane>
				<!-- <TabPane label="资金看板" name="capital" style='padding-top: 20px;'>
          <Table stripe :columns="moneyList" :data="moneyData"></Table>
        </TabPane> -->
			</Tabs>
		</div>
	</div>
</template>

<script>
	import { salePortal, inventoryPortal, purchasePortal, moneyPortal } from '../../api/api'
	export default {
		data() {
			return {
        /*销售看板*/
				saleList: [{
					title: '月份',
					align: "center",
					key: 'month',
				}, {
					title: '销售额',
					align: "center",
					key: 'saleMoney'
				}, {
					title: '毛利',
					align: "center",
					key: 'profit'
				}, {
					title: '毛利率',
					align: "center",
					key: 'rate'
				}],
				saleData: [],

        /*库存看板*/
				inventoryList: [{
					title: '仓库',
					align: "center",
					key: 'warehouseName',
				}, {
					title: '存货金额',
					align: "center",
					key: 'inventoryMoney'
				}, {
					title: '低于安全库存商品种类数',
					align: "center",
					key: 'iuCount'
				}, {
					title: '超过安全库存商品种类数',
					align: "center",
					key: 'siCount'
				}],
				inventoryData: [],

        /*采购看板*/
				purchaseList: [{
					title: '月份',
					align: "center",
					key: 'month'
				}, {
					title: '采购额',
					align: "center",
					key: 'purchaseMoney'
				}],
				purchaseData: [],
				moneyList: [{
					title: '款项',
					align: "center",
					key: 'item',
				}, {
					title: '当期余额',
					align: "center",
					key: 'balanceMoney'
				}, {
					title: '账龄30天内',
					align: "center",
					key: 'money30'
				}, {
					title: '账龄30-60天',
					align: "center",
					key: 'money30to60'
				}, {
					title: '账龄60-90天',
					align: "center",
					key: 'money60to90'
				}, {
					title: '账龄大于90天',
					align: "center",
					key: 'money90'
				}],
				moneyData: [],
				sale_total:'',//销售总额
				inventoryMoney:'',//库存总额
				purchaseMoney:'',//采购总额
				balanceMoney_shou:'',//应收账款
				balanceMoney_fu:'',//应付账款
			}
		},
    filters:{
      filterNumber(value){
        if(value){
        return value+'元'
        }else{
        return '0.00元'
        }
      }
    },

		mounted() {
      this.$store.state.ticket = sessionStorage.getItem("ticket")
      /*销售看板*/
			salePortal({
        ticket: sessionStorage.getItem("ticket"),
      }).then(res => {
				this.saleData = res.data
        if(!this.saleData[0].profit){
          this.sale_total = "0.00"
        }
				this.sale_total=this.saleData[0].profit
			})
      /*库存看板*/
			inventoryPortal({
        ticket: sessionStorage.getItem("ticket"),
      }).then(res => {
				this.inventoryData = res.data
        if(!this.inventoryData[0].inventoryMoney){
          this.inventoryMoney = "0.00"
        }
				this.inventoryMoney = this.inventoryData[0].inventoryMoney
			})
      /*采购看板*/
			purchasePortal({
        ticket: sessionStorage.getItem("ticket"),
      }).then(res => {
				this.purchaseData = res.data
        if(!this.purchaseData[0].purchaseMoney){
          this.purchaseMoney = "0.00"
        }
				this.purchaseMoney = this.purchaseData[0].purchaseMoney
			})
      /*资金看板*/
			moneyPortal({
				ticket: this.$store.state.ticket
			}).then(res => {
				this.moneyData = res.data
        if(!this.moneyData[0].balanceMoney){
          this.balanceMoney_shou = "0.00"
        }
        if(!this.moneyData[1].balanceMoney){
          this.balanceMoney_fu = "0.00"
        }
				this.balanceMoney_shou=this.moneyData[0].balanceMoney
				this.balanceMoney_fu=this.moneyData[1].balanceMoney
			})
		}
	}
</script>

<style>
	.file_data:after,
	.file_data li:after {
		display: table;
		clear: both;
		content: "";
	}

/*   .file_index {
  padding: 0 20px;
} */

	.file_data li {
		width: 20%;
		float: left;
	}

	.file_data_left {
		margin: 100px 0;
		float: left;
		width: 40%;
		height: 50px;
		padding-left: 15%;
		border-right: 1px solid #ccc;
	}

	.file_data_left img {
		width: 50px;
		height: 50px;
	}

	.file_data_right {
		float: right;
		margin: 100px 0;
		width: 59%;
		height: 50px;
	}

	.file_data_right p {
		padding-left: 15px;
		line-height: 25px;
		font-size: 16px;
	}

	.file_data_num {
		color: rgb(38, 101, 216);
		font-weight: bold;
		font-size: 25px;
	}
</style>
