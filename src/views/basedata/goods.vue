<template>
  <div class="purchase_order">
    <div class="basic_indicators" style="margin-bottom: 30px;">
      商品分类
      <Button type="primary" style="margin-left:50px;" @click="addUnit">新增商品分类</Button>
    </div>
    <Table stripe :columns="columns5" :data="goods_list"></Table>
    <!--<div class="page_unit">
      <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage" show-elevator></Page>
    </div>-->

    <Modal v-model="add_goods" width="360">
      <p slot="header" style="color:#2D8CF0;text-align:center">
        <span>新增商品分类</span>
      </p>
      <div style="line-height: 32px;">
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>分类编码</Col>
          <Col span="18">
          <Input v-model="add_code"></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>分类名称</Col>
          <Col span="18">
          <Input v-model="add_name"></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;"><span style="color:red;font-size:16px;">*</span>上级分类</Col>
          <Col span="18">
          <Select v-model="add_superior">
            <Option v-for="(item,index) in goods_list" :value="item.id" :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="keepAddGoods">保存</Button>
        <Button type="primary" @click="closeAddModal">取消</Button>
      </div>
    </Modal>
    <Modal v-model="edit_goods" width="360">
      <p slot="header" style="color:#2D8CF0;text-align:center">
        <span>编辑商品分类</span>
      </p>
      <div style="line-height: 32px;">
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">分类编码</Col>
          <Col span="18">
          <Input v-model="edit_code" disabled></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">分类名称</Col>
          <Col span="18">
          <Input v-model="edit_name"></Input>
          </Col>
        </Row>
        <Row style='margin: 10px 0;'>
          <Col span="6" style="text-align:center;">上级分类</Col>
          <Col span="18">
          <Select v-model="edit_superior">
            <Option v-for="(item,index) in goods_list" :value="item.id  " :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="keepEditGoods">保存</Button>
        <Button type="primary" @click="closeEditModal">取消</Button>
      </div>
    </Modal>
    <Modal v-model="del_goods" width="360">
      <p slot="header" style="color:#2D8CF0;text-align:center">
        <span>您确认删除此商品分类吗?</span>
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
  import { getGoodsCategory, addGoodsCategory, editGoodsCategory, delGoodsCategory } from '../../api/api'
  export default {
    mounted() {
      this.$store.state.ticket = sessionStorage.getItem("ticket")
      this.getGoodsList();
    },
    data() {
      return {
        goods_list: [],
        add_goods: false, //添加商品分类弹窗
        edit_goods: false, //修改商品分类弹窗
        del_goods: false, //删除商品分类弹窗
        add_code: '', //添加窗口绑定分类编码
        add_name: '', //添加窗口绑定分类名称
        add_superior: '', //添加窗口绑定分类上级
        edit_code: '', //修改窗口绑定分类编码
        edit_name: '', //修改窗口绑定分类名称
        edit_superior: '', //修改窗口绑定分类上级
        add_ji: '', //绑定添加商品分类值
        edit_ji: '', //绑定编辑商品分类值
        edit_id: '', //编辑时传的id
        del_id: '', //删除时传的id
        columns5: [{
            title: '序号',
            key: 'unmid',
            align: "center",
          },
          {
            title: '分类',
            align: "center",
            key: 'name',
          },
          {
            title: '编码',
            align: "center",
            key: 'code',
          },
          {
            title: '商品种类数',
            align: "center",
            key: 'goods_num',
          },
          {
            title: '操作',
            key: 'action',
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
                      this.$router.push('/b/goods-list/' + params.row.id)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'default'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.edit_goods = true;
                      this.edit_superior = params.row.parent_id;
                      this.edit_name = params.row.name;
                      this.edit_id = params.row.id;
                      this.edit_code = params.row.code;
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
                    click: () => {
                      this.del_id = params.row.id
                      this.del_goods = true;
                      console.log(this.del_id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        pageSize: 10,
        dataCount: 100
      }
    },
    methods: {
      changepage() {},
      clearForm(){
        this.add_code = ""
        this.add_name = ""
        this.add_superior = ""
      },
      addUnit() {
        this.add_goods = true;
        this.clearForm()
      },
      closeAddModal() {
        this.add_goods = false;
        this.clearForm()
      },
      closeEditModal() {
        this.edit_goods = false;
      },
      //获取商品分类列表数据,自循环序号
      getGoodsList() {
        getGoodsCategory({
          ticket: this.$store.state.ticket
        }).then(res => {
          this.goods_list = res.data
          var num = 1
          this.goods_list.forEach((item, index) => {
            item.unmid = num++
          })
        })
      },
      //保存新增商品分类
      keepAddGoods() {
        if(this.add_name.trim() == '') {
          this.$Message.info('请输入分类名称');
          return;
        }
        if(this.add_code.trim() == '') {
          this.$Message.info('请输入分类编码');
          return;
        }
        addGoodsCategory({
          ticket: this.$store.state.ticket,
          name: this.add_name,
          code: this.add_code,
          parent_id: this.add_superior
        }).then(res => {
          if(res.retcode == '2000') {
            this.$Message.info(res.msg);
            this.add_goods = false;
            this.getGoodsList();
            this.clearForm()
          } else {
            this.$Message.info(res.msg);
          }
        })
      },
      //保存修改商品分类
      keepEditGoods() {
        if(this.edit_name.trim() == '') {
          this.$Message.info('请输入分类名称');
          return;
        }
        if(this.edit_code.trim() == '') {
          this.$Message.info('请输入分类编码');
          return;
        }
        editGoodsCategory({
          ticket: this.$store.state.ticket,
          name: this.edit_name,
          code: this.edit_code,
          parent_id: this.edit_superior,
          id: this.edit_id
        }).then(res => {
          if(res.retcode == '2000') {
            this.$Message.info(res.msg);
            this.edit_goods = false;
            this.getGoodsList();
            this.edit_name = ""
            this.edit_code = ""
            this.edit_superior = ""
          } else {
            this.$Message.info(res.msg);
            this.edit_goods = false;
            this.getGoodsList();
          }
        })
      },
      //确认删除商品分类
      delTrue() {
        delGoodsCategory({
          ticket: this.$store.state.ticket,
          id: this.del_id
        }).then(res => {
          if(res.retcode == '2000') {
            this.$Message.info(res.msg);
            this.getGoodsList();
            this.del_goods = false;
          } else {
            this.$Message.info(res.msg);
          }
        })
      },
      delFalse() {
        this.del_goods = false;
      }
    }
  }
</script>
<style>

</style>
