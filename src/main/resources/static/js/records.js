/**
 * 智能停车管理系统 - 停车记录模块脚本
 */

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLogin()) return;
    
    // 设置今日日期作为默认日期
    setDefaultDates();
    
    // 加载停车记录
    loadParkingRecords();
    
    // 绑定搜索按钮事件
    document.getElementById('searchRecordsBtn').addEventListener('click', searchRecords);
    
    // 绑定重置按钮事件
    document.getElementById('resetSearchBtn').addEventListener('click', resetSearch);
    
    // 绑定导出按钮事件
    document.getElementById('exportBtn').addEventListener('click', exportRecords);
    
    // 绑定打印按钮事件
    document.getElementById('printRecordBtn').addEventListener('click', printRecord);
});

// 设置默认日期范围
function setDefaultDates() {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    // 格式化日期为 YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    document.getElementById('startDate').value = formatDate(oneWeekAgo);
    document.getElementById('endDate').value = formatDate(today);
}

// 加载停车记录
async function loadParkingRecords() {
    try {
        // 加载全部记录
        const records = await loadData('records');
        
        // 更新收入统计
        updateIncomeStats(records);
        
        // 显示记录
        displayRecords(records);
    } catch (error) {
        console.error('加载停车记录失败:', error);
        alert('加载停车记录失败，请刷新页面重试');
    }
}

// 更新收入统计
function updateIncomeStats(records) {
    // 获取当前日期
    const now = new Date();
    
    // 设置今日开始时间
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    // 设置本周开始时间 (周日为一周开始)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    // 设置本月开始时间
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // 过滤已支付的记录
    const paidRecords = records.filter(record => record.isPaid);
    
    // 计算今日收入
    const todayIncome = paidRecords
        .filter(record => new Date(record.paymentTime) >= todayStart)
        .reduce((sum, record) => sum + record.fee, 0);
    
    // 计算本周收入
    const weekIncome = paidRecords
        .filter(record => new Date(record.paymentTime) >= weekStart)
        .reduce((sum, record) => sum + record.fee, 0);
    
    // 计算本月收入
    const monthIncome = paidRecords
        .filter(record => new Date(record.paymentTime) >= monthStart)
        .reduce((sum, record) => sum + record.fee, 0);
    
    // 更新UI
    document.getElementById('todayIncome').textContent = '¥' + todayIncome;
    document.getElementById('weekIncome').textContent = '¥' + weekIncome;
    document.getElementById('monthIncome').textContent = '¥' + monthIncome;
}

// 显示停车记录
async function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = '';
    
    if (records.length === 0) {
        recordsList.innerHTML = '<tr><td colspan="8" class="text-center">暂无停车记录</td></tr>';
        document.getElementById('recordsCount').textContent = '共0条记录';
        return;
    }
    
    // 按时间倒序排序
    records.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
    
    // 预先获取所有车辆和车位信息，避免重复查询
    const vehicles = await loadData('vehicles');
    const spaces = await loadData('spaces');
    
    // 用于快速查询的映射
    const vehicleMap = {};
    vehicles.forEach(vehicle => {
        vehicleMap[vehicle.id] = vehicle;
    });
    
    const spaceMap = {};
    spaces.forEach(space => {
        spaceMap[space.id] = space;
    });
    
    // 显示记录
    for (const record of records) {
        const vehicle = vehicleMap[record.vehicleId];
        const space = spaceMap[record.spaceId];
        
        if (!vehicle || !space) continue;
        
        const row = document.createElement('tr');
        
        // 设置行样式（未支付记录突出显示）
        if (!record.isPaid) {
            row.classList.add('table-warning');
        }
        
        const exitTimeDisplay = record.exitTime ? formatDateTime(record.exitTime) : '未离场';
        const durationDisplay = record.duration > 0 ? formatDuration(record.duration) : '进行中';
        const feeDisplay = record.fee > 0 ? '¥' + record.fee : '-';
        
        row.innerHTML = `
            <td>${vehicle.licensePlate}</td>
            <td>${formatDateTime(record.entryTime)}</td>
            <td>${exitTimeDisplay}</td>
            <td>${durationDisplay}</td>
            <td>${space.location}</td>
            <td>${feeDisplay}</td>
            <td>
                <span class="badge ${record.isPaid ? 'bg-success' : 'bg-warning'}">
                    ${record.isPaid ? '已支付' : '未支付'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info view-btn" data-id="${record.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        recordsList.appendChild(row);
    }
    
    // 更新记录数量
    document.getElementById('recordsCount').textContent = `共${records.length}条记录`;
    
    // 绑定查看按钮事件
    bindViewButtons();
}

// 绑定查看按钮事件
function bindViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            viewRecordDetails(recordId);
        });
    });
}

// 查看记录详情
async function viewRecordDetails(recordId) {
    try {
        const records = await loadData('records');
        const record = records.find(r => r.id === recordId);
        
        if (!record) {
            alert('未找到记录信息');
            return;
        }
        
        // 获取车辆和车位信息
        const vehicle = await findVehicleById(record.vehicleId);
        const space = await findSpaceById(record.spaceId);
        
        if (!vehicle || !space) {
            alert('记录关联信息不完整');
            return;
        }
        
        // 设置基本信息
        document.getElementById('detailVehiclePlate').textContent = vehicle.licensePlate;
        document.getElementById('detailPaymentStatus').textContent = record.isPaid ? '已支付' : '未支付';
        document.getElementById('detailPaymentStatus').className = 
            `badge ${record.isPaid ? 'bg-success' : 'bg-warning'} mb-2`;
        
        // 设置时间和费用信息
        document.getElementById('detailEntryTime').textContent = formatDateTime(record.entryTime);
        document.getElementById('detailExitTime').textContent = 
            record.exitTime ? formatDateTime(record.exitTime) : '未离场';
        document.getElementById('detailDuration').textContent = 
            record.duration > 0 ? formatDuration(record.duration) : '进行中';
        document.getElementById('detailLocation').textContent = space.location;
        document.getElementById('detailFee').textContent = 
            record.fee > 0 ? '¥' + record.fee : '-';
        
        // 设置支付信息
        document.getElementById('detailPaymentMethod').textContent = 
            record.isPaid ? getPaymentMethodName(record.paymentMethod) : '-';
        document.getElementById('detailPaymentTime').textContent = 
            record.paymentTime ? formatDateTime(record.paymentTime) : '-';
        
        // 显示详情模态框
        const modal = new bootstrap.Modal(document.getElementById('recordDetailModal'));
        modal.show();
        
    } catch (error) {
        console.error('加载记录详情失败:', error);
        alert('加载记录详情失败，请重试');
    }
}

// 搜索记录
async function searchRecords() {
    const licensePlate = document.getElementById('searchPlate').value.trim().toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    
    try {
        // 加载所有记录
        const allRecords = await loadData('records');
        
        // 获取所有车辆信息用于匹配车牌号
        const vehicles = await loadData('vehicles');
        const vehicleMap = {};
        
        // 创建车辆ID到车牌号的映射
        vehicles.forEach(vehicle => {
            vehicleMap[vehicle.id] = vehicle.licensePlate.toLowerCase();
        });
        
        // 过滤记录
        const filteredRecords = allRecords.filter(record => {
            // 车牌号筛选
            const plateMatch = !licensePlate || 
                (vehicleMap[record.vehicleId] && vehicleMap[record.vehicleId].includes(licensePlate));
            
            // 日期范围筛选
            let dateMatch = true;
            if (startDate) {
                const recordDate = new Date(record.entryTime);
                const minDate = new Date(startDate);
                minDate.setHours(0, 0, 0, 0);
                if (recordDate < minDate) {
                    dateMatch = false;
                }
            }
            
            if (endDate && dateMatch) {
                const recordDate = new Date(record.entryTime);
                const maxDate = new Date(endDate);
                maxDate.setHours(23, 59, 59, 999);
                if (recordDate > maxDate) {
                    dateMatch = false;
                }
            }
            
            // 支付状态筛选
            const statusMatch = paymentStatus === 'all' || 
                (paymentStatus === 'paid' && record.isPaid) || 
                (paymentStatus === 'unpaid' && !record.isPaid);
            
            return plateMatch && dateMatch && statusMatch;
        });
        
        // 显示筛选结果
        displayRecords(filteredRecords);
        
    } catch (error) {
        console.error('搜索记录失败:', error);
        alert('搜索记录失败，请重试');
    }
}

// 重置搜索条件
function resetSearch() {
    document.getElementById('searchPlate').value = '';
    setDefaultDates();
    document.getElementById('paymentStatus').value = 'all';
    
    // 重新加载所有记录
    loadParkingRecords();
}

// 导出停车记录
async function exportRecords() {
    try {
        // 获取当前筛选后的记录
        const licensePlate = document.getElementById('searchPlate').value.trim().toLowerCase();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const paymentStatus = document.getElementById('paymentStatus').value;
        
        // 加载所有记录
        const allRecords = await loadData('records');
        const vehicles = await loadData('vehicles');
        const spaces = await loadData('spaces');
        
        // 创建查询映射
        const vehicleMap = {};
        vehicles.forEach(v => { vehicleMap[v.id] = v; });
        
        const spaceMap = {};
        spaces.forEach(s => { spaceMap[s.id] = s; });
        
        // 过滤记录
        const filteredRecords = allRecords.filter(record => {
            const vehicle = vehicleMap[record.vehicleId];
            
            // 车牌号筛选
            const plateMatch = !licensePlate || 
                (vehicle && vehicle.licensePlate.toLowerCase().includes(licensePlate));
            
            // 日期范围筛选
            let dateMatch = true;
            if (startDate) {
                const recordDate = new Date(record.entryTime);
                const minDate = new Date(startDate);
                minDate.setHours(0, 0, 0, 0);
                if (recordDate < minDate) {
                    dateMatch = false;
                }
            }
            
            if (endDate && dateMatch) {
                const recordDate = new Date(record.entryTime);
                const maxDate = new Date(endDate);
                maxDate.setHours(23, 59, 59, 999);
                if (recordDate > maxDate) {
                    dateMatch = false;
                }
            }
            
            // 支付状态筛选
            const statusMatch = paymentStatus === 'all' || 
                (paymentStatus === 'paid' && record.isPaid) || 
                (paymentStatus === 'unpaid' && !record.isPaid);
            
            return plateMatch && dateMatch && statusMatch;
        });
        
        // 准备导出数据
        const exportData = filteredRecords.map(record => {
            const vehicle = vehicleMap[record.vehicleId] || { licensePlate: '未知' };
            const space = spaceMap[record.spaceId] || { location: '未知' };
            
            return {
                车牌号: vehicle.licensePlate,
                入场时间: formatDateTime(record.entryTime),
                出场时间: record.exitTime ? formatDateTime(record.exitTime) : '未离场',
                停车时长: record.duration > 0 ? formatDuration(record.duration) : '进行中',
                车位位置: space.location,
                费用: record.fee > 0 ? '¥' + record.fee : '-',
                支付状态: record.isPaid ? '已支付' : '未支付',
                支付方式: record.isPaid ? getPaymentMethodName(record.paymentMethod) : '-',
                支付时间: record.paymentTime ? formatDateTime(record.paymentTime) : '-'
            };
        });
        
        // 生成文件名
        const now = new Date();
        const fileName = `停车记录_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.json`;
        
        // 导出为JSON文件
        exportToJson(exportData, fileName);
        
    } catch (error) {
        console.error('导出记录失败:', error);
        alert('导出记录失败，请重试');
    }
}

// 打印记录
function printRecord() {
    // 获取模态框内容
    const modalContent = document.querySelector('.modal-body').innerHTML;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>停车记录详情</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    table, th, td { border: 1px solid #ddd; }
                    th, td { padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .card { border: 1px solid #ddd; border-radius: 5px; padding: 10px; margin-bottom: 20px; }
                    h1 { font-size: 18px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>停车记录详情</h1>
                ${modalContent}
                <div style="margin-top: 30px; text-align: center;">
                    <p>打印时间: ${formatDateTime(new Date().toISOString())}</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    
    // 等待内容加载完成后打印
    printWindow.onload = function() {
        printWindow.print();
        // printWindow.close();
    };
}