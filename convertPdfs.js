const pdf = require('pdf-poppler');
const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\priya\\OneDrive\\Desktop\\btb';
const outDir = 'c:\\Users\\priya\\OneDrive\\Desktop\\btb\\perfume-store\\public';

async function convertPdfs() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const baseName = path.basename(file, '.pdf');
    const safeBaseName = baseName.replace(/ /g, '-');
    
    console.log(`Converting ${file}...`);
    try {
      let opts = {
          format: 'jpeg',
          out_dir: outDir,
          out_prefix: safeBaseName,
          page: null
      }

      await pdf.convert(filePath, opts)
      console.log(`Successfully converted ${file}`);
    } catch (e) {
      console.error(`Error converting ${file}:`, e);
    }
  }
}

convertPdfs();
