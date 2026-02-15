import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'public';

async function optimizeImages() {
    const images = [
        {
            name: 'logo.png',
            width: 300,
            formats: ['png', 'webp']
        },
        {
            name: 'hero_premium.png',
            width: 1280, // High quality for hero
            formats: ['png', 'webp']
        }
    ];

    for (const img of images) {
        const inputPath = path.join(PUBLIC_DIR, img.name);
        if (!fs.existsSync(inputPath)) {
            console.warn(`File not found: ${inputPath}`);
            continue;
        }

        const { name, ext } = path.parse(img.name);

        for (const format of img.formats) {
            const outputPath = path.join(PUBLIC_DIR, `${name}_optimized.${format === 'png' ? 'png' : format}`);
            // Special case for logo: we want it small but crisp
            // We'll also save as the original name but optimized

            let transform = sharp(inputPath);
            if (img.width) {
                transform = transform.resize({ width: img.width, withoutEnlargement: true });
            }

            if (format === 'webp') {
                await transform.webp({ quality: 80 }).toFile(path.join(PUBLIC_DIR, `${name}.webp`));
                console.log(`Created: ${name}.webp`);
            } else if (format === 'png') {
                // Optimize the original png but keep it transparent
                // We'll overwrite the original after confirming this works or use a temp name
                // For now, let's create an optimized version
                await transform.png({ compressionLevel: 9, palette: true }).toFile(path.join(PUBLIC_DIR, `${name}_new.png`));
                console.log(`Created: ${name}_new.png`);
            }
        }
    }

    // Swap files for logo.png and hero_premium.png if _new.png exists
    ['logo.png', 'hero_premium.png'].forEach(name => {
        const newPath = path.join(PUBLIC_DIR, `${path.parse(name).name}_new.png`);
        const oldPath = path.join(PUBLIC_DIR, name);
        if (fs.existsSync(newPath)) {
            fs.renameSync(oldPath, path.join(PUBLIC_DIR, `${path.parse(name).name}_backup.png`));
            fs.renameSync(newPath, oldPath);
            console.log(`Replaced ${name} with optimized version.`);
        }
    });
}

optimizeImages().catch(err => {
    console.error('Optimization failed:', err);
    process.exit(1);
});
