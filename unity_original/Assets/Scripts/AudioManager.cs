using UnityEngine;

namespace MeowKingdoms
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance;

        [Header("Audio Sources")]
        public AudioSource sfxSource;
        public AudioSource bgmSource;

        [Header("SFX Clips")]
        public AudioClip attackSFX;
        public AudioClip skillSFX;
        public AudioClip hurtSFX;
        public AudioClip victorySFX;
        public AudioClip defeatSFX;

        [Header("Background Music")]
        public AudioClip battleBGM;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void PlaySFX(AudioClip clip)
        {
            if (clip != null)
            {
                sfxSource.PlayOneShot(clip);
            }
        }

        public void PlayBGM(AudioClip clip)
        {
            if (clip != null)
            {
                bgmSource.clip = clip;
                bgmSource.loop = true;
                bgmSource.Play();
            }
        }

        // Các hàm phím tắt tiện lợi
        public void PlayAttack() => PlaySFX(attackSFX);
        public void PlaySkill() => PlaySFX(skillSFX);
        public void PlayHurt() => PlaySFX(hurtSFX);
    }
}
