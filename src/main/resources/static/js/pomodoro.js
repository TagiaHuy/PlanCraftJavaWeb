// Pomodoro Timer Variables
let pomodoroTimer = null;
let isRunning = false;
let isBreak = false;
let currentTime = 25 * 60; // 25 minutes in seconds
let workTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let completedCycles = 0;
let totalSeconds = 0;
let soundEnabled = true;
let isMinimized = false;
let isTabVisible = true;

// Custom Audio Variables
let customWorkAudio = null;
let customBreakAudio = null;
let customUniversalAudio = null;
let currentAudioMode = 'default';
let selectedAudioType = 'work';
let uploadedFile = null;
let currentStorageMode = 'local';

// Google Drive Variables
let googleAuthToken = null;
let googleDriveFolderId = null;
let googleTokenClient = null;
const GOOGLE_DRIVE_API_KEY = 'AIzaSyAdflseq5gSLVwG5AUkQEQCHbXZDx7UTsk';
const GOOGLE_DRIVE_CLIENT_ID = '29528036289-s5u506a1s5bnn7p9vbmlqjgii6a2j2e5.apps.googleusercontent.com';

// Sound Functions
function playWorkCompleteSound() {
    if (soundEnabled) {
        let audio;
        if (currentAudioMode === 'custom' && customWorkAudio) {
            console.log('Phát customWorkAudio:', customWorkAudio);
            audio = customWorkAudio;
        } else if (currentAudioMode === 'custom' && customUniversalAudio) {
            audio = customUniversalAudio;
        } else {
            audio = document.getElementById('workCompleteSound');
        }
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } else {
            console.log('Không tìm thấy audio để phát');
        }
    }
}

function playBreakStartSound() {
    if (soundEnabled) {
        let audio;
        if (currentAudioMode === 'custom' && customBreakAudio) {
            console.log('Phát customBreakAudio:', customBreakAudio);
            audio = customBreakAudio;
        } else if (currentAudioMode === 'custom' && customUniversalAudio) {
            audio = customUniversalAudio;
        } else {
            audio = document.getElementById('breakStartSound');
        }
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } else {
            console.log('Không tìm thấy audio để phát');
        }
    }
}

function playLongBreakSound() {
    if (soundEnabled) {
        let audio;
        if (currentAudioMode === 'custom' && customBreakAudio) {
            console.log('Phát customBreakAudio:', customBreakAudio);
            audio = customBreakAudio;
        } else if (currentAudioMode === 'custom' && customUniversalAudio) {
            audio = customUniversalAudio;
        } else {
            audio = document.getElementById('longBreakSound');
        }
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } else {
            console.log('Không tìm thấy audio để phát');
        }
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundToggle = document.getElementById('soundToggle');
    const headerSoundToggle = document.getElementById('headerSoundToggle');
    const icon = soundToggle.querySelector('i');
    const headerIcon = headerSoundToggle ? headerSoundToggle.querySelector('i') : null;
    
    if (soundEnabled) {
        icon.className = 'fas fa-volume-up';
        soundToggle.classList.remove('muted');
        soundToggle.title = 'Tắt âm thanh';
        if (headerIcon) {
            headerIcon.className = 'fas fa-volume-up';
            headerSoundToggle.classList.remove('muted');
            headerSoundToggle.title = 'Tắt âm thanh';
        }
        showToast('Âm thanh đã được bật', 'success');
    } else {
        icon.className = 'fas fa-volume-mute';
        soundToggle.classList.add('muted');
        soundToggle.title = 'Bật âm thanh';
        if (headerIcon) {
            headerIcon.className = 'fas fa-volume-mute';
            headerSoundToggle.classList.add('muted');
            headerSoundToggle.title = 'Bật âm thanh';
        }
        showToast('Âm thanh đã được tắt', 'info');
    }
    
    // Save preference
    localStorage.setItem('pomodoroSoundEnabled', soundEnabled);
}

// Pomodoro Functions
function startPomodoro() {
    if (pomodoroTimer) return;
    
    isRunning = true;
    isBreak = false;
    currentTime = workTime * 60;
    
    pomodoroTimer = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        
        if (currentTime <= 0) {
            clearInterval(pomodoroTimer);
            pomodoroTimer = null;
            isRunning = false;
            
            // Play sound
            if (soundEnabled) {
                playWorkCompleteSound();
            }
            
            // Show notification
            showToast('Phiên làm việc đã hoàn thành!', 'success');
            
            // Update UI
            document.getElementById('startBtn').style.display = 'flex';
            document.getElementById('pauseBtn').style.display = 'none';
            document.getElementById('headerStartBtn').style.display = 'flex';
            document.getElementById('headerPauseBtn').style.display = 'none';
            
            // Remove running class from timer container
            const timerContainer = document.querySelector('.timer-display-container');
            if (timerContainer) {
                timerContainer.classList.remove('running');
            }
            
            // Update status
            updateTimerLabel('Thời gian làm việc');
        }
    }, 1000);
    
    // Update UI
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'flex';
    document.getElementById('headerStartBtn').style.display = 'none';
    document.getElementById('headerPauseBtn').style.display = 'flex';
    
    // Add running class to timer container
    const timerContainer = document.querySelector('.timer-display-container');
    if (timerContainer) {
        timerContainer.classList.add('running');
    }
    
    // Show notification
    showToast('Bắt đầu phiên làm việc!', 'success');
    
    // Update status
    updateTimerLabel('Thời gian làm việc');
    
    // Show miniplayer
    if (typeof showMiniplayer === 'function') {
        showMiniplayer();
    }
}

function pausePomodoro() {
    if (!pomodoroTimer) return;
    
    clearInterval(pomodoroTimer);
    pomodoroTimer = null;
    isRunning = false;
    
    // Update UI
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('headerStartBtn').style.display = 'flex';
    document.getElementById('headerPauseBtn').style.display = 'none';
    
    // Remove running class from timer container
    const timerContainer = document.querySelector('.timer-display-container');
    if (timerContainer) {
        timerContainer.classList.remove('running');
    }
    
    // Update miniplayer
    if (typeof updateMiniplayer === 'function') {
        updateMiniplayer();
    }
    
    // Show notification
    showToast('Timer đã được tạm dừng', 'info');
}

function resetPomodoro() {
    if (pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
    }
    
    isRunning = false;
    isBreak = false;
    currentTime = workTime * 60;
    
    // Update UI
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('headerStartBtn').style.display = 'flex';
    document.getElementById('headerPauseBtn').style.display = 'none';
    document.getElementById('timerLabel').textContent = 'Thời gian làm việc';
    
    // Remove running class from timer container
    const timerContainer = document.querySelector('.timer-display-container');
    if (timerContainer) {
        timerContainer.classList.remove('running');
    }
    
    updateTimerDisplay();
    
    // Show notification
    showToast('Timer đã được đặt lại', 'info');
    
    // Hide miniplayer without confirmation
    if (typeof expandMiniplayer === 'function') {
        expandMiniplayer();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerDisplay').textContent = timeString;
    
    // Update header timer
    const headerTime = document.getElementById('headerTime');
    if (headerTime) {
        headerTime.textContent = timeString;
    }
    
    // Update miniplayer if minimized
    if (isMinimized) {
        document.getElementById('miniplayerTime').textContent = timeString;
    }
    
    // Update total time
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalSecs = totalSeconds % 60;
    document.getElementById('totalTime').textContent = 
        `${totalMinutes.toString().padStart(2, '0')}:${totalSecs.toString().padStart(2, '0')}`;
}

// Background Audio Functions
function playBackgroundSound() {
    if (soundEnabled && !isTabVisible) {
        // Play sound even when tab is not visible
        let audio;
        if (isBreak) {
            if (currentAudioMode === 'custom' && customBreakAudio) {
                audio = customBreakAudio;
            } else if (currentAudioMode === 'custom' && customUniversalAudio) {
                audio = customUniversalAudio;
            } else {
                audio = document.getElementById('breakStartSound');
            }
        } else {
            if (currentAudioMode === 'custom' && customWorkAudio) {
                audio = customWorkAudio;
            } else if (currentAudioMode === 'custom' && customUniversalAudio) {
                audio = customUniversalAudio;
            } else {
                audio = document.getElementById('workCompleteSound');
            }
        }
        
        // Force play in background
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Background audio play failed:', e);
            // Fallback: try to show notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Pomodoro Timer', {
                    body: isBreak ? 'Hết giờ nghỉ! Bắt đầu làm việc.' : 'Chu kỳ hoàn thành! Nghỉ ngơi.',
                    icon: '/favicon.ico'
                });
            }
        });
    }
}

// Tab Visibility Detection
function handleTabVisibilityChange() {
    isTabVisible = !document.hidden;
    if (!isTabVisible && isRunning) {
        showToast('Timer vẫn chạy trong nền! Âm thanh sẽ phát khi kết thúc.', 'info');
    }
}

// Toggle Pomodoro dropdown
window.togglePomodoroDropdown = function() {
    const container = document.getElementById('pomodoroContainer');
    const icon = document.getElementById('pomodoroDropdownIcon');
    const headerTimer = document.getElementById('headerTimer');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        icon.classList.add('rotated');
        headerTimer.style.display = 'none';
        localStorage.setItem('pomodoroDropdownOpen', 'true');
        
        // Add slide down animation
        container.style.animation = 'slideDown 0.3s ease-out';
    } else {
        container.style.display = 'none';
        icon.classList.remove('rotated');
        headerTimer.style.display = 'flex';
        localStorage.setItem('pomodoroDropdownOpen', 'false');
    }
};

// Initialize Pomodoro
window.initializePomodoro = function() {
    // Load saved settings
    loadPomodoroSettings();
    
    // Initialize audio settings
    initializeAudioSettings();
    
    // Set up event listeners
    setupPomodoroEventListeners();
    
    // Restore dropdown state
    restoreDropdownState();
    
    // Update display
    updateTimerDisplay();
};

// Load Pomodoro settings
function loadPomodoroSettings() {
    const savedWorkTime = localStorage.getItem('pomodoroWorkTime');
    const savedBreakTime = localStorage.getItem('pomodoroBreakTime');
    const savedLongBreakTime = localStorage.getItem('pomodoroLongBreakTime');
    
    if (savedWorkTime) {
        document.getElementById('workTime').value = savedWorkTime;
        workTime = parseInt(savedWorkTime);
    }
    
    if (savedBreakTime) {
        document.getElementById('breakTime').value = savedBreakTime;
        breakTime = parseInt(savedBreakTime);
    }
    
    if (savedLongBreakTime) {
        document.getElementById('longBreakTime').value = savedLongBreakTime;
        longBreakTime = parseInt(savedLongBreakTime);
    }
}

// Initialize audio settings
function initializeAudioSettings() {
    // Request notification permission for background alerts
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Add tab visibility change listener
    document.addEventListener('visibilitychange', handleTabVisibilityChange);
    
    // Load sound preference
    const savedSoundEnabled = localStorage.getItem('pomodoroSoundEnabled');
    if (savedSoundEnabled !== null) {
        soundEnabled = savedSoundEnabled === 'true';
    }
    
    // Update sound button icon
    updateSoundButtonIcon();
}

// Update sound button icon based on current state
function updateSoundButtonIcon() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        const icon = soundToggle.querySelector('i');
        if (soundEnabled) {
            icon.className = 'fas fa-volume-up';
            soundToggle.classList.remove('muted');
            soundToggle.title = 'Tắt âm thanh';
        } else {
            icon.className = 'fas fa-volume-mute';
            soundToggle.classList.add('muted');
            soundToggle.title = 'Bật âm thanh';
        }
    }
}

// Set up Pomodoro event listeners
function setupPomodoroEventListeners() {
    // Pomodoro settings
    document.getElementById('workTime').addEventListener('change', function() {
        workTime = parseInt(this.value);
        localStorage.setItem('pomodoroWorkTime', workTime);
        if (!isRunning && !isBreak) {
            currentTime = workTime * 60;
            updateTimerDisplay();
        }
    });
    
    document.getElementById('breakTime').addEventListener('change', function() {
        breakTime = parseInt(this.value);
        localStorage.setItem('pomodoroBreakTime', breakTime);
    });
    
    document.getElementById('longBreakTime').addEventListener('change', function() {
        longBreakTime = parseInt(this.value);
        localStorage.setItem('pomodoroLongBreakTime', longBreakTime);
    });
}

// Restore dropdown state from localStorage
function restoreDropdownState() {
    const isOpen = localStorage.getItem('pomodoroDropdownOpen') === 'true';
    const container = document.getElementById('pomodoroContainer');
    const icon = document.getElementById('pomodoroDropdownIcon');
    const headerTimer = document.getElementById('headerTimer');
    
    if (isOpen) {
        container.style.display = 'block';
        icon.classList.add('rotated');
        headerTimer.style.display = 'none';
    } else {
        container.style.display = 'none';
        icon.classList.remove('rotated');
        headerTimer.style.display = 'flex';
    }
}

// Export functions for global access
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
window.toggleSound = toggleSound;
window.initializePomodoro = initializePomodoro; 