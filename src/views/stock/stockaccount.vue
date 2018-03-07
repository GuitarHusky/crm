<template>
  <div class="purchase_order">
<!--     <div class="basic_indicators">
  查询条件
</div>
<Row style="margin: 20px 0;">
  <Col span="5">
  <Row>
    <Col span="8" class="from-text">商品编号</Col>
    <Col span="16">
    <Input v-model="value"></Input>
    </Col>
  </Row>
  </Col>
  <Col span="5" style="margin-left:20px;">
  <Row>
    <Col span="8" class="from-text">品名</Col>
    <Col span="16">
    <Input v-model="value"></Input>
    </Col>
  </Row>
  </Col>
  <Col span="5" style="margin-left:20px;">
  <Row>
    <Col span="8" class="from-text">规格型号</Col>
    <Col span="16">
    <Input v-model="value"></Input>
    </Col>
  </Row>
  </Col>
  <Col span="1" style="text-align: center;margin-left:20px;">
  <Button type="primary">查询</Button>
  </Col>
  <Col span="1" style="text-align: center;">
  <Button type="primary">重置</Button>
  </Col>
</Row> -->
    <div class="basic_indicators" style="margin-bottom: 30px;">
    仓库
  </div>
  <Table stripe :columns="allstockslist" :data="allstocksdata"></Table>
  <div class="page_unit">
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage" show-elevator></Page>
  </div>


<!-- <table border="1" style="width:100%;">
<caption>Table caption here这是一段文字</caption>
<colgroup span="1" style="background:#DEDEDE;"/>
<colgroup span="2" style="background:#EFEFEF;"/>

<thead>
<tr>
<th>Head 1</th>
<th>Head 2</th>
<th>Head 3</th>
</tr>
</thead>

<tfoot>
<tr>
<td style="text-align:center;">Foot 1</td>
<td style="text-align:center;">Foot 2</td>
<td style="text-align:center;">Foot 3</td>
</tr>
</tfoot>

<tbody>
<tr>
<td style="text-align:center;">A</td>
<td style="text-align:center;">B</td>
<td style="text-align:center;">C</td>
</tr>
<tr>
<td style="text-align:center;">D</td>
<td style="text-align:center;">E</td>
<td style="text-align:center;">F</td>
</tr>
</tbody>
</table>
<Button type="primary" style="margin-left:30px;margin-top:50px;" @click="createPdf">打印</Button> -->
  </div>
</template>

<script>
  import { getAllStock } from '../../api/api'
  export default {
    data() {
      return {
        dataCount:"",
        value: "",
        allstockslist: [{
            title: '序号',
            align: "center",
            key: 'numid',
          },
          {
            title: '仓库编号',
            align: "center",
            key: 'code'
          },
          {
            title: '仓库名称',
            align: "center",
            key: 'name',
          },
          {
          title: '操作',
          key: 'action',
          align: 'center',
          render:  (h, params)=> {
            return h('p', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'default'
                },
                on: {
                  click:  ()=> {
                    this.$router.push('/s/account-info/'+params.row.id+"/"+params.row.name)
                  }
                }
              }, '查看')
            ]);
          }
        }
        ],
        allstocksdata: [],
        pageSize: 10,
        dataCount: 100
      }
    },
    methods:{
      createPdf(){
          let newWindow = window.open("_blank");   //打开新窗口
          let codestr = document.getElementsByClassName("purchase_order")[0].innerHTML;   //获取需要生成pdf页面的div代码
            newWindow.document.write(codestr);   //向文档写入HTML表达式或者JavaScript代码
            newWindow.document.close();     //关闭document的输出流, 显示选定的数据
            newWindow.print();   //打印当前窗口
            return true;
        },
      getAllStocks(){
        getAllStock({
          ticket: sessionStorage.getItem("ticket"),
          page: 1,
        }).then(res => {
          var num = 1
          res.data.forEach((item,index) => {
            item["numid"] = num++
          })
          this.allstocksdata = res.data
          this.dataCount = res.data.length
        })
      },
      changepage(index){
        getAllStock({
          ticket: sessionStorage.getItem("ticket"),
          page: index,
        }).then(res => {
          var num = 1
          res.data.forEach((item,index) => {
            item["numid"] = num++
          })
          this.allstocksdata = res.data
          this.dataCount = res.data.length
        })
      },
    },
    mounted(){
      this.getAllStocks()
    }
  }
</script>

<style>
/*   .purchase_order {
  padding: 0 20px;
} */
</style>
