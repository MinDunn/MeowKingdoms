using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeowKingdoms
{
    [Serializable]
    public class HeroSaveEntry
    {
        public string heroDataID; // Tên file CatHeroData (Dùng làm ID)
        public int level;
        public int breakthroughLevel;
        // Danh sách ID trang bị (nếu có)
        public List<string> equippedItemIDs = new List<string>();
    }

    [Serializable]
    public class PlayerSaveData
    {
        [Header("Economy")]
        public int silver;
        public int universalStones;
        public List<int> elementalStonesCount = new List<int>(); // Lưu số lượng 8 loại đá
        
        [Header("Collection")]
        public List<HeroSaveEntry> ownedHeroes = new List<HeroSaveEntry>();
        public List<string> formationHeroIDs = new List<string>(); // Danh sách 6 vị trí
    }
}
