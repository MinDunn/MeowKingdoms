using System;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class Formation
    {
        // Đội hình 6 vị trí (Vị trí 0-2: Hàng trước, 3-5: Hàng sau)
        public CatHero[] TeamMembers = new CatHero[6];

        public void SetHero(int position, CatHero hero)
        {
            if (position >= 0 && position < 6)
            {
                TeamMembers[position] = hero;
                Console.WriteLine($"Đã xếp {hero.Name} vào vị trí số {position + 1}.");
            }
        }

        public float CalculateTotalPower()
        {
            float total = 0;
            foreach (var hero in TeamMembers)
            {
                if (hero != null)
                {
                    total += hero.Attack + (hero.HP / 10) + hero.Speed;
                }
            }
            return total;
        }
    }
}
