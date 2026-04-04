using UnityEngine;

namespace MeowKingdoms
{
    public enum EquipmentSlot
    {
        Helmet, Armor, Pants, Shoes, Bracers, Necklace, Mount, DivineWeapon
    }

    [CreateAssetMenu(fileName = "NewEquipment", menuName = "MeowKingdoms/Equipment Data")]
    public class EquipmentData : ScriptableObject
    {
        public string itemName;
        public EquipmentSlot slot;
        public int setID; // Dùng để kích hoạt Set Bonus (3 món cùng bộ)
        
        [Header("Base Stats")]
        public float hpBonus;
        public float attackBonus;
        public float physDefBonus;
        public float magDefBonus;
        public float speedBonus;

        [Header("Percent Stats (%)")]
        public float critRateBonus;
        public float dodgeBonus;
        public float damageReducBonus;

        [Header("Divine Weapon Special (Thần Khí)")]
        public bool isDivineWeapon;
        public Sprite evolutionSprite; // Hình ảnh tướng khi cầm thần khí này
        public GameObject skillVFXPrefab; // Hiệu ứng kỹ năng thay đổi
    }
}
