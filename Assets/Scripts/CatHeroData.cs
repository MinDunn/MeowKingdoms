using UnityEngine;

namespace MeowKingdoms
{
    // Cập nhật hệ nguyên tố: Hỏa, Thủy, Phong, Lôi, Thổ, Quang, Ám và MA THUẬT
    public enum CatElement { Fire, Water, Wind, Lightning, Earth, Light, Dark, Arcane }
    
    public enum CatRole 
    { 
        Tank, 
        Brawler, 
        Assassin, 
        Marksman, 
        Mage, 
        Support 
    }

    [CreateAssetMenu(fileName = "NewCatHero", menuName = "MeowKingdoms/Cat Hero Data")]
    public class CatHeroData : ScriptableObject
    {
        public string heroName;
        public CatElement element;
        public CatRole role;
        public Sprite portrait;
        
        [Header("Base Stats")]
        public float baseHP = 100;
        public float baseAttack = 20;
        public float baseSpeed = 10;
        
        [Header("Skill Info")]
        public string skillName;
        [TextArea] public string skillDescription;
    }
}
