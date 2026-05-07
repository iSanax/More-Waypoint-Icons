async function init() {
    const stats = document.getElementById('stats');
    const tbody = document.getElementById('tableBody');
    const headerRow = document.getElementById('headerRow');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');

    try {
        const mRes = await fetch('manifest.json');
        const manifest = await mRes.json();
        const iconCount = manifest.icons.length;

        const sortedLangs = ['en', ...manifest.langs.filter(l => l !== 'en')];
        const langData = {};
        const langStats = {};

        for (const lang of sortedLangs) {
            try {
                const lRes = await fetch(`../More Waypoint Icons/assets/game/lang/${lang}.json`);
                if (lRes.ok) {
                    langData[lang] = await lRes.json();
                    let translatedCount = 0;
                    manifest.icons.forEach(icon => {
                        const key = `game:wpSuggestion-${icon}`;
                        if (langData[lang][key]) translatedCount++;
                    });
                    const percentage = ((translatedCount / iconCount) * 100).toFixed(1);
                    langStats[lang] = { count: translatedCount, percent: percentage };
                }
            } catch (e) {
                langStats[lang] = { count: 0, percent: 0 };
            }
        }

        sortedLangs.forEach(lang => {
            const s = langStats[lang] || { percent: 0 };
            const th = document.createElement('th');
            th.innerHTML = `
                <div class="th-content">
                    <span class="lang-name">${lang}</span>
                    <span class="lang-perc">${s.percent}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${s.percent}%"></div>
                    </div>
                </div>
            `;
            headerRow.appendChild(th);
        });

        manifest.icons.forEach(iconName => {
            const tr = document.createElement('tr');
            const translationKey = `game:wpSuggestion-${iconName}`;
            const iconPath = `../More Waypoint Icons/assets/mwi/textures/icons/worldmap/${iconName}.svg`;
            
            let rowHtml = `
                <td class="icon-column">
                    <div class="icon-info">
                        <div class="icon-preview">
                            <img src="${iconPath}" alt="" width="32" height="32" onerror="this.parentElement.style.display='none'">
                        </div>
                        <div class="name-wrapper">
                            <span class="file-name">${iconName}</span>
                            <span class="translation-key">${translationKey}</span>
                        </div>
                    </div>
                </td>
            `;

            let rowHasMissing = false;
            sortedLangs.forEach(lang => {
                const isMissing = !(langData[lang] && langData[lang][translationKey]);
                if (isMissing) rowHasMissing = true;

                const val = isMissing ? 'MISSING' : langData[lang][translationKey];
                rowHtml += `<td class="translation-cell ${isMissing ? 'missing' : ''}">${val}</td>`;
            });

            tr.innerHTML = rowHtml;
            if (rowHasMissing) tr.setAttribute('data-missing', 'true');
            tbody.appendChild(tr);
        });

        stats.innerHTML = `<span>Icons: <b>${iconCount}</b></span> <span>Languages: <b>${sortedLangs.length}</b></span>`;
        document.getElementById('mainTable').style.display = 'table';

        const applyFilters = () => {
            const term = searchInput.value.toLowerCase();
            const onlyMissing = filterStatus.checked;
            const rows = tbody.getElementsByTagName('tr');

            for (const row of rows) {
                const text = row.textContent.toLowerCase();
                const isMissingRow = row.hasAttribute('data-missing');
                const matchesSearch = text.includes(term);
                const matchesStatus = !onlyMissing || isMissingRow;
                row.classList.toggle('hidden', !(matchesSearch && matchesStatus));
            }
        };

        searchInput.addEventListener('input', applyFilters);
        filterStatus.addEventListener('change', applyFilters);

    } catch (err) {
        stats.innerHTML = `<span style="color:var(--missing)">Error: ${err.message}</span>`;
    }
}

// Start aplikacji
init();