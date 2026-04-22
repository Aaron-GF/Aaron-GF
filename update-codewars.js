const fs = require('fs');

async function updateRankings() {
  try {
    const response = await fetch('https://www.codewars.com/api/v1/users/Knifeman_');
    const data = await response.json();
    const l = data.ranks.languages;

    let readme = fs.readFileSync('README.md', 'utf8');

    // Mapeo de datos: La función .replace(/ /g, '_') asegura que no se rompa la URL
    const updates = {
      'JS_RANK': l.javascript.name.replace(/ /g, '_'),
      'JS_SCORE': l.javascript.score,
      'TS_RANK': l.typescript.name.replace(/ /g, '_'),
      'TS_SCORE': l.typescript.score,
      'JAVA_RANK': l.java.name.replace(/ /g, '_'),
      'JAVA_SCORE': l.java.score,
      'SQL_RANK': l.sql.name.replace(/ /g, '_'),
      'SQL_SCORE': l.sql.score
    };

    // Aplicamos cada reemplazo quirúrgicamente
    Object.keys(updates).forEach(key => {
      const startTag = ``;
      const endTag = ``;
      const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
      
      if (readme.includes(startTag)) {
        readme = readme.replace(regex, `${startTag}${updates[key]}${endTag}`);
      }
    });

    fs.writeFileSync('README.md', readme);
    console.log('✅ Badges actualizadas correctamente.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateRankings();
