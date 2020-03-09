<template>
    <el-row class="row">
        <el-col :span="8" class="col1">
            <div class="left">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>

                <el-tree
                    class="filter-tree"
                    :data="queryObject.treeData"
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    @current-change="nodeSelected"
                    ref="compTree">
                </el-tree>
            </div>
        </el-col>
        <el-col :span="16" class="col2">
            <el-row>
                <div style="height:60px;padding-left:40px;padding-top:10px;">
                    <span style="padding-left:20px;">公司名称：{{companyName}}</span>
                    <el-button class="filter-item" v-if="!isAdd" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createComp">
                        添加
                    </el-button>
                    <el-button class="filter-item" v-if="isAdd" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="isAdd ? submitAddComp(): submitEditComp()">
                        确定
                    </el-button>
                    <el-button class="filter-item" v-if="isAdd" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="cancelCreateComp">
                        取消
                    </el-button>
                    <el-button class="filter-item" v-if="!isAdd" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="submitEditComp">
                        编辑
                    </el-button>
                    <el-button class="filter-item" v-if="!isAdd" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="delComp">
                        删除
                    </el-button>
                </div>
            </el-row>
            <el-row>
                <div style="">
                <el-form :model="formData" label-position="right" label-width="120px" style="height: 100%; width: 500px; margin-left:30px;">
                    <el-form-item label="公司编码：">
                            <el-input v-model="formData.parentUnitCode" :readonly="true" style="width:49%;"></el-input>
                            <el-input v-model="formData.unitCode" :readonly="readonly" placeholder="请输入公司代码" style="width:49.5%;"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称：">
                            <el-input v-model="formData.unitName" :readonly="readonly" placeholder="请输入公司名称"></el-input>
                    </el-form-item>
                    <el-form-item label="使用开始时间：">
                        <el-date-picker v-model="formData.startDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="使用结束时间：">
                            <el-date-picker v-model="formData.endDate" :readonly="readonly" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="单位类型">
                            <el-select v-model="formData.unitType" placeholder="单位类型">
                                <el-option label="集团" :value="1"></el-option>
                                <el-option label="公司" :value="2"></el-option>
                                <el-option label="部门" :value="4"></el-option>
                                <el-option label="岗位" :value="8"></el-option>
                                <el-option label="工作组" :value="16"></el-option>
                            </el-select>
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
                    <el-form-item label="备    注：">
                            <el-input type="textarea" v-model="formData.remark" :readonly="readonly" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                </div>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    import {getCompList, getCompbyid, insertComp, updateComp, delComp} from '@/api/allc/apicomp'
    import { formatDate } from "@/utils/formatDate"
    const dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    import { uuid } from "@/utils/uuid"

  export default {
    data() {
        return {
            isAdd: false,
            canDelete: false,
            readonly:false,
            companyName: '',
            queryObject:{
                total:200,
                treeData:[],
                queryLimit:{
                    pagesize:100,
                    pageindex:0
                }
            },
            defaultProps: {
                children: 'children',
                label: 'unitName'
            },
            filterText: '',
            formData:{},
            formDataBase:{ 
                    recordId: '' , /**主键*/ 
                    unitCode: '' , /**单位编码*/ 
                    unitName: '' , /**单位名称*/ 
                    parentUnitCode: '' , /**上级单位编码 ： 顶级单位是代码为“”*/ 
                    unitType: 2 , /**单位类型 ： 1：集团；2：公司；4：部门；8：岗位*/ 
                    remark: '' , /**备注*/ 
                    stopStatus: 0 , /**是否停用*/ 
                    createDatetime: dateNow , /**记录创建时间*/ 
                    createUserId: '' , /**记录创建用户ID*/ 
                    updateDatetime: dateNow , /**记录更新时间*/ 
                    updateUserId: '' , /**记录更新用户ID*/ 
                    validStatus: 0 , /**是否已经失效 ： 1：删除；0：未删除*/ 
                    deleteStatus: 0 , /**是否删除 ： 1：删除；0：未删除*/ 
                }
        }
    },

    watch: {
      filterText(val) {
        this.$refs.compTree.filter(val);
      }
    },

    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        nodeSelected(data, checked, indeterminate) {
            var that = this;
            that.canDelete = false;
            let currNode = that.$refs.compTree.getCurrentNode()
            this.formData = this.copyData(currNode);
            this.formData.unitCode = currNode.unitCode.replace(currNode.parentUnitCode,'');
            // this.formData.parentUnitCode = currNode.unitCode;
            this.companyName = currNode.unitName;
                // this.$message.info('data, checked, indeterminate');
        },
        getCompList(){
                getCompList(this.queryObject.queryLimit)
                    .then(res => {
                        // this.queryObject.treeData = res.data;
                        this.queryObject.treeData = this.array2tree(res.data,"unitCode","parentUnitCode");
                        this.formData = this.copyData(this.formDataBase);
                        // var test = res.data.map((item) => {
                        //     return item;
                        // });
                    })
                    .catch(er => { console.error(er);})
                    .finally(() => {})
        },
        createComp(){
            var that = this;
            that.isAdd = true;
            that.canDelete = false;
            this.formData = this.copyData(this.formDataBase);
            let currNode = that.$refs.compTree.getCurrentNode()
            this.formData.parentUnitCode = currNode == null ? '' : currNode.unitCode;
            this.companyName = currNode == null ? '' : currNode.unitName;
            // this.$message.info("hello create");
        },
        cancelCreateComp(){
            this.isAdd = false;
            this.canDelete = false;
        },
        submitAddComp(){
            this.isAdd = false;
            this.canDelete = true;
            this.formData.recordId = uuid;
            this.formData.unitCode = this.formData.parentUnitCode + this.formData.unitCode;
            insertComp(this.formData)
                .then(res => {
                    let rst = res.data;
                    if (rst == 1 ){
                        this.$message.info("添加成功");
                        this.getCompList();
                    }
                })
                .catch(() => {})
        },
        submitEditComp(){
            debugger
            this.isAdd = false;
            this.canDelete = true;
            this.$confirm("是否确定编辑【" + this.formData.unitName + "】","提示", {})
                    .then(()=>{
                        this.formData.unitCode = this.formData.parentUnitCode + this.formData.unitCode;
                        updateComp(this.formData)
                            .then(res => {
                                let rst = res.data;
                                if (rst == 1 ){
                                    this.$message.info("修改成功");
                                    this.getCompList();
                                }
                            })
                            .catch(er => {console.error(er);})
                    })
                    .catch(()=>{})
        },
        delComp(){
            var that = this;
            let currNode = that.$refs.compTree.getCurrentNode()
            if (currNode == null){
                this.$message.warning("请选择需要删除的记录～")
                return ;
            }
                this.$confirm("是否确定删除【" + currNode.unitName + "】","提示", {})
                    .then(()=>{
                        delComp({recordId: currNode.recordId})
                            .then(res => {
                                that.$message({message: '删除成功',type: 'success'})
                                this.getCompList();
                            })
                            .catch(er => {console.error(er);})
                            .finally(()=>{

                            })
                    })
                    .catch(()=>{})
        }

    },

    created() {
        this.getCompList();
    }
  }
</script>
