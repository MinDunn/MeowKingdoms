using UnityEngine;

namespace MeowKingdoms
{
    public class EquipmentSystem : MonoBehaviour
    {
        public const int MAX_EQUIP_LEVEL = 300;

        // Cường hóa trang bị (Tăng chỉ số cộng thẳng)
        public bool EnhanceEquipment(EquipmentData item)
        {
            // Trong thực tế, bạn sẽ cần lưu Level vào từng vật phẩm
            // Để đơn giản, tôi giả lập việc kiểm tra tài nguyên
            int silverCost = 500;
            int stoneCost = 10;

            if (ResourceManager.Instance.silverBalance >= silverCost && 
                ResourceManager.Instance.enhanceStones >= stoneCost)
            {
                ResourceManager.Instance.silverBalance -= silverCost;
                ResourceManager.Instance.enhanceStones -= stoneCost;
                
                Debug.Log($"Đã Cường Hóa {item.itemName} (+1)!");
                return true;
            }

            Debug.Log("Không đủ Bạc hoặc Đá Cường Hóa!");
            return false;
        }

        // Tôi luyện trang bị (Tăng chỉ số ẩn %)
        public bool TemperEquipment(EquipmentData item)
        {
            int stoneCost = 5;

            if (ResourceManager.Instance.temperingStones >= stoneCost)
            {
                ResourceManager.Instance.temperingStones -= stoneCost;
                Debug.Log($"Đã Tôi Luyện {item.itemName}! Chỉ số ẩn % tăng lên.");
                return true;
            }

            Debug.Log("Không đủ Đá Tôi Luyện!");
            return false;
        }

        // Đúc trang bị (Nâng phẩm chất/Nâng sao)
        public bool SmithingEquipment(EquipmentData item)
        {
            int stoneCost = 1;

            if (ResourceManager.Instance.smithingStones >= stoneCost)
            {
                ResourceManager.Instance.smithingStones -= stoneCost;
                Debug.Log($"Đã Đúc lại {item.itemName}! Phẩm chất trang bị đã đạt tầm cao mới.");
                return true;
            }

            Debug.Log("Không đủ Đá Đúc!");
            return false;
        }
    }
}
