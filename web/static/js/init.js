//初始化地图
var locationUrl = '/contacts/location';
var regiserUrl = '/contacts/register';
var map = Loca.create('map', {
    resizeEnable: true,
    zoom:4,
    center: [105.542201,34.21872],
    //mapStyle: 'amap://styles/fresh'
});

var layer = Loca.visualLayer({
    eventSupport: true,
    container: map,
    type: 'point',
    shape: 'circle'
});


showContent(layer, null);

var opts = {
    subdistrict: 1,   //返回下一级行政区
    showbiz:false  //最后一级返回街道信息
};
district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
district.search('中国', function(status, result) {
    if(status=='complete'){
        refreshDistrictSelect('search', result.districtList[0]);
        refreshDistrictSelect('checkin', result.districtList[0]);
    }
});

//加载下一个行政区的列表
function districtSelectChange(labelPrefix, level, adcode){
    district.setLevel(level); //行政区级别
    district.setExtensions('all');mapStyle: 'amap://styles/模版样式的英文名'
    //行政区查询
    //按照adcode进行查询可以保证数据返回的唯一性
    district.search(adcode, function(status, result) {
        if(status === 'complete'){
            refreshDistrictSelect(labelPrefix, result.districtList[0]);
        }
    });
}

function searchClean(){
    $('#search-province-choice').text('--请选择--');
    $('#search-city-choice').text('--请选择--');
    $('#search-district-choice').text('--请选择--');
    $('#search-result').html('空空如野~');
}

function checkinClean(){
    $('#checkin-name').val('');
    $('#checkin-contact').val('');
    $('#checkin-province-choice').text('--请选择--');
    $('#checkin-city-choice').text('--请选择--');
    $('#checkin-district-choice').text('--请选择--');
    $('#checkin-company').val('');
}

//搜索
function search(){

    var province = $('#search-province-choice').text();
    var city = $('#search-city-choice').text();
    var district = $('#search-district-choice').text();

    var body = {};

    if(province.indexOf('--')==-1){
        body.province = province;
    }
    if(city.indexOf('--')==-1){
        body.city = city;
    }
    if(district.indexOf('--')==-1){
        body.district = district;
    }




    var geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
    });

    var location = body.province;
    var zoom = 7;
    if(body.hasOwnProperty('city')){
        location +=body.city;
        zoom = 8;
    }
    if(body.hasOwnProperty('district')&&body.province!='澳门特别行政区'){
        location+=body.district;
        zoom = 9;
    }
    geocoder.getLocation(location,
        function(status, result){
            console.log(result)
            if (status === 'complete' && result.info === 'OK') {
                map.getMap().setZoomAndCenter(zoom, [result.geocodes[0].location.getLng(),result.geocodes[0].location.getLat()]);

            }
        });
    var result = post(locationUrl, body).list;
    var content = "";
    for(person in result){
        var city;
        var district;
        result[person].hasOwnProperty('city')? city= result[person].city:city='';
        result[person].hasOwnProperty('district')? district= result[person].district:district='';
        content += result[person].contact + ' ' + result[person].name + ' '+ result[person].province+city+district + ' ' ;
        if(result[person].hasOwnProperty('company')){
            content+=result[person].company;
        }
        content += '<br/>';
    }
    $('#search-result').html(content);
}


$("#search-province").bind('change',function(obj){
   districtSelectChange('search', this);
});

$("#search-city").bind('change',function(obj){
    districtSelectChange('search', this);
});

$("#search-district").bind('change',function(obj){
    districtSelectChange('search', this);
});

$('#search-confirm').bind('click', function(){
   search();
});

$('#search-clean').bind('click', function(){
    searchClean();
})

$('#checkin-button').bind('click', function () {
    var name = $('#checkin-name').val();
    var contact = $('#checkin-contact').val();
    var province = $('#checkin-province-choice').text();
    var city = $('#checkin-city-choice').text();
    var district = $('#checkin-district-choice').text();
    var company = $('#checkin-company').val();

    if(name==null || name=='' || contact==null || contact=='' ||province.indexOf('--')!=-1){
        alert('请务必输入姓名,联系方式和常住地！');
        return;
    }

    var body = {
        name: name,
        contact: contact,
        province: province
    };

    if(contact!=null&&contact!=''){
        body.contact=contact;
    }
    if(city.indexOf('--')==-1){
        body.city = city;
    }
    if(district.indexOf('--')==-1){
        body.district = district;
    }
    if(company!=null&&company!=''){
        body.company = company;
    }
    var ret = post(regiserUrl, body);
    if(ret.ret == 0){
        if(ret.reason.indexOf('exist')!=-1){
            alert('已经签到过了~');
        }else{
            alert('好像出了点问题...请稍后再试');
        }
    }else{
        // $('#checkin-cancel').trigger('click');
        // checkinClean();
        // showContent(layer, null);
        /*ios 上点击签到后无法再点击原点了, 所以直接刷新*/
        location.reload();
    }
});