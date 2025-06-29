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
    const soundBtn = document.getElementById('soundToggle');
    if (soundEnabled) {
        soundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Tắt âm thanh';
        soundBtn.className = 'btn btn-secondary btn-sm';
        // Play a test sound
        playWorkCompleteSound();
    } else {
        soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Bật âm thanh';
        soundBtn.className = 'btn btn-outline-secondary btn-sm';
    }
}

function testSound() {
    if (soundEnabled) {
        playWorkCompleteSound();
        showToast('Đang phát âm thanh test!', 'info');
    } else {
        showToast('Âm thanh đã bị tắt. Vui lòng bật âm thanh trước.', 'warning');
    }
}

// Pomodoro Functions
function startPomodoro() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('pomodoroStatus').textContent = isBreak ? 'Đang nghỉ ngơi' : 'Đang làm việc';
        document.querySelector('.pomodoro-timer').classList.add('running');
        
        // Update miniplayer if minimized
        if (isMinimized) {
            document.getElementById('miniplayerToggle').innerHTML = '<i class="fas fa-pause"></i>';
            document.getElementById('miniplayerLabel').textContent = isBreak ? 'Nghỉ ngơi' : 'Làm việc';
        }
        
        pomodoroTimer = setInterval(() => {
            currentTime--;
            totalSeconds++;
            updateTimerDisplay();
            
            if (currentTime <= 0) {
                if (isBreak) {
                    // Break finished, start work session
                    isBreak = false;
                    currentTime = workTime * 60;
                    document.getElementById('timerLabel').textContent = 'Thời gian làm việc';
                    document.getElementById('pomodoroStatus').textContent = 'Đang làm việc';
                    showToast('Hết giờ nghỉ! Bắt đầu làm việc.', 'info');
                    playWorkCompleteSound();
                    playBackgroundSound();
                    
                    // Update miniplayer
                    if (isMinimized) {
                        document.getElementById('miniplayerLabel').textContent = 'Làm việc';
                    }
                } else {
                    // Work session finished, start break
                    isBreak = true;
                    completedCycles++;
                    document.getElementById('completedCycles').textContent = completedCycles;
                    
                    // Check if it's time for a long break (every 4 cycles)
                    if (completedCycles % 4 === 0) {
                        currentTime = longBreakTime * 60;
                        document.getElementById('timerLabel').textContent = 'Nghỉ ngơi dài';
                        showToast('Chu kỳ hoàn thành! Nghỉ ngơi dài.', 'success');
                        playLongBreakSound();
                        playBackgroundSound();
                        
                        // Update miniplayer
                        if (isMinimized) {
                            document.getElementById('miniplayerLabel').textContent = 'Nghỉ ngơi dài';
                        }
                    } else {
                        currentTime = breakTime * 60;
                        document.getElementById('timerLabel').textContent = 'Thời gian nghỉ ngơi';
                        showToast('Chu kỳ hoàn thành! Nghỉ ngơi ngắn.', 'success');
                        playBreakStartSound();
                        playBackgroundSound();
                        
                        // Update miniplayer
                        if (isMinimized) {
                            document.getElementById('miniplayerLabel').textContent = 'Nghỉ ngơi';
                        }
                    }
                    
                    document.getElementById('pomodoroStatus').textContent = 'Đang nghỉ ngơi';
                }
                updateTimerDisplay();
            }
        }, 1000);
    }
}

function pausePomodoro() {
    if (isRunning) {
        isRunning = false;
        clearInterval(pomodoroTimer);
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pomodoroStatus').textContent = 'Đã tạm dừng';
        document.querySelector('.pomodoro-timer').classList.remove('running');
        
        // Update miniplayer if minimized
        if (isMinimized) {
            document.getElementById('miniplayerToggle').innerHTML = '<i class="fas fa-play"></i>';
        }
    }
}

function resetPomodoro() {
    pausePomodoro();
    isBreak = false;
    currentTime = workTime * 60;
    completedCycles = 0;
    totalSeconds = 0;
    document.getElementById('completedCycles').textContent = '0';
    document.getElementById('totalTime').textContent = '00:00';
    document.getElementById('timerLabel').textContent = 'Thời gian làm việc';
    document.getElementById('pomodoroStatus').textContent = 'Sẵn sàng';
    document.querySelector('.pomodoro-timer').classList.remove('running');
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerDisplay').textContent = timeString;
    
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

// Initialize Pomodoro
function initializePomodoro() {
    // Pomodoro settings
    document.getElementById('workTime').addEventListener('change', function() {
        workTime = parseInt(this.value);
        if (!isRunning && !isBreak) {
            currentTime = workTime * 60;
            updateTimerDisplay();
        }
    });
    
    document.getElementById('breakTime').addEventListener('change', function() {
        breakTime = parseInt(this.value);
    });
    
    document.getElementById('longBreakTime').addEventListener('change', function() {
        longBreakTime = parseInt(this.value);
    });

    // Request notification permission for background alerts
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Add tab visibility change listener
    document.addEventListener('visibilitychange', handleTabVisibilityChange);
}

// Export functions for global access
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
window.toggleSound = toggleSound;
window.testSound = testSound;
window.initializePomodoro = initializePomodoro; 