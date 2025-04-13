/**
 * 智慧停车场 - 首页脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态并更新界面
    checkLoginStatus();
    
    // 强制显示登录/未登录状态
    const currentUser = getCurrentUser();
    const loggedInElement = document.getElementById('loggedIn');
    const notLoggedInElement = document.getElementById('notLoggedIn');
    
    if (currentUser) {
        // 用户已登录
        if (loggedInElement) {
            loggedInElement.style.display = 'flex';
        }
        if (notLoggedInElement) {
            notLoggedInElement.style.display = 'none';
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
    
    // 处理联系表单提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // 简单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟提交
            alert('感谢您的留言！我们会尽快回复。');
            
            // 清空表单
            contactForm.reset();
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 排除下拉菜单触发器
            if (this.getAttribute('data-bs-toggle') === 'dropdown') {
                return;
            }
            
            // 只处理页内锚点
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // 考虑固定导航栏的高度
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 导航栏激活状态处理
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // 添加一些偏移量
        
        // 找出当前滚动位置所在的区域
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.id;
            }
        });
        
        // 更新导航菜单激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // 页面滚动时更新导航菜单激活状态
    window.addEventListener('scroll', updateActiveNavItem);
    
    // 页面加载时先执行一次
    updateActiveNavItem();
});