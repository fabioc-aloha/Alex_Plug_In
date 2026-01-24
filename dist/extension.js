"use strict";var Lo=Object.create;var Le=Object.defineProperty;var Oo=Object.getOwnPropertyDescriptor;var zo=Object.getOwnPropertyNames;var _o=Object.getPrototypeOf,jo=Object.prototype.hasOwnProperty;var T=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),qo=(e,t)=>{for(var n in t)Le(e,n,{get:t[n],enumerable:!0})},Ct=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of zo(t))!jo.call(e,i)&&i!==n&&Le(e,i,{get:()=>t[i],enumerable:!(o=Oo(t,i))||o.enumerable});return e};var U=(e,t,n)=>(n=e!=null?Lo(_o(e)):{},Ct(t||!e||!e.__esModule?Le(n,"default",{value:e,enumerable:!0}):n,e)),Uo=e=>Ct(Le({},"__esModule",{value:!0}),e);var B=T(Ke=>{"use strict";Ke.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};Ke.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Pt=T((Cs,xt)=>{var pe=require("constants"),Ho=process.cwd,Oe=null,Wo=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return Oe||(Oe=Ho.call(process)),Oe};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Xe=process.chdir,process.chdir=function(e){Oe=null,Xe.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Xe));var Xe;xt.exports=Vo;function Vo(e){pe.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=c(e.stat),e.fstat=c(e.fstat),e.lstat=c(e.lstat),e.statSync=u(e.statSync),e.fstatSync=u(e.fstatSync),e.lstatSync=u(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(r,m,f){f&&process.nextTick(f)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(r,m,f,p){p&&process.nextTick(p)},e.lchownSync=function(){}),Wo==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(r){function m(f,p,w){var x=Date.now(),S=0;r(f,p,function y(F){if(F&&(F.code==="EACCES"||F.code==="EPERM"||F.code==="EBUSY")&&Date.now()-x<6e4){setTimeout(function(){e.stat(p,function(A,N){A&&A.code==="ENOENT"?r(f,p,y):w(F)})},S),S<100&&(S+=10);return}w&&w(F)})}return Object.setPrototypeOf&&Object.setPrototypeOf(m,r),m})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(r){function m(f,p,w,x,S,y){var F;if(y&&typeof y=="function"){var A=0;F=function(N,_,V){if(N&&N.code==="EAGAIN"&&A<10)return A++,r.call(e,f,p,w,x,S,F);y.apply(this,arguments)}}return r.call(e,f,p,w,x,S,F)}return Object.setPrototypeOf&&Object.setPrototypeOf(m,r),m})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(r){return function(m,f,p,w,x){for(var S=0;;)try{return r.call(e,m,f,p,w,x)}catch(y){if(y.code==="EAGAIN"&&S<10){S++;continue}throw y}}})(e.readSync);function t(r){r.lchmod=function(m,f,p){r.open(m,pe.O_WRONLY|pe.O_SYMLINK,f,function(w,x){if(w){p&&p(w);return}r.fchmod(x,f,function(S){r.close(x,function(y){p&&p(S||y)})})})},r.lchmodSync=function(m,f){var p=r.openSync(m,pe.O_WRONLY|pe.O_SYMLINK,f),w=!0,x;try{x=r.fchmodSync(p,f),w=!1}finally{if(w)try{r.closeSync(p)}catch{}else r.closeSync(p)}return x}}function n(r){pe.hasOwnProperty("O_SYMLINK")&&r.futimes?(r.lutimes=function(m,f,p,w){r.open(m,pe.O_SYMLINK,function(x,S){if(x){w&&w(x);return}r.futimes(S,f,p,function(y){r.close(S,function(F){w&&w(y||F)})})})},r.lutimesSync=function(m,f,p){var w=r.openSync(m,pe.O_SYMLINK),x,S=!0;try{x=r.futimesSync(w,f,p),S=!1}finally{if(S)try{r.closeSync(w)}catch{}else r.closeSync(w)}return x}):r.futimes&&(r.lutimes=function(m,f,p,w){w&&process.nextTick(w)},r.lutimesSync=function(){})}function o(r){return r&&function(m,f,p){return r.call(e,m,f,function(w){d(w)&&(w=null),p&&p.apply(this,arguments)})}}function i(r){return r&&function(m,f){try{return r.call(e,m,f)}catch(p){if(!d(p))throw p}}}function a(r){return r&&function(m,f,p,w){return r.call(e,m,f,p,function(x){d(x)&&(x=null),w&&w.apply(this,arguments)})}}function s(r){return r&&function(m,f,p){try{return r.call(e,m,f,p)}catch(w){if(!d(w))throw w}}}function c(r){return r&&function(m,f,p){typeof f=="function"&&(p=f,f=null);function w(x,S){S&&(S.uid<0&&(S.uid+=4294967296),S.gid<0&&(S.gid+=4294967296)),p&&p.apply(this,arguments)}return f?r.call(e,m,f,w):r.call(e,m,w)}}function u(r){return r&&function(m,f){var p=f?r.call(e,m,f):r.call(e,m);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function d(r){if(!r||r.code==="ENOSYS")return!0;var m=!process.getuid||process.getuid()!==0;return!!(m&&(r.code==="EINVAL"||r.code==="EPERM"))}}});var Et=T((xs,At)=>{var Ft=require("stream").Stream;At.exports=Go;function Go(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Ft.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),c=0,u=s.length;c<u;c++){var d=s[c];this[d]=i[d]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(r,m){if(r){a.emit("error",r),a.readable=!1;return}a.fd=m,a.emit("open",m),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Ft.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,c=a.length;s<c;s++){var u=a[s];this[u]=i[u]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var $t=T((Ps,Tt)=>{"use strict";Tt.exports=Jo;var Bo=Object.getPrototypeOf||function(e){return e.__proto__};function Jo(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:Bo(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var be=T((Fs,et)=>{var O=require("fs"),Yo=Pt(),Ko=Et(),Xo=$t(),ze=require("util"),K,je;typeof Symbol=="function"&&typeof Symbol.for=="function"?(K=Symbol.for("graceful-fs.queue"),je=Symbol.for("graceful-fs.previous")):(K="___graceful-fs.queue",je="___graceful-fs.previous");function Qo(){}function It(e,t){Object.defineProperty(e,K,{get:function(){return t}})}var we=Qo;ze.debuglog?we=ze.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(we=function(){var e=ze.format.apply(ze,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});O[K]||(Mt=global[K]||[],It(O,Mt),O.close=(function(e){function t(n,o){return e.call(O,n,function(i){i||Rt(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,je,{value:e}),t})(O.close),O.closeSync=(function(e){function t(n){e.apply(O,arguments),Rt()}return Object.defineProperty(t,je,{value:e}),t})(O.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){we(O[K]),require("assert").equal(O[K].length,0)}));var Mt;global[K]||It(global,O[K]);et.exports=Qe(Xo(O));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!O.__patched&&(et.exports=Qe(O),O.__patched=!0);function Qe(e){Yo(e),e.gracefulify=Qe,e.createReadStream=_,e.createWriteStream=V;var t=e.readFile;e.readFile=n;function n(v,$,P){return typeof $=="function"&&(P=$,$=null),L(v,$,P);function L(W,q,C,g){return t(W,q,function(b){b&&(b.code==="EMFILE"||b.code==="ENFILE")?ke([L,[W,q,C],b,g||Date.now(),Date.now()]):typeof C=="function"&&C.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(v,$,P,L){return typeof P=="function"&&(L=P,P=null),W(v,$,P,L);function W(q,C,g,b,E){return o(q,C,g,function(M){M&&(M.code==="EMFILE"||M.code==="ENFILE")?ke([W,[q,C,g,b],M,E||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(v,$,P,L){return typeof P=="function"&&(L=P,P=null),W(v,$,P,L);function W(q,C,g,b,E){return a(q,C,g,function(M){M&&(M.code==="EMFILE"||M.code==="ENFILE")?ke([W,[q,C,g,b],M,E||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var c=e.copyFile;c&&(e.copyFile=u);function u(v,$,P,L){return typeof P=="function"&&(L=P,P=0),W(v,$,P,L);function W(q,C,g,b,E){return c(q,C,g,function(M){M&&(M.code==="EMFILE"||M.code==="ENFILE")?ke([W,[q,C,g,b],M,E||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var d=e.readdir;e.readdir=m;var r=/^v[0-5]\./;function m(v,$,P){typeof $=="function"&&(P=$,$=null);var L=r.test(process.version)?function(C,g,b,E){return d(C,W(C,g,b,E))}:function(C,g,b,E){return d(C,g,W(C,g,b,E))};return L(v,$,P);function W(q,C,g,b){return function(E,M){E&&(E.code==="EMFILE"||E.code==="ENFILE")?ke([L,[q,C,g],E,b||Date.now(),Date.now()]):(M&&M.sort&&M.sort(),typeof g=="function"&&g.call(this,E,M))}}}if(process.version.substr(0,4)==="v0.8"){var f=Ko(e);y=f.ReadStream,A=f.WriteStream}var p=e.ReadStream;p&&(y.prototype=Object.create(p.prototype),y.prototype.open=F);var w=e.WriteStream;w&&(A.prototype=Object.create(w.prototype),A.prototype.open=N),Object.defineProperty(e,"ReadStream",{get:function(){return y},set:function(v){y=v},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return A},set:function(v){A=v},enumerable:!0,configurable:!0});var x=y;Object.defineProperty(e,"FileReadStream",{get:function(){return x},set:function(v){x=v},enumerable:!0,configurable:!0});var S=A;Object.defineProperty(e,"FileWriteStream",{get:function(){return S},set:function(v){S=v},enumerable:!0,configurable:!0});function y(v,$){return this instanceof y?(p.apply(this,arguments),this):y.apply(Object.create(y.prototype),arguments)}function F(){var v=this;Y(v.path,v.flags,v.mode,function($,P){$?(v.autoClose&&v.destroy(),v.emit("error",$)):(v.fd=P,v.emit("open",P),v.read())})}function A(v,$){return this instanceof A?(w.apply(this,arguments),this):A.apply(Object.create(A.prototype),arguments)}function N(){var v=this;Y(v.path,v.flags,v.mode,function($,P){$?(v.destroy(),v.emit("error",$)):(v.fd=P,v.emit("open",P))})}function _(v,$){return new e.ReadStream(v,$)}function V(v,$){return new e.WriteStream(v,$)}var H=e.open;e.open=Y;function Y(v,$,P,L){return typeof P=="function"&&(L=P,P=null),W(v,$,P,L);function W(q,C,g,b,E){return H(q,C,g,function(M,ue){M&&(M.code==="EMFILE"||M.code==="ENFILE")?ke([W,[q,C,g,b],M,E||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}return e}function ke(e){we("ENQUEUE",e[0].name,e[1]),O[K].push(e),Ze()}var _e;function Rt(){for(var e=Date.now(),t=0;t<O[K].length;++t)O[K][t].length>2&&(O[K][t][3]=e,O[K][t][4]=e);Ze()}function Ze(){if(clearTimeout(_e),_e=void 0,O[K].length!==0){var e=O[K].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)we("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){we("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var c=Date.now()-a,u=Math.max(a-i,1),d=Math.min(u*1.2,100);c>=d?(we("RETRY",t.name,n),t.apply(null,n.concat([i]))):O[K].push(e)}_e===void 0&&(_e=setTimeout(Ze,0))}}});var ee=T(de=>{"use strict";var Nt=B().fromCallback,Z=be(),Zo=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof Z[e]=="function");Object.assign(de,Z);Zo.forEach(e=>{de[e]=Nt(Z[e])});de.exists=function(e,t){return typeof t=="function"?Z.exists(e,t):new Promise(n=>Z.exists(e,n))};de.read=function(e,t,n,o,i,a){return typeof a=="function"?Z.read(e,t,n,o,i,a):new Promise((s,c)=>{Z.read(e,t,n,o,i,(u,d,r)=>{if(u)return c(u);s({bytesRead:d,buffer:r})})})};de.write=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.write(e,t,...n):new Promise((o,i)=>{Z.write(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesWritten:s,buffer:c})})})};de.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.readv(e,t,...n):new Promise((o,i)=>{Z.readv(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesRead:s,buffers:c})})})};de.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?Z.writev(e,t,...n):new Promise((o,i)=>{Z.writev(e,t,...n,(a,s,c)=>{if(a)return i(a);o({bytesWritten:s,buffers:c})})})};typeof Z.realpath.native=="function"?de.realpath.native=Nt(Z.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var Lt=T((Es,Dt)=>{"use strict";var ei=require("path");Dt.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(ei.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var jt=T((Ts,tt)=>{"use strict";var Ot=ee(),{checkPath:zt}=Lt(),_t=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};tt.exports.makeDir=async(e,t)=>(zt(e),Ot.mkdir(e,{mode:_t(t),recursive:!0}));tt.exports.makeDirSync=(e,t)=>(zt(e),Ot.mkdirSync(e,{mode:_t(t),recursive:!0}))});var se=T(($s,qt)=>{"use strict";var ti=B().fromPromise,{makeDir:ni,makeDirSync:nt}=jt(),ot=ti(ni);qt.exports={mkdirs:ot,mkdirsSync:nt,mkdirp:ot,mkdirpSync:nt,ensureDir:ot,ensureDirSync:nt}});var fe=T((Ms,Ht)=>{"use strict";var oi=B().fromPromise,Ut=ee();function ii(e){return Ut.access(e).then(()=>!0).catch(()=>!1)}Ht.exports={pathExists:oi(ii),pathExistsSync:Ut.existsSync}});var it=T((Rs,Wt)=>{"use strict";var Ce=ee(),ai=B().fromPromise;async function si(e,t,n){let o=await Ce.open(e,"r+"),i=null;try{await Ce.futimes(o,t,n)}finally{try{await Ce.close(o)}catch(a){i=a}}if(i)throw i}function ri(e,t,n){let o=Ce.openSync(e,"r+");return Ce.futimesSync(o,t,n),Ce.closeSync(o)}Wt.exports={utimesMillis:ai(si),utimesMillisSync:ri}});var ve=T((Is,Jt)=>{"use strict";var xe=ee(),J=require("path"),Vt=B().fromPromise;function ci(e,t,n){let o=n.dereference?i=>xe.stat(i,{bigint:!0}):i=>xe.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function li(e,t,n){let o,i=n.dereference?s=>xe.statSync(s,{bigint:!0}):s=>xe.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function ui(e,t,n,o){let{srcStat:i,destStat:a}=await ci(e,t,o);if(a){if(Fe(i,a)){let s=J.basename(e),c=J.basename(t);if(n==="move"&&s!==c&&s.toLowerCase()===c.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&at(e,t))throw new Error(qe(e,t,n));return{srcStat:i,destStat:a}}function di(e,t,n,o){let{srcStat:i,destStat:a}=li(e,t,o);if(a){if(Fe(i,a)){let s=J.basename(e),c=J.basename(t);if(n==="move"&&s!==c&&s.toLowerCase()===c.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&at(e,t))throw new Error(qe(e,t,n));return{srcStat:i,destStat:a}}async function Gt(e,t,n,o){let i=J.resolve(J.dirname(e)),a=J.resolve(J.dirname(n));if(a===i||a===J.parse(a).root)return;let s;try{s=await xe.stat(a,{bigint:!0})}catch(c){if(c.code==="ENOENT")return;throw c}if(Fe(t,s))throw new Error(qe(e,n,o));return Gt(e,t,a,o)}function Bt(e,t,n,o){let i=J.resolve(J.dirname(e)),a=J.resolve(J.dirname(n));if(a===i||a===J.parse(a).root)return;let s;try{s=xe.statSync(a,{bigint:!0})}catch(c){if(c.code==="ENOENT")return;throw c}if(Fe(t,s))throw new Error(qe(e,n,o));return Bt(e,t,a,o)}function Fe(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function at(e,t){let n=J.resolve(e).split(J.sep).filter(i=>i),o=J.resolve(t).split(J.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function qe(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}Jt.exports={checkPaths:Vt(ui),checkPathsSync:di,checkParentPaths:Vt(Gt),checkParentPathsSync:Bt,isSrcSubdir:at,areIdentical:Fe}});var Kt=T((Ns,Yt)=>{"use strict";async function mi(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}Yt.exports={asyncIteratorConcurrentProcess:mi}});var tn=T((Ds,en)=>{"use strict";var Q=ee(),Ae=require("path"),{mkdirs:pi}=se(),{pathExists:fi}=fe(),{utimesMillis:hi}=it(),Ee=ve(),{asyncIteratorConcurrentProcess:gi}=Kt();async function yi(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await Ee.checkPaths(e,t,"copy",n);if(await Ee.checkParentPaths(e,o,t,"copy"),!await Qt(e,t,n))return;let s=Ae.dirname(t);await fi(s)||await pi(s),await Zt(i,e,t,n)}async function Qt(e,t,n){return n.filter?n.filter(e,t):!0}async function Zt(e,t,n,o){let a=await(o.dereference?Q.stat:Q.lstat)(t);if(a.isDirectory())return ki(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return wi(a,e,t,n,o);if(a.isSymbolicLink())return bi(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function wi(e,t,n,o,i){if(!t)return Xt(e,n,o,i);if(i.overwrite)return await Q.unlink(o),Xt(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function Xt(e,t,n,o){if(await Q.copyFile(t,n),o.preserveTimestamps){vi(e.mode)&&await Si(n,e.mode);let i=await Q.stat(t);await hi(n,i.atime,i.mtime)}return Q.chmod(n,e.mode)}function vi(e){return(e&128)===0}function Si(e,t){return Q.chmod(e,t|128)}async function ki(e,t,n,o,i){t||await Q.mkdir(o),await gi(await Q.opendir(n),async a=>{let s=Ae.join(n,a.name),c=Ae.join(o,a.name);if(await Qt(s,c,i)){let{destStat:d}=await Ee.checkPaths(s,c,"copy",i);await Zt(d,s,c,i)}}),t||await Q.chmod(o,e.mode)}async function bi(e,t,n,o){let i=await Q.readlink(t);if(o.dereference&&(i=Ae.resolve(process.cwd(),i)),!e)return Q.symlink(i,n);let a=null;try{a=await Q.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return Q.symlink(i,n);throw s}if(o.dereference&&(a=Ae.resolve(process.cwd(),a)),i!==a){if(Ee.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(Ee.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await Q.unlink(n),Q.symlink(i,n)}en.exports=yi});var rn=T((Ls,sn)=>{"use strict";var te=be(),Te=require("path"),Ci=se().mkdirsSync,xi=it().utimesMillisSync,$e=ve();function Pi(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=$e.checkPathsSync(e,t,"copy",n);if($e.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=Te.dirname(t);return te.existsSync(a)||Ci(a),nn(i,e,t,n)}function nn(e,t,n,o){let a=(o.dereference?te.statSync:te.lstatSync)(t);if(a.isDirectory())return Ri(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Fi(a,e,t,n,o);if(a.isSymbolicLink())return Di(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Fi(e,t,n,o,i){return t?Ai(e,n,o,i):on(e,n,o,i)}function Ai(e,t,n,o){if(o.overwrite)return te.unlinkSync(n),on(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function on(e,t,n,o){return te.copyFileSync(t,n),o.preserveTimestamps&&Ei(e.mode,t,n),st(n,e.mode)}function Ei(e,t,n){return Ti(e)&&$i(n,e),Mi(t,n)}function Ti(e){return(e&128)===0}function $i(e,t){return st(e,t|128)}function st(e,t){return te.chmodSync(e,t)}function Mi(e,t){let n=te.statSync(e);return xi(t,n.atime,n.mtime)}function Ri(e,t,n,o,i){return t?an(n,o,i):Ii(e.mode,n,o,i)}function Ii(e,t,n,o){return te.mkdirSync(n),an(t,n,o),st(n,e)}function an(e,t,n){let o=te.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Ni(i.name,e,t,n)}finally{o.closeSync()}}function Ni(e,t,n,o){let i=Te.join(t,e),a=Te.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=$e.checkPathsSync(i,a,"copy",o);return nn(s,i,a,o)}function Di(e,t,n,o){let i=te.readlinkSync(t);if(o.dereference&&(i=Te.resolve(process.cwd(),i)),e){let a;try{a=te.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return te.symlinkSync(i,n);throw s}if(o.dereference&&(a=Te.resolve(process.cwd(),a)),i!==a){if($e.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if($e.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Li(i,n)}else return te.symlinkSync(i,n)}function Li(e,t){return te.unlinkSync(t),te.symlinkSync(e,t)}sn.exports=Pi});var Ue=T((Os,cn)=>{"use strict";var Oi=B().fromPromise;cn.exports={copy:Oi(tn()),copySync:rn()}});var Me=T((zs,un)=>{"use strict";var ln=be(),zi=B().fromCallback;function _i(e,t){ln.rm(e,{recursive:!0,force:!0},t)}function ji(e){ln.rmSync(e,{recursive:!0,force:!0})}un.exports={remove:zi(_i),removeSync:ji}});var wn=T((_s,yn)=>{"use strict";var qi=B().fromPromise,pn=ee(),fn=require("path"),hn=se(),gn=Me(),dn=qi(async function(t){let n;try{n=await pn.readdir(t)}catch{return hn.mkdirs(t)}return Promise.all(n.map(o=>gn.remove(fn.join(t,o))))});function mn(e){let t;try{t=pn.readdirSync(e)}catch{return hn.mkdirsSync(e)}t.forEach(n=>{n=fn.join(e,n),gn.removeSync(n)})}yn.exports={emptyDirSync:mn,emptydirSync:mn,emptyDir:dn,emptydir:dn}});var bn=T((js,kn)=>{"use strict";var Ui=B().fromPromise,vn=require("path"),me=ee(),Sn=se();async function Hi(e){let t;try{t=await me.stat(e)}catch{}if(t&&t.isFile())return;let n=vn.dirname(e),o=null;try{o=await me.stat(n)}catch(i){if(i.code==="ENOENT"){await Sn.mkdirs(n),await me.writeFile(e,"");return}else throw i}o.isDirectory()?await me.writeFile(e,""):await me.readdir(n)}function Wi(e){let t;try{t=me.statSync(e)}catch{}if(t&&t.isFile())return;let n=vn.dirname(e);try{me.statSync(n).isDirectory()||me.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")Sn.mkdirsSync(n);else throw o}me.writeFileSync(e,"")}kn.exports={createFile:Ui(Hi),createFileSync:Wi}});var An=T((qs,Fn)=>{"use strict";var Vi=B().fromPromise,Cn=require("path"),he=ee(),xn=se(),{pathExists:Gi}=fe(),{areIdentical:Pn}=ve();async function Bi(e,t){let n;try{n=await he.lstat(t)}catch{}let o;try{o=await he.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Pn(o,n))return;let i=Cn.dirname(t);await Gi(i)||await xn.mkdirs(i),await he.link(e,t)}function Ji(e,t){let n;try{n=he.lstatSync(t)}catch{}try{let a=he.lstatSync(e);if(n&&Pn(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=Cn.dirname(t);return he.existsSync(o)||xn.mkdirsSync(o),he.linkSync(e,t)}Fn.exports={createLink:Vi(Bi),createLinkSync:Ji}});var Tn=T((Us,En)=>{"use strict";var ge=require("path"),Re=ee(),{pathExists:Yi}=fe(),Ki=B().fromPromise;async function Xi(e,t){if(ge.isAbsolute(e)){try{await Re.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=ge.dirname(t),o=ge.join(n,e);if(await Yi(o))return{toCwd:o,toDst:e};try{await Re.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:ge.relative(n,e)}}function Qi(e,t){if(ge.isAbsolute(e)){if(!Re.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=ge.dirname(t),o=ge.join(n,e);if(Re.existsSync(o))return{toCwd:o,toDst:e};if(!Re.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:ge.relative(n,e)}}En.exports={symlinkPaths:Ki(Xi),symlinkPathsSync:Qi}});var Rn=T((Hs,Mn)=>{"use strict";var $n=ee(),Zi=B().fromPromise;async function ea(e,t){if(t)return t;let n;try{n=await $n.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function ta(e,t){if(t)return t;let n;try{n=$n.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}Mn.exports={symlinkType:Zi(ea),symlinkTypeSync:ta}});var Ln=T((Ws,Dn)=>{"use strict";var na=B().fromPromise,In=require("path"),ce=ee(),{mkdirs:oa,mkdirsSync:ia}=se(),{symlinkPaths:aa,symlinkPathsSync:sa}=Tn(),{symlinkType:ra,symlinkTypeSync:ca}=Rn(),{pathExists:la}=fe(),{areIdentical:Nn}=ve();async function ua(e,t,n){let o;try{o=await ce.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[c,u]=await Promise.all([ce.stat(e),ce.stat(t)]);if(Nn(c,u))return}let i=await aa(e,t);e=i.toDst;let a=await ra(i.toCwd,n),s=In.dirname(t);return await la(s)||await oa(s),ce.symlink(e,t,a)}function da(e,t,n){let o;try{o=ce.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let c=ce.statSync(e),u=ce.statSync(t);if(Nn(c,u))return}let i=sa(e,t);e=i.toDst,n=ca(i.toCwd,n);let a=In.dirname(t);return ce.existsSync(a)||ia(a),ce.symlinkSync(e,t,n)}Dn.exports={createSymlink:na(ua),createSymlinkSync:da}});var Wn=T((Vs,Hn)=>{"use strict";var{createFile:On,createFileSync:zn}=bn(),{createLink:_n,createLinkSync:jn}=An(),{createSymlink:qn,createSymlinkSync:Un}=Ln();Hn.exports={createFile:On,createFileSync:zn,ensureFile:On,ensureFileSync:zn,createLink:_n,createLinkSync:jn,ensureLink:_n,ensureLinkSync:jn,createSymlink:qn,createSymlinkSync:Un,ensureSymlink:qn,ensureSymlinkSync:Un}});var He=T((Gs,Vn)=>{function ma(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function pa(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}Vn.exports={stringify:ma,stripBom:pa}});var Yn=T((Bs,Jn)=>{var Pe;try{Pe=be()}catch{Pe=require("fs")}var We=B(),{stringify:Gn,stripBom:Bn}=He();async function fa(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Pe,o="throws"in t?t.throws:!0,i=await We.fromCallback(n.readFile)(e,t);i=Bn(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var ha=We.fromPromise(fa);function ga(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Pe,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=Bn(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function ya(e,t,n={}){let o=n.fs||Pe,i=Gn(t,n);await We.fromCallback(o.writeFile)(e,i,n)}var wa=We.fromPromise(ya);function va(e,t,n={}){let o=n.fs||Pe,i=Gn(t,n);return o.writeFileSync(e,i,n)}Jn.exports={readFile:ha,readFileSync:ga,writeFile:wa,writeFileSync:va}});var Xn=T((Js,Kn)=>{"use strict";var Ve=Yn();Kn.exports={readJson:Ve.readFile,readJsonSync:Ve.readFileSync,writeJson:Ve.writeFile,writeJsonSync:Ve.writeFileSync}});var Ge=T((Ys,eo)=>{"use strict";var Sa=B().fromPromise,rt=ee(),Qn=require("path"),Zn=se(),ka=fe().pathExists;async function ba(e,t,n="utf-8"){let o=Qn.dirname(e);return await ka(o)||await Zn.mkdirs(o),rt.writeFile(e,t,n)}function Ca(e,...t){let n=Qn.dirname(e);rt.existsSync(n)||Zn.mkdirsSync(n),rt.writeFileSync(e,...t)}eo.exports={outputFile:Sa(ba),outputFileSync:Ca}});var no=T((Ks,to)=>{"use strict";var{stringify:xa}=He(),{outputFile:Pa}=Ge();async function Fa(e,t,n={}){let o=xa(t,n);await Pa(e,o,n)}to.exports=Fa});var io=T((Xs,oo)=>{"use strict";var{stringify:Aa}=He(),{outputFileSync:Ea}=Ge();function Ta(e,t,n){let o=Aa(t,n);Ea(e,o,n)}oo.exports=Ta});var so=T((Qs,ao)=>{"use strict";var $a=B().fromPromise,ne=Xn();ne.outputJson=$a(no());ne.outputJsonSync=io();ne.outputJSON=ne.outputJson;ne.outputJSONSync=ne.outputJsonSync;ne.writeJSON=ne.writeJson;ne.writeJSONSync=ne.writeJsonSync;ne.readJSON=ne.readJson;ne.readJSONSync=ne.readJsonSync;ao.exports=ne});var mo=T((Zs,uo)=>{"use strict";var Ma=ee(),ro=require("path"),{copy:Ra}=Ue(),{remove:lo}=Me(),{mkdirp:Ia}=se(),{pathExists:Na}=fe(),co=ve();async function Da(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await co.checkPaths(e,t,"move",n);await co.checkParentPaths(e,i,t,"move");let s=ro.dirname(t);return ro.parse(s).root!==s&&await Ia(s),La(e,t,o,a)}async function La(e,t,n,o){if(!o){if(n)await lo(t);else if(await Na(t))throw new Error("dest already exists.")}try{await Ma.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Oa(e,t,n)}}async function Oa(e,t,n){return await Ra(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),lo(e)}uo.exports=Da});var yo=T((er,go)=>{"use strict";var fo=be(),lt=require("path"),za=Ue().copySync,ho=Me().removeSync,_a=se().mkdirpSync,po=ve();function ja(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=po.checkPathsSync(e,t,"move",n);return po.checkParentPathsSync(e,i,t,"move"),qa(t)||_a(lt.dirname(t)),Ua(e,t,o,a)}function qa(e){let t=lt.dirname(e);return lt.parse(t).root===t}function Ua(e,t,n,o){if(o)return ct(e,t,n);if(n)return ho(t),ct(e,t,n);if(fo.existsSync(t))throw new Error("dest already exists.");return ct(e,t,n)}function ct(e,t,n){try{fo.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return Ha(e,t,n)}}function Ha(e,t,n){return za(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),ho(e)}go.exports=ja});var vo=T((tr,wo)=>{"use strict";var Wa=B().fromPromise;wo.exports={move:Wa(mo()),moveSync:yo()}});var Se=T((nr,So)=>{"use strict";So.exports={...ee(),...Ue(),...wn(),...Wn(),...so(),...se(),...vo(),...Ge(),...fe(),...Me()}});var Ss={};qo(Ss,{activate:()=>ws,deactivate:()=>vs});module.exports=Uo(Ss);var ye=U(require("vscode"));var z=U(require("vscode")),ie=U(Se()),R=U(require("path"));async function ko(e){let t=z.workspace.workspaceFolders;if(!t){z.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=R.join(n,".github","copilot-instructions.md");if(await ie.pathExists(o)){let i=await z.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await z.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await ut(e);return}await bo(e,n,!1)}async function ut(e){let t=z.workspace.workspaceFolders;if(!t){z.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await z.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await z.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[R.join(n,".github","copilot-instructions.md"),R.join(n,".github","instructions"),R.join(n,".github","prompts"),R.join(n,".github","episodic"),R.join(n,".github","domain-knowledge"),R.join(n,".github","config"),R.join(n,".alex-manifest.json")];try{await z.window.withProgress({location:z.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await ie.remove(s)}),await bo(e,n,!0)}catch(a){z.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function bo(e,t,n){let o=e.extensionPath,i=R.join(o,".github","copilot-instructions.md");if(!await ie.pathExists(i)){z.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:R.join(o,".github","copilot-instructions.md"),dest:R.join(t,".github","copilot-instructions.md")},{src:R.join(o,".github","instructions"),dest:R.join(t,".github","instructions")},{src:R.join(o,".github","prompts"),dest:R.join(t,".github","prompts")},{src:R.join(o,".github","episodic"),dest:R.join(t,".github","episodic")},{src:R.join(o,".github","domain-knowledge"),dest:R.join(t,".github","domain-knowledge")},{src:R.join(o,".github","config"),dest:R.join(t,".github","config")},{src:R.join(o,".github","agents"),dest:R.join(t,".github","agents")}];try{let s=R.join(t,".github");await ie.ensureDir(s);let c=R.join(s,".write-test");try{await ie.writeFile(c,"test"),await ie.remove(c)}catch(d){throw new Error(`Cannot write to workspace - check folder permissions: ${d.message}`)}await z.window.withProgress({location:z.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async d=>{for(let r of a)d.report({message:`Copying ${R.basename(r.dest)}...`}),await ie.pathExists(r.src)?await ie.copy(r.src,r.dest,{overwrite:n}):console.warn(`Source not found: ${r.src}`)});let u=await z.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(u==="Open Main Brain File"){let d=R.join(t,".github","copilot-instructions.md"),r=await z.workspace.openTextDocument(d);await z.window.showTextDocument(r)}else u==="Run Dream Protocol"&&await z.commands.executeCommand("alex.dream")}catch(s){z.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var G=U(require("vscode")),re=U(Se()),oe=U(require("path")),Co={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function xo(e){let t=G.workspace.workspaceFolders;if(!t){G.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await G.window.withProgress({location:G.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],a=[];for(let y of i){let F=new G.RelativePattern(t[0],y),A=await G.workspace.findFiles(F);a=a.concat(A.map(N=>N.fsPath))}if(a=[...new Set(a)],a.length===0){await G.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await G.commands.executeCommand("alex.initialize");return}let s=[],c=new Set(a.map(y=>oe.normalize(y).toLowerCase())),u=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let y of a){let F;try{F=await re.readFile(y,"utf-8")}catch(_){console.error(`Failed to read file ${y}:`,_);continue}let A=F.split(`
`),N=!1;for(let _=0;_<A.length;_++){let V=A[_];if(V.trim().startsWith("```")){N=!N;continue}if(N)continue;let H;for(;(H=u.exec(V))!==null;){let Y=H[1].trim(),v=Array.from(c).some(P=>P.endsWith(oe.normalize(Y).toLowerCase()));if(!v){let P=oe.join(n,Y);(await re.pathExists(P)||(await G.workspace.findFiles(new G.RelativePattern(t[0],`**/${Y}`))).length>0)&&(v=!0)}if(!v){let P=oe.dirname(y),L=oe.join(P,Y);await re.pathExists(L)&&(v=!0)}["target-file.md","CHANGELOG.md"].includes(Y)&&(v=!0),s.push({sourceFile:y,targetFile:Y,strength:H[2].trim(),type:H[3]?.trim()||"association",direction:H[4]?.trim()||"unidirectional",condition:H[5]?.trim(),line:_+1,isValid:v})}}}let d=s.filter(y=>!y.isValid),r=new Set(s.map(y=>y.targetFile.toLowerCase())),m=[],f=[];for(let y of d){let F=oe.basename(y.targetFile);if(Co[F]){let A=Co[F];try{let N=await re.readFile(y.sourceFile,"utf-8"),_=y.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),V=new RegExp(`\\[${_}\\]`,"g");if(V.test(N)){let H=N.replace(V,`[${A}]`);await re.writeFile(y.sourceFile,H,"utf-8"),y.repaired=!0,y.newTarget=A,m.push(y)}else f.push(y)}catch(N){console.error(`Failed to repair synapse in ${y.sourceFile}:`,N),f.push(y)}}else f.push(y)}d=f;let p={timestamp:new Date().toISOString(),totalFiles:a.length,totalSynapses:s.length,brokenSynapses:d,repairedSynapses:m,orphanedFiles:[]},w=Va(p),x=oe.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await re.ensureDir(oe.dirname(x)),await re.writeFile(x,w),d.length>0){if(await G.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${d.length} broken synapse${d.length>1?"s":""}!

${m.length>0?`\u2705 Auto-repaired: ${m.length}
`:""}\u274C Need manual repair: ${d.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let y=s.length>50?"excellent":s.length>20?"good":"developing";if(await G.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${a.length} memory files
\u2022 ${s.length} active synapses
${m.length>0?`\u2022 ${m.length} auto-repaired
`:""}\u2022 Network health: ${y}`,"View Full Report","Close")!=="View Full Report")return}let S=await G.workspace.openTextDocument(x);await G.window.showTextDocument(S)})}function Va(e){return`# Dream Protocol Report
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
`}var j=U(require("vscode")),h=U(Se()),k=U(require("path")),Fo=U(require("crypto"));function Ie(e){return Fo.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function Ga(e){let t=k.join(e,".github","copilot-instructions.md");if(!await h.pathExists(t))return null;try{let o=(await h.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function Ba(e){try{return(await h.readJson(k.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function Ja(e){let t=k.join(e,".alex-manifest.json");if(await h.pathExists(t))try{return await h.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function Po(e){let t=[];if(!await h.pathExists(e))return t;try{let n=await h.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function Ya(e,t){let n=[],o=k.join(e,".github","domain-knowledge");if(await h.pathExists(o)){let i=await h.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function Ao(e){let t=j.workspace.workspaceFolders;if(!t){j.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,i=k.join(n,".github","copilot-instructions.md");if(!await h.pathExists(i)){await j.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await j.commands.executeCommand("alex.initialize");return}let a=await Ga(n),s=await Ba(o);if(a===s){await j.window.showInformationMessage(`\u2705 Alex is already at the latest version (${s}).

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

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(c==="What's New?"){let u=k.join(o,"CHANGELOG.md");if(await h.pathExists(u)){let d=await j.workspace.openTextDocument(u);await j.window.showTextDocument(d)}return}c==="Start Upgrade"&&await Ka(e,n,o,a,s)}async function Ka(e,t,n,o,i){let a=k.join(n,".github","copilot-instructions.md");if(!await h.pathExists(a)){j.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},c=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),u=k.join(t,"archive","upgrades",`backup-${o||"unknown"}-${c}`);try{await j.window.withProgress({location:j.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async m=>{m.report({message:"Creating complete backup...",increment:15});try{await h.ensureDir(u);let C=k.join(u,".write-test");await h.writeFile(C,"test"),await h.remove(C)}catch(C){throw new Error(`Cannot create backup directory - check disk space and permissions: ${C.message}`)}let f=k.join(t,".github");await h.pathExists(f)&&(await h.copy(f,k.join(u,".github")),s.backed_up.push(".github/ (all cognitive memory)")),m.report({message:"Analyzing installed files...",increment:10});let p=await Ja(t);p||(p={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),m.report({message:"Scanning for schema migration needs...",increment:15});let w=[],x=k.join(t,".github","copilot-instructions.md");await h.pathExists(x)&&w.push(x);let S=k.join(t,".github","domain-knowledge");if(await h.pathExists(S)){let C=await h.readdir(S);for(let g of C)g.endsWith(".md")&&w.push(k.join(S,g))}let y=k.join(t,".github","episodic");if(await h.pathExists(y)){let C=await h.readdir(y);for(let g of C)g.endsWith(".md")&&w.push(k.join(y,g))}for(let C of w){let g=await Po(C);if(g.length>0){let b=k.relative(t,C);s.migrationTasks.push({file:b,type:"schema-migration",description:"Synapse schema migration needed",details:g})}}m.report({message:"Identifying user-created files...",increment:10});let F=await Ya(t,p);for(let C of F){s.preserved.push(`${C} (user-created)`);let g=k.join(t,C),b=await Po(g);b.length>0&&s.migrationTasks.push({file:C,type:"schema-migration",description:"User-created file needs schema migration",details:b})}m.report({message:"Preparing merge tasks...",increment:10}),s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires intelligent merge",details:["UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),m.report({message:"Updating system files...",increment:20});let A=k.join(n,".github","instructions"),N=k.join(t,".github","instructions");if(await h.pathExists(A)){let C=await h.readdir(A);for(let g of C){let b=k.join(A,g),E=k.join(N,g);if((await h.stat(b)).isFile()){let M=await h.pathExists(E);await h.copy(b,E,{overwrite:!0});let ue=await h.readFile(b,"utf8");p.files[`.github/instructions/${g}`]={type:"system",originalChecksum:Ie(ue)},M?s.updated.push(`.github/instructions/${g}`):s.added.push(`.github/instructions/${g}`)}}}let _=k.join(n,".github","prompts"),V=k.join(t,".github","prompts");if(await h.pathExists(_)){let C=await h.readdir(_);for(let g of C){let b=k.join(_,g),E=k.join(V,g);if((await h.stat(b)).isFile()){let M=await h.pathExists(E);await h.copy(b,E,{overwrite:!0});let ue=await h.readFile(b,"utf8");p.files[`.github/prompts/${g}`]={type:"system",originalChecksum:Ie(ue)},M?s.updated.push(`.github/prompts/${g}`):s.added.push(`.github/prompts/${g}`)}}}let H=k.join(n,".github","agents"),Y=k.join(t,".github","agents");if(await h.pathExists(H)){await h.ensureDir(Y);let C=await h.readdir(H);for(let g of C){let b=k.join(H,g),E=k.join(Y,g);if((await h.stat(b)).isFile()){let M=await h.pathExists(E);await h.copy(b,E,{overwrite:!0});let ue=await h.readFile(b,"utf8");p.files[`.github/agents/${g}`]={type:"system",originalChecksum:Ie(ue)},M?s.updated.push(`.github/agents/${g}`):s.added.push(`.github/agents/${g}`)}}}let v=k.join(n,".github","config"),$=k.join(t,".github","config");if(await h.pathExists(v)){await h.ensureDir($);let C=await h.readdir(v);for(let g of C)if(g.includes("template")||g==="USER-PROFILE-TEMPLATE.md"){let b=k.join(v,g),E=k.join($,g);if((await h.stat(b)).isFile()){let M=await h.pathExists(E);await h.copy(b,E,{overwrite:!0}),M?s.updated.push(`.github/config/${g}`):s.added.push(`.github/config/${g}`)}}}m.report({message:"Processing domain knowledge...",increment:10});let P=k.join(n,".github","domain-knowledge"),L=k.join(t,".github","domain-knowledge");if(await h.pathExists(P)){await h.ensureDir(L);let C=await h.readdir(P);for(let g of C){let b=k.join(P,g),E=k.join(L,g);if((await h.stat(b)).isFile()){let M=await h.readFile(b,"utf8"),ue=Ie(M);if(!await h.pathExists(E))await h.copy(b,E),p.files[`.github/domain-knowledge/${g}`]={type:"system",originalChecksum:ue},s.added.push(`.github/domain-knowledge/${g}`);else{let No=await h.readFile(E,"utf8"),Do=Ie(No),bt=p.files[`.github/domain-knowledge/${g}`]?.originalChecksum;if(bt&&Do!==bt){let Ye=E.replace(/\.md$/,`.v${i}.md`);await h.copy(b,Ye),s.preserved.push(`.github/domain-knowledge/${g} (modified by user, new version: ${k.basename(Ye)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${g}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${g}`,`New version available: ${k.basename(Ye)}`,"Review and merge changes as needed"]})}else await h.copy(b,E,{overwrite:!0}),p.files[`.github/domain-knowledge/${g}`]={type:"system",originalChecksum:ue},s.updated.push(`.github/domain-knowledge/${g}`)}}}}m.report({message:"Saving manifest...",increment:5}),p.version=i,p.upgradedAt=new Date().toISOString();let W=k.join(t,".alex-manifest.json"),q=W+".tmp";await h.writeJson(q,p,{spaces:2}),await h.move(q,W,{overwrite:!0}),m.report({message:"Generating upgrade instructions...",increment:5}),await Xa(t,o,i,s,u,c)});let d=s.migrationTasks.length===1?"task":"tasks",r=await j.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Migration ${d}: ${s.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(r==="Open Instructions (Recommended)"){let m=k.join(t,"UPGRADE-INSTRUCTIONS.md"),f=await j.workspace.openTextDocument(m);await j.window.showTextDocument(f)}else if(r==="View Full Report"){let m=k.join(t,"archive","upgrades",`upgrade-report-${c}.md`),f=await j.workspace.openTextDocument(m);await j.window.showTextDocument(f)}}catch(d){j.window.showErrorMessage(`\u274C Upgrade failed: ${d.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(d.message)}}async function Xa(e,t,n,o,i,a){let s=`# \u{1F504} Alex Upgrade: Phase 2 Required

**Upgrade**: v${t||"unknown"} \u2192 v${n}  
**Date**: ${new Date().toISOString()}  
**Status**: \u26A0\uFE0F Phase 1 Complete - AI Assistance Required

---

## What Just Happened (Phase 1 - Automated)

\u2705 Full backup created: \`${k.relative(e,i)}\`  
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

${d.details.map(m=>`- ${m}`).join(`
`)}
`).join(`
`):"No migration tasks required."}

---

## Rollback Instructions

If anything goes wrong:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${k.relative(e,i)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${a}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${k.relative(e,i)}\`

---

*This file will be deleted after successful upgrade completion.*
`;await h.writeFile(k.join(e,"UPGRADE-INSTRUCTIONS.md"),s,"utf8");let c=`# Alex Cognitive Architecture Upgrade Report

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
${d.details.map(m=>`- ${m}`).join(`
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
`,u=k.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await h.ensureDir(k.dirname(u)),await h.writeFile(u,c,"utf8")}var I=U(require("vscode")),le=U(Se()),Be=U(require("path"));async function Eo(e){let t=I.workspace.workspaceFolders;if(!t){I.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed.");return}let n=t[0].uri.fsPath,o={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},recommendations:[],sessionFile:""};await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async c=>{c.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Qa(t[0],o),c.report({message:"Phase 2: Checking version consistency...",increment:25}),await Za(n,o),c.report({message:"Phase 3: Assessing memory architecture...",increment:50}),await es(t[0],o),c.report({message:"Phase 4: Generating recommendations...",increment:75}),ts(o),c.report({message:"Phase 5: Documenting session...",increment:90}),await ns(n,o),c.report({message:"Self-actualization complete!",increment:100})});let a=`Self-Actualization Complete ${o.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":o.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":o.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${o.synapseHealth.totalSynapses} (${o.synapseHealth.brokenConnections} broken)
Memory Files: ${o.memoryConsolidation.proceduralFiles+o.memoryConsolidation.episodicFiles+o.memoryConsolidation.domainFiles}
Recommendations: ${o.recommendations.length}`,s=await I.window.showInformationMessage(a,"View Report","Open Session File");if(s==="View Report")os(o);else if(s==="Open Session File"&&o.sessionFile){let c=await I.workspace.openTextDocument(o.sessionFile);await I.window.showTextDocument(c)}return o}async function Qa(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new I.RelativePattern(e,i),s=await I.workspace.findFiles(a);for(let c of s){t.synapseHealth.totalFiles++;try{let d=(await le.readFile(c.fsPath,"utf-8")).split(`
`),r=!1;for(let m of d){if(m.trim().startsWith("```")){r=!r;continue}if(r)continue;let f;for(;(f=o.exec(m))!==null;){t.synapseHealth.totalSynapses++;let p=f[1].trim();(await I.workspace.findFiles(new I.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Za(e,t){let n=Be.join(e,".github","copilot-instructions.md");try{if(await le.pathExists(n)){let c=(await le.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);c&&(t.versionConsistency.currentVersion=c[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=I.workspace.workspaceFolders?.[0];if(a)for(let s of i){let c=new I.RelativePattern(a,s),u=await I.workspace.findFiles(c);for(let d of u)try{let r=await le.readFile(d.fsPath,"utf-8");for(let m of o)if(m.test(r)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function es(e,t){let n=await I.workspace.findFiles(new I.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await I.workspace.findFiles(new I.RelativePattern(e,".github/prompts/*.md")),i=await I.workspace.findFiles(new I.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await I.workspace.findFiles(new I.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}function ts(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections")}async function ns(e,t){let n=Be.join(e,".github","episodic");await le.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Be.join(n,a),c=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",u=`# Self-Actualization Session - ${i}

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
`;await le.writeFile(s,u,"utf-8"),t.sessionFile=s}function os(e){let t=I.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",I.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
</html>`}var X=U(require("vscode"));var l=U(require("vscode")),D=U(Se()),ae=U(require("path")),dt=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new l.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,c=0,u=0,d=[],r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){let w=new l.RelativePattern(o[0],p),x=await l.workspace.findFiles(w);for(let S of x){s++;try{let F=(await D.readFile(S.fsPath,"utf-8")).split(`
`),A=!1;for(let N=0;N<F.length;N++){let _=F[N];if(_.trim().startsWith("```")){A=!A;continue}if(A)continue;let V;for(;(V=r.exec(_))!==null;){c++;let H=V[1].trim();(await l.workspace.findFiles(new l.RelativePattern(o[0],`**/${H}`))).length===0&&(u++,t.input.detailed&&d.push(`- ${ae.basename(S.fsPath)}:${N+1} \u2192 ${H} (not found)`))}}}catch{}}}let m=u===0?"EXCELLENT":u<5?"GOOD":u<10?"NEEDS ATTENTION":"CRITICAL",f=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${c} |
| Broken Connections | ${u} |
| Health Status | ${m} |
`;return t.input.detailed&&d.length>0&&(f+=`
### Issues Found
${d.join(`
`)}`),u>0&&(f+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new l.LanguageModelToolResult([new l.LanguageModelTextPart(f)])}},mt=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new l.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let c=[];for(let d of s){let r=new l.RelativePattern(o[0],d),m=await l.workspace.findFiles(r);for(let f of m)try{let w=(await D.readFile(f.fsPath,"utf-8")).split(`
`),x=[];for(let S=0;S<w.length;S++)if(w[S].toLowerCase().includes(i)){let y=Math.max(0,S-1),F=Math.min(w.length-1,S+1),A=w.slice(y,F+1).join(`
`);x.push(`Line ${S+1}:
${A}`)}x.length>0&&c.push({file:ae.basename(f.fsPath),matches:x.slice(0,3)})}catch{}}if(c.length===0)return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`No matches found for "${t.input.query}" in ${a} memory files.`)]);let u=`## Memory Search Results for "${t.input.query}"

`;u+=`Found ${c.length} file(s) with matches:

`;for(let d of c.slice(0,5)){u+=`### ${d.file}
`;for(let r of d.matches)u+=`\`\`\`
${r}
\`\`\`
`;u+=`
`}return new l.LanguageModelToolResult([new l.LanguageModelTextPart(u)])}},pt=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ae.join(i,".github","copilot-instructions.md");if(!await D.pathExists(a))return new l.LanguageModelToolResult([new l.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let c=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/instructions/*.md")),u=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/prompts/*.md")),d=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/episodic/*.md")),r=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/domain-knowledge/*.md")),m="Unknown";try{let w=(await D.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);w&&(m=w[1])}catch{}let f=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${m} |
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
`;return new l.LanguageModelToolResult([new l.LanguageModelTextPart(f)])}},ft=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`))])}},ht=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ae.join(i,"config","USER-PROFILE.md"),s=ae.join(i,"config","user-profile.json"),{action:c,field:u,value:d}=t.input;try{switch(c){case"exists":let r=await D.pathExists(s);return new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({exists:r,path:s}))]);case"get":if(!await D.pathExists(s))return new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let m=await D.readJson(s);return u?new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({[u]:m[u]}))]):new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify(m))]);case"update":if(!u||d===void 0)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await D.ensureDir(ae.join(i,"config"));let f={};if(await D.pathExists(s)&&(f=await D.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(u)){let p=f[u]||[];Array.isArray(p)?p.includes(d)||(f[u]=[...p,d]):f[u]=[d]}else f[u]=d;return f.lastUpdated=new Date().toISOString(),await D.writeJson(s,f,{spaces:2}),await this.updateMarkdownProfile(a,f),new l.LanguageModelToolResult([new l.LanguageModelTextPart(JSON.stringify({success:!0,field:u,value:d,message:`Updated ${u} to: ${d}`}))]);default:return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`Unknown action: ${c}`)])}}catch(r){return new l.LanguageModelToolResult([new l.LanguageModelTextPart(`Error accessing user profile: ${r.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await D.writeFile(t,o,"utf-8")}},gt=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new l.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=l.workspace.workspaceFolders;if(!o)return new l.LanguageModelToolResult([new l.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let S=ae.join(i,".github","copilot-instructions.md");if(await D.pathExists(S)){let F=(await D.readFile(S,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);F&&(a=F[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},c=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],u=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let S of c){let y=new l.RelativePattern(o[0],S),F=await l.workspace.findFiles(y);for(let A of F){s.synapseHealth.totalFiles++;try{let _=(await D.readFile(A.fsPath,"utf-8")).split(`
`),V=!1;for(let H of _){if(H.trim().startsWith("```")){V=!V;continue}if(V)continue;let Y;for(;(Y=u.exec(H))!==null;){s.synapseHealth.totalSynapses++;let v=Y[1].trim();(await l.workspace.findFiles(new l.RelativePattern(o[0],`**/${v}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let d=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/instructions/*.md")),r=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/prompts/*.md")),m=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/episodic/*.md")),f=await l.workspace.findFiles(new l.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=d.length,s.memoryArchitecture.episodicFiles=r.length+m.length,s.memoryArchitecture.domainFiles=f.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let S=ae.join(i,".github","episodic");await D.ensureDir(S);let F=new Date().toISOString().split("T")[0],A=`self-actualization-${F}.prompt.md`;p=ae.join(S,A);let N=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",_=`# Self-Actualization Session - ${F}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${s.versionConsistency.currentVersion}
**Timestamp**: ${s.timestamp}

---

## \u{1F9E0} Synapse Health

| Metric | Value |
|--------|-------|
| Memory Files | ${s.synapseHealth.totalFiles} |
| Total Synapses | ${s.synapseHealth.totalSynapses} |
| Broken Connections | ${s.synapseHealth.brokenConnections} |
| Health Status | ${N} ${s.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${s.memoryArchitecture.proceduralFiles} |
| Episodic | ${s.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${s.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${s.recommendations.length>0?s.recommendations.map(V=>`- ${V}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await D.writeFile(p,_,"utf-8")}let x=`## Self-Actualization Report

### Synapse Health ${s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

| Metric | Value |
|--------|-------|
| Memory Files | ${s.synapseHealth.totalFiles} |
| Total Synapses | ${s.synapseHealth.totalSynapses} |
| Broken Connections | ${s.synapseHealth.brokenConnections} |
| Health Status | ${s.synapseHealth.healthStatus} |

### Memory Architecture

| Type | Files |
|------|-------|
| Procedural Memory | ${s.memoryArchitecture.proceduralFiles} |
| Episodic Memory | ${s.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${s.memoryArchitecture.domainFiles} |
| **Total** | **${s.memoryArchitecture.proceduralFiles+s.memoryArchitecture.episodicFiles+s.memoryArchitecture.domainFiles}** |

### Recommendations

${s.recommendations.length>0?s.recommendations.map(S=>`- ${S}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return p&&(x+=`
### Session Recorded

Meditation session documented at: \`${ae.basename(p)}\``),new l.LanguageModelToolResult([new l.LanguageModelTextPart(x)])}};async function Je(){let e=l.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ae.join(t,"config","user-profile.json");try{if(await D.pathExists(n))return await D.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function To(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function $o(e){e.subscriptions.push(l.lm.registerTool("alex_synapse_health",new dt)),e.subscriptions.push(l.lm.registerTool("alex_memory_search",new mt)),e.subscriptions.push(l.lm.registerTool("alex_architecture_status",new pt)),e.subscriptions.push(l.lm.registerTool("alex_mcp_recommendations",new ft)),e.subscriptions.push(l.lm.registerTool("alex_user_profile",new ht)),e.subscriptions.push(l.lm.registerTool("alex_self_actualization",new gt)),console.log("Alex Language Model Tools registered")}var yt=U(require("vscode")),Ne=U(Se()),wt=U(require("path"));var Mo=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,Ro=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/;function vt(){let e=yt.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function St(e,t=!1){let n=wt.join(e,".github","copilot-instructions.md");if(!await Ne.pathExists(n))return null;try{let o=await Ne.readFile(n,"utf8"),i=t?Ro:Mo,a=o.match(i);return a?a[1]:null}catch{return null}}var is=async(e,t,n,o)=>e.command==="meditate"?await as(e,t,n,o):e.command==="dream"?await ss(e,t,n,o):e.command==="learn"?await rs(e,t,n,o):e.command==="status"?await cs(e,t,n,o):e.command==="azure"?await ls(e,t,n,o):e.command==="m365"?await us(e,t,n,o):e.command==="profile"?await ds(e,t,n,o):e.command==="selfactualize"?await gs(e,t,n,o):ps(e.prompt)&&fs(t)?await hs(e,t,n,o):await ms(e,t,n,o);async function as(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function ss(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function rs(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function cs(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=vt(),a=i.isValid&&i.rootPath?await St(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

**Version**: ${a}
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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function ls(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function us(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function ds(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Je();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function ms(e,t,n,o){let i=await Je(),a=t.history.filter(u=>u instanceof X.ChatRequestTurn||u instanceof X.ChatResponseTurn),s="";if(i){let u=i.nickname||i.name;s=`
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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let u=await X.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(u.length===0){let f=To(i);return n.markdown(`${f}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let d=u[0],r=[X.LanguageModelChatMessage.User(c),X.LanguageModelChatMessage.User(e.prompt)],m=await d.sendRequest(r,{},o);for await(let f of m.text)n.markdown(f)}catch(u){if(u instanceof X.LanguageModelError)console.error("Language model error:",u.message,u.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw u}return{metadata:{command:"general"}}}function ps(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function fs(e){return e.history.length===0||e.history.length<=2}async function hs(e,t,n,o){let i=await Je(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=vt(),c=s.isValid&&s.rootPath?await St(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${c}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function gs(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files are current
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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}var ys={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Io(e){let t=X.chat.createChatParticipant("alex.cognitive",is);return t.iconPath=X.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=ys,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===X.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var kt=!1;async function De(e,t){if(kt){ye.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}kt=!0;try{return await t()}finally{kt=!1}}function ws(e){console.log("Alex Cognitive Architecture is now active!"),Io(e),$o(e);let t=ye.commands.registerCommand("alex.initialize",async()=>{await De("Initialize",()=>ko(e))}),n=ye.commands.registerCommand("alex.reset",async()=>{await De("Reset",()=>ut(e))}),o=ye.commands.registerCommand("alex.dream",async()=>{await De("Dream Protocol",()=>xo(e))}),i=ye.commands.registerCommand("alex.upgrade",async()=>{await De("Upgrade",()=>Ao(e))}),a=ye.commands.registerCommand("alex.selfActualize",async()=>{await De("Self-Actualization",()=>Eo(e))});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a)}function vs(){}0&&(module.exports={activate,deactivate});
