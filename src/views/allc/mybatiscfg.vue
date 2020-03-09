<template>
    <el-row class="row">
        <el-col :span="8" class="col1">
            <div class="left">
                <el-table :data="TNData"  ref="multipleTable" @row-click="mybatisConfigClick">
                    <!-- <el-table-column type="selection" width="55" ></el-table-column> -->
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <!-- <el-table-column prop="tname" label="表名称" width="100" :formatter="formatSex"></el-table-column> -->
                    <el-table-column prop="TABLE_NAME" label="表名称"></el-table-column>
                    <!-- <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="IsAudit"  :formatter="formatterColumn" label="审核状态" ></el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column> -->
                </el-table>
            </div>
        </el-col>
        <el-col :span="16" class="col2">
            <div class="left">
                <el-row>
                    <el-col :span="4" class="colalign">方法通用名称：</el-col>
                    <el-col :span="8">
                        <el-input type="text" v-model="methodName"></el-input>
                    </el-col>
                    <el-col :span="4">实体名称：</el-col>
                    <el-col :span="8">
                        <el-input type="text" v-model="entityName"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" class="colalign">表名称：</el-col>
                    <el-col :span="8">
                        <el-input id="txtTableName" v-model="tableName" type="text"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-button id="btnGetMybatisConfigId" @click="btnGetMybatisConfig">获取配置信息</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-input v-model="eContent" class="content" type="textarea" placeholder="entity to class" />
                </el-row>
                <el-row>
                    <el-input v-model="ejsonContent" class="content" type="textarea" placeholder="entity to json" />
                </el-row>
                <el-row>
                    <el-input v-model="configContent" class="content" type="textarea" placeholder="entity to mybatis config" />
                </el-row>
            </div>
        </el-col>
    </el-row>
</template>

<script>

import { getTNList, getMybatisConfig , getEntityInfo, getEntityJsonInfo } from '@/api/allc/apimybatis'

export default {
    data() {
        return {
            methodName: "",
            entityName: "",
            tableName: "",
            TNData: [],
            configContent: "",
            eContent: "",
            ejsonContent: ""
        }
    }, 
    created() {
        this.getTNameList();
    },
    methods : {
        getTableName() {
            this.txtTableName
        },
        getTNameList() {
            this.listLoading = true
            let reqParam = { dbt: 0 }
            getTNList(reqParam)
            .then(res => {
                this.TNData = res.data;
                this.listLoading = false
            }).catch(() => {});
        },
        mybatisConfigClick(row, event, column){
            this.tableName = row.TABLE_NAME; 
        },
        btnGetMybatisConfig(){

            this.listLoading = true
            let reqParam = { 
                mn: this.methodName,
                en: this.entityName,
                tn: this.tableName 
                }
            getMybatisConfig(reqParam)
            .then(res => {
                this.configContent = res.data;
                this.listLoading = false
            }).catch(() => {});

            let reqParam4e = {
                tn: this.tableName
            }
            getEntityInfo(reqParam4e)
            .then(res => {
                this.eContent = res.data;
                this.listLoading = false
            }).catch(() => {});

            getEntityJsonInfo(reqParam4e)
            .then(res => {
                this.ejsonContent = res.data;
                this.listLoading = false
            }).catch(() => {});
        }
    }
}
</script>

<style>
.row {
    margin-left: 20px;
}
.left {
    /* height: 500px; */
    padding: 10px 10px 10px 10px ;
}
.col1 {
  /* background-color: teal; */
}
.col2 {
  /* background-color: tomato; */
}
.content {
    height: 100%;
}
.colalign {
    
}

</style>
