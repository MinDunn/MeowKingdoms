using UnityEngine;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class ResourceManager : MonoBehaviour
    {
        public static ResourceManager Instance;

        [Header("Currencies")]
        public int silverBalance = 1000;

        [Header("Materials")]
        public int universalStones = 5;
        public int enhanceStones = 10;
        public int temperingStones = 5;
        public int smithingStones = 1;
        
        public Dictionary<CatElement, int> elementalStones = new Dictionary<CatElement, int>();

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                InitializeResources();
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void InitializeResources()
        {
            // 1. Khởi tạo rỗng trước
            foreach (CatElement element in System.Enum.GetValues(typeof(CatElement)))
                elementalStones[element] = 0;

            // 2. Thử nạp từ SaveManager
            if (SaveManager.Instance != null)
            {
                PlayerSaveData data = SaveManager.Instance.LoadGame();
                if (data != null)
                {
                    silverBalance = data.silver;
                    universalStones = data.universalStones;
                    // Nạp lại 8 loại đá
                    int i = 0;
                    foreach (CatElement element in System.Enum.GetValues(typeof(CatElement)))
                    {
                        if (i < data.elementalStonesCount.Count)
                            elementalStones[element] = data.elementalStonesCount[i];
                        i++;
                    }
                    Debug.Log("--- ĐÃ KHÔI PHỤC TÀI SẢN TỪ FILE LƯU ---");
                    return;
                }
            }

            // 3. Nếu không có Save, dùng mặc định
            Debug.Log("--- CHÀO MỪNG NGƯỜI CHƠI MỚI! DÙNG TÀI SẢN MẶC ĐỊNH ---");
            foreach (CatElement element in System.Enum.GetValues(typeof(CatElement)))
                elementalStones[element] = 2;
        }

        public bool HasEnoughResources(int silverReq, CatElement element, int stoneReq)
        {
            if (silverBalance < silverReq) return false;
            return (elementalStones[element] + universalStones) >= stoneReq;
        }

        public void ConsumeUpgradeResources(int silverReq, CatElement element, int stoneReq)
        {
            silverBalance -= silverReq;
            int currentSpecific = elementalStones[element];
            if (currentSpecific >= stoneReq) elementalStones[element] -= stoneReq;
            else { universalStones -= (stoneReq - currentSpecific); elementalStones[element] = 0; }

            // TỰ ĐỘNG LƯU SAU KHI TIÊU TIỀN
            SaveManager.Instance.SaveGame();
        }

        public void AddSilver(int amount) { silverBalance += amount; SaveManager.Instance.SaveGame(); }
    }
}
