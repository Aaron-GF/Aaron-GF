const fs = require('fs');

async function updateRankings() {
  try {
    const response = await fetch('https://www.codewars.com/api/v1/users/Knifeman_');
    const data = await response.json();
    
    const { javascript, typescript, java, sql } = data.ranks.languages;

    const newContent = `
### ⚔️ CodeWars Stats (Quincenal)
| Lenguaje | Rango | Puntuación |
| :--- | :--- | :--- |
| **JavaScript** | ${javascript.name} | ${javascript.score} |
| **TypeScript** | ${typescript.name} | ${typescript.score} |
| **Java** | ${java.name} | ${java.score} |
| **SQL** | ${sql.name} | ${sql.score} |

*Última actualización: ${new Date().toLocaleDateString()}*`;

    // Lee el README y reemplazar el contenido entre los marcadores
    const readme = fs.readFileSync('README.md', 'utf8');
    const updatedReadme = readme.replace(
      /[\s\S]*/,
      `\n${newContent}\n`
    );

    fs.writeFileSync('README.md', updatedReadme);
    console.log('✅ README actualizado con éxito');

  } catch (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }
}

updateRankings();
