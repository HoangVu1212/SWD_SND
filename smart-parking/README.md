npm i
npm install express mongoose bcryptjs jsonwebtoken dotenv cors morgan cookie-parser method-override --save-dev nodemon
node seed.js
npm start

Đăng ký tài khoản (Register) :
POST : http://localhost:5000/auth/register 
Body (JSON) :
{
  "username": "driver1",
  "password": "123456"
}

Đăng nhập (Login) : 
POST : http://localhost:5000/auth/login 
Body (JSON) :
{
  "username": "admin1",
  "password": "123456"
}
Nhận lại token JWT :
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "admin"
}


Lấy danh sách tất cả người dùng (Admin):
GET : http://localhost:5000/users 

Xóa người dùng (Admin):
DELETE : http://localhost:5000/users/:id  


Tạo bãi đỗ xe (Admin):
POST : http://localhost:5000/parking-lots
Body (JSON):
{
  "name": "Bai xe 1",
  "location": "1 Nguyen Hue",
  "totalSlots": 100,
  "availableSlots": 100,
  "pricePerHour": 200000
}


Tất cả bãi đỗ xe (All Parking Lots):
GET : http://localhost:5000/parking-lots



Đăng nhập (Login) : 
POST : http://localhost:5000/auth/login 
Body (JSON) :
{
  "username": "user1",
  "password": "123456"
}

Tất cả bãi đỗ xe (All Parking Lots):
GET : http://localhost:5000/parking-lots


Đặt vé đỗ xe (Driver) :
POST : http://localhost:5000/tickets
Body (JSON) :
{
  "parkingLotId": "690d6172fe4e2bfebc9d3282",
  "startTime": "2025-07-01T08:00:00",
  "durationHours": 2
}
Kết thúc phiên đỗ (End Ticket)
PATCH : http://localhost:5000/tickets/:id/end


Danh sách tất cả vé (Tickets):
GET : http://localhost:5000/tickets

Tìm vé theo ngày (Search Tickets by Date) : 
GET : http://localhost:5000/tickets/search/date?start=2025-07-01&end=2025-07-31
