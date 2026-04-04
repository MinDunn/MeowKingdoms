using System.IO;
using UnityEngine;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance;
        private string saveFilePath;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                saveFilePath = Path.Combine(Application.persistentDataPath, "meow_save.json");
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        // --- HÀM LƯU DỮ LIỆU ---
        public void SaveGame()
        {
            PlayerSaveData data = new PlayerSaveData();

            // 1. Lấy dữ liệu từ ResourceManager
            data.silver = ResourceManager.Instance.silverBalance;
            data.universalStones = ResourceManager.Instance.universalStones;
            foreach (var stone in ResourceManager.Instance.elementalStones.Values)
                data.elementalStonesCount.Add(stone);

            // 2. Lấy dữ liệu từ HeroManager
            foreach (var hero in HeroManager.Instance.allOwnedHeroes)
            {
                HeroSaveEntry entry = new HeroSaveEntry();
                entry.heroDataID = hero.Data.name; // Dùng tên file data làm ID
                entry.level = hero.Level;
                entry.breakthroughLevel = hero.BreakthroughLevel;
                data.ownedHeroes.Add(entry);
            }

            // 3. Chuyển sang JSON và lưu
            string json = JsonUtility.ToJson(data, true);
            File.WriteAllText(saveFilePath, json);
            Debug.Log($"ĐÃ LƯU GAME TẠI: {saveFilePath}");
        }

        // --- HÀM NẠP DỮ LIỆU ---
        public PlayerSaveData LoadGame()
        {
            if (File.Exists(saveFilePath))
            {
                string json = File.ReadAllText(saveFilePath);
                return JsonUtility.FromJson<PlayerSaveData>(json);
            }
            return null; // Chưa có file lưu
        }

        // --- HÀM XÓA DỮ LIỆU (RESET GAME) ---
        public void DeleteSave()
        {
            if (File.Exists(saveFilePath))
            {
                File.Delete(saveFilePath);
                Debug.Log("ĐÃ XÓA DỮ LIỆU LƯU TRỮ. KHỞI ĐỘNG LẠI GAME ĐỂ RESET.");
            }
        }
    }
}
