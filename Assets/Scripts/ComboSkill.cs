using System;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class ComboSkill
    {
        public string ComboName { get; set; }
        public List<string> RequiredHeros { get; set; } // Danh sách tên mèo cần thiết
        public float BonusDamage { get; set; }

        public ComboSkill(string name, List<string> heros, float bonus)
        {
            ComboName = name;
            RequiredHeros = heros;
            BonusDamage = bonus;
        }

        // Kiểm tra xem đội hình có đủ người để kích hoạt không
        public bool CanActivate(List<CatHero> currentTeam)
        {
            foreach (var req in RequiredHeros)
            {
                if (!currentTeam.Exists(h => h != null && h.Name == req)) return false;
            }
            return true;
        }

        public void Execute()
        {
            Console.WriteLine($"🔥 KÍCH HOẠT HỢP KÍCH: {ComboName}! Sát thương hủy diệt!");
        }
    }
}
