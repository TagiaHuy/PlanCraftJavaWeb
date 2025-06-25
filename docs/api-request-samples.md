# Ví dụ Request Body cho API

## 1. Tạo Goal (Mục tiêu)
**POST** `/api/goals`
```json
{
  "user": { "id": 1 },
  "name": "Học tiếng Anh giao tiếp",
  "deadline": "2024-12-31",
  "reason": "Cần giao tiếp tốt để đi du học",
  "description": "Luyện nghe nói mỗi ngày, tham gia câu lạc bộ tiếng Anh",
  "status": "chưa bắt đầu"
}
```

## 2. Tạo Stage (Giai đoạn)
**POST** `/api/stages`
```json
{
  "goal": { "id": 1 },
  "name": "Giai đoạn 1: Luyện nghe",
  "description": "Nghe podcast, xem video tiếng Anh",
  "startDate": "2024-08-01",
  "endDate": "2024-09-15",
  "status": "chưa bắt đầu"
}
```

## 3. Tạo Task (Nhiệm vụ)
**POST** `/api/tasks`
```json
{
  "stage": { "id": 1 },
  "name": "Nghe 1 podcast mỗi ngày",
  "description": "Chọn podcast phù hợp trình độ, nghe và ghi chú lại",
  "status": "chưa làm"
}
```

> Lưu ý: Thay `id` của user, goal, stage cho phù hợp với dữ liệu thực tế trong hệ thống. 