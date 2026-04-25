using System;
using System.Collections.Generic;
using UnityEngine;

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
                Debug.Log($"Đã xếp {hero.Name} vào vị trí số {position + 1}.");
            }
        }

        public float CalculateTotalPower()
        {
            float total = 0;
            foreach (var hero in TeamMembers)
            {
                if (hero != null)
                {
                    // Đã sửa HP thành MaxHP để khớp với CatHero.cs
                    total += hero.Attack + (hero.MaxHP / 10) + hero.Speed;
                }
            }
            return total;
        }
    }
}
