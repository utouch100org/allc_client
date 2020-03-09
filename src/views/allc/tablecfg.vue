 <template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createTable">
                添加
            </el-button>
        </div>

        <!-- <cusTable :tableHeader="tableHeader" :tableData="tableData"></cusTable> -->
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>

        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />

        <el-dialog :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   <el-form-item label="表编码：">
                        <el-input v-model="formData.tableCode" :readonly="readonly" placeholder="请输入表编码"></el-input>
                   </el-form-item>
                   <el-form-item label="表英文名称：">
                        <el-input v-model="formData.tableName" :readonly="readonly" placeholder="请输入表英文名称"></el-input>
                   </el-form-item>
                   <el-form-item label="表中文名称：">
                        <el-input v-model="formData.tableNameCn" :readonly="readonly" placeholder="请输入中文表名称"></el-input>
                   </el-form-item>
                   <el-form-item label="备    注：">
                        <el-input v-model="formData.remark" :readonly="readonly" placeholder="请输入备注"></el-input>
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
        <el-dialog customClass="customWidth" :append-to-body="true" :title="dialogTableColText" :visible.sync="dialogTableColFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px;">
            <tableColMode :tableId="tableId"></tableColMode>
        </el-dialog>
    </div>
</template>

    <script>
    import {getTableList, getTableById, insertTable, updateTable, delTable} from "@/api/allc/apitbl"
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"

    import tableColMode from '@/views/allc/tablecolumncfg'
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        components:{
            'cusTable' : cTable,
            'tableColMode': tableColMode,
            pagination : Pagination
        },
        data() {
            return {
                tableHeader : [ // 表头数据
                    { prop: 'tableCode', label: '表编号', minWidth: '80px' },
                    { prop: 'tableName', label: '英文名称', minWidth: '160px'},
                    { prop: 'tableNameCn', label: '中文名称', minWidth: '160px'},
                    { prop: 'remark', label: '备注', minWidth: '100px' },
                    { prop: 'validStatus', label: '是否失效' , minWidth: '80px' },
                    { prop: 'deleteStatus', label: '是否删除' , minWidth: '80px' },
                    { prop: 'oper', label: '操作', fixed: 'right', minWidth: '160px',
                        oper: [
                        { name: '表列', clickFun: this.tableCol },
                        { name: '查看', clickFun: this.viewTable },
                        { name: '编辑', clickFun: this.editTable },
                        { name: '删除', clickFun: this.delTable }
                        ]
                    }
                    ],
                    tableColProps:{
                        tableId: ""
                    },
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
                        tableCode: '' , /**表编号*/ 
                        tableType: 1 , /**表类型 ： 1：基础表；2：业务表；3：字段表；4：......*/ 
                        tableName: '' , /**英文名称*/ 
                        tableNameCn: '' , /**中文名称*/ 
                        remark: '' , /**备注*/ 
                        createDatetime: '' , /**记录创建时间*/ 
                        createUserId: '' , /**记录创建用户ID*/ 
                        updateDatetime: '' , /**记录更新时间*/ 
                        updateUserId: '' , /**记录更新用户ID*/ 
                        validStatus: 0 , /**是否已经失效 ： 1：删除；0：未删除*/ 
                        deleteStatus: 0 , /**是否删除 ： 1：删除；0：未删除*/ 
                    },
                dialogFormVisible: false,
                dialogStatus: "",
                dialogStatusText: "",
                readonly: false,
                submitShow: true,

                tableId: '',
                dialogTableColText: '',
                dialogTableColFormVisible: false

            }
        },
        methods:{
            getTableList(){
                getTableList(this.queryObject.queryLimit)
                    .then(res => {
                        debugger
                        this.queryObject.tableData = res.data.map((item) => {
                            return item;
                        });
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createTable(){
                var that = this;
                this.formData = this.copyData(this.formDataBase);
                this.dialogStatusText = "创建表信息"
                this.dialogStatus = "create"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                // this.clareData(that.formData);
            },
            editTable(row){
                var that = this;
                this.dialogStatusText = "编辑表信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getTableById({recordId: row.recordId})
                    .then(res => {
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delTable(row){
                var that = this;
                this.$confirm("是否确定删除表【" + row.tableName + "】","提示", {})
                    .then(()=>{
                        delTable({recordId:row.recordId})
                            .then(res => {
                                this.getTableList();
                                that.$message({message: '删除成功',type: 'success'})
                            })
                            .catch(()=>{})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
            },
            viewTable(row){
                var that = this;
                this.dialogStatusText = "查看表信息"
                this.dialogStatus = "view"
                this.dialogFormVisible = true;
                this.readonly = true;
                this.submitShow = false;
                getTableById({recordId: row.recordId})
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
                insertTable(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "添加成功!"});
                            this.dialogFormVisible = false;
                            this.getTableList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            updateData(){
                updateTable(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "修改成功!"});
                            this.dialogFormVisible = false;
                            this.getTableList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            tableCol(row){
                this.tableId = row.recordId;
                this.dialogTableColText = row.tableNameCn;
                this.dialogTableColFormVisible = true;
            }
        },
        created(){
            this.getTableList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
        .customWidth{
            width: 90%
        }
    </style>