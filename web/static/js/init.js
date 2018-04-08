//初始化地图
var map = new AMap.Map('map', {
    resizeEnable: true,
    zoom:11,
    center: [116.397428, 39.90923]
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
    district.setExtensions('all');
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

    var province = $('search-province-choice').text();
    var city = $('search-city-choice').text();
    var district = $('search-district-choice').text();

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