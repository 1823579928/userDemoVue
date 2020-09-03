<template>
  <el-main>
    <userTest msg="User测试组件"/>
    <div align="right">
      <el-button type="primary" round @click="add">增加</el-button>
    </div>
    <el-table
        :data="listUser.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
      <el-table-column
          label="id"
          prop="id">
      </el-table-column>
      <el-table-column
          label="姓名"
          prop="name">
      </el-table-column>
      <el-table-column
          prop="age"
          label="年龄">
      </el-table-column>
      <el-table-column
          align="right">

        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <!-- scope.row代表当前对应行 -->

          <el-button type="primary" size="small" @click="update(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="remove(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <!-- 添加弹窗 -->
      <el-dialog :title="dialogTitle" width="50%" :visible.sync="addiconFormVisible">
        <el-form :inline="true" :model="user" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="user.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="user.age" placeholder="年龄">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addiconFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹窗  -->
      <el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
        <el-form :inline="true" :model="userData" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="userData.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="userData.age" placeholder="年龄">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="iconFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUser()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <br>

    <!-- 分页 paging -->
    <!--:page-size表示每页显示的数据条数；
        :total：表示总的数据数量；
        :page-sizes：表示我们可以自定义每页显示的数量；
        :currentPage:表示当前的页码；
        @size-change="handleSizeChange"，@current-change="handleCurrentChange" 是el-pagination中的事件，表示每页显示的数据和页码的变化；
        layout:表示分页栏的布局;
        background:表示是否带背景色-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                   :page-size="pageSize" layout="total, prev, pager, next" background :total="total"></el-pagination>
  </el-main>
</template>

<script>
import UserTest from "@/components/UserTest";
export default {
  components: {//引用组件
    UserTest
  },
  data() {
    return {
      userName: '',
      user: {},
      userData: {},
      listUser: [{}],
      dialogTitle: '增加', //窗口的名称
      addiconFormVisible: false, //判断添加的弹窗是否显示
      iconFormVisible: false, //判断编辑的弹窗是否显示
      rowIndex: null,
      search: '',
      total: 0,
      pageSize: 5,
      currentPage: 1
    }
  },
  created() {
    this.list();
  },
  methods: {
    handleSizeChange: function (size) {
      this.pageSize = size;
      console.log(this.pageSize); //每页下拉显示数据
      this.list(this.userName,this.currentPage, this.pageSize);
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
      this.list(this.userName,this.currentPage, this.pageSize);
    },
    list() {
      this.$axios.get("/user/list", {
        params:{
          name: this.userName,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.listUser = res.data.data;
        this.total = res.data.count;

      })
    },
    submitUser() {
      if (this.dialogTitle === '增加') {
        this.$axios.post("/user/insert", this.user).then(res => {
          if (res.data === 1) {
            this.openMessage('添加成功', 'success');
            this.addiconFormVisible = false;
            this.list();
          }
        })
        return;
      } else {
        this.$axios.post("/user/update", this.userData).then(res => {
          if (res.data === 1) {
            this.openMessage('修改成功', 'success');
            //关闭编辑弹窗
            this.iconFormVisible = false;
            /**
             * 修改选中列表的user对象  如果数据量大 就不要重新查询一遍数据 直接在列表中编辑值
             * this.listUser[this.rowIndex].name = this.user.name;
             * this.listUser[this.rowIndex].age = this.user.age;
             *
             */
            this.rowIndex = null;
            this.list();
          }
        })
        return;
      }
    },
    add() {
      //修改弹窗 标题
      this.dialogTitle = '增加';
      this.user = {};
      //打开添加弹窗
      this.addiconFormVisible = true;
    },
    update(index, row) {
      //修改弹窗 标题
      this.dialogTitle = '编辑';
      //打开添加弹窗
      this.iconFormVisible = true;
      //选中集合行数
      this.rowIndex = index;
      this.userData = JSON.parse(JSON.stringify(row));
    },
    remove(index, row) {
      this.$confirm(`此操作将永久删除 “${row.name}” 这条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post("/user/delete", row).then(res => {
          if (res.data === 1) {
            this.openMessage('删除成功', 'success');
            //关闭编辑弹窗
            this.iconFormVisible = false;
            // this.listUser.splice(index, 1); //删除当前listUser中的对象 不用去数据库查
            this.list();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    openMessage(name, type) {
      this.$message({
        message: name,
        type: type
      });
    }
  }
}
</script>

<style>
</style>
