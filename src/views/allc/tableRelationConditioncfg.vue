 <template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createBiz">
                添加
            </el-button>
        </div>
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>
        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />
        <el-dialog :append-to-body="true" :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   
                    <el-form-item label="所属业务：">
                            <el-select v-model="formData.bizRecordId" placeholder="所属业务">
                                <el-option v-for="item in queryObject4Biz.belongBiz" :key="item.bizCode" :label="item.bizName" :value="item.recordId"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="所属表：">
                            <el-select v-model="formData.tableRecordId" placeholder="所属表">
                                <el-option v-for="item in queryObject4Table.belongTable" :key="item.tableCode" :label="item.tableName" :value="item.recordId"></el-option>
                            </el-select>
                    </el-form-item>
                   <el-form-item label="表英文名称：">
                        <el-input v-model="formData.tableName" :readonly="readonly" placeholder="请输入表英文名称"></el-input>
                   </el-form-item>
                   <el-form-item label="表别名：">
                        <el-input v-model="formData.tableAliasName" :readonly="readonly" placeholder="请输入表别名"></el-input>
                   </el-form-item>
                    <el-form-item label="所属数据源：">
                            <el-select v-model="formData.dataSourceGuid" placeholder="所属数据源">
                                <el-option v-for="item in queryObject4DS.belongDatasource" :key="item.recordId" :label="item.dataSourceAddress" :value="item.recordId"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="是否主表：">
                        <el-switch v-model="formData.isMasterTable" >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="关联类型：">
                            <el-select v-model="formData.relationType" placeholder="关联类型">
                                <el-option label="none 无关联【主表或单一表时】" :value="1"></el-option>
                                <el-option label="inner join 表同时存在记录时" :value="1"></el-option>
                                <el-option label="left join 被关联的表可以没有记录" :value="2"></el-option>
                                <el-option label="right join 关联的表可以没有记录" :value="3"></el-option>    
                            </el-select>
                    </el-form-item>
                   <el-form-item label="是否失效：">
                        <el-select v-model="formData.validStatus" placeholder="是否失效" :readonly="readonly" >
                            <el-option label="未设置" :value="-1"></el-option>
                            <el-option label="未失效" :value="0"></el-option>
                            <el-option label="已失效" :value="1"></el-option>
                        </el-select>
                   </el-form-item>
                   <el-form-item label="是否删除：">
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
    </div>
</template>

    <script>
    import {getBizList, getDSList} from "@/api/allc/apibiz"
    import {getTableList} from "@/api/allc/apitbl"
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        name: 'BizModel',
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
                relaData: [],
                relaDataBase: [
                    {
                        mainTable: '', // 主表
                        relaInfo: [ // 关联表信息
                            {
                                tableName: '', // 被关联表名称
                                relaConditions: [ // 关联条件
                                    {
                                        mainTableFieldName: '', // 主表关联条件
                                        relaTableFieldName: '', // 被关联表关联条件
                                        relaType: 1, // 关联类型
                                    }
                                ],
                                whereConditions: [ // where 条件
                                    {
                                        tableName: '', // 表名称
                                        fieldName: '', // 表字段
                                        conditionType: 1, // 关联类型 1 = ; 2 > ; 3 >= ; 4 < ; 5 <= ; 6 != ; 7 like ;
                                        conditionVal: ''
                                    }
                                ]
                            }
                        ]
                    }
                ],
                tableHeader : [ // 表头数据
                    { prop: 'bizRecordId', label: '所属业务', minWidth: '80px' },
                    { prop: 'tableRecordId', label: '所属表', minWidth: '120px' },
                    { prop: 'tableName', label: '表英文名称', minWidth: '80px' },
                    { prop: 'dataSourceGuid', label: '所属数据源', minWidth: '80px' },
                    { prop: 'isMasterTable', label: '是否主表', minWidth: '80px' },
                    { prop: 'relationType', label: '关联类型', minWidth: '80px' },
                    { prop: 'startDate', label: '使用开始时间', minWidth: '120px'},
                    { prop: 'endDate', label: '使用结束时间', minWidth: '120px'},
                    { prop: 'validStatus', label: '是否失效' , minWidth: '80px' },
                    { prop: 'deleteStatus', label: '是否删除' , minWidth: '80px' },
                    { prop: 'oper', label: '操作', fixed: 'right', minWidth: '160px',
                        oper: [
                        { name: '业务', clickFun: this.createBizContent },
                        { name: '查看', clickFun: this.viewBiz },
                        { name: '编辑', clickFun: this.editBiz },
                        { name: '删除', clickFun: this.delBiz }
                        ]
                    }
                    ],
                queryObject:{
                    total:200,
                    tableData: [],
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                queryObject4Biz:{
                    total:200,
                    belongBiz: [] , /**所属业务*/ 
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                queryObject4Table:{
                    total:200,
                    belongTable: [] , /**所属表*/ 
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                queryObject4DS:{
                    total:200,
                    belongDatasource: [] , /**所属数据源*/ 
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                formData:{},
                formDataBase: { 
                        recordId: '' , /**主键*/ 
                        bizRecordId: '' , /**业务record_id*/ 
                        tableRecordId: '' , /**表record_id*/ 
                        tableName: '' , /**表英文名称*/ 
                        tableAliasName: '' , /**表别名*/ 
                        dataSourceGuid: '' , /**数据源record_id*/ 
                        isMasterTable: '' , /**是否主表*/ 
                        relationType: '' , /**关联类型 ： 1：inner join 内连接；2：left join 左连接；3：right join 右连接；具体查看“枚举数据字典”表*/ 
                        remark: '' , /**备注*/ 
                        createDatetime: '' , /**记录创建时间*/ 
                        createUserId: '' , /**记录创建用户ID*/ 
                        updateDatetime: '' , /**记录更新时间*/ 
                        updateUserId: '' , /**记录更新用户ID*/ 
                        validStatus: '' , /**是否已经失效 ： 1：删除；0：未删除*/ 
                        deleteStatus: '' , /**是否删除 ： 1：删除；0：未删除*/ 
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

            }
        },
        methods:{
            async getBizList() {
                try {
                    let res = await getBizList(this.queryObject4Biz.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    this.queryObject4Biz.belongBiz = res.data
                } catch (err) {
                    console.log(err)
                    alert('请求出错')
                } 
            },
            async getTableList() {
                try {
                    let res = await getTableList(this.queryObject4Table.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    this.queryObject4Table.belongTable = res.data
                } catch (err) {
                    console.log(err)
                    alert('请求出错')
                } 
            },
            async getDSList() {
                try {
                    let res = await getDSList(this.queryObject4DS.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    this.queryObject4DS.belongDatasource = res.data
                } catch (err) {
                    console.log(err)
                    alert('请求出错')
                } 
            },
            getBizList(){
                var that = this;
                getBizList(this.queryObject.queryLimit)
                    .then(res => {
                        that.queryObject.tableData = res.data.map((item) => {
                            return item;
                        });
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createBiz(){
                var that = this;
                this.formData = this.copyData(this.formDataBase);
                this.dialogStatusText = "创建表信息"
                this.dialogStatus = "create"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                this.getBizList();
                this.getTableList();
                this.getDSList();
            },
            editBiz(row){
                debugger
                var that = this;
                this.dialogStatus = "编辑表信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getBizById({recordId: row.recordId})
                    .then(res => {
                        this.getBizList();
                        this.getTableList();
                        this.getDSList();
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delBiz(row){
                var that = this;
                this.$confirm("是否确定删除表【" + row.BizAddress + "】","提示", {})
                    .then(()=>{
                        delBiz({recordId:row.recordId})
                            .then(res => {
                                this.getBizList();
                                that.$message({message: '删除成功',type: 'success'})
                            })
                            .catch(()=>{})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
            },
            viewBiz(row){
                var that = this;
                this.dialogStatus = "查看表信息"
                this.dialogStatus = "view"
                this.dialogFormVisible = true;
                this.readonly = true;
                this.submitShow = false;
                getBizById({recordId: row.recordId})
                    .then(res => {
                        this.getBizList();
                        this.getTableList();
                        this.getDSList();
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createBizContent(row){
                
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
                insertBiz(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "添加成功!"});
                            this.dialogFormVisible = false;
                            this.getBizList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            updateData(){
                debugger
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                updateBiz(this.formData)
                    .then(res => {
                        debugger
                        if (res.data == 1){
                            this.$message({type: 'success', message: "修改成功!"});
                            this.dialogFormVisible = false;
                            this.getBizList();
                        }
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            Biz(){
                
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
            this.getBizList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
    </style>
