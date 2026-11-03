import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import chat from './api/chat.js';import health from './api/health.js';
const root=path.dirname(fileURLToPath(import.meta.url));
// Local configuration only. Deployed functions use Vercel environment variables.
try{const env=await readFile(path.join(root,'.env'),'utf8');for(const line of env.split(/\r?\n/)){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].trim();}}catch(e){if(e.code!=='ENOENT')throw Error('РќРµ СѓРґР°Р»РѕСЃСЊ РїСЂРѕС‡РёС‚Р°С‚СЊ .env');}
const server=http.createServer(async(req,res)=>{
 res.status=function(code){this.statusCode=code;return this;};res.json=function(data){this.setHeader('Content-Type','application/json; charset=utf-8');this.end(JSON.stringify(data));};
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/health')return health(req,res);
 if(url.pathname==='/api/chat'){
 let body='';try{for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>100000)return res.status(413).json({error:'РЎР»РёС€РєРѕРј Р±РѕР»СЊС€РѕР№ Р·Р°РїСЂРѕСЃ.'});}req.body=body?JSON.parse(body):{};}catch{return res.status(400).json({error:'РќРµРєРѕСЂСЂРµРєС‚РЅС‹Р№ JSON.'});}return chat(req,res);
 }
 const assets={'/':['index.html','text/html'],'/style.css':['style.css','text/css'],'/app.js':['app.js','text/javascript']};
 const asset=assets[url.pathname];if(!asset){res.statusCode=404;return res.end('Not found');}
 try{res.setHeader('Content-Type',asset[1]+'; charset=utf-8');res.end(await readFile(path.join(root,'public',asset[0])));}catch{res.statusCode=500;res.end('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РєСЂС‹С‚СЊ СЃС‚СЂР°РЅРёС†Сѓ');}
});
server.listen(8005,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8005'));
