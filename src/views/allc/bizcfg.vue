 <template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createBiz">
                添加
            </el-button>
        </div>
        <cusTable :tableData="queryObject.tableData" :rowDblclick="rowDblclick" :tableHeader="tableHeader" :loading="false"></cusTable>
        <pagination v-show="queryObject.total>0" :total="queryObject.total" :page.sync="queryObject.queryLimit.pagesize" :limit.sync="queryObject.queryLimit.pageindex" @pagination="queryObject.tableData" />
        <el-dialog customClass="customWidth" :close-on-click-modal="false" :visible.sync="dialogBizRuleConfigVisible">
            <BizRuleConfig ref="BizRuleConfig" :bizRecordId="bizRecordId" :bizName="formData.bizName"></BizRuleConfig>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogBizRuleConfigVisible = false">
                关闭业务配置
            </el-button>
        </div>
        </el-dialog>
        <el-dialog :append-to-body="true" :close-on-click-modal="false" :title="dialogStatusText" :visible.sync="dialogFormVisible" style="size: small;margin-top:-5px;margin-bottom:-5px">
            <div style="">
               <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                   <el-form-item label="业务编号：">
                        <el-input v-model="formData.bizCode" :readonly="readonly" placeholder="请输入业务编号"></el-input>
                   </el-form-item>
                   <el-form-item label="业务名称：">
                        <el-input v-model="formData.bizName" :readonly="readonly" placeholder="请输入业务名称"></el-input>
                   </el-form-item>
                    <el-form-item label="所属系统">
                            <el-select v-model="formData.sysRecordId" placeholder="所属系统">
                                <el-option v-for="item in queryObject4Sys.belongSys" :key="item.sysCode" :label="item.sysName" :value="item.recordId"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="所属单位">
                            <el-select v-model="formData.unitRecordId" placeholder="所属单位">
                                <el-option v-for="item in queryObject4Unit.belongUnit" :key="item.unitCode" :label="item.unitName" :value="item.recordId"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="使用开始时间：">
                        <el-date-picker v-model="formData.startDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="使用结束时间：">
                            <el-date-picker v-model="formData.endDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
    </div>
</template>

    <script>
    import {getBizList, getBizById, insertBiz, updateBiz, delBiz} from "@/api/allc/apibiz"
    import {getSysList} from "@/api/allc/apisys"
    import {getCompList} from '@/api/allc/apicomp'
    import cTable from "@/components/CommonCom/CusTable"
    import Pagination from '@/components/Pagination' 
    import { Message } from 'element-ui'
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"
    import BizRuleConfig from '@/views/allc/tableRelationcfg'
 
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
            pagination : Pagination,
            BizRuleConfig : BizRuleConfig
        },
        data() {
            return {
                tableHeader : [ // 表头数据
                    { prop: 'bizCode', label: '业务编号', minWidth: '80px' },
                    { prop: 'bizName', label: '业务名称', minWidth: '120px' },
                    { prop: 'sysName', label: '所属系统', minWidth: '80px' },
                    { prop: 'unitName', label: '所属单位', minWidth: '80px' },
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
                bizRecordId:'',
                queryObject:{
                    total:200,
                    tableData: [],
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                queryObject4Sys:{
                    total:200,
                    belongSys: [] , /**所属系统*/ 
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                queryObject4Unit:{
                    total:200,
                    belongUnit: [] , /**所属单位*/ 
                    queryLimit: {
                        pagesize:100,
                        pageindex:0
                    }
                },
                formData:{},
                formDataBase: { 
                        recordId: '' , /**主键*/ 
                        bizCode: '' , /**业务编号*/ 
                        bizName: '' , /**业务名称*/ 
                        sysRecordId: '' , /**系统record_id*/ 
                        sysName:'', 
                        unitRecordId: '' , /**单位record_id*/
                        unitName: '',
                        bizType: 1 , /**业务类型 ： 1：复合业务；2：单体业务--主要用户单表维护；*/ 
                        startDate: '' , /**使用开始时间*/ 
                        endDate: '' , /**使用结束时间*/ 
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
                showAutoIncrement: true,
                isNumber: false,
                submitShow: true,
                dialogBizRuleConfigVisible: false
            }
        },
        methods:{
            async getSysList() {
                try {
                    let res = await getSysList(this.queryObject4Sys.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    this.queryObject4Sys.belongSys = res.data
                } catch (err) {
                    console.log(err)
                    alert('请求出错')
                } 
            },
            async getUnitList() {
                try {
                    let res = await getCompList(this.queryObject4Unit.queryLimit);
                    console.log(res)
                    // 等拿到返回数据res后再进行处理
                    this.queryObject4Unit.belongUnit = res.data
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
                this.getSysList();
                this.getUnitList();
                // this.clareData(that.formData);
            },
            editBiz(row){
                var that = this;
                this.dialogStatus = "编辑表信息"
                this.dialogStatus = "edit"
                this.dialogFormVisible = true;
                this.readonly = false;
                this.submitShow = true;
                getBizById({recordId: row.recordId})
                    .then(res => {
                        that.getSysList();
                        that.getUnitList();
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            delBiz(row){
                var that = this;
                this.$confirm("是否确定删除表【" + row.bizName + "】","提示", {})
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
                        that.getSysList();
                        that.getUnitList();
                        that.formData = res.data;
                    })
                    .catch(() => {})
                    .finally(() => {})
            },
            createBizContent(row){
                this.formData = row;
                this.dialogBizRuleConfigVisible = true;
                let isFirst = this.bizRecordId.length == 0 ? true : false ;
                this.bizRecordId = this.formData.recordId;
                // this.$refs.BizRuleConfig.initBizConfig();
                if (!isFirst){
                    this.$refs.BizRuleConfig.initBizConfig();
                    this.$refs.BizRuleConfig.getBizConfigByBizId();
                }
            },
            rowDblclick(){
                // this.$message({type: 'success', message: "rowDblclick!"});
            },
            createData(){
                this.formData.recordId = this.uuid;
                this.formData.tableRecordId = this.tableId;
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                insertBiz(this.formData)
                    .then(res => {
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
                this.formData.isNull = this.formData.isNull ? 1 : 0 ;
                this.formData.autoIncrement = this.formData.autoIncrement ? 1 : 0 ;
                updateBiz(this.formData)
                    .then(res => {
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
        .customWidth{
            width: 90%;
            min-height: 500px;
        }
    </style>
