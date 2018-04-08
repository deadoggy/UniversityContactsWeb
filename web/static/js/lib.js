function chooseItem(labelPrefix, level, obj){
    var p = document.getElementById(labelPrefix+"-" + level + "-choice");
    p.innerText = obj.innerText;
    p.setAttribute("value", obj.getAttribute('adcode'));
    p.setAttribute("level", level);
    districtSelectChange(labelPrefix, level, obj.getAttribute('adcode'))
}

function refreshDistrictSelect(labelPrefix, data){
    var level = data['level'];
    var provinceUl = document.getElementById(labelPrefix+"-province-ul");
    var cityUl = document.getElementById(labelPrefix+"-city-ul");
    var districtUl = document.getElementById(labelPrefix+"-district-ul");

    //清空下面级别的选项
    if(level=='country'){
        provinceUl.innerHTML=""; $('#'+labelPrefix+"-province-choice").text('--请选择--');
        cityUl.innerHTML=""; $('#'+labelPrefix+"-city-choice").text('--请选择--');
        districtUl.innerHTML=""; $('#'+labelPrefix+"-district-choice").text('--请选择--');
    }else if(level=='province'){
        cityUl.innerHTML=""; $('#'+labelPrefix+"-city-choice").text('--请选择--');
        districtUl.innerHTML=""; $('#'+labelPrefix+"-district-choice").text('--请选择--');
    }else if(level=='city'){
        districtUl.innerHTML=""; $('#'+labelPrefix+"-district-choice").text('--请选择--');
    }

    var subList = data.districtList;
    if(subList){
        var curlevel = subList[0].level;
        var curUl =  $("#" + labelPrefix+"-"+curlevel+"-"+"ul");
        for (var i = 0, l = subList.length; i < l; i++) {
            var name = subList[i].name;
            var levelSub = subList[i].level;
            var cityCode = subList[i].citycode;
            contentSub = $('<li>',{
                value:levelSub,
                adcode: subList[i].adcode,
                center: subList[i].center,
                onclick:"chooseItem(\'"+labelPrefix+"\',\'"+levelSub+"\',"+"this)"
            });
            var atag=$('<a>',{ href: '#'});
            atag.text(name);
            contentSub.append(atag);
            curUl.append(contentSub);
        }
    }


}

function post(url, body){
    //TODO: 提交
}

function showSearchContent(){
    //TODO: 展示搜索结果
}
