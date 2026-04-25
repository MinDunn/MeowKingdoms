using UnityEngine;

namespace MeowKingdoms
{
    public class CardTiltEffect : MonoBehaviour
    {
        [Header("Sway Settings")]
        public float swayAmount = 5f;
        public float swaySpeed = 2f;
        
        [Header("Movement Tilt")]
        public float tiltAmount = 15f;
        public float tiltSpeed = 10f;
        
        private Vector3 lastPosition;
        private float currentTilt;
        
        private void Start()
        {
            lastPosition = transform.position;
        }
        
        private void Update()
        {
            // 1. Procedural Sway (Idle vibe)
            float swayX = Mathf.Sin(Time.time * swaySpeed) * swayAmount;
            float swayY = Mathf.Cos(Time.time * swaySpeed * 0.5f) * swayAmount;
            
            // 2. Velocity-based Tilt
            Vector3 velocity = (transform.position - lastPosition) / Time.deltaTime;
            float targetTilt = -velocity.x * tiltAmount;
            currentTilt = Mathf.Lerp(currentTilt, targetTilt, Time.deltaTime * tiltSpeed);
            
            // Apply rotations
            transform.localRotation = Quaternion.Euler(swayY, currentTilt + swayX, 0);
            
            lastPosition = transform.position;
        }
    }
}
