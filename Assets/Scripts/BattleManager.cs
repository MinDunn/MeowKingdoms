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
        public float turnDelay = 1.0f;

        public void StartBattle() 
        {
            if (AudioManager.Instance != null) AudioManager.Instance.PlayBGM(AudioManager.Instance.battleBGM);
            StartCoroutine(BattleLoop()); 
        }

        private IEnumerator BattleLoop()
        {
            while (CheckBattleOngoing())
            {
                var turnOrder = playerTeamUnits.Concat(enemyTeamUnits)
                    .Where(u => u.Hero.CurrentHP > 0)
                    .OrderByDescending(u => u.Hero.Speed).ToList();

                foreach (var currentUnit in turnOrder)
                {
                    if (currentUnit.Hero.CurrentHP <= 0 || !CheckBattleOngoing()) continue;
                    yield return StartCoroutine(ProcessTurn(currentUnit));
                    yield return new WaitForSeconds(turnDelay);
                }
            }
            
            bool playerWon = playerTeamUnits.Any(u => u.Hero.CurrentHP > 0);
            if (AudioManager.Instance != null)
            {
                if (playerWon) AudioManager.Instance.PlaySFX(AudioManager.Instance.victorySFX);
                else AudioManager.Instance.PlaySFX(AudioManager.Instance.defeatSFX);
            }
        }

        private IEnumerator ProcessTurn(BattleUnit2D unit)
        {
            List<BattleUnit2D> targets = unit.isPlayerTeam ? enemyTeamUnits : playerTeamUnits;
            BattleUnit2D target = targets.FirstOrDefault(t => t.Hero.CurrentHP > 0);

            if (target != null)
            {
                if (unit.Hero.CanUseSkill())
                {
                    if (AudioManager.Instance != null) AudioManager.Instance.PlaySkill();
                    
                    if (UltimatePresentation.Instance != null)
                    {
                        yield return StartCoroutine(UltimatePresentation.Instance.PlayUltimateCutIn(unit.Hero, unit.transform.position));
                    }

                    yield return StartCoroutine(unit.AttackAnimation(target));
                    unit.Hero.UseSkill();
                    ApplyDamage(unit, target, unit.Hero.Attack * 2.5f);
                }
                else
                {
                    if (AudioManager.Instance != null) AudioManager.Instance.PlayAttack();
                    yield return StartCoroutine(unit.AttackAnimation(target));
                    unit.Hero.OnAttack();
                    ApplyDamage(unit, target, unit.Hero.Attack);
                }
            }
        }

        private void ApplyDamage(BattleUnit2D attacker, BattleUnit2D target, float damage)
        {
            if (AudioManager.Instance != null) AudioManager.Instance.PlayHurt();
            
            // THỰC HIỆN SÁT THƯƠNG + HIỆU ỨNG PHẢN HỒI (FLINCH)
            target.Hero.OnTakeDamage(Mathf.Max(1f, damage)); 
            target.TakeDamageEffect(); // <-- Kích hoạt nhắm mắt và bẹp người khi bị trúng đòn
            
            if (target.Hero.CurrentHP <= 0) target.gameObject.SetActive(false);
        }

        private bool CheckBattleOngoing() => playerTeamUnits.Any(u => u.Hero.CurrentHP > 0) && enemyTeamUnits.Any(u => u.Hero.CurrentHP > 0);
    }
}
