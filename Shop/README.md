# Shop - Online Shop Inventory System - auth, users, products, orders

## Yêu cầu
- Node.js 16+
- MongoDB (local) — bạn có thể dùng MongoDB Compass + local server

## Cấu hình
Mở file `.env` (đã có sẵn) và kiểm tra:
```
MONGO_URI=mongodb://localhost:27017/shopDB
JWT_SECRET=your_jwt_secret
PORT=5003
```

## Cài đặt & Chạy
```
npm install
npm run seed    # tạo dữ liệu mẫu (admin1/user1 : 123456)
npm run dev
```

## Tài khoản mẫu
- Admin: `admin1` / `123456`
- User: `user1` / `123456`

## Hướng dẫn test bằng Postman (cơ bản)
1. Đăng nhập:
   - POST `http://localhost:5003/auth/login`
   - Body (JSON): `{ "username": "admin1", "password": "123456" }`
   - Lấy token trả về và thêm header cho các request sau: `Authorization: Bearer <token>`

2. Các endpoint chính:
- Auth:
  - POST /auth/register
  - POST /auth/login

- Users (admin only):
  - GET /users
  - DELETE /users/:id

(Endpoints chi tiết khác nằm trong routes folder)
