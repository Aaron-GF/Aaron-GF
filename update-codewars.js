const fs = require('fs');

async function updateRankings() {
  try {
    const response = await fetch('https://www.codewars.com/api/v1/users/Knifeman_');
    const data = await response.json();
    const { javascript, typescript, java, sql } = data.ranks.languages;

    const newContent = `
| Lenguaje | Rango | Puntuación |
| :--- | :--- | :--- |
| **JavaScript** | ${javascript.name} | ${javascript.score} |
| **TypeScript** | ${typescript.name} | ${typescript.score} |
| **Java** | ${java.name} | ${java.score} |
| **SQL** | ${sql.name} | ${sql.score} |`;

    let readme = fs.readFileSync('README.md', 'utf8');

    const regex = /[\s\S]*?/g;

    if (regex.test(readme)) {
      const updatedReadme = readme.replace(regex, `\n${newContent}\n`);
      
      fs.writeFileSync('README.md', updatedReadme);
      console.log('✅ ¡POR FIN! README actualizado correctamente en su sitio.');
    } else {
      console.error('❌ ERROR: Sigo sin encontrar las etiquetas en tu README. Revisa que estén escritas correctamente.');
    }

  } catch (error) {
    console.error('❌ ERROR CRÍTICO:', error);
    process.exit(1);
  }
}

updateRankings();
