using UnityEngine;

namespace MeowKingdoms
{
    public enum CatElement { Fire, Water, Wind, Lightning, Earth, Light, Dark, Arcane }
    public enum CatRole { Tank, Brawler, Assassin, Marksman, Mage, Support }

    [CreateAssetMenu(fileName = "NewCatHero", menuName = "MeowKingdoms/Cat Hero Data")]
    public class CatHeroData : ScriptableObject
    {
        public string heroName;
        public CatElement element;
        public CatRole role;
        public Sprite portrait;

        [Header("Modular Visual Anchors")]
        public Vector2 headAnchor = Vector2.zero;
        public Vector2 bodyAnchor = Vector2.zero;
        public Vector2 handAnchor = Vector2.zero;

        [Header("Base Stats (10% Scaling)")]
        public float baseHP = 100;
        public float basePhysATK = 20;
        public float baseMagATK = 0;
        public float basePhysDef = 10;
        public float baseMagDef = 10;
        public float baseSpeed = 10;
        
        [Header("Advanced Stats (1% Scaling)")]
        public float baseCritRate = 0.05f;
        public float baseCritDamage = 1.5f;
        public float baseDodge = 0.05f;
        public float baseAccuracy = 0.95f;
        public float basePhysPierce = 0;
        public float baseMagPierce = 0;
        public float baseLifeSteal = 0;
        public float baseHealPower = 1.0f;
        public float baseDamageReduc = 0;

        [Header("Skill Info")]
        public string skillName;
        [TextArea] public string skillDescription;
    }
}
