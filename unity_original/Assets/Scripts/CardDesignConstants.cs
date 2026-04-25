using UnityEngine;

namespace MeowKingdoms
{
    public static class CardDesignConstants
    {
        // --- RANK COLORS (RARITY) ---
        public static readonly Color RankA = HexToColor("#ffffff");
        public static readonly Color RankS = HexToColor("#4caf50");
        public static readonly Color RankSS = HexToColor("#2196f3");
        public static readonly Color RankSSS = HexToColor("#ffeb3b");
        public static readonly Color RankSSR = HexToColor("#f44336");
        public static readonly Color RankSSRPlus = HexToColor("#e100ff");

        // --- ELEMENT COLORS ---
        public static readonly Color ElementWind = HexToColor("#00ecff");
        public static readonly Color ElementLight = HexToColor("#ffeb3b");
        public static readonly Color ElementNature = HexToColor("#4caf50");
        public static readonly Color ElementLightning = HexToColor("#e100ff");
        public static readonly Color ElementMagic = HexToColor("#00f7ff");
        public static readonly Color ElementShadow = HexToColor("#7200ff");
        public static readonly Color ElementWater = HexToColor("#2196f3");
        public static readonly Color ElementIce = HexToColor("#80deea");
        public static readonly Color ElementFire = HexToColor("#f44336");

        // --- HELPER ---
        public static Color HexToColor(string hex)
        {
            if (ColorUtility.TryParseHtmlString(hex, out Color color))
                return color;
            return Color.white;
        }

        public static Color GetElementColor(CatElement element)
        {
            switch (element)
            {
                case CatElement.Fire: return ElementFire;
                case CatElement.Water: return ElementWater;
                case CatElement.Wind: return ElementWind;
                case CatElement.Lightning: return ElementLightning;
                case CatElement.Ice: return ElementIce;
                case CatElement.Nature: return ElementNature;
                case CatElement.Dark: return ElementShadow;
                case CatElement.Light: return ElementLight;
                case CatElement.Arcane: return ElementMagic;
                case CatElement.Earth: return ElementNature; // Tạm dùng Nature cho Earth nếu chưa có màu riêng
                default: return Color.white;
            }
        }
    }
}
