 <template>
    <div class="app-container">
        <div class="filter-container">
            <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
                <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                Search
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
                Add
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                Export
            </el-button>
            <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
                reviewer
            </el-checkbox> -->
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createSys">
                添加
            </el-button>
        </div>

        <!-- <cusTable :tableHeader="tableHeader" :tableData="tableData"></cusTable> -->
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>

        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />

        <el-dialog :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   <el-form-item label="系统编码：">
                        <el-input v-model="formData.sysCode" :readonly="readonly" placeholder="请输入系统代码"></el-input>
                        <!-- <el-input placeholder="请输入地区代码"></el-input> -->
                   </el-form-item>
                   <el-form-item label="系统名称：">
                        <el-input v-model="formData.sysName" :readonly="readonly" placeholder="请输入系统名称"></el-input>
                   </el-form-item>
                   <el-form-item label="备    注：">
                        <el-input v-model="formData.remark" :readonly="readonly" placeholder="请输入备注"></el-input>
                   </el-form-item>
                   <el-form-item label="使用开始时间：">
                       <el-date-picker v-model="formData.startDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                   </el-form-item>
                   <el-form-item label="使用结束时间：">
                        <el-date-picker v-model="formData.endDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                   </el-form-item>
                   <el-form-item label="是否停用">
                        <el-select v-model="formData.stopStatus" placeholder="是否停用">
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="启用" :value="0"></el-option>
                            <el-option label="停用" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="是否失效">
                        <el-select v-model="formData.validStatus" placeholder="是否失效">
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="未失效" :value="0"></el-option>
                            <el-option label="已失效" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="是否删除">
                        <el-select v-model="formData.deleteStatus" placeholder="是否删除">
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="未删除" :value="0"></el-option>
                            <el-option label="已删除" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
               </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
            取消
            </el-button>
            <el-button v-if="submitShow" type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确定
            </el-button>
        </div>
        </el-dialog>
    </div>
</template>

    <script>
    import {getSysList, getSysById, insertSys, updateSys, delSys} from "@/api/allc/apisys"
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        components:{
            'cusTable' : cTable,
            pagination : Pagination
        },
        data() {
            return {
                tableHeader : [ // 表头数据
                    { prop: 'sysCode', label: '系统编码', minWidth: '80px' },
                    { prop: 'sysName', label: '系统名称', minWidth: '160px'},
                    { prop: 'remark', label: '备注', minWidth: '100px' },
                    { prop: 'startDate', label: '使用开始时间' , minWidth: '120px' },
                    { prop: 'endDate', label: '使用结束时间' , minWidth: '120px' },
                    { prop: 'stopStatus', label: '是否停用' , minWidth: '80px' },
                    { prop: 'validStatus', label: '是否失效' , minWidth: '80px' },
                    { prop: 'deleteStatus', label: '是否删除' , minWidth: '80px' },
                    { prop: 'oper', label: '操作', fixed: 'right', minWidth: '120px',
                        oper: [
                        { name: '查看', clickFun: this.viewSys },
                        { name: '编辑', clickFun: this.editSys },
                        { name: '删除', clickFun: this.delSys }
                        ]
                    }
                    ],
                queryObject:{
                    total:200,
                    tableData:[],
                    queryLimit:{
                        pagesize:100,
                        pageindex:0
                    }
                },
                formData:{},
                formDataBase:{ 
                    recordId: '' , /**主键*/ 
                    sysCode: '' , /**系统编码*/ 
                    sysName: '' , /**系统名称*/ 
                    imgUrl: '' , /**图标地址*/ 
                    remark: '' , /**备注*/ 
                    startDate: dateNow , /**使用开始时间*/ 
                    endDate: dateNow , /**使用结束时间*/ 
                    stopStatus: 0 , /**是否停用*/ 
                    createDatetime: dateNow , /**记录创建时间*/ 
                    createUserId: '' , /**记录创建用户ID*/ 
                    updateDatetime: dateNow , /**记录更新时间*/ 
                    updateUserId: '' , /**记录更新用户ID*/ 
                    validStatus: 0 , /**是否已经失效 ： 1：删除；0：未删除*/ 
                    deleteStatus: 0 , /**是否删除 ： 1：删除；0：未删除*/ 
                    },
                dialogFormVisible: false,
                dialogStatus: "",
                dialogStatusText: "",
                readonly: false,
                submitShow: true

            }
        },
        methods:{
            getSysList(){
                getSysList(this.queryObject.queryLimit)
                    .then(res => {
                        this.queryObject.tableData = res.data.map((item) => {
                            return item;
                        });
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createSys(row){
                var that = this;
                this.formData = this.copyData(this.formDataBase);
                this.dialogStatusText = "创建系统信息"
                this.dialogStatus = "create"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                // this.clareData(that.formData);
            },
            editSys(row){
                var that = this;
                this.dialogStatus = "编辑系统信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getSysById({recordId: row.recordId})
                    .then(res => {
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delSys(row){
                var that = this;
                this.$confirm("是否确定删除系统【" + row.sysName + "】","提示", {})
                    .then(()=>{
                        delSys({recordId:row.recordId})
                            .then(res => {
                                this.getSysList();
                                that.$message({message: '删除成功',type: 'success'})
                            })
                            .catch(()=>{})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
            },
            viewSys(row){
                var that = this;
                this.dialogStatus = "查看地区数据"
                this.dialogStatus = "view"
                this.dialogFormVisible = true;
                this.readonly = true;
                this.submitShow = false;
                getSysById({recordId: row.recordId})
                    .then(res => {
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            rowDblclick(){
                // this.$message({type: 'success', message: "rowDblclick!"});
            },
            createData(){
                this.formData.recordId = uuid;
                insertSys(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "系统信息添加成功!"});
                            this.dialogFormVisible = false;
                            this.getSysList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            updateData(){
                updateSys(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "系统信息修改成功!"});
                            this.dialogFormVisible = false;
                            this.getSysList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            }
        },
        created(){
            this.getSysList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
    </style>