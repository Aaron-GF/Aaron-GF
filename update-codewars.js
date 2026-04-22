const fs = require("fs");

const USERNAME = "Knifeman_";

async function getCodewarsData() {
  try {
    const res = await fetch(`https://www.codewars.com/api/v1/users/${USERNAME}`);
    if (!res.ok) throw new Error("Error al obtener datos");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching Codewars:", err);
    return null;
  }
}

function generateBadges(data) {
  const langs = data.ranks.languages;

  const badges = Object.entries(langs)
    .sort((a, b) => b[1].score - a[1].score)
    .filter(([_, info]) => info.score > 0)
    .map(([lang, info]) => {
      const colorMap = {
        javascript: "F7DF1E",
        typescript: "007ACC",
        java: "ED8B00",
        sql: "316192",
      };

      const logoMap = {
        javascript: "javascript",
        typescript: "typescript",
        java: "openjdk",
        sql: "postgresql",
      };

      const color = colorMap[lang.toLowerCase()] || "gray";
      const logo = logoMap[lang.toLowerCase()] || lang;

      return `<img src="https://img.shields.io/badge/${lang}-${info.name}_(${info.score}_pts)-gray?style=flat-badge&logo=${logo}&logoColor=white&labelColor=%23${color}" height="35" />`;
    });

  return badges.join("\n");
}

function generateExtraInfo(data) {
  const totalKatas = data.codeChallenges.totalCompleted;
  const ranking = data.leaderboardPosition;
  const rankingText = ranking ? `#${ranking}` : "N/A";

  return `
<div align="center">
  <span style="
    background: linear-gradient(135deg, #1408d0, #08c4d0);
    color: white;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    margin: 4px;
    display: inline-block;
  ">
    ✅ Katas: ${totalKatas}
  </span>

  <span style="
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
    color: white;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    margin: 4px;
    display: inline-block;
  ">
    🏆 Ranking: ${rankingText}
  </span>
</div>
`;
}

async function updateReadme() {
  const data = await getCodewarsData();
  if (!data) return;

  const badges = generateBadges(data);
  const extraInfo = generateExtraInfo(data);

  const readme = fs.readFileSync("README.md", "utf-8");

  // actualiza badges
  let updated = readme.replace(
    /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
    `<!-- CODEWARS_START -->\n${badges}\n<!-- CODEWARS_END -->`
  );

  // actualiza pills (katas + ranking)
  updated = updated.replace(
    /<!-- CODEWARS_EXTRA_START -->([\s\S]*?)<!-- CODEWARS_EXTRA_END -->/,
    `<!-- CODEWARS_EXTRA_START -->\n${extraInfo}\n<!-- CODEWARS_EXTRA_END -->`
  );

  fs.writeFileSync("README.md", updated);
  console.log("✅ README actualizado correctamente");
}

updateReadme();
