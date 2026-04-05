using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class BattleUnit2D : MonoBehaviour
    {
        public bool isPlayerTeam;
        public CatHero Hero { get; private set; }
        
        [Header("Modular Visuals (Phase M restored)")]
        public SpriteRenderer baseCatRenderer;
        public SpriteRenderer helmetRenderer;
        public SpriteRenderer armorRenderer;
        public SpriteRenderer weaponRenderer;
        public SpriteRenderer circleAura;
        public SpriteRenderer blinkRenderer;

        private Vector3 startPosition;
        private Coroutine flashCoroutine;
        private Coroutine shakeCoroutine;
        private bool isAnimating = false;

        // Bảng màu hào quang hệ
        private Dictionary<CatElement, Color> elementColors = new Dictionary<CatElement, Color>()
        {
            { CatElement.Fire, Color.red }, { CatElement.Water, Color.cyan },
            { CatElement.Wind, Color.green }, { CatElement.Lightning, Color.yellow },
            { CatElement.Arcane, new Color(1f, 0f, 1f) }
        };

        public void Initialize(CatHero hero, bool isPlayer)
        {
            this.Hero = hero;
            this.isPlayerTeam = isPlayer;
            this.startPosition = transform.position;
            
            UpdateModularVisuals();
            UpdateAuraStatus();
            
            // THIẾT LẬP HƯỚNG NHÌN & KÍCH THƯỚC TRIỆT ĐỂ
            RefreshScale();
            
            StartCoroutine(IdleLoop());
            StartCoroutine(BlinkLoop());
        }

        private void RefreshScale()
        {
            // ÉP HƯỚNG NHÌN: 1 là Phải, -1 là Trái
            float lookDir = isPlayerTeam ? 1f : -1f;
            float baseS = 0.55f; // Tăng nhẹ kích thước cơ bản
            
            if (Hero != null) {
                if (Hero.Role == CatRole.Tank) baseS = 0.75f; // Tank to oai phong
                else if (Hero.Role == CatRole.Assassin) baseS = 0.5f; // Sát thủ gọn gàng
            }

            // Cách 1: Lật bằng Scale của cha
            transform.localScale = new Vector3(lookDir * baseS, baseS, 1f);

            // Cách 2: Lật bằng FlipX của Sprite (Dự phòng triệt để)
            bool shouldFlip = !isPlayerTeam; // Địch thì flip = true
            if (baseCatRenderer != null) baseCatRenderer.flipX = shouldFlip;
            if (helmetRenderer != null) helmetRenderer.flipX = shouldFlip;
            if (armorRenderer != null) armorRenderer.flipX = shouldFlip;
            if (weaponRenderer != null) weaponRenderer.flipX = shouldFlip;
            if (blinkRenderer != null) blinkRenderer.flipX = shouldFlip;
        }


        private IEnumerator IdleLoop()
        {
            while (true)
            {
                if (!isAnimating)
                {
                    float bob = Mathf.Sin(Time.time * 2f) * 0.05f;
                    float squash = 1f - (bob * 0.5f);
                    baseCatRenderer.transform.localScale = new Vector3(1f + bob, squash, 1f);
                    baseCatRenderer.transform.localPosition = new Vector3(0, bob * 0.5f, 0);
                }
                yield return null;
            }
        }

        private IEnumerator BlinkLoop()
        {
            while (true)
            {
                yield return new WaitForSeconds(UnityEngine.Random.Range(2f, 5f));
                if (blinkRenderer != null)
                {
                    blinkRenderer.gameObject.SetActive(true);
                    yield return new WaitForSeconds(0.15f);
                    blinkRenderer.gameObject.SetActive(false);
                }
            }
        }

        public void UpdateModularVisuals()
        {
            if (Hero == null) return;
            baseCatRenderer.sprite = Hero.GetCurrentSprite();

            // Cập nhật các lớp đồ (khôi phục từ Phase M)
            UpdateLayer(helmetRenderer, EquipmentSlot.Helmet, Hero.Data.headAnchor);
            UpdateLayer(armorRenderer, EquipmentSlot.Armor, Hero.Data.bodyAnchor);
            UpdateLayer(weaponRenderer, EquipmentSlot.DivineWeapon, Hero.Data.handAnchor);
        }

        private void UpdateLayer(SpriteRenderer sr, EquipmentSlot slot, Vector2 anchor)
        {
            if (sr == null) return; // Kiểm tra an toàn: Nếu chưa gán Renderer thì bỏ qua

            if (Hero.equippedItems.TryGetValue(slot, out var item) && item.layerSprite != null)
            {
                sr.sprite = item.layerSprite;
                sr.transform.localPosition = (Vector3)anchor;
                sr.gameObject.SetActive(true);
            }
            else sr.gameObject.SetActive(false);
        }

        public void UpdateAuraStatus()
        {
            if (circleAura != null)
            {
                // Kích hoạt hào quang vòng tròn nếu mặc đủ đồ
                circleAura.gameObject.SetActive(Hero.equippedItems.Count >= 3);
            }
        }

        private void Update()
        {
            // Glow hào quang khi đầy nộ
            if (Hero != null && Hero.CanUseSkill())
            {
                float pulse = 0.5f + Mathf.PingPong(Time.time * 2f, 0.5f);
                baseCatRenderer.color = elementColors.ContainsKey(Hero.Element) ? elementColors[Hero.Element] * pulse : Color.white * pulse;
            }
            else if (flashCoroutine == null) baseCatRenderer.color = Color.white;
        }

        // --- HOẠT ẢNH TẤN CÔNG (MERGED: DASH + AFTERIMAGE + SHAKE) ---
        public IEnumerator AttackAnimation(BattleUnit2D target)
        {
            isAnimating = true;
            Vector3 targetPos = target.transform.position + (isPlayerTeam ? Vector3.left : Vector3.right) * 1.2f;

            // 1. WIND-UP (Lấy đà)
            Vector3 windupPos = startPosition + (isPlayerTeam ? Vector3.left : Vector3.right) * 0.5f;
            float elapsed = 0;
            while (elapsed < 0.2f)
            {
                transform.position = Vector3.Lerp(startPosition, windupPos, elapsed / 0.2f);
                baseCatRenderer.transform.localScale = new Vector3(1.2f, 0.8f, 1f); // Squash
                elapsed += Time.deltaTime;
                yield return null;
            }

            // 2. DASH (Lao đòn)
            elapsed = 0;
            float afterimageTimer = 0;
            while (elapsed < 0.15f)
            {
                transform.position = Vector3.Lerp(windupPos, targetPos, elapsed / 0.15f);
                baseCatRenderer.transform.localScale = new Vector3(0.8f, 1.3f, 1f); // Stretch
                afterimageTimer += Time.deltaTime;
                if (afterimageTimer >= 0.08f) { CreateAfterimage(); afterimageTimer = 0; } // Giảm tần suất cho sạch
                elapsed += Time.deltaTime;
                yield return null;
            }

            // 3. IMPACT (Va chạm)
            baseCatRenderer.transform.localScale = new Vector3(1.4f, 0.6f, 1f); // Heavy Squash on Hit
            StartCoroutine(ShakeCamera(0.15f, 0.1f));
            target.TakeDamageEffect();
            yield return new WaitForSeconds(0.1f);

            // 4. RECOVERY (Về chỗ)
            elapsed = 0;
            while (elapsed < 0.3f)
            {
                transform.position = Vector3.Lerp(targetPos, startPosition, elapsed / 0.3f);
                baseCatRenderer.transform.localScale = Vector3.one;
                elapsed += Time.deltaTime;
                yield return null;
            }

            transform.position = startPosition;
            baseCatRenderer.transform.localScale = Vector3.one;
            isAnimating = false;
        }

        private void CreateAfterimage()
        {
            GameObject obj = new GameObject("Afterimage");
            var ghost = obj.AddComponent<AfterimageEffect>();
            ghost.Initialize(baseCatRenderer.sprite, transform.position, transform.rotation, transform.localScale, baseCatRenderer.flipX, baseCatRenderer.color);
        }

        private IEnumerator ShakeCamera(float duration, float magnitude)
        {
            if (Camera.main == null) yield break;
            Vector3 camOriPos = Camera.main.transform.position;
            float elapsed = 0;
            while (elapsed < duration)
            {
                Camera.main.transform.position = camOriPos + (Vector3)Random.insideUnitCircle * magnitude;
                elapsed += Time.deltaTime;
                yield return null;
            }
            Camera.main.transform.position = camOriPos;
        }

        public void TakeDamageEffect()
        {
            if (flashCoroutine != null) StopCoroutine(flashCoroutine);
            flashCoroutine = StartCoroutine(FlashRed());
        }

        private IEnumerator FlashRed()
        {
            baseCatRenderer.color = Color.red;
            yield return new WaitForSeconds(0.15f);
            baseCatRenderer.color = Color.white;
            flashCoroutine = null;
        }

        private void SetSizeByRole(CatRole role)
        {
            float scale = 1.0f;
            switch (role) { case CatRole.Tank: scale = 1.3f; break; case CatRole.Assassin: scale = 0.85f; break; }
            transform.localScale = new Vector3(scale, scale, 1f);
        }
    }
}
