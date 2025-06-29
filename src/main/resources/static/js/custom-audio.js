// Custom Audio Functions
function handleAudioModeChange() {
    const audioMode = document.querySelector('input[name="audioMode"]:checked').value;
    currentAudioMode = audioMode;
    
    if (audioMode === 'custom') {
        document.getElementById('customAudioSection').style.display = 'block';
        loadCustomAudios(); // Load saved audios when switching to custom mode
    } else {
        document.getElementById('customAudioSection').style.display = 'none';
    }
}

function handleAudioTypeChange() {
    selectedAudioType = document.getElementById('audioType').value;
    // Reset preview when changing type
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    uploadedFile = null;
}

function handleAudioUpload(event) {
    const file = event.target.files[0];
    console.log('File input change event:', file);
    
    if (file) {
        try {
            processAudioFile(file);
        } catch (error) {
            console.error('Error processing audio file:', error);
            showToast('Có lỗi xảy ra khi xử lý file âm thanh. Vui lòng thử lại.', 'error');
        }
    } else {
        console.log('No file selected');
        showToast('Vui lòng chọn file âm thanh.', 'warning');
    }
}

function processAudioFile(file) {
    console.log('Processing audio file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Current storage mode:', currentStorageMode);
    
    // Check file size based on storage mode
    const maxSize = currentStorageMode === 'google' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for Google Drive, 5MB for LocalStorage
    console.log('Max allowed size:', maxSize, 'bytes');
    
    if (file.size > maxSize) {
        const maxSizeMB = currentStorageMode === 'google' ? '100MB' : '5MB';
        showToast(`File quá lớn! Vui lòng chọn file nhỏ hơn ${maxSizeMB}.`, 'error');
        return;
    }

    // Check file type
    if (!file.type.startsWith('audio/')) {
        showToast('Vui lòng chọn file âm thanh hợp lệ!', 'error');
        return;
    }

    // Check localStorage quota only for local storage mode
    if (currentStorageMode === 'local' && !checkStorageQuota(file.size)) {
        showToast('Không đủ dung lượng lưu trữ! Vui lòng xóa một số âm thanh cũ hoặc chọn file nhỏ hơn.', 'error');
        return;
    }

    uploadedFile = file;
    console.log('File uploaded successfully:', file.name);
    
    // Create audio element for preview
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    
    // Update preview
    document.getElementById('audioFileName').textContent = file.name;
    document.getElementById('audioPreviewPlayer').src = URL.createObjectURL(file);
    document.getElementById('audioPreview').style.display = 'block';
    document.getElementById('uploadZone').style.display = 'none';
    
    showToast('File âm thanh đã được tải lên!', 'success');
}

function checkStorageQuota(fileSize) {
    try {
        // Estimate total size needed (base64 encoding increases size by ~33%)
        const estimatedSize = fileSize * 1.4; // Base64 + JSON overhead
        
        // Check current localStorage usage
        let currentUsage = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                currentUsage += localStorage[key].length;
            }
        }
        
        // Check if adding this file would exceed quota (5MB limit)
        const totalSize = currentUsage + estimatedSize;
        const maxQuota = 5 * 1024 * 1024; // 5MB
        
        if (totalSize > maxQuota) {
            return false;
        }
        
        return true;
    } catch (e) {
        console.error('Error checking storage quota:', e);
        return false;
    }
}

function getStorageUsage() {
    let usage = 0;
    let audioFiles = [];
    
    try {
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = localStorage[key].length;
                usage += size;
                
                if (key.includes('Audio')) {
                    try {
                        const data = JSON.parse(localStorage[key]);
                        audioFiles.push({
                            key: key,
                            name: data.name,
                            size: data.size,
                            storageSize: size
                        });
                    } catch (e) {
                        // Ignore non-JSON items
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error calculating storage usage:', e);
    }
    
    return { totalUsage: usage, audioFiles: audioFiles };
}

function saveCustomAudio() {
    if (!uploadedFile) {
        showToast('Vui lòng chọn file âm thanh trước!', 'error');
        return;
    }

    // Show loading state
    const saveBtn = document.querySelector('.audio-actions .btn-primary');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    saveBtn.disabled = true;

    if (currentStorageMode === 'google') {
        // Save to Google Drive
        if (!googleAuthToken) {
            showToast('Vui lòng đăng nhập Google Drive trước!', 'error');
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            return;
        }

        const fileName = `pomodoro_${selectedAudioType}_${Date.now()}_${uploadedFile.name}`;
        
        uploadToGoogleDrive(uploadedFile, fileName)
            .then((fileData) => {
                // Store file reference in localStorage
                const fileReference = {
                    id: fileData.id,
                    name: uploadedFile.name,
                    type: uploadedFile.type,
                    size: uploadedFile.size,
                    timestamp: Date.now(),
                    storage: 'google'
                };

                switch (selectedAudioType) {
                    case 'work':
                        localStorage.setItem('customWorkAudio', JSON.stringify(fileReference));
                        break;
                    case 'break':
                        localStorage.setItem('customBreakAudio', JSON.stringify(fileReference));
                        break;
                    case 'universal':
                        localStorage.setItem('customUniversalAudio', JSON.stringify(fileReference));
                        break;
                }

                showToast(`Âm thanh ${selectedAudioType === 'work' ? 'làm việc' : selectedAudioType === 'break' ? 'nghỉ ngơi' : 'cố định'} đã được lưu lên Google Drive!`, 'success');
            })
            .catch((error) => {
                console.error('Google Drive upload failed:', error);
                showToast('Lưu lên Google Drive thất bại. Vui lòng thử lại.', 'error');
            })
            .finally(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                
                // Reset preview
                document.getElementById('audioPreview').style.display = 'none';
                document.getElementById('uploadZone').style.display = 'block';
                uploadedFile = null;
            });
    } else {
        // Save to LocalStorage (existing code)
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const base64Audio = e.target.result;
                const audioData = {
                    data: base64Audio,
                    name: uploadedFile.name,
                    type: uploadedFile.type,
                    size: uploadedFile.size,
                    timestamp: Date.now(),
                    storage: 'local'
                };

                // Try to save to localStorage
                let saveSuccess = false;
                switch (selectedAudioType) {
                    case 'work':
                        localStorage.setItem('customWorkAudio', JSON.stringify(audioData));
                        customWorkAudio = new Audio(base64Audio);
                        saveSuccess = true;
                        break;
                    case 'break':
                        localStorage.setItem('customBreakAudio', JSON.stringify(audioData));
                        customBreakAudio = new Audio(base64Audio);
                        saveSuccess = true;
                        break;
                    case 'universal':
                        localStorage.setItem('customUniversalAudio', JSON.stringify(audioData));
                        customUniversalAudio = new Audio(base64Audio);
                        saveSuccess = true;
                        break;
                }

                if (saveSuccess) {
                    showToast(`Âm thanh ${selectedAudioType === 'work' ? 'làm việc' : selectedAudioType === 'break' ? 'nghỉ ngơi' : 'cố định'} đã được lưu!`, 'success');
                }

            } catch (error) {
                console.error('Error saving audio:', error);
                if (error.name === 'QuotaExceededError') {
                    showToast('Không đủ dung lượng lưu trữ! Vui lòng xóa âm thanh cũ hoặc chọn file nhỏ hơn.', 'error');
                    showStorageManagementDialog();
                } else {
                    showToast('Có lỗi xảy ra khi lưu âm thanh. Vui lòng thử lại.', 'error');
                }
            } finally {
                // Reset button state
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                
                // Reset preview
                document.getElementById('audioPreview').style.display = 'none';
                document.getElementById('uploadZone').style.display = 'block';
                uploadedFile = null;
            }
        };
        
        reader.onerror = function() {
            showToast('Có lỗi xảy ra khi đọc file âm thanh.', 'error');
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        };
        
        reader.readAsDataURL(uploadedFile);
    }
}

async function loadCustomAudios() {
    // Load work audio
    const workAudioData = localStorage.getItem('customWorkAudio');
    if (workAudioData) {
        try {
            const data = JSON.parse(workAudioData);
            if (data.storage === 'google' && data.id) {
                // Fetch from Google Drive
                const blob = await downloadFromGoogleDrive(data.id);
                customWorkAudio = new Audio(URL.createObjectURL(blob));
                console.log('Đã tải âm thanh làm việc từ Google Drive!');
            } else if (data.data) {
                customWorkAudio = new Audio(data.data);
                console.log('Đã tải âm thanh làm việc từ LocalStorage!');
            }
        } catch (e) {
            console.error('Error loading work audio:', e);
            localStorage.removeItem('customWorkAudio');
        }
    }

    // Load break audio
    const breakAudioData = localStorage.getItem('customBreakAudio');
    if (breakAudioData) {
        try {
            const data = JSON.parse(breakAudioData);
            if (data.storage === 'google' && data.id) {
                const blob = await downloadFromGoogleDrive(data.id);
                customBreakAudio = new Audio(URL.createObjectURL(blob));
                console.log('Đã tải âm thanh nghỉ ngơi từ Google Drive!');
            } else if (data.data) {
                customBreakAudio = new Audio(data.data);
                console.log('Đã tải âm thanh nghỉ ngơi từ LocalStorage!');
            }
        } catch (e) {
            console.error('Error loading break audio:', e);
            localStorage.removeItem('customBreakAudio');
        }
    }

    // Load universal audio
    const universalAudioData = localStorage.getItem('customUniversalAudio');
    if (universalAudioData) {
        try {
            const data = JSON.parse(universalAudioData);
            if (data.storage === 'google' && data.id) {
                const blob = await downloadFromGoogleDrive(data.id);
                customUniversalAudio = new Audio(URL.createObjectURL(blob));
                console.log('Đã tải âm thanh cố định từ Google Drive!');
            } else if (data.data) {
                customUniversalAudio = new Audio(data.data);
                console.log('Đã tải âm thanh cố định từ LocalStorage!');
            }
        } catch (e) {
            console.error('Error loading universal audio:', e);
            localStorage.removeItem('customUniversalAudio');
        }
    }
}

function removeAudio() {
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    uploadedFile = null;
    document.getElementById('audioFile').value = '';
}

function resetToDefault() {
    // Clear from memory
    customWorkAudio = null;
    customBreakAudio = null;
    customUniversalAudio = null;
    currentAudioMode = 'default';
    
    // Clear from localStorage
    localStorage.removeItem('customWorkAudio');
    localStorage.removeItem('customBreakAudio');
    localStorage.removeItem('customUniversalAudio');
    
    // Reset UI
    document.querySelector('input[name="audioMode"][value="default"]').checked = true;
    document.getElementById('customAudioSection').style.display = 'none';
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    uploadedFile = null;
    document.getElementById('audioFile').value = '';
    
    showToast('Đã khôi phục âm thanh mặc định!', 'success');
}

function showSavedAudioInfo() {
    let info = 'Âm thanh đã lưu:\n';
    
    if (localStorage.getItem('customWorkAudio')) {
        const data = JSON.parse(localStorage.getItem('customWorkAudio'));
        info += `- Làm việc: ${data.name}\n`;
    }
    
    if (localStorage.getItem('customBreakAudio')) {
        const data = JSON.parse(localStorage.getItem('customBreakAudio'));
        info += `- Nghỉ ngơi: ${data.name}\n`;
    }
    
    if (localStorage.getItem('customUniversalAudio')) {
        const data = JSON.parse(localStorage.getItem('customUniversalAudio'));
        info += `- Cố định: ${data.name}\n`;
    }
    
    if (info === 'Âm thanh đã lưu:\n') {
        info = 'Chưa có âm thanh nào được lưu.';
    }
    
    alert(info);
}

function showStorageManagementDialog() {
    const usage = getStorageUsage();
    const totalMB = (usage.totalUsage / (1024 * 1024)).toFixed(2);
    const maxMB = 5;
    
    let message = `Dung lượng lưu trữ hiện tại: ${totalMB}MB / ${maxMB}MB\n\n`;
    message += 'Âm thanh đã lưu:\n';
    
    if (usage.audioFiles.length === 0) {
        message += 'Không có âm thanh nào được lưu.\n';
    } else {
        usage.audioFiles.forEach(file => {
            const fileMB = (file.storageSize / (1024 * 1024)).toFixed(2);
            const type = file.key.includes('Work') ? 'Làm việc' : 
                        file.key.includes('Break') ? 'Nghỉ ngơi' : 'Cố định';
            message += `- ${type}: ${file.name} (${fileMB}MB)\n`;
        });
    }
    
    message += '\nBạn có muốn xóa một số âm thanh cũ để giải phóng dung lượng?';
    
    if (confirm(message)) {
        showAudioDeletionDialog();
    }
}

function showAudioDeletionDialog() {
    const usage = getStorageUsage();
    
    if (usage.audioFiles.length === 0) {
        showToast('Không có âm thanh nào để xóa.', 'info');
        return;
    }
    
    let message = 'Chọn âm thanh để xóa:\n\n';
    usage.audioFiles.forEach((file, index) => {
        const fileMB = (file.storageSize / (1024 * 1024)).toFixed(2);
        const type = file.key.includes('Work') ? 'Làm việc' : 
                    file.key.includes('Break') ? 'Nghỉ ngơi' : 'Cố định';
        message += `${index + 1}. ${type}: ${file.name} (${fileMB}MB)\n`;
    });
    
    message += '\nNhập số thứ tự để xóa (hoặc 0 để hủy):';
    
    const choice = prompt(message);
    if (choice && choice !== '0') {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < usage.audioFiles.length) {
            const fileToDelete = usage.audioFiles[index];
            deleteAudioFile(fileToDelete.key, fileToDelete.name);
        } else {
            showToast('Lựa chọn không hợp lệ.', 'error');
        }
    }
}

function deleteAudioFile(key, fileName) {
    if (confirm(`Bạn có chắc chắn muốn xóa "${fileName}"?`)) {
        try {
            localStorage.removeItem(key);
            
            // Clear from memory
            switch (key) {
                case 'customWorkAudio':
                    customWorkAudio = null;
                    break;
                case 'customBreakAudio':
                    customBreakAudio = null;
                    break;
                case 'customUniversalAudio':
                    customUniversalAudio = null;
                    break;
            }
            
            showToast(`Đã xóa "${fileName}" thành công!`, 'success');
            
            // Show updated storage info
            const usage = getStorageUsage();
            const totalMB = (usage.totalUsage / (1024 * 1024)).toFixed(2);
            showToast(`Dung lượng còn lại: ${totalMB}MB / 5MB`, 'info');
            
        } catch (error) {
            console.error('Error deleting audio file:', error);
            showToast('Có lỗi xảy ra khi xóa file.', 'error');
        }
    }
}

function checkSavedAudioFiles() {
    const hasWorkAudio = localStorage.getItem('customWorkAudio');
    const hasBreakAudio = localStorage.getItem('customBreakAudio');
    const hasUniversalAudio = localStorage.getItem('customUniversalAudio');
    
    if (hasWorkAudio || hasBreakAudio || hasUniversalAudio) {
        let savedCount = 0;
        if (hasWorkAudio) savedCount++;
        if (hasBreakAudio) savedCount++;
        if (hasUniversalAudio) savedCount++;
        
        showToast(`Phát hiện ${savedCount} âm thanh tùy chỉnh đã lưu! Chuyển sang chế độ tùy chỉnh để sử dụng.`, 'info');
    }
}

function testFileUpload() {
    console.log('=== File Upload Test ===');
    console.log('Current storage mode:', currentStorageMode);
    console.log('Uploaded file:', uploadedFile);
    console.log('Audio type selected:', selectedAudioType);
    console.log('Audio mode:', currentAudioMode);
    
    if (uploadedFile) {
        console.log('File details:');
        console.log('- Name:', uploadedFile.name);
        console.log('- Size:', uploadedFile.size, 'bytes');
        console.log('- Type:', uploadedFile.type);
        console.log('- Last modified:', new Date(uploadedFile.lastModified));
        
        // Test file size validation
        const maxSize = currentStorageMode === 'google' ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
        console.log('- Max allowed size:', maxSize, 'bytes');
        console.log('- File size OK:', uploadedFile.size <= maxSize);
        
        // Test file type validation
        console.log('- File type OK:', uploadedFile.type.startsWith('audio/'));
        
        // Test storage quota (for local mode)
        if (currentStorageMode === 'local') {
            console.log('- Storage quota OK:', checkStorageQuota(uploadedFile.size));
        }
    } else {
        console.log('No file uploaded');
    }
    
    showToast('Kiểm tra console để xem thông tin chi tiết', 'info');
}

// Export functions for global access
window.handleAudioModeChange = handleAudioModeChange;
window.handleAudioTypeChange = handleAudioTypeChange;
window.handleAudioUpload = handleAudioUpload;
window.saveCustomAudio = saveCustomAudio;
window.removeAudio = removeAudio;
window.resetToDefault = resetToDefault;
window.showSavedAudioInfo = showSavedAudioInfo;
window.showStorageManagementDialog = showStorageManagementDialog;
window.checkSavedAudioFiles = checkSavedAudioFiles;
window.testFileUpload = testFileUpload; 