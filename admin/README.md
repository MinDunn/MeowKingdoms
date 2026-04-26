# 🏰 Meow Admin Suite: Manga-Style Control Center

Hệ quản trị dữ liệu (Admin Dashboard) dành riêng cho dự án **Meow Kingdoms**, được thiết kế để quản lý toàn bộ hệ sinh thái game một cách trực quan, nhanh chóng và đậm chất Manga.

---

## 🌟 Tính năng chính

- **📊 Dashboard**: Thống kê tổng quan tình hình vương quốc (Người chơi, Anh hùng, Trang bị...).
- **👥 Player Management**: Quản lý thần dân, kiểm tra tài chính, cấp độ và xử lý vi phạm (Ban/Unban).
- **🐱 Hero & Tribe Builder**: Cấu hình chi tiết chỉ số và hệ tộc tương khắc của các chiến binh mèo.
- **🛡️ Item & Artifact Shop**: Quản lý kho trang bị, thần binh và linh thú hộ mệnh.
- **💰 Financial System**: Điều chỉnh các loại tiền tệ (Vàng, Kim cương) và vật phẩm tiêu hao.
- **🎨 Custom Manga UI**: Giao diện độc quyền với hiệu ứng hoạt họa mượt mà và màu sắc rực rỡ.

---

## 🛠️ Công nghệ sử dụng

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database/Auth**: [Firebase](https://firebase.google.com/)
- **Styling**: Vanilla CSS (Custom Design System)

---

## 🚀 Hướng dẫn Cài đặt

1. **Cài đặt các gói phụ thuộc**:
   ```bash
   npm install
   ```
2. **Cấu hình Firebase**:
   Cập nhật thông tin Firebase của bạn trong file `src/firebase.ts`.

3. **Chạy ứng dụng (Development)**:
   ```bash
   npm run dev
   ```
4. **Build sản phẩm (Production)**:
   ```bash
   npm run build
   ```

---

## 📁 Cấu trúc Thư mục (Admin)

- `src/components/`: Chứa các module quản lý riêng biệt cho từng tính năng.
- `src/types.ts`: Định nghĩa các Interface dữ liệu dùng chung toàn hệ thống.
- `src/firebase.ts`: Cầu nối giao tiếp với cơ sở dữ liệu Firestore.
- `src/App.css`: Toàn bộ linh hồn giao diện (Manga Design Tokens).

---

## 🔐 Quyền truy cập

Hệ thống chỉ cho phép các tài khoản có Email được cấp quyền `admin` trong Firestore truy cập vào các tính năng quản trị cấp cao.

---

**🐾 Developed with passion for Meow Kingdoms.**
