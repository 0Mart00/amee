const apiKey = "";
        
        async function callGeminiAI(prompt, systemInstruction = "Te egy Age of Empires szakértő tanácsadó vagy.") {
            let retries = 0;
            const maxRetries = 5;
            while (retries < maxRetries) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            systemInstruction: { parts: [{ text: systemInstruction }] }
                        })
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const result = await response.json();
                    return result.candidates?.[0]?.content?.parts?.[0]?.text;
                } catch (error) {
                    retries++;
                    await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
                    if (retries === maxRetries) return "Sajnos az égi tanácsadók most nem elérhetőek.";
                }
            }
        }

        async function generateCivBanner() {
            const civ = document.getElementById('civ-select').value;
            const playerName = document.getElementById('player-name').value;
            const loading = document.getElementById('banner-loading');
            const img = document.getElementById('civ-banner-img');
            loading.style.display = 'block'; img.style.display = 'none';
            try {
                const prompt = `A medieval coat of arms for the ${civ} civilization ruled by ${playerName}. Historical style, rich colors, embroidery texture. High resolution, heraldic shield.`;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ instances: [{ prompt: prompt }], parameters: { sampleCount: 1 } })
                });
                const result = await response.json();
                if (result.predictions?.[0]?.bytesBase64Encoded) {
                    img.src = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                    img.style.display = 'block';
                }
            } catch (e) { console.error("Banner generation failed"); } finally { loading.style.display = 'none'; }
        }

        async function generateWorldLore() {
            const civ = document.getElementById('civ-select').value;
            const seed = document.getElementById('map-seed-input').value;
            const box = document.getElementById('ai-lore-box');
            box.innerText = "A krónikások írják a történetet...";
            const prompt = `Írj egy rövid, hangulatos, 3 mondatos háttértörténetet a(z) ${civ} népnek ezen a vidéken (Seed: ${seed}). Használj középkori stílust. Magyar nyelven válaszolj!`;
            const lore = await callGeminiAI(prompt, "Te egy középkori krónikás vagy.");
            box.innerText = lore;
        }

        async function toggleAIAdvice() {
            const panel = document.getElementById('ai-advice-panel');
            const content = document.getElementById('ai-advice-content');
            if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
            panel.style.display = 'block'; content.innerText = "A tanácsadók elemzik a helyzetet...";
            const stats = `Civilizáció: ${currentCiv}, Fa: ${resources.wood}, Kő: ${resources.stone}, Arany: ${resources.gold}, Épületek száma: ${placedBuildings.length}.`;
            const prompt = `Alapozva ezekre az adatokra: ${stats}. Adj egyetlen rövid, hasznos stratégiai tanácsot magyar nyelven! ✨`;
            const advice = await callGeminiAI(prompt);
            content.innerText = advice;
        }