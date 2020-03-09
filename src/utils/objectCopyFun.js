
exports.install = (Vue, options) => {
    Vue.prototype.copyData = function(jsonDataObject) {
        var copiedObject = JSON.parse(JSON.stringify(jsonDataObject));
        // Object.assign(this.formDataBase,this.formData)
        return copiedObject;
    };
    Vue.prototype.array2tree = function(list,idstr,pidstr){
            var result = [],temp = {},tempVp = [];  
            for(var i = 0; i < list.length; i++){  
                temp[list[i][idstr]]=list[i];//将nodes数组转成对象类型  
            }  
            for(var j=0; j<list.length; j++){  
                tempVp = temp[list[j][pidstr]]; //获取每一个子对象的父对象  
                if(tempVp){//判断父对象是否存在，如果不存在直接将对象放到第一层  
                    if(!tempVp["children"]) tempVp["children"] = [];//如果父元素的nodes对象不存在，则创建数组  
                    tempVp["children"].push(list[j]);//将本对象压入父对象的nodes数组  
                    if (result.length == 0 ){
                        result.push(tempVp);
                    }
                }else{  
                    result.push(list[j]);//将不存在父对象的对象直接放入一级目录  
                }  
            }  
            return result;  
        } ;
  }