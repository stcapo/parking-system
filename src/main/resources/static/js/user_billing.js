/**
 * 智慧停车场 - 用户账单脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // 未登录，重定向到登录页面
        window.location.href = 'user_login.html';
        return;
    }
    
    // 初始化充值金额按钮
    initRechargeButtons();
    
    // 初始化模态框事件
    initModals();
    
    // 初始化支付方式切换
    initPaymentTypeToggle();
    
    // 初始化表单保存按钮
    initSaveButtons();
    
    // 初始化账单详情查看
    initBillDetails();
    
    // 自动支付开关
    initAutoPayment();
    
    // 加载用户账户余额
    loadUserBalance();
});

/**
 * 初始化充值金额快捷按钮
 */
function initRechargeButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const rechargeAmountInput = document.getElementById('rechargeAmount');
    
    if (amountButtons && rechargeAmountInput) {
        amountButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 移除所有按钮的active类
                amountButtons.forEach(btn => btn.classList.remove('active'));
                
                // 添加当前按钮的active类
                this.classList.add('active');
                
                // 设置充值金额
                const amount = this.getAttribute('data-amount');
                rechargeAmountInput.value = amount;
            });
        });
    }
    
    // 模拟支付按钮
    const simulatePaymentBtn = document.getElementById('simulatePaymentBtn');
    if (simulatePaymentBtn) {
        simulatePaymentBtn.addEventListener('click', function() {
            const amount = parseFloat(rechargeAmountInput.value);
            if (isNaN(amount) || amount <= 0) {
                alert('请输入有效的充值金额');
                return;
            }
            
            // 隐藏充值模态框
            const rechargeModal = bootstrap.Modal.getInstance(document.getElementById('rechargeModal'));
            rechargeModal.hide();
            
            // 更新成功模态框的金额
            const successAmount = document.getElementById('successAmount');
            if (successAmount) {
                successAmount.textContent = `¥${amount.toFixed(2)}`;
            }
            
            const successCurrentBalance = document.getElementById('successCurrentBalance');
            if (successCurrentBalance) {
                // 获取当前余额并计算新余额
                const currentBalance = parseFloat(document.getElementById('accountBalance').textContent.replace('¥', ''));
                const newBalance = currentBalance + amount;
                successCurrentBalance.textContent = `¥${newBalance.toFixed(2)}`;
                
                // 更新页面上的余额显示
                document.getElementById('accountBalance').textContent = `¥${newBalance.toFixed(2)}`;
                
                // 更新本地存储中的用户余额
                const user = getCurrentUser();
                if (user) {
                    user.balance = newBalance;
                    setCurrentUser(user);
                }
            }
            
            // 设置交易流水号和时间
            const successTransactionId = document.getElementById('successTransactionId');
            const successPaymentTime = document.getElementById('successPaymentTime');
            const successPaymentMethod = document.getElementById('successPaymentMethod');
            
            if (successTransactionId) {
                const now = new Date();
                const transactionId = `TX${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
                successTransactionId.textContent = transactionId;
            }
            
            if (successPaymentTime) {
                successPaymentTime.textContent = formatDateTime(new Date());
            }
            
            if (successPaymentMethod) {
                // 根据当前激活的支付标签页确定支付方式
                const alipayTab = document.getElementById('alipay-tab');
                successPaymentMethod.textContent = alipayTab && alipayTab.classList.contains('active') ? '支付宝' : '微信支付';
            }
            
            // 显示支付成功模态框
            const successModal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
            successModal.show();
        });
    }
}

/**
 * 初始化模态框事件
 */
function initModals() {
    // 支付成功模态框中的显示详情按钮
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    const successDetails = document.getElementById('successDetails');
    
    if (showDetailsBtn && successDetails) {
        showDetailsBtn.addEventListener('click', function() {
            successDetails.classList.toggle('d-none');
            this.textContent = successDetails.classList.contains('d-none') ? '查看详情' : '隐藏详情';
        });
    }
    
    // 账单详情模态框
    const billDetailModal = document.getElementById('billDetailModal');
    if (billDetailModal) {
        billDetailModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const billId = button.getAttribute('data-bill-id');
            
            // 根据账单ID加载详情
            loadBillDetails(billId);
        });
    }
}

/**
 * 初始化支付方式类型切换
 */
function initPaymentTypeToggle() {
    const paymentTypeSelect = document.getElementById('paymentType');
    const bankFields = document.getElementById('bankFields');
    
    if (paymentTypeSelect && bankFields) {
        paymentTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            
            // 显示/隐藏相应的表单字段
            if (selectedType === 'bank') {
                bankFields.style.display = 'block';
            } else {
                bankFields.style.display = 'none';
            }
        });
    }
}

/**
 * 初始化表单保存按钮
 */
function initSaveButtons() {
    // 保存支付方式按钮
    const savePaymentMethodBtn = document.getElementById('savePaymentMethodBtn');
    if (savePaymentMethodBtn) {
        savePaymentMethodBtn.addEventListener('click', function() {
            const paymentType = document.getElementById('paymentType').value;
            
            if (!paymentType) {
                alert('请选择支付方式类型');
                return;
            }
            
            if (paymentType === 'bank') {
                const bankName = document.getElementById('bankName').value;
                const cardNumber = document.getElementById('cardNumber').value;
                const cardOwner = document.getElementById('cardOwner').value;
                
                if (!bankName || !cardNumber || !cardOwner) {
                    alert('请填写完整的银行卡信息');
                    return;
                }
            }
            
            // 模拟保存成功
            alert('支付方式添加成功！');
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPaymentMethodModal'));
            modal.hide();
            
            // 刷新页面或更新UI
            location.reload();
        });
    }
    
    // 保存自动扣费阈值按钮
    const saveThresholdBtn = document.getElementById('saveThresholdBtn');
    if (saveThresholdBtn) {
        saveThresholdBtn.addEventListener('click', function() {
            const threshold = document.getElementById('notificationThreshold').value;
            
            if (!threshold || isNaN(parseFloat(threshold))) {
                alert('请输入有效的金额');
                return;
            }
            
            // 模拟保存成功
            alert('自动扣费阈值设置成功！');
        });
    }
}

/**
 * 初始化账单详情查看
 */
function initBillDetails() {
    // 下载电子发票按钮
    const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');
    if (downloadInvoiceBtn) {
        downloadInvoiceBtn.addEventListener('click', function() {
            alert('发票下载功能即将上线，敬请期待！');
        });
    }
}

/**
 * 初始化自动支付开关
 */
function initAutoPayment() {
    const autoPaymentSwitch = document.getElementById('autoPaymentSwitch');
    if (autoPaymentSwitch) {
        autoPaymentSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            
            // 提示用户
            if (isChecked) {
                alert('已开启自动扣费功能，停车费用将自动从您的账户余额中扣除');
            } else {
                alert('已关闭自动扣费功能，请记得及时手动支付停车费用');
            }
            
            // 在实际应用中应保存设置到服务器
        });
    }
}

/**
 * 加载用户账户余额
 */
function loadUserBalance() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.balance !== undefined) {
        const accountBalance = document.getElementById('accountBalance');
        if (accountBalance) {
            accountBalance.textContent = `¥${currentUser.balance.toFixed(2)}`;
        }
    }
}

/**
 * 根据账单ID加载账单详情
 * @param {string} billId 账单ID
 */
function loadBillDetails(billId) {
    // 在实际应用中，应从服务器获取账单详情
    // 这里使用模拟数据
    
    // 设置账单基本信息
    document.getElementById('detailBillNumber').textContent = billId;
    
    // 根据账单类型显示不同内容
    if (billId.startsWith('B')) {
        // 停车费账单
        document.getElementById('detailBillType').textContent = '停车费';
        document.getElementById('parkingDetailsSection').style.display = 'block';
        
        if (billId === 'B202504060001') {
            // 特殊处理某个特定账单的详情
            document.getElementById('detailBillTime').textContent = '2025-04-06 17:30:45';
            document.getElementById('detailBillAmount').textContent = '¥25.00';
            document.getElementById('detailPaymentMethod').textContent = '支付宝';
            document.getElementById('detailPaymentStatus').className = 'badge bg-success';
            document.getElementById('detailPaymentStatus').textContent = '已支付';
            document.getElementById('detailPaymentTime').textContent = '2025-04-06 17:31:20';
            document.getElementById('detailTransactionId').textContent = 'TX202504060001234567';
            
            // 停车详情
            document.getElementById('detailLicensePlate').textContent = '京NEV789';
            document.getElementById('detailVehicleType').textContent = '白色新能源车';
            document.getElementById('detailParkingLot').textContent = '总部停车场';
            document.getElementById('detailEntryTime').textContent = '2025-04-06 09:15';
            document.getElementById('detailExitTime').textContent = '2025-04-06 17:30';
            document.getElementById('detailDuration').textContent = '8小时15分钟';
            
            // 费用明细
            document.getElementById('detailItemsTable').innerHTML = `
                <tr>
                    <td>首小时停车费</td>
                    <td>¥10.00</td>
                    <td>1</td>
                    <td class="text-end">¥10.00</td>
                </tr>
                <tr>
                    <td>超时停车费</td>
                    <td>¥5.00/小时</td>
                    <td>7.25小时</td>
                    <td class="text-end">¥36.25</td>
                </tr>
                <tr>
                    <td>新能源车优惠</td>
                    <td>-20%</td>
                    <td>1</td>
                    <td class="text-end">-¥9.25</td>
                </tr>
                <tr>
                    <td>会员折扣</td>
                    <td>-10%</td>
                    <td>1</td>
                    <td class="text-end">-¥3.70</td>
                </tr>
                <tr>
                    <td>优惠券</td>
                    <td>固定金额</td>
                    <td>1</td>
                    <td class="text-end">-¥10.00</td>
                </tr>
            `;
            document.getElementById('detailTotalAmount').textContent = '¥25.00';
        } else if (billId === 'B202504050001') {
            // 另一个账单的详情...
            document.getElementById('detailBillTime').textContent = '2025-04-05 18:10:22';
            document.getElementById('detailBillAmount').textContent = '¥50.00';
            document.getElementById('detailPaymentMethod').textContent = '微信支付';
            document.getElementById('detailPaymentStatus').className = 'badge bg-success';
            document.getElementById('detailPaymentStatus').textContent = '已支付';
            document.getElementById('detailPaymentTime').textContent = '2025-04-05 18:12:05';
            document.getElementById('detailTransactionId').textContent = 'TX202504050001234567';
            
            // 停车详情
            document.getElementById('detailLicensePlate').textContent = '京A12345';
            document.getElementById('detailVehicleType').textContent = '黑色轿车';
            document.getElementById('detailParkingLot').textContent = '总部停车场';
            document.getElementById('detailEntryTime').textContent = '2025-04-05 08:30';
            document.getElementById('detailExitTime').textContent = '2025-04-05 17:45';
            document.getElementById('detailDuration').textContent = '9小时15分钟';
            
            // 费用明细
            document.getElementById('detailItemsTable').innerHTML = `
                <tr>
                    <td>首小时停车费</td>
                    <td>¥10.00</td>
                    <td>1</td>
                    <td class="text-end">¥10.00</td>
                </tr>
                <tr>
                    <td>超时停车费</td>
                    <td>¥5.00/小时</td>
                    <td>8.25小时</td>
                    <td class="text-end">¥41.25</td>
                </tr>
                <tr>
                    <td>会员折扣</td>
                    <td>-10%</td>
                    <td>1</td>
                    <td class="text-end">-¥5.13</td>
                </tr>
                <tr>
                    <td>日封顶优惠</td>
                    <td>封顶50元</td>
                    <td>1</td>
                    <td class="text-end">-¥0.00</td>
                </tr>
            `;
            document.getElementById('detailTotalAmount').textContent = '¥50.00';
        }
    } else if (billId.startsWith('R')) {
        // 充值账单
        document.getElementById('detailBillType').textContent = '账户充值';
        document.getElementById('parkingDetailsSection').style.display = 'none';
        
        document.getElementById('detailBillTime').textContent = '2025-04-03 10:15:30';
        document.getElementById('detailBillAmount').textContent = '¥200.00';
        document.getElementById('detailBillAmount').className = 'text-success fw-bold';
        document.getElementById('detailPaymentMethod').textContent = '支付宝';
        document.getElementById('detailPaymentStatus').className = 'badge bg-success';
        document.getElementById('detailPaymentStatus').textContent = '成功';
        document.getElementById('detailPaymentTime').textContent = '2025-04-03 10:15:30';
        document.getElementById('detailTransactionId').textContent = 'TX202504030001234567';
        
        // 费用明细
        document.getElementById('detailItemsTable').innerHTML = `
            <tr>
                <td>账户充值</td>
                <td>-</td>
                <td>1</td>
                <td class="text-end">¥200.00</td>
            </tr>
        `;
        document.getElementById('detailTotalAmount').textContent = '¥200.00';
        document.getElementById('detailTotalAmount').className = 'text-end text-success';
    } else if (billId.startsWith('M')) {
        // 会员购买账单
        document.getElementById('detailBillType').textContent = '会员购买';
        document.getElementById('parkingDetailsSection').style.display = 'none';
        
        document.getElementById('detailBillTime').textContent = '2025-04-01 08:45:12';
        document.getElementById('detailBillAmount').textContent = '¥300.00';
        document.getElementById('detailPaymentMethod').textContent = '账户余额';
        document.getElementById('detailPaymentStatus').className = 'badge bg-success';
        document.getElementById('detailPaymentStatus').textContent = '已支付';
        document.getElementById('detailPaymentTime').textContent = '2025-04-01 08:45:12';
        document.getElementById('detailTransactionId').textContent = 'TX202504010001234567';
        
        // 费用明细
        document.getElementById('detailItemsTable').innerHTML = `
            <tr>
                <td>月卡会员</td>
                <td>¥300.00/月</td>
                <td>1</td>
                <td class="text-end">¥300.00</td>
            </tr>
        `;
        document.getElementById('detailTotalAmount').textContent = '¥300.00';
    }
}