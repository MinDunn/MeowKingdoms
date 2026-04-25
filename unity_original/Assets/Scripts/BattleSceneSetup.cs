using UnityEngine;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class BattleSceneSetup : MonoBehaviour
    {
        [Header("Settings")]
        public GameObject unitPrefab;
        public float columnSpacing = 2.0f; // Khoảng cách ngang
        public float rowSpacing = 1.5f;    // Khoảng cách dọc
        public float teamDistance = 6.0f;  // Khoảng cách giữa 2 đội

        [ContextMenu("Build Battle Grid 6v6")]
        public void BuildGrid()
        {
            BattleManager manager = GetComponent<BattleManager>();
            if (manager == null) manager = gameObject.AddComponent<BattleManager>();

            manager.playerTeamUnits = CreateTeamGrid("PlayerTeam", -teamDistance / 2, true);
            manager.enemyTeamUnits = CreateTeamGrid("EnemyTeam", teamDistance / 2, false);
            
            Debug.Log("--- ĐÃ TẠO XONG ĐỘI HÌNH 6v6 CHUẨN ---");
        }

        private List<BattleUnit2D> CreateTeamGrid(string teamName, float startX, bool isPlayer)
        {
            GameObject teamParent = new GameObject(teamName);
            teamParent.transform.SetParent(this.transform);
            List<BattleUnit2D> units = new List<BattleUnit2D>();

            // Grid 2x3 (2 Hàng, 3 Cột/Vị trí mỗi hàng)
            // Hàng 1 (Vị trí 0, 1, 2) | Hàng 2 (Vị trí 3, 4, 5)
            for (int row = 0; row < 2; row++)
            {
                for (int col = 0; col < 3; col++)
                {
                    float xPos = startX + (isPlayer ? -row : row) * columnSpacing;
                    float yPos = (col - 1) * rowSpacing; // Centered at 0

                    GameObject slot = new GameObject($"{teamName}_Slot_{row}_{col}");
                    slot.transform.SetParent(teamParent.transform);
                    slot.transform.position = new Vector3(xPos, yPos, 0);

                    // Nếu bạn đã có Prefab, có thể Instantiate ở đây
                    if (unitPrefab != null)
                    {
                        GameObject unitObj = Instantiate(unitPrefab, slot.transform);
                        BattleUnit2D unit = unitObj.GetComponent<BattleUnit2D>();
                        if (unit != null) units.Add(unit);
                    }
                }
            }
            return units;
        }
    }
}
