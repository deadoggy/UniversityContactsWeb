package org.tju.contacts.dao;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;

public class SessionFactory {

    private static SqlSessionFactory sessionFactory = null;
    private SessionFactory(){}

    public static SqlSessionFactory getInstance() throws IOException{
        if(null==sessionFactory){
            synchronized(SessionFactory.class){
                if (null == sessionFactory) {
                    sessionFactory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsStream("org/tju/contacts/dao/mybatis-config.xml"));
                }
            }
        }
        return sessionFactory;
    }



}
