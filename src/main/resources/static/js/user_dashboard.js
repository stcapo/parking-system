/**
 * 智慧停车场 - 用户仪表盘脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // 未登录，重定向到登录页面
        window.location.href = 'user_login.html';
        return;
    }
    
    // 初始化页面数据
    initDashboard(currentUser);
    
    // 绑定车辆定位按钮事件
    const locateVehicleBtn = document.getElementById('locateVehicleBtn');
    if (locateVehicleBtn) {
        locateVehicleBtn.addEventListener('click', function() {
            // 显示车辆定位模态框
            const locateVehicleModal = new bootstrap.Modal(document.getElementById('locateVehicleModal'));
            locateVehicleModal.show();
        });
    }
    
    // 绑定开始导航按钮事件
    const startNaviBtn = document.getElementById('startNaviBtn');
    if (startNaviBtn) {
        startNaviBtn.addEventListener('click', function() {
            alert('导航功能即将上线，敬请期待！');
        });
    }
});

/**
 * 初始化仪表盘数据
 * @param {Object} user 当前用户信息
 */
function initDashboard(user) {
    // 设置欢迎信息
    const dashboardUsername = document.getElementById('dashboardUsername');
    if (dashboardUsername) {
        dashboardUsername.textContent = user.realName || user.username;
    }
    
    // 加载用户基本信息
    loadUserInfo(user);
    
    // 加载车辆信息
    loadVehicles(user.id);
    
    // 加载停车记录
    loadParkingRecords(user.id);
    
    // 加载优惠券信息
    loadCoupons(user.id);
    
    // 检查是否有正在停车的车辆
    checkActiveParking(user.id);
}

/**
 * 加载用户基本信息
 * @param {Object} user 用户信息
 */
function loadUserInfo(user) {
    // 设置会员等级
    const userLevel = document.getElementById('userLevel');
    if (userLevel) {
        // 在实际应用中，应从服务器获取会员等级
        userLevel.textContent = user.vipLevel || '普通会员';
    }
    
    // 设置账户余额
    const userBalance = document.getElementById('userBalance');
    if (userBalance) {
        // 在实际应用中，应从服务器获取账户余额
        userBalance.textContent = '¥' + (user.balance || '0.00');
    }
}

/**
 * 加载用户车辆信息
 * @param {string} userId 用户ID
 */
function loadVehicles(userId) {
    // 获取用户的车辆信息
    const vehicles = getUserVehicles(userId);
    
    const dashboardVehiclesList = document.getElementById('dashboardVehiclesList');
    const noVehiclesInDashboard = document.getElementById('noVehiclesInDashboard');
    
    if (vehicles.length === 0) {
        // 没有车辆，显示空状态
        if (dashboardVehiclesList) dashboardVehiclesList.style.display = 'none';
        if (noVehiclesInDashboard) noVehiclesInDashboard.style.display = 'block';
        return;
    }
    
    // 有车辆，隐藏空状态
    if (dashboardVehiclesList) dashboardVehiclesList.style.display = 'block';
    if (noVehiclesInDashboard) noVehiclesInDashboard.style.display = 'none';
    
    // 清空现有内容
    if (dashboardVehiclesList) {
        dashboardVehiclesList.innerHTML = '';
        
        // 最多显示3辆车
        const displayVehicles = vehicles.slice(0, 3);
        
        // 添加车辆信息
        displayVehicles.forEach(vehicle => {
            // 判断车辆类型图标
            let vehicleIcon = 'fa-car';
            let iconColorClass = 'text-primary';
            
            if (vehicle.type === 'new-energy') {
                vehicleIcon = 'fa-charging-station';
                iconColorClass = 'text-success';
            } else if (vehicle.type === 'suv') {
                vehicleIcon = 'fa-truck-monster';
            } else if (vehicle.type === 'truck') {
                vehicleIcon = 'fa-truck';
            }
            
            // 判断车辆状态
            const isParking = checkVehicleParking(vehicle.licensePlate);
            const statusBadge = isParking ? 
                '<span class="badge bg-danger">停车中</span>' : 
                '<span class="badge bg-success">已出场</span>';
            
            // 车辆品牌和颜色信息
            const brandInfo = vehicle.brand ? `${getBrandName(vehicle.brand)} ${vehicle.model || ''}` : '';
            const colorInfo = vehicle.color ? `${getColorName(vehicle.color)}` : '';
            const vehicleTypeInfo = vehicle.type ? `${getVehicleTypeName(vehicle.type)}` : '';
            const vehicleInfo = [brandInfo, colorInfo + vehicleTypeInfo].filter(Boolean).join(' · ');
            
            const html = `
                <div class="list-group-item px-4 py-3">
                    <div class="d-flex align-items-center">
                        <div class="vehicle-icon me-3">
                            <i class="fas ${vehicleIcon} fa-2x ${iconColorClass}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">${vehicle.licensePlate}</h6>
                                ${statusBadge}
                            </div>
                            <p class="mb-0 small text-muted">${vehicleInfo}</p>
                        </div>
                    </div>
                </div>
            `;
            
            dashboardVehiclesList.innerHTML += html;
        });
    }
}

/**
 * 加载停车记录
 * @param {string} userId 用户ID
 */
function loadParkingRecords(userId) {
    // 在实际应用中，应从服务器获取停车记录
    // 这里使用模拟数据
    const parkingRecords = getParkingRecords(userId);
    
    const dashboardParkingRecords = document.getElementById('dashboardParkingRecords');
    const noRecordsInDashboard = document.getElementById('noRecordsInDashboard');
    
    if (parkingRecords.length === 0) {
        // 没有记录，显示空状态
        if (dashboardParkingRecords) dashboardParkingRecords.style.display = 'none';
        if (noRecordsInDashboard) noRecordsInDashboard.style.display = 'block';
        return;
    }
    
    // 有记录，隐藏空状态
    if (dashboardParkingRecords) dashboardParkingRecords.style.display = 'block';
    if (noRecordsInDashboard) noRecordsInDashboard.style.display = 'none';
    
    // 清空现有内容
    if (dashboardParkingRecords) {
        dashboardParkingRecords.innerHTML = '';
        
        // 最多显示3条记录
        const displayRecords = parkingRecords.slice(0, 3);
        
        // 添加记录信息
        displayRecords.forEach(record => {
            // 格式化入场和出场时间
            const entryTime = formatDateTime(record.entryTime);
            const exitTime = record.exitTime ? formatDateTime(record.exitTime) : '停车中';
            
            // 计算停车费用
            const fee = typeof record.fee === 'number' ? record.fee.toFixed(2) : '-';
            
            // 判断支付状态
            const isPaid = record.status === 'paid';
            const statusBadge = isPaid ? 
                '<span class="badge bg-success">已支付</span>' : 
                '<span class="badge bg-warning text-dark">未支付</span>';
            
            const html = `
                <div class="list-group-item px-4 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${record.licensePlate} · ${record.parkingLot}</h6>
                            <p class="mb-0 small text-muted">${entryTime} - ${exitTime}</p>
                        </div>
                        <div class="text-end">
                            <div class="text-primary fw-bold">¥${fee}</div>
                            ${statusBadge}
                        </div>
                    </div>
                </div>
            `;
            
            dashboardParkingRecords.innerHTML += html;
        });
    }
}

/**
 * 加载优惠券信息
 * @param {string} userId 用户ID
 */
function loadCoupons(userId) {
    // 在实际应用中，应从服务器获取优惠券信息
    // 这里使用模拟数据
    const coupons = getCoupons(userId);
    
    const dashboardCoupons = document.getElementById('dashboardCoupons');
    const noCouponsInDashboard = document.getElementById('noCouponsInDashboard');
    
    if (coupons.length === 0) {
        // 没有优惠券，显示空状态
        if (dashboardCoupons) dashboardCoupons.style.display = 'none';
        if (noCouponsInDashboard) noCouponsInDashboard.style.display = 'block';
        return;
    }
    
    // 有优惠券，隐藏空状态
    if (dashboardCoupons) dashboardCoupons.style.display = 'block';
    if (noCouponsInDashboard) noCouponsInDashboard.style.display = 'none';
    
    // 清空现有内容
    if (dashboardCoupons) {
        dashboardCoupons.innerHTML = '';
        
        // 最多显示3张优惠券
        const displayCoupons = coupons.slice(0, 3);
        
        // 添加优惠券信息
        displayCoupons.forEach(coupon => {
            // 判断图标
            let couponIcon = 'fa-ticket-alt';
            let iconColorClass = 'text-danger';
            
            if (coupon.type === 'discount') {
                couponIcon = 'fa-percentage';
                iconColorClass = 'text-success';
            } else if (coupon.type === 'service') {
                couponIcon = 'fa-car-side';
                iconColorClass = 'text-primary';
            }
            
            // 判断状态
            const now = new Date();
            const expiryDate = new Date(coupon.expiryDate);
            const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            
            let statusBadge = '<span class="badge bg-success">可用</span>';
            if (daysToExpiry <= 7) {
                statusBadge = '<span class="badge bg-warning text-dark">即将过期</span>';
            } else if (daysToExpiry <= 0) {
                statusBadge = '<span class="badge bg-secondary">已过期</span>';
            }
            
            const html = `
                <div class="list-group-item px-4 py-3">
                    <div class="d-flex align-items-center">
                        <div class="coupon-icon me-3 ${iconColorClass}">
                            <i class="fas ${couponIcon} fa-2x"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">${coupon.name}</h6>
                                ${statusBadge}
                            </div>
                            <p class="mb-0 small text-muted">有效期至：${formatDate(coupon.expiryDate)}</p>
                        </div>
                    </div>
                </div>
            `;
            
            dashboardCoupons.innerHTML += html;
        });
    }
}

/**
 * 检查是否有正在停车的车辆
 * @param {string} userId 用户ID
 */
function checkActiveParking(userId) {
    // 在实际应用中，应从服务器获取当前停车状态
    // 这里使用模拟数据
    const activeParking = getActiveParking(userId);
    
    const activeParkingElement = document.getElementById('activeParking');
    const noActiveParkingElement = document.getElementById('noActiveParking');
    
    if (!activeParking) {
        // 没有正在停车的车辆
        if (activeParkingElement) activeParkingElement.style.display = 'none';
        if (noActiveParkingElement) noActiveParkingElement.style.display = 'block';
        return;
    }
    
    // 有正在停车的车辆
    if (activeParkingElement) activeParkingElement.style.display = 'block';
    if (noActiveParkingElement) noActiveParkingElement.style.display = 'none';
    
    // 更新车辆信息
    document.getElementById('activeParkingPlate').textContent = activeParking.licensePlate;
    document.getElementById('activeParkingLocation').textContent = `${activeParking.parkingLot} - ${activeParking.spaceLocation}`;
    document.getElementById('activeParkingEntryTime').textContent = formatDateTime(activeParking.entryTime);
    
    // 计算停车时长
    const entryTime = new Date(activeParking.entryTime);
    const now = new Date();
    const durationMs = now - entryTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('activeParkingDuration').textContent = `${hours}小时${minutes}分钟`;
    
    // 计算预估费用
    const vehicle = findVehicleByPlate(activeParking.licensePlate);
    const fee = calculateParkingFee(entryTime, now, vehicle ? vehicle.type : null);
    document.getElementById('activeParkingFee').textContent = `¥${fee.toFixed(2)}`;
}

/**
 * 获取车辆品牌名称
 * @param {string} brandCode 品牌代码
 * @returns {string} 品牌名称
 */
function getBrandName(brandCode) {
    const brandMap = {
        'audi': '奥迪',
        'bmw': '宝马',
        'benz': '奔驰',
        'toyota': '丰田',
        'honda': '本田',
        'volkswagen': '大众',
        'ford': '福特',
        'buick': '别克',
        'chevrolet': '雪佛兰',
        'nissan': '日产',
        'hyundai': '现代',
        'kia': '起亚',
        'byd': '比亚迪',
        'tesla': '特斯拉'
    };
    return brandMap[brandCode] || brandCode;
}

/**
 * 获取车辆颜色名称
 * @param {string} colorCode 颜色代码
 * @returns {string} 颜色名称
 */
function getColorName(colorCode) {
    const colorMap = {
        'white': '白色',
        'black': '黑色',
        'silver': '银色',
        'gray': '灰色',
        'red': '红色',
        'blue': '蓝色',
        'green': '绿色',
        'yellow': '黄色',
        'brown': '棕色'
    };
    return colorMap[colorCode] || colorCode;
}

/**
 * 格式化日期（仅显示日期部分）
 * @param {string} dateString 日期字符串
 * @returns {string} 格式化的日期字符串
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * 检查车辆是否在停车场内
 * @param {string} licensePlate 车牌号
 * @returns {boolean} 是否在停车场内
 */
function checkVehicleParking(licensePlate) {
    // 在实际应用中，应从服务器获取车辆当前状态
    // 这里使用模拟数据，简单判断
    return licensePlate === '京NEV789';
}

/**
 * 根据车牌号查找车辆信息
 * @param {string} licensePlate 车牌号
 * @returns {Object|null} 车辆信息
 */
function findVehicleByPlate(licensePlate) {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const vehicles = getUserVehicles(currentUser.id);
    return vehicles.find(v => v.licensePlate === licensePlate) || null;
}

/**
 * 获取用户正在停车的车辆信息
 * @param {string} userId 用户ID
 * @returns {Object|null} 当前停车信息
 */
function getActiveParking(userId) {
    // 在实际应用中，应从服务器获取当前停车状态
    // 这里返回模拟数据
    return {
        userId: userId,
        recordId: 'r005',
        licensePlate: '京NEV789',
        parkingLot: '总部停车场',
        spaceLocation: 'A区15号',
        entryTime: '2025-04-06T09:15:00',
        vehicleType: 'new-energy'
    };
}

/**
 * 获取停车记录
 * @param {string} userId 用户ID
 * @returns {Array} 停车记录列表
 */
function getParkingRecords(userId) {
    // 在实际应用中，应从服务器获取停车记录
    // 这里返回模拟数据
    return [
        {
            id: 'r001',
            userId: userId,
            licensePlate: '京A12345',
            parkingLot: '总部停车场',
            entryTime: '2025-04-05T08:30:00',
            exitTime: '2025-04-05T17:45:00',
            fee: 50,
            status: 'paid'
        },
        {
            id: 'r002',
            userId: userId,
            licensePlate: '京A12345',
            parkingLot: '商场停车场',
            entryTime: '2025-04-03T14:20:00',
            exitTime: '2025-04-03T16:35:00',
            fee: 20,
            status: 'paid'
        },
        {
            id: 'r003',
            userId: userId,
            licensePlate: '京NEV789',
            parkingLot: '商场停车场',
            entryTime: '2025-04-02T10:10:00',
            exitTime: '2025-04-02T11:55:00',
            fee: 16,
            status: 'paid'
        }
    ];
}

/**
 * 获取优惠券信息
 * @param {string} userId 用户ID
 * @returns {Array} 优惠券列表
 */
function getCoupons(userId) {
    // 在实际应用中，应从服务器获取优惠券信息
    // 这里返回模拟数据
    return [
        {
            id: 'c001',
            userId: userId,
            name: '10元停车抵用券',
            type: 'voucher',
            value: 10,
            expiryDate: '2025-04-30',
            status: 'valid'
        },
        {
            id: 'c002',
            userId: userId,
            name: '周末停车8折券',
            type: 'discount',
            value: 0.8,
            expiryDate: '2025-05-31',
            status: 'valid'
        },
        {
            id: 'c003',
            userId: userId,
            name: '洗车服务券',
            type: 'service',
            value: '免费洗车一次',
            expiryDate: '2025-06-15',
            status: 'valid'
        }
    ];
}