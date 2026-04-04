using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class BattleUnit2D : MonoBehaviour
    {
        public bool isPlayerTeam;
        public CatHero Hero { get; private set; }
        
        [Header("Components")]
        public SpriteRenderer spriteRenderer;
        public Transform healthBarPivot; 
        
        private Vector3 originalPos;
        private Coroutine flashCoroutine;
        
        // Cấu hình màu sắc theo nguyên tố
        private Dictionary<CatElement, Color> elementColors = new Dictionary<CatElement, Color>()
        {
            { CatElement.Fire, Color.red },
            { CatElement.Water, Color.cyan },
            { CatElement.Wind, Color.green },
            { CatElement.Lightning, Color.yellow },
            { CatElement.Earth, new Color(0.6f, 0.4f, 0.2f) }, // Màu nâu đất
            { CatElement.Light, Color.white },
            { CatElement.Dark, new Color(0.3f, 0f, 0.5f) },   // Màu tím tối
            { CatElement.Arcane, new Color(1f, 0f, 1f) }      // Màu hồng cánh sen/tím sáng
        };

        public void Initialize(CatHero hero, bool isPlayer)
        {
            this.Hero = hero;
            this.isPlayerTeam = isPlayer;
            this.originalPos = transform.position;
            
            if (hero.Data.portrait != null)
                spriteRenderer.sprite = hero.Data.portrait;
            
            spriteRenderer.flipX = !isPlayer;
            SetSizeByRole(hero.Role);
        }

        private void Update()
        {
            // --- CƠ CHẾ PHÁT SÁNG THEO MÀU NGUYÊN TỐ ---
            if (Hero != null && Hero.CanUseSkill())
            {
                // Nếu đủ 4 nộ, làm cho Sprite nhấp nháy hào quang rực rỡ
                float pulse = 0.5f + Mathf.PingPong(Time.time * 2f, 0.5f);
                Color elementColor = elementColors[Hero.Element];
                spriteRenderer.color = elementColor * pulse; 
                
                // Nếu bạn dùng URP 2D, màu này sẽ kết hợp với Bloom để phát sáng cực đẹp
            }
            else
            {
                // Trở về màu trắng bình thường nếu chưa đủ nộ
                if (spriteRenderer.color != Color.white && (flashCoroutine == null))
                {
                    spriteRenderer.color = Color.white;
                }
            }
        }

        private void SetSizeByRole(CatRole role)
        {
            float scale = 1.0f;
            switch (role)
            {
                case CatRole.Tank: scale = 1.3f; break;
                case CatRole.Brawler: scale = 1.15f; break;
                case CatRole.Assassin: scale = 0.85f; break;
                case CatRole.Marksman: scale = 1.0f; break;
                case CatRole.Mage: scale = 1.0f; break;
                case CatRole.Support: scale = 0.95f; break;
            }
            transform.localScale = new Vector3(scale, scale, 1f);
        }

        public void TakeDamageEffect()
        {
            if (flashCoroutine != null) StopCoroutine(flashCoroutine);
            flashCoroutine = StartCoroutine(FlashRed());
        }

        private IEnumerator FlashRed()
        {
            spriteRenderer.color = Color.red;
            yield return new WaitForSeconds(0.1f);
            spriteRenderer.color = Color.white;
            flashCoroutine = null;
        }

        public IEnumerator AttackAnimation(BattleUnit2D target)
        {
            Vector3 targetDir = (target.transform.position - transform.position).normalized;
            transform.position += targetDir * 0.5f;
            yield return new WaitForSeconds(0.15f);
            transform.position = originalPos;
        }
    }
}
