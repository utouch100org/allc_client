 <template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createTableCol">
                添加
            </el-button>
        </div>

        <!-- <cusTable :tableHeader="tableHeader" :tableData="tableData"></cusTable> -->
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>

        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />
        <el-dialog :append-to-body="true" :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   <el-form-item label="列名：">
                        <el-input v-model="formData.columnName" :readonly="readonly" placeholder="请输入列名"></el-input>
                   </el-form-item>
                   <el-form-item label="列中文名称：">
                        <el-input v-model="formData.columnNameCn" :readonly="readonly" placeholder="请输入列中文名称"></el-input>
                   </el-form-item>
                   <el-form-item label="字段类型：">
                        <el-select v-model="formData.columnType" placeholder="请选择字段类型" @change="changeColType" :readonly="readonly" >
                            <el-option label="字符串" :value="1"></el-option>
                            <el-option label="数字数据" :value="2"></el-option>
                            <el-option label="日期时间" :value="3"></el-option>
                            <el-option label="是否判断" :value="4"></el-option>
                            <el-option label="二进制" :value="5"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="字段长度：">
                        <el-input-number v-model="formData.columnLength" :readonly="readonlyColLength" placeholder="请输入字段长度"></el-input-number>
                   </el-form-item>
                   <el-form-item v-if="isNumber" label="小数点：">
                        <el-input-number v-model="formData.decimalPoint" :readonly="readonly" placeholder="请输入默认值"></el-input-number>
                    </el-form-item>
                   <el-form-item label="默认值：">
                        <el-input-number v-model="formData.defaultValue" v-if="isNumber" :readonly="readonly" placeholder="请输入默认值"></el-input-number>
                        <el-input v-model="formData.defaultValue" v-if="!isNumber" :readonly="readonly" placeholder="请输入默认值"></el-input>
                   </el-form-item>
                   <el-form-item label="是否可空：">
                        <el-select v-model="formData.isNull" placeholder="是否可空" :readonly="readonly" >
                            <el-option label="不可为空" :value="0"></el-option>
                            <el-option label="可为空" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item v-if="showAutoIncrement" label="自增字段：">
                        <el-select v-model="formData.autoIncrement" placeholder="自增字段" :readonly="readonly" >
                            <el-option label="非自增" :value="0"></el-option>
                            <el-option label="自增" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="备    注：">
                        <el-input v-model="formData.remark" :readonly="readonly" placeholder="请输入备注"></el-input>
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
    import {getTableColList, getTableColById, getTableColByTid, insertTableCol, updateTableCol, delTableCol} from "@/api/allc/apitbl"
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        name: 'tableColModel',
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
                    { prop: 'columnName', label: '列名', minWidth: '80px' },
                    { prop: 'columnNameCn', label: '列中文名', minWidth: '160px'},
                    { prop: 'columnType', label: '列类型', minWidth: '160px'},
                    { prop: 'isNull', label: '是否为空', minWidth: '100px' },
                    { prop: 'remark', label: '备注', minWidth: '100px' },
                    { prop: 'validStatus', label: '是否失效' , minWidth: '80px' },
                    { prop: 'deleteStatus', label: '是否删除' , minWidth: '80px' },
                    { prop: 'oper', label: '操作', fixed: 'right', minWidth: '120px',
                        oper: [
                        { name: '查看', clickFun: this.viewTableCol },
                        { name: '编辑', clickFun: this.editTableCol },
                        { name: '删除', clickFun: this.delTableCol }
                        ]
                    }
                    ],
                queryObject:{
                    total:200,
                    tableData:[],
                    tableRecordId: '',
                    queryLimit:{
                        pagesize:100,
                        pageindex:0
                    }
                },
                formData:{},
                formDataBase: { 
                        tableRecordId: '' , /**表record_id*/ 
                        recordId: '' , /**主键*/ 
                        columnName: '' , /**英文名称*/ 
                        columnNameCn: '' , /**中文名称*/ 
                        columnType: 1 , /**字段类型*/ 
                        columnLength: 50 , /**字段长度*/ 
                        decimalPoint: 0 , /**小数点*/ 
                        defaultValue: '' , /**默认值*/ 
                        isNull: 1 , /**是否可空*/ 
                        autoIncrement: 0 , /**自增字段*/ 
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
                readonlyColLength: false,
                readonlyDecimalPoint: false,
                readonlyAutoIncrement: false,
                showDecimalPoint: true,
                showAutoIncrement: false,
                isNumber: false,
                submitShow: true,

            }
        },
        watch : {
            tableId:function(val) {
                debugger
                this.queryObject.tableData = [];
                this.getTableColList();
            }
        },
        methods:{
            getTableColList(){
                var that = this;
                // let res = await getTableColByTid({tableRecordId: this.tableId});
                // that.queryObject.tableData = res.data;
                debugger
                this.queryObject.tableRecordId = this.tableId;
                getTableColByTid({tableRecordId: this.tableId})
                    .then(res => {
                        that.queryObject.tableData = res.data.map((item) => {
                            return item;
                        });
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createTableCol(){
                var that = this;
                this.formData = this.copyData(this.formDataBase);
                this.dialogStatusText = "创建表信息"
                this.dialogStatus = "create"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                // this.clareData(that.formData);
            },
            editTableCol(row){
                var that = this;
                this.dialogStatus = "编辑表信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getTableColById({recordId: row.recordId})
                    .then(res => {
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delTableCol(row){
                var that = this;
                this.$confirm("是否确定删除表【" + row.columnNameCn + "】","提示", {})
                    .then(()=>{
                        delTableCol({recordId:row.recordId})
                            .then(res => {
                                this.getTableColList();
                                that.$message({message: '删除成功',type: 'success'})
                            })
                            .catch(()=>{})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
            },
            viewTableCol(row){
                var that = this;
                this.dialogStatus = "查看表信息"
                this.dialogStatus = "view"
                this.dialogFormVisible = true;
                this.readonly = true;
                this.submitShow = false;
                getTableColById({recordId: row.recordId})
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
                insertTableCol(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "添加成功!"});
                            this.dialogFormVisible = false;
                            this.getTableColList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            updateData(){
                debugger
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                updateTableCol(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "修改成功!"});
                            this.dialogFormVisible = false;
                            this.getTableColList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            tableCol(){
                
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
            }
        },
        created(){
            this.getTableColList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
    </style>