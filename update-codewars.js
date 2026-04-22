async function updateReadme() {
  const data = await getCodewarsData();
  if (!data) return;

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

  const readme = fs.readFileSync("README.md", "utf-8");

  // actualizar badges
  let updated = readme.replace(
    /<!-- CODEWARS_START -->([\s\S]*?)<!-- CODEWARS_END -->/,
    `<!-- CODEWARS_START -->\n${badges}\n<!-- CODEWARS_END -->`
  );

  // actualizar extra info
  updated = updated.replace(
    /<!-- CODEWARS_EXTRA_START -->([\s\S]*?)<!-- CODEWARS_EXTRA_END -->/,
    `<!-- CODEWARS_EXTRA_START -->\n${extraInfo}\n<!-- CODEWARS_EXTRA_END -->`
  );

  fs.writeFileSync("README.md", updated);
  console.log("✅ README actualizado correctamente");
}
