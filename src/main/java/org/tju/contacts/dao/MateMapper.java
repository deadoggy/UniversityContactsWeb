package org.tju.contacts.dao;

import org.tju.contacts.entity.Mate;

import java.util.List;

public interface MateMapper {
    List<Mate> selectMates(String id, String name, String province, String city, String district, String company);
    int insertMate(Mate mate);
    int updateMate(String name, String province, String city, String district, String company);
}
