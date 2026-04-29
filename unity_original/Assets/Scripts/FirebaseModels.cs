using System.Collections.Generic;
using Firebase.Firestore;

namespace MeowKingdoms
{
    // Class này dùng để nhận dữ liệu từ bảng 'heroes' trên Firebase
    [FirestoreData]
    public class FirestoreHero
    {
        [FirestoreProperty]
        public string id { get; set; } // Sẽ tự gán thủ công từ doc.Id

        [FirestoreProperty]
        public string name { get; set; }

        [FirestoreProperty]
        public string elementName { get; set; }

        [FirestoreProperty]
        public string roleName { get; set; }

        [FirestoreProperty("elementId")]
        public string elementId { get; set; }

        [FirestoreProperty("roleId")]
        public string roleId { get; set; }

        [FirestoreProperty]
        public string rarity { get; set; }

        [FirestoreProperty]
        public string color { get; set; }

        [FirestoreProperty("hp")]
        public int hp { get; set; }

        [FirestoreProperty("pAtk")]
        public int pAtk { get; set; }

        [FirestoreProperty("mAtk")]
        public int mAtk { get; set; }

        [FirestoreProperty("pDef")]
        public int pDef { get; set; }

        [FirestoreProperty("mDef")]
        public int mDef { get; set; }

        [FirestoreProperty("speed")]
        public int speed { get; set; }

        [FirestoreProperty("description")]
        public string description { get; set; }

        [FirestoreProperty("combo")]
        public string combo { get; set; }

        [FirestoreProperty("spriteSheetUrl")]
        public string spriteSheetUrl { get; set; }

        [FirestoreProperty("avatar")]
        public string avatar { get; set; }

        [FirestoreProperty("frameWidth")]
        public int frameWidth { get; set; }

        [FirestoreProperty("frameHeight")]
        public int frameHeight { get; set; }

        [FirestoreProperty("offsetY")]
        public int offsetY { get; set; }

        [FirestoreProperty("animations")]
        public object animations { get; set; }

        [FirestoreProperty("skills")]
        public FirestoreHeroSkills skills { get; set; }
    }

    [FirestoreData]
    public class FirestoreHeroSkills
    {
        [FirestoreProperty("basic")]
        public FirestoreSkillBasic basic { get; set; }

        [FirestoreProperty("passive")]
        public FirestoreSkillPassive passive { get; set; }

        [FirestoreProperty("active")]
        public FirestoreSkillActive active { get; set; }
    }

    [FirestoreData]
    public class FirestoreSkillBasic
    {
        [FirestoreProperty("name")]
        public string name { get; set; }

        [FirestoreProperty("power")]
        public int power { get; set; }
    }

    [FirestoreData]
    public class FirestoreSkillPassive
    {
        [FirestoreProperty("name")]
        public string name { get; set; }

        [FirestoreProperty("description")]
        public string description { get; set; }
    }

    [FirestoreData]
    public class FirestoreSkillActive
    {
        [FirestoreProperty("name")]
        public string name { get; set; }

        [FirestoreProperty("power")]
        public int power { get; set; }

        [FirestoreProperty("cd")]
        public int cd { get; set; }
    }
}
