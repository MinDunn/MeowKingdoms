# 🐾 Meow Kingdoms: Đại Chiến Mèo Chiêu Tài

**Meow Kingdoms** là một dự án game chiến thuật nhập vai (RPG) đánh theo lượt (Turn-based Strategy) 6v6 được phát triển trên nền tảng **Unity**. Lấy cảm hứng từ các tựa game chiến thuật thẻ tướng cổ điển, trò chơi đưa người chơi vào một thế giới nơi các chiến binh mèo dũng cảm cùng nhau chiến đấu để bảo vệ vương quốc.

---

## 🌟 Tính Năng Nổi Bật

- **Chiến Thuật 6v6 Sâu Sắc**: Xây dựng đội hình linh hoạt với 6 vị trí chiến lược, tối ưu hóa sự phối hợp giữa các anh hùng.
- **Hệ Thống Nguyên Tố Đa Dạng**: 8 hệ nguyên tố tương khắc (Hỏa, Thủy, Phong, Lôi, Thổ, Quang, Ám, Bí Thuật).
- **Vai Trò Anh Hùng Rõ Rệt**: Chia thành các vai trò chuyên biệt: Tank (Đỡ đòn), Brawler (Đấu sĩ), Assassin (Sát thủ), Marksman (Xạ thủ), Mage (Pháp sư) và Support (Hỗ trợ).
- **Kỹ Năng Hợp Kích (Combo Skill)**: Kích hoạt những đòn đánh đặc biệt khi có sự kết hợp của các anh hùng cụ thể trong đội hình.
- **Hiệu Ứng Hình Ảnh Hoành Tráng**: Hệ thống Visual FX, hiệu ứng Afterimage (bóng mờ) và Ultimate Presentation chuyên nghiệp.
- **Hệ Thống Trang Bị & Thú Cưỡi**: Nâng tầm sức mạnh anh hùng thông qua các bộ trang bị và linh thú.

---

## 🛠️ Công Nghệ Sử Dụng

- **Engine**: Unity 2022.3+ (Dự kiến)
- **Ngôn ngữ**: C#
- **Kiến trúc**: Data-driven (Sử dụng ScriptableObjects để quản lý dữ liệu anh hùng và kỹ năng).
- **Tính năng kỹ thuật**:
    - Hệ thống tính toán sát thương đa chỉ số (Crit, Dodge, Pierce, Lifesteal).
    - Quản lý trạng thái trận đấu (Battle State Machine).
    - Hệ thống lưu trữ dữ liệu (Save/Load system) an toàn.

---

## 📂 Cấu Trúc Dự Án

```text
Assets/Scripts/
├── Battle/             # Logic điều khiển trận đấu (BattleManager, BattleUnit2D)
├── Heroes/             # Dữ liệu và logic anh hùng (CatHero, CatHeroData)
├── Skills/             # Hệ thống kỹ năng và hiệu ứng (ComboSkill, SkillVFXManager)
├── Equipment/          # Hệ thống trang bị (EquipmentSystem, EquipmentData)
├── UI/                 # Giao diện người dùng (HealthBarUI, HeroDetailPanel)
└── Core/               # Các lớp quản lý chung (SaveManager, AudioManager, ResourceManager)
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
