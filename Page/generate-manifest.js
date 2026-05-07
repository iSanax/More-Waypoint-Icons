const fs = require('fs');
const path = require('path');

const PATHS = {
    icons: path.join(__dirname, './More Waypoint Icons/assets/mwi/textures/icons/worldmap'),
    langs: path.join(__dirname, './More Waypoint Icons/assets/game/lang'),
    output: path.join(__dirname, './Page/manifest.json')
};

function generate() {
    try {
        console.log('🔍 Szukam plików...');

        const icons = fs.existsSync(PATHS.icons) 
            ? fs.readdirSync(PATHS.icons).filter(f => f.endsWith('.svg'))
            : [];

        const langs = fs.existsSync(PATHS.langs)
            ? fs.readdirSync(PATHS.langs).filter(f => f.endsWith('.json'))
            : [];

        const manifest = {
            generatedAt: new Date().toLocaleString(),
            icons: icons,
            langs: langs
        };

        fs.writeFileSync(PATHS.output, JSON.stringify(manifest, null, 2));
        console.log(`✅ Sukces! Znaleziono ${icons.length} ikon i ${langs.length} plików językowych.`);
        
    } catch (err) {
        console.error('❌ Błąd skryptu:', err.message);
        process.exit(1);
    }
}

generate();