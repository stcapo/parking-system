package com.example.controller;

import com.example.model.LoginRequest;
import com.example.model.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = new LoginResponse();
        
        // 验证硬编码的账号密码
        if ("admin".equals(request.getUsername()) && "admin".equals(request.getPassword())) {
            response.setSuccess(true);
            response.setMessage("登录成功");
            response.setToken("admin-token-123456"); // 模拟生成token
        } else {
            response.setSuccess(false);
            response.setMessage("账号或密码错误");
        }
        
        return ResponseEntity.ok(response);
    }
}