/**
 * Helper utility to compress images client-side before uploading or saving to DB.
 * Resizes images to a max dimension and converts to compressed JPEG/WebP format.
 */
export async function compressImage(
    fileOrBase64: File | string,
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.75
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        const processImage = () => {
            let { width, height } = img;

            // Calculate scaling ratio
            if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                // Fallback to original if canvas context unavailable
                if (typeof fileOrBase64 === "string") resolve(fileOrBase64);
                else {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(fileOrBase64);
                }
                return;
            }

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed WebP if supported, fallback to JPEG
            try {
                const compressedBase64 = canvas.toDataURL("image/webp", quality);
                if (compressedBase64.startsWith("data:image/webp")) {
                    resolve(compressedBase64);
                    return;
                }
            } catch (e) {
                // Fallback to JPEG
            }

            const fallbackBase64 = canvas.toDataURL("image/jpeg", quality);
            resolve(fallbackBase64);
        };

        img.onerror = (err) => reject(err);
        img.onload = processImage;

        if (typeof fileOrBase64 === "string") {
            img.src = fileOrBase64;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(fileOrBase64);
        }
    });
}
