function refreshDistrictSelect(labelPrefix, data){
    var level = data['level'];
    var provinceSelect = document.getElementById(labelPrefix+"-province");
    var citySelect = document.getElementById(labelPrefix+"-city");
    var districtSelect = document.getElementById(labelPrefix+"-district");

    //清空下面级别的选项
    if(level=='country'){
        provinceSelect.innerHTML="";
        citySelect.innerHTML="";
        districtSelect.innerHTML="";
    }else if(level=='province'){
        citySelect.innerHTML="";
        districtSelect.innerHTML="";
    }else if(level=='city'){
        districtSelect.innerHTML="";
    }

    var subList = data.districtList;
    if(subList){
        var contentSub = new Option('--请选择--');
        var curlevel = subList[0].level;
        var curList =  document.querySelector('#' + labelPrefix + "-" + curlevel);
        curList.add(contentSub);
        for (var i = 0, l = subList.length; i < l; i++) {
            var name = subList[i].name;
            var levelSub = subList[i].level;
            var cityCode = subList[i].citycode;
            contentSub = new Option(name);
            contentSub.setAttribute("value", levelSub);
            contentSub.center = subList[i].center;
            contentSub.adcode = subList[i].adcode;
            curList.add(contentSub);
        }
    }


}

function post(url, body){
    //TODO: 提交
}

function showSearchContent(){
    //TODO: 展示搜索结果
}
