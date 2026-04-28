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
function generateCards(data) {
  const languages = data.ranks.languages;

  const icons = {
    javascript: "javascript",
    typescript: "typescript",
    sql: "postgresql",
    java: "java",
  };

  return Object.entries(languages)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([lang, info]) => {
      const icon = icons[lang] || "code";

      return `
<td align="center">
  <img src="https://skillicons.dev/icons?i=${icon}" width="40"/><br>
  <b>${info.name}</b><br>${info.score} pts
</td>`;
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

  const cards = generateCards(data);

  const totalKatas = data.codeChallenges.totalCompleted;
  const ranking = data.leaderboardPosition;
  const rankingText = ranking ? `#${ranking}` : "N/A";

  const extraInfo = `
    <td align="center">
      <b>✅ Total Katas</b><br>
      ${totalKatas}
    </td>

    <td align="center">
      <b>🏆 Ranking</b><br>
      ${rankingText}
    </td>
  `;

  let readme = fs.readFileSync("README.md", "utf-8");

  console.log("🔍 Buscando bloques...");
  console.log("START:", readme.includes("CODEWARS_START"));
  console.log("EXTRA:", readme.includes("CODEWARS_EXTRA_START"));

  const updated = readme
    .replace(
      /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
      `<!-- CODEWARS_START -->\n${cards}\n<!-- CODEWARS_END -->`
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
