/**
 * 智慧停车场 - 用户登录脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const rememberMeCheck = document.getElementById('rememberMe');
    
    // 密码显示/隐藏切换
    const togglePassword = document.getElementById('togglePassword');
    
    // 成功登录弹窗
    const loginSuccessModal = document.getElementById('loginSuccessModal');
    const goToHomepage = document.getElementById('goToHomepage');
    
    // 默认为表单元素添加焦点
    if (usernameField) {
        usernameField.focus();
    }
    
    // 绑定密码显示/隐藏切换功能
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    // 处理登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const username = usernameField.value.trim();
            const password = passwordField.value;
            const rememberMe = rememberMeCheck.checked;
            
            // 简单验证
            if (!username) {
                alert('请输入用户名或手机号');
                usernameField.focus();
                return;
            }
            
            if (!password) {
                alert('请输入密码');
                passwordField.focus();
                return;
            }
            
            // 尝试登录
            const mockUser = {
                id: '1',
                username: 'zhang_san',
                realName: '张三',
                phone: '13888888888',
                email: 'zhang_san@example.com',
                isVerified: true,
                balance: 120,
                loginTime: new Date().toISOString()
            };
            
            // 模拟成功登录
            setCurrentUser(mockUser);
            
            const user = mockUser;
            
            if (user) {
                // 登录成功
                
                // 显示登录成功弹窗
                const successModal = new bootstrap.Modal(loginSuccessModal);
                successModal.show();
                
                // 清空密码字段
                passwordField.value = '';
            } else {
                // 登录失败
                alert('用户名或密码错误，请重试');
                passwordField.value = '';
                passwordField.focus();
            }
        });
    }
    
    // 登录成功后跳转到首页
    if (goToHomepage) {
        goToHomepage.addEventListener('click', function() {
            window.location.href = 'user_dashboard.html';
        });
    }
    
    // 检查是否有来自localStorage的记住登录状态
    function checkSavedLogin() {
        const savedUser = getCurrentUser();
        if (savedUser && savedUser.expireTime) {
            const expireTime = new Date(savedUser.expireTime);
            if (expireTime > new Date()) {
                // 有效期内，自动跳转到用户仪表盘
                window.location.href = 'user_dashboard.html';
            } else {
                // 过期了，清除登录信息
                logout();
            }
        }
    }
    
    // 页面加载时检查保存的登录状态
    checkSavedLogin();
});