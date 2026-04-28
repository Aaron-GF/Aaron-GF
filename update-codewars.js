import fs from "fs";

// Obtiene datos de Codewars
async function getCodewarsData() {
  try {
    const res = await fetch("https://www.codewars.com/api/v1/users/Knifeman_");

    if (!res.ok) {
      throw new Error(`Error API: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Datos obtenidos correctamente");
    return data;
  } catch (error) {
    console.error("❌ Error al obtener datos:", error);
    return null;
  }
}

// Genera badges
function generateBadges(data) {
  const languages = data.ranks.languages;

  return Object.entries(languages)
    .map(([lang, info]) => {
      const name = encodeURIComponent(lang);
      const rank = info.name;
      const score = info.score;

      return `<img src="https://img.shields.io/badge/${name}-${rank}_(${score}_pts)-gray?style=flat-badge" />`;
    })
    .join("\n");
}

// Actualiza README
async function updateReadme() {
  console.log("Iniciando actualización...");

  const data = await getCodewarsData();

  if (!data) {
    console.log("No hay datos, se cancela");
    return;
  }

  const badges = generateBadges(data);

  const totalKatas = data.codeChallenges.totalCompleted;
  const ranking = data.leaderboardPosition;
  const rankingText = ranking ? `#${ranking}` : "N/A";

  const extraInfo = `
<p align="center">
  <strong>✅ Total Katas:</strong> ${totalKatas} &nbsp;&nbsp; | &nbsp;&nbsp;
  <strong>🏆 Ranking:</strong> ${rankingText}
</p>
`;

  let readme = fs.readFileSync("README.md", "utf-8");

  console.log("🔍 Buscando bloques...");
  console.log("START:", readme.includes("CODEWARS_START"));
  console.log("EXTRA:", readme.includes("CODEWARS_EXTRA_START"));

  const updated = readme
    .replace(
      /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
      `<!-- CODEWARS_START -->\n${badges}\n<!-- CODEWARS_END -->`
    )
    .replace(
      /<!-- CODEWARS_EXTRA_START -->([\s\S]*?)<!-- CODEWARS_EXTRA_END -->/,
      `<!-- CODEWARS_EXTRA_START -->\n${extraInfo}\n<!-- CODEWARS_EXTRA_END -->`
    );

  if (updated === readme) {
  console.log("⚠️ No hubo cambios en el README");
  return;
}
  
  fs.writeFileSync("README.md", updated);
  console.log("✅ README actualizado correctamente");
}

updateReadme();
