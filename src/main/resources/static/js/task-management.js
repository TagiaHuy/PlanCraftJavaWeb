// Task Management Functions

// Toggle task status (AJAX)
window.toggleTaskStatus = function(taskId, checked) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    const isCurrentlyCompleted = taskItem.classList.contains('completed');
    const checkbox = taskItem.querySelector('.task-checkbox-input');
    
    // Update checkbox state immediately for better UX
    checkbox.checked = checked;
    
    const status = checked ? 'COMPLETED' : 'NOT_STARTED';
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    
    // Show loading state
    checkbox.disabled = true;
    
    fetch(`/api/tasks/${taskId}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            [csrfHeader]: csrfToken
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(updatedTask => {
        // Update task item appearance
        const taskStatus = taskItem.querySelector('.task-status');
        const taskStatusIcon = taskStatus.querySelector('i');
        const taskStatusText = taskStatus.querySelector('span');
        
        if (updatedTask.status === 'COMPLETED') {
            taskItem.classList.add('completed');
            taskStatusIcon.className = 'fas fa-check-circle';
            taskStatusText.textContent = 'Hoàn thành';
            taskStatus.className = 'task-status completed';
            
            // Add success animation
            taskItem.style.animation = 'taskCompleted 0.5s ease-out';
            setTimeout(() => {
                taskItem.style.animation = '';
            }, 500);
            
            // Show success message
            showToast('Nhiệm vụ đã được đánh dấu hoàn thành!', 'success');
        } else {
            taskItem.classList.remove('completed');
            taskStatusIcon.className = 'fas fa-pause-circle';
            taskStatusText.textContent = 'Chưa làm';
            taskStatus.className = 'task-status not_started';
            
            // Add uncheck animation
            taskItem.style.animation = 'taskUnchecked 0.3s ease-out';
            setTimeout(() => {
                taskItem.style.animation = '';
            }, 300);
            
            // Show info message
            showToast('Nhiệm vụ đã được đánh dấu chưa hoàn thành', 'info');
        }
        
        // Update progress statistics using data from database
        updateProgressFromDatabase(updatedTask.stageProgress);
        
        // Re-enable checkbox
        checkbox.disabled = false;
    })
    .catch(error => {
        console.error('Error updating task status:', error);
        // Revert checkbox state if update failed
        checkbox.checked = !checked;
        checkbox.disabled = false;
        
        // Show error message
        showToast('Có lỗi xảy ra khi cập nhật trạng thái nhiệm vụ. Vui lòng thử lại.', 'error');
    });
};

// Update progress statistics using data from database
function updateProgressFromDatabase(progressPercentage) {
    const progressPercentageRounded = Math.round(progressPercentage);
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill-large');
    if (progressFill) {
        progressFill.style.width = progressPercentageRounded + '%';
    }
    
    // Update progress percentage
    const progressPercentageElement = document.querySelector('.progress-percentage');
    if (progressPercentageElement) {
        progressPercentageElement.textContent = progressPercentageRounded + '%';
    }
    
    // Update progress stats (calculate from DOM since we don't have total/completed counts)
    const taskItems = document.querySelectorAll('.task-item');
    const totalTasks = taskItems.length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    
    const progressStats = document.querySelector('.progress-stats');
    if (progressStats) {
        progressStats.textContent = `${completedTasks} / ${totalTasks} nhiệm vụ hoàn thành`;
    }
    
    // Update statistics cards
    const totalTasksCard = document.querySelector('.stat-card:nth-child(2) h3');
    if (totalTasksCard) {
        totalTasksCard.textContent = totalTasks;
    }
    
    const completedTasksCard = document.querySelector('.stat-card:nth-child(3) h3');
    if (completedTasksCard) {
        completedTasksCard.textContent = completedTasks;
    }
    
    const progressCard = document.querySelector('.stat-card:nth-child(4) h3');
    if (progressCard) {
        progressCard.textContent = progressPercentageRounded + '%';
    }
}

// Update progress statistics (legacy function for initial load)
function updateProgress() {
    const taskItems = document.querySelectorAll('.task-item');
    const totalTasks = taskItems.length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks * 100) / totalTasks) : 0;
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill-large');
    if (progressFill) {
        progressFill.style.width = progressPercentage + '%';
    }
    
    // Update progress percentage
    const progressPercentageElement = document.querySelector('.progress-percentage');
    if (progressPercentageElement) {
        progressPercentageElement.textContent = progressPercentage + '%';
    }
    
    // Update progress stats
    const progressStats = document.querySelector('.progress-stats');
    if (progressStats) {
        progressStats.textContent = `${completedTasks} / ${totalTasks} nhiệm vụ hoàn thành`;
    }
    
    // Update statistics cards
    const totalTasksCard = document.querySelector('.stat-card:nth-child(2) h3');
    if (totalTasksCard) {
        totalTasksCard.textContent = totalTasks;
    }
    
    const completedTasksCard = document.querySelector('.stat-card:nth-child(3) h3');
    if (completedTasksCard) {
        completedTasksCard.textContent = completedTasks;
    }
    
    const progressCard = document.querySelector('.stat-card:nth-child(4) h3');
    if (progressCard) {
        progressCard.textContent = progressPercentage + '%';
    }
}

// Edit task
function editTask(taskId) {
    // TODO: Implement edit functionality
    alert('Chức năng chỉnh sửa nhiệm vụ sẽ được thêm sau');
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
                taskItem.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    taskItem.remove();
                    updateProgress();
                }, 300);
            }
        });
    }
}

// Edit stage
function editStage() {
    // TODO: Implement edit functionality
    alert('Chức năng chỉnh sửa giai đoạn sẽ được thêm sau');
}

// Initialize task management
function initializeTaskManagement() {
    // Add animation to task items
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach((item, index) => {
        item.style.animationDelay = (index * 0.1) + 's';
    });

    // Add hover effects
    taskItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click event to task items for toggle functionality
    taskItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons or links
            if (e.target.closest('.task-actions') || 
                e.target.closest('a') || 
                e.target.closest('button') ||
                e.target.closest('.task-checkbox')) {
                return;
            }
            
            const taskId = this.getAttribute('data-task-id');
            const checkbox = this.querySelector('.task-checkbox-input');
            const newCheckedState = !checkbox.checked;
            
            // Trigger the toggle function
            toggleTaskStatus(taskId, newCheckedState);
        });
    });
}

// Export functions for global access
window.editTask = editTask;
window.deleteTask = deleteTask;
window.editStage = editStage;
window.updateProgress = updateProgress;
window.updateProgressFromDatabase = updateProgressFromDatabase;
window.initializeTaskManagement = initializeTaskManagement; 