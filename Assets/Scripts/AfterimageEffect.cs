using UnityEngine;

namespace MeowKingdoms
{
    public class AfterimageEffect : MonoBehaviour
    {
        private SpriteRenderer sr;
        private float lifeTime = 0.5f;
        private float timer;
        private Color startColor;

        public void Initialize(Sprite sprite, Vector3 pos, Quaternion rot, Vector3 scale, bool flipX, Color color)
        {
            sr = gameObject.AddComponent<SpriteRenderer>();
            sr.sprite = sprite;
            sr.flipX = flipX;
            sr.sortingOrder = 9; // Thấp hơn mèo chính một chút
            
            transform.position = pos;
            transform.rotation = rot;
            transform.localScale = scale;
            
            startColor = color;
            startColor.a = 0.6f; // Bắt đầu với độ mờ 60%
            sr.color = startColor;
            
            timer = lifeTime;
        }

        private void Update()
        {
            timer -= Time.deltaTime;
            if (timer <= 0)
            {
                Destroy(gameObject);
                return;
            }

            // Hiệu ứng mờ dần theo thời gian
            float alpha = timer / lifeTime;
            sr.color = new Color(startColor.r, startColor.g, startColor.b, alpha * 0.4f);
        }
    }
}
