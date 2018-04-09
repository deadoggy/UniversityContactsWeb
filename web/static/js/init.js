//初始化地图
var map = Loca.create('map', {
    viewMode: '3D',
    pitch : 50,
    resizeEnable: true,
    zoom:5,
    center: [116.397428, 39.90923],
    //mapStyle: 'amap://styles/fresh'
});
map.on('mapload', function() {
    map.getMap().plugin(['AMap.ControlBar'], function () {
        var controlBar = new AMap.ControlBar();
        map.getMap().addControl(controlBar);
    });
});

var layer = Loca.visualLayer({
    container: map,
    type: 'heatmap',
    shape: 'district'
});

layer.setOptions({
    mode: 'mean',
    style: {
        height: [0, 500000],
        opacity: 0.9
    }
});

//TODO：绘制地图上的标记

//TODO：初始化搜索select
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

    var ret = post("/location", body)
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

$('#checkin-button').bind('click', function () {
    var name = $('#checkin-name').val();
    var id = $('#checkin-id').val();
    var province = $('#checkin-province-choice').text();
    var city = $('#checkin-city-choice').text();
    var district = $('#checkin-district-choice').text();
    var company = $('#checkin-company').val();

    if(name==null || name==''  || province.indexOf('--')!=-1){
        alert('请务必输入姓名和省份！');
    }

    var body = {
      name: name,
      province: province
    };

    if(id!=null&&id!=''){
        body.id=id;
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
    var ret = post('/register', body);
    if(ret.ret == 0){
        if(ret.reason.indexOf('id exist')!=-1){
            alert('已经签到过了~');
        }else{
            alert('好像出了点问题...请稍后再试');
        }
    }else{
        $('#checkin-cancel').trigger('click');
        draw(layer, null);
    }
});