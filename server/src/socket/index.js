let io;
export const emitMonitoring = data => io?.to('admins').emit('monitoring:update',data);
export const setupSocket = async server => { const {Server}=await import('socket.io'); io=new Server(server,{cors:{origin:process.env.CLIENT_URL?.split(',')||'*',methods:['GET','POST']}}); io.on('connection',socket=>{ socket.on('monitoring:join',role=>{ if(role==='ADMIN'||role==='EXAMINER') socket.join('admins'); }); }); };
