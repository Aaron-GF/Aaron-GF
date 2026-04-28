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
    JavaScript: "javascript",
    Java: "java",
    TypeScript: "typescript",
    SQL: "postgresql",
  };

  return Object.entries(languages)
    .map(([lang, info]) => {
      const icon = icons[lang] || "code";
      const rank = info.name.replace(/\s+/g, "_");

      return `
<td align="center">
  <img src="https://skillicons.dev/icons?i=${icon}" width="60"/>
  <br>
  <b>${lang}</b>
  <br>
  ${rank} (${info.score} pts)
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

  const table = `
    <table align="center">
      <tr>
        ${generateCards(data)}
      </tr>
    </table>
  `;

  const totalKatas = data.codeChallenges.totalCompleted;
  const ranking = data.leaderboardPosition;
  const rankingText = ranking ? `#${ranking}` : "N/A";

  const extraInfo = `
<table align="center">
  <tr>
    <td align="center">
      <b>✅ Total Katas</b>
      <br>
      ${totalKatas}
    </td>

    <td align="center">
      <b>🏆 Ranking</b>
      <br>
      ${rankingText}
    </td>
  </tr>
</table>
`;

  let readme = fs.readFileSync("README.md", "utf-8");

  console.log("🔍 Buscando bloques...");
  console.log("START:", readme.includes("CODEWARS_START"));
  console.log("EXTRA:", readme.includes("CODEWARS_EXTRA_START"));

  const updated = readme
    .replace(
      /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
      `<!-- CODEWARS_START -->\n${table}\n<!-- CODEWARS_END -->`
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
