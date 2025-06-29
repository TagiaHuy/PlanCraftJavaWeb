// Miniplayer Functions
function minimizePomodoro() {
    if (isRunning) {
        isMinimized = true;
        document.getElementById('miniplayer').style.display = 'block';
        document.querySelector('.pomodoro-section').style.display = 'none';
        document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-expand"></i> Mở rộng';
        showToast('Pomodoro đã được thu nhỏ! Timer vẫn chạy trong nền.', 'info');
    } else {
        showToast('Vui lòng bắt đầu timer trước khi thu nhỏ!', 'warning');
    }
}

function expandMiniplayer() {
    isMinimized = false;
    document.getElementById('miniplayer').style.display = 'none';
    document.querySelector('.pomodoro-section').style.display = 'block';
    document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-compress"></i> Thu nhỏ';
}

function hideMiniplayer() {
    if (confirm('Bạn có muốn dừng timer và ẩn miniplayer?')) {
        pausePomodoro();
        expandMiniplayer();
    }
}

function toggleMiniplayerPomodoro() {
    if (isRunning) {
        pausePomodoro();
    } else {
        startPomodoro();
    }
}

function resetMiniplayerPomodoro() {
    resetPomodoro();
    expandMiniplayer();
}

// Export functions for global access
window.minimizePomodoro = minimizePomodoro;
window.expandMiniplayer = expandMiniplayer;
window.hideMiniplayer = hideMiniplayer;
window.toggleMiniplayerPomodoro = toggleMiniplayerPomodoro;
window.resetMiniplayerPomodoro = resetMiniplayerPomodoro; 