using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class UltimatePresentation : MonoBehaviour
    {
        public static UltimatePresentation Instance;
        
        [Header("UI & Background")]
        public SpriteRenderer screenDimmer; // Một Sprite đen phủ kín màn hình
        public SpriteRenderer domainBackground; // Sprite phông nền nguyên tố

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                if (screenDimmer) screenDimmer.gameObject.SetActive(false);
                if (domainBackground) domainBackground.gameObject.SetActive(false);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public IEnumerator PlayUltimateCutIn(CatHero hero, Vector3 heroPos)
        {
            Debug.Log($"--- KÍCH HOẠT LĨNH VỰC NGUYÊN TỐ: {hero.Element} ---");

            // 1. LÀM TỐI MÀN HÌNH
            if (screenDimmer)
            {
                screenDimmer.gameObject.SetActive(true);
                screenDimmer.color = new Color(0, 0, 0, 0.7f);
            }

            // 2. HIỆN LINH HỒN KHỔNG LỒ (GUARDIAN SPIRIT)
            GameObject spirit = new GameObject("GuardianSpirit");
            spirit.transform.position = heroPos + new Vector3(0, 2f, 2f); // Nằm phía sau và cao hơn mèo thật
            spirit.transform.localScale = new Vector3(3f, 3f, 1f); // To lớn gấp 3 lần
            
            SpriteRenderer spiritSr = spirit.AddComponent<SpriteRenderer>();
            spiritSr.sprite = hero.GetCurrentSprite();
            spiritSr.color = new Color(1, 1, 1, 0.3f); // Mờ ảo
            spiritSr.sortingOrder = 4; // Nằm sau mèo thật nhưng trước nền tối

            // 3. HIỆN LĨNH VỰC NGUYÊN TỐ (Domain Expansion)
            if (domainBackground)
            {
                domainBackground.gameObject.SetActive(true);
                domainBackground.color = GetDomainColor(hero.Element);
            }

            // Dừng lại 1 giây cho người chơi "mãn nhãn"
            yield return new WaitForSeconds(1.0f);

            // 4. KẾT THÚC & DỌN DẸP
            if (screenDimmer) screenDimmer.gameObject.SetActive(false);
            if (domainBackground) domainBackground.gameObject.SetActive(false);
            Destroy(spirit);
        }

        private Color GetDomainColor(CatElement element)
        {
            switch (element)
            {
                case CatElement.Fire: return new Color(1f, 0.2f, 0, 0.5f);
                case CatElement.Water: return new Color(0, 0.5f, 1f, 0.5f);
                case CatElement.Arcane: return new Color(1f, 0, 1f, 0.5f);
                default: return new Color(1, 1, 1, 0.2f);
            }
        }
    }
}
