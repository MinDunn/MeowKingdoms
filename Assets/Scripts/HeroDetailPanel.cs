using UnityEngine;
using UnityEngine.UI;

namespace MeowKingdoms
{
    public class HeroDetailPanel : MonoBehaviour
    {
        [Header("Hero Info")]
        public Text nameText;
        public Text levelText;
        public Image portraitImage;

        [Header("Stats (Current -> Next)")]
        public Text hpText;
        public Text attackText;
        public Text speedText;

        [Header("Upgrade Costs")]
        public Text silverCostText;
        public Text stoneCostText;
        public Button upgradeButton;

        private CatHero currentHero;

        public void Open(CatHero hero)
        {
            currentHero = hero;
            UpdateUI();
            gameObject.SetActive(true);
        }

        public void UpdateUI()
        {
            if (currentHero == null) return;

            nameText.text = $"{currentHero.Name} ({currentHero.Role})";
            levelText.text = $"Cấp: {currentHero.Level}/{CatHero.MAX_LEVEL}";
            
            // Hiển thị chỉ số dạng: 1000 -> 1100 (+10%)
            float nextHP = currentHero.Data.baseHP * (1f + 0.1f * (currentHero.Level));
            float nextAtk = currentHero.Data.basePhysATK * (1f + 0.1f * (currentHero.Level));
            float nextSpd = currentHero.Data.baseSpeed * (1f + 0.1f * (currentHero.Level));

            hpText.text = $"Máu: {currentHero.MaxHP:F0} -> {nextHP:F0} (+10%)";
            attackText.text = $"Công: {currentHero.Attack:F0} -> {nextAtk:F0} (+10%)";
            speedText.text = $"Tốc: {currentHero.Speed:F1} -> {nextSpd:F1} (+10%)";

            // Hiển thị chi phí
            int silverCost = currentHero.Level * 100;
            int stoneCost = 1 + (currentHero.Level / 10);
            
            silverCostText.text = $"Bạc: {ResourceManager.Instance.silverBalance}/{silverCost}";
            stoneCostText.text = $"Đá ({currentHero.Element}): {ResourceManager.Instance.elementalStones[currentHero.Element]}/{stoneCost}";

            // Kiểm tra đủ tài nguyên để bật nút
            upgradeButton.interactable = currentHero.CanLevelUp();
        }

        public void OnUpgradeClick()
        {
            if (currentHero != null)
            {
                currentHero.Upgrade();
                UpdateUI();
                
                // Nếu bạn có AudioManager, hãy phát tiếng "Level Up" ở đây
            }
        }
    }
}
