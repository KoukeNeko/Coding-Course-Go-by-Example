import fs from 'fs';
import path from 'path';
import { chapters } from '../src/data/chapters';

const coursesDir = path.resolve(process.cwd(), '../courses');

if (!fs.existsSync(coursesDir)) {
  fs.mkdirSync(coursesDir, { recursive: true });
}

chapters.forEach((chapter, index) => {
  const chapterNum = (index + 1).toString().padStart(2, '0');
  const dirName = `${chapterNum}-${chapter.id}`;
  const chapterPath = path.join(coursesDir, dirName);

  if (!fs.existsSync(chapterPath)) {
    fs.mkdirSync(chapterPath, { recursive: true });
  }

  // Write meta.json
  const meta = {
    id: chapter.id,
    title: chapter.title
  };
  fs.writeFileSync(path.join(chapterPath, 'meta.json'), JSON.stringify(meta, null, 2));

  // Write lesson.md
  fs.writeFileSync(path.join(chapterPath, 'lesson.md'), chapter.description.trim());

  // Write main.go
  fs.writeFileSync(path.join(chapterPath, 'main.go'), chapter.initialCode.trim());

  console.log(`Migrated: ${dirName}`);
});

console.log("Migration complete!");
