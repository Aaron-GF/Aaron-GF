const fs = require("fs");

const USERNAME = "Knifeman_";

async function getCodewarsData() {
  const res = await fetch(`https://www.codewars.com/api/v1/users/${USERNAME}`);
  return res.json();
}

function generateBadges(data) {
  const langs = data.ranks.languages;

  const badges = Object.entries(langs).map(([lang, info]) => {
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

    return `<img src="https://img.shields.io/badge/${lang}-${info.name}_(${info.score}_pts)-gray?style=flat-badge&logo=${logo}&logoColor=white&labelColor=%23${color}" />`;
  });

  return badges.join("\n");
}

async function updateReadme() {
  const data = await getCodewarsData();
  const badges = generateBadges(data);

  const readme = fs.readFileSync("README.md", "utf-8");

  const updated = readme.replace(
    /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
    `<!-- CODEWARS_START -->\n${badges}\n<!-- CODEWARS_END -->`
  );

  fs.writeFileSync("README.md", updated);
}

updateReadme();
