/**
 * 智能停车管理系统 - 车位管理模块脚本
 */

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLogin()) return;
    
    // 加载车位列表
    loadParkingSpaces();
    
    // 绑定筛选按钮事件
    document.getElementById('filterBtn').addEventListener('click', filterParkingSpaces);
    
    // 绑定保存车位按钮事件
    document.getElementById('saveSpace').addEventListener('click', saveSpace);
    
    // 处理占用状态复选框变化事件
    document.getElementById('isOccupied').addEventListener('change', function() {
        const vehicleSelectContainer = document.getElementById('vehicleSelectContainer');
        if (this.checked) {
            vehicleSelectContainer.style.display = 'block';
            loadVehicleOptions();
        } else {
            vehicleSelectContainer.style.display = 'none';
        }
    });
    
    // 绑定编辑车位按钮事件
    document.getElementById('editSpaceBtn').addEventListener('click', function() {
        const spaceId = localStorage.getItem('currentViewSpaceId');
        if (spaceId) {
            // 关闭详情模态框
            const detailModal = bootstrap.Modal.getInstance(document.getElementById('spaceDetailModal'));
            detailModal.hide();
            
            // 延迟一下再打开编辑模态框，避免模态框叠加问题
            setTimeout(() => {
                editSpace(spaceId);
            }, 500);
        }
    });
    
    // 绑定释放车位按钮事件
    document.getElementById('releaseSpaceBtn').addEventListener('click', function() {
        const spaceId = localStorage.getItem('currentViewSpaceId');
        if (spaceId) {
            releaseSpace(spaceId);
        }
    });
});

// 加载车位列表
async function loadParkingSpaces() {
    try {
        const spaces = await loadData('spaces');
        updateParkingStats(spaces);
        displayParkingSpaces(spaces);
    } catch (error) {
        console.error('加载车位数据失败:', error);
        alert('加载车位数据失败，请刷新页面重试');
    }
}

// 更新车位统计信息
function updateParkingStats(spaces) {
    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(space => space.isOccupied).length;
    const availableSpaces = totalSpaces - occupiedSpaces;
    const occupancyRate = totalSpaces > 0 ? ((occupiedSpaces / totalSpaces) * 100).toFixed(1) : '0.0';
    
    // 更新统计显示
    document.getElementById('totalSpaces').textContent = totalSpaces;
    document.getElementById('availableSpaces').textContent = availableSpaces;
    document.getElementById('occupiedSpaces').textContent = occupiedSpaces;
    document.getElementById('occupancyRate').textContent = occupancyRate + '%';
}

// 显示车位列表
function displayParkingSpaces(spaces) {
    const parkingGrid = document.getElementById('parkingGrid');
    parkingGrid.innerHTML = '';
    
    if (spaces.length === 0) {
        parkingGrid.innerHTML = '<div class="col-12 text-center">暂无车位信息</div>';
        return;
    }
    
    spaces.forEach(space => {
        const spaceDiv = document.createElement('div');
        spaceDiv.className = 'col-md-3 col-sm-4 col-6';
        
        let statusClass = space.isOccupied ? 'occupied' : 'available';
        if (space.type === 'charging') {
            statusClass += ' charging';
        }
        
        spaceDiv.innerHTML = `
            <div class="parking-space ${statusClass}" data-id="${space.id}">
                <div class="space-id">${space.location}</div>
                <div class="space-type">${getSpaceTypeName(space.type)}</div>
                <div class="space-status">
                    ${space.isOccupied ? '<i class="fas fa-car"></i> 已占用' : '<i class="fas fa-check-circle"></i> 空闲'}
                </div>
            </div>
        `;
        
        parkingGrid.appendChild(spaceDiv);
    });
    
    // 绑定车位点击事件
    bindSpaceClickEvents();
}

// 绑定车位点击事件
function bindSpaceClickEvents() {
    document.querySelectorAll('.parking-space').forEach(space => {
        space.addEventListener('click', function() {
            const spaceId = this.getAttribute('data-id');
            viewSpaceDetails(spaceId);
        });
    });
}

// 查看车位详情
async function viewSpaceDetails(spaceId) {
    try {
        const spaces = await loadData('spaces');
        const space = spaces.find(s => s.id === spaceId);
        
        if (!space) {
            alert('未找到车位信息');
            return;
        }
        
        // 保存当前查看的车位ID
        localStorage.setItem('currentViewSpaceId', spaceId);
        
        // 设置车位基本信息
        document.getElementById('detailSpaceLocation').textContent = space.location;
        document.getElementById('detailSpaceType').textContent = getSpaceTypeName(space.type);
        document.getElementById('detailSpaceStatus').textContent = `状态: ${space.isOccupied ? '已占用' : '空闲'}`;
        
        // 根据占用状态显示/隐藏相关按钮
        document.getElementById('releaseSpaceBtn').style.display = space.isOccupied ? 'block' : 'none';
        
        // 如果车位被占用，显示车辆信息
        if (space.isOccupied && space.vehicleId) {
            const vehicleInfo = document.getElementById('occupiedVehicleInfo');
            vehicleInfo.style.display = 'block';
            
            // 查找车辆信息
            const vehicle = await findVehicleById(space.vehicleId);
            if (vehicle) {
                document.getElementById('detailVehiclePlate').textContent = vehicle.licensePlate;
                document.getElementById('detailVehicleType').textContent = getVehicleTypeName(vehicle.vehicleType);
                document.getElementById('detailVehicleOwner').textContent = vehicle.owner;
                
                // 查找停车记录
                const records = await loadData('records');
                const record = records.find(r => r.vehicleId === vehicle.id && !r.isPaid);
                
                if (record) {
                    document.getElementById('detailEntryTime').textContent = formatDateTime(record.entryTime);
                    const duration = calculateDuration(record.entryTime);
                    document.getElementById('detailParkingDuration').textContent = formatDuration(duration);
                } else {
                    document.getElementById('detailEntryTime').textContent = '未知';
                    document.getElementById('detailParkingDuration').textContent = '未知';
                }
            } else {
                document.getElementById('detailVehiclePlate').textContent = '未知';
                document.getElementById('detailVehicleType').textContent = '未知';
                document.getElementById('detailVehicleOwner').textContent = '未知';
                document.getElementById('detailEntryTime').textContent = '未知';
                document.getElementById('detailParkingDuration').textContent = '未知';
            }
        } else {
            document.getElementById('occupiedVehicleInfo').style.display = 'none';
        }
        
        // 显示详情模态框
        const modal = new bootstrap.Modal(document.getElementById('spaceDetailModal'));
        modal.show();
        
    } catch (error) {
        console.error('加载车位详情失败:', error);
        alert('加载车位详情失败，请重试');
    }
}

// 筛选车位
async function filterParkingSpaces() {
    const typeFilter = document.getElementById('spaceTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    try {
        const allSpaces = await loadData('spaces');
        
        // 应用筛选条件
        const filteredSpaces = allSpaces.filter(space => {
            // 类型筛选
            const typeMatch = typeFilter === 'all' || space.type === typeFilter;
            
            // 状态筛选
            let statusMatch = true;
            if (statusFilter === 'available') {
                statusMatch = !space.isOccupied;
            } else if (statusFilter === 'occupied') {
                statusMatch = space.isOccupied;
            }
            
            return typeMatch && statusMatch;
        });
        
        // 显示筛选结果
        displayParkingSpaces(filteredSpaces);
        
    } catch (error) {
        console.error('筛选车位失败:', error);
        alert('筛选车位失败，请重试');
    }
}

// 加载车辆下拉选项
async function loadVehicleOptions() {
    try {
        const vehicles = await loadData('vehicles');
        const vehicleSelect = document.getElementById('vehicleSelect');
        vehicleSelect.innerHTML = '';
        
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- 请选择车辆 --';
        vehicleSelect.appendChild(defaultOption);
        
        // 添加车辆选项
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.licensePlate} (${vehicle.color}${getVehicleTypeName(vehicle.vehicleType)})`;
            vehicleSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('加载车辆选项失败:', error);
    }
}

// 编辑车位
async function editSpace(spaceId) {
    try {
        const spaces = await loadData('spaces');
        const space = spaces.find(s => s.id === spaceId);
        
        if (!space) {
            alert('未找到车位信息');
            return;
        }
        
        // 填充表单
        document.getElementById('spaceId').value = space.id;
        document.getElementById('spaceLocation').value = space.location;
        document.getElementById('spaceType').value = space.type;
        document.getElementById('isOccupied').checked = space.isOccupied;
        
        // 显示/隐藏车辆选择框
        const vehicleSelectContainer = document.getElementById('vehicleSelectContainer');
        if (space.isOccupied) {
            vehicleSelectContainer.style.display = 'block';
            await loadVehicleOptions();
            
            // 设置选中的车辆
            if (space.vehicleId) {
                document.getElementById('vehicleSelect').value = space.vehicleId;
            }
        } else {
            vehicleSelectContainer.style.display = 'none';
        }
        
        // 更改模态框标题
        document.getElementById('spaceModalTitle').textContent = '编辑车位';
        
        // 显示模态框
        const modal = new bootstrap.Modal(document.getElementById('addSpaceModal'));
        modal.show();
        
    } catch (error) {
        console.error('加载车位信息失败:', error);
        alert('加载车位信息失败，请重试');
    }
}

// 保存车位信息
async function saveSpace() {
    const spaceId = document.getElementById('spaceId').value;
    const location = document.getElementById('spaceLocation').value.trim();
    const type = document.getElementById('spaceType').value;
    const isOccupied = document.getElementById('isOccupied').checked;
    let vehicleId = null;
    
    // 简单验证
    if (!location) {
        alert('请输入车位位置');
        return;
    }
    
    // 如果是占用状态，则需要选择车辆
    if (isOccupied) {
        vehicleId = document.getElementById('vehicleSelect').value;
        if (!vehicleId) {
            alert('请选择占用车辆');
            return;
        }
    }
    
    try {
        const spaces = await loadData('spaces');
        
        // 检查位置是否重复（编辑时排除自身）
        const isDuplicate = spaces.some(s => 
            s.location === location && s.id !== spaceId
        );
        
        if (isDuplicate) {
            alert(`车位位置 ${location} 已存在`);
            return;
        }
        
        if (spaceId) {
            // 编辑模式
            const index = spaces.findIndex(s => s.id === spaceId);
            if (index !== -1) {
                const oldSpace = spaces[index];
                const wasOccupied = oldSpace.isOccupied;
                const oldVehicleId = oldSpace.vehicleId;
                
                // 更新车位信息
                spaces[index] = {
                    ...oldSpace,
                    location,
                    type,
                    isOccupied,
                    vehicleId: isOccupied ? vehicleId : null
                };
                
                // 如果状态变化，需要更新相关记录
                if (wasOccupied !== isOccupied || (isOccupied && oldVehicleId !== vehicleId)) {
                    await updateParkingRecords(spaceId, oldVehicleId, isOccupied, vehicleId);
                }
            }
        } else {
            // 添加模式
            const newSpace = {
                id: 'p' + (spaces.length + 1).toString().padStart(3, '0'),
                location,
                type,
                isOccupied,
                vehicleId: isOccupied ? vehicleId : null
            };
            
            spaces.push(newSpace);
            
            // 如果新车位是占用状态，创建相应记录
            if (isOccupied && vehicleId) {
                const records = await loadData('records');
                const newRecord = {
                    id: 'r' + (records.length + 1).toString().padStart(3, '0'),
                    vehicleId: vehicleId,
                    spaceId: newSpace.id,
                    entryTime: new Date().toISOString(),
                    exitTime: null,
                    duration: 0,
                    fee: 0,
                    isPaid: false
                };
                
                records.push(newRecord);
                saveData('records', records);
            }
        }
        
        // 保存数据
        saveData('spaces', spaces);
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('addSpaceModal'));
        modal.hide();
        
        // 重新加载列表
        loadParkingSpaces();
        
        // 清空表单
        resetSpaceForm();
        
    } catch (error) {
        console.error('保存车位信息失败:', error);
        alert('保存车位信息失败，请重试');
    }
}

// 更新停车记录
async function updateParkingRecords(spaceId, oldVehicleId, isOccupied, newVehicleId) {
    const records = await loadData('records');
    
    // 如果之前有车辆占用，需要结束其停车记录
    if (oldVehicleId) {
        const recordIndex = records.findIndex(r => 
            r.vehicleId === oldVehicleId && 
            r.spaceId === spaceId && 
            !r.isPaid
        );
        
        if (recordIndex !== -1) {
            // 结束旧的停车记录
            const exitTime = new Date().toISOString();
            const duration = calculateDuration(records[recordIndex].entryTime, exitTime);
            const fee = await calculateParkingFee(duration, 'sedan'); // 假设为普通轿车
            
            records[recordIndex].exitTime = exitTime;
            records[recordIndex].duration = duration;
            records[recordIndex].fee = fee;
            records[recordIndex].isPaid = true;
            records[recordIndex].paymentMethod = 'system';
            records[recordIndex].paymentTime = exitTime;
        }
    }
    
    // 如果现在是占用状态且有新车辆，创建新记录
    if (isOccupied && newVehicleId) {
        const newRecord = {
            id: 'r' + (records.length + 1).toString().padStart(3, '0'),
            vehicleId: newVehicleId,
            spaceId: spaceId,
            entryTime: new Date().toISOString(),
            exitTime: null,
            duration: 0,
            fee: 0,
            isPaid: false
        };
        
        records.push(newRecord);
    }
    
    // 保存更新后的记录
    saveData('records', records);
}

// 释放车位
async function releaseSpace(spaceId) {
    try {
        const spaces = await loadData('spaces');
        const spaceIndex = spaces.findIndex(s => s.id === spaceId);
        
        if (spaceIndex === -1) {
            alert('未找到车位信息');
            return;
        }
        
        const space = spaces[spaceIndex];
        if (!space.isOccupied) {
            alert('该车位已经是空闲状态');
            return;
        }
        
        const vehicleId = space.vehicleId;
        
        // 更新停车记录
        if (vehicleId) {
            const records = await loadData('records');
            const recordIndex = records.findIndex(r => 
                r.vehicleId === vehicleId && 
                r.spaceId === spaceId && 
                !r.isPaid
            );
            
            if (recordIndex !== -1) {
                // 结束停车记录
                const exitTime = new Date().toISOString();
                const duration = calculateDuration(records[recordIndex].entryTime, exitTime);
                
                // 获取车辆类型以计算费用
                const vehicle = await findVehicleById(vehicleId);
                const vehicleType = vehicle ? vehicle.vehicleType : 'sedan';
                
                const fee = await calculateParkingFee(duration, vehicleType);
                
                records[recordIndex].exitTime = exitTime;
                records[recordIndex].duration = duration;
                records[recordIndex].fee = fee;
                records[recordIndex].isPaid = true;
                records[recordIndex].paymentMethod = 'system';
                records[recordIndex].paymentTime = exitTime;
                
                saveData('records', records);
            }
        }
        
        // 释放车位
        spaces[spaceIndex].isOccupied = false;
        spaces[spaceIndex].vehicleId = null;
        saveData('spaces', spaces);
        
        // 关闭详情模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('spaceDetailModal'));
        modal.hide();
        
        // 重新加载车位列表
        loadParkingSpaces();
        
        // 提示成功
        alert('车位释放成功');
        
    } catch (error) {
        console.error('释放车位失败:', error);
        alert('释放车位失败，请重试');
    }
}

// 重置车位表单
function resetSpaceForm() {
    document.getElementById('spaceForm').reset();
    document.getElementById('spaceId').value = '';
    document.getElementById('vehicleSelectContainer').style.display = 'none';
    document.getElementById('spaceModalTitle').textContent = '添加车位';
}