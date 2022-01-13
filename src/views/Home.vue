<template>
  <div class="basic-layout">
    <div class="nav-side">
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span>購物車</span>
      </div>
    </div>

    <div :class="'content-right'">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">前端仿購物車Demo</div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="false" class="notice">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown>
            <span class="user-link">
              {{ userInfo.userName }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >信箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <!-- 內容 -->
        <div class="main-page">
          <br />
          <div style="text-align: center">
            <el-button @click="addProduct(0)" :disabled="disabled"
              >增加商品1</el-button
            >
            <el-button @click="addProduct(1)" :disabled="disabled"
              >增加商品2</el-button
            >
            <el-button @click="addProduct(2)" :disabled="disabled"
              >增加商品3</el-button
            >
          </div>

          <h3>商品購買量記錄</h3>
          <!-- 商品一覽表 -->
          <el-table :data="shoppingCartArray" style="width: 100%">
            <el-table-column prop="name" label="商品名稱" width="180" />
            <el-table-column prop="price" label="商品價格" width="180">
              <template #default="scope">
                <span>{{ setFormat(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="預計購買數量" />
            <el-table-column prop="total" label="總計" width="180">
              <template #default="scope">
                <span>{{ setFormat(scope.row.total) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="option" label="操作">
              <template #default="scope">
                <el-row>
                  <el-col :span="12">
                    <div style="width: 70%">
                      <el-input
                        type="number"
                        v-model="scope.row.inputNum"
                        placeholder="請輸入要購買的商品數量"
                        maxlength="1"
                        min="1"
                        max="9"
                      ></el-input>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      type="primary"
                      @click="updateProduct(scope.row, 'plus')"
                      :disabled="disabled"
                      >新增</el-button
                    >
                    <el-button
                      type="warning"
                      @click="updateProduct(scope.row, 'subtraction')"
                      :disabled="disabled"
                      >減少</el-button
                    >

                    <el-button
                      type="danger"
                      @click="removeProduct(scope.row.pid)"
                      :disabled="disabled"
                      >移除</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 50px; text-align: center">
            <el-button @click="calTotalPrice()" :disabled="disabled"
              >計算購物車總價</el-button
            >
          </div>

          <div style="text-align: center" v-if="totalPrice !== 0">
            您這筆訂單全部商品價格一共是{{ totalPrice }}元
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 部分引用模組，避免浪費
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "Home",
  data() {
    return {
      // 按鈕禁止是否開啟
      disabled: false,
      // 購物車清單
      shoppingCartArray: [],
      // 商品清單
      productList: [
        {
          pid: "p1",
          name: "【商品一】前端課程",
          price: 1000,
          num: 1,
          inputNum: 1,
        },
        {
          pid: "p2",
          name: "【商品二】後端課程",
          price: 2000,
          num: 1,
          inputNum: 1,
        },
        {
          pid: "p3",
          name: "【商品三】AI課程",
          price: 2500,
          num: 1,
          inputNum: 1,
        },
      ],
      // 商品總價
      totalPrice: 0,
      // 用戶資訊
      userInfo: {
        userName: "考拉",
        userEmail: "koala@interview.com",
      },
    };
  },

  methods: {
    /**
     * 設定購物車清單（API）
     * @return  void
     */
    getShoppingCartList() {
      this.$api.getProductList().then((res) => {
        // 取得商品資料
        this.shoppingCartArray = res.data;
      });
    },

    /**
     * 新增商品至購物車（API）
     * @param   number  index  商品索引（用於查找productList陣列內的商品）
     * @return  void
     */
    addProduct(index) {
      // 商品清單並不提供該商品時，則退出
      if (this.productList[index] == void 0) return;

      // 按鈕禁止
      this.disabled = true;

      // 新增資料
      this.$api
        .addProduct(this.productList[index])
        .then((res) => {
          if (res.code === 1) {
            // 提示訊息
            ElMessage.success(res.message);
            // 刷新介面
            this.getShoppingCartList();
          } else {
            // 提示訊息
            ElMessage.warning(res.message);
          }
        })
        .catch((err) => console.error(err))
        .then(() => (this.disabled = false));
    },

    /**
     * 更新購物車中的商品數量（API）
     * @param   obj     row  要更新的產品資訊
     * @param   string  type 判斷新增 或 更新
     */
    updateProduct(row, type = "plus") {
      // 避免使用者輸入一些奇怪的參數
      if (parseInt(row.inputNum).toString() === 'NaN') {
        ElMessage.warning('請輸入數字');
        return;
      } 
　　
      // 若type不為加及減，則退出
      if (type !== "plus" && type !== "subtraction") return;

      // 址相加/相減，等於目前購買數量
      if (type === "plus") {
        row.num += parseInt(row.inputNum, 10);
      } else {
        // 若要減少的商品數量大於現在購物車數量，則提示並離開
        if (row.inputNum >= row.num) {
          ElMessage.warning(
            "您現在的商品數量並沒有這麼多，請確認減少數量後重試！"
          );
          return;
        }
        row.num -= parseInt(row.inputNum, 10);
      }

      // 要新增或更新的參數
      let data = {
        pid: row.pid,
        num: row.num,
      };

      // 按鈕禁止
      this.disabled = true;
      // 更新資料
      this.$api
        .updateProductNum(data)
        .then((res) => {
          if (res.code === 3) {
            // 計算總價格
            row.total = parseInt(row.num, 10) * parseInt(row.price, 10);
            // 提示訊息
            ElMessage.success(res.message);
          } else {
            // 提示訊息
            ElMessage.warning(res.message);
          }
        })
        .catch((err) => console.error(err))
        .then(() => (this.disabled = false));
    },

    /**
     * 移除購物車的商品（API）
     * @param   string  pid  商品編號（only key）
     * @return  void
     */
    removeProduct(pid) {
      ElMessageBox.confirm("您是否確定要從購物車中移除這一項產品？", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        this.disabled = true;
        // 移除商品
        this.$api
          .removeProduct(pid)
          .then((res) => {
            if (res.code === 2) {
              // 提示訊息
              ElMessage.success(res.message);
              // 刷新介面
              this.getShoppingCartList();
            } else {
              // 提示訊息
              ElMessage.warning(res.message);
            }
          })
          .catch((err) => console.error(err))
          .then(() => (this.disabled = false));
      });
    },

    /**
     * 計算現有購物車總價格（API）
     * 說明：後端透過Session進行儲存，這邊會把請求回傳至後端，讓後端計算Session中所有商品的價格後，再回傳至前端
     * @return  void
     */
    calTotalPrice() {
      if (this.shoppingCartArray.length === 0) {
        ElMessage.warning(
          "目前您的購物車沒有商品！請先點擊上方增加商品的按鈕哦！"
        );
      }

      // 禁止
      this.disabled = true;
      // 計算總價格

      // 計算購物車總價格
      this.$api
        .getTotalPrice()
        .then((res) => {
          this.totalPrice = this.setFormat(res.data.count);
        })
        .catch((err) => console.error(err))
        .then(() => (this.disabled = false));
    },

    /**
     * 千位符號
     * 說明：將字串正則為千位符號逗號，並回傳字串
     * @param   string  n
     * @return  string
     */
    setFormat(n) {
      return String(n).replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
  },

  mounted() {
    // 取得商品購買記錄
    this.getShoppingCartList();
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
