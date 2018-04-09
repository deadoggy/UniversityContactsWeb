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
    var ret = {};
    $.ajax({
        url: url,
        type: "post",
        async: false,
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(body),
        success: function(data){
            ret = eval(data);
        },
        error: function(request, message){
            ret.message = message;
        }
    });
    return ret;
}


function draw(layer, data){
    var data = post('location', {}).list;
}

/*
* data:
* [
*   [id, name, province, city, district, company],
*   ...
* ]
* */
function showSearchContent(layer, data){

    var geocoder = new AMap.Geocoder({
        city: "010", //城市，默认：“全国”
        radius: 1000 //范围，默认：500
    });

    var ret = []
    for(item in data){
        var obj = {};
        geocoder.getLocation(item.province + item.city + item.district, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                obj.latlon = [result.geocodes[0].location.getLat(),result.geocodes[0].location.getLng()];
            }
        });
        ret.append(obj);
    }
    draw(layer, ret);
}
