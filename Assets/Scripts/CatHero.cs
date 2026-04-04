using System;
using System.Collections.Generic;

namespace MeowKingdoms
{
    // 5 Nguyên tố cơ bản
    public enum CatElement { Fire, Water, Wind, Lightning, Earth }
    
    // Vai trò của mèo
    public enum CatRole { Tank, DPS, Support, Healer }

    public class CatHero
    {
        public string Name { get; set; }
        public CatElement Element { get; set; }
        public CatRole Role { get; set; }
        
        // Chỉ số cơ bản
        public int Level { get; set; } = 1;
        public float HP { get; set; }
        public float Attack { get; set; }
        public float Speed { get; set; } // Quyết định lượt đánh
        
        // Ô Trang bị
        public string Weapon { get; set; }
        public string Armor { get; set; }
        public string Mount { get; set; } // Thú cưỡi

        public CatHero(string name, CatElement element, CatRole role, float hp, float atk, float spd)
        {
            Name = name;
            Element = element;
            Role = role;
            HP = hp;
            Attack = atk;
            Speed = spd;
        }

        // Hàm nâng cấp tướng - Tăng cả tấn công, HP và TỐC ĐỘ
        public void LevelUp()
        {
            Level++;
            HP += 50;
            Attack += 10;
            Speed += 2; // Tốc độ tăng dần theo cấp độ như bạn muốn
            Console.WriteLine($"{Name} đã lên cấp {Level}! Chỉ số Tốc độ hiện tại: {Speed}");
        }
    }
}
