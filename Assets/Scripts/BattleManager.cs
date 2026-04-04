using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace MeowKingdoms
{
    public class BattleManager : MonoBehaviour
    {
        public List<BattleUnit2D> playerTeamUnits;
        public List<BattleUnit2D> enemyTeamUnits;
        
        public bool isAutoBattle = true;
        public float turnDelay = 1.0f;

        public void StartBattle()
        {
            // 1. Phát nhạc nền từ AudioManager
            if (AudioManager.Instance != null)
                AudioManager.Instance.PlayBGM(AudioManager.Instance.battleBGM);

            StartCoroutine(BattleLoop());
        }

        private IEnumerator BattleLoop()
        {
            Debug.Log("--- TRẬN ĐẤU BẮT ĐẦU ---");
            
            while (CheckBattleOngoing())
            {
                List<BattleUnit2D> allUnits = new List<BattleUnit2D>();
                allUnits.AddRange(playerTeamUnits.Where(u => u.Hero.CurrentHP > 0));
                allUnits.AddRange(enemyTeamUnits.Where(u => u.Hero.CurrentHP > 0));
                
                var turnOrder = allUnits.OrderByDescending(u => u.Hero.Speed).ToList();

                foreach (var currentUnit in turnOrder)
                {
                    if (currentUnit.Hero.CurrentHP <= 0) continue;
                    if (!CheckBattleOngoing()) break;

                    yield return StartCoroutine(ProcessTurn(currentUnit));
                    yield return new WaitForSeconds(turnDelay);
                }
            }

            // 2. Kết thúc trận đấu: Kiểm tra thắng thua để phát nhạc
            bool playerWon = playerTeamUnits.Any(u => u.Hero.CurrentHP > 0);
            if (AudioManager.Instance != null)
            {
                if (playerWon) AudioManager.Instance.PlaySFX(AudioManager.Instance.victorySFX);
                else AudioManager.Instance.PlaySFX(AudioManager.Instance.defeatSFX);
            }

            Debug.Log(playerWon ? "--- CHIẾN THẮNG! ---" : "--- THẤT BẠI... ---");
        }

        private IEnumerator ProcessTurn(BattleUnit2D unit)
        {
            List<BattleUnit2D> targets = unit.isPlayerTeam ? enemyTeamUnits : playerTeamUnits;
            BattleUnit2D target = targets.FirstOrDefault(t => t.Hero.CurrentHP > 0);

            if (target != null)
            {
                if (unit.Hero.CanUseSkill())
                {
                    // ÂM THANH KỸ NĂNG NỘ
                    if (AudioManager.Instance != null) AudioManager.Instance.PlaySkill();
                    
                    yield return StartCoroutine(unit.AttackAnimation(target));
                    unit.Hero.UseSkill();
                    ApplyDamage(unit, target, unit.Hero.Attack * 2f);
                }
                else
                {
                    // ÂM THANH TẤN CÔNG THƯỜNG
                    if (AudioManager.Instance != null) AudioManager.Instance.PlayAttack();

                    yield return StartCoroutine(unit.AttackAnimation(target));
                    unit.Hero.OnAttack(); 
                    ApplyDamage(unit, target, unit.Hero.Attack);
                }
            }
        }

        private void ApplyDamage(BattleUnit2D attacker, BattleUnit2D target, float damage)
        {
            // ÂM THANH BỊ TRÚNG ĐÒN
            if (AudioManager.Instance != null) AudioManager.Instance.PlayHurt();

            target.Hero.OnTakeDamage(damage); 
            target.TakeDamageEffect(); 
            
            if (target.Hero.CurrentHP <= 0)
            {
                target.gameObject.SetActive(false);
            }
        }

        private bool CheckBattleOngoing()
        {
            bool playerAlive = playerTeamUnits.Any(u => u.Hero.CurrentHP > 0);
            bool enemyAlive = enemyTeamUnits.Any(u => u.Hero.CurrentHP > 0);
            return playerAlive && enemyAlive;
        }
    }
}
