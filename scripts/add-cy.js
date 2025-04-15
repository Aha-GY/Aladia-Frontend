const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateUniqueId() {
  return crypto.randomBytes(8).toString('hex');
}

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

function addDataCyAttribute(elementStr) {
  if (elementStr.includes('data-cy=')) {
    return elementStr;
  }

  const dataCyAttr = `data-cy="${generateUniqueId()}"`;

  let inQuote = false;
  let quoteChar = '';
  let insertPos = -1;

  for (let i = 0; i < elementStr.length; i++) {
    const char = elementStr[i];
    if (
      (char === '"' || char === "'") &&
      (i === 0 || elementStr[i - 1] !== '\\')
    ) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuote = false;
      }
    } else if (char === '>' && !inQuote) {
      insertPos = i;
      break;
    }
  }

  if (insertPos === -1) {
    return elementStr;
  }

  const isSelfClosing = elementStr[insertPos - 1] === '/';
  const insertPosition = isSelfClosing ? insertPos - 1 : insertPos;

  return `${elementStr.slice(
    0,
    insertPosition,
  )} ${dataCyAttr}${elementStr.slice(insertPosition)}`;
}

function processVueFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('@click')) {
    return false;
  }

  let modified = false;

  const regex = /<[^>]+?@click(?:\.[a-zA-Z]+)*?[\s\S]*?>/g;

  content = content.replace(regex, (match) => {
    modified = true;
    return addDataCyAttribute(match);
  });

  const inputRegex = /<input(?![^>]*data-cy=)[^>]*>/g;
  content = content.replace(inputRegex, (match) => {
    if (!match.includes('data-cy=')) {
      modified = true;
      return addDataCyAttribute(match);
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

function main() {
  const searchDirs = [
    path.join(process.cwd(), 'components'),
    path.join(process.cwd(), 'pages'),
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

  try {
    console.log('\nRunning lint...');
    execSync('npm run prettier', { stdio: 'inherit' });
    execSync('npm run lint', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running lint:', error);
  }
}

main();
