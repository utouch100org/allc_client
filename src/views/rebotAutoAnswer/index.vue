<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="{row}">
          <span>{{ row.recordId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="问题">
        <template slot-scope="{row}">
          <span>{{ row.question }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="机器人答案">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.rebotAutoAnswer" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.rebotAutoAnswer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="问题">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/rebotAutoAnswer'

export default {
  name: 'InlineEditTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      let reqParam = {shopId : '13631230001'}
      // reqParam['mainid'] = '13631230001'
      const { data } = await fetchList(reqParam)
      // const items = data.items
      const items = data
      var that = this;
      this.list = items.map(v => {
      // this.list = items.forEach(function(v,idx){
        that.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalRebotAutoAnswer = v.rebotAutoAnswer //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.rebotAutoAnswer = row.originalRebotAutoAnswer
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalRebotAutoAnswer = row.rebotAutoAnswer
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
