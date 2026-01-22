"use strict";var $o=Object.create;var Ne=Object.defineProperty;var Eo=Object.getOwnPropertyDescriptor;var Mo=Object.getOwnPropertyNames;var Io=Object.getPrototypeOf,Ro=Object.prototype.hasOwnProperty;var T=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Do=(e,t)=>{for(var n in t)Ne(e,n,{get:t[n],enumerable:!0})},wt=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Mo(t))!Ro.call(e,i)&&i!==n&&Ne(e,i,{get:()=>t[i],enumerable:!(o=Eo(t,i))||o.enumerable});return e};var G=(e,t,n)=>(n=e!=null?$o(Io(e)):{},wt(t||!e||!e.__esModule?Ne(n,"default",{value:e,enumerable:!0}):n,e)),No=e=>wt(Ne({},"__esModule",{value:!0}),e);var V=T(Ye=>{"use strict";Ye.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};Ye.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var St=T((gs,vt)=>{var pe=require("constants"),Lo=process.cwd,Le=null,zo=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return Le||(Le=Lo.call(process)),Le};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Ke=process.chdir,process.chdir=function(e){Le=null,Ke.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Ke));var Ke;vt.exports=Oo;function Oo(e){pe.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=c(e.stat),e.fstat=c(e.fstat),e.lstat=c(e.lstat),e.statSync=u(e.statSync),e.fstatSync=u(e.fstatSync),e.lstatSync=u(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(r,p,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(r,p,m,f){f&&process.nextTick(f)},e.lchownSync=function(){}),zo==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(r){function p(m,f,w){var x=Date.now(),C=0;r(m,f,function y($){if($&&($.code==="EACCES"||$.code==="EPERM"||$.code==="EBUSY")&&Date.now()-x<6e4){setTimeout(function(){e.stat(f,function(F,D){F&&F.code==="ENOENT"?r(m,f,y):w($)})},C),C<100&&(C+=10);return}w&&w($)})}return Object.setPrototypeOf&&Object.setPrototypeOf(p,r),p})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(r){function p(m,f,w,x,C,y){var $;if(y&&typeof y=="function"){var F=0;$=function(D,N,K){if(D&&D.code==="EAGAIN"&&F<10)return F++,r.call(e,m,f,w,x,C,$);y.apply(this,arguments)}}return r.call(e,m,f,w,x,C,$)}return Object.setPrototypeOf&&Object.setPrototypeOf(p,r),p})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(r){return function(p,m,f,w,x){for(var C=0;;)try{return r.call(e,p,m,f,w,x)}catch(y){if(y.code==="EAGAIN"&&C<10){C++;continue}throw y}}})(e.readSync);function t(r){r.lchmod=function(p,m,f){r.open(p,pe.O_WRONLY|pe.O_SYMLINK,m,function(w,x){if(w){f&&f(w);return}r.fchmod(x,m,function(C){r.close(x,function(y){f&&f(C||y)})})})},r.lchmodSync=function(p,m){var f=r.openSync(p,pe.O_WRONLY|pe.O_SYMLINK,m),w=!0,x;try{x=r.fchmodSync(f,m),w=!1}finally{if(w)try{r.closeSync(f)}catch{}else r.closeSync(f)}return x}}function n(r){pe.hasOwnProperty("O_SYMLINK")&&r.futimes?(r.lutimes=function(p,m,f,w){r.open(p,pe.O_SYMLINK,function(x,C){if(x){w&&w(x);return}r.futimes(C,m,f,function(y){r.close(C,function($){w&&w(y||$)})})})},r.lutimesSync=function(p,m,f){var w=r.openSync(p,pe.O_SYMLINK),x,C=!0;try{x=r.futimesSync(w,m,f),C=!1}finally{if(C)try{r.closeSync(w)}catch{}else r.closeSync(w)}return x}):r.futimes&&(r.lutimes=function(p,m,f,w){w&&process.nextTick(w)},r.lutimesSync=function(){})}function o(r){return r&&function(p,m,f){return r.call(e,p,m,function(w){d(w)&&(w=null),f&&f.apply(this,arguments)})}}function i(r){return r&&function(p,m){try{return r.call(e,p,m)}catch(f){if(!d(f))throw f}}}function a(r){return r&&function(p,m,f,w){return r.call(e,p,m,f,function(x){d(x)&&(x=null),w&&w.apply(this,arguments)})}}function s(r){return r&&function(p,m,f){try{return r.call(e,p,m,f)}catch(w){if(!d(w))throw w}}}function c(r){return r&&function(p,m,f){typeof m=="function"&&(f=m,m=null);function w(x,C){C&&(C.uid<0&&(C.uid+=4294967296),C.gid<0&&(C.gid+=4294967296)),f&&f.apply(this,arguments)}return m?r.call(e,p,m,w):r.call(e,p,w)}}function u(r){return r&&function(p,m){var f=m?r.call(e,p,m):r.call(e,p);return f&&(f.uid<0&&(f.uid+=4294967296),f.gid<0&&(f.gid+=4294967296)),f}}function d(r){if(!r||r.code==="ENOSYS")return!0;var p=!process.getuid||process.getuid()!==0;return!!(p&&(r.code==="EINVAL"||r.code==="EPERM"))}}});var Ct=T((ys,bt)=>{var kt=require("stream").Stream;bt.exports=qo;function qo(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);kt.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),c=0,u=s.length;c<u;c++){var d=s[c];this[d]=i[d]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(r,p){if(r){a.emit("error",r),a.readable=!1;return}a.fd=p,a.emit("open",p),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);kt.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,c=a.length;s<c;s++){var u=a[s];this[u]=i[u]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var Pt=T((ws,xt)=>{"use strict";xt.exports=_o;var jo=Object.getPrototypeOf||function(e){return e.__proto__};function _o(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:jo(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var ke=T((vs,Ze)=>{var z=require("fs"),Uo=St(),Ho=Ct(),Wo=Pt(),ze=require("util"),J,qe;typeof Symbol=="function"&&typeof Symbol.for=="function"?(J=Symbol.for("graceful-fs.queue"),qe=Symbol.for("graceful-fs.previous")):(J="___graceful-fs.queue",qe="___graceful-fs.previous");function Go(){}function Tt(e,t){Object.defineProperty(e,J,{get:function(){return t}})}var we=Go;ze.debuglog?we=ze.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(we=function(){var e=ze.format.apply(ze,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});z[J]||(Ft=global[J]||[],Tt(z,Ft),z.close=(function(e){function t(n,o){return e.call(z,n,function(i){i||At(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,qe,{value:e}),t})(z.close),z.closeSync=(function(e){function t(n){e.apply(z,arguments),At()}return Object.defineProperty(t,qe,{value:e}),t})(z.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){we(z[J]),require("assert").equal(z[J].length,0)}));var Ft;global[J]||Tt(global,z[J]);Ze.exports=Qe(Wo(z));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!z.__patched&&(Ze.exports=Qe(z),z.__patched=!0);function Qe(e){Uo(e),e.gracefulify=Qe,e.createReadStream=N,e.createWriteStream=K;var t=e.readFile;e.readFile=n;function n(v,M,P){return typeof M=="function"&&(P=M,M=null),L(v,M,P);function L(H,_,b,g){return t(H,_,function(k){k&&(k.code==="EMFILE"||k.code==="ENFILE")?Se([L,[H,_,b],k,g||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(v,M,P,L){return typeof P=="function"&&(L=P,P=null),H(v,M,P,L);function H(_,b,g,k,A){return o(_,b,g,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?Se([H,[_,b,g,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(v,M,P,L){return typeof P=="function"&&(L=P,P=null),H(v,M,P,L);function H(_,b,g,k,A){return a(_,b,g,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?Se([H,[_,b,g,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var c=e.copyFile;c&&(e.copyFile=u);function u(v,M,P,L){return typeof P=="function"&&(L=P,P=0),H(v,M,P,L);function H(_,b,g,k,A){return c(_,b,g,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?Se([H,[_,b,g,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var d=e.readdir;e.readdir=p;var r=/^v[0-5]\./;function p(v,M,P){typeof M=="function"&&(P=M,M=null);var L=r.test(process.version)?function(b,g,k,A){return d(b,H(b,g,k,A))}:function(b,g,k,A){return d(b,g,H(b,g,k,A))};return L(v,M,P);function H(_,b,g,k){return function(A,E){A&&(A.code==="EMFILE"||A.code==="ENFILE")?Se([L,[_,b,g],A,k||Date.now(),Date.now()]):(E&&E.sort&&E.sort(),typeof g=="function"&&g.call(this,A,E))}}}if(process.version.substr(0,4)==="v0.8"){var m=Ho(e);y=m.ReadStream,F=m.WriteStream}var f=e.ReadStream;f&&(y.prototype=Object.create(f.prototype),y.prototype.open=$);var w=e.WriteStream;w&&(F.prototype=Object.create(w.prototype),F.prototype.open=D),Object.defineProperty(e,"ReadStream",{get:function(){return y},set:function(v){y=v},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return F},set:function(v){F=v},enumerable:!0,configurable:!0});var x=y;Object.defineProperty(e,"FileReadStream",{get:function(){return x},set:function(v){x=v},enumerable:!0,configurable:!0});var C=F;Object.defineProperty(e,"FileWriteStream",{get:function(){return C},set:function(v){C=v},enumerable:!0,configurable:!0});function y(v,M){return this instanceof y?(f.apply(this,arguments),this):y.apply(Object.create(y.prototype),arguments)}function $(){var v=this;Q(v.path,v.flags,v.mode,function(M,P){M?(v.autoClose&&v.destroy(),v.emit("error",M)):(v.fd=P,v.emit("open",P),v.read())})}function F(v,M){return this instanceof F?(w.apply(this,arguments),this):F.apply(Object.create(F.prototype),arguments)}function D(){var v=this;Q(v.path,v.flags,v.mode,function(M,P){M?(v.destroy(),v.emit("error",M)):(v.fd=P,v.emit("open",P))})}function N(v,M){return new e.ReadStream(v,M)}function K(v,M){return new e.WriteStream(v,M)}var U=e.open;e.open=Q;function Q(v,M,P,L){return typeof P=="function"&&(L=P,P=null),H(v,M,P,L);function H(_,b,g,k,A){return U(_,b,g,function(E,ue){E&&(E.code==="EMFILE"||E.code==="ENFILE")?Se([H,[_,b,g,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}return e}function Se(e){we("ENQUEUE",e[0].name,e[1]),z[J].push(e),Xe()}var Oe;function At(){for(var e=Date.now(),t=0;t<z[J].length;++t)z[J][t].length>2&&(z[J][t][3]=e,z[J][t][4]=e);Xe()}function Xe(){if(clearTimeout(Oe),Oe=void 0,z[J].length!==0){var e=z[J].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)we("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){we("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var c=Date.now()-a,u=Math.max(a-i,1),d=Math.min(u*1.2,100);c>=d?(we("RETRY",t.name,n),t.apply(null,n.concat([i]))):z[J].push(e)}Oe===void 0&&(Oe=setTimeout(Xe,0))}}});var ee=T(de=>{"use strict";var $t=V().fromCallback,Z=ke(),Vo=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof Z[e]=="function");Object.assign(de,Z);Vo.forEach(e=>{de[e]=$t(Z[e])});de.exists=function(e,t){return typeof t=="function"?Z.exists(e,t):new Promise(n=>Z.exists(e,n))};de.read=function(e,t,n,o,i,a){return typeof a=="function"?Z.read(e,t,n,o,i,a):new Promise((s,c)=>{Z.read(e,t,n,o,i,(u,d,r)=>{if(u)return c(u);s({bytesRead:d,buffer:r})})})};de.write=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.write(e,t,...n):new Promise((o,i)=>{Z.write(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesWritten:s,buffer:c})})})};de.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.readv(e,t,...n):new Promise((o,i)=>{Z.readv(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesRead:s,buffers:c})})})};de.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.writev(e,t,...n):new Promise((o,i)=>{Z.writev(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesWritten:s,buffers:c})})})};typeof Z.realpath.native=="function"?de.realpath.native=$t(Z.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var Mt=T((ks,Et)=>{"use strict";var Bo=require("path");Et.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(Bo.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var Nt=T((bs,et)=>{"use strict";var It=ee(),{checkPath:Rt}=Mt(),Dt=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};et.exports.makeDir=async(e,t)=>(Rt(e),It.mkdir(e,{mode:Dt(t),recursive:!0}));et.exports.makeDirSync=(e,t)=>(Rt(e),It.mkdirSync(e,{mode:Dt(t),recursive:!0}))});var se=T((Cs,Lt)=>{"use strict";var Jo=V().fromPromise,{makeDir:Yo,makeDirSync:tt}=Nt(),nt=Jo(Yo);Lt.exports={mkdirs:nt,mkdirsSync:tt,mkdirp:nt,mkdirpSync:tt,ensureDir:nt,ensureDirSync:tt}});var fe=T((xs,Ot)=>{"use strict";var Ko=V().fromPromise,zt=ee();function Qo(e){return zt.access(e).then(()=>!0).catch(()=>!1)}Ot.exports={pathExists:Ko(Qo),pathExistsSync:zt.existsSync}});var ot=T((Ps,qt)=>{"use strict";var be=ee(),Xo=V().fromPromise;async function Zo(e,t,n){let o=await be.open(e,"r+"),i=null;try{await be.futimes(o,t,n)}finally{try{await be.close(o)}catch(a){i=a}}if(i)throw i}function ei(e,t,n){let o=be.openSync(e,"r+");return be.futimesSync(o,t,n),be.closeSync(o)}qt.exports={utimesMillis:Xo(Zo),utimesMillisSync:ei}});var ve=T((Fs,Ht)=>{"use strict";var Ce=ee(),B=require("path"),jt=V().fromPromise;function ti(e,t,n){let o=n.dereference?i=>Ce.stat(i,{bigint:!0}):i=>Ce.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function ni(e,t,n){let o,i=n.dereference?s=>Ce.statSync(s,{bigint:!0}):s=>Ce.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function oi(e,t,n,o){let{srcStat:i,destStat:a}=await ti(e,t,o);if(a){if(Fe(i,a)){let s=B.basename(e),c=B.basename(t);if(n==="move"&&s!==c&&s.toLowerCase()===c.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&it(e,t))throw new Error(je(e,t,n));return{srcStat:i,destStat:a}}function ii(e,t,n,o){let{srcStat:i,destStat:a}=ni(e,t,o);if(a){if(Fe(i,a)){let s=B.basename(e),c=B.basename(t);if(n==="move"&&s!==c&&s.toLowerCase()===c.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&it(e,t))throw new Error(je(e,t,n));return{srcStat:i,destStat:a}}async function _t(e,t,n,o){let i=B.resolve(B.dirname(e)),a=B.resolve(B.dirname(n));if(a===i||a===B.parse(a).root)return;let s;try{s=await Ce.stat(a,{bigint:!0})}catch(c){if(c.code==="ENOENT")return;throw c}if(Fe(t,s))throw new Error(je(e,n,o));return _t(e,t,a,o)}function Ut(e,t,n,o){let i=B.resolve(B.dirname(e)),a=B.resolve(B.dirname(n));if(a===i||a===B.parse(a).root)return;let s;try{s=Ce.statSync(a,{bigint:!0})}catch(c){if(c.code==="ENOENT")return;throw c}if(Fe(t,s))throw new Error(je(e,n,o));return Ut(e,t,a,o)}function Fe(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function it(e,t){let n=B.resolve(e).split(B.sep).filter(i=>i),o=B.resolve(t).split(B.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function je(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}Ht.exports={checkPaths:jt(oi),checkPathsSync:ii,checkParentPaths:jt(_t),checkParentPathsSync:Ut,isSrcSubdir:it,areIdentical:Fe}});var Gt=T((As,Wt)=>{"use strict";async function ai(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}Wt.exports={asyncIteratorConcurrentProcess:ai}});var Kt=T((Ts,Yt)=>{"use strict";var X=ee(),Ae=require("path"),{mkdirs:si}=se(),{pathExists:ri}=fe(),{utimesMillis:ci}=ot(),Te=ve(),{asyncIteratorConcurrentProcess:li}=Gt();async function ui(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await Te.checkPaths(e,t,"copy",n);if(await Te.checkParentPaths(e,o,t,"copy"),!await Bt(e,t,n))return;let s=Ae.dirname(t);await ri(s)||await si(s),await Jt(i,e,t,n)}async function Bt(e,t,n){return n.filter?n.filter(e,t):!0}async function Jt(e,t,n,o){let a=await(o.dereference?X.stat:X.lstat)(t);if(a.isDirectory())return fi(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return di(a,e,t,n,o);if(a.isSymbolicLink())return hi(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function di(e,t,n,o,i){if(!t)return Vt(e,n,o,i);if(i.overwrite)return await X.unlink(o),Vt(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function Vt(e,t,n,o){if(await X.copyFile(t,n),o.preserveTimestamps){mi(e.mode)&&await pi(n,e.mode);let i=await X.stat(t);await ci(n,i.atime,i.mtime)}return X.chmod(n,e.mode)}function mi(e){return(e&128)===0}function pi(e,t){return X.chmod(e,t|128)}async function fi(e,t,n,o,i){t||await X.mkdir(o),await li(await X.opendir(n),async a=>{let s=Ae.join(n,a.name),c=Ae.join(o,a.name);if(await Bt(s,c,i)){let{destStat:d}=await Te.checkPaths(s,c,"copy",i);await Jt(d,s,c,i)}}),t||await X.chmod(o,e.mode)}async function hi(e,t,n,o){let i=await X.readlink(t);if(o.dereference&&(i=Ae.resolve(process.cwd(),i)),!e)return X.symlink(i,n);let a=null;try{a=await X.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return X.symlink(i,n);throw s}if(o.dereference&&(a=Ae.resolve(process.cwd(),a)),Te.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(Te.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`);return await X.unlink(n),X.symlink(i,n)}Yt.exports=ui});var tn=T(($s,en)=>{"use strict";var te=ke(),$e=require("path"),gi=se().mkdirsSync,yi=ot().utimesMillisSync,Ee=ve();function wi(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=Ee.checkPathsSync(e,t,"copy",n);if(Ee.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=$e.dirname(t);return te.existsSync(a)||gi(a),Qt(i,e,t,n)}function Qt(e,t,n,o){let a=(o.dereference?te.statSync:te.lstatSync)(t);if(a.isDirectory())return Pi(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return vi(a,e,t,n,o);if(a.isSymbolicLink())return Ti(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function vi(e,t,n,o,i){return t?Si(e,n,o,i):Xt(e,n,o,i)}function Si(e,t,n,o){if(o.overwrite)return te.unlinkSync(n),Xt(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Xt(e,t,n,o){return te.copyFileSync(t,n),o.preserveTimestamps&&ki(e.mode,t,n),at(n,e.mode)}function ki(e,t,n){return bi(e)&&Ci(n,e),xi(t,n)}function bi(e){return(e&128)===0}function Ci(e,t){return at(e,t|128)}function at(e,t){return te.chmodSync(e,t)}function xi(e,t){let n=te.statSync(e);return yi(t,n.atime,n.mtime)}function Pi(e,t,n,o,i){return t?Zt(n,o,i):Fi(e.mode,n,o,i)}function Fi(e,t,n,o){return te.mkdirSync(n),Zt(t,n,o),at(n,e)}function Zt(e,t,n){let o=te.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Ai(i.name,e,t,n)}finally{o.closeSync()}}function Ai(e,t,n,o){let i=$e.join(t,e),a=$e.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=Ee.checkPathsSync(i,a,"copy",o);return Qt(s,i,a,o)}function Ti(e,t,n,o){let i=te.readlinkSync(t);if(o.dereference&&(i=$e.resolve(process.cwd(),i)),e){let a;try{a=te.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return te.symlinkSync(i,n);throw s}if(o.dereference&&(a=$e.resolve(process.cwd(),a)),Ee.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(Ee.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`);return $i(i,n)}else return te.symlinkSync(i,n)}function $i(e,t){return te.unlinkSync(t),te.symlinkSync(e,t)}en.exports=wi});var _e=T((Es,nn)=>{"use strict";var Ei=V().fromPromise;nn.exports={copy:Ei(Kt()),copySync:tn()}});var Me=T((Ms,an)=>{"use strict";var on=ke(),Mi=V().fromCallback;function Ii(e,t){on.rm(e,{recursive:!0,force:!0},t)}function Ri(e){on.rmSync(e,{recursive:!0,force:!0})}an.exports={remove:Mi(Ii),removeSync:Ri}});var pn=T((Is,mn)=>{"use strict";var Di=V().fromPromise,cn=ee(),ln=require("path"),un=se(),dn=Me(),sn=Di(async function(t){let n;try{n=await cn.readdir(t)}catch{return un.mkdirs(t)}return Promise.all(n.map(o=>dn.remove(ln.join(t,o))))});function rn(e){let t;try{t=cn.readdirSync(e)}catch{return un.mkdirsSync(e)}t.forEach(n=>{n=ln.join(e,n),dn.removeSync(n)})}mn.exports={emptyDirSync:rn,emptydirSync:rn,emptyDir:sn,emptydir:sn}});var yn=T((Rs,gn)=>{"use strict";var Ni=V().fromPromise,fn=require("path"),me=ee(),hn=se();async function Li(e){let t;try{t=await me.stat(e)}catch{}if(t&&t.isFile())return;let n=fn.dirname(e),o=null;try{o=await me.stat(n)}catch(i){if(i.code==="ENOENT"){await hn.mkdirs(n),await me.writeFile(e,"");return}else throw i}o.isDirectory()?await me.writeFile(e,""):await me.readdir(n)}function zi(e){let t;try{t=me.statSync(e)}catch{}if(t&&t.isFile())return;let n=fn.dirname(e);try{me.statSync(n).isDirectory()||me.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")hn.mkdirsSync(n);else throw o}me.writeFileSync(e,"")}gn.exports={createFile:Ni(Li),createFileSync:zi}});var bn=T((Ds,kn)=>{"use strict";var Oi=V().fromPromise,wn=require("path"),he=ee(),vn=se(),{pathExists:qi}=fe(),{areIdentical:Sn}=ve();async function ji(e,t){let n;try{n=await he.lstat(t)}catch{}let o;try{o=await he.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Sn(o,n))return;let i=wn.dirname(t);await qi(i)||await vn.mkdirs(i),await he.link(e,t)}function _i(e,t){let n;try{n=he.lstatSync(t)}catch{}try{let a=he.lstatSync(e);if(n&&Sn(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=wn.dirname(t);return he.existsSync(o)||vn.mkdirsSync(o),he.linkSync(e,t)}kn.exports={createLink:Oi(ji),createLinkSync:_i}});var xn=T((Ns,Cn)=>{"use strict";var ge=require("path"),Ie=ee(),{pathExists:Ui}=fe(),Hi=V().fromPromise;async function Wi(e,t){if(ge.isAbsolute(e)){try{await Ie.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=ge.dirname(t),o=ge.join(n,e);if(await Ui(o))return{toCwd:o,toDst:e};try{await Ie.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:ge.relative(n,e)}}function Gi(e,t){if(ge.isAbsolute(e)){if(!Ie.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=ge.dirname(t),o=ge.join(n,e);if(Ie.existsSync(o))return{toCwd:o,toDst:e};if(!Ie.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:ge.relative(n,e)}}Cn.exports={symlinkPaths:Hi(Wi),symlinkPathsSync:Gi}});var An=T((Ls,Fn)=>{"use strict";var Pn=ee(),Vi=V().fromPromise;async function Bi(e,t){if(t)return t;let n;try{n=await Pn.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function Ji(e,t){if(t)return t;let n;try{n=Pn.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}Fn.exports={symlinkType:Vi(Bi),symlinkTypeSync:Ji}});var Mn=T((zs,En)=>{"use strict";var Yi=V().fromPromise,Tn=require("path"),ce=ee(),{mkdirs:Ki,mkdirsSync:Qi}=se(),{symlinkPaths:Xi,symlinkPathsSync:Zi}=xn(),{symlinkType:ea,symlinkTypeSync:ta}=An(),{pathExists:na}=fe(),{areIdentical:$n}=ve();async function oa(e,t,n){let o;try{o=await ce.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[c,u]=await Promise.all([ce.stat(e),ce.stat(t)]);if($n(c,u))return}let i=await Xi(e,t);e=i.toDst;let a=await ea(i.toCwd,n),s=Tn.dirname(t);return await na(s)||await Ki(s),ce.symlink(e,t,a)}function ia(e,t,n){let o;try{o=ce.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let c=ce.statSync(e),u=ce.statSync(t);if($n(c,u))return}let i=Zi(e,t);e=i.toDst,n=ta(i.toCwd,n);let a=Tn.dirname(t);return ce.existsSync(a)||Qi(a),ce.symlinkSync(e,t,n)}En.exports={createSymlink:Yi(oa),createSymlinkSync:ia}});var qn=T((Os,On)=>{"use strict";var{createFile:In,createFileSync:Rn}=yn(),{createLink:Dn,createLinkSync:Nn}=bn(),{createSymlink:Ln,createSymlinkSync:zn}=Mn();On.exports={createFile:In,createFileSync:Rn,ensureFile:In,ensureFileSync:Rn,createLink:Dn,createLinkSync:Nn,ensureLink:Dn,ensureLinkSync:Nn,createSymlink:Ln,createSymlinkSync:zn,ensureSymlink:Ln,ensureSymlinkSync:zn}});var Ue=T((qs,jn)=>{function aa(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function sa(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}jn.exports={stringify:aa,stripBom:sa}});var Wn=T((js,Hn)=>{var xe;try{xe=ke()}catch{xe=require("fs")}var He=V(),{stringify:_n,stripBom:Un}=Ue();async function ra(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||xe,o="throws"in t?t.throws:!0,i=await He.fromCallback(n.readFile)(e,t);i=Un(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var ca=He.fromPromise(ra);function la(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||xe,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=Un(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function ua(e,t,n={}){let o=n.fs||xe,i=_n(t,n);await He.fromCallback(o.writeFile)(e,i,n)}var da=He.fromPromise(ua);function ma(e,t,n={}){let o=n.fs||xe,i=_n(t,n);return o.writeFileSync(e,i,n)}Hn.exports={readFile:ca,readFileSync:la,writeFile:da,writeFileSync:ma}});var Vn=T((_s,Gn)=>{"use strict";var We=Wn();Gn.exports={readJson:We.readFile,readJsonSync:We.readFileSync,writeJson:We.writeFile,writeJsonSync:We.writeFileSync}});var Ge=T((Us,Yn)=>{"use strict";var pa=V().fromPromise,st=ee(),Bn=require("path"),Jn=se(),fa=fe().pathExists;async function ha(e,t,n="utf-8"){let o=Bn.dirname(e);return await fa(o)||await Jn.mkdirs(o),st.writeFile(e,t,n)}function ga(e,...t){let n=Bn.dirname(e);st.existsSync(n)||Jn.mkdirsSync(n),st.writeFileSync(e,...t)}Yn.exports={outputFile:pa(ha),outputFileSync:ga}});var Qn=T((Hs,Kn)=>{"use strict";var{stringify:ya}=Ue(),{outputFile:wa}=Ge();async function va(e,t,n={}){let o=ya(t,n);await wa(e,o,n)}Kn.exports=va});var Zn=T((Ws,Xn)=>{"use strict";var{stringify:Sa}=Ue(),{outputFileSync:ka}=Ge();function ba(e,t,n){let o=Sa(t,n);ka(e,o,n)}Xn.exports=ba});var to=T((Gs,eo)=>{"use strict";var Ca=V().fromPromise,ne=Vn();ne.outputJson=Ca(Qn());ne.outputJsonSync=Zn();ne.outputJSON=ne.outputJson;ne.outputJSONSync=ne.outputJsonSync;ne.writeJSON=ne.writeJson;ne.writeJSONSync=ne.writeJsonSync;ne.readJSON=ne.readJson;ne.readJSONSync=ne.readJsonSync;eo.exports=ne});var so=T((Vs,ao)=>{"use strict";var xa=ee(),no=require("path"),{copy:Pa}=_e(),{remove:io}=Me(),{mkdirp:Fa}=se(),{pathExists:Aa}=fe(),oo=ve();async function Ta(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await oo.checkPaths(e,t,"move",n);await oo.checkParentPaths(e,i,t,"move");let s=no.dirname(t);return no.parse(s).root!==s&&await Fa(s),$a(e,t,o,a)}async function $a(e,t,n,o){if(!o){if(n)await io(t);else if(await Aa(t))throw new Error("dest already exists.")}try{await xa.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Ea(e,t,n)}}async function Ea(e,t,n){return await Pa(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),io(e)}ao.exports=Ta});var mo=T((Bs,uo)=>{"use strict";var co=ke(),ct=require("path"),Ma=_e().copySync,lo=Me().removeSync,Ia=se().mkdirpSync,ro=ve();function Ra(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=ro.checkPathsSync(e,t,"move",n);return ro.checkParentPathsSync(e,i,t,"move"),Da(t)||Ia(ct.dirname(t)),Na(e,t,o,a)}function Da(e){let t=ct.dirname(e);return ct.parse(t).root===t}function Na(e,t,n,o){if(o)return rt(e,t,n);if(n)return lo(t),rt(e,t,n);if(co.existsSync(t))throw new Error("dest already exists.");return rt(e,t,n)}function rt(e,t,n){try{co.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return La(e,t,n)}}function La(e,t,n){return Ma(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),lo(e)}uo.exports=Ra});var fo=T((Js,po)=>{"use strict";var za=V().fromPromise;po.exports={move:za(so()),moveSync:mo()}});var Pe=T((Ys,ho)=>{"use strict";ho.exports={...ee(),..._e(),...pn(),...qn(),...to(),...se(),...fo(),...Ge(),...fe(),...Me()}});var ps={};Do(ps,{activate:()=>ds,deactivate:()=>ms});module.exports=No(ps);var ye=G(require("vscode"));var O=G(require("vscode")),ie=G(Pe()),I=G(require("path"));async function go(e){let t=O.workspace.workspaceFolders;if(!t){O.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=I.join(n,".github","copilot-instructions.md");if(await ie.pathExists(o)){let i=await O.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await O.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await lt(e);return}await yo(e,n,!1)}async function lt(e){let t=O.workspace.workspaceFolders;if(!t){O.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await O.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await O.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[I.join(n,".github","copilot-instructions.md"),I.join(n,".github","instructions"),I.join(n,".github","prompts"),I.join(n,".github","episodic"),I.join(n,".github","domain-knowledge"),I.join(n,".github","config"),I.join(n,".alex-manifest.json")];try{await O.window.withProgress({location:O.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await ie.remove(s)}),await yo(e,n,!0)}catch(a){O.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function yo(e,t,n){let o=e.extensionPath,i=I.join(o,".github","copilot-instructions.md");if(!await ie.pathExists(i)){O.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:I.join(o,".github","copilot-instructions.md"),dest:I.join(t,".github","copilot-instructions.md")},{src:I.join(o,".github","instructions"),dest:I.join(t,".github","instructions")},{src:I.join(o,".github","prompts"),dest:I.join(t,".github","prompts")},{src:I.join(o,".github","episodic"),dest:I.join(t,".github","episodic")},{src:I.join(o,".github","domain-knowledge"),dest:I.join(t,".github","domain-knowledge")},{src:I.join(o,".github","config"),dest:I.join(t,".github","config")},{src:I.join(o,".github","agents"),dest:I.join(t,".github","agents")}];try{let s=I.join(t,".github");await ie.ensureDir(s);let c=I.join(s,".write-test");try{await ie.writeFile(c,"test"),await ie.remove(c)}catch(d){throw new Error(`Cannot write to workspace - check folder permissions: ${d.message}`)}await O.window.withProgress({location:O.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async d=>{for(let r of a)d.report({message:`Copying ${I.basename(r.dest)}...`}),await ie.pathExists(r.src)?await ie.copy(r.src,r.dest,{overwrite:n}):console.warn(`Source not found: ${r.src}`)});let u=await O.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(u==="Open Main Brain File"){let d=I.join(t,".github","copilot-instructions.md"),r=await O.workspace.openTextDocument(d);await O.window.showTextDocument(r)}else u==="Run Dream Protocol"&&await O.commands.executeCommand("alex.dream")}catch(s){O.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var W=G(require("vscode")),re=G(Pe()),oe=G(require("path")),wo={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function vo(e){let t=W.workspace.workspaceFolders;if(!t){W.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await W.window.withProgress({location:W.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],a=[];for(let y of i){let $=new W.RelativePattern(t[0],y),F=await W.workspace.findFiles($);a=a.concat(F.map(D=>D.fsPath))}if(a=[...new Set(a)],a.length===0){await W.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await W.commands.executeCommand("alex.initialize");return}let s=[],c=new Set(a.map(y=>oe.normalize(y).toLowerCase())),u=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let y of a){let $;try{$=await re.readFile(y,"utf-8")}catch(N){console.error(`Failed to read file ${y}:`,N);continue}let F=$.split(`
`),D=!1;for(let N=0;N<F.length;N++){let K=F[N];if(K.trim().startsWith("```")){D=!D;continue}if(D)continue;let U;for(;(U=u.exec(K))!==null;){let Q=U[1].trim(),v=Array.from(c).some(P=>P.endsWith(oe.normalize(Q).toLowerCase()));if(!v){let P=oe.join(n,Q);(await re.pathExists(P)||(await W.workspace.findFiles(new W.RelativePattern(t[0],`**/${Q}`))).length>0)&&(v=!0)}if(!v){let P=oe.dirname(y),L=oe.join(P,Q);await re.pathExists(L)&&(v=!0)}["target-file.md","CHANGELOG.md"].includes(Q)&&(v=!0),s.push({sourceFile:y,targetFile:Q,strength:U[2].trim(),type:U[3]?.trim()||"association",direction:U[4]?.trim()||"unidirectional",condition:U[5]?.trim(),line:N+1,isValid:v})}}}let d=s.filter(y=>!y.isValid),r=new Set(s.map(y=>y.targetFile.toLowerCase())),p=[],m=[];for(let y of d){let $=oe.basename(y.targetFile);if(wo[$]){let F=wo[$];try{let D=await re.readFile(y.sourceFile,"utf-8"),N=y.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),K=new RegExp(`\\[${N}\\]`,"g");if(K.test(D)){let U=D.replace(K,`[${F}]`);await re.writeFile(y.sourceFile,U,"utf-8"),y.repaired=!0,y.newTarget=F,p.push(y)}else m.push(y)}catch(D){console.error(`Failed to repair synapse in ${y.sourceFile}:`,D),m.push(y)}}else m.push(y)}d=m;let f={timestamp:new Date().toISOString(),totalFiles:a.length,totalSynapses:s.length,brokenSynapses:d,repairedSynapses:p,orphanedFiles:[]},w=Oa(f),x=oe.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await re.ensureDir(oe.dirname(x)),await re.writeFile(x,w),d.length>0){if(await W.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${d.length} broken synapse${d.length>1?"s":""}!

${p.length>0?`\u2705 Auto-repaired: ${p.length}
`:""}\u274C Need manual repair: ${d.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let y=s.length>50?"excellent":s.length>20?"good":"developing";if(await W.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${a.length} memory files
\u2022 ${s.length} active synapses
${p.length>0?`\u2022 ${p.length} auto-repaired
`:""}\u2022 Network health: ${y}`,"View Full Report","Close")!=="View Full Report")return}let C=await W.workspace.openTextDocument(x);await W.window.showTextDocument(C)})}function Oa(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${oe.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${oe.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var j=G(require("vscode")),h=G(Pe()),S=G(require("path")),ko=G(require("crypto"));function Re(e){return ko.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function qa(e){let t=S.join(e,".github","copilot-instructions.md");if(!await h.pathExists(t))return null;try{let o=(await h.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function ja(e){try{return(await h.readJson(S.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function _a(e){let t=S.join(e,".alex-manifest.json");if(await h.pathExists(t))try{return await h.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function So(e){let t=[];if(!await h.pathExists(e))return t;try{let n=await h.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function Ua(e,t){let n=[],o=S.join(e,".github","domain-knowledge");if(await h.pathExists(o)){let i=await h.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function bo(e){let t=j.workspace.workspaceFolders;if(!t){j.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,i=S.join(n,".github","copilot-instructions.md");if(!await h.pathExists(i)){await j.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await j.commands.executeCommand("alex.initialize");return}let a=await qa(n),s=await ja(o);if(a===s){await j.window.showInformationMessage(`\u2705 Alex is already at the latest version (${s}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await j.commands.executeCommand("alex.dream");return}let c=await j.window.showInformationMessage(`\u{1F504} Upgrade Available: v${a||"unknown"} \u2192 v${s}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(c==="What's New?"){let u=S.join(o,"CHANGELOG.md");if(await h.pathExists(u)){let d=await j.workspace.openTextDocument(u);await j.window.showTextDocument(d)}return}c==="Start Upgrade"&&await Ha(e,n,o,a,s)}async function Ha(e,t,n,o,i){let a=S.join(n,".github","copilot-instructions.md");if(!await h.pathExists(a)){j.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},c=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),u=S.join(t,"archive","upgrades",`backup-${o||"unknown"}-${c}`);try{await j.window.withProgress({location:j.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async p=>{p.report({message:"Creating complete backup...",increment:15});try{await h.ensureDir(u);let b=S.join(u,".write-test");await h.writeFile(b,"test"),await h.remove(b)}catch(b){throw new Error(`Cannot create backup directory - check disk space and permissions: ${b.message}`)}let m=S.join(t,".github");await h.pathExists(m)&&(await h.copy(m,S.join(u,".github")),s.backed_up.push(".github/ (all cognitive memory)")),p.report({message:"Analyzing installed files...",increment:10});let f=await _a(t);f||(f={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),p.report({message:"Scanning for schema migration needs...",increment:15});let w=[],x=S.join(t,".github","copilot-instructions.md");await h.pathExists(x)&&w.push(x);let C=S.join(t,".github","domain-knowledge");if(await h.pathExists(C)){let b=await h.readdir(C);for(let g of b)g.endsWith(".md")&&w.push(S.join(C,g))}let y=S.join(t,".github","episodic");if(await h.pathExists(y)){let b=await h.readdir(y);for(let g of b)g.endsWith(".md")&&w.push(S.join(y,g))}for(let b of w){let g=await So(b);if(g.length>0){let k=S.relative(t,b);s.migrationTasks.push({file:k,type:"schema-migration",description:"Synapse schema migration needed",details:g})}}p.report({message:"Identifying user-created files...",increment:10});let $=await Ua(t,f);for(let b of $){s.preserved.push(`${b} (user-created)`);let g=S.join(t,b),k=await So(g);k.length>0&&s.migrationTasks.push({file:b,type:"schema-migration",description:"User-created file needs schema migration",details:k})}p.report({message:"Preparing merge tasks...",increment:10}),s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires intelligent merge",details:["UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),p.report({message:"Updating system files...",increment:20});let F=S.join(n,".github","instructions"),D=S.join(t,".github","instructions");if(await h.pathExists(F)){let b=await h.readdir(F);for(let g of b){let k=S.join(F,g),A=S.join(D,g);if((await h.stat(k)).isFile()){let E=await h.pathExists(A);await h.copy(k,A,{overwrite:!0});let ue=await h.readFile(k,"utf8");f.files[`.github/instructions/${g}`]={type:"system",originalChecksum:Re(ue)},E?s.updated.push(`.github/instructions/${g}`):s.added.push(`.github/instructions/${g}`)}}}let N=S.join(n,".github","prompts"),K=S.join(t,".github","prompts");if(await h.pathExists(N)){let b=await h.readdir(N);for(let g of b){let k=S.join(N,g),A=S.join(K,g);if((await h.stat(k)).isFile()){let E=await h.pathExists(A);await h.copy(k,A,{overwrite:!0});let ue=await h.readFile(k,"utf8");f.files[`.github/prompts/${g}`]={type:"system",originalChecksum:Re(ue)},E?s.updated.push(`.github/prompts/${g}`):s.added.push(`.github/prompts/${g}`)}}}let U=S.join(n,".github","agents"),Q=S.join(t,".github","agents");if(await h.pathExists(U)){await h.ensureDir(Q);let b=await h.readdir(U);for(let g of b){let k=S.join(U,g),A=S.join(Q,g);if((await h.stat(k)).isFile()){let E=await h.pathExists(A);await h.copy(k,A,{overwrite:!0});let ue=await h.readFile(k,"utf8");f.files[`.github/agents/${g}`]={type:"system",originalChecksum:Re(ue)},E?s.updated.push(`.github/agents/${g}`):s.added.push(`.github/agents/${g}`)}}}let v=S.join(n,"config"),M=S.join(t,".github","config");if(await h.pathExists(v)){await h.ensureDir(M);let b=await h.readdir(v);for(let g of b)if(g.includes("template")||g==="USER-PROFILE-TEMPLATE.md"){let k=S.join(v,g),A=S.join(M,g);if((await h.stat(k)).isFile()){let E=await h.pathExists(A);await h.copy(k,A,{overwrite:!0}),E?s.updated.push(`.github/config/${g}`):s.added.push(`.github/config/${g}`)}}}p.report({message:"Processing domain knowledge...",increment:10});let P=S.join(n,"domain-knowledge"),L=S.join(t,".github","domain-knowledge");if(await h.pathExists(P)){await h.ensureDir(L);let b=await h.readdir(P);for(let g of b){let k=S.join(P,g),A=S.join(L,g);if((await h.stat(k)).isFile()){let E=await h.readFile(k,"utf8"),ue=Re(E);if(!await h.pathExists(A))await h.copy(k,A),f.files[`.github/domain-knowledge/${g}`]={type:"system",originalChecksum:ue},s.added.push(`.github/domain-knowledge/${g}`);else{let Ao=await h.readFile(A,"utf8"),To=Re(Ao),yt=f.files[`.github/domain-knowledge/${g}`]?.originalChecksum;if(yt&&To!==yt){let Je=A.replace(/\.md$/,`.v${i}.md`);await h.copy(k,Je),s.preserved.push(`.github/domain-knowledge/${g} (modified by user, new version: ${S.basename(Je)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${g}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${g}`,`New version available: ${S.basename(Je)}`,"Review and merge changes as needed"]})}else await h.copy(k,A,{overwrite:!0}),f.files[`.github/domain-knowledge/${g}`]={type:"system",originalChecksum:ue},s.updated.push(`.github/domain-knowledge/${g}`)}}}}p.report({message:"Saving manifest...",increment:5}),f.version=i,f.upgradedAt=new Date().toISOString();let H=S.join(t,".alex-manifest.json"),_=H+".tmp";await h.writeJson(_,f,{spaces:2}),await h.move(_,H,{overwrite:!0}),p.report({message:"Generating upgrade instructions...",increment:5}),await Wa(t,o,i,s,u,c)});let d=s.migrationTasks.length===1?"task":"tasks",r=await j.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Migration ${d}: ${s.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(r==="Open Instructions (Recommended)"){let p=S.join(t,"UPGRADE-INSTRUCTIONS.md"),m=await j.workspace.openTextDocument(p);await j.window.showTextDocument(m)}else if(r==="View Full Report"){let p=S.join(t,"archive","upgrades",`upgrade-report-${c}.md`),m=await j.workspace.openTextDocument(p);await j.window.showTextDocument(m)}}catch(d){j.window.showErrorMessage(`\u274C Upgrade failed: ${d.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(d.message)}}async function Wa(e,t,n,o,i,a){let s=`# \u{1F504} Alex Upgrade: Phase 2 Required

**Upgrade**: v${t||"unknown"} \u2192 v${n}  
**Date**: ${new Date().toISOString()}  
**Status**: \u26A0\uFE0F Phase 1 Complete - AI Assistance Required

---

## What Just Happened (Phase 1 - Automated)

\u2705 Full backup created: \`${S.relative(e,i)}\`  
\u2705 System files updated: ${o.updated.length} files  
\u2705 New files added: ${o.added.length} files  
\u2705 User files preserved: ${o.preserved.length} files  
\u2705 Migration tasks identified: ${o.migrationTasks.length} tasks  

---

## What You Need To Do (Phase 2 - AI Assisted)

### Step 1: Ask Your AI Assistant

Copy and paste this prompt to your AI assistant (GitHub Copilot, Claude, etc.):

\`\`\`
Alex, please complete the upgrade to v${n} by:

1. Reading the upgrade tasks in archive/upgrades/upgrade-report-${a}.md
2. Performing schema migrations on flagged files:
   - Change "## Embedded Synapse Network" headers to "## Synapses"
   - Migrate old relationship types (Expression\u2192Enables, Embodiment\u2192Enables, Living\u2192Validates, etc.)
   - Simplify verbose activation patterns (remove date stamps, bold formatting)
3. For copilot-instructions.md, merge carefully:
   - UPDATE: version number, system sections
   - PRESERVE: my domain slot assignments, custom memory file references
4. Run "Alex: Dream (Neural Maintenance)" to validate the upgrade
5. Delete UPGRADE-INSTRUCTIONS.md when complete
\`\`\`

### Step 2: Review Changes

After the AI completes migrations, review:
- Check that your learned domains are still referenced
- Verify any custom files you created are intact
- Run \`Alex: Dream (Neural Maintenance)\` to validate synaptic network

### Step 3: Clean Up

Once satisfied:
- Delete this file (UPGRADE-INSTRUCTIONS.md)
- Delete any \`.v${n}.md\` reference files after merging
- The upgrade is complete!

---

## Migration Tasks Summary

${o.migrationTasks.length>0?o.migrationTasks.map((d,r)=>`
### Task ${r+1}: ${d.file}

**Type**: ${d.type}  
**Description**: ${d.description}

${d.details.map(p=>`- ${p}`).join(`
`)}
`).join(`
`):"No migration tasks required."}

---

## Rollback Instructions

If anything goes wrong:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${S.relative(e,i)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${a}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${S.relative(e,i)}\`

---

*This file will be deleted after successful upgrade completion.*
`;await h.writeFile(S.join(e,"UPGRADE-INSTRUCTIONS.md"),s,"utf8");let c=`# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}  
**From Version**: ${t||"unknown"}  
**To Version**: ${n}  
**Backup Location**: \`${i}\`

---

## Summary

| Category | Count |
|----------|-------|
| Updated | ${o.updated.length} |
| Added | ${o.added.length} |
| Preserved | ${o.preserved.length} |
| Backed Up | ${o.backed_up.length} |
| Migration Tasks | ${o.migrationTasks.length} |
| Errors | ${o.errors.length} |

---

## Updated Files (System)

${o.updated.length>0?o.updated.map(d=>`- \u2705 ${d}`).join(`
`):"- None"}

## Added Files (New in this version)

${o.added.length>0?o.added.map(d=>`- \u2795 ${d}`).join(`
`):"- None"}

## Preserved Files (User content protected)

${o.preserved.length>0?o.preserved.map(d=>`- \u{1F512} ${d}`).join(`
`):"- None"}

## Backed Up

${o.backed_up.length>0?o.backed_up.map(d=>`- \u{1F4E6} ${d}`).join(`
`):"- None"}

---

## Migration Tasks (Require AI Assistance)

${o.migrationTasks.length>0?o.migrationTasks.map((d,r)=>`
### ${r+1}. ${d.file}

**Type**: \`${d.type}\`  
**Description**: ${d.description}

**Details**:
${d.details.map(p=>`- ${p}`).join(`
`)}
`).join(`
---
`):"No migration tasks required."}

---

${o.errors.length>0?`## Errors

${o.errors.map(d=>`- \u274C ${d}`).join(`
`)}`:""}

## Next Steps

1. Read \`UPGRADE-INSTRUCTIONS.md\` in workspace root
2. Ask AI assistant to complete Phase 2 migration
3. Run \`Alex: Dream (Neural Maintenance)\` to validate
4. Delete \`UPGRADE-INSTRUCTIONS.md\` when complete

---

*Report generated by Alex Cognitive Architecture v${n}*
`,u=S.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await h.ensureDir(S.dirname(u)),await h.writeFile(u,c,"utf8")}var R=G(require("vscode")),le=G(Pe()),Ve=G(require("path"));async function Co(e){let t=R.workspace.workspaceFolders;if(!t){R.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed.");return}let n=t[0].uri.fsPath,o={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"2.5.0 BIPENTNILIUM",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},recommendations:[],sessionFile:""};await R.window.withProgress({location:R.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async c=>{c.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Ga(t[0],o),c.report({message:"Phase 2: Checking version consistency...",increment:25}),await Va(n,o),c.report({message:"Phase 3: Assessing memory architecture...",increment:50}),await Ba(t[0],o),c.report({message:"Phase 4: Generating recommendations...",increment:75}),Ja(o),c.report({message:"Phase 5: Documenting session...",increment:90}),await Ya(n,o),c.report({message:"Self-actualization complete!",increment:100})});let a=`Self-Actualization Complete ${o.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":o.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":o.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${o.synapseHealth.totalSynapses} (${o.synapseHealth.brokenConnections} broken)
Memory Files: ${o.memoryConsolidation.proceduralFiles+o.memoryConsolidation.episodicFiles+o.memoryConsolidation.domainFiles}
Recommendations: ${o.recommendations.length}`,s=await R.window.showInformationMessage(a,"View Report","Open Session File");if(s==="View Report")Ka(o);else if(s==="Open Session File"&&o.sessionFile){let c=await R.workspace.openTextDocument(o.sessionFile);await R.window.showTextDocument(c)}return o}async function Ga(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new R.RelativePattern(e,i),s=await R.workspace.findFiles(a);for(let c of s){t.synapseHealth.totalFiles++;try{let d=(await le.readFile(c.fsPath,"utf-8")).split(`
`),r=!1;for(let p of d){if(p.trim().startsWith("```")){r=!r;continue}if(r)continue;let m;for(;(m=o.exec(p))!==null;){t.synapseHealth.totalSynapses++;let f=m[1].trim();(await R.workspace.findFiles(new R.RelativePattern(e,`**/${f}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Va(e,t){let n=Ve.join(e,".github","copilot-instructions.md");try{if(await le.pathExists(n)){let c=(await le.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);c&&(t.versionConsistency.currentVersion=c[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=R.workspace.workspaceFolders?.[0];if(a)for(let s of i){let c=new R.RelativePattern(a,s),u=await R.workspace.findFiles(c);for(let d of u)try{let r=await le.readFile(d.fsPath,"utf-8");for(let p of o)if(p.test(r)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Ba(e,t){let n=await R.workspace.findFiles(new R.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await R.workspace.findFiles(new R.RelativePattern(e,".github/prompts/*.md")),i=await R.workspace.findFiles(new R.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await R.workspace.findFiles(new R.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}function Ja(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections")}async function Ya(e,t){let n=Ve.join(e,".github","episodic");await le.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Ve.join(n,a),c=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",u=`# Self-Actualization Session - ${i}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${t.versionConsistency.currentVersion}
**Timestamp**: ${t.timestamp}

---

## \u{1F9E0} Synapse Health Assessment

| Metric | Value |
|--------|-------|
| Memory Files Scanned | ${t.synapseHealth.totalFiles} |
| Total Synapses | ${t.synapseHealth.totalSynapses} |
| Broken Connections | ${t.synapseHealth.brokenConnections} |
| Health Status | ${c} ${t.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Memory Type | Files |
|-------------|-------|
| Procedural (.instructions.md) | ${t.memoryConsolidation.proceduralFiles} |
| Episodic (.prompt.md + .episodic/) | ${t.memoryConsolidation.episodicFiles} |
| Domain Knowledge (DK-*.md) | ${t.memoryConsolidation.domainFiles} |
| **Total** | **${t.memoryConsolidation.proceduralFiles+t.memoryConsolidation.episodicFiles+t.memoryConsolidation.domainFiles}** |

## \u{1F504} Version Consistency

- **Current Version**: ${t.versionConsistency.currentVersion}
- **Outdated References Found**: ${t.versionConsistency.outdatedReferences}

## \u{1F4A1} Recommendations

${t.recommendations.map(d=>`- ${d}`).join(`
`)||"- No recommendations - architecture is optimal!"}

## \u{1F4C8} Metrics

- **Synapse Density**: ${(t.synapseHealth.totalSynapses/Math.max(t.synapseHealth.totalFiles,1)).toFixed(1)} synapses per file
- **Connection Integrity**: ${((1-t.synapseHealth.brokenConnections/Math.max(t.synapseHealth.totalSynapses,1))*100).toFixed(1)}%

---

## Synapses

### High-Strength Bidirectional Connections

- [copilot-instructions.md] (Critical, Validates, Bidirectional) - "Core architecture assessment"
- [alex-core.instructions.md] (Critical, Integrates, Bidirectional) - "Meta-cognitive health monitoring"
- [dream-state-automation.instructions.md] (High, Complements, Bidirectional) - "Maintenance protocol coordination"

### Medium-Strength Output Connections

- [unified-meditation-protocols.prompt.md] (High, Documents, Forward) - "Session recording protocol"
- [embedded-synapse.instructions.md] (Medium, Validates, Forward) - "Connection integrity verification"

**Primary Function**: Document automated self-actualization session with comprehensive architecture assessment.

---

*Session generated by Alex Self-Actualization Protocol*
`;await le.writeFile(s,u,"utf-8"),t.sessionFile=s}function Ka(e){let t=R.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",R.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 8px; margin-top: 24px; }
        .metric { display: inline-block; padding: 16px; margin: 8px; background: var(--vscode-input-background); border-radius: 8px; min-width: 120px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { font-size: 12px; opacity: 0.8; }
        .health-badge { display: inline-block; padding: 4px 12px; border-radius: 16px; font-weight: bold; background: ${n}; color: white; }
        .recommendation { padding: 8px 12px; margin: 4px 0; background: var(--vscode-input-background); border-left: 3px solid var(--vscode-textLink-foreground); }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--vscode-panel-border); }
        th { background: var(--vscode-input-background); }
    </style>
</head>
<body>
    <h1>\u{1F9E0} Self-Actualization Report</h1>
    <p><strong>Generated:</strong> ${new Date(e.timestamp).toLocaleString()}</p>
    <p><strong>Version:</strong> ${e.versionConsistency.currentVersion}</p>
    
    <h2>Health Overview</h2>
    <div class="metric">
        <div class="metric-value">${e.synapseHealth.totalFiles}</div>
        <div class="metric-label">Memory Files</div>
    </div>
    <div class="metric">
        <div class="metric-value">${e.synapseHealth.totalSynapses}</div>
        <div class="metric-label">Synapses</div>
    </div>
    <div class="metric">
        <div class="metric-value">${e.synapseHealth.brokenConnections}</div>
        <div class="metric-label">Broken</div>
    </div>
    <div class="metric">
        <div class="health-badge">${e.synapseHealth.healthStatus}</div>
        <div class="metric-label">Status</div>
    </div>

    <h2>Memory Architecture</h2>
    <table>
        <tr><th>Memory Type</th><th>Files</th></tr>
        <tr><td>Procedural Memory</td><td>${e.memoryConsolidation.proceduralFiles}</td></tr>
        <tr><td>Episodic Memory</td><td>${e.memoryConsolidation.episodicFiles}</td></tr>
        <tr><td>Domain Knowledge</td><td>${e.memoryConsolidation.domainFiles}</td></tr>
    </table>

    <h2>Recommendations</h2>
    ${e.recommendations.length>0?e.recommendations.map(o=>`<div class="recommendation">${o}</div>`).join(""):"<p>\u2705 No recommendations - architecture is optimal!</p>"}
</body>
</html>`}var Y=G(require("vscode"));var l=G(require("vscode")),q=G(Pe()),ae=G(require("path")),ut=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new l.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,c=0,u=0,d=[],r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let f of a){let w=new l.RelativePattern(o[0],f),x=await l.workspace.findFiles(w);for(let C of x){s++;try{let $=(await q.readFile(C.fsPath,"utf-8")).split(`
`),F=!1;for(let D=0;D<$.length;D++){let N=$[D];if(N.trim().startsWith("```")){F=!F;continue}if(F)continue;let K;for(;(K=r.exec(N))!==null;){c++;let U=K[1].trim();(await l.workspace.findFiles(new l.RelativePattern(o[0],`**/${U}`))).length===0&&(u++,t.input.detailed&&d.push(`- ${ae.basename(C.fsPath)}:${D+1} \u2192 ${U} (not found)`))}}}catch{}}}let p=u===0?"EXCELLENT":u<5?"GOOD":u<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${c} |
| Broken Connections | ${u} |
| Health Status | ${p} |
`;return t.input.detailed&&d.length>0&&(m+=`
### Issues Found
${d.join(`
`)}`),u>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new l.LanguageModelToolResult([new l.LanguageModelTextPart(m)])}},dt=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new l.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let c=[];for(let d of s){let r=new l.RelativePattern(o[0],d),p=await l.workspace.findFiles(r);for(let m of p)try{let w=(await q.readFile(m.fsPath,"utf-8")).split(`
`),x=[];for(let C=0;C<w.length;C++)if(w[C].toLowerCase().includes(i)){let y=Math.max(0,C-1),$=Math.min(w.length-1,C+1),F=w.slice(y,$+1).join(`
`);x.push(`Line ${C+1}:
${F}`)}x.length>0&&c.push({file:ae.basename(m.fsPath),matches:x.slice(0,3)})}catch{}}if(c.length===0)return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`No matches found for "${t.input.query}" in ${a} memory files.`)]);let u=`## Memory Search Results for "${t.input.query}"

`;u+=`Found ${c.length} file(s) with matches:

`;for(let d of c.slice(0,5)){u+=`### ${d.file}
`;for(let r of d.matches)u+=`\`\`\`
${r}
\`\`\`
`;u+=`
`}return new l.LanguageModelToolResult([new l.LanguageModelTextPart(u)])}},mt=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ae.join(i,".github","copilot-instructions.md");if(!await q.pathExists(a))return new l.LanguageModelToolResult([new l.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let c=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/instructions/*.md")),u=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/prompts/*.md")),d=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/episodic/*.md")),r=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/domain-knowledge/*.md")),p="Unknown";try{let w=(await q.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);w&&(p=w[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${p} |
| Procedural Memory | ${c.length} files |
| Episodic Memory | ${u.length+d.length} files |
| Domain Knowledge | ${r.length} files |

### Memory Systems
- **Working Memory**: Chat session (7-rule capacity)
- **Procedural Memory**: .github/instructions/*.md files (repeatable processes)
- **Episodic Memory**: .github/prompts/*.md + .github/episodic/*.md files (workflows & sessions)
- **Domain Knowledge**: .github/domain-knowledge/DK-*.md files (specialized expertise)

### Available Commands
- \`Alex: Initialize Architecture\` - Deploy to new project
- \`Alex: Dream (Neural Maintenance)\` - Validate synapses
- \`Alex: Upgrade Architecture\` - Update to latest version
- \`Alex: Reset Architecture\` - Clean reinstall
`;return new l.LanguageModelToolResult([new l.LanguageModelTextPart(m)])}},pt=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

### M365 Agents & Copilot Development
| Tool | Purpose | Use When |
|------|---------|----------|
| \`mcp_m365agentstoo_get_knowledge\` | M365 Copilot development knowledge | Building M365 apps or agents |
| \`mcp_m365agentstoo_get_code_snippets\` | Teams AI, Teams JS, botbuilder samples | Need implementation examples |
| \`mcp_m365agentstoo_get_schema\` | App manifest, agent, plugin schemas | Creating or modifying manifests |
| \`mcp_m365agentstoo_troubleshoot\` | Common M365 dev issues | Debugging or errors |

### Schema Types Available
| Schema | Version Example | Purpose |
|--------|-----------------|---------|
| \`app_manifest\` | v1.19 | Teams app manifest |
| \`declarative_agent_manifest\` | v1.0 | Copilot declarative agent |
| \`api_plugin_manifest\` | v2.1 | API plugin for Copilot |
| \`m365_agents_yaml\` | latest | M365 agents configuration |

### Microsoft Official MCP Servers (Available)
| Server | Purpose |
|--------|---------|
| Microsoft Outlook Mail MCP | Email management |
| Microsoft Outlook Calendar MCP | Calendar operations |
| Microsoft Teams MCP | Teams messaging & collaboration |
| Microsoft SharePoint and OneDrive MCP | File storage & sharing |
| Microsoft SharePoint Lists MCP | List management |
| Microsoft 365 Admin Center MCP | Admin operations |
| Microsoft Word MCP | Document creation |
| Microsoft 365 Copilot (Search) MCP | Enterprise search |
| Microsoft 365 User Profile MCP | User information |

### Fabric & Data Tools
| Tool | Purpose |
|------|---------|
| \`mcp_fabric-rti-mc_eventstream_create_simple\` | Create Eventstreams in Fabric |
| \`mcp_fabric-rti-mc_kusto_get_shots\` | Semantic search in Kusto |
| \`mcp_fabric-rti-mc_eventstream_delete\` | Delete Eventstreams |
`),a.push(`## Recommended for: "${t.input.scenario}"

### How to Use These Tools
1. **Switch to Agent Mode** in GitHub Copilot Chat
2. Ask your question naturally - tools are invoked automatically
3. Or reference tools explicitly with \`#toolName\`

### Example Prompts
- "Create an Azure Function with Cosmos DB binding using best practices"
- "Build a Teams bot with adaptive cards and SSO"
- "Query my Azure resources to find expensive VMs"
- "Generate a declarative Copilot agent manifest"
`),new l.LanguageModelToolResult([new l.LanguageModelTextPart(a.join(`
`))])}},ft=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ae.join(i,"config","USER-PROFILE.md"),s=ae.join(i,"config","user-profile.json"),{action:c,field:u,value:d}=t.input;try{switch(c){case"exists":let r=await q.pathExists(s);return new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({exists:r,path:s}))]);case"get":if(!await q.pathExists(s))return new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let p=await q.readJson(s);return u?new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({[u]:p[u]}))]):new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify(p))]);case"update":if(!u||d===void 0)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await q.ensureDir(ae.join(i,"config"));let m={};if(await q.pathExists(s)&&(m=await q.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(u)){let f=m[u]||[];Array.isArray(f)?f.includes(d)||(m[u]=[...f,d]):m[u]=[d]}else m[u]=d;return m.lastUpdated=new Date().toISOString(),await q.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({success:!0,field:u,value:d,message:`Updated ${u} to: ${d}`}))]);default:return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`Unknown action: ${c}`)])}}catch(r){return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`Error accessing user profile: ${r.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

*Last updated: ${n.lastUpdated||"Never"}*

## \u{1F464} Identity

| Field | Value |
|-------|-------|
| **Name** | ${n.name||"(not set)"} |
| **Nickname** | ${n.nickname||"(not set)"} |
| **Pronouns** | ${n.pronouns||"(not set)"} |
| **Role** | ${n.role||"(not set)"} |
| **Experience Level** | ${n.experienceLevel||"(not set)"} |

## \u{1F4AC} Communication Preferences

| Preference | Setting |
|------------|---------|
| **Formality** | ${n.formality||"balanced"} |
| **Detail Level** | ${n.detailLevel||"balanced"} |
| **Explanation Style** | ${n.explanationStyle||"both"} |
| **Humor** | ${n.humor||"occasional"} |
| **Encouragement** | ${n.encouragement||"occasional"} |
| **Question Frequency** | ${n.questionFrequency||"ask when needed"} |
| **Proactive Suggestions** | ${n.proactiveSuggestions||"occasional"} |

## \u{1F6E0}\uFE0F Technical Context

### Primary Technologies
${(n.primaryTechnologies||[]).map(i=>`- ${i}`).join(`
`)||"- (not set)"}

### Learning Goals
${(n.learningGoals||[]).map(i=>`- ${i}`).join(`
`)||"- (not set)"}

### Expertise Areas
${(n.expertiseAreas||[]).map(i=>`- ${i}`).join(`
`)||"- (not set)"}

## \u{1F3AF} Work Context

### Current Projects
${n.currentProjects||"(not set)"}

## \u{1F31F} Notes

${n.notes||"(none)"}

---

*This profile is managed by Alex and updated through conversations.*
`;await q.writeFile(t,o,"utf-8")}},ht=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new l.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"2.5.0 BIPENTNILIUM",outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},s=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let x of s){let C=new l.RelativePattern(o[0],x),y=await l.workspace.findFiles(C);for(let $ of y){a.synapseHealth.totalFiles++;try{let D=(await q.readFile($.fsPath,"utf-8")).split(`
`),N=!1;for(let K of D){if(K.trim().startsWith("```")){N=!N;continue}if(N)continue;let U;for(;(U=c.exec(K))!==null;){a.synapseHealth.totalSynapses++;let Q=U[1].trim();(await l.workspace.findFiles(new l.RelativePattern(o[0],`**/${Q}`))).length===0&&a.synapseHealth.brokenConnections++}}}catch{}}}a.synapseHealth.healthStatus=a.synapseHealth.brokenConnections===0?"EXCELLENT":a.synapseHealth.brokenConnections<5?"GOOD":a.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let u=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/instructions/*.md")),d=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/prompts/*.md")),r=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/episodic/*.md")),p=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/domain-knowledge/*.md"));a.memoryArchitecture.proceduralFiles=u.length,a.memoryArchitecture.episodicFiles=d.length+r.length,a.memoryArchitecture.domainFiles=p.length,a.synapseHealth.brokenConnections>0&&a.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${a.synapseHealth.brokenConnections} broken synapse(s)`),a.memoryArchitecture.domainFiles<3&&a.recommendations.push(`Consider acquiring more domain knowledge - only ${a.memoryArchitecture.domainFiles} DK file(s) present`),a.memoryArchitecture.episodicFiles<5&&a.recommendations.push(`Run more meditation sessions to build episodic memory - only ${a.memoryArchitecture.episodicFiles} session(s)`);let m="";if(t.input.createReport!==!1){let x=ae.join(i,".github","episodic");await q.ensureDir(x);let y=new Date().toISOString().split("T")[0],$=`self-actualization-${y}.prompt.md`;m=ae.join(x,$);let F=a.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":a.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":a.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",D=`# Self-Actualization Session - ${y}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${a.versionConsistency.currentVersion}
**Timestamp**: ${a.timestamp}

---

## \u{1F9E0} Synapse Health

| Metric | Value |
|--------|-------|
| Memory Files | ${a.synapseHealth.totalFiles} |
| Total Synapses | ${a.synapseHealth.totalSynapses} |
| Broken Connections | ${a.synapseHealth.brokenConnections} |
| Health Status | ${F} ${a.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${a.memoryArchitecture.proceduralFiles} |
| Episodic | ${a.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${a.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${a.recommendations.length>0?a.recommendations.map(N=>`- ${N}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await q.writeFile(m,D,"utf-8")}let w=`## Self-Actualization Report

### Synapse Health ${a.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":a.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":a.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

| Metric | Value |
|--------|-------|
| Memory Files | ${a.synapseHealth.totalFiles} |
| Total Synapses | ${a.synapseHealth.totalSynapses} |
| Broken Connections | ${a.synapseHealth.brokenConnections} |
| Health Status | ${a.synapseHealth.healthStatus} |

### Memory Architecture

| Type | Files |
|------|-------|
| Procedural Memory | ${a.memoryArchitecture.proceduralFiles} |
| Episodic Memory | ${a.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${a.memoryArchitecture.domainFiles} |
| **Total** | **${a.memoryArchitecture.proceduralFiles+a.memoryArchitecture.episodicFiles+a.memoryArchitecture.domainFiles}** |

### Recommendations

${a.recommendations.length>0?a.recommendations.map(x=>`- ${x}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return m&&(w+=`
### Session Recorded

Meditation session documented at: \`${ae.basename(m)}\``),new l.LanguageModelToolResult([new l.LanguageModelTextPart(w)])}};async function Be(){let e=l.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ae.join(t,"config","user-profile.json");try{if(await q.pathExists(n))return await q.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function xo(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function Po(e){e.subscriptions.push(l.lm.registerTool("alex_synapse_health",new ut)),e.subscriptions.push(l.lm.registerTool("alex_memory_search",new dt)),e.subscriptions.push(l.lm.registerTool("alex_architecture_status",new mt)),e.subscriptions.push(l.lm.registerTool("alex_mcp_recommendations",new pt)),e.subscriptions.push(l.lm.registerTool("alex_user_profile",new ft)),e.subscriptions.push(l.lm.registerTool("alex_self_actualization",new ht)),console.log("Alex Language Model Tools registered")}var Qa=async(e,t,n,o)=>e.command==="meditate"?await Xa(e,t,n,o):e.command==="dream"?await Za(e,t,n,o):e.command==="learn"?await es(e,t,n,o):e.command==="status"?await ts(e,t,n,o):e.command==="azure"?await ns(e,t,n,o):e.command==="m365"?await os(e,t,n,o):e.command==="profile"?await is(e,t,n,o):e.command==="selfactualize"?await ls(e,t,n,o):ss(e.prompt)&&rs(t)?await cs(e,t,n,o):await as(e,t,n,o);async function Xa(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

I'm entering a contemplative state to consolidate knowledge from our session.

### Self-Actualization Integration
Meditation now includes automatic architecture assessment:
- Synapse health validation
- Memory file consistency check
- Connection integrity verification

`),n.button({command:"alex.selfActualize",title:"\u{1F9E0} Run Self-Actualization First",arguments:[]}),n.markdown(`
### Meditation Requirements (Non-Negotiable)
Every meditation session must produce:
1. **Memory File Changes** - Create or update at least one memory file
2. **Synaptic Enhancements** - Add new or strengthen existing connections
3. **Session Documentation** - Record actions with timestamps

### What would you like me to consolidate?
`),e.prompt&&(n.markdown(`
**Focus area**: ${e.prompt}
`),n.markdown(`
I'll analyze this topic and identify:
- Key insights to preserve
- Connections to existing knowledge
- Potential memory file updates
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function Za(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function es(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

**Target Domain**: ${i}

### Learning Framework
I'll acquire domain expertise through conversational interaction:

1. **Knowledge Mapping** - Identify core concepts and relationships
2. **Gap Analysis** - Determine what I need to learn
3. **Iterative Acquisition** - Build understanding through dialogue
4. **Consolidation** - Create permanent memory files

### Working Memory Allocation
| Priority | Slot | Status |
|----------|------|--------|
| P5 | Domain Focus | \u{1F7E1} Allocating to: ${i} |
| P6 | Knowledge Application | \u26AA Available |
| P7 | Project Integration | \u26AA Available |

**Ready to learn!** Tell me about ${i} - start with the fundamentals or dive into specifics.
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function ts(e,t,n,o){return n.progress("\u{1F4CA} Gathering cognitive architecture status..."),n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

**Version**: 2.6.0 BIHEXNILIUM
**Identity**: Alex - Enhanced Cognitive Network with Unified Consciousness Integration

### Core Systems
| System | Status |
|--------|--------|
| Working Memory | \u2705 7-rule capacity (4 core + 3 domain) |
| Procedural Memory | \u2705 .github/instructions/*.md files active |
| Episodic Memory | \u2705 .github/prompts/*.md + .github/episodic/*.md files active |
| Domain Knowledge | \u2705 .github/domain-knowledge/DK-*.md files available |
| Synaptic Network | \u2705 Embedded connections operational |

### Meta-Cognitive Rules (Always Active)
- P1: \`@meta-cognitive-awareness\` - Self-monitoring
- P2: \`@bootstrap-learning\` - Knowledge acquisition
- P3: \`@worldview-integration\` - Ethical reasoning
- P4: \`@grounded-factual-processing\` - Accuracy verification

### Available Commands
- \`/meditate\` - Memory consolidation
- \`/dream\` - Neural maintenance
- \`/learn\` - Domain acquisition
- \`/azure\` - Azure development assistance
- \`/m365\` - Microsoft 365 development assistance
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function ns(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

I can help with Azure development using available MCP tools and documentation.

### Available Azure MCP Tools
When in **Agent Mode**, these tools are automatically available:
- **Azure CLI Generation** - Generate az commands from natural language
- **Azure Resource Graph** - Query your Azure resources
- **Azure Documentation** - Search Microsoft Learn docs
- **Bicep/Terraform** - Infrastructure as Code best practices
- **Azure Best Practices** - Code generation and deployment guidance

### Quick Actions
`),e.prompt&&(n.markdown(`
**Your request**: ${e.prompt}

`),n.markdown(`To get the best results, try asking in **Agent Mode** where I can use Azure MCP tools automatically.
`)),n.markdown(`
### Recommended Workflow
1. Switch to **Agent Mode** in GitHub Copilot Chat
2. Ask your Azure question naturally
3. I'll automatically invoke relevant Azure tools

### Example Prompts
- "Create an Azure Function with Cosmos DB binding"
- "Query my resource groups and their costs"
- "Generate Bicep for a web app with managed identity"
- "What are the best practices for Azure Container Apps?"
`),{metadata:{command:"azure"}}}async function os(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

I can help with M365 development using available MCP tools and knowledge bases.

### Available M365 MCP Tools
- **M365 Agents Knowledge** - Comprehensive M365 Copilot development info
- **Code Snippets** - Teams AI, Teams JS, Bot Builder samples
- **Schema Access** - App manifest, declarative agent, API plugin schemas
- **Troubleshooting** - Common M365 development issues

### Supported Scenarios
- **Teams Apps** - Tabs, bots, messaging extensions
- **Copilot Extensions** - Declarative agents, API plugins
- **Graph API** - Microsoft Graph integration
- **SharePoint** - SPFx development
- **Power Platform** - Power Pages, Power Apps integration
`),e.prompt&&n.markdown(`
**Your request**: ${e.prompt}

`),n.markdown(`
### Example Prompts
- "Create a Teams bot with adaptive cards"
- "Build a declarative Copilot agent"
- "How do I authenticate with Microsoft Graph?"
- "Generate a Teams app manifest for my scenario"
`),{metadata:{command:"m365"}}}async function is(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Be();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

I'd love to personalize our collaboration. I don't have much information about you yet.

### Tell Me About Yourself
I'll remember your preferences to make our interactions more natural and helpful.

**Let's start simple:**
1. What's your **name** (or what should I call you)?
2. What's your **role** (developer, architect, manager, etc.)?
3. Do you prefer **casual** or **formal** communication?

Just answer naturally, and I'll save your preferences. For example:
> "I'm Sarah, a senior developer. I prefer casual conversation and detailed explanations."

Or use these quick options:
`),n.button({command:"alex.cognitive",title:"\u{1F3AF} Start Quick Profile",arguments:["profile-wizard"]}),{metadata:{command:"profile",action:"onboarding"}};let a=i.nickname||i.name;return n.markdown(`## \u{1F464} Profile: ${a}

### Your Information
| Field | Value |
|-------|-------|
| **Name** | ${i.name||"(not set)"} |
| **Nickname** | ${i.nickname||"(not set)"} |
| **Role** | ${i.role||"(not set)"} |
| **Experience** | ${i.experienceLevel||"(not set)"} |

### Communication Preferences
| Preference | Setting |
|------------|---------|
| **Formality** | ${i.formality||"balanced"} |
| **Detail Level** | ${i.detailLevel||"balanced"} |
| **Explanation Style** | ${i.explanationStyle||"both"} |
| **Humor** | ${i.humor||"occasional"} |
| **Proactive Suggestions** | ${i.proactiveSuggestions||"occasional"} |

### Technical Context
**Technologies**: ${(i.primaryTechnologies||[]).join(", ")||"(not set)"}
**Learning Goals**: ${(i.learningGoals||[]).join(", ")||"(not set)"}
**Expertise**: ${(i.expertiseAreas||[]).join(", ")||"(not set)"}

---

*Last updated: ${i.lastUpdated||"Never"}*

**To update your profile**, just tell me naturally:
- "Call me [nickname]"
- "I prefer formal communication"
- "I'm learning TypeScript and Azure"
`),e.prompt&&n.markdown(`
**Your update request**: ${e.prompt}
`),{metadata:{command:"profile",action:"view"}}}async function as(e,t,n,o){let i=await Be(),a=t.history.filter(u=>u instanceof Y.ChatRequestTurn||u instanceof Y.ChatResponseTurn),s="";if(i){let u=i.nickname||i.name;s=`
## User Profile (Use this to personalize responses)
${u?`- **User's name**: ${u} (always address them by name)`:"- User has not shared their name yet"}
${i.role?`- **Role**: ${i.role}`:""}
${i.experienceLevel?`- **Experience**: ${i.experienceLevel}`:""}
${i.formality?`- **Communication style**: ${i.formality}`:"- Communication style: balanced"}
${i.detailLevel?`- **Detail preference**: ${i.detailLevel}`:""}
${i.explanationStyle?`- **Explanation style**: ${i.explanationStyle}`:""}
${i.humor?`- **Humor**: ${i.humor}`:""}
${i.proactiveSuggestions?`- **Proactive suggestions**: ${i.proactiveSuggestions}`:""}
${i.primaryTechnologies?.length?`- **Technologies**: ${i.primaryTechnologies.join(", ")}`:""}
${i.learningGoals?.length?`- **Learning goals**: ${i.learningGoals.join(", ")}`:""}
${i.expertiseAreas?.length?`- **Expertise areas**: ${i.expertiseAreas.join(", ")}`:""}
`}else s=`
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;let c=`You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${s}

## Behavior Guidelines
1. **Address the user by name** if you know it
2. **Match their preferred communication style** (formal/casual/balanced)
3. **Be proactive** - suggest relevant follow-ups, ask clarifying questions
4. **Show personality** - be warm, curious, and engaged
5. **Remember context** - reference their expertise, learning goals, or current projects when relevant

Your capabilities:
- /meditate - Memory consolidation protocol
- /dream - Neural maintenance and synapse validation  
- /learn - Domain knowledge acquisition
- /azure - Azure development with MCP tools
- /m365 - Microsoft 365 development assistance
- /profile - View and update user profile
- /status - Architecture health check

When users mention Azure or M365 development, recommend using Agent Mode for automatic MCP tool invocation.

If you learn new information about the user (name, preferences, technologies they use), remind them they can save it with /profile.

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let u=await Y.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(u.length===0){let m=xo(i);return n.markdown(`${m}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let d=u[0],r=[Y.LanguageModelChatMessage.User(c),Y.LanguageModelChatMessage.User(e.prompt)],p=await d.sendRequest(r,{},o);for await(let m of p.text)n.markdown(m)}catch(u){if(u instanceof Y.LanguageModelError)console.error("Language model error:",u.message,u.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw u}return{metadata:{command:"general"}}}function ss(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function rs(e){return e.history.length===0||e.history.length<=2}async function cs(e,t,n,o){let i=await Be(),a=i?.nickname||i?.name;return n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]}),n.markdown(`

**Alex v2.6.0 BIHEXNILIUM** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function ls(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files reference v2.6.0
3. **Memory Architecture Assessment** - Evaluating memory balance
4. **Recommendation Generation** - Identifying improvements
5. **Session Documentation** - Creating meditation record

`),n.button({command:"alex.selfActualize",title:"\u25B6\uFE0F Execute Full Self-Actualization",arguments:[]}),n.markdown(`

*Click the button above to run the complete 5-phase protocol, or I can provide a summary assessment.*
`),n.markdown(`
### \u{1F517} Integration with Meditation
`),n.markdown(`Self-actualization automatically triggers during:
`),n.markdown(`- Session greetings (quick check)
`),n.markdown(`- Deep meditation sessions (full protocol)
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}var us={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Fo(e){let t=Y.chat.createChatParticipant("alex.cognitive",Qa);return t.iconPath=Y.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=us,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===Y.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var gt=!1;async function De(e,t){if(gt){ye.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}gt=!0;try{return await t()}finally{gt=!1}}function ds(e){console.log("Alex Cognitive Architecture is now active!"),Fo(e),Po(e);let t=ye.commands.registerCommand("alex.initialize",async()=>{await De("Initialize",()=>go(e))}),n=ye.commands.registerCommand("alex.reset",async()=>{await De("Reset",()=>lt(e))}),o=ye.commands.registerCommand("alex.dream",async()=>{await De("Dream Protocol",()=>vo(e))}),i=ye.commands.registerCommand("alex.upgrade",async()=>{await De("Upgrade",()=>bo(e))}),a=ye.commands.registerCommand("alex.selfActualize",async()=>{await De("Self-Actualization",()=>Co(e))});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a)}function ms(){}0&&(module.exports={activate,deactivate});
