# PlanCraftJavaWeb - Ứng dụng Quản lý Mục tiêu Cá nhân

## Giới thiệu
PlanCraftJavaWeb là ứng dụng web giúp người dùng thiết lập, chia nhỏ và quản lý mục tiêu cá nhân một cách khoa học. Người dùng có thể tạo mục tiêu, chia nhỏ thành các giai đoạn, thiết lập nhiệm vụ cụ thể cho từng giai đoạn và theo dõi tiến độ hoàn thành.

## Tính năng chính
- Đăng ký, đăng nhập tài khoản người dùng
- Thiết lập mục tiêu cá nhân (tên mục tiêu, deadline, lý do chọn mục tiêu...)
- Chia nhỏ mục tiêu thành nhiều giai đoạn
- Thiết lập nhiệm vụ cụ thể cho từng giai đoạn
- Đánh dấu hoàn thành nhiệm vụ, giai đoạn, mục tiêu
- Theo dõi tiến độ thực hiện mục tiêu

## Hướng dẫn cài đặt
1. Clone project về máy
2. Cài đặt Java 17, Maven, MySQL
3. Cấu hình database trong `src/main/resources/application.properties`
4. Chạy lệnh `mvn spring-boot:run` hoặc chạy file jar
5. Truy cập `http://localhost:8080` trên trình duyệt

## Hướng dẫn sử dụng
1. Đăng ký tài khoản và đăng nhập
2. Thiết lập mục tiêu cá nhân ở trang chủ
3. Chia nhỏ mục tiêu thành các giai đoạn, thiết lập nhiệm vụ cho từng giai đoạn
4. Đánh dấu hoàn thành từng nhiệm vụ khi thực hiện
5. Theo dõi tiến độ mục tiêu của bạn

## Công nghệ sử dụng
- Spring Boot, Spring Data JPA, Thymeleaf
- MySQL
- HTML, CSS, JavaScript

## Đóng góp
Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất tính năng mới vui lòng tạo issue hoặc pull request. 