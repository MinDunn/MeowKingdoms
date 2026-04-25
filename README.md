# 🐾 Meow Kingdoms: Đại Chiến Mèo Chiêu Tài

**Meow Kingdoms** là một dự án game chiến thuật nhập vai (RPG) đánh theo lượt (Turn-based Strategy) 6v6 được phát triển trên nền tảng **Unity**. Lấy cảm hứng từ các tựa game chiến thuật thẻ tướng cổ điển, trò chơi đưa người chơi vào một thế giới nơi các chiến binh mèo dũng cảm cùng nhau chiến đấu để bảo vệ vương quốc.

---

## 🌟 Tính Năng Nổi Bật

- **Chiến Thuật 6v6 Sâu Sắc**: Xây dựng đội hình linh hoạt với 6 vị trí chiến lược, tối ưu hóa sự phối hợp giữa các anh hùng.
- **Hệ Thống Nguyên Tố Đa Dạng**: 10 hệ nguyên tố tương khắc (Hỏa, Thủy, Băng, Phong, Lôi, Thổ, Mộc, Quang, Ám, Bí Thuật).
- **Vai Trò Anh Hùng Rõ Rệt**: Chia thành các vai trò chuyên biệt: Tank (Đỡ đòn), Brawler (Đấu sĩ), Assassin (Sát thủ), Marksman (Xạ thủ), Mage (Pháp sư) và Support (Hỗ trợ).
- **Kỹ Năng Hợp Kích (Combo Skill)**: Kích hoạt những đòn đánh đặc biệt khi có sự kết hợp của các anh hùng cụ thể trong đội hình.
- **Kiến Trúc Card-First**: Tập trung vào trải nghiệm thẻ bài cao cấp với hiệu ứng 3D Tilt, Breathing Scale và Elemental Aura rực rỡ.
- **Hiệu Ứng Hình Ảnh Hoành Tráng**: Hệ thống Visual FX, hiệu ứng Afterimage (bóng mờ) và Ultimate Presentation chuyên nghiệp.
- **Hệ Thống Trang Bị & Thú Cưỡi**: Nâng tầm sức mạnh anh hùng thông qua các bộ trang bị và linh thú.

---

- **Kiến trúc**: Pure Code (Canvas API + WebGL)
- **Ngôn ngữ**: JavaScript (ES6+)
- **Tính năng kỹ thuật**:
    - Hệ thống Rendering dựa trên toán học (Breathing, 3D Tilt).
    - Quản lý dữ liệu tập trung qua `src/data.js`.
    - UI Layer bằng HTML5 & CSS3 cao cấp.

---

## 📂 Cấu Trúc Dự Án (Pure Code Edition)

```text
/
├── index.html          # Entry point chính
├── style.css           # UI và hiệu ứng giao diện
├── src/
│   ├── main.js         # Vòng lặp game và điều khiển
│   ├── renderer.js     # Hệ thống vẽ đồ họa (Aura, Tilt, VFX)
│   └── data.js         # Dữ liệu anh hùng và kỹ năng
└── unity_original/     # Lưu trữ các tài nguyên Unity cũ (Dự phòng)
```

---

## 🚀 Hướng Dẫn Cài Đặt

1. **Yêu cầu**: Cài đặt [Unity Hub](https://unity.com/download) và phiên bản Unity phù hợp.
2. **Clone dự án**:
   ```bash
   git clone https://github.com/your-username/MeowKingdoms.git
   ```
3. **Mở dự án**: Mở Unity Hub -> Add -> Chọn thư mục `MeowKingdoms`.
4. **Chạy thử**: Mở Scene `BattleScene` trong thư mục `Assets/Scenes` và nhấn **Play**.

---

## 🎮 Cách Chơi

1. **Sắp xếp đội hình**: Chọn 6 anh hùng mèo vào các vị trí trong Formation.
2. **Kích hoạt kỹ năng**: Các anh hùng sẽ tự động đánh theo tốc độ (Speed). Tích lũy năng lượng để tung ra kỹ năng nộ (Ultimate).
3. **Chiến thắng**: Tiêu diệt toàn bộ đội hình đối phương để giành thắng lợi và nhận tài nguyên nâng cấp.

---

## 📝 Giấy Phép (License)

Dự án này được phát triển cho mục đích học tập và chia sẻ cộng đồng. 
Vui lòng liên hệ tác giả nếu bạn muốn sử dụng tài nguyên hình ảnh trong game.

---

**Chúc bạn có những giây phút trải nghiệm tuyệt vời cùng Meow Kingdoms! 🐱⚔️**
