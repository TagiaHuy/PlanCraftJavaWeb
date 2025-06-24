# Thiết kế dữ liệu (Data Model)

## 1. User
- id: Long (PK)
- username: String
- email: String
- password: String

## 2. Goal (Mục tiêu)
- id: Long (PK)
- user_id: Long (FK -> User)
- name: String
- deadline: Date
- reason: String
- description: String
- status: String (chưa bắt đầu/đang thực hiện/hoàn thành)

## 3. Stage (Giai đoạn)
- id: Long (PK)
- goal_id: Long (FK -> Goal)
- name: String
- description: String
- start_date: Date
- end_date: Date
- status: String (chưa bắt đầu/đang thực hiện/hoàn thành)

## 4. Task (Nhiệm vụ)
- id: Long (PK)
- stage_id: Long (FK -> Stage)
- name: String
- description: String
- status: String (chưa làm/đang làm/hoàn thành)

## Mối quan hệ
- Một User có nhiều Goal
- Một Goal có nhiều Stage
- Một Stage có nhiều Task 