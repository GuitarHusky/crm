<template>
	<div class="purchase_order">
		<div class="basic_indicators">
			查询条件(请选择日期查询)
		</div>
		<Row>
			<Col span="4" style="margin: 20px 0;">
			<Row>
				<Col span="6" class="from-text">业务日期:</Col>
				<Col span="18">
				<DatePicker type="date" v-model="datetime" placeholder="请选择日期" :options="options"></DatePicker>
				</Col>
			</Row>
			</Col>
			<Col span="1" style="margin: 20px 0;margin-left: 20px;">
			<Button type="primary" @click="getDayGoodsReports">查询</Button>
			</Col>
		</Row>
		<div class="basic_indicators" style="margin-bottom: 30px;">
			销售日报表-商品汇总
		</div>
		<Table stripe :columns="dayreportlist" :data="dayreportdata"></Table>
		<div class="page_unit">
			<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage1" show-elevator></Page>
		</div>

    <div class="basic_indicators" style="margin-bottom: 30px;margin-top:300px;">
      销售日报表-日销售汇总
    </div>
    <Table stripe :columns="dayreportcountlist" :data="dayreportcountdata"></Table>
	</div>
</template>

<script>
 import { getDayGoodsReport,searchGoodsDayReport } from '../../../api/api'
	export default {
		data() {
			return {
        options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
        datetime: '',
        profit: '',
        rate: '',
				dayreportlist: [{
					title: '业务日期',
          align: "center",
					key: 'time'
				}, {
					title: '商品编码',
          align: "center",
					key: 'goodsCode'
				}, {
					title: '商品名称',
					key: 'goodsName',
					align: "center",
				}, {
					title: '规格型号',
          align: "center",
					key: 'goodsSpec'
				}, {
					title: '销售出库数量',
          align: "center",
					key: 'saleCount'
				}, {
					title: '计量单位',
          align: "center",
					key: 'unitName'
				}, {
					title: '销售出库金额',
          align: "center",
					key: 'saleMoney'
				}, {
					title: '退货入库数量',
          align: "center",
					key: 'rejCount'
				}, {
					title: '退货入库金额',
          align: "center",
					key: 'rejMoney'
				}, {
					title: '净销售数量',
          align: "center",
					key: 'c'
				}, {
					title: '净销售金额',
          align: "center",
					key: 'm'
				}, {
					title: '毛利',
          align: "center",
					key: 'profit'
				}, {
					title: '毛利率',
          align: "center",
					key: 'rate'
				},
//				{
//					title: '操作',
//					key: 'action',
//					fixed: 'right',
//					align: 'center',
//					render: function(h, params) {
//						return h('p', [
//							h('Button', {
//								props: {
//									type: 'primary',
//									size: 'small'
//								},
//								style: {
//									marginRight: '8px'
//								},
//								on: {
//									click: function() {
//										console.log(params)
//									}
//								}
//							}, '编辑'),
//							h('Button', {
//								props: {
//									type: 'error',
//									size: 'small'
//								},
//								style: {
//									marginRight: '8px'
//								},
//								on: {
//									click: function() {
//										console.log(params)
//									}
//								}
//							}, '删除'),
//						]);
//					}
//				}
				],
				dayreportdata: [],
				pageSize: 10,
        dataCount: 0,

        time: '',
        dayreportcountlist:[
        {
          title: '业务日期',
          key: 'bizDT',
          align: "center",
        },{
          title: '销售出库金额',
          key: 'saleMoney',
          align: "center",
        },{
          title: '退货入库金额',
          key: 'rejMoney',
          align: "center",
        },{
          title: '净销售金额',
          key: 'm',
          align: "center",
        },{
          title: '毛利',
          key: 'profit',
          align: "center",
        },{
          title: '毛利率',
          key: 'rate',
          align: "center",
        },
        ],
        dayreportcountdata: [],
			}
		},
    methods:{
      changepage1(index){
        this.time = new Date(this.datetime)
        var month = (this.time.getMonth() + 1)>=10?(this.time.getMonth() + 1):'0'+(this.time.getMonth() + 1)
        var day = this.time.getDate()>=10?this.time.getDate():'0'+this.time.getDate()
        this.time = this.time.getFullYear() + '-' + month + '-' + day
        searchGoodsDayReport({
          date: this.time,
          page: index,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          this.dayreportdata = res.data.data.dataList
          this.dayreportdata.forEach((item,index) => {
            item['time'] = this.time
            this.profit = item.profit
            this.rate = item.rate
          })
          this.dataCount = res.data.data.totalCount

        getDayGoodsReport({
          date: this.time,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.data[0].profit = this.profit
          res.data.data[0].rate = this.rate
          this.dayreportcountdata = res.data.data
        })
        })
      },
      changepage2(){

      },
      getDayGoodsReports(){
        this.time = new Date(this.datetime)
        var month = (this.time.getMonth() + 1)>=10?(this.time.getMonth() + 1):'0'+(this.time.getMonth() + 1)
        var day = this.time.getDate()>=10?this.time.getDate():'0'+this.time.getDate()
        this.time = this.time.getFullYear() + '-' + month + '-' + day
        searchGoodsDayReport({
          date: this.time,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          this.dayreportdata = res.data.data.dataList
          this.dayreportdata.forEach((item,index) => {
            item['time'] = this.time
            this.profit = item.profit
            this.rate = item.rate
          })
          this.dataCount = res.data.data.totalCount

        getDayGoodsReport({
          date: this.time,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.data[0].profit = this.profit
          res.data.data[0].rate = this.rate
          this.dayreportcountdata = res.data.data
        })
        })


      }
    },
    mounted(){
    }
	}
</script>

<style>
	.sale_day_goods {
		padding: 0 20px;
	}
</style>
