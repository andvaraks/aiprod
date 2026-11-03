export default function handler(req,res){res.setHeader('Cache-Control','no-store');return res.status(200).json({ok:true,configured:Boolean(process.env.VSELLM_API_KEY)});}
