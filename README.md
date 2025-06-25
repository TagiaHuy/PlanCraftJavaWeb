# PlanCraft - Ứng dụng Quản lý Mục tiêu Cá nhân

PlanCraft là một ứng dụng web hiện đại giúp người dùng quản lý và theo dõi tiến độ các mục tiêu cá nhân một cách hiệu quả. Ứng dụng được xây dựng với Spring Boot và Thymeleaf, kết hợp với thiết kế UI/UX hiện đại.

## 🎨 Thiết kế UI/UX Mới

### ✨ Tính năng thiết kế

- **Modern Design System**: Sử dụng CSS Variables với bảng màu hiện đại
- **Responsive Layout**: Tương thích hoàn hảo với mọi thiết bị
- **Card-based Design**: Thay thế bảng truyền thống bằng card layout
- **Interactive Elements**: Hiệu ứng hover, animation mượt mà
- **Better Visual Hierarchy**: Cấu trúc thông tin rõ ràng, dễ đọc
- **Accessibility**: Thiết kế thân thiện với người dùng khuyết tật

### 🎯 Bảng màu

```css
Primary: #6366f1 (Indigo)
Secondary: #10b981 (Emerald)
Accent: #f59e0b (Amber)
Danger: #ef4444 (Red)
Warning: #f97316 (Orange)
```

### 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🚀 Tính năng chính

### 👤 Quản lý người dùng
- Đăng ký và đăng nhập an toàn
- Quản lý thông tin cá nhân
- Phân quyền người dùng

### 🎯 Quản lý mục tiêu
- Tạo và chỉnh sửa mục tiêu
- Thiết lập deadline và mô tả
- Theo dõi tiến độ trực quan
- Phân loại trạng thái (Chưa bắt đầu, Đang thực hiện, Hoàn thành)

### 📋 Quản lý giai đoạn
- Chia nhỏ mục tiêu thành các giai đoạn
- Thiết lập thời gian cho từng giai đoạn
- Theo dõi tiến độ chi tiết

### 📊 Dashboard thông minh
- Thống kê tổng quan
- Biểu đồ tiến độ trực quan
- Cảnh báo deadline
- Tổng quan nhanh các mục tiêu

## 🛠️ Công nghệ sử dụng

### Backend
- **Spring Boot 3.x**: Framework chính
- **Spring Security**: Bảo mật và xác thực
- **Spring Data JPA**: Truy cập dữ liệu
- **H2 Database**: Cơ sở dữ liệu (có thể thay đổi)
- **Thymeleaf**: Template engine

### Frontend
- **HTML5**: Cấu trúc trang
- **CSS3**: Styling với CSS Variables
- **JavaScript (ES6+)**: Tương tác người dùng
- **Font Awesome**: Icons
- **Google Fonts (Inter)**: Typography

### Design System
- **CSS Variables**: Quản lý theme
- **Flexbox & Grid**: Layout hiện đại
- **CSS Animations**: Hiệu ứng mượt mà
- **Mobile-first**: Responsive design

## 📁 Cấu trúc dự án

```
PlanCraftJavaWeb/
├── src/main/
│   ├── java/com/example/PlanCraftJavaWeb/
│   │   ├── controller/          # Controllers
│   │   ├── entity/             # JPA Entities
│   │   ├── repository/         # Data Access Layer
│   │   └── service/            # Business Logic
│   └── resources/
│       ├── static/
│       │   ├── css/
│       │   │   └── style.css   # Modern CSS Design System
│       │   └── js/
│       │       └── user.js     # Interactive JavaScript
│       └── templates/          # Thymeleaf Templates
│           ├── dashboard.html  # Modern Dashboard
│           ├── login.html      # Beautiful Login Form
│           ├── register.html   # User Registration
│           ├── goal-*.html     # Goal Management
│           ├── stage-*.html    # Stage Management
│           └── users.html      # User Management
├── docs/                       # Documentation
└── README.md
```

## 🎨 Thiết kế UI/UX chi tiết

### 1. Navigation Bar
- **Sticky Navigation**: Luôn hiển thị khi scroll
- **Brand Logo**: Icon rocket với tên PlanCraft
- **Active States**: Highlight trang hiện tại
- **Responsive Menu**: Ẩn menu trên mobile

### 2. Dashboard
- **Hero Section**: Header với gradient background
- **Stats Cards**: Thống kê tổng quan với icons
- **Goal Cards**: Hiển thị mục tiêu dạng card
- **Progress Bars**: Thanh tiến độ trực quan
- **Empty States**: Hướng dẫn khi chưa có dữ liệu

### 3. Forms
- **Modern Inputs**: Styling hiện đại với focus states
- **Validation**: Hiển thị lỗi rõ ràng
- **Loading States**: Spinner khi submit
- **Tips Section**: Hướng dẫn người dùng

### 4. Tables
- **Clean Design**: Bảng sạch sẽ, dễ đọc
- **Hover Effects**: Highlight khi hover
- **Action Buttons**: Nút hành động rõ ràng
- **Responsive**: Scroll ngang trên mobile

### 5. Cards
- **Shadow Effects**: Depth và hierarchy
- **Hover Animations**: Transform và shadow
- **Status Indicators**: Màu sắc cho trạng thái
- **Interactive**: Click để xem chi tiết

## 🚀 Cách chạy ứng dụng

### Yêu cầu hệ thống
- Java 17+
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Cài đặt và chạy

1. **Clone repository**
```bash
git clone <repository-url>
cd PlanCraftJavaWeb
```

2. **Chạy ứng dụng**
```bash
./mvnw spring-boot:run
```

3. **Truy cập ứng dụng**
```
http://localhost:8081
```

### Tài khoản mặc định
- **Username**: admin
- **Password**: admin

## 📱 Responsive Design

### Desktop (1200px+)
- Layout 3 cột cho stats
- Sidebar navigation
- Hover effects đầy đủ

### Tablet (768px - 1199px)
- Layout 2 cột cho stats
- Compact navigation
- Touch-friendly buttons

### Mobile (320px - 767px)
- Layout 1 cột
- Hamburger menu
- Swipe gestures
- Optimized forms

## 🎯 Cải tiến UI/UX

### Đã thực hiện
- ✅ Modern design system với CSS variables
- ✅ Responsive layout cho mọi thiết bị
- ✅ Card-based design thay thế bảng
- ✅ Interactive animations và transitions
- ✅ Better visual hierarchy
- ✅ Accessibility improvements
- ✅ Loading states và feedback
- ✅ Empty states với hướng dẫn

### Kế hoạch phát triển
- 🔄 Dark mode theme
- 🔄 Advanced animations
- 🔄 Drag & drop functionality
- 🔄 Real-time notifications
- 🔄 Advanced filtering và search
- 🔄 Export/import data
- 🔄 Mobile app (React Native)

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: contact@plancraft.com
- **Website**: https://plancraft.com
- **GitHub**: https://github.com/plancraft

---

**PlanCraft** - Biến mục tiêu thành hiện thực! 🚀 