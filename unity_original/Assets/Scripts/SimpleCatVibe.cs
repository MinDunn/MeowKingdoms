using UnityEngine;

namespace MeowKingdoms
{
    /// <summary>
    /// Hoạt ảnh co giãn tự động bằng Code 100%
    /// KHÔNG CẦN gắn xương, KHÔNG CẦN Skinning Editor.
    /// Dành cho các bạn muốn tối giản thao tác tay.
    /// </summary>
    public class SimpleCatVibe : MonoBehaviour
    {
        [Header("Cấu hình")]
        public float speed = 2.0f;          // Tốc độ nhún nhảy
        public float intensity = 0.05f;     // Độ co giãn (thở)
        public float tiltAngle = 3.0f;      // Độ nghiêng lắc lư
        public bool syncWithMusic = false;  // (Mở rộng sau này)

        private Vector3 baseScale;
        private Quaternion baseRotation;

        void Start()
        {
            baseScale = transform.localScale;
            baseRotation = transform.localRotation;
        }

        void Update()
        {
            float wave = Mathf.Sin(Time.time * speed);
            
            // 1. Tạo hiệu ứng Squash & Stretch (Co giãn nhịp nhàng)
            // Khi cao lên thì hẹp lại, khi lùn đi thì phình ra -> tạo cảm giác sinh động
            float squash = 1.0f + (wave * intensity);
            float stretch = 1.0f - (wave * intensity * 0.5f);
            
            transform.localScale = new Vector3(baseScale.x * stretch, baseScale.y * squash, baseScale.z);

            // 2. Tạo hiệu ứng nghiêng trái phải nhẹ nhàng như đang nhảy theo nhạc
            float tilt = Mathf.Sin(Time.time * speed * 0.5f) * tiltAngle;
            transform.localRotation = baseRotation * Quaternion.Euler(0, 0, tilt);
        }
    }
}
