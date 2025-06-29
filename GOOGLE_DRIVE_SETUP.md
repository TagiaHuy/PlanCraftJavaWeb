# Hướng dẫn thiết lập Google Drive API cho PlanCraft

## Tổng quan
PlanCraft hỗ trợ lưu trữ âm thanh tùy chỉnh trên Google Drive thay vì LocalStorage, cho phép lưu trữ file lớn hơn (tối đa 100MB) và truy cập từ nhiều thiết bị.

**Lưu ý quan trọng:** PlanCraft sử dụng Google Identity Services (GIS) mới thay vì thư viện gapi cũ đã bị deprecated.

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Đặt tên project (ví dụ: "PlanCraft Pomodoro")

## Bước 2: Bật Google Drive API

1. Trong Google Cloud Console, chọn project của bạn
2. Vào "APIs & Services" > "Library"
3. Tìm kiếm "Google Drive API"
4. Click vào "Google Drive API" và bật nó

## Bước 3: Tạo Credentials

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Chọn "Web application"
4. Đặt tên cho client (ví dụ: "PlanCraft Web Client")
5. Thêm Authorized JavaScript origins:
   - `http://localhost:8080` (development)
   - `https://yourdomain.com` (production)
6. Thêm Authorized redirect URIs:
   - `http://localhost:8080` (development)
   - `https://yourdomain.com` (production)
7. Click "Create"

## Bước 4: Tạo API Key

1. Trong "Credentials", click "Create Credentials" > "API Key"
2. Đặt tên cho API Key (ví dụ: "PlanCraft API Key")
3. Click "Create"
4. (Tùy chọn) Click "Restrict Key" để giới hạn quyền truy cập

## Bước 5: Cấu hình OAuth Consent Screen

1. Vào "APIs & Services" > "OAuth consent screen"
2. Chọn "External" và click "Create"
3. Điền thông tin:
   - App name: "PlanCraft Pomodoro"
   - User support email: Email của bạn
   - Developer contact information: Email của bạn
4. Click "Save and Continue"
5. Trong "Scopes", click "Add or Remove Scopes"
6. Tìm và chọn `https://www.googleapis.com/auth/drive.file`
7. Click "Save and Continue"
8. Trong "Test users", thêm email của bạn
9. Click "Save and Continue"

## Bước 6: Cập nhật mã nguồn

Trong file `src/main/resources/templates/stage-detail.html`, cập nhật các giá trị:

```javascript
const GOOGLE_DRIVE_API_KEY = 'YOUR_API_KEY_HERE';
const GOOGLE_DRIVE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

**Lưu ý:** 
- Thay `YOUR_API_KEY_HERE` bằng API Key từ Bước 4
- Thay `YOUR_CLIENT_ID_HERE` bằng Client ID từ Bước 3
- Không commit các giá trị này lên git (sử dụng environment variables trong production)

## Bước 7: Test

1. Khởi động ứng dụng Spring Boot
2. Truy cập trang stage-detail
3. Chọn chế độ lưu trữ "Google Drive"
4. Click "Đăng nhập Google Drive"
5. Đăng nhập với Google account
6. Cấp quyền truy cập Google Drive
7. Test upload file âm thanh

## Cấu hình Production

### 1. Domain và HTTPS
- Đảm bảo sử dụng HTTPS trong production
- Thêm domain production vào Authorized JavaScript origins
- Thêm domain production vào Authorized redirect URIs

### 2. OAuth Consent Screen
- Publish app nếu muốn cho phép tất cả user sử dụng
- Hoặc thêm email của user vào Test users

### 3. API Key Restrictions
- Giới hạn API Key chỉ cho Google Drive API
- Giới hạn domain sử dụng API Key

## Troubleshooting

Nếu gặp lỗi, hãy:
1. Kiểm tra file `GOOGLE_DRIVE_TROUBLESHOOTING.md`
2. Sử dụng nút Debug trong giao diện
3. Kiểm tra Developer Console (F12) để xem lỗi chi tiết

## Migration từ gapi cũ

PlanCraft đã được cập nhật để sử dụng Google Identity Services mới:
- ✅ Thay thế `gapi.auth2` bằng `google.accounts.oauth2`
- ✅ Sử dụng `fetch` API thay vì `gapi.client`
- ✅ Cải thiện error handling
- ✅ Hỗ trợ token revocation

## Tài liệu tham khảo

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration)

## Tính năng

### Lưu trữ âm thanh
- **LocalStorage**: Giới hạn 5MB, lưu trữ local
- **Google Drive**: Giới hạn 100MB, lưu trữ cloud

### Quản lý file
- Tự động tạo thư mục "PlanCraft Pomodoro Audio"
- Lưu trữ có tổ chức với tên file có timestamp
- Hỗ trợ xóa file từ Google Drive

### Bảo mật
- Chỉ truy cập file trong thư mục PlanCraft
- Quyền truy cập hạn chế (drive.file scope)
- Token tự động refresh

## Sử dụng

1. Chọn "Google Drive" trong phần Storage Options
2. Click "Đăng nhập Google Drive"
3. Chọn tài khoản Google và cấp quyền
4. Upload file âm thanh như bình thường
5. File sẽ được lưu lên Google Drive

## Lưu ý

- API Key và Client ID không nên commit lên git
- Sử dụng environment variables trong production
- Test kỹ trước khi deploy lên production
- Tuân thủ Google Drive API quotas và limits 