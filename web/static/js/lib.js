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
    var color = [
        '#9c27b0',
        '#ff5722',
        '#4caf50',
        '#3949ab',
        '#d32f2f',
        '#795548',
        '#e65100',
        '#fbc02d'

    ];
    layer.setData(data,{
        type:'json',
        lnglat: 'lonlat',
    });
    layer.setOptions({
        style: {
            radius: 7,
            fill: color[Math.floor(Math.random()*8)],
            lineWidth: 1,
            stroke: '#000000',
            opacity: 0.8
        }
    });
    layer.on('click', function(event) {
        console.log('Lnglat: ', event.lnglat) // 元素所在经纬度
        var geocoder = new AMap.Geocoder({
            radius: 1000 //范围，默认：500
        });
        geocoder.getAddress(event.lnglat, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                console.log(result);
                var lnglat = event.lnglat;
                var infoWin = new AMap.InfoWindow();
                var province = result.regeocode.addressComponent.province;
                var city = result.regeocode.addressComponent.city;
                var district = result.regeocode.addressComponent.district;

                if('澳門特別行政區'==province){
                    province='澳门特别行政区';
                }
                if('香港特別行政區'==province){
                    province='香港特别行政区';
                }

                var body = {province:province};
                if(city!=''){
                    body.city=city;
                }
                if(district!=''&&province!='香港特别行政区' && province!='澳门特别行政区'&&province!='新疆维吾尔自治区'){
                    body.district = district;
                }
                var data = post('/location', body).list;

                var content = "";
                for(person in data){
                    content += data[person].id + ' ' + data[person].name + ' '+ province+city+district + ' ';
                    if(data[person].hasOwnProperty('company')){
                        content += data[person].company;
                    }
                    content += '<br/>';
                }
                infoWin.setContent(content);
                infoWin.open(map.getMap(), new AMap.LngLat(lnglat[0], lnglat[1]));
            }
        });
    });
    layer.render();
    map.getMap().setZoomAndCenter(4, [105.542201,34.21872]);
}

/*
* data:
* [
*   [id, name, province, city, district, company],
*   ...
* ]
* */
function showContent(layer, data){

    if(data==null){
        data = post('/location', {}).list;
    }

    var geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
    });

    var lonlat = [];

    for(item in data){

        var location = data[item].province;
        if(data[item].hasOwnProperty('city')){
            location +=data[item].city;
        }
        if(data[item].hasOwnProperty('district')&& data[item].province!='澳门特别行政区'){
            location+=data[item].district;
        }

        geocoder.getLocation(location, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var obj = {lonlat:[result.geocodes[0].location.getLng(),result.geocodes[0].location.getLat()]};
                lonlat.push(obj);
                if(lonlat.length==data.length){
                    draw(layer, lonlat);
                }
            }
        });

    }

}
