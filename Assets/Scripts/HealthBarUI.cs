using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class HealthBarUI : MonoBehaviour
    {
        [Header("HP")]
        public Slider hpSlider;
        public Text nameText;
        
        [Header("Rage (4 Bars)")]
        public Image[] rageBars; // Mảng 4 Image đại diện cho 4 nấc nộ
        public Color emptyRageColor = Color.gray;
        public Color fullRageColor = Color.yellow;
        
        private BattleUnit2D sourceUnit;

        public void Setup(BattleUnit2D unit)
        {
            this.sourceUnit = unit;
            nameText.text = unit.Hero.Name;
            UpdateUI();
        }

        public void UpdateUI()
        {
            if (sourceUnit == null || sourceUnit.Hero == null) return;

            // 1. Cập nhật Máu
            hpSlider.maxValue = sourceUnit.Hero.MaxHP;
            hpSlider.value = sourceUnit.Hero.CurrentHP;

            // 2. Cập nhật Nộ (4 nấc)
            int currentRage = sourceUnit.Hero.CurrentRage;
            for (int i = 0; i < rageBars.Length; i++)
            {
                if (i < currentRage)
                {
                    rageBars[i].color = fullRageColor;
                    rageBars[i].gameObject.SetActive(true);
                }
                else
                {
                    rageBars[i].color = emptyRageColor;
                    // Tùy bạn muốn hiện ô xám hay ẩn đi
                    // rageBars[i].gameObject.SetActive(false); 
                }
            }
            
            // Nếu đủ 4 nộ, có thể làm hiệu ứng nhấp nháy cho thanh nộ
            if (currentRage >= 4)
            {
                // Hiệu ứng Visual báo hiệu Tuyệt chiêu sẵn sàng
            }
        }
    }
}
