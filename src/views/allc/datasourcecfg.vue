 <template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createDataSource">
                添加
            </el-button>
        </div>
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>
        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />
        <el-dialog :append-to-body="true" :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   <el-form-item label="数据源类型：">
                        <el-select v-model="formData.dataSourceTypeRecordId" placeholder="数据源类型" @change="changeDSType" :readonly="readonly" >
                            <el-option label="MYSQL" :value="'1'"></el-option>
                            <el-option label="SQLSERVER" :value="'2'"></el-option>
                            <el-option label="ORACLE" :value="'3'"></el-option>
                            <el-option label="内嵌数据库" :value="'4'"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="数据源名称：">
                        <el-input v-model="formData.dataSourceName" :readonly="readonly" placeholder="请输入数据源名称"></el-input>
                   </el-form-item>
                   <el-form-item label="数据源地址：">
                        <el-input v-model="formData.dataSourceAddress" :readonly="readonly" placeholder="请输入数据源地址"></el-input>
                   </el-form-item>
                   <el-form-item label="实例名称：">
                        <el-input v-model="formData.dataSourceInstanceName" :readonly="readonly" placeholder="请输入实例名称"></el-input>
                   </el-form-item>
                   <el-form-item label="登录账号：">
                        <el-input v-model="formData.account" :readonly="readonly" placeholder="请输入登录账号"></el-input>
                   </el-form-item>
                   <el-form-item label="登录密码：">
                        <el-input v-model="formData.password" :readonly="readonly" placeholder="请输入登录密码"></el-input>
                   </el-form-item>
                   <el-form-item label="参数：">
                        <el-input v-model="formData.params" :readonly="readonly" placeholder="请输入参数"></el-input>
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
                        <el-select v-model="formData.validStatus" placeholder="是否失效" :readonly="readonly" >
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="未失效" :value="0"></el-option>
                            <el-option label="已失效" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="是否删除">
                        <el-select v-model="formData.deleteStatus" placeholder="是否删除" :readonly="readonly" >
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="未删除" :value="0"></el-option>
                            <el-option label="已删除" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="备    注：">
                        <el-input v-model="formData.remark" :readonly="readonly" placeholder="请输入备注"></el-input>
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
        <el-dialog :append-to-body="true" :title="dsTablesObject.dialogTableManagerText" :visible.sync="dsTablesObject.dialogFormTableManagerVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
                <el-table ref="multipleTable" :data="dsTablesObject.tableData" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleDsTablesSelectionChange">
                    <el-table-column type="selection" width="55" :selectable='dsTableSelectInit'>
                    </el-table-column>
                    <el-table-column  prop="tableNameCn" label="表中文名称" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column  prop="tableName" label="表英文名称" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dsTablesObject.dialogFormTableManagerVisible = false">
            取消
            </el-button>
            <el-button type="primary" @click="updatedDsTablesData()">
            确定
            </el-button>
        </div>
        </el-dialog>
    </div>
</template>

    <script>
    import {getDSList, getDSById, insertDS, updateDS, delDS} from "@/api/allc/apibiz"
    import {getTableList, getdstbllistbydsid, savedstbllist} from "@/api/allc/apitbl"
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        name: 'DataSourceModel',
        props: {
            tableId:{
                type: String,
                default: function(){
                    return ''
                }
            }
        },
        components:{
            'cusTable' : cTable,
            pagination : Pagination
        },
        data() {
            return {
                tableHeader : [ // 表头数据
                    { prop: 'dataSourceName', label: '数据源名称', minWidth: '120px' },
                    { prop: 'dataSourceAddress', label: '数据源地址', minWidth: '100px' },
                    { prop: 'startDate', label: '使用开始时间', minWidth: '120px'},
                    { prop: 'endDate', label: '使用结束时间', minWidth: '120px'},
                    { prop: 'stopStatus', label: '是否停用', minWidth: '60px' },
                    { prop: 'validStatus', label: '是否失效' , minWidth: '60px' },
                    { prop: 'deleteStatus', label: '是否删除' , minWidth: '60px' },
                    { prop: 'oper', label: '操作', fixed: 'right', minWidth: '120px',
                        oper: [
                        { name: '查看', clickFun: this.viewDataSource },
                        { name: '编辑', clickFun: this.editDataSource },
                        { name: '删除', clickFun: this.delDataSource },
                        { name: '表管理', clickFun: this.tableMgr }
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
                formDataBase:  { 
                        recordId: '' , /**主键*/ 
                        dataSourceName: '' , /**数据源名称*/ 
                        dataSourceTypeRecordId: "1" , /**数据源类型record_id*/ 
                        dataSourceAddress: '' , /**数据源地址*/ 
                        dataSourceInstanceName: '' , /**数据源实例名称*/ 
                        account: '' , /**数据源登录账号*/ 
                        password: '' , /**数据源登录密码*/ 
                        startDate: '' , /**使用开始时间*/ 
                        endDate: '' , /**使用结束时间*/ 
                        validStatus: 0 , /**是否已经失效 ： 1：删除；0：未删除*/ 
                        deleteStatus: 0 , /**是否删除 ： 1：删除；0：未删除*/ 
                        remark: '' , /**备注*/ 
                        params: '' , /**数据源参数*/ 
                        stopStatus: 0 , /**是否停用*/ 
                        createDatetime: '' , /**记录创建时间*/ 
                        createUserId: '' , /**记录创建用户ID*/ 
                        updateDatetime: '' , /**记录更新时间*/ 
                        updateUserId: '' , /**记录更新用户ID*/ 
                    },
                dialogFormVisible: false,
                dialogStatus: "",
                dialogStatusText: "",
                readonly: false,
                readonlyColLength: false,
                readonlyDecimalPoint: false,
                readonlyAutoIncrement: false,
                showDecimalPoint: true,
                showAutoIncrement: true,
                isNumber: false,
                submitShow: true,
                // dsTtablesData: [{
                //     recordId: '2016-05-03',
                //     tableNameCn: '王小虎',
                //     tableName: '上海市普陀区金沙江路 1518 弄'
                //     }, {
                //     recordId: '2016-05-02',
                //     tableNameCn: '王小虎',
                //     tableName: '上海市普陀区金沙江路 1518 弄'
                //     }, {
                //     datrecordIde: '2016-05-04',
                //     tableNameCn: '王小虎',
                //     tableName: '上海市普陀区金沙江路 1518 弄'
                //     }
                // ],
                dsTablesObject:{
                    tableData:[],
                    tableSelectedData:[],
                    dsTablesMultipleSelection: [],
                    currentDsRow: null,
                    queryLimit:{
                        pagesize:100,
                        pageindex:0
                    },
                    total:200,
                    dialogTableManagerText: "数据源表管理",
                    dialogFormTableManagerVisible: false
                }
            }
        },
        methods:{
            getDataSourceList(){
                var that = this;
                getDSList(this.queryObject.queryLimit)
                    .then(res => {
                        that.queryObject.tableData = res.data.map((item) => {
                            return item;
                        });
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createDataSource(){
                var that = this;
                this.formData = this.copyData(this.formDataBase);
                this.dialogStatusText = "创建表信息"
                this.dialogStatus = "create"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                // this.clareData(that.formData);
            },
            editDataSource(row){
                var that = this;
                this.dialogStatus = "编辑表信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getDSById({recordId: row.recordId})
                    .then(res => {
                        debugger
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delDataSource(row){
                var that = this;
                this.$confirm("是否确定删除表【" + row.dataSourceAddress + "】","提示", {})
                    .then(()=>{
                        delDS({recordId:row.recordId})
                            .then(res => {
                                this.getDataSourceList();
                                that.$message({message: '删除成功',type: 'success'})
                            })
                            .catch(()=>{})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
            },
            tableMgr(row){
                debugger
                var that = this;
                this.dsTablesObject.currentDsRow = row;
                this.dsTablesObject.dialogFormTableManagerVisible = true;
                this.getDSTableList(row.recordId);
            },
            getDSTableList(dsRecordId){
                var that = this;
                that.dsTablesObject.tableData = [];

                getdstbllistbydsid({dsRecordId: dsRecordId})
                    .then(res => {
                        that.dsTablesObject.tableSelectedData = res.data;
                        // that.dsTablesObject.dsTablesMultipleSelection = res.data;

                        getTableList(that.dsTablesObject.queryLimit)
                            .then(res => {
                                that.dsTablesObject.tableData = res.data;

                            })
                            .catch(() => {})
                            .finally(() => {})
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            viewDataSource(row){
                var that = this;
                this.dialogStatus = "查看表信息"
                this.dialogStatus = "view"
                this.dialogFormVisible = true;
                this.readonly = true;
                this.submitShow = false;
                getDSById({recordId: row.recordId})
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
                debugger
                this.formData.recordId = this.uuid;
                this.formData.tableRecordId = this.tableId;
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                insertDS(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "添加成功!"});
                            this.dialogFormVisible = false;
                            this.getDataSourceList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            updateData(){
                debugger
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                updateDS(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "修改成功!"});
                            this.dialogFormVisible = false;
                            this.getDataSourceList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            DataSource(){
                
            },
            changeColType(selVal, selText, obj){
                if (selVal != 2){
                    this.showDecimalPoint = false;
                    this.showAutoIncrement = false;
                    this.isNumber = false;
                    this.formData.defaultValue = '';
                }else{
                    this.showDecimalPoint = true;
                    this.showAutoIncrement = true;
                    this.isNumber = true;
                    this.formData.defaultValue = '0';
                }
            },
            updatedDsTablesData(){
                debugger;
                var dsRecordId = this.dsTablesObject.currentDsRow.recordId;
                var tblRecordId = this.dsTablesObject.dsTablesMultipleSelection[0].recordId;
                this.dsTablesObject.currentDsRow = null;
                var tableRids = [];
                this.dsTablesObject.dsTablesMultipleSelection.forEach(function(item, idx){
                    let tblRecordId = item.recordId;
                    tableRids.push(tblRecordId);
                })
                
                if (tableRids.length == 0){
                    this.$message.warning("请选择创建的表!");
                    return ;
                }

                var saveData = {
                    dsRId: dsRecordId,
                    tableRids: tableRids
                }
                savedstbllist(saveData)
                    .then(res => {
                        debugger
                        if (res.code == 0){
                            this.$message({type: 'success', message: "修改成功!"});
                            this.dsTablesObject.dialogFormTableManagerVisible = false;
                            // this.getDSTableList(dsRecordId);
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            handleDsTablesSelectionChange(val) {
                this.dsTablesObject.dsTablesMultipleSelection = val;
            },
            dsTableSelectInit(row,index){
                var that = this;
                for(var idx in that.dsTablesObject.tableSelectedData){
                    if (row.recordId == that.dsTablesObject.tableSelectedData[idx].tableRecordId){
                        return false;
                    }
                }
                return true;
                // debugger;
                // if (index % 2 == 0){
                //     this.dsTablesObject.dsTablesMultipleSelection.push(row);
                //     return false;
                // }else{
                //     return true;
                // }
            }
        },
        created(){
            this.getDataSourceList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
    </style>


