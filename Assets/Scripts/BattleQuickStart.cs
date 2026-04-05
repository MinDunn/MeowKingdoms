using UnityEngine;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class BattleQuickStart : MonoBehaviour
    {
        [Header("Tướng (Kéo file CatHeroData vào đây)")]
        public CatHeroData fireCatData;
        public CatHeroData waterCatData;

        [Header("Diễn họa (Kéo ảnh PNG vào đây)")]
        public Sprite backgroundSprite;
        public Sprite circleAuraSprite;

        private BattleUnit2D pUnit;
        private BattleUnit2D eUnit;

        private void Start()
        {
            SetupManagers();
            CreateTestBattle();
        }

        private void SetupManagers()
        {
            if (Object.FindAnyObjectByType<BattleManager>() == null) new GameObject("BattleManager").AddComponent<BattleManager>();
            var up = Object.FindAnyObjectByType<UltimatePresentation>();
            if (up == null) {
                up = new GameObject("UltimatePresentation").AddComponent<UltimatePresentation>();
                var dimmerGo = new GameObject("Dimmer");
                dimmerGo.transform.SetParent(up.transform);
                var sr = dimmerGo.AddComponent<SpriteRenderer>();
                sr.color = new Color(0,0,0,0);
                up.screenDimmer = sr;
            }
        }

        private void CreateTestBattle()
        {
            // 1. TẠO BẢN ĐỒ CHIẾN TRƯỜNG
            CreateBackground();

            var bm = Object.FindAnyObjectByType<BattleManager>();
            bm.playerTeamUnits = new List<BattleUnit2D>();
            bm.enemyTeamUnits = new List<BattleUnit2D>();

            // 2. TẠO MÈO (Vị trí thấp xuống để đứng trên mặt đất)
            pUnit = CreateUnit("PlayerCat", fireCatData, new Vector3(-4.5f, -1.8f, 0), true);
            bm.playerTeamUnits.Add(pUnit);

            eUnit = CreateUnit("EnemyCat", waterCatData, new Vector3(4.5f, -1.8f, 0), false);
            bm.enemyTeamUnits.Add(eUnit);

            Invoke("StartFight", 2f);
        }

        private void CreateBackground()
        {
            if (backgroundSprite == null) return;
            var go = new GameObject("BattleMap");
            var sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = backgroundSprite;
            sr.sortingOrder = -100; // Phía sau cùng
            
            // Tự động co giãn để vừa với tầm nhìn camera
            go.transform.position = new Vector3(0, 0, 10);
            float worldScreenHeight = Camera.main.orthographicSize * 2f;
            float worldScreenWidth = worldScreenHeight / Screen.height * Screen.width;
            go.transform.localScale = new Vector3(worldScreenWidth / sr.sprite.bounds.size.x, worldScreenHeight / sr.sprite.bounds.size.y, 1);
        }

        private void StartFight() => Object.FindAnyObjectByType<BattleManager>().StartBattle();

        [ContextMenu("THỬ TẤN CÔNG (BÓNG MỜ)")]
        public void TestAttack() { if (pUnit != null && eUnit != null) StartCoroutine(pUnit.AttackAnimation(eUnit)); }

        [ContextMenu("THỬ TUYỆT CHIÊU (LINH HỒN)")]
        public void TestUltimate()
        {
            if (pUnit != null && eUnit != null) {
                StartCoroutine(UltimatePresentation.Instance.PlayUltimateCutIn(pUnit.Hero, pUnit.transform.position));
                Invoke("TestAttack", 1.2f);
            }
        }

        private BattleUnit2D CreateUnit(string name, CatHeroData data, Vector3 pos, bool isPlayer)
        {
            var go = new GameObject(name);
            go.transform.position = pos;
            var unit = go.AddComponent<BattleUnit2D>();
            
            unit.baseCatRenderer = CreateSubRenderer(go, "Base", 10);
            unit.helmetRenderer = CreateSubRenderer(go, "Helmet", 12);
            unit.armorRenderer = CreateSubRenderer(go, "Armor", 11);
            unit.weaponRenderer = CreateSubRenderer(go, "Weapon", 13);
            unit.blinkRenderer = CreateSubRenderer(go, "BlinkOverlay", 15);
            unit.blinkRenderer.color = new Color(0, 0, 0, 0.7f);
            unit.blinkRenderer.transform.localScale = new Vector3(0.5f, 0.1f, 1f);
            unit.blinkRenderer.transform.localPosition = new Vector3(0, 0.2f, 0);
            unit.blinkRenderer.gameObject.SetActive(false);

            unit.circleAura = CreateSubRenderer(go, "CircleAura", 5);
            unit.circleAura.sprite = circleAuraSprite;

            var hero = new CatHero(data, 10);
            unit.Initialize(hero, isPlayer);
            return unit;
        }

        private SpriteRenderer CreateSubRenderer(GameObject parent, string name, int sortingOrder)
        {
            var child = new GameObject(name);
            child.transform.SetParent(parent.transform);
            child.transform.localPosition = Vector3.zero;
            var sr = child.AddComponent<SpriteRenderer>();
            sr.sortingOrder = sortingOrder;
            return sr;
        }
    }
}
