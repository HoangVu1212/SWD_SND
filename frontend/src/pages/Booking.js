import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Modal } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { type, name } = location.state || {};

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("online");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [balance, setBalance] = useState(0);

  // 🧾 Lấy giá healer và số dư người dùng
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "healer") {
          const res = await api.get(`/healers/${id}`);
          setPrice(res.data.pricePerHour || 0);
        }
        const wallet = await api.get("/wallet/me");
        setBalance(wallet.data.balance || 0);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin:", err);
      }
    };
    fetchData();
  }, [id, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "healer") setShowConfirm(true);
    else handleBooking(); // bác sĩ thì không cần xác nhận thanh toán
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Vui lòng đăng nhập trước khi đặt lịch!");

      const res = await api.post(
        "/appointments",
        { targetId: id, type, date, time, mode, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Đặt lịch thành công!");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi đặt lịch");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="text-center text-success mb-4">📅 Đặt lịch hẹn</h3>
        <p className="text-center text-muted mb-4">
          Bạn đang đặt lịch với <strong>{name}</strong> (
          {type === "doctor" ? "Chuyên gia" : "Healer"})
        </p>

        {type === "healer" && (
          <div className="alert alert-info text-center">
            💰 Giá mỗi buổi: <strong>{price.toLocaleString()}đ/giờ</strong> <br />
            Số dư hiện tại: <strong>{balance.toLocaleString()}đ</strong>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Chọn ngày</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chọn giờ</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hình thức</Form.Label>
            <Form.Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="online">Online (qua Zoom/Google Meet)</option>
              <option value="offline">Trực tiếp (tại văn phòng)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú thêm</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Mô tả ngắn về vấn đề bạn muốn chia sẻ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Xác nhận đặt lịch
          </Button>
        </Form>
      </Card>

      {/* 🪙 Popup xác nhận thanh toán */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đặt lịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn sắp đặt lịch với healer <strong>{name}</strong>.
            <br />
            Phí dịch vụ:{" "}
            <strong className="text-success">
              {price.toLocaleString()}đ/giờ
            </strong>
          </p>
          {balance < price ? (
            <div className="alert alert-danger">
              ❌ Số dư hiện tại không đủ để đặt lịch.
              <br />
              Vui lòng <strong>nạp thêm tiền</strong> trước khi tiếp tục.
            </div>
          ) : (
            <div className="alert alert-info">
              Số dư sau khi trừ:{" "}
              <strong>{(balance - price).toLocaleString()}đ</strong>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            Hủy
          </Button>
          <Button
            variant="success"
            disabled={balance < price}
            onClick={handleBooking}
          >
            Xác nhận và thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
