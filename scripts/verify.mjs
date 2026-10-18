import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json'),'utf8'));
for(const a of manifest.assets)for(const file of[a,...(a.delivery?[a.delivery]:[])]){const data=fs.readFileSync(path.join(root,file.path));if(data.length!==file.bytes||crypto.createHash('sha256').update(data).digest('hex')!==file.sha256)throw Error('Asset mismatch: '+file.path);if(data.length>=100*1024*1024)throw Error('File too large: '+file.path);}
for(const f of['index.html','src/game.js','styles/game.css']){const text=fs.readFileSync(path.join(root,f),'utf8');if(/data:image\/png;base64,/.test(text))throw Error('Embedded image remains: '+f);for(const m of text.matchAll(/(?:\.\/|\.\.\/)?assets\/((?:web\/)?[a-f0-9]{20}\.[a-z0-9]+)/g))if(!fs.existsSync(path.join(root,'assets',m[1])))throw Error('Broken reference: '+m[1]);}
console.log(`Verified ${manifest.assets.length} assets and game references for WILDROOT ${manifest.version}.`);
