const fs = require('fs');
const path = require('path');

function getAllVueFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllVueFiles(filePath));
    } else if (path.extname(file) === '.vue') {
      results.push(filePath);
    }
  });

  return results;
}

function removeDataCyAttribute(content) {
  const regex = /(<[^>]*?)\s+data-cy="[^"]*"([^>]*?>)/g;
  return content.replace(regex, (_, start, end) => start + end);
}

function processVueFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('data-cy=')) {
    return false;
  }

  const newContent = removeDataCyAttribute(content);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
}

function main() {
  const searchDirs = [
    path.join(process.cwd(), 'components'),
    path.join(process.cwd(), 'pages'),
    path.join(process.cwd(), 'src/components'),
    path.join(process.cwd(), 'src/pages'),
  ];

  let allVueFiles = [];

  searchDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      allVueFiles = allVueFiles.concat(getAllVueFiles(dir));
    }
  });

  let modifiedCount = 0;
  allVueFiles.forEach((filePath) => {
    try {
      if (processVueFile(filePath)) {
        modifiedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  });

  console.log(`\nSummary:`);
  console.log(`Total files processed: ${allVueFiles.length}`);
  console.log(`Files modified: ${modifiedCount}`);
}

main();
