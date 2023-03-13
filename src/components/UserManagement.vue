<template>
  <div class="header">
    <span>用户管理</span>
  </div>
  <div class="body">
    <el-row>
      <el-button @click="dialogVisible = true">新建</el-button>
      <el-input placeholder="按关键字搜索" v-model="inputData" style="margin-left:10px; width: 350px"></el-input>
      <el-button @click="repeal" style="margin-left: 1000px; text-align:right">撤销</el-button>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column property="name" label="姓名" width="150"/>
        <el-table-column property="age" label="年龄" width="150"/>
        <el-table-column property="sex" label="性别" width="150"/>
        <el-table-column property="phone" label="联系电话" width="150"/>
        <el-table-column property="address" label="地址" show-overflow-tooltip>
          <template #default="scope">
            {{scope.row.area + scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click.prevent="editUser(scope.row)">编辑</el-button>
            <el-button size="small" @click.prevent="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 20px">
        <el-button @click="batchDelete()">批量删除</el-button>
        <el-button @click="clear()">清空勾选</el-button>
        <el-pagination  style="margin-left: 1200px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.current" :page-size="queryParams.size" layout="total, prev, pager, next, jumper" :total="queryParams.total"/>

      </el-row>
    </el-row>
    <el-dialog v-model="dialogVisible" :showClose="false"  title="新建/编辑用户" style="height:580px;" width="30%">
      <el-form>
        <el-row><span>姓名</span><span style="margin-left: 240px">性别</span></el-row>
        <el-row>
          <el-form-item style="width: 210px">
            <el-input v-model="editForm.name"/>
          </el-form-item>
          <el-form-item style="margin-left: 55px; width: 210px">
            <el-select v-model="editForm.sex">
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="margin-top: 20px"><span>联系电话</span><span style="margin-left: 210px">年龄</span></el-row>
        <el-row>
          <el-form-item>
            <el-input v-model="editForm.phone" style="width: 210px"/>
          </el-form-item>
          <el-form-item style="margin-left: 55px; width: 210px">
            <el-input v-model="editForm.age"/>
          </el-form-item>
        </el-row>
        <el-row style="margin-top: 40px"><span>详细地址</span></el-row>
        <el-form-item>
          <el-cascader style="width: 200px" size="large" :options="options" v-model="editForm.area"/>
          <el-input v-model="editForm.address" placeholder="请输入详细地址" style="margin-left: 5px; width: 260px"/>
        </el-form-item>
      </el-form>
      <el-row style="float: right;margin-top: 160px">
        <el-button @click="close" size="small">取消</el-button>
        <el-button @click="save" size="small" type="primary">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import axios from "axios";
import {baseUrl} from "../../env";
import {regionData,CodeToText,TextToCode} from 'element-china-area-data'


export default {
  name: 'UserManagement',
  data() {
    return {
      queryParams: {
        current: 1,
        size: 10
      },
      inputData: '',
      options: regionData,
      selectedOptions: [],
      editStatus: false,
      editForm: {},
      dialogVisible: false,
      tableData: [],
      multipleSelection: []
    }
  },
  watch:{
    inputData (val){
      if (this.timer === 0 ) {
        this.timer = setTimeout (() => {
          this.search(val)
        }, 1000)
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout (() => {
          this.search(val)
        }, 1000)
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    window.addEventListener("load", () => {
      console.log(this.inputData)
    });
  },
  methods: {
    repeal(){
      this.$confirm('是否撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get(baseUrl +'/user/repeal').then(async response => {
          if (response.data.statusCode == 1) {
            this.$message.success("撤销成功")
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error('撤销失败');
            this.dialogVisible = true;
          }
        })
      });
    },
    search(val){
      let data = JSON.parse(JSON.stringify(this.tableData))
      if(val && val !== ''){
        let newTableData = [];
        data.forEach((item) =>{
          if( item.name.includes(val) || item.age.includes(val) || item.sex.includes(val) || item.phone.includes(val)
              || item.address.includes(val) || item.area.includes(val) ){
            newTableData.push(item)
          }
        })
        this.tableData = newTableData
      }else {
        this.getList()
      }
    },
    handleCurrentChange(val) {
      this.queryParams.current = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryParams.size = val;
      this.getList();
    },
    getList() {
      try {
        this.tableData = [];
        axios.post(baseUrl+'/user/query',this.queryParams).then((response) => {
          if (response.data.statusCode == 1) {
              this.tableData = response.data.data.records;
              this.queryParams.total = Number(response.data.data.total);
          } else {
            this.$message.error(response.msg);
          }
        })
      } catch (e) {
        this.$message.error("系统繁忙");
      }
    },
    close() {
      this.editStatus = false;
      this.editForm = {};
      this.dialogVisible = false;
    },
    editUser(row) {
      let data=JSON.parse(JSON.stringify(row));
      this.editStatus = true;
      data.area=this.translateToCode(data.area)
      this.editForm = data
      this.dialogVisible = true;
    },
    deleteUser(row) {
      this.$confirm('是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = [JSON.parse(JSON.stringify(row.id))]
        axios.post(baseUrl +'/user/delete', id).then(async response => {
          if (response.data.statusCode == 1) {
            this.$message.success("删除成功")
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error('删除失败');
            this.dialogVisible = true;
          }
        })
      });
    },
    translate(data){
      let address = ''
      data.forEach(item => {
        address +=  CodeToText[item] + ','
      })
      return address
    },
    translateToCode(text){
      const arr = text.split(',')
      let code = []
      code.push(TextToCode[arr[0]].code)
      const provinceCode = TextToCode[arr[0]]
      let cityCode,regionCode
      for (const key in provinceCode) {
        if(key === arr[1]){
          cityCode = provinceCode[key]
          code.push(cityCode.code)
          if(arr[2]){
            for (const key in cityCode) {
              if(key === arr[2]){
                regionCode = cityCode[key]
                code.push(regionCode.code)
              }
            }
          }
        }
      }
      return code
    },
    save() {
      this.$confirm('是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let addOrEdit = 'add';
        if (this.editStatus === true) {
          addOrEdit = 'edit';
        }
        this.editForm.area = this.translate(this.editForm.area) ;
        axios.post(baseUrl + '/user/' + addOrEdit, this.editForm).then(async response => {
          if (response.data.statusCode == 1) {
            this.$message.success("保存成功");
            this.editForm = {};
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error('保存失败');
            this.dialogVisible = true;
          }
        })
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clear() {
      this.$refs.multipleTable.clearSelection();
    },
    batchDelete(){
      this.$confirm('是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        this.multipleSelection.forEach((item) =>{
          ids.push(item.id)
        })
        axios.post(baseUrl +'/user/delete', ids).then(async response => {
          if (response.data.statusCode == 1) {
            this.$message.success("删除成功")
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error('删除失败');
            this.dialogVisible = true;
          }
        })
      });
    }
  }
}


</script>

<style scoped>
.header {
  padding-top: 30px;
  height: 60px;
  background-color: darkgray;
}

.body {
  padding: 40px 80px;
}

</style>
