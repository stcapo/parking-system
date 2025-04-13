/**
 * 智慧停车场 - 支付页面脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'user_login.html';
        return;
    }
    
    // 更新用户显示名
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        userDisplayName.textContent = currentUser.username;
    }
    
    // 获取步骤元素
    const stepInfo = document.getElementById('stepInfo');
    const stepPay = document.getElementById('stepPay');
    const stepComplete = document.getElementById('stepComplete');
    
    // 获取卡片元素
    const parkingInfoCard = document.getElementById('parkingInfoCard');
    const paymentMethodCard = document.getElementById('paymentMethodCard');
    const paymentSuccessCard = document.getElementById('paymentSuccessCard');
    
    // 获取按钮元素
    const goToPayment = document.getElementById('goToPayment');
    const backToInfo = document.getElementById('backToInfo');
    const simulatePayment = document.getElementById('simulatePayment');
    const downloadReceipt = document.getElementById('downloadReceipt');
    const returnToHome = document.getElementById('returnToHome');
    
    // 初始化二维码倒计时
    let qrCodeInterval;
    
    // 从URL获取参数
    const urlParams = new URLSearchParams(window.location.search);
    const recordId = urlParams.get('recordId');
    
    // 如果有记录ID，则加载停车记录
    if (recordId) {
        loadParkingRecord(recordId);
    } else {
        // 没有记录ID时显示模拟数据
        displayMockData();
    }
    
    // 前往支付按钮点击事件
    if (goToPayment) {
        goToPayment.addEventListener('click', function() {
            // 显示支付方式卡片
            parkingInfoCard.style.display = 'none';
            paymentMethodCard.style.display = 'block';
            
            // 更新步骤指示器
            stepInfo.classList.remove('active');
            stepPay.classList.add('active');
            
            // 启动二维码倒计时
            startQrCodeTimer();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 返回信息按钮点击事件
    if (backToInfo) {
        backToInfo.addEventListener('click', function() {
            // 显示停车信息卡片
            paymentMethodCard.style.display = 'none';
            parkingInfoCard.style.display = 'block';
            
            // 更新步骤指示器
            stepPay.classList.remove('active');
            stepInfo.classList.add('active');
            
            // 停止二维码倒计时
            clearInterval(qrCodeInterval);
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 模拟支付成功按钮点击事件
    if (simulatePayment) {
        simulatePayment.addEventListener('click', function() {
            // 显示支付成功卡片
            paymentMethodCard.style.display = 'none';
            paymentSuccessCard.style.display = 'block';
            
            // 更新步骤指示器
            stepPay.classList.remove('active');
            stepComplete.classList.add('active');
            
            // 停止二维码倒计时
            clearInterval(qrCodeInterval);
            
            // 生成订单信息
            generateOrderInfo();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 下载电子收据按钮点击事件
    if (downloadReceipt) {
        downloadReceipt.addEventListener('click', function() {
            alert('收据已保存到您的设备');
        });
    }
    
    // 返回首页按钮点击事件
    if (returnToHome) {
        returnToHome.addEventListener('click', function() {
            window.location.href = 'user_index.html';
        });
    }
    
    // 银联支付按钮点击事件
    const unionpayBtn = document.getElementById('unionpayBtn');
    if (unionpayBtn) {
        unionpayBtn.addEventListener('click', function() {
            // 简单验证
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const cardExpiry = document.getElementById('cardExpiry').value.trim();
            const cardCvv = document.getElementById('cardCvv').value.trim();
            const cardHolder = document.getElementById('cardHolder').value.trim();
            
            if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
                alert('请填写完整的银行卡信息');
                return;
            }
            
            // 模拟支付成功
            simulatePayment.click();
        });
    }
    
    // Apple Pay按钮点击事件
    const applePayBtn = document.getElementById('applePayBtn');
    if (applePayBtn) {
        applePayBtn.addEventListener('click', function() {
            // 模拟支付成功
            setTimeout(function() {
                simulatePayment.click();
            }, 1500);
        });
    }
    
    /**
     * 加载停车记录
     * @param {string} recordId 记录ID
     */
    function loadParkingRecord(recordId) {
        // 实际项目中应从API获取数据
        // 这里模拟数据
        displayMockData();
    }
    
    /**
     * 显示模拟数据
     */
    function displayMockData() {
        // 获取显示元素
        const licensePlateDisplay = document.getElementById('licensePlateDisplay');
        const vehicleTypeDisplay = document.getElementById('vehicleTypeDisplay');
        const entryTimeDisplay = document.getElementById('entryTimeDisplay');
        const exitTimeDisplay = document.getElementById('exitTimeDisplay');
        const durationDisplay = document.getElementById('durationDisplay');
        const parkingSpaceDisplay = document.getElementById('parkingSpaceDisplay');
        const feeDisplay = document.getElementById('feeDisplay');
        
        // 模拟数据
        const entryTime = new Date();
        entryTime.setHours(entryTime.getHours() - 5); // 5小时前
        
        const exitTime = new Date();
        
        // 使用当前登录用户的第一辆车（如果有）
        let licensePlate = '京A12345';
        let vehicleType = '轿车';
        
        const userVehicles = getUserVehicles();
        if (userVehicles.length > 0) {
            licensePlate = userVehicles[0].licensePlate;
            vehicleType = getVehicleTypeName(userVehicles[0].vehicleType);
        }
        
        // 计算费用
        const fee = calculateParkingFee(entryTime, exitTime, 'sedan');
        
        // 更新显示
        if (licensePlateDisplay) licensePlateDisplay.textContent = licensePlate;
        if (vehicleTypeDisplay) vehicleTypeDisplay.textContent = vehicleType;
        if (entryTimeDisplay) entryTimeDisplay.textContent = formatDateTime(entryTime);
        if (exitTimeDisplay) exitTimeDisplay.textContent = formatDateTime(exitTime);
        if (durationDisplay) durationDisplay.textContent = '5小时15分钟';
        if (parkingSpaceDisplay) parkingSpaceDisplay.textContent = 'A区-02';
        if (feeDisplay) feeDisplay.textContent = '¥' + fee;
    }
    
    /**
     * 启动二维码倒计时
     */
    function startQrCodeTimer() {
        const qrCodeTimer = document.getElementById('qrCodeTimer');
        const alipayQrCodeTimer = document.getElementById('alipayQrCodeTimer');
        
        let minutes = 15;
        let seconds = 0;
        
        clearInterval(qrCodeInterval);
        
        qrCodeInterval = setInterval(function() {
            // 更新显示
            const displayTime = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            if (qrCodeTimer) qrCodeTimer.textContent = displayTime;
            if (alipayQrCodeTimer) alipayQrCodeTimer.textContent = displayTime;
            
            // 倒计时
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(qrCodeInterval);
                    alert('二维码已过期，请重新获取');
                    backToInfo.click();
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
        }, 1000);
    }
    
    /**
     * 生成订单信息
     */
    function generateOrderInfo() {
        // 生成随机订单号
        const orderNumber = generateOrderNumber();
        
        // 获取当前支付方式
        let paymentMethod = '微信支付'; // 默认为微信支付
        
        // 检查当前激活的支付选项卡
        const wechatTab = document.getElementById('wechat-tab');
        const alipayTab = document.getElementById('alipay-tab');
        const unionpayTab = document.getElementById('unionpay-tab');
        const appleTab = document.getElementById('apple-tab');
        
        if (wechatTab && wechatTab.classList.contains('active')) {
            paymentMethod = '微信支付';
        } else if (alipayTab && alipayTab.classList.contains('active')) {
            paymentMethod = '支付宝';
        } else if (unionpayTab && unionpayTab.classList.contains('active')) {
            paymentMethod = '银联支付';
        } else if (appleTab && appleTab.classList.contains('active')) {
            paymentMethod = 'Apple Pay';
        }
        
        // 获取支付金额
        const feeDisplay = document.getElementById('feeDisplay');
        const paymentAmount = feeDisplay ? feeDisplay.textContent : '¥32.5';
        
        // 获取支付时间
        const paymentTime = formatDateTime(new Date());
        
        // 更新显示
        const orderNumberDisplay = document.getElementById('orderNumberDisplay');
        const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
        const paymentAmountDisplay = document.getElementById('paymentAmountDisplay');
        const paymentTimeDisplay = document.getElementById('paymentTimeDisplay');
        
        if (orderNumberDisplay) orderNumberDisplay.textContent = orderNumber;
        if (paymentMethodDisplay) paymentMethodDisplay.textContent = paymentMethod;
        if (paymentAmountDisplay) paymentAmountDisplay.textContent = paymentAmount;
        if (paymentTimeDisplay) paymentTimeDisplay.textContent = paymentTime;
    }
});