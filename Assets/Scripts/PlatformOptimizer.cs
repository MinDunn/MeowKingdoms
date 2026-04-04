using UnityEngine;

namespace MeowKingdoms
{
    public class PlatformOptimizer : MonoBehaviour
    {
        public static PlatformOptimizer Instance;

        [Header("Mobile Settings")]
        public int targetFPSMobile = 60;
        public bool sleepDisabled = true;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                OptimizeForPlatform();
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void OptimizeForPlatform()
        {
            // 1. ÉP HƯỚNG MÀN HÌNH NẰM NGANG (Landscape)
            Screen.orientation = ScreenOrientation.LandscapeLeft;
            
            // 2. NGĂN TẮT MÀN HÌNH KHI ĐANG CHƠI (Chế độ Mobile)
            if (sleepDisabled)
                Screen.sleepTimeout = SleepTimeout.NeverSleep;

            // 3. TỐI ƯU FPS
#if UNITY_ANDROID || UNITY_IOS
            Application.targetFrameRate = targetFPSMobile;
            Debug.Log($"Đã tối ưu cho Mobile: {targetFPSMobile} FPS");
#else
            Application.targetFrameRate = -1; // PC: Không giới hạn FPS
            Debug.Log("Đã tối ưu cho PC: FPS không giới hạn");
#endif
        }

        // Hàm giúp bạn chuyển hướng nhanh nếu cần (ví dụ: LandscapeRight)
        public void SetOrientation(ScreenOrientation orientation)
        {
            Screen.orientation = orientation;
        }
    }
}
