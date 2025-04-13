/**
 * 智慧停车场 - 我的车辆页面脚本
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
    
    // 加载车辆列表
    loadVehicles();
    
    // 绑定添加车辆按钮
    const saveVehicleBtn = document.getElementById('saveVehicleBtn');
    if (saveVehicleBtn) {
        saveVehicleBtn.addEventListener('click', saveVehicle);
    }
    
    // 绑定更新车辆按钮
    const updateVehicleBtn = document.getElementById('updateVehicleBtn');
    if (updateVehicleBtn) {
        updateVehicleBtn.addEventListener('click', updateVehicle);
    }
    
    // 绑定确认删除按钮
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteVehicle);
    }
});

/**
 * 加载用户的车辆列表
 */
function loadVehicles() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 从localStorage获取车辆数据
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    
    // 过滤出当前用户的车辆
    const userVehicles = vehicles.filter(vehicle => vehicle.userId === currentUser.id);
    
    // 获取默认车辆设置
    const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    const defaultVehicleId = userSettings[currentUser.id]?.defaultVehicleId || '';
    
    // 获取展示容器
    const noVehiclesMessage = document.getElementById('noVehiclesMessage');
    const vehiclesList = document.getElementById('vehiclesList');
    
    // 判断是否有车辆
    if (userVehicles.length === 0) {
        // 显示无车辆提示
        if (noVehiclesMessage) noVehiclesMessage.style.display = 'block';
        if (vehiclesList) vehiclesList.innerHTML = '';
        return;
    }
    
    // 有车辆，隐藏提示信息，显示车辆列表
    if (noVehiclesMessage) noVehiclesMessage.style.display = 'none';
    if (!vehiclesList) return;
    
    // 获取所有停车记录，用于确定车辆是否在停车中
    const parkingRecords = JSON.parse(localStorage.getItem('parkingRecords')) || [];
    
    // 清空列表
    vehiclesList.innerHTML = '';
    
    // 添加车辆卡片
    userVehicles.forEach(vehicle => {
        // 检查车辆是否在停车中
        const isParkingNow = parkingRecords.some(record => 
            record.vehicleId === vehicle.id && !record.exitTime
        );
        
        // 获取车辆当前停车信息
        let parkingInfo = null;
        if (isParkingNow) {
            parkingInfo = parkingRecords.find(record => 
                record.vehicleId === vehicle.id && !record.exitTime
            );
        }
        
        // 创建车辆卡片
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'card shadow-sm mb-4 vehicle-card';
        vehicleCard.dataset.id = vehicle.id;
        
        // 设置车辆图标
        let vehicleIcon = 'fa-car';
        if (vehicle.vehicleType === 'suv') vehicleIcon = 'fa-truck-monster';
        else if (vehicle.vehicleType === 'truck') vehicleIcon = 'fa-truck';
        else if (vehicle.vehicleType === 'new-energy') vehicleIcon = 'fa-charging-station';
        
        // 获取颜色和类型的中文名称
        const colorName = getColorName(vehicle.color);
        const typeName = getVehicleTypeName(vehicle.vehicleType);
        
        // 构建车辆卡片HTML
        vehicleCard.innerHTML = `
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 text-center mb-3 mb-md-0">
                        <div class="vehicle-icon">
                            <i class="fas ${vehicleIcon} fa-3x ${vehicle.vehicleType === 'new-energy' ? 'text-success' : 'text-primary'}"></i>
                        </div>
                        <div class="vehicle-plate mt-2">${vehicle.licensePlate}</div>
                    </div>
                    <div class="col-md-6">
                        <h5>${colorName}${typeName}</h5>
                        <div class="vehicle-info">
                            <p><i class="fas fa-info-circle me-2 text-muted"></i> ${getBrandName(vehicle.brand)} ${vehicle.model || ''}</p>
                            <p><i class="fas fa-calendar-alt me-2 text-muted"></i> ${vehicle.year ? vehicle.year + '年' : '年份未知'}</p>
                            <p class="mb-0">
                                <span class="badge ${vehicle.id === defaultVehicleId ? 'bg-success' : 'bg-secondary'} me-2">
                                    ${vehicle.id === defaultVehicleId ? '默认车辆' : '常用车辆'}
                                </span>
                                <span class="badge bg-info">已认证</span>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-3 d-flex flex-column justify-content-around">
                        <div class="vehicle-status text-center">
                            ${isParkingNow ? 
                                `<span class="badge bg-danger p-2 mb-2">停车中</span>
                                <p class="small">已停车：${calculateParkingDuration(parkingInfo.entryTime)}</p>` : 
                                `<span class="badge bg-success p-2 mb-2">已出场</span>
                                <p class="small">今日未入场</p>`
                            }
                        </div>
                        <div class="vehicle-actions d-flex justify-content-around">
                            <button class="btn btn-sm btn-outline-primary edit-vehicle-btn" title="编辑车辆" data-id="${vehicle.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-${vehicle.id === defaultVehicleId ? 'success' : 'secondary'} set-default-btn" 
                                title="${vehicle.id === defaultVehicleId ? '默认车辆' : '设为默认'}" data-id="${vehicle.id}">
                                <i class="fa${vehicle.id === defaultVehicleId ? 's' : 'r'} fa-star"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-vehicle-btn" title="删除车辆" data-id="${vehicle.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-light d-flex justify-content-between align-items-center py-2">
                <small class="text-muted">添加时间：${formatDate(vehicle.addTime || new Date())}</small>
                ${isParkingNow ? 
                    `<a href="user_payment.html?vehicle=${vehicle.licensePlate}" class="btn btn-sm btn-primary">
                        <i class="fas fa-credit-card me-1"></i> 立即缴费
                    </a>` : 
                    `<a href="user_parking_history.html?vehicle=${vehicle.licensePlate}" class="text-primary small">
                        查看停车记录 <i class="fas fa-chevron-right"></i>
                    </a>`
                }
            </div>
        `;
        
        // 添加到列表
        vehiclesList.appendChild(vehicleCard);
    });
    
    // 绑定车辆操作按钮事件
    bindVehicleActionButtons();
}

/**
 * 绑定车辆操作按钮事件
 */
function bindVehicleActionButtons() {
    // 编辑按钮
    document.querySelectorAll('.edit-vehicle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-id');
            editVehicle(vehicleId);
        });
    });
    
    // 设为默认按钮
    document.querySelectorAll('.set-default-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-id');
            setDefaultVehicle(vehicleId);
        });
    });
    
    // 删除按钮
    document.querySelectorAll('.delete-vehicle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-id');
            showDeleteConfirmation(vehicleId);
        });
    });
}

/**
 * 保存新车辆
 */
function saveVehicle() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 获取表单数据
    const licensePlate = document.getElementById('licensePlate').value.trim();
    const vehicleType = document.getElementById('vehicleType').value;
    const vehicleBrand = document.getElementById('vehicleBrand').value;
    const vehicleModel = document.getElementById('vehicleModel').value.trim();
    const vehicleColor = document.getElementById('vehicleColor').value;
    const vehicleYear = document.getElementById('vehicleYear').value.trim();
    const setAsDefault = document.getElementById('setAsDefault').checked;
    
    // 验证数据
    if (!licensePlate) {
        alert('请输入车牌号码');
        return;
    }
    
    if (!vehicleType) {
        alert('请选择车辆类型');
        return;
    }
    
    // 检查车牌号是否已存在
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const existingVehicle = vehicles.find(v => v.licensePlate === licensePlate);
    if (existingVehicle) {
        alert('该车牌号已被注册');
        return;
    }
    
    // 检查用户拥有的车辆数量是否达到上限(5辆)
    const userVehicles = vehicles.filter(v => v.userId === currentUser.id);
    if (userVehicles.length >= 5) {
        alert('您最多只能添加5辆车');
        return;
    }
    
    // 创建新车辆对象
    const newVehicle = {
        id: 'vehicle_' + Date.now(),
        userId: currentUser.id,
        licensePlate: licensePlate,
        vehicleType: vehicleType,
        brand: vehicleBrand,
        model: vehicleModel,
        color: vehicleColor,
        year: vehicleYear,
        addTime: new Date().toISOString(),
        isVerified: true
    };
    
    // 添加到车辆列表
    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    // 如果设为默认车辆
    if (setAsDefault) {
        setDefaultVehicle(newVehicle.id);
    }
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addVehicleModal'));
    if (modal) modal.hide();
    
    // 重置表单
    document.getElementById('addVehicleForm').reset();
    
    // 重新加载车辆列表
    loadVehicles();
    
    // 显示成功消息
    alert('车辆添加成功！');
}

/**
 * 编辑车辆
 * @param {string} vehicleId 车辆ID
 */
function editVehicle(vehicleId) {
    // 获取车辆信息
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        alert('未找到车辆信息');
        return;
    }
    
    // 填充表单
    document.getElementById('editVehicleId').value = vehicle.id;
    document.getElementById('editLicensePlate').value = vehicle.licensePlate;
    document.getElementById('editVehicleType').value = vehicle.vehicleType;
    if (vehicle.brand) document.getElementById('editVehicleBrand').value = vehicle.brand;
    document.getElementById('editVehicleModel').value = vehicle.model || '';
    if (vehicle.color) document.getElementById('editVehicleColor').value = vehicle.color;
    document.getElementById('editVehicleYear').value = vehicle.year || '';
    
    // 获取默认车辆设置
    const currentUser = getCurrentUser();
    const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    const defaultVehicleId = userSettings[currentUser.id]?.defaultVehicleId || '';
    
    // 设置默认车辆复选框
    document.getElementById('editSetAsDefault').checked = (vehicle.id === defaultVehicleId);
    
    // 显示编辑模态框
    const modal = new bootstrap.Modal(document.getElementById('editVehicleModal'));
    modal.show();
}

/**
 * 更新车辆信息
 */
function updateVehicle() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 获取表单数据
    const vehicleId = document.getElementById('editVehicleId').value;
    const licensePlate = document.getElementById('editLicensePlate').value.trim();
    const vehicleType = document.getElementById('editVehicleType').value;
    const vehicleBrand = document.getElementById('editVehicleBrand').value;
    const vehicleModel = document.getElementById('editVehicleModel').value.trim();
    const vehicleColor = document.getElementById('editVehicleColor').value;
    const vehicleYear = document.getElementById('editVehicleYear').value.trim();
    const setAsDefault = document.getElementById('editSetAsDefault').checked;
    
    // 验证数据
    if (!licensePlate) {
        alert('请输入车牌号码');
        return;
    }
    
    if (!vehicleType) {
        alert('请选择车辆类型');
        return;
    }
    
    // 检查车牌号是否已被其他车辆使用
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const existingVehicle = vehicles.find(v => v.licensePlate === licensePlate && v.id !== vehicleId);
    if (existingVehicle) {
        alert('该车牌号已被其他车辆使用');
        return;
    }
    
    // 更新车辆信息
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
        alert('未找到车辆信息');
        return;
    }
    
    vehicles[vehicleIndex] = {
        ...vehicles[vehicleIndex],
        licensePlate: licensePlate,
        vehicleType: vehicleType,
        brand: vehicleBrand,
        model: vehicleModel,
        color: vehicleColor,
        year: vehicleYear,
        updateTime: new Date().toISOString()
    };
    
    // 保存更新
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    // 如果设为默认车辆
    if (setAsDefault) {
        setDefaultVehicle(vehicleId);
    }
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editVehicleModal'));
    if (modal) modal.hide();
    
    // 重新加载车辆列表
    loadVehicles();
    
    // 显示成功消息
    alert('车辆信息已更新！');
}

/**
 * 设置默认车辆
 * @param {string} vehicleId 车辆ID
 */
function setDefaultVehicle(vehicleId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 获取用户设置
    let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    
    // 更新默认车辆
    if (!userSettings[currentUser.id]) {
        userSettings[currentUser.id] = {};
    }
    
    userSettings[currentUser.id].defaultVehicleId = vehicleId;
    
    // 保存设置
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    
    // 重新加载车辆列表
    loadVehicles();
}

/**
 * 显示删除确认框
 * @param {string} vehicleId 车辆ID
 */
function showDeleteConfirmation(vehicleId) {
    // 获取车辆信息
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        alert('未找到车辆信息');
        return;
    }
    
    // 检查车辆是否在停车中
    const parkingRecords = JSON.parse(localStorage.getItem('parkingRecords')) || [];
    const isParkingNow = parkingRecords.some(record => 
        record.vehicleId === vehicle.id && !record.exitTime
    );
    
    if (isParkingNow) {
        alert('该车辆目前正在停车场内，无法删除');
        return;
    }
    
    // 设置删除确认信息
    document.getElementById('deleteVehiclePlate').textContent = vehicle.licensePlate;
    
    // 存储要删除的车辆ID
    localStorage.setItem('deleteVehicleId', vehicleId);
    
    // 显示确认模态框
    const modal = new bootstrap.Modal(document.getElementById('deleteVehicleModal'));
    modal.show();
}

/**
 * 删除车辆
 */
function deleteVehicle() {
    const vehicleId = localStorage.getItem('deleteVehicleId');
    if (!vehicleId) return;
    
    // 获取车辆列表
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    
    // 过滤掉要删除的车辆
    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
    
    // 保存更新后的列表
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    
    // 检查是否是默认车辆，如果是则清除默认设置
    const currentUser = getCurrentUser();
    if (currentUser) {
        const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        if (userSettings[currentUser.id]?.defaultVehicleId === vehicleId) {
            userSettings[currentUser.id].defaultVehicleId = '';
            localStorage.setItem('userSettings', JSON.stringify(userSettings));
        }
    }
    
    // 清除临时存储
    localStorage.removeItem('deleteVehicleId');
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteVehicleModal'));
    if (modal) modal.hide();
    
    // 重新加载车辆列表
    loadVehicles();
    
    // 显示成功消息
    alert('车辆已成功删除！');
}

/**
 * 计算停车时长
 * @param {string} entryTime 入场时间
 * @returns {string} 格式化的停车时长
 */
function calculateParkingDuration(entryTime) {
    const entry = new Date(entryTime);
    const now = new Date();
    
    // 计算时间差（毫秒）
    const diffMs = now - entry;
    
    // 转换为小时和分钟
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
    } else {
        return `${minutes}分钟`;
    }
}

/**
 * 获取车辆品牌的中文名称
 * @param {string} brandCode 品牌代码
 * @returns {string} 品牌名称
 */
function getBrandName(brandCode) {
    if (!brandCode) return '';
    
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
 * 获取车辆颜色的中文名称
 * @param {string} colorCode 颜色代码
 * @returns {string} 颜色名称
 */
function getColorName(colorCode) {
    if (!colorCode) return '';
    
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
 * 格式化日期
 * @param {string|Date} date 日期对象或日期字符串
 * @returns {string} 格式化的日期字符串 (YYYY-MM-DD)
 */
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}