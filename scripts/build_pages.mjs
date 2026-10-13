import { cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'build/pages');
mkdirSync(output, { recursive: true });
cpSync(resolve(root, 'pages'), output, { recursive: true });
const sources = ['fitzza-erd.mmd', ...readdirSync(resolve(root, 'diagrams/mermaid'))
  .filter(name => name.endsWith('.mmd')).sort().map(name => `diagrams/mermaid/${name}`)];
const diagrams = sources.map(path => {
  const name = path.split('/').at(-1).replace(/\.mmd$/, '');
  const title = name === 'fitzza-erd' ? '전체 ERD'
    : name === 'fitzza-overview' ? '테이블 개요 (PK)' : name;
  mkdirSync(dirname(resolve(output, path)), { recursive: true });
  cpSync(resolve(root, path), resolve(output, path));
  return { path, title };
});
writeFileSync(resolve(output, 'diagrams.json'), JSON.stringify(diagrams, null, 2));
writeFileSync(resolve(output, '.nojekyll'), '');
console.log(`Built GitHub Pages with ${diagrams.length} Mermaid diagrams.`);
