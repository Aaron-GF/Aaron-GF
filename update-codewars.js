const fs = require('fs');

async function updateRankings() {
  try {
    const response = await fetch('https://www.codewars.com/api/v1/users/Knifeman_');
    const data = await response.json();
    const { javascript, typescript, java, sql } = data.ranks.languages;

    const newContent = `
| Lenguaje | Rango | Score |
| :--- | :--- | :--- |
| **JS** | ${javascript.name} | ${javascript.score} |
| **TS** | ${typescript.name} | ${typescript.score} |
| **Java** | ${java.name} | ${java.score} |
| **SQL** | ${sql.name} | ${sql.score} |
`;

    let readme = fs.readFileSync('README.md', 'utf8');

    const startTag = '';
    const endTag = '';

    if (readme.includes(startTag) && readme.includes(endTag)) {
      const parts = readme.split(startTag);
      const top = parts[0] + startTag;
      const bottom = parts[1].split(endTag)[1];
      
      const updatedReadme = top + '\n' + newContent + '\n' + endTag + bottom;
      
      fs.writeFileSync('README.md', updatedReadme);
      console.log('✅ README actualizado con éxito.');
    } else {
      console.error('❌ Error: No se encontraron las etiquetas exactas. No se ha modificado nada.');
    }
  } catch (error) {
    console.error('❌ Error en la ejecución:', error);
  }
}

updateRankings();
