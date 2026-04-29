using UnityEngine;
using Firebase;
using Firebase.Firestore;
using Firebase.Extensions;
using System.Collections.Generic;
using System;

namespace MeowKingdoms
{
    public class FirebaseManager : MonoBehaviour
    {
        public static FirebaseManager Instance { get; private set; }
        
        public FirebaseFirestore db;
        public bool isInitialized = false;

        // Sự kiện báo hiệu đã lấy xong data
        public Action OnFirebaseInitialized;
        public Action<List<FirestoreHero>> OnHeroesLoaded;

        public List<FirestoreHero> cachedHeroes = new List<FirestoreHero>();

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject); // Giữ FirebaseManager xuyên suốt các Scene
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            InitializeFirebase();
        }

        private void InitializeFirebase()
        {
            Debug.Log("Đang kiểm tra dependencies của Firebase...");
            FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
            {
                var dependencyStatus = task.Result;
                if (dependencyStatus == DependencyStatus.Available)
                {
                    // Khởi tạo thành công
                    db = FirebaseFirestore.DefaultInstance;
                    isInitialized = true;
                    Debug.Log("<color=green>🔥 Firebase Initialized Successfully!</color>");
                    
                    OnFirebaseInitialized?.Invoke();

                    // Tự động kéo dữ liệu tướng ngay sau khi khởi tạo
                    FetchAllHeroes();
                }
                else
                {
                    Debug.LogError($"Lỗi không thể nạp Firebase dependencies: {dependencyStatus}");
                }
            });
        }

        public void FetchAllHeroes()
        {
            if (!isInitialized || db == null) return;

            Debug.Log("☁️ Đang tải danh sách tướng từ Firestore...");

            db.Collection("heroes").GetSnapshotAsync().ContinueWithOnMainThread(task =>
            {
                if (task.IsFaulted)
                {
                    Debug.LogError("Lỗi khi tải dữ liệu heroes: " + task.Exception);
                    return;
                }

                QuerySnapshot snapshot = task.Result;
                cachedHeroes.Clear();

                foreach (DocumentSnapshot doc in snapshot.Documents)
                {
                    FirestoreHero hero = doc.ConvertTo<FirestoreHero>();
                    if (hero != null)
                    {
                        hero.id = doc.Id; // Tự gán ID từ document NoSQL
                        cachedHeroes.Add(hero);
                    }
                }

                Debug.Log($"<color=cyan>✅ Đã tải xong {cachedHeroes.Count} tướng từ Firebase Admin!</color>");
                OnHeroesLoaded?.Invoke(cachedHeroes);
            });
        }
    }
}
