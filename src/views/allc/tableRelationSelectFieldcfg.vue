 <template>
    <div class="app-container">
        <b>业务名称：{{bizName}}
        ___________________________________________________________________________________________________________________________________________________________________________
        </b>
        ===========================================================================================================================================================================
        
        <el-row v-for="mainItem in relaData">
            <el-row>
                <el-col class="col40">
                    业务名称：{{bizName}}
                    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createMainTable">
                        添加
                    </el-button>
                </el-col>
            </el-row>
            <el-row>
                
                ___________________________________________________________________________________________________________________________________________________________________________
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </el-row>
            <el-row v-for="item in mainItem.relaInfo">
                <template>
                    <el-row class="mainTable">
                        <el-col class="colLabel">关 联 表：</el-col>
                        <el-col :span="20">
                            <el-select v-model="item.mainTable" placeholder="所属表">
                                <el-option v-for="item in tables" :key="item.tableCode" :label="item.tableName" :value="item.recordId"></el-option>
                            </el-select>
                            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createRelaTable(item)">
                                添加
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <template>
                            <el-row class="relaType">
                                <el-col class="col40">
                                    关联类型：
                                    <el-select v-model="formData.tableRecordId" placeholder="关联类型">
                                        <el-option v-for="item in relaTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    被关联表：
                                    <el-select v-model="formData.tableRecordId" placeholder="被关联表">
                                        <el-option v-for="item in tables" :key="item.tableCode" :label="item.tableName" :value="item.recordId"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col class="col30">
                                    关联表字段：
                                    <el-select v-model="formData.tableRecordId" placeholder="关联表字段">
                                        <el-option v-for="item in getTableCols(111)" :key="item.tableCode" :label="item.tableName" :value="item.recordId"></el-option>
                                    </el-select>
                                    关联条件：
                                    <el-select v-model="formData.tableRecordId" placeholder="关联条件">
                                        <el-option v-for="item in whereConditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    被关联表字段：
                                    <el-select v-model="formData.tableRecordId" placeholder="被关联表字段">
                                        <el-option v-for="item in getTableCols(222)" :key="item.tableCode" :label="item.tableName" :value="item.recordId"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        </template>
                    </el-row>
                </template>
            </el-row>
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </el-row>
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
            bizRecordId:{
                type: String,
                default: function(){
                    return 'aasfasdfsdfsdf'
                }
            },
            bizName:{
                type: String,
                default: function(){
                    return '用户信息查询'
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
                        dsRecordId: '', // 数据源
                        relaInfo: [ // 关联表信息
                            {
                                tableName: '', // 被关联表名称
                                dsRecordId: '', // 数据源
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
                            },
                            {
                                tableName: '', // 被关联表名称
                                dsRecordId: '', // 数据源
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
                    },
                    {
                        mainTable: '', // 主表
                        dsRecordId: '', // 数据源
                        relaInfo: [ // 关联表信息
                            {
                                tableName: '', // 被关联表名称
                                dsRecordId: '', // 数据源
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
                relaDataMainTableBase:{
                        mainTable: '', // 主表
                        dsRecordId: '', // 数据源
                        relaInfo: [ // 关联表信息
                        ]
                    },
                relaDataRelaTableBase:{
                        tableName: '', // 被关联表名称
                        dsRecordId: '', // 数据源
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
                    },
                tables: [
                    {
                        recordId: '111' , /**主键*/ 
                        tableNameCn: 'tableA' , /**中文名称*/ 
                    },
                    {
                        recordId: '222' , /**主键*/ 
                        tableNameCn: 'tableB' , /**中文名称*/ 
                    },
                    {
                        recordId: '333' , /**主键*/ 
                        tableNameCn: 'tableC' , /**中文名称*/ 
                    }
                ],
                tableCols: [{
                        tableRecordId: '111' , /**表record_id*/ 
                        recordId: '1111' , /**主键*/ 
                        columnNameCn: 'cc1' , /**中文名称*/ 
                    },{
                        tableRecordId: '111' , /**表record_id*/ 
                        recordId: '1112' , /**主键*/ 
                        columnNameCn: 'cc12' , /**中文名称*/ 
                    },{
                        tableRecordId: '222' , /**表record_id*/ 
                        recordId: '221111' , /**主键*/ 
                        columnNameCn: 'cc2' , /**中文名称*/ 
                    },{
                        tableRecordId: '333' , /**表record_id*/ 
                        recordId: '331111' , /**主键*/ 
                        columnNameCn: 'cc3' , /**中文名称*/ 
                    }],
                relaTypes: [
                    { 
                        value: 1,
                        label: "none 无关联【主表或单一表时】"
                    },
                    { 
                        value: 2,
                        label: "inner join 表同时存在记录时"
                    },
                    { 
                        value: 3,
                        label: "left join 被关联的表可以没有记录"
                    },
                    { 
                        value: 4,
                        label: "right join 关联的表可以没有记录"
                    }
                ],
                whereConditions:[ // 1 = ; 2 > ; 3 >= ; 4 < ; 5 <= ; 6 != ; 7 like 
                    {
                        value: 1,
                        label: '= 等于'
                    },
                    {
                        value: 2,
                        label: '> 大于'
                    },
                    {
                        value: 3,
                        label: '>= 大于等于'
                    },
                    {
                        value: 4,
                        label: '< 大于'
                    },
                    {
                        value: 5,
                        label: '<= 小于等于'
                    },
                    {
                        value: 6,
                        label: '!= 不等于'
                    },
                    {
                        value: 7,
                        label: 'LIKE 相似'
                    },
                    {
                        value: 8,
                        label: 'NOT LIKE 不相似'
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
            },
            getTableCols(){
                return this.tableCols;
            },
            createMainTable(){
                this.$message.info("createMainTable")
            },
            createRelaTable(item){
                debugger
                this.$message.info("createRelaTable")
            }
        },
        created(){
            this.relaData = this.copyData(this.relaDataBase);
            this.getBizList();
        }
    }
    </script>

    <style>
        .filter-container{
            float: right;
        }
        .mainTable{
            background-color: cadetblue
        }
        .relaType{
            background-color: burlywood
        }
        .colLabel{
            width:120px; 
            text-align: right;
        }
        .colInput{
            width:160px; 
        }
        .col40{
            padding-left: 35px;
        }
        .col30{
            padding-left: 20px;
        }
    </style>
