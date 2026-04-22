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

    const startTag = '';
    const endTag = '';
    
    let readme = fs.readFileSync('README.md', 'utf8');

    if (readme.includes(startTag) && readme.includes(endTag)) {
      
      const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`);
      
      const updatedReadme = readme.replace(regex, `${startTag}\n${newContent}\n${endTag}`);
      
      fs.writeFileSync('README.md', updatedReadme);
      console.log('✅ ¡Éxito! README actualizado correctamente.');
    } else {
      throw new Error('No se encontraron las etiquetas y . Verifica que no tengan espacios internos.');
    }

  } catch (error) {
    console.error('❌ ERROR PROTECTOR:', error.message);
    process.exit(1);
  }
}

updateRankings();
