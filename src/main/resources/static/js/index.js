/**
 * 智能停车管理系统 - 首页脚本
 * 包含登录功能、首页仪表盘数据展示
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已登录
    const currentUser = getCurrentUser();
    if (currentUser) {
        // 如果已登录，显示仪表盘
        showDashboard();
    } else {
        // 如果未登录，显示登录表单
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
    }

    // 绑定登录按钮事件
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    
    // 绑定入场/出场按钮事件
    document.getElementById('entryBtn').addEventListener('click', handleVehicleEntry);
    document.getElementById('exitBtn').addEventListener('click', handleVehicleExit);
    
    // 绑定完成支付按钮事件
    document.getElementById('completePayment').addEventListener('click', completePayment);
});

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // 简单的验证 (演示用)
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    // 模拟登录验证 (演示用)
    if ((username === 'admin' && password === 'admin') || 
        (username === 'user' && password === 'user')) {
        
        // 存储登录信息
        const user = {
            username: username,
            type: userType,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 显示仪表盘
        showDashboard();
    } else {
        alert('用户名或密码错误');
    }
}

// 显示仪表盘
async function showDashboard() {
    // 隐藏登录表单，显示仪表盘
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
    
    // 加载统计数据
    await updateDashboardStats();
}

// 更新仪表盘统计数据
async function updateDashboardStats() {
    // 加载数据
    const spaces = await loadData('spaces');
    const records = await loadData('records');
    
    // 计算车位使用率
    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(space => space.isOccupied).length;
    const parkingRate = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;
    
    // 获取今日记录
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = records.filter(record => {
        const entryDate = new Date(record.entryTime);
        return entryDate >= today;
    });
    
    // 计算今日收入
    const todayIncome = todayRecords
        .filter(record => record.isPaid)
        .reduce((sum, record) => sum + record.fee, 0);
    
    // 更新UI
    document.getElementById('parkingRate').textContent = parkingRate + '%';
    document.getElementById('dailyEntries').textContent = todayRecords.length;
    document.getElementById('currentVehicles').textContent = occupiedSpaces;
    document.getElementById('dailyIncome').textContent = '¥' + todayIncome;
}

// 处理车辆入场
async function handleVehicleEntry() {
    const licensePlate = document.getElementById('quickLicensePlate').value.trim();
    
    if (!licensePlate) {
        alert('请输入车牌号');
        return;
    }
    
    // 查找车辆信息
    const vehicles = await loadData('vehicles');
    let vehicle = vehicles.find(v => v.licensePlate === licensePlate);
    
    if (!vehicle) {
        // 车辆不存在，提示用户是否添加
        const addNew = confirm(`未找到车牌为 ${licensePlate} 的车辆信息，是否添加新车辆？`);
        if (addNew) {
            // 创建新车辆
            vehicle = {
                id: 'v' + (vehicles.length + 1).toString().padStart(3, '0'),
                licensePlate: licensePlate,
                vehicleType: 'sedan', // 默认为轿车
                color: '未知',
                owner: '临时用户',
                phone: ''
            };
            
            // 添加到车辆列表
            vehicles.push(vehicle);
            saveData('vehicles', vehicles);
        } else {
            return;
        }
    }
    
    // 分配车位
    const spaces = await loadData('spaces');
    const availableSpace = spaces.find(s => !s.isOccupied);
    
    if (!availableSpace) {
        alert('抱歉，当前无可用车位');
        return;
    }
    
    // 更新车位状态
    availableSpace.isOccupied = true;
    availableSpace.vehicleId = vehicle.id;
    saveData('spaces', spaces);
    
    // 创建停车记录
    const records = await loadData('records');
    const newRecord = {
        id: 'r' + (records.length + 1).toString().padStart(3, '0'),
        vehicleId: vehicle.id,
        spaceId: availableSpace.id,
        entryTime: new Date().toISOString(),
        exitTime: null,
        duration: 0,
        fee: 0,
        isPaid: false
    };
    
    // 保存记录
    records.push(newRecord);
    saveData('records', records);
    
    // 更新统计数据
    updateDashboardStats();
    
    // 提示成功
    alert(`车辆 ${licensePlate} 已成功入场，分配车位: ${availableSpace.location}`);
    
    // 清空输入框
    document.getElementById('quickLicensePlate').value = '';
}

// 处理车辆出场
async function handleVehicleExit() {
    const licensePlate = document.getElementById('quickLicensePlate').value.trim();
    
    if (!licensePlate) {
        alert('请输入车牌号');
        return;
    }
    
    // 查找车辆信息
    const vehicles = await loadData('vehicles');
    const vehicle = vehicles.find(v => v.licensePlate === licensePlate);
    
    if (!vehicle) {
        alert(`未找到车牌为 ${licensePlate} 的车辆信息`);
        return;
    }
    
    // 查找未支付的停车记录
    const records = await loadData('records');
    const record = records.find(r => r.vehicleId === vehicle.id && !r.isPaid);
    
    if (!record) {
        alert('未找到该车辆的停车记录或记录已结算');
        return;
    }
    
    // 查找车位信息
    const spaces = await loadData('spaces');
    const space = spaces.find(s => s.id === record.spaceId);
    
    if (!space) {
        alert('车位信息异常');
        return;
    }
    
    // 计算停车时长和费用
    const entryTime = new Date(record.entryTime);
    const exitTime = new Date();
    const durationMinutes = calculateDuration(entryTime, exitTime);
    
    // 计算费用
    const fee = await calculateParkingFee(durationMinutes, vehicle.vehicleType);
    
    // 更新记录
    record.exitTime = exitTime.toISOString();
    record.duration = durationMinutes;
    record.fee = fee;
    
    // 显示支付信息
    showPaymentModal(record, vehicle, space);
}

// 显示支付模态框
function showPaymentModal(record, vehicle, space) {
    // 设置支付信息
    document.getElementById('paymentVehicleInfo').textContent = 
        `${vehicle.licensePlate} ${vehicle.color}${getVehicleTypeName(vehicle.vehicleType)}`;
    
    document.getElementById('paymentTimeInfo').textContent = 
        `停车时间: ${formatDuration(record.duration)}`;
    
    document.getElementById('paymentFeeInfo').textContent = 
        `需支付: ¥${record.fee}`;
    
    // 显示模态框
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
    
    // 存储当前处理的记录ID
    localStorage.setItem('currentPaymentRecord', record.id);
}

// 完成支付处理
async function completePayment() {
    // 获取当前支付的记录ID
    const recordId = localStorage.getItem('currentPaymentRecord');
    if (!recordId) return;
    
    // 查找记录
    const records = await loadData('records');
    const recordIndex = records.findIndex(r => r.id === recordId);
    
    if (recordIndex === -1) {
        alert('记录信息异常');
        return;
    }
    
    // 获取支付方式
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id === 'wechatPay' 
        ? 'wechat' : 'alipay';
    
    // 更新记录
    records[recordIndex].isPaid = true;
    records[recordIndex].paymentMethod = paymentMethod;
    records[recordIndex].paymentTime = new Date().toISOString();
    
    // 保存记录
    saveData('records', records);
    
    // 释放车位
    const spaceId = records[recordIndex].spaceId;
    const spaces = await loadData('spaces');
    const spaceIndex = spaces.findIndex(s => s.id === spaceId);
    
    if (spaceIndex !== -1) {
        spaces[spaceIndex].isOccupied = false;
        spaces[spaceIndex].vehicleId = null;
        saveData('spaces', spaces);
    }
    
    // 关闭模态框
    const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    paymentModal.hide();
    
    // 清除临时存储
    localStorage.removeItem('currentPaymentRecord');
    
    // 更新仪表盘
    updateDashboardStats();
    
    // 提示成功
    alert('支付成功，车辆可以离场');
    
    // 清空输入框
    document.getElementById('quickLicensePlate').value = '';
}