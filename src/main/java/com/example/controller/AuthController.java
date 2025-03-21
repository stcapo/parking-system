package com.example.controller;

import com.example.model.LoginRequest;
import com.example.model.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setMessage("登录成功");
        //response.setToken("sample-token-" + System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}