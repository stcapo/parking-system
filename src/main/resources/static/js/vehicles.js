/**
 * 智能停车管理系统 - 车辆管理模块脚本
 */

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLogin()) return;
    
    // 加载车辆列表
    loadVehicles();
    
    // 绑定搜索按钮事件
    document.getElementById('searchBtn').addEventListener('click', searchVehicles);
    
    // 绑定表单搜索框回车事件
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchVehicles();
        }
    });
    
    // 绑定保存车辆按钮事件
    document.getElementById('saveVehicle').addEventListener('click', saveVehicle);
    
    // 绑定确认删除按钮事件
    document.getElementById('confirmDelete').addEventListener('click', deleteVehicleConfirmed);
});

// 加载车辆列表
async function loadVehicles() {
    try {
        const vehicles = await loadData('vehicles');
        displayVehicles(vehicles);
    } catch (error) {
        console.error('加载车辆数据失败:', error);
        alert('加载车辆数据失败，请刷新页面重试');
    }
}

// 显示车辆列表
function displayVehicles(vehicles) {
    const vehiclesList = document.getElementById('vehiclesList');
    vehiclesList.innerHTML = '';
    
    if (vehicles.length === 0) {
        vehiclesList.innerHTML = '<tr><td colspan="6" class="text-center">暂无车辆信息</td></tr>';
        return;
    }
    
    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.licensePlate}</td>
            <td>${getVehicleTypeName(vehicle.vehicleType)}</td>
            <td>${vehicle.color}</td>
            <td>${vehicle.owner}</td>
            <td>${vehicle.phone}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${vehicle.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${vehicle.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        vehiclesList.appendChild(row);
    });
    
    // 绑定编辑和删除按钮事件
    bindEditButtons();
    bindDeleteButtons();
}

// 绑定编辑按钮事件
function bindEditButtons() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-id');
            editVehicle(vehicleId);
        });
    });
}

// 绑定删除按钮事件
function bindDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-id');
            showDeleteConfirmation(vehicleId);
        });
    });
}

// 搜索车辆
async function searchVehicles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 如果搜索词为空，显示所有车辆
        loadVehicles();
        return;
    }
    
    try {
        const vehicles = await loadData('vehicles');
        
        // 过滤匹配的车辆
        const filteredVehicles = vehicles.filter(vehicle => 
            vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
            vehicle.owner.toLowerCase().includes(searchTerm) ||
            vehicle.phone.toLowerCase().includes(searchTerm)
        );
        
        displayVehicles(filteredVehicles);
    } catch (error) {
        console.error('搜索车辆失败:', error);
        alert('搜索车辆失败，请重试');
    }
}

// 保存车辆信息
async function saveVehicle() {
    const vehicleId = document.getElementById('vehicleId').value;
    const licensePlate = document.getElementById('licensePlate').value.trim();
    const vehicleType = document.getElementById('vehicleType').value;
    const color = document.getElementById('color').value.trim();
    const owner = document.getElementById('owner').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // 简单验证
    if (!licensePlate) {
        alert('请输入车牌号');
        return;
    }
    
    try {
        const vehicles = await loadData('vehicles');
        
        // 检查车牌号是否重复（编辑时排除自身）
        const isDuplicate = vehicles.some(v => 
            v.licensePlate === licensePlate && v.id !== vehicleId
        );
        
        if (isDuplicate) {
            alert(`车牌号 ${licensePlate} 已存在`);
            return;
        }
        
        if (vehicleId) {
            // 编辑模式
            const index = vehicles.findIndex(v => v.id === vehicleId);
            if (index !== -1) {
                vehicles[index] = {
                    ...vehicles[index],
                    licensePlate,
                    vehicleType,
                    color,
                    owner,
                    phone
                };
            }
        } else {
            // 添加模式
            const newVehicle = {
                id: 'v' + (vehicles.length + 1).toString().padStart(3, '0'),
                licensePlate,
                vehicleType,
                color,
                owner,
                phone
            };
            vehicles.push(newVehicle);
        }
        
        // 保存数据
        saveData('vehicles', vehicles);
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('addVehicleModal'));
        modal.hide();
        
        // 重新加载列表
        loadVehicles();
        
        // 清空表单
        resetVehicleForm();
        
    } catch (error) {
        console.error('保存车辆信息失败:', error);
        alert('保存车辆信息失败，请重试');
    }
}

// 编辑车辆
async function editVehicle(vehicleId) {
    try {
        const vehicles = await loadData('vehicles');
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            alert('未找到车辆信息');
            return;
        }
        
        // 填充表单
        document.getElementById('vehicleId').value = vehicle.id;
        document.getElementById('licensePlate').value = vehicle.licensePlate;
        document.getElementById('vehicleType').value = vehicle.vehicleType;
        document.getElementById('color').value = vehicle.color;
        document.getElementById('owner').value = vehicle.owner;
        document.getElementById('phone').value = vehicle.phone;
        
        // 更改模态框标题
        document.getElementById('vehicleModalTitle').textContent = '编辑车辆';
        
        // 显示模态框
        const modal = new bootstrap.Modal(document.getElementById('addVehicleModal'));
        modal.show();
        
    } catch (error) {
        console.error('加载车辆信息失败:', error);
        alert('加载车辆信息失败，请重试');
    }
}

// 显示删除确认框
async function showDeleteConfirmation(vehicleId) {
    try {
        const vehicles = await loadData('vehicles');
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            alert('未找到车辆信息');
            return;
        }
        
        // 设置确认信息
        document.getElementById('deleteVehiclePlate').textContent = vehicle.licensePlate;
        
        // 存储要删除的车辆ID
        localStorage.setItem('deleteVehicleId', vehicleId);
        
        // 显示确认模态框
        const modal = new bootstrap.Modal(document.getElementById('deleteVehicleModal'));
        modal.show();
        
    } catch (error) {
        console.error('加载车辆信息失败:', error);
        alert('加载车辆信息失败，请重试');
    }
}

// 确认删除车辆
async function deleteVehicleConfirmed() {
    const vehicleId = localStorage.getItem('deleteVehicleId');
    
    if (!vehicleId) {
        alert('车辆ID无效');
        return;
    }
    
    try {
        // 加载车辆数据
        const vehicles = await loadData('vehicles');
        
        // 过滤掉要删除的车辆
        const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
        
        // 检查车辆是否在使用中
        const spaces = await loadData('spaces');
        const isInUse = spaces.some(s => s.vehicleId === vehicleId);
        
        if (isInUse) {
            alert('该车辆目前正在停车场内，无法删除');
            return;
        }
        
        // 保存更新后的数据
        saveData('vehicles', updatedVehicles);
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteVehicleModal'));
        modal.hide();
        
        // 清除存储的ID
        localStorage.removeItem('deleteVehicleId');
        
        // 重新加载列表
        loadVehicles();
        
    } catch (error) {
        console.error('删除车辆失败:', error);
        alert('删除车辆失败，请重试');
    }
}

// 重置车辆表单
function resetVehicleForm() {
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleModalTitle').textContent = '添加车辆';
}