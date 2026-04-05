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
        public int BreakthroughLevel { get; set; } = 0;

        // --- Cổng tương thích cho code cũ ---
        public float Attack => Math.Max(PhysAttack, MagAttack);
        public float HP => MaxHP;
        public bool CanLevelUp() => Level < MAX_LEVEL;

        // Trang bị 8 Slot (Helmet, Armor, Pants, Shoes, Bracers, Necklace, Mount, DivineWeapon)
        public Dictionary<EquipmentSlot, EquipmentData> equippedItems = new Dictionary<EquipmentSlot, EquipmentData>();

        // --- CÁC CHỈ SỐ CƠ BẢN (10% SCALING) ---
        public float MaxHP => (Data.baseHP * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.hpBonus);
        public float PhysAttack => (Data.basePhysATK * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.attackBonus);
        public float MagAttack => (Data.baseMagATK * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.attackBonus);
        public float PhysDef => (Data.basePhysDef * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.physDefBonus);
        public float MagDef => (Data.baseMagDef * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.magDefBonus);
        public float Speed => (Data.baseSpeed * (1f + 0.1f * (Level - 1))) + GetEquipBonus(s => s.speedBonus);

        // --- CÁC CHỈ SỐ NÂNG CAO (1% SCALING) ---
        public float CritRate => Data.baseCritRate + (0.01f * (Level - 1)) + GetEquipBonus(s => s.critRateBonus);
        public float CritDamage => Data.baseCritDamage + (0.01f * (Level - 1));
        public float DodgeRate => Data.baseDodge + (0.01f * (Level - 1)) + GetEquipBonus(s => s.dodgeBonus);
        public float Accuracy => Data.baseAccuracy + (0.01f * (Level - 1));
        public float PhysPierce => Data.basePhysPierce + (0.01f * (Level - 1));
        public float MagPierce => Data.baseMagPierce + (0.01f * (Level - 1));
        public float LifeSteal => Data.baseLifeSteal + (0.01f * (Level - 1));
        public float DamageReduction => Data.baseDamageReduc + (0.01f * (Level - 1)) + GetEquipBonus(s => s.damageReducBonus);

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
            foreach (var item in equippedItems.Values) { if (item != null) total += statSelector(item); }
            return total;
        }

        public Sprite GetCurrentSprite()
        {
            if (equippedItems.ContainsKey(EquipmentSlot.DivineWeapon))
            {
                var divine = equippedItems[EquipmentSlot.DivineWeapon];
                if (divine.evolutionSprite != null) return divine.evolutionSprite;
            }
            return Data.portrait;
        }

        public void Upgrade()
        {
            if (Level < MAX_LEVEL) { Level++; CurrentHP = MaxHP; SaveManager.Instance.SaveGame(); }
        }

        public void OnAttack() { AddRage(2); }
        public void OnTakeDamage(float damage) { CurrentHP -= damage; AddRage(1); }
        private void AddRage(int amount) { CurrentRage = Math.Min(4, CurrentRage + amount); }
        public bool CanUseSkill() => CurrentRage >= 4;
        public void UseSkill() { if (CanUseSkill()) { CurrentRage = 0; } }
    }
}
