package org.tju.contacts.controller;

import com.alibaba.fastjson.JSONArray;
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
import java.util.List;

public class LocationServlet extends HttpServlet{

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        List<Mate> mates;
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

        try(SqlSession session = SessionFactory.getInstance().openSession()){
            MateMapper mapper = session.getMapper(MateMapper.class);
            mates = mapper.selectMates(new Mate(id, name, province, city, district, company));
        }

        JSONObject retObj = new JSONObject();
        retObj.put("ret", 1);
        JSONArray locationJsonArray = new JSONArray();
        for(Mate m: mates){
            locationJsonArray.add(JSONObject.toJSON(m));
        }
        retObj.put("list", locationJsonArray);

        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(retObj.toJSONString());
    }

}
