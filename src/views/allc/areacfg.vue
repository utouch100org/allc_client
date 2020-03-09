 
 <template>
    <el-row>
        <el-col :span="24">
            <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row>
                <el-table-column type="index"></el-table-column>
                <el-table-column v-for="(v,i) in master_user.columns" :prop="v.field" :style="v.style" :label="v.title" :min-width="v.width" v-show="v.isShow">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSet">
                            <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel[v.field]">
                            </el-input>
                        </span>
                        <span v-else>{{scope.row[v.field]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
                            {{scope.row.isSet?'保存':"修改"}}
                        </span>
                        <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" @click="delRecord(scope.row,scope.$index)" style="cursor: pointer;">
                            删除
                        </span>
                        <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                            取消
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="24">
            <div class="el-table-add-row" style="width: 99.2%;" @click="addMasterUser()"><span>+ 添加</span></div>
        </el-col>
    </el-row>
</template>

    <script>

    import { getAreaList, getAreaById, addArea, updateArea, delArea} from "@/api/allc/apiarea"
    import { formatDate } from "@/utils/formatDate"
    import { uuid } from "@/utils/uuid"

    //主要内容
    export default {
        
            data() {
                return {
                    //id生成工具 这个不用看 示例而已 模拟后台返回的id
                    generateId: {
                        _count: 1,
                        get(){return ((+new Date()) + "_" + (this._count++))}
                    },
                    master_user: {
                        sel: null,//选中行   
                        columns: [
                            // { field: "recordId", title: "", width: 1 , isShow: false},
                            { field: "areaCode", title: "地区编码", width: 200, isShow: true },
                            { field: "areaName", title: "地区名称", width: 400, isShow: true },
                            { field: "remark", title: "备注", width: 400, isShow: true}
                            ],
                        data: [],
                    }
                }
            },
            created(){
                this.getAreaList();
            },
            methods: {
                getAreaList(){
                    this.listLoading = true;
                    let reqParam = {
                        psize: 0,
                        pindex: 100
                    }
                    getAreaList(reqParam)
                        .then(res => {
                            this.master_user.data = res.data;
                            this.readMasterUser();
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.listLoading = false;
                        });
                },
                saveArea(data){
                    var that = this;
                    delete data["id"] ;
                    delete data["isSet"] ;
                    delete data["_temporary"]  ;// id: 0, "isSet": true, "_temporary": true 
                    let tempData = {"areaCode":"4404","areaName":"广东珠海","remark":"广东地区"}

                    let sendData = JSON.stringify(data);
                    if (data.recordId == ""){
                        data.recordId = uuid;
                        debugger
                        addArea(data)
                            .then(res => {
                                that.$message({
                                        type: 'success',
                                        message: "保存成功!"
                                    });
                                    //然后这边重新读取表格数据
                                    that.getAreaList();
                            })
                            .catch(() => {})
                            .finally(() => {
                                this.listLoading = false;
                            });
                    }else{
                        debugger
                        updateArea(data)
                            .then(res => {
                                that.$message({
                                        type: 'success',
                                        message: "修改成功!"
                                    });
                                    //然后这边重新读取表格数据
                                    that.getAreaList();
                            })
                            .catch(() => {})
                            .finally(() => {
                                this.listLoading = false;
                            });
                    }
                },
                delArea(recoredId){
                    var that = this;
                     delArea({recordId: recoredId})
                            .then(res => {
                                that.$message({
                                        type: 'success',
                                        message: "删除成功!"
                                    });
                                    //然后这边重新读取表格数据
                                    that.getAreaList();
                            })
                            .catch(() => {})
                            .finally(() => {
                                this.listLoading = false;
                            });
                },
                //读取表格数据
                readMasterUser() {
                    var that = this;
                    //根据实际情况，自己改下啊 
                    this.master_user.data.map(i => {
                        i.id = that.generateId.get();//模拟后台插入成功后有了id
                        i.isSet=false;//给后台返回数据添加`isSet`标识
                        return i;
                    });
                },
                //添加账号
                addMasterUser() {
                    var that = this;
                    for (let i of this.master_user.data) {
                        if (i.isSet) {
                            that.$message({
                                message: '请先保存当前编辑项',
                                type: 'warning'
                                });
                            return ;
                        }
                    }
                    // let j = { id: 0, "recordId":"", "areaCode": "4404", "areaName": "广东珠海", "isSet": true, "_temporary": true };
                    let dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                    let tAllcBaseArea = { 
                        id: 0, "isSet": true, "_temporary": true ,
                        recordId: '' , /**主键*/ 
                        areaCode: '4404' , /**地区编码*/ 
                        areaName: '广东珠海' , /**地区名称*/ 
                        remark: '广东地区' , /**备注*/ 
                        startDate: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**使用开始时间*/ 
                        endDate: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**使用结束时间*/ 
                        stopStatus: '0' , /**是否停用*/ 
                        createDatetime: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**记录创建时间*/ 
                        createUserId: '' , /**记录创建用户ID*/ 
                        updateDatetime: dateNow, //formatDate(new Date(),'yyyy-MM-dd hh:mm:ss') , /**记录更新时间*/ 
                        updateUserId: '' , /**记录更新用户ID*/ 
                        validStatus: '1' , /**是否已经失效 ： 1：删除；0：未删除*/ 
                        deleteStatus: '0' , /**是否删除 ： 1：删除；0：未删除*/ 
                    }
                    this.master_user.data.push(tAllcBaseArea);
                    this.master_user.sel = JSON.parse(JSON.stringify(tAllcBaseArea));
                },
                //修改
                pwdChange(row, index, cg) {
                    var that = this;
                    //点击修改 判断是否已经保存所有操作
                    for (let i of that.master_user.data) {
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
                        if (!that.master_user.sel.id) that.master_user.data.splice(index, 1);
                        return row.isSet = !row.isSet;
                    }
                    //提交数据
                    if (row.isSet) {
                        //项目是模拟请求操作  自己修改下
                        (function () {
                            let data = JSON.parse(JSON.stringify(that.master_user.sel));
                            for (let k in data) row[k] = data[k];
                            // that.$message({
                            //     type: 'success',
                            //     message: "保存成功!"
                            // });
                            // //然后这边重新读取表格数据
                            // that.readMasterUser();
                            that.saveArea(data);
                            row.isSet = false;
                        })();
                    } else {
                        that.master_user.sel = JSON.parse(JSON.stringify(row));
                        row.isSet = true;
                    }
                },
                delRecord(row, index){
                    // 弹出注销提示框
                    this.$confirm('确认删除[' + row.areaName + ']吗?', '提示', {
                        // customClass: 'message-logout'
                    }).then(() => {
                        this.delArea(row.recordId);
                        // this.$message({
                        //     message: '已成功注销',
                        //     type: 'success'
                        // })
                    }).catch(() => { /* 用户取消注销 */ })
                    
                }
            }
        }
    </script>
<style>
    .el-table-add-row {
        margin-top: 10px;
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
