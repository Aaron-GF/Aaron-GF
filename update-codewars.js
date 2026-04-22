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
| **SQL** | ${sql.name} | ${sql.score} |
`;

    let readme = fs.readFileSync('README.md', 'utf8');

    const startTag = '';
    const endTag = '';

    const startIndex = readme.indexOf(startTag);
    const endIndex = readme.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
      const top = readme.substring(0, startIndex + startTag.length);
      const bottom = readme.substring(endIndex);
      
      const updatedReadme = top + '\n' + newContent + '\n' + bottom;
      
      fs.writeFileSync('README.md', updatedReadme);
      console.log('✅ El README ha sido actualizado con exito');
    } else {
      throw new Error('No se ha podido actualizar');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

updateRankings();
