const fs = require('fs');
const path = require('path');

// Ścieżki - dostosuj jeśli foldery są inaczej ułożone
const PATHS = {
    manifest: path.join(__dirname, './manifest.json'),
    langsDir: path.join(__dirname, '../More Waypoint Icons/assets/game/lang'),
    output: path.join(__dirname, './icons-table.md') // Tabela w formacie Markdown
};

function generateTable() {
    try {
        // 1. Wczytaj manifest
        const manifest = JSON.parse(fs.readFileSync(PATHS.manifest, 'utf8'));
        const { icons, langs } = manifest;

        // 2. Wczytaj zawartość wszystkich plików językowych
        const langMaps = {};
        langs.forEach(lang => {
            const langPath = path.join(PATHS.langsDir, `${lang}.json`);
            if (fs.existsSync(langPath)) {
                langMaps[lang] = JSON.parse(fs.readFileSync(langPath, 'utf8'));
            } else {
                langMaps[lang] = {};
                console.warn(`⚠️ Brak pliku dla języka: ${lang}`);
            }
        });

        // 3. Budowanie nagłówka tabeli
        // Kolumny: Ikona | Klucz | Język 1 | Język 2 ...
        let header = `| Ikona | Klucz (Translation Key) | ${langs.join(' | ')} |\n`;
        let separator = `| :--- | :--- | ${langs.map(() => ':---').join(' | ')} |\n`;
        let rows = "";

        // 4. Iteracja po ikonach i dopasowanie tłumaczeń
        icons.forEach(iconName => {
            // Tutaj zakładam schemat klucza: "worldmap-icon-" + nazwa
            // Jeśli Twoje klucze wyglądają inaczej, zmień tę zmienną:
            const translationKey = `worldmap-icon-${iconName}`;
            
            let row = `| **${iconName}** | \`${translationKey}\` `;
            
            langs.forEach(lang => {
                const translation = langMaps[lang][translationKey] || "❌ BRAK";
                row += ` | ${translation}`;
            });
            
            rows += row + " |\n";
        });

        // 5. Zapis do pliku
        fs.writeFileSync(PATHS.output, header + separator + rows, 'utf8');
        
        console.log(`✅ Tabela wygenerowana! Sprawdź plik: ${PATHS.output}`);

    } catch (err) {
        console.error('❌ Błąd podczas generowania tabeli:', err.message);
    }
}

generateTable();