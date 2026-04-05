using UnityEngine;
using System.Collections;

namespace MeowKingdoms
{
    public class SkillVFXManager : MonoBehaviour
    {
        public static SkillVFXManager Instance;

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

        // --- KÍCH HOẠT HIỆU ỨNG TUYỆT CHIÊU (ULTIMATE) ---
        public void PlaySkillVFX(CatElement element, Vector3 targetPos)
        {
            StartCoroutine(ShowSpectacularEffect(element, targetPos));
        }

        private IEnumerator ShowSpectacularEffect(CatElement element, Vector3 pos)
        {
            // Trong thực tế, bạn sẽ dùng ParticleSystem. 
            // Ở đây tôi dùng code để giả lập các vụ nổ rực rỡ theo màu nguyên tố.
            Color effectColor = GetElementColor(element);
            
            // Giả lập vụ nổ bằng Flash sáng rực
            GameObject flash = new GameObject("SkillFlash");
            flash.transform.position = pos;
            SpriteRenderer sr = flash.AddComponent<SpriteRenderer>();
            
            // Tạo một sprite hình tròn ảo diệu (bạn có thể thay bằng Sprite vòng tròn ma pháp)
            sr.color = effectColor;
            sr.sortingOrder = 10;
            
            float elapsed = 0;
            while (elapsed < 0.5f)
            {
                float alpha = 1f - (elapsed / 0.5f);
                float scale = (elapsed / 0.5f) * 3f; // Nổ tung rộng ra
                sr.color = new Color(effectColor.r, effectColor.g, effectColor.b, alpha);
                flash.transform.localScale = new Vector3(scale, scale, 1f);
                
                elapsed += Time.deltaTime;
                yield return null;
            }

            Destroy(flash);
        }

        private Color GetElementColor(CatElement element)
        {
            switch (element)
            {
                case CatElement.Fire: return Color.red;
                case CatElement.Water: return Color.cyan;
                case CatElement.Wind: return Color.green;
                case CatElement.Lightning: return Color.yellow;
                case CatElement.Arcane: return new Color(1f, 0f, 1f); // Tím ma thuật
                default: return Color.white;
            }
        }
    }
}
