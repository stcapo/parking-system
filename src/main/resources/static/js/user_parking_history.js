/**
 * 智慧停车场 - 停车记录页面脚本
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
    
    // 初始化日期选择器默认值
    initializeDateFilters();
    
    // 加载停车记录
    loadParkingRecords();
    
    // 绑定查询按钮事件
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchParkingRecords();
        });
    }
    
    // 绑定重置按钮事件
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            document.getElementById('searchForm').reset();
            initializeDateFilters();
            loadParkingRecords();
        });
    }
    
    // 绑定导出按钮事件
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportParkingRecords);
    }
    
    // 绑定下载电子收据按钮事件
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            alert('收据已下载到您的设备');
        });
    }
    
    // 绑定申请发票按钮事件
    const requestInvoiceBtn = document.getElementById('requestInvoiceBtn');
    if (requestInvoiceBtn) {
        requestInvoiceBtn.addEventListener('click', function() {
            // 显示申请发票模态框
            const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
            invoiceModal.show();
        });
    }
    
    // 绑定提交发票申请按钮事件
    const submitInvoiceBtn = document.getElementById('submitInvoiceBtn');
    if (submitInvoiceBtn) {
        submitInvoiceBtn.addEventListener('click', function() {
            // 模拟提交发票
            setTimeout(function() {
                // 关闭发票模态框
                const invoiceModal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
                if (invoiceModal) invoiceModal.hide();
                
                // 关闭详情模态框
                const detailModal = bootstrap.Modal.getInstance(document.getElementById('recordDetailModal'));
                if (detailModal) detailModal.hide();
                
                // 显示成功消息
                alert('发票申请已提交，电子发票将在1-2个工作日内发送到您的邮箱');
            }, 1000);
        });
    }
    
    // 发票类型切换事件
    const invoiceType = document.getElementById('invoiceType');
    if (invoiceType) {
        invoiceType.addEventListener('change', function() {
            const personalFields = document.getElementById('personalInvoiceFields');
            const companyFields = document.getElementById('companyInvoiceFields');
            
            if (this.value === 'personal') {
                personalFields.style.display = 'block';
                companyFields.style.display = 'none';
            } else if (this.value === 'company') {
                personalFields.style.display = 'none';
                companyFields.style.display = 'block';
            }
        });
    }
    
    // 绑定查看详情按钮事件
    bindViewRecordButtons();
});

/**
 * 初始化日期筛选器
 */
function initializeDateFilters() {
    // 设置结束日期为今天
    const today = new Date();
    const endDateInput = document.getElementById('endDate');
    if (endDateInput) {
        endDateInput.valueAsDate = today;
    }
    
    // 设置开始日期为30天前
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.valueAsDate = startDate;
    }
}

/**
 * 加载停车记录
 */
function loadParkingRecords() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 检查URL参数是否指定了车辆
    const urlParams = new URLSearchParams(window.location.search);
    const vehiclePlate = urlParams.get('vehicle');
    
    // 如果URL中指定了车辆，自动选择该车辆
    if (vehiclePlate) {
        const vehicleSelect = document.getElementById('vehicleSelect');
        if (vehicleSelect) {
            for (let i = 0; i < vehicleSelect.options.length; i++) {
                if (vehicleSelect.options[i].value === vehiclePlate) {
                    vehicleSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    // 使用当前筛选条件加载记录
    searchParkingRecords();
    
    // 更新统计数据
    updateStatistics();
}

/**
 * 更新停车统计数据
 */
function updateStatistics() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 模拟统计数据
    // 实际项目中应从停车记录中计算
    
    // 获取统计元素
    const monthlyParkingCount = document.getElementById('monthlyParkingCount');
    const totalParkingHours = document.getElementById('totalParkingHours');
    const monthlyExpense = document.getElementById('monthlyExpense');
    const favoriteParkingLot = document.getElementById('favoriteParkingLot');
    
    // 更新统计显示
    if (monthlyParkingCount) monthlyParkingCount.textContent = '15';
    if (totalParkingHours) totalParkingHours.textContent = '36<small>小时</small>';
    if (monthlyExpense) monthlyExpense.textContent = '¥320';
    if (favoriteParkingLot) favoriteParkingLot.textContent = '3<small>处</small>';
}

/**
 * 搜索停车记录
 */
function searchParkingRecords() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 获取筛选条件
    const vehiclePlate = document.getElementById('vehicleSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    
    // 在实际项目中，这里应该调用API获取数据
    // 对于演示，我们使用模拟数据
    
    // 假设我们已经获取了符合条件的记录
    const filteredRecords = []; // 此处应该是筛选后的记录
    
    // 更新记录总数
    const totalRecords = document.getElementById('totalRecords');
    if (totalRecords) {
        totalRecords.textContent = '4'; // 实际项目中应使用 filteredRecords.length
    }
    
    // 这里可以更新分页信息
    
    // 绑定查看详情按钮事件
    bindViewRecordButtons();
}

/**
 * 绑定查看记录详情按钮事件
 */
function bindViewRecordButtons() {
    document.querySelectorAll('.view-record-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.getAttribute('data-record-id');
            viewRecordDetail(recordId);
        });
    });
}

/**
 * 查看记录详情
 * @param {string} recordId 记录ID
 */
function viewRecordDetail(recordId) {
    // 在实际项目中，应该根据ID获取记录详情
    // 这里使用模拟数据
    
    // 显示详情模态框
    const modal = new bootstrap.Modal(document.getElementById('recordDetailModal'));
    modal.show();
}

/**
 * 导出停车记录
 */
function exportParkingRecords() {
    // 在实际项目中，应该生成CSV或Excel文件
    // 这里仅做演示
    alert('停车记录已导出，文件将在几秒钟内下载');
}

/**
 * 获取车辆类型的中文名称
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
 * 格式化日期时间
 * @param {string|Date} datetime 日期时间对象或字符串
 * @returns {string} 格式化的日期时间字符串 (YYYY-MM-DD HH:MM)
 */
function formatDateTime(datetime) {
    if (!datetime) return '-';
    
    const d = new Date(datetime);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化停车时长
 * @param {number} minutes 停车时长（分钟）
 * @returns {string} 格式化的时长
 */
function formatDuration(minutes) {
    if (!minutes) return '正在停车';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    } else {
        return `${mins}分钟`;
    }
}