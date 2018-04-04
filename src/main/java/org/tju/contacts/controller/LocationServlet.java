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
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class LocationServlet extends HttpServlet{
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        List<Mate> mates;
        try(SqlSession session = SessionFactory.getInstance().openSession()){
            MateMapper mapper = session.getMapper(MateMapper.class);
            mates = mapper.selectMates(null,null, null, null, null,null);
        }
        JSONObject retObj = new JSONObject();
        retObj.put("ret", 1);
        JSONArray locationJsonArray = new JSONArray();
        for(Mate m: mates){
            locationJsonArray.add(JSONObject.toJSON(m));
        }
        retObj.put("list", locationJsonArray);

        PrintWriter out = response.getWriter();
        out.print(retObj.toJSONString());
    }

}
