import { formatDate, timeCheak } from "@/utils/formatDate"

exports.install = (Vue, options) => {
    Vue.prototype.clareData = function(data) {
        // Object.keys(data).forEach((item) => {
        //     this.$delete(data,item)
        // })

        for(var a in data){
            debugger
            if (timeCheak(data[a])){
                let dateNow = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                data[a] = dateNow;
            }
            else if (data[a] instanceof Boolean){
                data[a] = false;
            }
            else if (data[a] != null && data[a] instanceof Array) {
                data[a]=[];
            }else {
                data[a] = '';
            }
        }
    };
    Vue.prototype.clareObject = function(data) {
        Object.keys(data).forEach((item) => {
            this.$delete(data,item)
        })
    }
  }

  /*
 * 处理空的参数
 * @param datas
 * @returns
 */
// function cleanParams(datas){
// 	var v_data ={};
// 	for(var a in datas){
// 		if (datas[a] != null && datas[a] instanceof Array) {
// 			v_data[a]=[];
// 		}else {
// 			v_data[a] = null;
// 		}
// 	}
// 	return v_data;
// }