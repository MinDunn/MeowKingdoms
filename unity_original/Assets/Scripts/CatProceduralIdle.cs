using UnityEngine;

namespace MeowKingdoms
{
    /// <summary>
    /// Chuyển động Idle tự động bằng code (Procedural Animation)
    /// Giúp nhân vật mèo "sống động" mà không cần làm Animation tay.
    /// </summary>
    public class CatProceduralIdle : MonoBehaviour
    {
        [Header("Cấu hình xương")]
        [Tooltip("Xương thân chính để tạo nhịp thở (lên xuống)")]
        public Transform bodyBone;
        [Tooltip("Xương đầu để tạo nhịp gật gù")]
        public Transform headBone;
        [Tooltip("Xương vũ khí (búa/khiên) để tạo độ rung")]
        public Transform weaponBone;
        [Tooltip("Xương đuôi để tạo độ vẫy")]
        public Transform tailBone;

        [Header("Thông số chuyển động")]
        public float speed = 2.0f;          // Tốc độ nhanh chậm
        public float breatheIntensity = 0.05f; // Độ mạnh của nhịp thở (lên xuống)
        public float tiltIntensity = 2.0f;    // Độ nghiêng của đầu/vũ khí

        private Vector3 startBodyPos;
        private Quaternion startHeadRot;
        private Quaternion startWeaponRot;
        private Quaternion startTailRot;

        void Start()
        {
            // TỰ ĐỘNG TÌM XƯƠNG: Nếu bạn chưa kéo thả, script sẽ tự tìm theo tên
            // Bạn có thể chỉnh lại số thứ tự xương ở đây cho đúng với nhân vật
            if (bodyBone == null) bodyBone = FindBoneRecursive(transform, "bone_1");
            if (headBone == null) headBone = FindBoneRecursive(transform, "bone_2");
            if (weaponBone == null) weaponBone = FindBoneRecursive(transform, "bone_3");
            if (tailBone == null) tailBone = FindBoneRecursive(transform, "bone_15");

            // Lưu lại vị trí/góc xoay ban đầu làm mốc
            if (bodyBone) startBodyPos = bodyBone.localPosition;
            if (headBone) startHeadRot = headBone.localRotation;
            if (weaponBone) startWeaponRot = weaponBone.localRotation;
            if (tailBone) startTailRot = tailBone.localRotation;
        }

        private Transform FindBoneRecursive(Transform parent, string boneName)
        {
            foreach (Transform child in parent)
            {
                if (child.name == boneName) return child;
                Transform found = FindBoneRecursive(child, boneName);
                if (found != null) return found;
            }
            return null;
        }

        void Update()
        {
            // Sử dụng hàm Sin để tạo sự lặp lại mượt mà
            float wave = Mathf.Sin(Time.time * speed);
            float offset = wave * breatheIntensity;

            // 1. Nhịp thở cho thân
            if (bodyBone)
            {
                bodyBone.localPosition = startBodyPos + new Vector3(0, offset, 0);
            }

            // 2. Gật gù đầu
            if (headBone)
            {
                float headTilt = wave * tiltIntensity;
                headBone.localRotation = startHeadRot * Quaternion.Euler(0, 0, headTilt);
            }

            // 3. Rung rinh vũ khí (sử dụng Cos để lệch nhịp một chút cho tự nhiên)
            if (weaponBone)
            {
                float weaponWave = Mathf.Cos(Time.time * speed * 1.2f);
                float weaponTilt = weaponWave * (tiltIntensity * 1.5f);
                weaponBone.localRotation = startWeaponRot * Quaternion.Euler(0, 0, weaponTilt);
            }

            // 4. Vẫy đuôi (tự động)
            if (tailBone)
            {
                float tailWave = Mathf.Sin(Time.time * speed * 0.8f);
                float tailTilt = tailWave * (tiltIntensity * 3.0f);
            }
        }
    }
}
