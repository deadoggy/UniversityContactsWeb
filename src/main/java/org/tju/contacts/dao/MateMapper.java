package org.tju.contacts.dao;

import org.tju.contacts.entity.Mate;

import java.util.List;

public interface MateMapper {
    List<Mate> selectMates(Mate mate);
    int insertMate(Mate mate);
    int updateMate(Mate mate);
}
