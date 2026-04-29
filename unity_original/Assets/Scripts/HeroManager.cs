using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using System;

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

        // Sự kiện báo hiệu đã load xong hero từ mạng
        public Action OnFirebaseCollectionReady;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            // Lắng nghe sự kiện từ Firebase
            if (FirebaseManager.Instance != null)
            {
                FirebaseManager.Instance.OnHeroesLoaded += HandleHeroesLoadedFromFirebase;
                
                // Nếu Firebase đã load xong trước cả khi HeroManager Start (hiếm gặp nhưng cẩn thận)
                if (FirebaseManager.Instance.cachedHeroes.Count > 0)
                {
                    HandleHeroesLoadedFromFirebase(FirebaseManager.Instance.cachedHeroes);
                }
            }
            else
            {
                Debug.LogWarning("Không tìm thấy FirebaseManager, đang chuyển về chế độ Offline...");
                InitializeCollectionOffline();
            }
        }

        private void OnDestroy()
        {
            if (FirebaseManager.Instance != null)
            {
                FirebaseManager.Instance.OnHeroesLoaded -= HandleHeroesLoadedFromFirebase;
            }
        }

        // --- HÀM MỚI: NHẬN DỮ LIỆU TỪ FIREBASE ---
        private void HandleHeroesLoadedFromFirebase(List<FirestoreHero> firestoreHeroes)
        {
            allOwnedHeroes.Clear();

            // MÔ PHỎNG: Coi như người chơi sở hữu tất cả các tướng trên Admin (trong thực tế sẽ lưu danh sách sở hữu riêng)
            foreach (var fHero in firestoreHeroes)
            {
                // Chuyển đổi FirestoreHero sang CatHeroData (ScriptableObject)
                CatHeroData dynamicData = ScriptableObject.CreateInstance<CatHeroData>();
                dynamicData.name = fHero.id; // Dùng làm ID nội bộ
                dynamicData.heroName = fHero.name;
                dynamicData.baseHP = fHero.hp;
                dynamicData.basePhysATK = fHero.pAtk;
                dynamicData.baseMagATK = fHero.mAtk;
                dynamicData.basePhysDef = fHero.pDef;
                dynamicData.baseMagDef = fHero.mDef;
                dynamicData.baseSpeed = fHero.speed;
                
                // Phân tích Enum (bỏ qua lỗi nếu sai chính tả)
                if (Enum.TryParse(fHero.elementName, true, out CatElement element)) dynamicData.element = element;
                if (Enum.TryParse(fHero.roleName, true, out CatRole role)) dynamicData.role = role;

                // Load hình ảnh tạm từ Resources (đề phòng mạng lag)
                dynamicData.portrait = Resources.Load<Sprite>($"Heroes/{fHero.id}");

                // TẢI HÌNH ẢNH THẬT TỪ FIREBASE / INTERNET
                if (!string.IsNullOrEmpty(fHero.avatar))
                {
                    StartCoroutine(DownloadImage(fHero.avatar, dynamicData));
                }

                // Tạo thực thể CatHero
                CatHero newHero = new CatHero(dynamicData, 1);
                allOwnedHeroes.Add(newHero);
            }

            Debug.Log($"<color=yellow>Đã chuyển đổi thành công {allOwnedHeroes.Count} tướng từ Firebase sang Game Logic!</color>");
            OnFirebaseCollectionReady?.Invoke();

            // Tự động nhét 6 con đầu tiên vào đội hình để test
            for (int i = 0; i < Math.Min(6, allOwnedHeroes.Count); i++)
            {
                AssignToFormation(i, allOwnedHeroes[i]);
            }
        }

        // --- HÀM TẢI ẢNH TỪ MẠNG ---
        private IEnumerator DownloadImage(string url, CatHeroData dataToUpdate)
        {
            using (UnityWebRequest uwr = UnityWebRequestTexture.GetTexture(url))
            {
                yield return uwr.SendWebRequest();

                if (uwr.result == UnityWebRequest.Result.Success)
                {
                    Texture2D texture = DownloadHandlerTexture.GetContent(uwr);
                    if (texture != null)
                    {
                        // Tạo Sprite từ Texture tải về
                        Sprite webSprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
                        dataToUpdate.portrait = webSprite;
                        Debug.Log($"<color=cyan>🖼️ Đã tải xong ảnh đại diện cho: {dataToUpdate.heroName}</color>");
                    }
                }
                else
                {
                    Debug.LogWarning($"Không thể tải ảnh cho {dataToUpdate.heroName}. Lỗi: {uwr.error}");
                }
            }
        }

        // --- HÀM CŨ: FALLBACK OFFLINE ---
        private void InitializeCollectionOffline()
        {
            if (SaveManager.Instance != null)
            {
                PlayerSaveData data = SaveManager.Instance.LoadGame();
                if (data != null && data.ownedHeroes.Count > 0)
                {
                    foreach (var entry in data.ownedHeroes)
                    {
                        CatHeroData heroData = Resources.Load<CatHeroData>($"Heroes/{entry.heroDataID}");
                        if (heroData != null)
                        {
                            CatHero restoredHero = new CatHero(heroData, entry.level);
                            restoredHero.BreakthroughLevel = entry.breakthroughLevel;
                            allOwnedHeroes.Add(restoredHero);
                        }
                    }
                    Debug.Log($"--- ĐÃ KHÔI PHỤC {allOwnedHeroes.Count} TƯỚNG OFFLINE ---");
                    return;
                }
            }

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
                if (SaveManager.Instance != null) SaveManager.Instance.SaveGame(); 
            }
        }

        public void NotifyHeroChanged()
        {
            if (SaveManager.Instance != null) SaveManager.Instance.SaveGame();
        }
    }
}
