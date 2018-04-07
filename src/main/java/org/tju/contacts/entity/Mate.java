package org.tju.contacts.entity;

public class Mate {

    private String name;
    private String id;
    private String province;
    private String city;
    private String district;
    private String company;

    public Mate() {
        name = null;
        id = null;
        province = null;
        city = null;
        district = null;
        company = null;
    }

    public Mate(String id, String name, String province, String city, String district, String company) {
        this.name = name;
        this.id = id;
        this.province = province;
        this.city = city;
        this.district = district;
        this.company = company;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }
}
