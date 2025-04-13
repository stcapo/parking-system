/**
 * 智能停车管理系统 - 公共函数库
 * 包含数据加载、持久化存储、公共工具函数等
 */

// 从JSON文件加载数据
function loadData(dataType) {
    return new Promise((resolve) => {
        // 检查localStorage中是否有数据
        const storedData = localStorage.getItem(dataType);
        
        if (storedData) {
            // 如果存在，则返回解析后的数据
            resolve(JSON.parse(storedData));
        } else {
            // 如果不存在，加载默认数据
            const defaultData = getDefaultData(dataType);
            
            // 存入localStorage
            localStorage.setItem(dataType, JSON.stringify(defaultData));
            
            // 返回默认数据
            resolve(defaultData);
        }
    });
}

// 获取默认数据
function getDefaultData(dataType) {
    switch (dataType) {
        case 'vehicles':
            return [
                {
                    id: "v001",
                    licensePlate: "京Z12345",
                    vehicleType: "sedan",
                    color: "黑色",
                    owner: "张三",
                    phone: "13800138000"
                },
                {
                    id: "v002",
                    licensePlate: "京B67890",
                    vehicleType: "suv",
                    color: "白色",
                    owner: "李四",
                    phone: "13900139000"
                },
                {
                    id: "v003",
                    licensePlate: "京C13579",
                    vehicleType: "new-energy",
                    color: "蓝色",
                    owner: "王五",
                    phone: "13700137000"
                }
            ];
            
        case 'spaces':
            return [
                {
                    id: "p001",
                    isOccupied: false,
                    vehicleId: null,
                    type: "standard",
                    location: "A区-01"
                },
                {
                    id: "p002",
                    isOccupied: true,
                    vehicleId: "v001",
                    type: "standard",
                    location: "A区-02"
                },
                {
                    id: "p003",
                    isOccupied: false,
                    vehicleId: null,
                    type: "large",
                    location: "B区-01"
                },
                {
                    id: "p004",
                    isOccupied: false,
                    vehicleId: null,
                    type: "charging",
                    location: "C区-01"
                },
                {
                    id: "p005",
                    isOccupied: true,
                    vehicleId: "v003",
                    type: "charging",
                    location: "C区-02"
                }
            ];
            
        case 'records':
            return [
                {
                    id: "r001",
                    vehicleId: "v002",
                    spaceId: "p001",
                    entryTime: "2025-04-04T15:30:00",
                    exitTime: "2025-04-04T18:45:00",
                    duration: 195, // 分钟
                    fee: 20,
                    isPaid: true,
                    paymentMethod: "wechat",
                    paymentTime: "2025-04-04T18:43:25"
                },
                {
                    id: "r002",
                    vehicleId: "v001",
                    spaceId: "p002",
                    entryTime: "2025-04-05T09:15:00",
                    exitTime: null,
                    duration: 0,
                    fee: 0,
                    isPaid: false
                },
                {
                    id: "r003",
                    vehicleId: "v003",
                    spaceId: "p005",
                    entryTime: "2025-04-05T10:45:00",
                    exitTime: null,
                    duration: 0,
                    fee: 0,
                    isPaid: false
                }
            ];
            
        case 'settings':
            return {
                pricing: {
                    basePrice: 10, // 基础费用
                    hourlyRate: 5,  // 每小时费率
                    maxDailyFee: 50, // 每日上限
                    discounts: {
                        newEnergy: 0.8, // 新能源车折扣
                        monthly: 0.7   // 月卡折扣
                    },
                    holidayRates: true,
                    holidayMultiplier: 1.5
                },
                system: {
                    parkingName: "智能停车管理系统演示",
                    contactPhone: "010-12345678",
                    address: "北京市海淀区XX路XX号",
                    darkMode: false,
                    showStatistics: true,
                    refreshInterval: 30
                }
            };
            
        default:
            return [];
    }
}

// 保存数据到localStorage
function saveData(dataType, data) {
    localStorage.setItem(dataType, JSON.stringify(data));
}

// 获取当前登录用户
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null;
}

// 检查是否已登录
function checkLogin() {
    const currentUser = getCurrentUser();
    if (!currentUser && window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
        // 未登录且不在登录页，重定向到登录页
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// 格式化日期时间
function formatDateTime(dateStr) {
    const date = new Date(dateStr);
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

// 格式化时长
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    } else {
        return `${mins}分钟`;
    }
}

// 计算时长（分钟）
function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    const durationMs = end - start;
    return Math.ceil(durationMs / (1000 * 60)); // 转换为分钟
}

// 计算停车费用
async function calculateParkingFee(durationMinutes, vehicleType) {
    const settings = await loadData('settings');
    const pricing = settings.pricing;
    
    // 基础费用
    let fee = pricing.basePrice;
    
    // 计算小时费用 (每小时费率×小时数)
    const hours = Math.ceil(durationMinutes / 60);
    fee += hours * pricing.hourlyRate;
    
    // 检查每日上限
    if (fee > pricing.maxDailyFee) {
        fee = pricing.maxDailyFee;
    }
    
    // 应用折扣（如果适用）
    if (vehicleType === 'new-energy' && pricing.discounts.newEnergy) {
        fee = fee * pricing.discounts.newEnergy;
    }
    
    // 四舍五入到小数点后1位
    return Math.round(fee * 10) / 10;
}

// 车型名称映射
function getVehicleTypeName(type) {
    const typeMap = {
        'sedan': '轿车',
        'suv': 'SUV',
        'truck': '货车',
        'new-energy': '新能源车'
    };
    return typeMap[type] || type;
}

// 车位类型名称映射
function getSpaceTypeName(type) {
    const typeMap = {
        'standard': '标准车位',
        'large': '大型车位',
        'charging': '充电车位'
    };
    return typeMap[type] || type;
}

// 支付方式名称映射
function getPaymentMethodName(method) {
    const methodMap = {
        'wechat': '微信支付',
        'alipay': '支付宝',
        'cash': '现金',
        'card': '银行卡'
    };
    return methodMap[method] || '未知支付方式';
}

// 根据ID查找车辆信息
async function findVehicleById(vehicleId) {
    const vehicles = await loadData('vehicles');
    return vehicles.find(v => v.id === vehicleId) || null;
}

// 根据ID查找车位信息
async function findSpaceById(spaceId) {
    const spaces = await loadData('spaces');
    return spaces.find(s => s.id === spaceId) || null;
}

// 导出功能
function exportToJson(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// 注册通用事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 退出登录按钮事件
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // 应用深色模式（如果设置了）
    loadData('settings').then(settings => {
        if (settings.system && settings.system.darkMode) {
            document.body.classList.add('dark-mode');
        }
    });
});