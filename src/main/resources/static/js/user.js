// JS cho các thao tác với user (có thể mở rộng sau)
console.log('User JS loaded'); 

// PlanCraft User Interface JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeForms();
    initializeCards();
    initializeTables();
    initializeAnimations();
    initializeTheme();
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Form functionality
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading state
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<div class="spinner"></div> Đang xử lý...';
                submitBtn.disabled = true;
            }
        });
        
        // Add input focus effects
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    });
}

// Card functionality
function initializeCards() {
    const cards = document.querySelectorAll('.card, .goal-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// Table functionality
function initializeTables() {
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach((row, index) => {
        // Add staggered animation
        row.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effects
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--gray-50)';
            this.style.transform = 'scale(1.01)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = 'scale(1)';
        });
    });
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// Theme functionality
function initializeTheme() {
    // Check for saved theme preference or default to light theme
    const savedTheme = localStorage.getItem('planCraftTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add theme toggle functionality if needed
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('planCraftTheme', newTheme);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showLoading(element) {
    element.classList.add('loading');
    element.innerHTML = '<div class="spinner"></div>';
}

function hideLoading(element, originalContent) {
    element.classList.remove('loading');
    element.innerHTML = originalContent;
}

// Goal management functions
function updateGoalStatus(goalId, status) {
    showLoading(document.querySelector(`[data-goal-id="${goalId}"]`));
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Cập nhật trạng thái thành công!', 'success');
        location.reload();
    }, 1000);
}

function deleteGoal(goalId) {
    if (confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
        showLoading(document.querySelector(`[data-goal-id="${goalId}"]`));
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Xóa mục tiêu thành công!', 'success');
            location.reload();
        }, 1000);
    }
}

// Stage management functions
function updateStageStatus(stageId, status) {
    showLoading(document.querySelector(`[data-stage-id="${stageId}"]`));
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Cập nhật trạng thái giai đoạn thành công!', 'success');
        location.reload();
    }, 1000);
}

// User management functions
function viewUser(userId) {
    showNotification(`Xem chi tiết người dùng ID: ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        showLoading(document.querySelector(`[data-user-id="${userId}"]`));
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Xóa người dùng thành công!', 'success');
            location.reload();
        }, 1000);
    }
}

function exportUsers() {
    showNotification('Đang xuất dữ liệu...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification('Xuất dữ liệu thành công!', 'success');
    }, 2000);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.searchable-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const items = document.querySelectorAll('.filterable-item');
            
            // Update active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    animateProgressBars();
});

// Export functions for global use
window.PlanCraft = {
    showNotification,
    showLoading,
    hideLoading,
    updateGoalStatus,
    deleteGoal,
    updateStageStatus,
    viewUser,
    deleteUser,
    exportUsers,
    toggleTheme
}; 