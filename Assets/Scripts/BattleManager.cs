using System;
using System.Collections.Generic;
using System.Linq;

namespace MeowKingdoms
{
    public class BattleManager
    {
        public void Battle6v6(Formation playerTeam, Formation enemyTeam)
        {
            Console.WriteLine("\n--- ⚔️ TRẬN CHIẾN SIÊU CẤP 6vs6 BẮT ĐẦU ⚔️ ---");
            
            // Lấy danh sách tất cả mèo trên sân
            List<CatHero> allFighters = new List<CatHero>();
            allFighters.AddRange(playerTeam.TeamMembers.Where(h => h != null));
            allFighters.AddRange(enemyTeam.TeamMembers.Where(h => h != null));

            // Sắp xếp lượt đánh dựa trên Tốc độ (Speed) giảm dần
            var turnOrder = allFighters.OrderByDescending(h => h.Speed).ToList();

            Console.WriteLine("\n[Thứ tự lượt đánh dựa trên Tốc độ]:");
            foreach (var hero in turnOrder)
            {
                Console.WriteLine($"- {hero.Name} (Tốc độ: {hero.Speed})");
            }

            // Giả lập 1 hiệp đánh mẫu
            Console.WriteLine("\n--- Hiệp 1 ---");
            foreach (var hero in turnOrder)
            {
                if (hero.HP > 0)
                {
                    Console.WriteLine($"[{hero.Name}] tung chiêu cào cấu!");
                }
            }
        }
    }
}
