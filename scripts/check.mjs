import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const dirs=['api','lib','public','scripts','tests'];
const files=['server.mjs'];
for(const dir of dirs)for(const item of await readdir(dir)){if(/\.(js|mjs)$/.test(item))files.push(path.join(dir,item));}
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)process.exit(1);}
for(const file of ['package.json','vercel.json'])JSON.parse(await readFile(file,'utf8'));
console.log('JavaScript syntax and JSON configuration: OK');
