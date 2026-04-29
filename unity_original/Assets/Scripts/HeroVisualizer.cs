using UnityEngine;
using TMPro;

namespace MeowKingdoms
{
    public class HeroVisualizer : MonoBehaviour
    {
        public SpriteRenderer spriteRenderer;
        private TextMeshPro textMesh;

        private void Start()
        {
            // Lắng nghe tín hiệu khi HeroManager tải xong mèo từ mạng
            if (HeroManager.Instance != null)
            {
                HeroManager.Instance.OnFirebaseCollectionReady += RenderHero;
                
                // Trường hợp mạng quá nhanh, HeroManager đã tải xong trước
                if (HeroManager.Instance.allOwnedHeroes.Count > 0)
                {
                    RenderHero();
                }
            }
        }

        private void RenderHero()
        {
            if (HeroManager.Instance.allOwnedHeroes.Count == 0)
            {
                Debug.LogWarning("Không có con mèo nào trong Firebase để hiển thị!");
                return;
            }

            // Lấy con mèo đầu tiên trong danh sách tải về
            CatHero myHero = HeroManager.Instance.allOwnedHeroes[0];

            // 1. VẼ HÌNH ẢNH
            if (spriteRenderer == null)
            {
                spriteRenderer = gameObject.AddComponent<SpriteRenderer>();
            }
            
            if (myHero.Data.portrait != null)
            {
                spriteRenderer.sprite = myHero.Data.portrait;
            }
            else
            {
                Debug.LogWarning("Con mèo này không có ảnh đại diện (avatar) trên Firebase!");
            }

            // 2. VẼ CHỮ (THÔNG SỐ MÁU, DAME)
            if (textMesh == null)
            {
                GameObject textObj = new GameObject("HeroInfoText");
                textObj.transform.SetParent(this.transform);
                textObj.transform.localPosition = new Vector3(0, -2.5f, 0); // Đặt chữ dưới chân con mèo
                
                textMesh = textObj.AddComponent<TextMeshPro>();
                textMesh.alignment = TextAlignmentOptions.Center;
                textMesh.fontSize = 5;
            }

            // In thông số trực tiếp lấy từ Database
            textMesh.text = $"<color=yellow>{myHero.Name}</color>\nHP: {myHero.MaxHP} | ATK: {myHero.PhysAttack}";
        }
    }
}
