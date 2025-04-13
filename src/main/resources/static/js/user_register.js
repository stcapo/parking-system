/**
 * 智慧停车场 - 用户注册脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const registerForm = document.getElementById('registerForm');
    
    // 获取步骤指示器
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    const step3Indicator = document.getElementById('step3Indicator');
    
    // 获取表单步骤内容
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    // 获取步骤控制按钮
    const goToStep2 = document.getElementById('goToStep2');
    const backToStep1 = document.getElementById('backToStep1');
    const goToStep3 = document.getElementById('goToStep3');
    const backToStep2 = document.getElementById('backToStep2');
    const submitRegistration = document.getElementById('submitRegistration');
    
    // 表单字段
    const usernameField = document.getElementById('username');
    const phoneField = document.getElementById('phone');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const realNameField = document.getElementById('realName');
    const idNumberField = document.getElementById('idNumber');
    const licensePlateField = document.getElementById('licensePlate');
    const vehicleTypeField = document.getElementById('vehicleType');
    const vehicleBrandField = document.getElementById('vehicleBrand');
    const vehicleModelField = document.getElementById('vehicleModel');
    const vehicleColorField = document.getElementById('vehicleColor');
    const vehicleYearField = document.getElementById('vehicleYear');
    const addMoreVehiclesCheck = document.getElementById('addMoreVehicles');
    const additionalVehicleInfo = document.getElementById('additionalVehicleInfo');
    const agreeTermsCheck = document.getElementById('agreeTerms');
    
    // 密码显示/隐藏切换
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    // 确认信息显示
    const confirmUsername = document.getElementById('confirmUsername');
    const confirmPhone = document.getElementById('confirmPhone');
    const confirmEmail = document.getElementById('confirmEmail');
    const confirmRealName = document.getElementById('confirmRealName');
    const confirmLicensePlate = document.getElementById('confirmLicensePlate');
    const confirmVehicleType = document.getElementById('confirmVehicleType');
    const confirmVehicleModel = document.getElementById('confirmVehicleModel');
    const confirmVehicleColor = document.getElementById('confirmVehicleColor');
    
    // 注册成功弹窗
    const registerSuccessModal = document.getElementById('registerSuccessModal');
    const goToLogin = document.getElementById('goToLogin');
    
    // 绑定密码显示/隐藏切换功能
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            togglePasswordVisibility(passwordField, this);
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordField, this);
        });
    }
    
    // 显示/隐藏密码
    function togglePasswordVisibility(inputField, button) {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        button.querySelector('i').classList.toggle('fa-eye');
        button.querySelector('i').classList.toggle('fa-eye-slash');
    }
    
    // 多车辆选项
    if (addMoreVehiclesCheck) {
        addMoreVehiclesCheck.addEventListener('change', function() {
            additionalVehicleInfo.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // 第一步到第二步
    if (goToStep2) {
        goToStep2.addEventListener('click', function() {
            // 验证第一步表单
            if (!validateStep1()) {
                return;
            }
            
            // 显示第二步
            step1.style.display = 'none';
            step2.style.display = 'block';
            
            // 更新步骤指示器
            step1Indicator.classList.remove('active');
            step2Indicator.classList.add('active');
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 第二步返回第一步
    if (backToStep1) {
        backToStep1.addEventListener('click', function() {
            step2.style.display = 'none';
            step1.style.display = 'block';
            
            step2Indicator.classList.remove('active');
            step1Indicator.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 第二步到第三步
    if (goToStep3) {
        goToStep3.addEventListener('click', function() {
            // 验证第二步表单
            if (!validateStep2()) {
                return;
            }
            
            // 更新确认信息
            updateConfirmInfo();
            
            // 显示第三步
            step2.style.display = 'none';
            step3.style.display = 'block';
            
            // 更新步骤指示器
            step2Indicator.classList.remove('active');
            step3Indicator.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 第三步返回第二步
    if (backToStep2) {
        backToStep2.addEventListener('click', function() {
            step3.style.display = 'none';
            step2.style.display = 'block';
            
            step3Indicator.classList.remove('active');
            step2Indicator.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 验证第一步表单
    function validateStep1() {
        // 用户名验证
        if (!usernameField.value.trim()) {
            alert('请输入用户名');
            usernameField.focus();
            return false;
        }
        
        if (usernameField.value.length < 5 || usernameField.value.length > 20) {
            alert('用户名长度应为5-20个字符');
            usernameField.focus();
            return false;
        }
        
        // 手机号验证
        if (!phoneField.value.trim()) {
            alert('请输入手机号码');
            phoneField.focus();
            return false;
        }
        
        // 简单的手机号格式验证（中国手机号11位）
        if (!/^1\d{10}$/.test(phoneField.value.trim())) {
            alert('请输入有效的手机号码');
            phoneField.focus();
            return false;
        }
        
        // 邮箱验证
        if (!emailField.value.trim()) {
            alert('请输入电子邮箱');
            emailField.focus();
            return false;
        }
        
        // 简单的邮箱格式验证
        if (!/\S+@\S+\.\S+/.test(emailField.value.trim())) {
            alert('请输入有效的电子邮箱');
            emailField.focus();
            return false;
        }
        
        // 密码验证
        if (!passwordField.value) {
            alert('请设置密码');
            passwordField.focus();
            return false;
        }
        
        if (passwordField.value.length < 8) {
            alert('密码长度至少8位');
            passwordField.focus();
            return false;
        }
        
        // 简单的密码强度验证（必须包含字母和数字）
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(passwordField.value)) {
            alert('密码必须包含字母和数字');
            passwordField.focus();
            return false;
        }
        
        // 确认密码验证
        if (!confirmPasswordField.value) {
            alert('请确认密码');
            confirmPasswordField.focus();
            return false;
        }
        
        if (passwordField.value !== confirmPasswordField.value) {
            alert('两次输入的密码不一致');
            confirmPasswordField.focus();
            return false;
        }
        
        return true;
    }
    
    // 验证第二步表单
    function validateStep2() {
        // 车牌号验证
        if (!licensePlateField.value.trim()) {
            alert('请输入车牌号码');
            licensePlateField.focus();
            return false;
        }
        
        // 车辆类型验证
        if (!vehicleTypeField.value) {
            alert('请选择车辆类型');
            vehicleTypeField.focus();
            return false;
        }
        
        return true;
    }
    
    // 更新确认信息
    function updateConfirmInfo() {
        confirmUsername.textContent = usernameField.value;
        confirmPhone.textContent = phoneField.value;
        confirmEmail.textContent = emailField.value;
        confirmRealName.textContent = realNameField.value || '未填写';
        
        confirmLicensePlate.textContent = licensePlateField.value;
        
        // 获取车辆类型的显示文本
        const vehicleTypeText = vehicleTypeField.options[vehicleTypeField.selectedIndex].text;
        confirmVehicleType.textContent = vehicleTypeText;
        
        // 获取车辆品牌的显示文本（如果已选择）
        let brandText = '';
        if (vehicleBrandField.value) {
            brandText = vehicleBrandField.options[vehicleBrandField.selectedIndex].text;
        }
        
        // 组合品牌和型号
        if (brandText && vehicleModelField.value) {
            confirmVehicleModel.textContent = brandText + ' ' + vehicleModelField.value;
        } else if (brandText) {
            confirmVehicleModel.textContent = brandText;
        } else if (vehicleModelField.value) {
            confirmVehicleModel.textContent = vehicleModelField.value;
        } else {
            confirmVehicleModel.textContent = '未填写';
        }
        
        // 获取车辆颜色的显示文本（如果已选择）
        if (vehicleColorField.value) {
            const vehicleColorText = vehicleColorField.options[vehicleColorField.selectedIndex].text;
            confirmVehicleColor.textContent = vehicleColorText;
        } else {
            confirmVehicleColor.textContent = '未填写';
        }
    }
    
    // 注册表单提交
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 验证是否同意条款
            if (!agreeTermsCheck.checked) {
                alert('请阅读并同意用户服务协议和隐私政策');
                return;
            }
            
            // 创建用户对象
            const user = {
                id: 'user_' + Date.now(),
                username: usernameField.value,
                phone: phoneField.value,
                email: emailField.value,
                realName: realNameField.value,
                idNumber: idNumberField.value,
                registrationDate: new Date().toISOString(),
                isVerified: false
            };
            
            // 创建车辆对象
            const vehicle = {
                id: 'vehicle_' + Date.now(),
                userId: user.id,
                licensePlate: licensePlateField.value,
                vehicleType: vehicleTypeField.value,
                brand: vehicleBrandField.value,
                model: vehicleModelField.value,
                color: vehicleColorField.value,
                year: vehicleYearField.value
            };
            
            // 获取现有用户列表
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // 检查用户名是否已存在
            const usernameExists = users.some(u => u.username === user.username);
            if (usernameExists) {
                alert('用户名已存在，请选择其他用户名');
                return;
            }
            
            // 检查手机号是否已存在
            const phoneExists = users.some(u => u.phone === user.phone);
            if (phoneExists) {
                alert('手机号已被注册');
                return;
            }
            
            // 获取现有车辆列表
            let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
            
            // 检查车牌号是否已存在
            const licensePlateExists = vehicles.some(v => v.licensePlate === vehicle.licensePlate);
            if (licensePlateExists) {
                alert('车牌号已被注册');
                return;
            }
            
            // 保存密码（实际项目中应进行哈希处理）
            user.password = passwordField.value;
            
            // 添加新用户和车辆
            users.push(user);
            vehicles.push(vehicle);
            
            // 保存到localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            
            // 显示注册成功弹窗
            const successModal = new bootstrap.Modal(registerSuccessModal);
            successModal.show();
        });
    }
    
    // 注册成功后跳转到登录页
    if (goToLogin) {
        goToLogin.addEventListener('click', function() {
            window.location.href = 'user_login.html';
        });
    }
});