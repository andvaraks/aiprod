import { catalog, system, validate } from '../lib/agent.js';
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Используйте POST.'});}
 const messages=req.body?.messages;
 if(!validate(messages))return res.status(400).json({error:'Некорректный диалог или превышен лимит. Начните новый чат.'});
 const key=process.env.VSELLM_API_KEY;
 if(!key)return res.status(503).json({error:'На сервере не настроен ключ VseLLM.'});
 try {
 const upstream=await fetch('https://api.vsellm.ru/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.VSELLM_MODEL||'openai/gpt-6-luna',messages:[{role:'system',content:system},...messages],temperature:0.3,max_tokens:1800,response_format:{type:'json_object'}}),signal:AbortSignal.timeout(50000)});
 if(!upstream.ok)return res.status(502).json({error:upstream.status===429?'Лимит VseLLM исчерпан. Попробуйте позже.':'VseLLM не смог обработать запрос. Попробуйте ещё раз.'});
 const data=await upstream.json();const raw=data.choices?.[0]?.message?.content;
 const result=JSON.parse(raw);
 if(typeof result.reply!=='string'||!result.reply.trim()||!Array.isArray(result.propertyIds))throw Error('format');
 const ids=[...new Set(result.propertyIds)].slice(0,3);
 return res.status(200).json({reply:result.reply,properties:ids.map(id=>catalog.find(p=>p.id===id)).filter(Boolean)});
 }catch(e){return res.status(502).json({error:e.name==='TimeoutError'?'Ответ занял слишком много времени. Попробуйте снова.':'Не удалось получить ответ. Попробуйте ещё раз.'});}
}
