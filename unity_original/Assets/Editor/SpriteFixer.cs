using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

namespace MeowKingdoms
{
    public class SpriteFixer : EditorWindow
    {
        [MenuItem("MeowKingdoms/Magic Wand v2 - Super Clean")]
        public static void MagicWandFixV2()
        {
            string spritePath = "Assets/Sprites/Heroes";
            if (!Directory.Exists(spritePath)) { Debug.LogError("Không tìm thấy thư mục Heroes!"); return; }

            string[] guids = AssetDatabase.FindAssets("t:Texture", new[] { spritePath });
            int count = 0;

            foreach (string guid in guids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                
                // Đọc file trực tiếp từ đĩa (tránh lỗi cache Unity)
                byte[] fileData = File.ReadAllBytes(path);
                Texture2D tex = new Texture2D(2, 2);
                if (!tex.LoadImage(fileData)) continue;

                // Tạo bản sao mới có định dạng RGBA32 (Hỗ trợ Alpha)
                Texture2D transparentTex = new Texture2D(tex.width, tex.height, TextureFormat.RGBA32, false);
                Color[] pixels = tex.GetPixels();
                Color[] newPixels = new Color[pixels.Length];
                
                // Thuật toán Magic Wand loang vùng biên
                int width = tex.width;
                int height = tex.height;
                bool[] isBackground = new bool[pixels.Length];
                Queue<Vector2Int> queue = new Queue<Vector2Int>();

                // Khởi tạo từ 4 cạnh biên (loang vào trong)
                for (int x = 0; x < width; x++) { queue.Enqueue(new Vector2Int(x, 0)); queue.Enqueue(new Vector2Int(x, height - 1)); }
                for (int y = 0; y < height; y++) { queue.Enqueue(new Vector2Int(0, y)); queue.Enqueue(new Vector2Int(width - 1, y)); }

                while (queue.Count > 0)
                {
                    Vector2Int curr = queue.Dequeue();
                    int idx = curr.y * width + curr.x;
                    if (isBackground[idx]) continue;

                    Color c = pixels[idx];
                    // Độ nhạy cao: xóa màu trắng từ 230/255 (0.9f)
                    if (c.r > 0.9f && c.g > 0.9f && c.b > 0.9f)
                    {
                        isBackground[idx] = true;
                        // Loang sang lân cận
                        if (curr.x > 0) queue.Enqueue(new Vector2Int(curr.x - 1, curr.y));
                        if (curr.x < width - 1) queue.Enqueue(new Vector2Int(curr.x + 1, curr.y));
                        if (curr.y > 0) queue.Enqueue(new Vector2Int(curr.x, curr.y - 1));
                        if (curr.y < height - 1) queue.Enqueue(new Vector2Int(curr.x, curr.y + 1));
                    }
                }

                // Gán màu cuối cùng
                for (int i = 0; i < pixels.Length; i++)
                {
                    if (isBackground[i]) newPixels[i] = new Color(0, 0, 0, 0); // Biến nền thành trong suốt
                    else newPixels[i] = pixels[i];
                }

                transparentTex.SetPixels(newPixels);
                byte[] bytes = transparentTex.EncodeToPNG();
                File.WriteAllBytes(path, bytes); // Ghi đè lại file ảnh
                count++;
            }

            AssetDatabase.Refresh();
            // Thiết lập lại Import Settings sau khi lưu
            foreach (string guid in guids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                TextureImporter ti = AssetImporter.GetAtPath(path) as TextureImporter;
                if (ti != null)
                {
                    ti.textureType = TextureImporterType.Sprite;
                    ti.alphaIsTransparency = true;
                    ti.SaveAndReimport();
                }
            }

            EditorUtility.DisplayDialog("V2 Hoàn tất!", $"Đã lọc sạch nền cho {count} ảnh mèo. Đôi bên đã sẵn sàng nghênh chiến!", "Tuyệt vời");
        }
    }
}
