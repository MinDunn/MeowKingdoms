using UnityEngine;

namespace MeowKingdoms
{
    public class InputManager : MonoBehaviour
    {
        public static InputManager Instance;

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

        // Kiểm tra xem người dùng có đang nhấn/chạm không
        public bool IsPointerDown()
        {
#if UNITY_ANDROID || UNITY_IOS
            return Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began;
#else
            return Input.GetMouseButtonDown(0);
#endif
        }

        // Lấy tọa độ điểm nhấn/chạm
        public Vector3 GetPointerPosition()
        {
#if UNITY_ANDROID || UNITY_IOS
            if (Input.touchCount > 0)
                return Input.GetTouch(0).position;
            return Vector3.zero;
#else
            return Input.mousePosition;
#endif
        }

        // Lấy tọa độ quy đổi sang không gian Game 2D (World Space)
        public Vector3 GetWorldPointerPosition()
        {
            Vector3 screenPos = GetPointerPosition();
            return Camera.main.ScreenToWorldPoint(new Vector3(screenPos.x, screenPos.y, 10f));
        }
    }
}
