# Hướng dẫn thiết lập Google Drive API cho PlanCraft

## Tổng quan
PlanCraft hỗ trợ lưu trữ âm thanh tùy chỉnh trên Google Drive thay vì LocalStorage, cho phép lưu trữ file lớn hơn (tối đa 100MB) và truy cập từ nhiều thiết bị.

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
   - `http://localhost:8080` (cho development)
   - `https://yourdomain.com` (cho production)
6. Thêm Authorized redirect URIs:
   - `http://localhost:8080`
   - `https://yourdomain.com`
7. Click "Create"

## Bước 4: Tạo API Key

1. Trong "Credentials", click "Create Credentials" > "API Key"
2. Copy API Key được tạo

## Bước 5: Cập nhật mã nguồn

Trong file `src/main/resources/templates/stage-detail.html`, thay thế các giá trị sau:

```javascript
const GOOGLE_DRIVE_API_KEY = 'YOUR_API_KEY'; // Thay bằng API Key của bạn
const GOOGLE_DRIVE_CLIENT_ID = 'YOUR_CLIENT_ID'; // Thay bằng Client ID của bạn
```

## Bước 6: Cấu hình OAuth Consent Screen

1. Vào "APIs & Services" > "OAuth consent screen"
2. Chọn "External" và click "Create"
3. Điền thông tin:
   - App name: "PlanCraft Pomodoro"
   - User support email: email của bạn
   - Developer contact information: email của bạn
4. Thêm scope: `https://www.googleapis.com/auth/drive.file`
5. Thêm test users (email của bạn)
6. Click "Save and Continue"

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

## Troubleshooting

### Lỗi "Google Drive API chưa được khởi tạo"
- Kiểm tra API Key và Client ID đã đúng chưa
- Đảm bảo Google Drive API đã được bật

### Lỗi "Đăng nhập Google Drive thất bại"
- Kiểm tra OAuth consent screen đã được cấu hình
- Đảm bảo domain đã được thêm vào Authorized origins

### Lỗi "Upload failed"
- Kiểm tra quyền truy cập Google Drive
- Đảm bảo file không quá lớn (tối đa 100MB)

## Lưu ý

- API Key và Client ID không nên commit lên git
- Sử dụng environment variables trong production
- Test kỹ trước khi deploy lên production
- Tuân thủ Google Drive API quotas và limits 