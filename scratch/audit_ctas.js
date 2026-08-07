const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      const buttonRegex = /<Button([^>]*)>([\s\S]*?)<\/Button>/g;
      
      content = content.replace(buttonRegex, (match, attrs, inner) => {
        if (inner.match(/<[A-Z][a-zA-Z0-9]* /) || inner.match(/<svg/)) {
          let newAttrs = attrs;
          if (newAttrs.includes('className=')) {
            newAttrs = newAttrs.replace(/className=(['"])(.*?)\1/, (m, q, classStr) => {
              let classes = classStr.split(' ');
              if (!classes.includes('gap-4')) classes.push('gap-4');
              if (!classes.includes('flex')) classes.push('flex');
              if (!classes.includes('items-center')) classes.push('items-center');
              if (!classes.includes('justify-center')) classes.push('justify-center');
              
              classes = classes.filter(c => !c.match(/^gap-[0-3]$/) && !c.match(/^gap-[5-9]$/) && !c.match(/^gap-[0-9]{2,}$/));
              
              return `className=${q}${classes.join(' ')}${q}`;
            });
          } else {
            newAttrs += ' className="flex items-center justify-center gap-4"';
          }
          if (attrs !== newAttrs) {
            changed = true;
            return `<Button${newAttrs}>${inner}</Button>`;
          }
        }
        return match;
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
processDir(path.join(process.cwd(), 'components'));
