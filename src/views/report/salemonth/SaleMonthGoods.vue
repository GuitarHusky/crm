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
				<DatePicker type="month" v-model="datetime" placeholder="请选择时间" :options="options"></DatePicker>
				</Col>
			</Row>
			</Col>
			<Col span="1" style="margin: 20px 0;margin-left: 20px;">
			<Button type="primary" @click="getMonthGoodsReports">查询</Button>
			</Col>
		</Row>
		<div class="basic_indicators" style="margin-bottom: 30px;">
			销售月报表-商品汇总
		</div>
		<Table stripe :columns="monthSalelist" :data="monthSaledata"></Table>
		<div class="page_unit">
			<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage" show-elevator></Page>
		</div>

    <div class="basic_indicators" style="margin-bottom: 30px;margin-top:100px;">
      销售月报表-月销售汇总
    </div>
    <Table stripe :columns="monthreportcountlist" :data="monthreportcountdata"></Table>
  </div>
	</div>
</template>

<script>
  import { getMonthGoodsReport,searchMonthGoodsReport } from '../../../api/api'
	export default {
		data() {
			return {
        options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
        datetime: '',
        year: '',
        month: '',
				monthSalelist: [{
					title: '月份',
          align: "center",
					key: 'bizDT',
				}, {
					title: '商品编码',
          align: "center",
					key: 'goodsCode'
				}, {
					title: '商品名称',
          align: "center",
					key: 'goodsName',
//					sortable: true
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
				}/*, {
					title: '操作',
					key: 'action',
          width: 200,
					fixed: 'right',
					align: 'center',
					render: function(h, params) {
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
									click: function() {
										console.log(params)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'error',
									size: 'default'
								},
								style: {
									marginRight: '8px'
								},
								on: {
									click: function() {
										console.log(params)
									}
								}
							}, '删除'),
						]);
					}
				}*/],
				monthSaledata: [],
				pageSize: 10,
				dataCount: 0,
        monthreportcountlist:[
        {
          title: '月份',
          align: "center",
          key: 'bizDT',
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
        monthreportcountdata: [],
			}
		},
    methods: {
      changepage(index){
        var time = new Date(this.datetime)
        this.month = (time.getMonth() + 1)
        this.year = time.getFullYear()
        searchMonthGoodsReport({
          year: this.year,
          month: this.month,
          page: index,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          this.monthSaledata = res.data.data.dataList
          this.monthSaledata.forEach((item,index) => {
            this.profit = item.profit
            this.rate = item.rate
          })
          this.dataCount = res.data.data.totalCount

        getMonthGoodsReport({
          year: this.year,
          month: this.month,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.data[0].profit = this.profit
          res.data.data[0].rate = this.rate
          this.monthreportcountdata = res.data.data
        })
        })
      },
      getMonthGoodsReports(){
        var time = new Date(this.datetime)
        this.month = (time.getMonth() + 1)
        this.year = time.getFullYear()
        searchMonthGoodsReport({
          year: this.year,
          month: this.month,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          this.monthSaledata = res.data.data.dataList
          this.monthSaledata.forEach((item,index) => {
            this.profit = item.profit
            this.rate = item.rate
          })
          this.dataCount = res.data.data.totalCount

        getMonthGoodsReport({
          year: this.year,
          month: this.month,
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.data[0].profit = this.profit
          res.data.data[0].rate = this.rate
          this.monthreportcountdata = res.data.data
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
