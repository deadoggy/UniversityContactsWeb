package org.tju.contacts.controller;


import com.alibaba.fastjson.JSONObject;
import org.apache.ibatis.session.SqlSession;
import org.tju.contacts.dao.MateMapper;
import org.tju.contacts.dao.SessionFactory;
import org.tju.contacts.entity.Mate;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

public class RegisterServlet extends HttpServlet {

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response) throws IOException{

        StringBuilder body = new StringBuilder();
        //读取body
        BufferedReader bodyReader = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String tmpLine = bodyReader.readLine();
        while(null!=tmpLine){
            body.append(tmpLine);
            tmpLine=bodyReader.readLine();
        }
        JSONObject infoJson = JSONObject.parseObject(body.toString());
        String id = infoJson.getString("id");
        String name = infoJson.getString("name");
        String province = infoJson.getString("province");
        String city = infoJson.getString("city");
        String district = infoJson.getString("district");
        String company = infoJson.getString("company");

        //insert
        Boolean exists = false;
        try(SqlSession session = SessionFactory.getInstance().openSession()){
            MateMapper mapper = session.getMapper(MateMapper.class);
            if(mapper.selectMates(id, null, null, null, null, null).size()!=0){
                exists=true;
            }else{
                mapper.insertMate(new Mate(id, name, province, city, district, company));
                session.commit();
            }
        }

        //return
        JSONObject retObj = new JSONObject();
        retObj.put("ret", exists?0:1);
        if(exists){
            retObj.put("reason","id exists");
        }
        PrintWriter out = response.getWriter();
        out.print(retObj.toJSONString());
    }

}
