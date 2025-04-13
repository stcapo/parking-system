/**
 * 智慧停车场 - 用户前端公共脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    checkLoginStatus();
    
    // 绑定退出登录按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

/**
 * 检查用户登录状态并更新界面
 */
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    
    // 获取登录/未登录状态的UI元素
    const loggedInElement = document.getElementById('loggedIn');
    const notLoggedInElement = document.getElementById('notLoggedIn');
    const userDisplayName = document.getElementById('userDisplayName');
    
    if (currentUser) {
        // 用户已登录
        if (loggedInElement) {
            loggedInElement.style.display = 'flex';
        }
        if (notLoggedInElement) {
            notLoggedInElement.style.display = 'none';
        }
        if (userDisplayName) {
            userDisplayName.textContent = currentUser.username;
        }
    } else {
        // 用户未登录
        if (loggedInElement) {
            loggedInElement.style.display = 'none';
        }
        if (notLoggedInElement) {
            notLoggedInElement.style.display = 'flex';
        }
    }
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户对象或null
 */
function getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
}

/**
 * 设置当前登录用户
 * @param {Object} user 用户对象
 */
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * 退出登录
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'user_index.html';
}

/**
 * 检查用户是否已登录，如果未登录则重定向到登录页面
 */
function requireLogin() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'user_login.html';
        return false;
    }
    return true;
}

/**
 * 用户登录
 * @param {string} username 用户名或手机号
 * @param {string} password 密码
 * @param {boolean} remember 是否记住登录状态
 * @returns {Object|null} 登录成功返回用户对象，失败返回null
 */
function userLogin(username, password, remember) {
    // 获取用户列表
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 查找匹配的用户（支持用户名或手机号登录）
    const user = users.find(u => 
        (u.username === username || u.phone === username) && u.password === password
    );
    
    if (user) {
        // 登录成功
        const userInfo = {
            id: user.id,
            username: user.username,
            phone: user.phone,
            email: user.email,
            realName: user.realName,
            isVerified: user.isVerified,
            loginTime: new Date().toISOString()
        };
        
        // 设置当前登录用户
        setCurrentUser(userInfo);
        
        // 如果选择了记住登录，设置有效期为30天
        if (remember) {
            // 在实际项目中，这应该在服务端处理，这里只是模拟
            // localStorage本身没有过期时间机制
            userInfo.expireTime = new Date();
            userInfo.expireTime.setDate(userInfo.expireTime.getDate() + 30);
            setCurrentUser(userInfo);
        }
        
        return userInfo;
    }
    
    return null;
}

/**
 * 获取用户的车辆信息
 * @param {string} userId 用户ID
 * @returns {Array} 车辆列表
 */
function getUserVehicles(userId) {
    if (!userId) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return [];
        }
        userId = currentUser.id;
    }
    
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    return vehicles.filter(v => v.userId === userId);
}

/**
 * 格式化日期时间
 * @param {string} dateTimeString ISO日期时间字符串
 * @returns {string} 格式化的日期时间字符串
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

/**
 * 生成随机订单号
 * @returns {string} 订单号
 */
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `PS${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

/**
 * 获取车辆类型名称
 * @param {string} type 车辆类型代码
 * @returns {string} 车辆类型名称
 */
function getVehicleTypeName(type) {
    const typeMap = {
        'sedan': '轿车',
        'suv': 'SUV',
        'truck': '卡车/货车',
        'new-energy': '新能源车'
    };
    return typeMap[type] || type;
}

/**
 * 计算停车费用
 * @param {Date} entryTime 入场时间
 * @param {Date} exitTime 出场时间
 * @param {string} vehicleType 车辆类型
 * @returns {number} 停车费用（元）
 */
function calculateParkingFee(entryTime, exitTime, vehicleType) {
    // 计算停车时长（分钟）
    const durationMs = exitTime - entryTime;
    const durationMinutes = Math.ceil(durationMs / (1000 * 60));
    const durationHours = Math.ceil(durationMinutes / 60);
    
    // 基础费用
    let fee = 10; // 首小时10元
    
    // 超过一小时的部分
    if (durationHours > 1) {
        fee += (durationHours - 1) * 5; // 之后每小时5元
    }
    
    // 每日上限
    if (fee > 50) {
        fee = 50;
    }
    
    // 新能源车折扣
    if (vehicleType === 'new-energy') {
        fee = fee * 0.8;
    }
    
    // 四舍五入到分
    return Math.round(fee * 100) / 100;
}

/**
 * 计算两个时间之间的时长字符串
 * @param {Date} startTime 开始时间
 * @param {Date} endTime 结束时间
 * @returns {string} 格式化的时长字符串
 */
function formatDuration(startTime, endTime) {
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}小时${minutes}分钟`;
}

/**
 * 获取当前正在停车的车辆信息
 * @param {string} userId 用户ID
 * @returns {Object|null} 当前停车信息或null
 */
function getCurrentParking(userId) {
    // 这里应从服务器获取当前停车信息
    // 以下是模拟数据，实际应用中应通过API获取
    const parkingRecords = [
        {
            id: 'parking123',
            userId: '1',
            licensePlate: '京NEV789',
            parkingLot: '总部停车场',
            spaceLocation: 'A区15号',
            entryTime: '2025-04-06T09:15:00',
            status: 'active',
            fee: 0
        }
    ];
    
    return parkingRecords.find(r => r.userId === userId && r.status === 'active') || null;
}