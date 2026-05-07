const fs = require('fs');
const path = require('path');

const PATHS = {
    icons: path.join(__dirname, '../More Waypoint Icons/assets/mwi/textures/icons/worldmap'),
    langs: path.join(__dirname, '../More Waypoint Icons/assets/game/lang'),
    output: path.join(__dirname, './manifest.json')
};

function getAllFiles(dirPath, extension, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, extension, arrayOfFiles);
        } else {
            if (file.endsWith(extension)) {
                // path.basename(file, extension) usuwa rozszerzenie z nazwy pliku
                const fileNameWithoutExt = path.basename(file, extension);
                arrayOfFiles.push(fileNameWithoutExt);
            }
        }
    });

    return arrayOfFiles;
}

function generate() {
    try {
        console.log('🔍 Szukanie ikon ...');

        const icons = fs.existsSync(PATHS.icons) 
            ? getAllFiles(PATHS.icons, '.svg')
            : [];

        const langs = fs.existsSync(PATHS.langs)
            ? getAllFiles(PATHS.langs, '.json')
            : [];

        const manifest = {
            generatedAt: new Date().toLocaleString(),
            iconCount: icons.length,
            langs: langs,
            icons: icons
        };

        fs.writeFileSync(PATHS.output, JSON.stringify(manifest, null, 2), 'utf8');
        
        console.log(`✅ Sukces!`);
        console.log(`- Ikon: ${icons.length}`);
        console.log(`- Języków: ${langs.length}`);
        
    } catch (err) {
        console.error('❌ Błąd:', err.message);
        process.exit(1);
    }
}

generate();