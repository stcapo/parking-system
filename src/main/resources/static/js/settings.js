/**
 * 智能停车管理系统 - 系统设置模块脚本
 */

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLogin()) return;
    
    // 加载设置
    loadSettings();
    
    // 绑定保存按钮事件
    document.getElementById('savePricingBtn').addEventListener('click', savePricingSettings);
    document.getElementById('saveSystemBtn').addEventListener('click', saveSystemSettings);
    
    // 节假日费率复选框变化事件
    document.getElementById('holidayRates').addEventListener('change', function() {
        const holidayRatesContainer = document.getElementById('holidayRatesContainer');
        holidayRatesContainer.style.display = this.checked ? 'block' : 'none';
    });
    
    // 绑定备份按钮事件
    document.getElementById('backupBtn').addEventListener('click', backupData);
    
    // 绑定恢复按钮事件
    document.getElementById('restoreBtn').addEventListener('click', restoreData);
    
    // 绑定清理按钮事件
    document.getElementById('cleanupBtn').addEventListener('click', function() {
        const cleanupDate = document.getElementById('cleanupDate').value;
        if (!cleanupDate) {
            alert('请选择清理日期');
            return;
        }
        
        // 显示确认对话框
        document.getElementById('confirmActionTitle').textContent = '确认数据清理';
        document.getElementById('confirmActionMessage').textContent = 
            `您确定要清理 ${cleanupDate} 之前的所有停车记录吗？此操作不可逆！`;
        
        // 存储清理日期
        localStorage.setItem('cleanupDate', cleanupDate);
        
        // 打开确认模态框
        const modal = new bootstrap.Modal(document.getElementById('confirmActionModal'));
        modal.show();
        
        // 绑定确认按钮事件
        document.getElementById('confirmActionBtn').onclick = cleanupData;
    });
});

// 加载设置
async function loadSettings() {
    try {
        const settings = await loadData('settings');
        
        // 填充收费设置
        fillPricingSettings(settings.pricing);
        
        // 填充系统设置
        fillSystemSettings(settings.system);
        
    } catch (error) {
        console.error('加载设置失败:', error);
        alert('加载设置失败，请刷新页面重试');
    }
}

// 填充收费设置
function fillPricingSettings(pricing) {
    document.getElementById('basePrice').value = pricing.basePrice;
    document.getElementById('hourlyRate').value = pricing.hourlyRate;
    document.getElementById('maxDailyFee').value = pricing.maxDailyFee;
    document.getElementById('newEnergyDiscount').value = pricing.discounts.newEnergy;
    document.getElementById('monthlyDiscount').value = pricing.discounts.monthly;
    document.getElementById('holidayRates').checked = pricing.holidayRates;
    
    // 显示/隐藏节假日费率设置
    const holidayRatesContainer = document.getElementById('holidayRatesContainer');
    holidayRatesContainer.style.display = pricing.holidayRates ? 'block' : 'none';
    
    // 设置节假日倍数
    if (pricing.holidayMultiplier) {
        document.getElementById('holidayMultiplier').value = pricing.holidayMultiplier;
    }
}

// 填充系统设置
function fillSystemSettings(system) {
    document.getElementById('parkingName').value = system.parkingName;
    document.getElementById('contactPhone').value = system.contactPhone;
    document.getElementById('address').value = system.address;
    document.getElementById('darkMode').checked = system.darkMode;
    document.getElementById('showStatistics').checked = system.showStatistics;
    document.getElementById('refreshInterval').value = system.refreshInterval;
}

// 保存收费设置
async function savePricingSettings() {
    // 获取表单数据
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const maxDailyFee = parseFloat(document.getElementById('maxDailyFee').value);
    const newEnergyDiscount = parseFloat(document.getElementById('newEnergyDiscount').value);
    const monthlyDiscount = parseFloat(document.getElementById('monthlyDiscount').value);
    const holidayRates = document.getElementById('holidayRates').checked;
    const holidayMultiplier = parseFloat(document.getElementById('holidayMultiplier').value);
    
    // 简单验证
    if (isNaN(basePrice) || isNaN(hourlyRate) || isNaN(maxDailyFee) || 
        isNaN(newEnergyDiscount) || isNaN(monthlyDiscount) || 
        (holidayRates && isNaN(holidayMultiplier))) {
        alert('请输入有效的数字');
        return;
    }
    
    // 范围验证
    if (basePrice < 0 || hourlyRate < 0 || maxDailyFee < 0) {
        alert('费用不能为负数');
        return;
    }
    
    if (newEnergyDiscount < 0 || newEnergyDiscount > 1 || 
        monthlyDiscount < 0 || monthlyDiscount > 1) {
        alert('折扣系数必须在0到1之间');
        return;
    }
    
    if (holidayRates && (holidayMultiplier < 1)) {
        alert('节假日费率倍数不能小于1');
        return;
    }
    
    try {
        // 获取当前设置
        const settings = await loadData('settings');
        
        // 更新收费设置
        settings.pricing = {
            basePrice,
            hourlyRate,
            maxDailyFee,
            discounts: {
                newEnergy: newEnergyDiscount,
                monthly: monthlyDiscount
            },
            holidayRates,
            holidayMultiplier
        };
        
        // 保存设置
        saveData('settings', settings);
        
        // 显示提示
        alert('收费设置保存成功');
        
    } catch (error) {
        console.error('保存设置失败:', error);
        alert('保存设置失败，请重试');
    }
}

// 保存系统设置
async function saveSystemSettings() {
    // 获取表单数据
    const parkingName = document.getElementById('parkingName').value.trim();
    const contactPhone = document.getElementById('contactPhone').value.trim();
    const address = document.getElementById('address').value.trim();
    const darkMode = document.getElementById('darkMode').checked;
    const showStatistics = document.getElementById('showStatistics').checked;
    const refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    
    // 简单验证
    if (!parkingName) {
        alert('请输入停车场名称');
        return;
    }
    
    if (isNaN(refreshInterval) || refreshInterval < 5 || refreshInterval > 60) {
        alert('刷新间隔必须在5到60秒之间');
        return;
    }
    
    try {
        // 获取当前设置
        const settings = await loadData('settings');
        
        // 更新系统设置
        settings.system = {
            parkingName,
            contactPhone,
            address,
            darkMode,
            showStatistics,
            refreshInterval
        };
        
        // 保存设置
        saveData('settings', settings);
        
        // 应用深色模式
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // 显示提示
        alert('系统设置保存成功');
        
    } catch (error) {
        console.error('保存设置失败:', error);
        alert('保存设置失败，请重试');
    }
}

// 备份数据
async function backupData() {
    try {
        // 获取所有数据
        const vehicles = await loadData('vehicles');
        const spaces = await loadData('spaces');
        const records = await loadData('records');
        const settings = await loadData('settings');
        
        // 组合数据
        const backupData = {
            vehicles,
            spaces,
            records,
            settings,
            backupTime: new Date().toISOString(),
            version: '1.0'
        };
        
        // 生成文件名
        const now = new Date();
        const fileName = `parking_system_backup_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.json`;
        
        // 导出备份
        exportToJson(backupData, fileName);
        
    } catch (error) {
        console.error('备份数据失败:', error);
        alert('备份数据失败，请重试');
    }
}

// 恢复数据
function restoreData() {
    const fileInput = document.getElementById('restoreFile');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('请选择备份文件');
        return;
    }
    
    const file = fileInput.files[0];
    
    // 检查文件类型
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert('请选择JSON格式的备份文件');
        return;
    }
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // 验证备份数据结构
            if (!backupData.vehicles || !backupData.spaces || 
                !backupData.records || !backupData.settings || 
                !backupData.backupTime || !backupData.version) {
                throw new Error('备份文件格式无效');
            }
            
            // 显示确认对话框
            const backupTime = new Date(backupData.backupTime);
            document.getElementById('confirmActionTitle').textContent = '确认恢复数据';
            document.getElementById('confirmActionMessage').textContent = 
                `您确定要恢复 ${backupTime.toLocaleString()} 的备份数据吗？此操作将覆盖当前所有数据！`;
            
            // 存储备份数据
            localStorage.setItem('restoreBackupData', e.target.result);
            
            // 打开确认模态框
            const modal = new bootstrap.Modal(document.getElementById('confirmActionModal'));
            modal.show();
            
            // 绑定确认按钮事件
            document.getElementById('confirmActionBtn').onclick = confirmRestore;
            
        } catch (error) {
            console.error('解析备份文件失败:', error);
            alert('备份文件无效，请选择正确的备份文件');
        }
    };
    
    reader.onerror = function() {
        alert('读取文件失败，请重试');
    };
    
    reader.readAsText(file);
}

// 确认恢复数据
function confirmRestore() {
    try {
        // 获取备份数据
        const backupDataJson = localStorage.getItem('restoreBackupData');
        if (!backupDataJson) {
            throw new Error('备份数据不存在');
        }
        
        const backupData = JSON.parse(backupDataJson);
        
        // 恢复所有数据
        saveData('vehicles', backupData.vehicles);
        saveData('spaces', backupData.spaces);
        saveData('records', backupData.records);
        saveData('settings', backupData.settings);
        
        // 清理临时存储
        localStorage.removeItem('restoreBackupData');
        
        // 关闭确认模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmActionModal'));
        modal.hide();
        
        // 应用设置（例如深色模式）
        if (backupData.settings.system && backupData.settings.system.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // 重新加载设置
        loadSettings();
        
        // 显示提示
        alert('数据恢复成功，请刷新其他页面以应用更改');
        
    } catch (error) {
        console.error('恢复数据失败:', error);
        alert('恢复数据失败，请重试');
    }
}

// 清理数据
async function cleanupData() {
    try {
        // 获取清理日期
        const cleanupDateStr = localStorage.getItem('cleanupDate');
        if (!cleanupDateStr) {
            throw new Error('清理日期不存在');
        }
        
        // 转换为日期对象
        const cleanupDate = new Date(cleanupDateStr);
        cleanupDate.setHours(0, 0, 0, 0);
        
        // 加载所有记录
        const records = await loadData('records');
        
        // 过滤掉需要清理的记录
        const newRecords = records.filter(record => {
            const recordDate = new Date(record.entryTime);
            return recordDate >= cleanupDate;
        });
        
        // 保存更新后的记录
        saveData('records', newRecords);
        
        // 清理临时存储
        localStorage.removeItem('cleanupDate');
        
        // 关闭确认模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmActionModal'));
        modal.hide();
        
        // 显示提示
        const cleanedCount = records.length - newRecords.length;
        alert(`数据清理成功，共清理了 ${cleanedCount} 条记录`);
        
    } catch (error) {
        console.error('清理数据失败:', error);
        alert('清理数据失败，请重试');
    }
}