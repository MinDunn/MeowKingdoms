# 🐾 Meow Kingdoms: Pure Code Card-Engine & Suite

**Meow Kingdoms** là một hệ sinh thái trò chơi chiến thuật thẻ bài (Card Battle RPG) đỉnh cao, được xây dựng trên triết lý **Pure Code**. Dự án kết hợp sức mạnh của một Engine đồ họa tự tối ưu hóa và một Hệ quản trị dữ liệu thời gian thực chuyên nghiệp.

---

## ⚡ Triết lý Pure Code (Pure Code Philosophy)

Dự án này được phát triển với định hướng giảm thiểu sự phụ thuộc vào các engine cồng kềnh, tập trung vào hiệu năng thuần túy:
- **Custom Canvas Renderer**: Hệ thống vẽ đồ họa được viết tay bằng Canvas API & WebGL, đảm bảo độ mượt mà 60 FPS ngay cả trên các thiết bị cấu hình thấp.
- **Mathematical Animation**: Các hiệu ứng như 3D Tilt (nghiêng thẻ bài), Breathing Scale (hiệu ứng thở), và Particle VFX được tính toán trực tiếp bằng các công thức toán học hình học.
- **Engine-less Integration**: Toàn bộ logic trận đấu, hệ thống kỹ năng và State Machine được đóng gói trong JavaScript thuần, giúp giảm dung lượng tải trang xuống mức tối thiểu.

---

## 🏗️ Cấu trúc Hệ sinh thái

Dự án là sự giao thoa giữa nghệ thuật lập trình thuần túy và công nghệ Web hiện đại:

### 1. 🛡️ Core Game (The Pure Engine)
- **Renderer**: Bộ dựng hình tùy chỉnh hỗ trợ Elemental Aura và Afterimage effects.
- **Battle Logic**: Hệ thống đánh theo lượt 6v6 với logic tính toán sát thương thời gian thực.
- **UI Layer**: Giao diện Manga-style được tối ưu hóa bằng CSS Grid và Flexbox.

### 2. 🏰 Admin Dashboard (The Control Center)
- **Frontend**: Xây dựng trên **React 19 + Vite**, tối ưu cho trải nghiệm quản trị viên.
- **Database**: Tích hợp **Firebase (Firestore & Auth)** để quản lý dữ liệu vương quốc xuyên suốt.
- **Real-time Sync**: Mọi thay đổi về chỉ số Anh hùng hoặc Vật phẩm từ Admin sẽ được cập nhật trực tiếp vào Game ngay lập tức.

---

## 📂 Cấu trúc Thư mục

```text
/
├── src/                  # 🚀 CORE GAME ENGINE (Pure Code)
│   ├── main.js           # Khởi tạo vòng lặp Game (Game Loop)
│   ├── renderer.js       # Bộ vẽ đồ họa (Aura, Tilt, VFX) - Linh hồn của Game
│   └── data.js           # Quản lý hằng số, cấu trúc dữ liệu Anh hùng
├── admin/                # 🏰 ADMIN SUITE (React Dashboard)
│   ├── src/components/   # Module quản lý (Hero, Player, Artifact...)
│   ├── src/firebase.ts   # Cấu hình kết nối Backend
│   └── src/App.css       # Design System Manga độc quyền
├── assets/               # Tài nguyên hình ảnh và âm thanh
├── index.html            # Cổng vào chính của Game
└── README.md             # Tài liệu dự án
```

---

## 🌟 Tính năng Kỹ thuật Tiêu biểu

- **✨ High-Performance Rendering**: Tối ưu hóa draw calls trên Canvas để xử lý hàng chục thẻ bài cùng hiệu ứng Aura đồng thời.
- **🔮 Dynamic Data Mapping**: Hệ thống tự động ánh xạ dữ liệu từ Firestore vào các Class nhân vật trong game.
- **🛡️ Secure Admin Portal**: Hệ thống đăng nhập đa phương thức (Email/Google), hỗ trợ ghi nhớ phiên đăng nhập và bảo mật mật khẩu.
- **🎭 Manga Aesthetic**: Ngôn ngữ thiết kế dựa trên đường viền đậm (Heavy Borders) và màu sắc Pastel Vibrant, tạo cảm giác như một cuốn truyện tranh tương tác.

---

## 🚀 Hướng dẫn Khởi chạy

### Trải nghiệm Game:
Bạn chỉ cần mở `index.html` bằng trình duyệt web. Khuyến nghị sử dụng **Live Server** trên VS Code để có trải nghiệm tốt nhất.

### Quản trị hệ thống (Admin):
```bash
cd admin
npm install
npm run dev
```
Sau đó truy cập `http://localhost:5173`.

---

## 📝 Giấy phép (License)

Dự án được phát triển nhằm mục đích nghiên cứu kỹ thuật lập trình Web và đồ họa thuần. Vui lòng tôn trọng bản quyền hình ảnh và mã nguồn khi chia sẻ.

---

**🐱 Hãy cùng nhau xây dựng một Vương quốc Mèo thuần khiết, mạnh mẽ và đầy màu sắc! ⚔️🏰**
