using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeowKingdoms
{
    public class CatHero
    {
        public const int MAX_LEVEL = 150;
        public CatHeroData Data { get; private set; }
        
        public float CurrentHP { get; set; }
        public int CurrentRage { get; private set; } 
        public int Level { get; private set; } = 1;
        public int BreakthroughLevel { get; set; } = 0; // Bậc Đột phá (+0, +1, +2...)

        // --- HỆ THỐNG TRANG BỊ 8 SLOT ---
        public Dictionary<EquipmentSlot, EquipmentData> equippedItems = new Dictionary<EquipmentSlot, EquipmentData>();

        // --- TÍNH TOÁN CHỈ SỐ TỔNG (Cơ bản + Nâng cao + Trang bị) ---
        public float MaxHP => (Data.baseHP * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.hpBonus);
        public float Attack => (Data.baseAttack * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.attackBonus);
        public float Speed => (Data.baseSpeed * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.speedBonus);
        
        // Chỉ số % (Tăng 1% mỗi cấp + Trang bị)
        public float CritRate => 0.05f + (0.01f * Level) + GetEquipBonus(s => s.critRateBonus);
        public float DodgeRate => 0.05f + (0.01f * Level) + GetEquipBonus(s => s.dodgeBonus);

        public string Name => Data.heroName;
        public CatElement Element => Data.element;
        public CatRole Role => Data.role;

        public CatHero(CatHeroData data, int level = 1)
        {
            Data = data;
            Level = level;
            CurrentHP = MaxHP;
            CurrentRage = 0;
        }

        private float GetEquipBonus(Func<EquipmentData, float> statSelector)
        {
            float total = 0;
            foreach (var item in equippedItems.Values)
            {
                if (item != null) total += statSelector(item);
            }
            return total;
        }

        // --- HỆ THỐNG TIẾN HÓA NGOẠI HÌNH (THẦN KHÍ) ---
        public Sprite GetCurrentSprite()
        {
            // Nếu có Thần khí và Thần khí đó có Sprite tiến hóa
            if (equippedItems.ContainsKey(EquipmentSlot.DivineWeapon))
            {
                var divine = equippedItems[EquipmentSlot.DivineWeapon];
                if (divine.evolutionSprite != null) return divine.evolutionSprite;
            }
            return Data.portrait; // Trở về Sprite gốc
        }

        // --- HỆ THỐNG KỸ NĂNG (MỞ KHÓA THEO ĐỘT PHÁ) ---
        public void Upgrade()
        {
            if (CanLevelUp())
            {
                int silverCost = Level * 100;
                int stoneCost = 1 + (Level / 10);
                ResourceManager.Instance.ConsumeUpgradeResources(silverCost, Element, stoneCost);
                Level++;
                CurrentHP = MaxHP;
                Debug.Log($"{Name} đã đạt cấp {Level}!");
            }
        }

        public bool CanLevelUp() => Level < MAX_LEVEL;

        public void OnAttack() { AddRage(2); }
        public void OnTakeDamage(float damage) { CurrentHP -= damage; AddRage(1); }
        private void AddRage(int amount) { CurrentRage = Math.Min(4, CurrentRage + amount); }
        public bool CanUseSkill() => CurrentRage >= 4;
        public void UseSkill() { if (CanUseSkill()) { CurrentRage = 0; } }
    }
}
