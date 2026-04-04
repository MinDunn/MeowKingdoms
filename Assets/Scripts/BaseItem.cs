using System;

namespace MeowKingdoms
{
    public enum ItemType { Weapon, Armor, Mount }

    public class BaseItem
    {
        public string ItemName { get; set; }
        public ItemType Type { get; set; }
        public float AttackBonus { get; set; }
        public float SpeedBonus { get; set; }
        public float HPBonus { get; set; }

        public BaseItem(string name, ItemType type, float atk, float spd, float hp)
        {
            ItemName = name;
            Type = type;
            AttackBonus = atk;
            SpeedBonus = spd;
            HPBonus = hp;
        }
    }
}
