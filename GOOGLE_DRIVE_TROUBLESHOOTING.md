# Hướng dẫn khắc phục sự cố Google Drive API

## Các lỗi thường gặp và cách khắc phục

### 1. Lỗi "Google Drive initialization failed"

**Nguyên nhân:**
- API Key hoặc Client ID không đúng
- Google Drive API chưa được bật
- Cấu hình OAuth consent screen chưa đúng
- Lỗi CORS (Cross-Origin Resource Sharing)

**Cách khắc phục:**
1. Kiểm tra API Key và Client ID trong file `stage-detail.html`
2. Đảm bảo Google Drive API đã được bật trong Google Cloud Console
3. Kiểm tra OAuth consent screen đã được cấu hình đúng
4. Thêm domain vào Authorized JavaScript origins

### 2. Lỗi "Server did not send the correct CORS headers"

**Nguyên nhân:**
- Domain chưa được thêm vào Authorized JavaScript origins
- Sử dụng HTTP thay vì HTTPS trong production
- Lỗi cấu hình Google Cloud Console

**Cách khắc phục:**
1. Thêm domain vào Authorized JavaScript origins:
   - `http://localhost:8080` (development)
   - `https://yourdomain.com` (production)
2. Đảm bảo sử dụng HTTPS trong production
3. Kiểm tra cấu hình Google Cloud Console

### 3. Lỗi "The fetch of the id assertion endpoint resulted in a network error"

**Nguyên nhân:**
- Lỗi kết nối mạng
- Firewall chặn kết nối đến Google API
- DNS resolution issues

**Cách khắc phục:**
1. Kiểm tra kết nối internet
2. Tắt firewall tạm thời để test
3. Thử sử dụng VPN hoặc proxy khác
4. Kiểm tra DNS settings

### 4. Lỗi "Google authentication failed"

**Nguyên nhân:**
- User hủy đăng nhập
- Quyền truy cập bị từ chối
- Lỗi cấu hình OAuth

**Cách khắc phục:**
1. Đảm bảo user cấp quyền truy cập
2. Kiểm tra OAuth consent screen settings
3. Xóa cache browser và thử lại
4. Sử dụng nút Debug để kiểm tra trạng thái

## Cách sử dụng nút Debug

1. Chọn chế độ lưu trữ "Google Drive"
2. Click nút "Debug" (biểu tượng bug)
3. Mở Developer Console (F12) để xem thông tin chi tiết
4. Kiểm tra các thông tin sau:
   - gapi available: true/false
   - gapi.auth2 available: true/false
   - gapi.client available: true/false
   - googleAuthToken: Set/Not set
   - googleDriveFolderId: Set/Not set
   - User signed in: true/false

## Các bước kiểm tra cơ bản

### 1. Kiểm tra cấu hình Google Cloud Console
- [ ] Google Drive API đã được bật
- [ ] OAuth consent screen đã được cấu hình
- [ ] OAuth 2.0 Client ID đã được tạo
- [ ] API Key đã được tạo và không bị hạn chế
- [ ] Authorized JavaScript origins đã được thêm

### 2. Kiểm tra cấu hình trong code
- [ ] API Key đúng trong `GOOGLE_DRIVE_API_KEY`
- [ ] Client ID đúng trong `GOOGLE_DRIVE_CLIENT_ID`
- [ ] Domain đang sử dụng đã được thêm vào Authorized origins

### 3. Kiểm tra browser
- [ ] JavaScript được bật
- [ ] Không có extension chặn Google API
- [ ] Cache đã được xóa
- [ ] Sử dụng HTTPS (nếu là production)

## Lỗi cụ thể và giải pháp

### Lỗi 400 (Bad Request)
```
Google Drive initialization failed: Object
```
**Giải pháp:** Kiểm tra API Key và Client ID

### Lỗi 403 (Forbidden)
```
Google Drive API chưa được bật
```
**Giải pháp:** Bật Google Drive API trong Google Cloud Console

### Lỗi CORS
```
Server did not send the correct CORS headers
```
**Giải pháp:** Thêm domain vào Authorized JavaScript origins

### Lỗi Network
```
The fetch of the id assertion endpoint resulted in a network error
```
**Giải pháp:** Kiểm tra kết nối mạng và firewall

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, vui lòng:
1. Chụp màn hình lỗi từ Developer Console
2. Ghi lại các bước đã thực hiện
3. Kiểm tra file `GOOGLE_DRIVE_SETUP.md` để đảm bảo setup đúng
4. Thử trên browser khác để loại trừ vấn đề browser 