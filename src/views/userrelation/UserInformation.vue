<template>
	<div class="purchase_order">
		<div class="basic_indicators" style="margin-bottom: 30px;">
			客户分类
			<Button type="primary" style="margin-left: 50px;" @click='addUserState'>新增客户分类</Button>
      <Button type="primary" style="margin-left: 30px;" @click='editUserState'>编辑客户分类</Button>
      <Button type="primary" style="margin-left: 30px;" @click='delUserState'>删除客户分类</Button>
		</div>
		<Table :row-class-name="rowClassName" @on-row-click="rowClick" :columns="userslist" :data="usersdata"></Table>
		<div class="page_unit">
			<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage" show-elevator></Page>
		</div>
		<Modal v-model="add_user_state" width="360">
			<p slot="header" style="color:#2D8CF0;text-align:center">
				<span>新增客户分类</span>
			</p>
			<div style="line-height: 32px;">
				<Row style='margin: 10px 0;'>
					<Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>分类编码</Col>
					<Col span="18">
					<Input v-model="addusercode"></Input>
					</Col>
				</Row>
				<Row style='margin: 10px 0;'>
					<Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>分类名称</Col>
					<Col span="18">
					<Input v-model="addcategoryname"></Input>
					</Col>
				</Row>
				<Row style='margin: 10px 0;'>
					<Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>价格体系</Col>
					<Col span="18">
					<Select v-model="addprice">
          <Option v-for="item in addpricelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
					</Col>
				</Row>
			</div>
			<div slot="footer">
				<Button type="primary" @click="addusercategory">新增</Button>
				<Button type="primary" @click="closeaddModal">取消</Button>
			</div>
		</Modal>
    <Modal v-model="edit_user_state" width="360">
      <p slot="header" style="color:#2D8CF0;text-align:center">
        <span>编辑客户分类</span>
      </p>
      <div style="line-height: 32px;">
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">分类编码</Col>
          <Col span="18">
          <Input v-model="editusercode"></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">分类名称</Col>
          <Col span="18">
          <Input v-model="editcategoryname"></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">价格体系</Col>
          <Col span="18">
          <Select v-model="editprice">
          <Option v-for="item in editpricelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="editusercategory">保存</Button>
        <Button type="primary" @click="closeeditModal">取消</Button>
      </div>
    </Modal>
    <Modal v-model="del_modal" width="360">
      <p slot="header" style="color:#2D8CF0;text-align:center">
        <span>您确认删除此客户分类吗?</span>
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
  import { getAllUserList,getAllSupplier,getAllPriceInfo,addUserCategorys,updateUserCategorys,deleteUserCategorys } from '../../api/api'
  import axios from 'axios'
  export default {
    mounted(){
      this.$store.state.ticket = sessionStorage.getItem("ticket")
      this.getUsersListInfo()
      this.getAllPriceInfos()
    },
    data() {
      return {
        addpricelist: [],   //价格体系列表
        addprice: '',   //价格体系值
        editpricelist: [],
        editprice: '',
        add_user_state: false,   //模态框状态
        edit_user_state: false,
        cityList: [],
        categoryID: sessionStorage.getItem("ticket"),
        /*客户分类列表*/
        userslist: [{
          title: '类别编码',
          align: "center",
          key: 'code',
        }, {
          title: '类别',
          align: "center",
          key: 'name',
        }, {
          title: '价格体系',
          key: 'ps_name',
          align: "center",
        }, {
          title: '客户数',
          key: 'cnt',
          align: "center",
        }, {
          title: '操作',
          key: 'action',
          width: 250,
          /*fixed: 'right',*/
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
                    this.$router.push('/user/user-list/'+this.categoryID+'/'+params.row.id+'/'+params.row.name)
                  }
                }
              }, '查看'),
            ]);
          }
        }],
        usersdata: [], //客户分类数据
        pageSize: 20,
        dataCount: 0,
        addusercode: '',   /*用户编码*/
        addcategoryname: '',  /*分类名称*/
        addprice: '',  /*价格体系*/
        editusercode: '',
        editcategoryname: '',
        editprice: '',
        currentTableObj: '',  /*当前行*/
        CurrenTableindex: '',  /*当前行索引*/
        del_modal: false,
      }
    },
    methods: {
      /*获取当前行的按钮状态和数据*/
      rowClick(currentRow,index){
        this.currentTableObj = currentRow
        this.CurrenTableindex = index
        this.editusercode = this.currentTableObj.code
        this.editcategoryname = this.currentTableObj.name
        this.editprice = this.currentTableObj.ps_id
      },
      /*为选中行添加样式*/
      rowClassName (row, index) {
          if (index === this.CurrenTableindex) {
              return 'selectedtd';
          }
          return '';
      },
      /*分页*/
      changepage(index){
         getAllUserList({
          loginUserId: sessionStorage.getItem("ticket"),
          page: index,
          limit: 20,
        }).then(res => {
          this.usersdata = res.data.data
          this.dataCount = res.data.total
        })
      },
      /*获取供应商列表*/
      getSupplierList(){
        getAllSupplier({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.forEach((item,index) => {
            var temp = {}
            temp.value = item.id
            temp.label = item.name
            this.supplierlist.push(temp)
          })
        })
      },
      /*获取价格体系信息*/
      getAllPriceInfos(){
        getAllPriceInfo({
          ticket: sessionStorage.getItem("ticket"),
        }).then(res => {
          res.data.priceList.forEach((item,index) => {
           if(item.name){
           let temp = {}
           temp.value = item.id
           temp.label = item.name
           this.addpricelist.push(temp)
           this.editpricelist.push(temp)
           }
          })
        })
      },
      /*新增客户分类*/
      addusercategory(){
        if(this.addusercode == "" || this.addprice == "" || this.addcategoryname == ""){
          this.$Message.info('请您填写完整添加信息')
          return
        }
        addUserCategorys({
          loginUserId: sessionStorage.getItem("ticket"),
          code: this.addusercode,
          psId: this.addprice,
          name: this.addcategoryname,
        }).then(res => {
          if(res.retcode == 2000){
            this.$Message.success('添加成功')
            this.getUsersListInfo()
            this.add_user_state = false
          }else if(res.retcode == 4000){
            this.$Message.info(res.msg)
          }
        })
      },
      /*编辑客户分类*/
      editusercategory(){
        if(this.editusercode == "" || this.editprice == "" || this.editcategoryname == ""){
          this.$Message.info('请您填写完整信息')
          return
        }
        updateUserCategorys({
          loginUserId: sessionStorage.getItem("ticket"),
          code: this.editusercode,
          psId: this.editprice,
          name: this.editcategoryname,
          id: this.currentTableObj.id,
        }).then(res => {
          if(res.retcode == 2000){
            this.$Message.success('修改成功')
            this.getUsersListInfo()
            this.edit_user_state = false
          }
        })
      },
      /*删除客户分类*/
      deleteUserCategory(){
        deleteUserCategorys({
          loginUserId: sessionStorage.getItem("ticket"),
          id: this.currentTableObj.id,
        }).then(res => {
          if(res.retcode == 2000){
            this.$Message.success('删除成功')
            this.getUsersListInfo()
            this.closedelModal()
          }else if(res.retcode == 4000){
            this.$Message.info(res.msg)
            this.closedelModal()
          }
        })
      },
      delTrue(){
        this.deleteUserCategory()
      },
      delFalse(){
        this.closedelModal()
      },
      /*获取客户分类列表*/
      getUsersListInfo(){
        /*axios.get('https://crm.jianong.com.cn/api/v1/customer/categoryList?loginUserId=6C2A09CD-A129-11E4-9B6A-782BCBD7746B').then(res => {
          console.log(res)
        })*/
        getAllUserList({
          loginUserId: sessionStorage.getItem("ticket"),
          page: 1,
          limit: 20
        }).then(res => {
          this.usersdata = res.data.data
          this.dataCount = res.data.total
        })
      },
      addUserState() {
        this.add_user_state = true
      },
      closeaddModal(){
        this.add_user_state=false;
      },
      /*编辑客户分类*/
      editUserState() {
        if(!this.currentTableObj){
          this.$Message.info("请在表格中选择要编辑的客户分类项")
          return
        }
        this.edit_user_state = true
      },
      closeeditModal(){
        this.edit_user_state = false;
      },
      /*删除客户分类*/
      delUserState() {
        if(!this.currentTableObj){
          this.$Message.info("请在表格中选择要删除的客户分类项")
          return
        }
        this.del_modal = true
      },
      closedelModal(){
        this.del_modal=false;
      },
    },
	}
</script>

<style>
	/* .user_info {
    padding: 0 20px;
  } */
    .ivu-table .selectedtd td{
    background-color: #ebf7ff;
  }
</style>
