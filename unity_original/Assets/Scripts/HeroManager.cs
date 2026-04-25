using UnityEngine;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class HeroManager : MonoBehaviour
    {
        public static HeroManager Instance;

        [Header("Collection")]
        public List<CatHero> allOwnedHeroes = new List<CatHero>();
        public List<CatHeroData> starterCatData; 

        [Header("Formation")]
        public CatHero[] currentFormation = new CatHero[6];

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                InitializeCollection();
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void InitializeCollection()
        {
            // 1. Thử nạp từ SaveManager
            if (SaveManager.Instance != null)
            {
                PlayerSaveData data = SaveManager.Instance.LoadGame();
                if (data != null && data.ownedHeroes.Count > 0)
                {
                    foreach (var entry in data.ownedHeroes)
                    {
                        // TODO: Bạn nên lưu CatHeroData trong thư mục "Resources" 
                        // để Resources.Load có thể tìm thấy chúng theo ID
                        CatHeroData heroData = Resources.Load<CatHeroData>($"Heroes/{entry.heroDataID}");
                        if (heroData != null)
                        {
                            CatHero restoredHero = new CatHero(heroData, entry.level);
                            restoredHero.BreakthroughLevel = entry.breakthroughLevel;
                            allOwnedHeroes.Add(restoredHero);
                        }
                    }
                    Debug.Log($"--- ĐÃ KHÔI PHỤC {allOwnedHeroes.Count} TƯỚNG ---");
                    return;
                }
            }

            // 2. Nếu không có Save, dùng 3 con mặc định
            if (starterCatData != null)
            {
                foreach (var data in starterCatData)
                {
                    allOwnedHeroes.Add(new CatHero(data, 1));
                }
            }
        }

        public void AssignToFormation(int slot, CatHero hero)
        {
            if (slot >= 0 && slot < 6)
            {
                currentFormation[slot] = hero;
                SaveManager.Instance.SaveGame(); // Tự động lưu sau khi đổi đội hình
            }
        }

        // Gọi hàm này sau khi nâng cấp tướng
        public void NotifyHeroChanged()
        {
            SaveManager.Instance.SaveGame();
        }
    }
}
