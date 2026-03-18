import { Document } from 'mupdf';
import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\priya\\OneDrive\\Desktop\\btb';
const outDir = 'c:\\Users\\priya\\OneDrive\\Desktop\\btb\\perfume-store\\public';

async function convertPdfs() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const baseName = path.basename(file, '.pdf');
    
    console.log(`Converting ${file}...`);
    try {
      const data = fs.readFileSync(filePath);
      const doc = new Document(data);
      
      const numPages = doc.countPages();
      for (let i = 0; i < numPages; i++) {
        const page = doc.loadPage(i);
        const pixmap = page.toPixmap(mupdf.Matrix.scale(3, 3), mupdf.ColorSpace.DeviceRGB, false);
        
        const outFileName = numPages > 1 ? `${baseName}-page${i+1}.png` : `${baseName}.png`;
        const outFilePath = path.join(outDir, outFileName.replace(/ /g, '-'));
        
        fs.writeFileSync(outFilePath, pixmap.asPNG());
        console.log(`Saved ${outFileName}`);
      }
    } catch (e) {
      console.error(`Error converting ${file}:`, e);
    }
  }
}

convertPdfs();
