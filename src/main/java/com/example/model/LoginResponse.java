package com.example.model;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;

    // 默认构造函数
    public LoginResponse() {
    }

    // 带参数的构造函数
    public LoginResponse(boolean success, String message, String token) {
        this.success = success;
        this.message = message;
        this.token = token;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // toString方法
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='" + token + '\'' +
                '}';
    }
}