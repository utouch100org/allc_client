 <template>
    <div class="app-container">
        <el-row>
            <el-col :span="12">
                <el-row class="titleClass">
                    <el-col :span="7"><b>业务名称：{{bizName}}</b></el-col>
                    <el-col :span="26">
                    <el-button class="filter-item" @click="saveBiz">
                        保存业务配置
                    </el-button>
                    <el-button class="filter-item" @click="testBiz">
                        测试业务结果
                    </el-button>
                    <el-button class="filter-item" @click="dataUpdateConfig">
                        数据更新配置
                    </el-button>
                    </el-col>
                </el-row>
                <el-row style="padding-top:5px;">

                    <el-col :span="3" style="text-align: right;">
                        请求参数：
                        <div class="el-table-add-row" style="width: 50px;" @click="addParam()"><span>+ 添加</span></div>
                    </el-col>
                    <el-col :span="21">
                        <el-row>
                            <el-col :span="24">
                                <el-table size="mini" :data="bizQueryParams.data" border style="width: 500px" highlight-current-row>
                                    <el-table-column type="index"></el-table-column>
                                    <el-table-column v-for="(v,i) in bizQueryParams.columns" :prop="v.field" :style="v.style" :label="v.title" :min-width="v.width" v-show="v.isShow">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.isSet">
                                                <el-input size="mini" placeholder="请输入内容" v-model="bizQueryParams.sel[v.field]">
                                                </el-input>
                                            </span>
                                            <span v-else>{{scope.row[v.field]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100">
                                        <template slot-scope="scope">
                                            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="saveChange(scope.row,scope.$index,true)">
                                                {{scope.row.isSet?'保存':"修改"}}
                                            </span>
                                            <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" @click="delRecord(scope.row,scope.$index)" style="cursor: pointer;">
                                                删除
                                            </span>
                                            <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="saveChange(scope.row,scope.$index,false)">
                                                取消
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="1">
            </el-col>
            <el-col :span="9">
                <b>业务ID：[{{bizRecordId}}] 显示列名：</b>
                <el-cascader style="width: 550px;height:100%;"           
                placeholder="选择显示列名信息"
                v-model="bizSelectedCols"
                :options="toSelectedTableCols"
                :props="{ multiple: true }"
                clearable
                filterable></el-cascader>
            </el-col>
        </el-row>
        <hr>
        <hr>
        <hr>
        <!-- ___________________________________________________________________________________________________________________________________________________________________________
        
        ===========================================================================================================================================================================
         -->
        <el-row v-for="mainItem in bizConfigData">
            <el-row>
                <el-col class="col40">
                    <!-- 业务名称：{{bizName}} -->
                </el-col>
            </el-row>
                    <el-row class="mainTable">
                        <el-col class="colLabel">关 联 表：</el-col>
                        <el-col :span="20">
                            <el-select v-model="mainItem.mainTable" placeholder="所属表" @change="changeMainTable(mainItem, false)">
                                <el-option v-for="item in queryObject4Table.belongTable" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option>
                            </el-select>
                            别名
                            <el-input :readonly="!mainItem.isMain" style="width:100px;" v-model="mainItem.alias" ></el-input>
                            数据源:
                            <el-select v-model="mainItem.dsRecordId" placeholder="所属表数据源">
                                <el-option v-for="item in queryObject4DS.belongDatasource" :key="item.recordId" :label="item.dataSourceName" :value="item.recordId"></el-option>
                            </el-select>
                            <el-button class="filter-item" @click="createBizWhere()">
                                添加全局过滤条件
                            </el-button>
                            <el-button class="filter-item" @click="createRelaTable(mainItem)">
                                添加关联表
                            </el-button>
                            <el-button class="filter-item" v-if="!mainItem.isMain" @click="delMainTable(mainItem)">
                                删除关联表
                            </el-button>
                        </el-col>
                    </el-row>
            <el-row>
                <hr>
                <!-- ___________________________________________________________________________________________________________________________________________________________________________
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             -->
            </el-row>
            <el-row v-for="relaItem in mainItem.relaInfo">
                <template>
                    <el-row>
                        <template>
                            <el-row class="relaType">
                                <el-col class="col40">
                                    关联类型：
                                    <el-select v-model="relaItem.relaType" placeholder="关联类型">
                                        <el-option v-for="item in relaTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span>被关联表：</span>
                                    <el-select v-model="relaItem.tableName" placeholder="被关联表" @change="changeRelaTable(relaItem)">
                                        <el-option v-for="item in queryObject4Table.belongTable" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option>
                                    </el-select>
                                    别名
                                    <el-input style="width:100px;" v-model="relaItem.alias" ></el-input>
                                    <el-button class="filter-item" @click="createRelaCond(relaItem)">
                                        添加关联条件
                                    </el-button>
                                    <el-button class="filter-item" @click="createRelaWhere(relaItem)">
                                        添加过滤条件
                                    </el-button>
                                    <el-button class="filter-item" v-if="mainItem.isMain || !relaItem.isMain" @click="delRelaTable(mainItem, relaItem)">
                                        删除
                                    </el-button>
                                    <el-button class="filter-item" @click="createChildMainTable(relaItem)">
                                        添加子关联
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row v-for="relaCondItem in relaItem.relaConditions">
                                <el-col class="col30">
                                    被关联表字段：
                                    <el-select v-model="relaCondItem.relaTableFieldName" placeholder="被关联表字段">
                                        <el-option v-for="item in relaItem.tableCols" :key="item.columnName" :label="item.columnNameCn" :value="item.recordId"></el-option>
                                    </el-select>
                                    关联条件：
                                    <el-select v-model="relaCondItem.conditionType" placeholder="关联条件">
                                        <el-option v-for="item in whereConditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    关联表字段：
                                    <el-select v-model="relaCondItem.mainTableFieldName" placeholder="关联表字段">
                                        <el-option v-for="item in mainItem.tableCols" :key="item.columnName" :label="item.columnNameCn" :value="item.recordId"></el-option>
                                    </el-select>
                                    <el-button class="filter-item" v-if="!relaCondItem.isMain" @click="delRelaCond(relaItem, relaCondItem)">
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row v-for="relaWhereItem in relaItem.whereConditions">
                                <el-col class="col30">
                                    过滤表名称：
                                    <el-select v-model="relaWhereItem.tableName" placeholder="表名称" @change="changeWhereTable(relaWhereItem)">
                                        <el-option v-for="item in relaWhereTablesMap.get(mainItem.bizTableRecordId + relaItem.tableName)" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option>
                                        <!-- <el-option v-for="item in queryObject4Table.belongTable" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option> -->
                                    </el-select>
                                    列名称
                                    <el-select v-model="relaWhereItem.fieldName" placeholder="表列名称">
                                        <el-option v-for="item in selectedTableAndCols.tableColsInfoMap.get(relaWhereItem.tableName)" :key="item.columnName" :label="item.columnNameCn" :value="item.recordId"></el-option>
                                    </el-select>
                                    过滤条件：
                                    <el-select style="width:200px;" v-model="relaWhereItem.conditionType" placeholder="过滤条件">
                                        <el-option v-for="item in whereConditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    条件值
                                    <el-input style="width:100px;" v-model="relaWhereItem.conditionValA" ></el-input>
                                    <el-input style="width:100px;" v-model="relaWhereItem.conditionValB" v-if="relaWhereItem.isLike" ></el-input>
                                    <el-button class="filter-item" @click="delRelaWhere(relaItem, relaWhereItem)">
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>
                            <hr>
                           <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                         -->
                        </template>
                    </el-row>

                </template>
            </el-row>
            <hr>

                <el-row v-for="bizWhereItem in bizWhereConditions">
                    <el-col class="col30">
                        过滤表名称：
                        <el-select v-model="bizWhereItem.tableName" placeholder="表名称" @change="changeBizWhereTable(bizWhereItem)">
                            <el-option v-for="item in selectedTableAndCols.tableInfos" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option>
                            <!-- <el-option v-for="item in queryObject4Table.belongTable" :key="item.tableCode" :label="item.tableNameCn" :value="item.recordId"></el-option> -->
                        </el-select>
                        列名称
                        <el-select v-model="bizWhereItem.fieldName" placeholder="表列名称">
                            <el-option v-for="item in selectedTableAndCols.tableColsInfoMap.get(bizWhereItem.tableName)" :key="item.columnName" :label="item.columnNameCn" :value="item.recordId"></el-option>
                        </el-select>
                        过滤条件：
                        <el-select style="width:200px;" v-model="bizWhereItem.conditionType" placeholder="过滤条件">
                            <el-option v-for="item in whereConditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        条件值
                        <el-input style="width:100px;" v-model="bizWhereItem.conditionValA" ></el-input>
                        <el-input style="width:100px;" v-model="bizWhereItem.conditionValB" v-if="bizWhereItem.isLike" ></el-input>
                        <el-button class="filter-item" @click="delBizWhere(bizWhereItem)">
                            删除
                        </el-button>
                    </el-col>
                </el-row>
            <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         -->
        </el-row>

        <el-dialog :append-to-body="true" :close-on-click-modal="false" :title="updateConfigObject.dialogStatusText" :visible.sync="updateConfigObject.dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
                <hr>
                <hr>
                <el-row>
                    <el-row>
                        <el-col :span="4">
                            添加数据的数据表
                        </el-col>
                        <el-col :span="30">
                            <el-checkbox :indeterminate="updateConfigObject.isIndeterminateInsert" v-model="updateConfigObject.checkAllInsert" @change="handleCheckInsertAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="updateConfigObject.checkedInsertTables" @change="handleCheckedInsertTableChange">
                                <el-checkbox v-for="configData in updateConfigObject.updateTables" :label="configData.recordId" :key="configData.recordId">{{configData.tableNameCn}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" style="text-align: right;">
                        </el-col>
                        <el-col :span="30">
                            <el-row>
                                <el-col :span="24">
                                    <el-table size="mini" :data="updateConfigObject.tableColInsertData.data" border style="width: 600px" highlight-current-row>
                                        <el-table-column type="index"></el-table-column>
                                        <el-table-column v-for="(v,i) in updateConfigObject.columns" :prop="v.field" :style="v.style" :label="v.title" :min-width="v.width" v-show="v.isShow">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.isSet && v.isEdit">
                                                    <el-input size="mini" placeholder="请输入内容" v-model="updateConfigObject.tableColInsertData.sel[v.field]">
                                                    </el-input>
                                                </span>
                                                <span v-else>{{scope.row[v.field]}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="100">
                                            <template slot-scope="scope">
                                                <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,true,'I')">
                                                    {{scope.row.isSet?'保存':"修改"}}
                                                </span>
                                                <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" @click="delUpdateConfigChange(scope.row,scope.$index,'I')" style="cursor: pointer;">
                                                    删除
                                                </span>
                                                <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,false,'I')">
                                                    取消
                                                </span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-col>
                            
                    </el-row>
                </el-row>
                <hr>
                <el-row>
                    <el-row>
                        <el-col :span="4">
                            修改数据的数据表
                        </el-col>
                        <el-col :span="30">
                            <el-checkbox :indeterminate="updateConfigObject.isIndeterminateUpdate" v-model="updateConfigObject.checkAllUpdate" @change="handleCheckUpdateAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="updateConfigObject.checkedUpdateTables" @change="handleCheckedUpdateTableChange">
                                <el-checkbox v-for="configData in updateConfigObject.updateTables" :label="configData.recordId" :key="configData.recordId">{{configData.tableNameCn}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" style="text-align: right;">
                        </el-col>
                        <el-col :span="30">
                            <el-row>
                                <el-col :span="24">
                                    <el-table size="mini" :data="updateConfigObject.tableColUpdateData.data" border style="width: 600px" highlight-current-row>
                                        <el-table-column type="index"></el-table-column>
                                        <el-table-column v-for="(v,i) in updateConfigObject.columns" :prop="v.field" :style="v.style" :label="v.title" :min-width="v.width" v-show="v.isShow">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.isSet && v.isEdit">
                                                    <el-input size="mini" placeholder="请输入内容" v-model="updateConfigObject.tableColUpdateData.sel[v.field]">
                                                    </el-input>
                                                </span>
                                                <span v-else>{{scope.row[v.field]}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="100">
                                            <template slot-scope="scope">
                                                <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,true,'U')">
                                                    {{scope.row.isSet?'保存':"修改"}}
                                                </span>
                                                <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" @click="delUpdateConfigChange(scope.row,scope.$index,'U')" style="cursor: pointer;">
                                                    删除
                                                </span>
                                                <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,false,'U')">
                                                    取消
                                                </span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-row>
                <hr>
                <el-row>
                    <el-row>
                        <el-col :span="4">
                            删除数据的数据表
                        </el-col>
                        <el-col :span="30">
                            <el-checkbox :indeterminate="updateConfigObject.isIndeterminateDelete" v-model="updateConfigObject.checkAllDelete" @change="handleCheckDeleteAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="updateConfigObject.checkedDeleteTables" @change="handleCheckedDeleteTableChange">
                                <el-checkbox v-for="configData in updateConfigObject.updateTables" :label="configData.recordId" :key="configData.recordId">{{configData.tableNameCn}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" style="text-align: right;">
                        </el-col>
                        <el-col :span="30">
                            <el-row>
                                <el-col :span="24">
                                    <el-table size="mini" :data="updateConfigObject.tableColDeleteData.data" border style="width: 600px" highlight-current-row>
                                        <el-table-column type="index"></el-table-column>
                                        <el-table-column v-for="(v,i) in updateConfigObject.columns" :prop="v.field" :style="v.style" :label="v.title" :min-width="v.width" v-show="v.isShow">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.isSet && v.isEdit">
                                                    <el-input size="mini" placeholder="请输入内容" v-model="updateConfigObject.tableColDeleteData.sel[v.field]">
                                                    </el-input>
                                                </span>
                                                <span v-else>{{scope.row[v.field]}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="100">
                                            <template slot-scope="scope">
                                                <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,true,'D')">
                                                    {{scope.row.isSet?'保存':"修改"}}
                                                </span>
                                                <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" @click="delUpdateConfigChange(scope.row,scope.$index,'D')" style="cursor: pointer;">
                                                    删除
                                                </span>
                                                <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="saveUpdateConfigChange(scope.row,scope.$index,false,'D')">
                                                    取消
                                                </span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-col>
                            
                    </el-row>
                </el-row>

                <hr>
                <hr>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateConfigObject.dialogFormVisible = false">
                取消
                </el-button>
                <el-button type="primary" @click="saveUpdateConfigData">
                确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

    <script>
    import {getDSList, saveBizConfig, getBizConfigByBizId, saveBizConfigNotGetParams, getNotGetBizParams } from "@/api/allc/apibiz"
    import {getTableList, getTableColByTid} from "@/api/allc/apitbl"
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
 
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');

    //主要内容
    export default {
        name: 'BizRuleConfig',
        // ========================= 父窗体信息 =========================
        props: {
            bizRecordId:{
                type: String,
                default: function(){
                    return ''
                }
            },
            bizName:{
                type: String,
                default: function(){
                    return ''
                }
            }
        },
        // -------------------------------------------------------------
        data() {
            return {
                generateId: {
                    _count: 1,
                    get(){return ((+new Date()) + "_" + (this._count++))}
                },
                tableMap: new Map(),
                tableColMap: new Map(),
                bizSelectedCols: [],
                toSelectedTableCols: [],
                selectedTableAndCols: null, // {tableInfos: [], tableColsInfoMap: new Map()}, // {tableColsInfoMap = tableInfo.tableRecordId + colsInfo[]}
                bizWhereConditions: [],
                bizQueryParams: {},
                bizQueryParamsBase: {
                        sel: null,//选中行   
                        columns: [
                            // { field: "recordId", title: "", width: 1 , isShow: false},
                            { field: "paramName", title: "参数名", width: 60, isShow: true },
                            { field: "paramNameCn", title: "中文名", width: 80, isShow: true },
                            { field: "paramAlias", title: "参数别名", width: 80, isShow: true}
                            ],
                        data: [],
                    },
                relaWhereTablesMap: new Map(),
                // ========================= 基本数据封装 =========================
                bizConfigData: [],
                bizConfigDataBase: [],
                relaDataMainTableBase:{
                        recordId: '',
                        bizTableRecordId: '',
                        isMain: false, // 是否主记录
                        mainTable: '', // 关联表
                        tableMap: null,
                        alias: '', // 表别名
                        dsRecordId: '', // 数据源
                        tableCols: [],
                        tableColsMap: null, 
                        relaInfo: [ // 关联表信息
                        ]
                    },
                relaDataRelaTableBase:{
                        recordId: '',
                        bizTableRecordId: '',
                        isMain: false, // 是否主记录
                        tableName: '', // 被关联表名称
                        tableMap: null,
                        alias: '', // 表别名
                        dsRecordId: '', // 数据源
                        relaType: 1, // 关联类型
                        tableCols: [],
                        tableColsMap: null, 
                        relaConditions: [ // 关联条件
                        ],
                        whereConditions: [ // where 条件
                        ]
                    },
                relaDataRelaTableConditionBase:{
                        recordId: '',
                        isMain: false, // 是否主记录
                        mainTableRid:'', //主关联表
                        mainTableFieldName: '', // 主表关联条件
                        relaTableFieldName: '', // 被关联表关联条件
                        conditionType: 1, // 关联类型 1 = ; 2 > ; 3 >= ; 4 < ; 5 <= ; 6 != ; 7 like ;
                    },
                relaDataRelaTableWhereBase: {
                        recordId: '',
                        isMain: false, // 是否主记录
                        tableName: '', // 表名称
                        fieldName: '', // 表字段
                        tableCols: [],
                        conditionType: 1, // 关联类型 1 = ; 2 > ; 3 >= ; 4 < ; 5 <= ; 6 != ; 7 like ;
                        isLike: false,
                        conditionValA: '',
                        conditionValB: ''
                    },
                relaTypes: [
                    { 
                        value: 1,
                        label: "inner join 表同时存在记录时"
                    },
                    { 
                        value: 2,
                        label: "left join 被关联的表可以没有记录"
                    },
                    { 
                        value: 3,
                        label: "right join 关联的表可以没有记录"
                    },
                    { 
                        value: 4,
                        label: "none 无关联【主表或单一表时】"
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
                    },
                    {
                        value: 9,
                        label: 'BETWEEN 两个值之间'
                    }
                ],

                // -------------------------------------------------------------

                // ========================= 查询模型 =========================
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
                updateConfigObject:{
                },
                updateConfigObjectBase:{
                    queryLimit:{
                        pagesize:100,
                        pageindex:0
                    },
                    total:200,
                    columns: [
                            { field: "columnNameCn", title: "表列中文名", width: 120 , isShow: false},
                            { field: "columnName", title: "表列英文名", width: 100, isShow: true},
                            { field: "paramName", title: "参数名称", width: 80, isShow: true},
                            { field: "paramAlias", title: "参数别名", width: 80, isShow: true, isEdit: true }
                            ],
                    updateTables: [
                        {recordId: 'shanghai', tableNameCn: '上海'}, 
                        {recordId: 'beijing', tableNameCn: '北京'},
                        {recordId: 'guangzhou', tableNameCn: '广州'},
                        {recordId: 'shenzhen', tableNameCn: '深圳'}],
                    dialogStatusText: "数据更新配置",
                    dialogFormVisible: false,
                    bizUpdateParamsOfSrv: [],

                    checkAllInsert: false,
                    isIndeterminateInsert: false,
                    checkedInsertTables: ['shanghai', 'beijing'],
                    tableInsertData: [],
                    tableInsertDataMultipSelection: [],
                    tableColInsertData: {
                        data: [],
                        sel: null
                    },

                    checkAllUpdate: false,
                    isIndeterminateUpdate: false,
                    checkedUpdateTables: ['guangzhou', 'beijing'],
                    tableUpdateData: [],
                    tableUpdateDataMultipSelection: [],
                    tableColUpdateData: {
                        data: [],
                        sel: null
                    },

                    checkAllDelete: false,
                    isIndeterminateDelete: false,
                    checkedDeleteTables: ['guangzhou', 'shenzhen'],
                    tableDeleteData: [],
                    tableDeleteDataMultipSelection: [],
                    tableColDeleteData: {
                        data: [],
                        sel: null
                    },
                }

                // -------------------------------------------------------------
            }
        },
        watch : {
            bizRecordId:function(val) {
                if ( val.length < 10 ){
                    return;
                }
                this.initBizConfig();
                this.getBizConfigByBizId();
            },
            tableMap: function(val){
                debugger
                this.$message.info('sdfsf');
            }
        },
        methods:{
                // ========================= 基本数据封装 =========================
            createMainTableBase(isMain){
                let relaDataMainTableBase1 = this.copyData(this.relaDataMainTableBase);
                relaDataMainTableBase1.isMain = isMain;
                relaDataMainTableBase1.recordId = uuid;
                return relaDataMainTableBase1;
            },
            createRelaTableBase(relaDataMainTable){
                let relaDataRelaTableBase1 = this.copyData(this.relaDataRelaTableBase);
                relaDataRelaTableBase1.recordId = uuid;
                relaDataRelaTableBase1.bizTableRecordId = relaDataMainTable.bizTableRecordId;
                relaDataMainTable.relaInfo.push(relaDataRelaTableBase1);
                relaDataRelaTableBase1.isMain = relaDataMainTable.relaInfo.length == 1 ? true : false;
                return relaDataRelaTableBase1;
            },
            createRelaCondBase(relaDataRelaTable){
                let relaDataRelaTableConditionBase1 = this.copyData(this.relaDataRelaTableConditionBase);
                relaDataRelaTableConditionBase1.recordId = uuid;
                relaDataRelaTable.relaConditions.push(relaDataRelaTableConditionBase1);
                relaDataRelaTableConditionBase1.isMain = relaDataRelaTable.relaConditions.length == 1 ? true : false;
                return relaDataRelaTableConditionBase1;
            },
            createRelaWhereBase(relaDataRelaTable){
                let relaDataRelaTableWhereBase1 = this.copyData(this.relaDataRelaTableWhereBase);
                relaDataRelaTableWhereBase1.recordId = uuid;
                relaDataRelaTable.whereConditions.push(relaDataRelaTableWhereBase1);
                relaDataRelaTableWhereBase1.isMain = relaDataRelaTable.whereConditions.length == 1 ? true : false;
                return relaDataRelaTableWhereBase1;
            },

                // -------------------------------------------------------------

                // ========================= 获取业务数据 =========================

            async getTableList() {
                try {
                    var that = this;
                    let res = await getTableList(this.queryObject4Table.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    that.queryObject4Table.belongTable = res.data
                    that.queryObject4Table.tableMap = new Map();
                    res.data.forEach(function(item, idx){
                        that.queryObject4Table.tableMap.set(item.recordId, item);
                    })
                } catch (err) {
                    console.log(err)
                    alert('请求出错')
                } 
            },
            async getTableColByTid(tblRecordId) {
                try {
                    let res = await getTableColByTid({tableRecordId: tblRecordId});
                    return res.data;
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
                // -------------------------------------------------------------

                // ========================= 数据模型 =========================
            getBizConfigByBizId(){
                var that = this ;
                getBizConfigByBizId({bizRecordId: this.bizRecordId})
                    .then(res =>{
                        let bizData = res.data;
                        if ( bizData.mainTableInfos.length == 0 ){
                            return ;
                        }

                        let selectedCols = bizData.selectedColInfos;

                        that.bizSelectedCols = selectedCols.map(val => {
                            let jsonObj = [] ;
                            jsonObj[0] = val.tableRecordId;
                            jsonObj[1] = val.colRecordId;
                            return jsonObj;
                        })
                        debugger
                        
                        that.bizConfigData = bizData.mainTableInfos;
                        that.bizWhereConditions = bizData.bizWhereConditions;

                        //根据实际情况，自己改下啊 
                        that.bizQueryParams.data = bizData.reqParamInfos.map(i => {
                            i.id = that.generateId.get();//模拟后台插入成功后有了id
                            i.isSet=false;//给后台返回数据添加`isSet`标识
                            i.requestType = "G";
                            return i;
                        });

                        that.getBizConfigTableColsByMainItem();
                        that.resetWhereConditionInfo();
                    })
                    .catch(()=>{})
                    .finally(()=>{})
            },
            getBizConfigTableColsByMainItem(){

                var that = this;
                that.bizConfigData.forEach(function(item, idx){
                    that.changeMainTable(item, true);

                    item.relaInfo.forEach(function(relaInfoItem, relaIdx){
                        that.getBizConfigTableColsByRelaItem(relaInfoItem);
                    })
                })
            },
            getBizConfigTableColsByRelaItem(relaItem){
                this.changeRelaTable(relaItem, true);
            },
            saveBizConfig(bizConfigData){
                var that = this;
                this.$confirm("是否确定业务配置【" + this.bizName + "】","提示", {})
                    .then(()=>{
                        saveBizConfig(bizConfigData)
                            .then(res => {
                                this.$message.info('保存业务成功～');
                            })
                            .catch(() => {})
                            .finally(() => {})
                    })
                    .catch(()=>{})
            },
            createBizContent(row){
                
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
                let relaDataMainTableBase = this.createMainTableBase(false);
                let relaDataRelaTableBase = this.createRelaTableBase(relaDataMainTableBase);
                this.createRelaCondBase(relaDataRelaTableBase);
                this.bizConfigData.push(relaDataMainTableBase);
                return relaDataMainTableBase;
            },
            createChildMainTable(relaItem){
                let relaDataMainTableBase = this.createMainTable();
                relaDataMainTableBase.bizTableRecordId = relaItem.tableName;
                relaDataMainTableBase.mainTable = relaItem.tableName;
                relaDataMainTableBase.alias = relaItem.alias;
            },
            delMainTable(relaDataMainTable){
                this.bizConfigData.splice(this.bizConfigData.indexOf(relaDataMainTable), 1)
                this.resetTableMap(false);
            },
            createRelaTable(relaDataMainTable){
                let relaDataRelaTableBase = this.createRelaTableBase(relaDataMainTable);
                this.createRelaCondBase(relaDataRelaTableBase);
            },
            delRelaTable(mainItem, relaItem){
                mainItem.relaInfo.splice(mainItem.relaInfo.indexOf(relaItem), 1);
                this.resetTableMap(false);
            },
            createRelaCond(relaItem){
                this.createRelaCondBase(relaItem);
            },
            createRelaWhere(relaItem){
                this.createRelaWhereBase(relaItem);
            },
            createBizWhere(){
                let tableWhere = this.copyData(this.relaDataRelaTableWhereBase);
                tableWhere.recordId = uuid;
                this.bizWhereConditions.push(tableWhere);
            },
            delRelaCond(relaItem, relaCondItem){
                relaItem.relaConditions.splice(relaItem.relaConditions.indexOf(relaCondItem), 1)
            },
            delRelaWhere(relaItem, relaWhereItem){
                relaItem.whereConditions.splice(relaItem.whereConditions.indexOf(relaWhereItem), 1)
            },
            delBizWhere(bizWhereItem){
                this.bizWhereConditions.splice(this.bizWhereConditions.indexOf(bizWhereItem), 1)
            },
            selectColConfig(){
            },
            saveBiz(){
                debugger
                
                let selectedCols = this.bizSelectedCols.map(val => {
                    let jsonObj = {} ;
                    jsonObj.tableRecordId = val[0];
                    jsonObj.colRecordId = val[1];
                    return jsonObj;
                })

                let saveData = {
                    bizRecordId: this.bizRecordId,
                    bizName: this.bizName,
                    selectedColInfos: selectedCols,
                    mainTableInfos: this.bizConfigData,
                    reqParamInfos: this.bizQueryParams.data,
                    bizWhereConditions: this.bizWhereConditions
                }
                this.saveBizConfig(saveData);
            },
            testBiz(){
                this.$message.info('ready to test ....')
            },
            dataUpdateConfig(){
                this.updateConfigObject.dialogStatusText = "数据更新配置:" + this.bizName;
                this.updateConfigObject.dialogFormVisible = true;
                this.getBizUpdateParams();
            },
            getBizUpdateParams(){
                var that = this;
                getNotGetBizParams({bizRid: this.bizRecordId})
                .then(res => {
                    if (res.code == 0){
                        that.updateConfigObject.bizUpdateParamsOfSrv = res.data;
                        that.handleTableColParams('', 'I');
                        that.handleTableColParams('', 'U');
                        that.handleTableColParams('', 'D');
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(() =>{})
            },
            handleDsTablesSelectionChange(){

            }, 
            dsTableSelectInit(){

            },
            async changeMainTable(mainItem, isGetSrv){
                let res = await getTableColByTid({tableRecordId: mainItem.mainTable});
                // let tableCols = this.getTableColByTid(mainItem.mainTable);
                mainItem.tableCols = res.data;
                // mainItem.mainTableFieldName = '';
                mainItem.tableColsMap = res.data.map(val => {
                    let jsonObj = {} ;
                    jsonObj.recordId = val.recordId;
                    jsonObj.obj = val;
                    return jsonObj;
                })
                
                this.resetTableMap(isGetSrv);
            },
            async changeRelaTable(relaItem, isGetSrv){
                debugger
                let tableCols = await this.getTableColByTid(relaItem.tableName);
                relaItem.tableCols = tableCols ;
                // relaItem.relaTableFieldName = '';

                relaItem.tableColsMap = tableCols.map(val => {
                    let jsonObj = {} ;
                    jsonObj.recordId = val.recordId;
                    jsonObj.obj = val;
                    return jsonObj;
                })
                
                this.resetTableMap(isGetSrv);
            },
            async changeWhereTable(relaWhereItem){
                // let tableCols = await this.getTableColByTid(relaWhereItem.tableName);
                let tableCols = this.whereColsMap.get(relaWhereItem.tableName); // await this.getTableColByTid(relaWhereItem.tableName);
                relaWhereItem.tableCols = tableCols ;
                // relaWhereItem.fieldName = '';
            },
            async changeBizWhereTable(bizWhereItem){
                // let tableCols = await this.getTableColByTid(relaWhereItem.tableName);
                let tableCols = this.whereColsMap.get(bizWhereItem.tableName); // await this.getTableColByTid(relaWhereItem.tableName);
                bizWhereItem.tableCols = tableCols ;
                // relaWhereItem.fieldName = '';
            },
            initBizConfig(){
                debugger
                this.bizConfigData = [];
                this.bizConfigDataBase = [];
                this.tableMap.clear();
                this.tableColMap.clear();
                this.bizSelectedCols = [];
                this.toSelectedTableCols = [];
                this.bizWhereConditions = [];
                this.selectedTableAndCols = {tableInfos: [], tableColsInfoMap: new Map()};
                this.relaWhereTablesMap.clear();
                this.bizQueryParams = this.copyData(this.bizQueryParamsBase);
                this.bizConfigData = this.copyData(this.bizConfigDataBase);
                let relaDataMainTableBase1 = this.createMainTableBase(true);
                // let relaDataRelaTableBase1 = this.createRelaTableBase(relaDataMainTableBase1);
                // this.createRelaCondBase(relaDataRelaTableBase1);
                this.bizConfigData.push(relaDataMainTableBase1);
                this.getTableList();
                this.getDSList();   
            },
            resetTableMap(isGetSrv){
                var that = this;
                let tableMapTemp = new Map();
                that.bizConfigData.forEach(function(item, idx){
                    tableMapTemp.set(item.mainTable, item);
                    if( !that.tableMap.has(item.mainTable) ){
                        that.tableMap.set(item.mainTable, item);
                    }
                    var itemThat = item;
                    item.relaInfo.forEach(function(relaInfoItem, relaIdx){
                        relaInfoItem.bizTableRecordId = itemThat.bizTableRecordId
                        relaInfoItem.mainTable = itemThat.mainTable;
                        tableMapTemp.set(relaInfoItem.tableName, relaInfoItem);
                        if (!that.tableMap.has(relaInfoItem.tableName)){
                            that.tableMap.set(relaInfoItem.tableName, relaInfoItem)
                        }
                    })
                })
                that.tableMap.forEach(function(value,key,map){
                    if (!tableMapTemp.has(key)){
                        that.tableMap.delete(key);
                    }
                })

                debugger
                that.resetToTableSelectedCols(isGetSrv);
                that.resetWhereConditionInfo();
            },
            resetToTableSelectedCols(isGetSrv){
                var that = this;
                that.toSelectedTableCols = [];
                var tableSelectedColsMap = new Map();
                // debugger
                that.tableMap.forEach(function(value,key,map){
                    if (key != ""){
                        let tableInfo = that.queryObject4Table.tableMap.get(key)
                        var tableCol = {value: key, label: tableInfo.tableNameCn, children: []};
                        that.toSelectedTableCols.push(tableCol);
                        if (value.tableCols != undefined){
                            try{
                                value.tableCols.forEach(function(relaVal, relaKey, relaMap){
                                    let relaTableCol = {value: relaVal.recordId, label: relaVal.columnNameCn};
                                    tableCol.children.push(relaTableCol);
                                    tableSelectedColsMap.set(relaVal.recordId, relaVal);
                                    that.tableColMap.set(relaVal.recordId, relaVal);
                                })
                            } catch (err) {
                                debugger
                                console.log(err)
                                alert('请求出错')
                            } 
                        }
                    }
                })
                this.resetTableSelectedCols(tableSelectedColsMap,isGetSrv);
            },
            resetTableSelectedCols(tableSelectedColsMap, isGetSrv){
                debugger
                var that = this;
                let tableSelectedColsTemp = this.copyData(that.bizSelectedCols);
                that.bizSelectedCols = [];
                tableSelectedColsTemp.forEach(function(item, idx){
                    if (isGetSrv){
                        that.bizSelectedCols.push(item);
                    }else{
                        if (tableSelectedColsMap.has(item[1])){
                            that.bizSelectedCols.push(item);
                        }
                    }
                })
            },resetWhereConditionInfo(){
                debugger
                var that = this;
                that.relaWhereTablesMap.clear();
                that.selectedTableAndCols.tableInfos = [];
                that.selectedTableAndCols.tableColsInfoMap.clear();
                 that.tableMap.forEach(function(value,key,map){
                    if (key != ""){
                        var bizTableRecordId = value.bizTableRecordId;
                        var tableInfo = that.queryObject4Table.tableMap.get(key);

                        that.selectedTableAndCols.tableInfos.push(tableInfo);
                        that.selectedTableAndCols.tableColsInfoMap.set(key, value.tableCols);

                        if (value.relaInfo == undefined ){
                            let mainTable = value.mainTable;
                            var mainTableInfo = that.queryObject4Table.tableMap.get(mainTable);

                            let relaTableKey = bizTableRecordId + value.tableName;
                            if (!that.relaWhereTablesMap.has(relaTableKey)){
                                that.relaWhereTablesMap.set(relaTableKey, []);
                            }
                            that.relaWhereTablesMap.get(relaTableKey).push(mainTableInfo);
                            that.relaWhereTablesMap.get(relaTableKey).push(tableInfo);
                        }

                    }
                })
                that.updateConfigObject = that.copyData(that.updateConfigObjectBase);
                that.updateConfigObject.updateTables = that.selectedTableAndCols.tableInfos;
                debugger
            },
            //添加请求参数
            addParam() {
                var maxParamIndex = 0 ;
                var that = this;
                for (let i of that.bizQueryParams.data) {
                    if (i.isSet) {
                        that.$message({
                            message: '请先保存当前编辑项',
                            type: 'warning'
                            });
                        return ;
                    }
                    let currParamIndex = parseInt(i.paramName.substring(1));
                    if (currParamIndex > maxParamIndex){
                        maxParamIndex = currParamIndex;
                    }
                }
                debugger
                // let j = { id: 0, "recordId":"", "areaCode": "4404", "areaName": "广东珠海", "isSet": true, "_temporary": true };
                let dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                let paramItem = { 
                    id: 0, "isSet": true, "_temporary": true ,
                    recordId: '' , /**主键*/ 
                    paramName: 'p' + (maxParamIndex + 1) , /**地区编码*/ 
                    paramNameCn: '' , /**地区名称*/ 
                    paramAlias: '' , /**备注*/ 
                    startDate: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**使用开始时间*/ 
                    endDate: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**使用结束时间*/ 
                    stopStatus: '0' , /**是否停用*/ 
                    createDatetime: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**记录创建时间*/ 
                    createUserId: '' , /**记录创建用户ID*/ 
                    updateDatetime: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**记录更新时间*/ 
                    updateUserId: '' , /**记录更新用户ID*/ 
                    validStatus: '1' , /**是否已经失效 ： 1：删除；0：未删除*/ 
                    deleteStatus: '0' , /**是否删除 ： 1：删除；0：未删除*/ 
                    requestType: "G"
                }
                that.bizQueryParams.data.push(paramItem);
                that.bizQueryParams.sel = JSON.parse(JSON.stringify(paramItem));
            },
            //修改
            saveChange(row, index, cg) {
                debugger
                var that = this;
                //点击修改 判断是否已经保存所有操作
                for (let i of that.bizQueryParams.data) {
                    if (i.isSet && i.id != row.id) {
                        that.$message({
                            message: '请先保存当前编辑项',
                            type: 'warning'
                            });
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    if (!that.bizQueryParams.sel.id) that.bizQueryParams.data.splice(index, 1);
                    return row.isSet = !row.isSet;
                }
                //提交数据
                if (row.isSet) {
                    //项目是模拟请求操作  自己修改下
                    (function () {
                        let data = JSON.parse(JSON.stringify(that.bizQueryParams.sel));
                        for (let k in data) row[k] = data[k];
                        //that.saveArea(data);
                        row.isSet = false;
                    })();
                } else {
                    that.bizQueryParams.sel = JSON.parse(JSON.stringify(row));
                    row.isSet = true;
                }
            },
            delRecord(row, index){
                var that = this;
                // 弹出注销提示框
                this.$confirm('确认删除[' + row.paramNameCn + ']吗?', '提示', {
                    // customClass: 'message-logout'
                }).then(() => {
                    that.bizQueryParams.data.splice(index, 1);
                    //this.delArea(row.recordId);
                }).catch(() => { /* 用户取消注销 */ })
                
            },      
            handleCheckInsertAllChange(val) {
                debugger
                var allCheckValue = [];
                for (let tableObj of this.updateConfigObject.updateTables) {
                    allCheckValue.push(tableObj.recordId);
                }
                this.updateConfigObject.checkedInsertTables = val ? allCheckValue : [];
                this.updateConfigObject.isIndeterminateInsert = false;
                this.handleTableColParams(this.updateConfigObject.checkedInsertTables, "I");
            },
            handleCheckUpdateAllChange(val) {
                debugger
                var allCheckValue = [];
                for (let tableObj of this.updateConfigObject.updateTables) {
                    allCheckValue.push(tableObj.recordId);
                }
                this.updateConfigObject.checkedUpdateTables = val ? allCheckValue : [];
                this.updateConfigObject.isIndeterminateUpdate = false;
                this.handleTableColParams(this.updateConfigObject.checkedUpdateTables, "U");
            },
            handleCheckDeleteAllChange(val) {
                debugger
                var allCheckValue = [];
                for (let tableObj of this.updateConfigObject.updateTables) {
                    allCheckValue.push(tableObj.recordId);
                }
                this.updateConfigObject.checkedDeleteTables = val ? allCheckValue : [];
                this.updateConfigObject.isIndeterminateDelete = false;
                this.handleTableColParams(this.updateConfigObject.checkedDeleteTables, "D");
            },
            handleCheckedInsertTableChange(value) {
                let checkedCount = value.length;
                this.updateConfigObject.checkAllInsert = checkedCount === this.updateConfigObject.updateTables.length;
                this.updateConfigObject.isIndeterminateInsert = checkedCount > 0 && checkedCount < this.updateConfigObject.updateTables.length;
                this.handleTableColParams(value, "I");
            },
            handleCheckedUpdateTableChange(value) {
                let checkedCount = value.length;
                this.updateConfigObject.checkAllUpdate = checkedCount === this.updateConfigObject.updateTables.length;
                this.updateConfigObject.isIndeterminateUpdate = checkedCount > 0 && checkedCount < this.updateConfigObject.updateTables.length;
                this.handleTableColParams(value, "U");
            },
            handleCheckedDeleteTableChange(value) {
                let checkedCount = value.length;
                this.updateConfigObject.checkAllDelete = checkedCount === this.updateConfigObject.updateTables.length;
                this.updateConfigObject.isIndeterminateDelete = checkedCount > 0 && checkedCount < this.updateConfigObject.updateTables.length;
                this.handleTableColParams(value, "D");
            },
            handleTableColParams(tableIds, paramType){
                var that = this;
                var tableColDatasAllNew = that.getTableColParamsFromTableIds(tableIds, paramType);

                for(var tableColFromSrv of that.updateConfigObject.bizUpdateParamsOfSrv){
                    var isIn = false ;
                    for(let tableCol of tableColDatasAllNew){
                        if (tableCol.requestType == tableColFromSrv.requestType && tableCol.paramName == tableColFromSrv.paramName){
                            isIn = true;
                            let index = tableColDatasAllNew.indexOf(tableCol);
                            tableColDatasAllNew.splice(index, 1);
                            break;
                        }
                    }
                    if (tableColFromSrv.requestType === paramType){
                        let tablecol = that.tableColMap.get(tableColFromSrv.columnRecordId);
                        let tablecolNew = {
                            requestType: paramType,
                            columnName: tablecol.columnName,
                            columnNameCn: tableColFromSrv.paramNameCn,
                            paramName: tableColFromSrv.paramName,
                            paramAlias: tableColFromSrv.paramAlias,
                            tableRecordId: tableColFromSrv.tableRecordId,
                            columnRecordId: tableColFromSrv.columnRecordId,
                            bizRecordId: tableColFromSrv.bizRecordId,
                            paramNameCn: tableColFromSrv.paramNameCn
                        }
                        // tableColFromSrv.columnName = tablecol.columnName;
                        // tableColFromSrv.columnNameCn = tablecol.columnNameCn;
                        tableColDatasAllNew.push(tablecolNew);
                    }
                }

                if (paramType === "I"){
                    that.updateConfigObject.tableColInsertData.data = tableColDatasAllNew;
                    that.updateConfigObject.tableInsertData.sel = null;
                }else if (paramType === "U"){
                    that.updateConfigObject.tableColUpdateData.data = tableColDatasAllNew;
                    that.updateConfigObject.tableColUpdateData.sel = null;
                }else if (paramType === "D"){
                    that.updateConfigObject.tableColDeleteData.data = tableColDatasAllNew;
                    that.updateConfigObject.tableColDeleteData.sel = null;
                }
            },
            getTableColParamsFromTableIds(tableIds, paramType){
                var that = this;
                var tableColDatasAll = [];
                
                for(let tableId of tableIds){
                    let tableColDatas = that.selectedTableAndCols.tableColsInfoMap.get(tableId);
                    let tableColDatasTemp = tableColDatas.map(tableColDataTemp => {
                                tableColDataTemp.id = tableColDataTemp.recordId;//模拟后台插入成功后有了id
                                tableColDataTemp.isSet=false;//给后台返回数据添加`isSet`标识
                                tableColDataTemp.paramName = this.changeFieldToParam(tableColDataTemp.columnName);
                                tableColDataTemp.requestType = paramType;
                                return tableColDataTemp;
                            });
                    for(let tableCol of tableColDatasTemp){
                        tableColDatasAll.push(tableCol);
                    }
                }

                var tableColDatasAllNew = this.copyData(tableColDatasAll);
                return tableColDatasAllNew;
            },
            changeFieldToParam(str){
                var paramName = str.toLowerCase();
                var paramNameResult = '';
                var spliteSignIdx = paramName.indexOf('_');
                if (spliteSignIdx < 0 ){
                    let paramNameU = paramName.substr(0,1).toUpperCase();
                    let paramNameL = paramName.substr(1);
                    paramNameResult = paramNameResult + paramNameU + paramNameL;
                }
                while(spliteSignIdx >= 0){
                    var paramNameTemp = paramName.substr(0,spliteSignIdx);
                    paramName = paramName.substring(spliteSignIdx + 1);
                    if (paramNameResult.length == 0){
                        paramNameResult = paramNameTemp;
                    }else{
                        let paramNameU = paramNameTemp.substr(0,1).toUpperCase();
                        let paramNameL = paramNameTemp.substr(1);
                        paramNameResult = paramNameResult + paramNameU + paramNameL;
                    }
                    spliteSignIdx = paramName.indexOf('_');
                    if (spliteSignIdx < 0){
                        let paramNameU = paramName.substr(0,1).toUpperCase();
                        let paramNameL = paramName.substr(1);
                        paramNameResult = paramNameResult + paramNameU + paramNameL;
                    }
                }

                return paramNameResult;
            },
            saveUpdateConfigData(){
                
                debugger
                let bizParams = [];

                for(let tableCol of this.updateConfigObject.tableColInsertData.data){

                    let bizParam = {
                        tblRid: tableCol.tableRecordId,
                        colRid: tableCol.recordId,
                        requestType:tableCol.requestType,
                        paramName:tableCol.paramName,
                        paramNameCn:tableCol.columnNameCn,
                        paramAlias:tableCol.paramAlias
                    }
                    bizParams.push(bizParam);
                }

                for(let tableCol of this.updateConfigObject.tableColUpdateData.data){

                    let bizParam = {
                        tblRid: tableCol.tableRecordId,
                        colRid: tableCol.recordId,
                        requestType:tableCol.requestType,
                        paramName:tableCol.paramName,
                        paramNameCn:tableCol.columnNameCn,
                        paramAlias:tableCol.paramAlias
                    }
                    bizParams.push(bizParam);
                }

                for(let tableCol of this.updateConfigObject.tableColDeleteData.data){

                    let bizParam = {
                        tblRid: tableCol.tableRecordId,
                        colRid: tableCol.recordId,
                        requestType:tableCol.requestType,
                        paramName:tableCol.paramName,
                        paramNameCn:tableCol.columnNameCn,
                        paramAlias:tableCol.paramAlias
                    }
                    bizParams.push(bizParam);
                }

                let saveData = {
                    bizRid: this.bizRecordId,
                    dataList: bizParams
                }
                saveBizConfigNotGetParams(saveData)
                .then(resp =>{
                    if (resp.code == 0){
                        this.$message.info('数据更新配置保存成功')
                    }else{
                        this.$message.error(resp.message);
                    }
                }).catch(()=>{})

            },
            saveUpdateConfigChangeInsert(){

            },
            delUpdateConfigChange(row, index, optType){
                var that = this;
                var updateConfigData;
                if (optType === "I"){
                    updateConfigData = that.updateConfigObject.tableColInsertData;
                }else if (optType === "U"){
                    updateConfigData = that.updateConfigObject.tableColUpdateData;
                }else if (optType === "D"){
                    updateConfigData = that.updateConfigObject.tableColDeleteData;
                }else{
                    that.$message({
                        message: '数据获取失败～',
                        type: 'warning'
                        });
                    return;
                }

                // 弹出注销提示框
                this.$confirm('确认删除[' + row.columnNameCn + ']吗?', '提示', {
                }).then(() => {
                    updateConfigData.data.splice(index, 1);
                }).catch(() => { /* 用户取消注销 */ })
            },
            //修改
            saveUpdateConfigChange(row, index, cg, optType) {
                debugger
                var that = this;
                var updateConfigData;
                if (optType === "I"){
                    updateConfigData = that.updateConfigObject.tableColInsertData;
                }else if (optType === "U"){
                    updateConfigData = that.updateConfigObject.tableColUpdateData;
                }else if (optType === "D"){
                    updateConfigData = that.updateConfigObject.tableColDeleteData;
                }else{
                    that.$message({
                        message: '数据获取失败～',
                        type: 'warning'
                        });
                    return;
                }

                //点击修改 判断是否已经保存所有操作
                for (let i of updateConfigData.data) {
                    if (i.isSet && i.id != row.id) {
                        that.$message({
                            message: '请先保存当前编辑项',
                            type: 'warning'
                            });
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    if (!updateConfigData.sel.id) updateConfigData.data.splice(index, 1);
                    return row.isSet = !row.isSet;
                }
                //提交数据
                if (row.isSet) {
                    //项目是模拟请求操作  自己修改下
                    (function () {
                        let data = JSON.parse(JSON.stringify(updateConfigData.sel));
                        for (let k in data) row[k] = data[k];
                        //that.saveArea(data);
                        row.isSet = false;
                    })();
                } else {
                    updateConfigData.sel = JSON.parse(JSON.stringify(row));
                    row.isSet = true;
                }
            }
        },
        created(){
            // this.tableMap = new Map();
            this.updateConfigObject = this.copyData(this.updateConfigObjectBase);
        },
        mounted(){
            this.initBizConfig();
            this.getBizConfigByBizId();
        },
        beforeUpdate(){
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
            vertical-align: middle;
            padding-top: 10px;
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
        .titleClass{
            background-color: forestgreen;
            color: aliceblue
        }
        .el-table-add-row {
            margin-top: 1px;
            margin-left: 20px;
            width: 100%;
            height: 34px;
            border: 1px dashed #c1c1cd;
            border-radius: 3px;
            cursor: pointer;
            justify-content: center;
            display: flex;
            line-height: 34px;
        }   
    </style>
