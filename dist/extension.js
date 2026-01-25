"use strict";var Ga=Object.create;var St=Object.defineProperty;var Ka=Object.getOwnPropertyDescriptor;var Ua=Object.getOwnPropertyNames;var za=Object.getPrototypeOf,qa=Object.prototype.hasOwnProperty;var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Ha=(e,t)=>{for(var n in t)St(e,n,{get:t[n],enumerable:!0})},qn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ua(t))!qa.call(e,i)&&i!==n&&St(e,i,{get:()=>t[i],enumerable:!(o=Ka(t,i))||o.enumerable});return e};var L=(e,t,n)=>(n=e!=null?Ga(za(e)):{},qn(t||!e||!e.__esModule?St(n,"default",{value:e,enumerable:!0}):n,e)),Wa=e=>qn(St({},"__esModule",{value:!0}),e);var ee=x(qt=>{"use strict";qt.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};qt.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Wn=x((vl,Hn)=>{var Fe=require("constants"),Va=process.cwd,kt=null,Ba=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return kt||(kt=Va.call(process)),kt};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Ht=process.chdir,process.chdir=function(e){kt=null,Ht.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Ht));var Ht;Hn.exports=Ja;function Ja(e){Fe.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=l(e.statSync),e.fstatSync=l(e.fstatSync),e.lstatSync=l(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(c,u,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(c,u,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),Ba==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(c){function u(m,p,w){var b=Date.now(),v=0;c(m,p,function y(C){if(C&&(C.code==="EACCES"||C.code==="EPERM"||C.code==="EBUSY")&&Date.now()-b<6e4){setTimeout(function(){e.stat(p,function(E,R){E&&E.code==="ENOENT"?c(m,p,y):w(C)})},v),v<100&&(v+=10);return}w&&w(C)})}return Object.setPrototypeOf&&Object.setPrototypeOf(u,c),u})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(c){function u(m,p,w,b,v,y){var C;if(y&&typeof y=="function"){var E=0;C=function(R,N,q){if(R&&R.code==="EAGAIN"&&E<10)return E++,c.call(e,m,p,w,b,v,C);y.apply(this,arguments)}}return c.call(e,m,p,w,b,v,C)}return Object.setPrototypeOf&&Object.setPrototypeOf(u,c),u})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(c){return function(u,m,p,w,b){for(var v=0;;)try{return c.call(e,u,m,p,w,b)}catch(y){if(y.code==="EAGAIN"&&v<10){v++;continue}throw y}}})(e.readSync);function t(c){c.lchmod=function(u,m,p){c.open(u,Fe.O_WRONLY|Fe.O_SYMLINK,m,function(w,b){if(w){p&&p(w);return}c.fchmod(b,m,function(v){c.close(b,function(y){p&&p(v||y)})})})},c.lchmodSync=function(u,m){var p=c.openSync(u,Fe.O_WRONLY|Fe.O_SYMLINK,m),w=!0,b;try{b=c.fchmodSync(p,m),w=!1}finally{if(w)try{c.closeSync(p)}catch{}else c.closeSync(p)}return b}}function n(c){Fe.hasOwnProperty("O_SYMLINK")&&c.futimes?(c.lutimes=function(u,m,p,w){c.open(u,Fe.O_SYMLINK,function(b,v){if(b){w&&w(b);return}c.futimes(v,m,p,function(y){c.close(v,function(C){w&&w(y||C)})})})},c.lutimesSync=function(u,m,p){var w=c.openSync(u,Fe.O_SYMLINK),b,v=!0;try{b=c.futimesSync(w,m,p),v=!1}finally{if(v)try{c.closeSync(w)}catch{}else c.closeSync(w)}return b}):c.futimes&&(c.lutimes=function(u,m,p,w){w&&process.nextTick(w)},c.lutimesSync=function(){})}function o(c){return c&&function(u,m,p){return c.call(e,u,m,function(w){d(w)&&(w=null),p&&p.apply(this,arguments)})}}function i(c){return c&&function(u,m){try{return c.call(e,u,m)}catch(p){if(!d(p))throw p}}}function a(c){return c&&function(u,m,p,w){return c.call(e,u,m,p,function(b){d(b)&&(b=null),w&&w.apply(this,arguments)})}}function s(c){return c&&function(u,m,p){try{return c.call(e,u,m,p)}catch(w){if(!d(w))throw w}}}function r(c){return c&&function(u,m,p){typeof m=="function"&&(p=m,m=null);function w(b,v){v&&(v.uid<0&&(v.uid+=4294967296),v.gid<0&&(v.gid+=4294967296)),p&&p.apply(this,arguments)}return m?c.call(e,u,m,w):c.call(e,u,w)}}function l(c){return c&&function(u,m){var p=m?c.call(e,u,m):c.call(e,u);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function d(c){if(!c||c.code==="ENOSYS")return!0;var u=!process.getuid||process.getuid()!==0;return!!(u&&(c.code==="EINVAL"||c.code==="EPERM"))}}});var Jn=x((bl,Bn)=>{var Vn=require("stream").Stream;Bn.exports=Ya;function Ya(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Vn.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),r=0,l=s.length;r<l;r++){var d=s[r];this[d]=i[d]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(c,u){if(c){a.emit("error",c),a.readable=!1;return}a.fd=u,a.emit("open",u),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Vn.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,r=a.length;s<r;s++){var l=a[s];this[l]=i[l]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var Xn=x((Sl,Yn)=>{"use strict";Yn.exports=Qa;var Xa=Object.getPrototypeOf||function(e){return e.__proto__};function Qa(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:Xa(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var Ae=x((kl,Bt)=>{var H=require("fs"),Za=Wn(),es=Jn(),ts=Xn(),Pt=require("util"),ie,Ct;typeof Symbol=="function"&&typeof Symbol.for=="function"?(ie=Symbol.for("graceful-fs.queue"),Ct=Symbol.for("graceful-fs.previous")):(ie="___graceful-fs.queue",Ct="___graceful-fs.previous");function ns(){}function eo(e,t){Object.defineProperty(e,ie,{get:function(){return t}})}var Ne=ns;Pt.debuglog?Ne=Pt.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(Ne=function(){var e=Pt.format.apply(Pt,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});H[ie]||(Qn=global[ie]||[],eo(H,Qn),H.close=(function(e){function t(n,o){return e.call(H,n,function(i){i||Zn(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Ct,{value:e}),t})(H.close),H.closeSync=(function(e){function t(n){e.apply(H,arguments),Zn()}return Object.defineProperty(t,Ct,{value:e}),t})(H.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){Ne(H[ie]),require("assert").equal(H[ie].length,0)}));var Qn;global[ie]||eo(global,H[ie]);Bt.exports=Wt(ts(H));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!H.__patched&&(Bt.exports=Wt(H),H.__patched=!0);function Wt(e){Za(e),e.gracefulify=Wt,e.createReadStream=N,e.createWriteStream=q;var t=e.readFile;e.readFile=n;function n(S,A,$){return typeof A=="function"&&($=A,A=null),U(S,A,$);function U(X,J,j,P){return t(X,J,function(h){h&&(h.code==="EMFILE"||h.code==="ENFILE")?ze([U,[X,J,j],h,P||Date.now(),Date.now()]):typeof j=="function"&&j.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(S,A,$,U){return typeof $=="function"&&(U=$,$=null),X(S,A,$,U);function X(J,j,P,h,T){return o(J,j,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?ze([X,[J,j,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(S,A,$,U){return typeof $=="function"&&(U=$,$=null),X(S,A,$,U);function X(J,j,P,h,T){return a(J,j,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?ze([X,[J,j,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=l);function l(S,A,$,U){return typeof $=="function"&&(U=$,$=0),X(S,A,$,U);function X(J,j,P,h,T){return r(J,j,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?ze([X,[J,j,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var d=e.readdir;e.readdir=u;var c=/^v[0-5]\./;function u(S,A,$){typeof A=="function"&&($=A,A=null);var U=c.test(process.version)?function(j,P,h,T){return d(j,X(j,P,h,T))}:function(j,P,h,T){return d(j,P,X(j,P,h,T))};return U(S,A,$);function X(J,j,P,h){return function(T,I){T&&(T.code==="EMFILE"||T.code==="ENFILE")?ze([U,[J,j,P],T,h||Date.now(),Date.now()]):(I&&I.sort&&I.sort(),typeof P=="function"&&P.call(this,T,I))}}}if(process.version.substr(0,4)==="v0.8"){var m=es(e);y=m.ReadStream,E=m.WriteStream}var p=e.ReadStream;p&&(y.prototype=Object.create(p.prototype),y.prototype.open=C);var w=e.WriteStream;w&&(E.prototype=Object.create(w.prototype),E.prototype.open=R),Object.defineProperty(e,"ReadStream",{get:function(){return y},set:function(S){y=S},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return E},set:function(S){E=S},enumerable:!0,configurable:!0});var b=y;Object.defineProperty(e,"FileReadStream",{get:function(){return b},set:function(S){b=S},enumerable:!0,configurable:!0});var v=E;Object.defineProperty(e,"FileWriteStream",{get:function(){return v},set:function(S){v=S},enumerable:!0,configurable:!0});function y(S,A){return this instanceof y?(p.apply(this,arguments),this):y.apply(Object.create(y.prototype),arguments)}function C(){var S=this;Z(S.path,S.flags,S.mode,function(A,$){A?(S.autoClose&&S.destroy(),S.emit("error",A)):(S.fd=$,S.emit("open",$),S.read())})}function E(S,A){return this instanceof E?(w.apply(this,arguments),this):E.apply(Object.create(E.prototype),arguments)}function R(){var S=this;Z(S.path,S.flags,S.mode,function(A,$){A?(S.destroy(),S.emit("error",A)):(S.fd=$,S.emit("open",$))})}function N(S,A){return new e.ReadStream(S,A)}function q(S,A){return new e.WriteStream(S,A)}var Y=e.open;e.open=Z;function Z(S,A,$,U){return typeof $=="function"&&(U=$,$=null),X(S,A,$,U);function X(J,j,P,h,T){return Y(J,j,P,function(I,ve){I&&(I.code==="EMFILE"||I.code==="ENFILE")?ze([X,[J,j,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}return e}function ze(e){Ne("ENQUEUE",e[0].name,e[1]),H[ie].push(e),Vt()}var xt;function Zn(){for(var e=Date.now(),t=0;t<H[ie].length;++t)H[ie][t].length>2&&(H[ie][t][3]=e,H[ie][t][4]=e);Vt()}function Vt(){if(clearTimeout(xt),xt=void 0,H[ie].length!==0){var e=H[ie].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)Ne("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){Ne("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var r=Date.now()-a,l=Math.max(a-i,1),d=Math.min(l*1.2,100);r>=d?(Ne("RETRY",t.name,n),t.apply(null,n.concat([i]))):H[ie].push(e)}xt===void 0&&(xt=setTimeout(Vt,0))}}});var ce=x(Pe=>{"use strict";var to=ee().fromCallback,re=Ae(),os=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof re[e]=="function");Object.assign(Pe,re);os.forEach(e=>{Pe[e]=to(re[e])});Pe.exists=function(e,t){return typeof t=="function"?re.exists(e,t):new Promise(n=>re.exists(e,n))};Pe.read=function(e,t,n,o,i,a){return typeof a=="function"?re.read(e,t,n,o,i,a):new Promise((s,r)=>{re.read(e,t,n,o,i,(l,d,c)=>{if(l)return r(l);s({bytesRead:d,buffer:c})})})};Pe.write=function(e,t,...n){return typeof n[n.length-1]=="function"?re.write(e,t,...n):new Promise((o,i)=>{re.write(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffer:r})})})};Pe.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?re.readv(e,t,...n):new Promise((o,i)=>{re.readv(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesRead:s,buffers:r})})})};Pe.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?re.writev(e,t,...n):new Promise((o,i)=>{re.writev(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffers:r})})})};typeof re.realpath.native=="function"?Pe.realpath.native=to(re.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var oo=x((xl,no)=>{"use strict";var is=require("path");no.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(is.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var ro=x((Cl,Jt)=>{"use strict";var io=ce(),{checkPath:ao}=oo(),so=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};Jt.exports.makeDir=async(e,t)=>(ao(e),io.mkdir(e,{mode:so(t),recursive:!0}));Jt.exports.makeDirSync=(e,t)=>(ao(e),io.mkdirSync(e,{mode:so(t),recursive:!0}))});var we=x((Tl,co)=>{"use strict";var as=ee().fromPromise,{makeDir:ss,makeDirSync:Yt}=ro(),Xt=as(ss);co.exports={mkdirs:Xt,mkdirsSync:Yt,mkdirp:Xt,mkdirpSync:Yt,ensureDir:Xt,ensureDirSync:Yt}});var Re=x((Il,uo)=>{"use strict";var rs=ee().fromPromise,lo=ce();function cs(e){return lo.access(e).then(()=>!0).catch(()=>!1)}uo.exports={pathExists:rs(cs),pathExistsSync:lo.existsSync}});var Qt=x((El,mo)=>{"use strict";var qe=ce(),ls=ee().fromPromise;async function ds(e,t,n){let o=await qe.open(e,"r+"),i=null;try{await qe.futimes(o,t,n)}finally{try{await qe.close(o)}catch(a){i=a}}if(i)throw i}function us(e,t,n){let o=qe.openSync(e,"r+");return qe.futimesSync(o,t,n),qe.closeSync(o)}mo.exports={utimesMillis:ls(ds),utimesMillisSync:us}});var Oe=x(($l,ho)=>{"use strict";var He=ce(),te=require("path"),po=ee().fromPromise;function ms(e,t,n){let o=n.dereference?i=>He.stat(i,{bigint:!0}):i=>He.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function ps(e,t,n){let o,i=n.dereference?s=>He.statSync(s,{bigint:!0}):s=>He.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function gs(e,t,n,o){let{srcStat:i,destStat:a}=await ms(e,t,o);if(a){if(nt(i,a)){let s=te.basename(e),r=te.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Zt(e,t))throw new Error(Tt(e,t,n));return{srcStat:i,destStat:a}}function fs(e,t,n,o){let{srcStat:i,destStat:a}=ps(e,t,o);if(a){if(nt(i,a)){let s=te.basename(e),r=te.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Zt(e,t))throw new Error(Tt(e,t,n));return{srcStat:i,destStat:a}}async function go(e,t,n,o){let i=te.resolve(te.dirname(e)),a=te.resolve(te.dirname(n));if(a===i||a===te.parse(a).root)return;let s;try{s=await He.stat(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(nt(t,s))throw new Error(Tt(e,n,o));return go(e,t,a,o)}function fo(e,t,n,o){let i=te.resolve(te.dirname(e)),a=te.resolve(te.dirname(n));if(a===i||a===te.parse(a).root)return;let s;try{s=He.statSync(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(nt(t,s))throw new Error(Tt(e,n,o));return fo(e,t,a,o)}function nt(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function Zt(e,t){let n=te.resolve(e).split(te.sep).filter(i=>i),o=te.resolve(t).split(te.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function Tt(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}ho.exports={checkPaths:po(gs),checkPathsSync:fs,checkParentPaths:po(go),checkParentPathsSync:fo,isSrcSubdir:Zt,areIdentical:nt}});var yo=x((Fl,wo)=>{"use strict";async function hs(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}wo.exports={asyncIteratorConcurrentProcess:hs}});var Po=x((Al,ko)=>{"use strict";var ae=ce(),ot=require("path"),{mkdirs:ws}=we(),{pathExists:ys}=Re(),{utimesMillis:vs}=Qt(),it=Oe(),{asyncIteratorConcurrentProcess:bs}=yo();async function Ss(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await it.checkPaths(e,t,"copy",n);if(await it.checkParentPaths(e,o,t,"copy"),!await bo(e,t,n))return;let s=ot.dirname(t);await ys(s)||await ws(s),await So(i,e,t,n)}async function bo(e,t,n){return n.filter?n.filter(e,t):!0}async function So(e,t,n,o){let a=await(o.dereference?ae.stat:ae.lstat)(t);if(a.isDirectory())return Cs(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return ks(a,e,t,n,o);if(a.isSymbolicLink())return Ts(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function ks(e,t,n,o,i){if(!t)return vo(e,n,o,i);if(i.overwrite)return await ae.unlink(o),vo(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function vo(e,t,n,o){if(await ae.copyFile(t,n),o.preserveTimestamps){Ps(e.mode)&&await xs(n,e.mode);let i=await ae.stat(t);await vs(n,i.atime,i.mtime)}return ae.chmod(n,e.mode)}function Ps(e){return(e&128)===0}function xs(e,t){return ae.chmod(e,t|128)}async function Cs(e,t,n,o,i){t||await ae.mkdir(o),await bs(await ae.opendir(n),async a=>{let s=ot.join(n,a.name),r=ot.join(o,a.name);if(await bo(s,r,i)){let{destStat:d}=await it.checkPaths(s,r,"copy",i);await So(d,s,r,i)}}),t||await ae.chmod(o,e.mode)}async function Ts(e,t,n,o){let i=await ae.readlink(t);if(o.dereference&&(i=ot.resolve(process.cwd(),i)),!e)return ae.symlink(i,n);let a=null;try{a=await ae.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return ae.symlink(i,n);throw s}if(o.dereference&&(a=ot.resolve(process.cwd(),a)),i!==a){if(it.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(it.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await ae.unlink(n),ae.symlink(i,n)}ko.exports=Ss});var Eo=x((Rl,Io)=>{"use strict";var le=Ae(),at=require("path"),Is=we().mkdirsSync,Es=Qt().utimesMillisSync,st=Oe();function $s(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=st.checkPathsSync(e,t,"copy",n);if(st.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=at.dirname(t);return le.existsSync(a)||Is(a),xo(i,e,t,n)}function xo(e,t,n,o){let a=(o.dereference?le.statSync:le.lstatSync)(t);if(a.isDirectory())return Ns(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Fs(a,e,t,n,o);if(a.isSymbolicLink())return js(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Fs(e,t,n,o,i){return t?As(e,n,o,i):Co(e,n,o,i)}function As(e,t,n,o){if(o.overwrite)return le.unlinkSync(n),Co(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Co(e,t,n,o){return le.copyFileSync(t,n),o.preserveTimestamps&&Rs(e.mode,t,n),en(n,e.mode)}function Rs(e,t,n){return Ms(e)&&Ds(n,e),Ls(t,n)}function Ms(e){return(e&128)===0}function Ds(e,t){return en(e,t|128)}function en(e,t){return le.chmodSync(e,t)}function Ls(e,t){let n=le.statSync(e);return Es(t,n.atime,n.mtime)}function Ns(e,t,n,o,i){return t?To(n,o,i):Os(e.mode,n,o,i)}function Os(e,t,n,o){return le.mkdirSync(n),To(t,n,o),en(n,e)}function To(e,t,n){let o=le.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)_s(i.name,e,t,n)}finally{o.closeSync()}}function _s(e,t,n,o){let i=at.join(t,e),a=at.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=st.checkPathsSync(i,a,"copy",o);return xo(s,i,a,o)}function js(e,t,n,o){let i=le.readlinkSync(t);if(o.dereference&&(i=at.resolve(process.cwd(),i)),e){let a;try{a=le.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return le.symlinkSync(i,n);throw s}if(o.dereference&&(a=at.resolve(process.cwd(),a)),i!==a){if(st.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(st.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Gs(i,n)}else return le.symlinkSync(i,n)}function Gs(e,t){return le.unlinkSync(t),le.symlinkSync(e,t)}Io.exports=$s});var It=x((Ml,$o)=>{"use strict";var Ks=ee().fromPromise;$o.exports={copy:Ks(Po()),copySync:Eo()}});var rt=x((Dl,Ao)=>{"use strict";var Fo=Ae(),Us=ee().fromCallback;function zs(e,t){Fo.rm(e,{recursive:!0,force:!0},t)}function qs(e){Fo.rmSync(e,{recursive:!0,force:!0})}Ao.exports={remove:Us(zs),removeSync:qs}});var jo=x((Ll,_o)=>{"use strict";var Hs=ee().fromPromise,Do=ce(),Lo=require("path"),No=we(),Oo=rt(),Ro=Hs(async function(t){let n;try{n=await Do.readdir(t)}catch{return No.mkdirs(t)}return Promise.all(n.map(o=>Oo.remove(Lo.join(t,o))))});function Mo(e){let t;try{t=Do.readdirSync(e)}catch{return No.mkdirsSync(e)}t.forEach(n=>{n=Lo.join(e,n),Oo.removeSync(n)})}_o.exports={emptyDirSync:Mo,emptydirSync:Mo,emptyDir:Ro,emptydir:Ro}});var zo=x((Nl,Uo)=>{"use strict";var Ws=ee().fromPromise,Go=require("path"),xe=ce(),Ko=we();async function Vs(e){let t;try{t=await xe.stat(e)}catch{}if(t&&t.isFile())return;let n=Go.dirname(e),o=null;try{o=await xe.stat(n)}catch(i){if(i.code==="ENOENT"){await Ko.mkdirs(n),await xe.writeFile(e,"");return}else throw i}o.isDirectory()?await xe.writeFile(e,""):await xe.readdir(n)}function Bs(e){let t;try{t=xe.statSync(e)}catch{}if(t&&t.isFile())return;let n=Go.dirname(e);try{xe.statSync(n).isDirectory()||xe.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")Ko.mkdirsSync(n);else throw o}xe.writeFileSync(e,"")}Uo.exports={createFile:Ws(Vs),createFileSync:Bs}});var Bo=x((Ol,Vo)=>{"use strict";var Js=ee().fromPromise,qo=require("path"),Me=ce(),Ho=we(),{pathExists:Ys}=Re(),{areIdentical:Wo}=Oe();async function Xs(e,t){let n;try{n=await Me.lstat(t)}catch{}let o;try{o=await Me.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Wo(o,n))return;let i=qo.dirname(t);await Ys(i)||await Ho.mkdirs(i),await Me.link(e,t)}function Qs(e,t){let n;try{n=Me.lstatSync(t)}catch{}try{let a=Me.lstatSync(e);if(n&&Wo(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=qo.dirname(t);return Me.existsSync(o)||Ho.mkdirsSync(o),Me.linkSync(e,t)}Vo.exports={createLink:Js(Xs),createLinkSync:Qs}});var Yo=x((_l,Jo)=>{"use strict";var De=require("path"),ct=ce(),{pathExists:Zs}=Re(),er=ee().fromPromise;async function tr(e,t){if(De.isAbsolute(e)){try{await ct.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=De.dirname(t),o=De.join(n,e);if(await Zs(o))return{toCwd:o,toDst:e};try{await ct.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:De.relative(n,e)}}function nr(e,t){if(De.isAbsolute(e)){if(!ct.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=De.dirname(t),o=De.join(n,e);if(ct.existsSync(o))return{toCwd:o,toDst:e};if(!ct.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:De.relative(n,e)}}Jo.exports={symlinkPaths:er(tr),symlinkPathsSync:nr}});var Zo=x((jl,Qo)=>{"use strict";var Xo=ce(),or=ee().fromPromise;async function ir(e,t){if(t)return t;let n;try{n=await Xo.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function ar(e,t){if(t)return t;let n;try{n=Xo.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}Qo.exports={symlinkType:or(ir),symlinkTypeSync:ar}});var oi=x((Gl,ni)=>{"use strict";var sr=ee().fromPromise,ei=require("path"),be=ce(),{mkdirs:rr,mkdirsSync:cr}=we(),{symlinkPaths:lr,symlinkPathsSync:dr}=Yo(),{symlinkType:ur,symlinkTypeSync:mr}=Zo(),{pathExists:pr}=Re(),{areIdentical:ti}=Oe();async function gr(e,t,n){let o;try{o=await be.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,l]=await Promise.all([be.stat(e),be.stat(t)]);if(ti(r,l))return}let i=await lr(e,t);e=i.toDst;let a=await ur(i.toCwd,n),s=ei.dirname(t);return await pr(s)||await rr(s),be.symlink(e,t,a)}function fr(e,t,n){let o;try{o=be.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=be.statSync(e),l=be.statSync(t);if(ti(r,l))return}let i=dr(e,t);e=i.toDst,n=mr(i.toCwd,n);let a=ei.dirname(t);return be.existsSync(a)||cr(a),be.symlinkSync(e,t,n)}ni.exports={createSymlink:sr(gr),createSymlinkSync:fr}});var ui=x((Kl,di)=>{"use strict";var{createFile:ii,createFileSync:ai}=zo(),{createLink:si,createLinkSync:ri}=Bo(),{createSymlink:ci,createSymlinkSync:li}=oi();di.exports={createFile:ii,createFileSync:ai,ensureFile:ii,ensureFileSync:ai,createLink:si,createLinkSync:ri,ensureLink:si,ensureLinkSync:ri,createSymlink:ci,createSymlinkSync:li,ensureSymlink:ci,ensureSymlinkSync:li}});var Et=x((Ul,mi)=>{function hr(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function wr(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}mi.exports={stringify:hr,stripBom:wr}});var hi=x((zl,fi)=>{var We;try{We=Ae()}catch{We=require("fs")}var $t=ee(),{stringify:pi,stripBom:gi}=Et();async function yr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||We,o="throws"in t?t.throws:!0,i=await $t.fromCallback(n.readFile)(e,t);i=gi(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var vr=$t.fromPromise(yr);function br(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||We,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=gi(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function Sr(e,t,n={}){let o=n.fs||We,i=pi(t,n);await $t.fromCallback(o.writeFile)(e,i,n)}var kr=$t.fromPromise(Sr);function Pr(e,t,n={}){let o=n.fs||We,i=pi(t,n);return o.writeFileSync(e,i,n)}fi.exports={readFile:vr,readFileSync:br,writeFile:kr,writeFileSync:Pr}});var yi=x((ql,wi)=>{"use strict";var Ft=hi();wi.exports={readJson:Ft.readFile,readJsonSync:Ft.readFileSync,writeJson:Ft.writeFile,writeJsonSync:Ft.writeFileSync}});var At=x((Hl,Si)=>{"use strict";var xr=ee().fromPromise,tn=ce(),vi=require("path"),bi=we(),Cr=Re().pathExists;async function Tr(e,t,n="utf-8"){let o=vi.dirname(e);return await Cr(o)||await bi.mkdirs(o),tn.writeFile(e,t,n)}function Ir(e,...t){let n=vi.dirname(e);tn.existsSync(n)||bi.mkdirsSync(n),tn.writeFileSync(e,...t)}Si.exports={outputFile:xr(Tr),outputFileSync:Ir}});var Pi=x((Wl,ki)=>{"use strict";var{stringify:Er}=Et(),{outputFile:$r}=At();async function Fr(e,t,n={}){let o=Er(t,n);await $r(e,o,n)}ki.exports=Fr});var Ci=x((Vl,xi)=>{"use strict";var{stringify:Ar}=Et(),{outputFileSync:Rr}=At();function Mr(e,t,n){let o=Ar(t,n);Rr(e,o,n)}xi.exports=Mr});var Ii=x((Bl,Ti)=>{"use strict";var Dr=ee().fromPromise,de=yi();de.outputJson=Dr(Pi());de.outputJsonSync=Ci();de.outputJSON=de.outputJson;de.outputJSONSync=de.outputJsonSync;de.writeJSON=de.writeJson;de.writeJSONSync=de.writeJsonSync;de.readJSON=de.readJson;de.readJSONSync=de.readJsonSync;Ti.exports=de});var Ri=x((Jl,Ai)=>{"use strict";var Lr=ce(),Ei=require("path"),{copy:Nr}=It(),{remove:Fi}=rt(),{mkdirp:Or}=we(),{pathExists:_r}=Re(),$i=Oe();async function jr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await $i.checkPaths(e,t,"move",n);await $i.checkParentPaths(e,i,t,"move");let s=Ei.dirname(t);return Ei.parse(s).root!==s&&await Or(s),Gr(e,t,o,a)}async function Gr(e,t,n,o){if(!o){if(n)await Fi(t);else if(await _r(t))throw new Error("dest already exists.")}try{await Lr.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Kr(e,t,n)}}async function Kr(e,t,n){return await Nr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Fi(e)}Ai.exports=jr});var Oi=x((Yl,Ni)=>{"use strict";var Di=Ae(),on=require("path"),Ur=It().copySync,Li=rt().removeSync,zr=we().mkdirpSync,Mi=Oe();function qr(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=Mi.checkPathsSync(e,t,"move",n);return Mi.checkParentPathsSync(e,i,t,"move"),Hr(t)||zr(on.dirname(t)),Wr(e,t,o,a)}function Hr(e){let t=on.dirname(e);return on.parse(t).root===t}function Wr(e,t,n,o){if(o)return nn(e,t,n);if(n)return Li(t),nn(e,t,n);if(Di.existsSync(t))throw new Error("dest already exists.");return nn(e,t,n)}function nn(e,t,n){try{Di.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return Vr(e,t,n)}}function Vr(e,t,n){return Ur(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Li(e)}Ni.exports=qr});var ji=x((Xl,_i)=>{"use strict";var Br=ee().fromPromise;_i.exports={move:Br(Ri()),moveSync:Oi()}});var Ce=x((Ql,Gi)=>{"use strict";Gi.exports={...ce(),...It(),...jo(),...ui(),...Ii(),...we(),...ji(),...At(),...Re(),...rt()}});var Ji=x((nd,Bi)=>{function fe(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}Bi.exports=fe;fe.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};fe.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};fe.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};fe.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};fe.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};fe.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};fe.prototype.start=fe.prototype.try;fe.prototype.errors=function(){return this._errors};fe.prototype.attempts=function(){return this._attempts};fe.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],a=i.message,s=(e[a]||0)+1;e[a]=s,s>=n&&(t=i,n=s)}return t}});var Yi=x(_e=>{var oc=Ji();_e.operation=function(e){var t=_e.timeouts(e);return new oc(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};_e.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(a,s){return a-s}),o};_e.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};_e.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(l){var d=_e.operation(t),c=Array.prototype.slice.call(arguments,1),u=c.pop();c.push(function(m){d.retry(m)||(m&&(arguments[0]=d.mainError()),u.apply(this,arguments))}),d.attempt(function(){l.apply(e,c)})}.bind(e,s),e[a].options=t}}});var Qi=x((id,Xi)=>{Xi.exports=Yi()});var Zi=x((ad,Rt)=>{Rt.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Rt.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Rt.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var ia=x((sd,Je)=>{var z=global.process,je=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};je(z)?(ea=require("assert"),Ve=Zi(),ta=/^win/i.test(z.platform),dt=require("events"),typeof dt!="function"&&(dt=dt.EventEmitter),z.__signal_exit_emitter__?ne=z.__signal_exit_emitter__:(ne=z.__signal_exit_emitter__=new dt,ne.count=0,ne.emitted={}),ne.infinite||(ne.setMaxListeners(1/0),ne.infinite=!0),Je.exports=function(e,t){if(!je(global.process))return function(){};ea.equal(typeof e,"function","a callback must be provided for exit handler"),Be===!1&&sn();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){ne.removeListener(n,e),ne.listeners("exit").length===0&&ne.listeners("afterexit").length===0&&Mt()};return ne.on(n,e),o},Mt=function(){!Be||!je(global.process)||(Be=!1,Ve.forEach(function(t){try{z.removeListener(t,Dt[t])}catch{}}),z.emit=Lt,z.reallyExit=rn,ne.count-=1)},Je.exports.unload=Mt,Ge=function(t,n,o){ne.emitted[t]||(ne.emitted[t]=!0,ne.emit(t,n,o))},Dt={},Ve.forEach(function(e){Dt[e]=function(){if(je(global.process)){var n=z.listeners(e);n.length===ne.count&&(Mt(),Ge("exit",null,e),Ge("afterexit",null,e),ta&&e==="SIGHUP"&&(e="SIGINT"),z.kill(z.pid,e))}}}),Je.exports.signals=function(){return Ve},Be=!1,sn=function(){Be||!je(global.process)||(Be=!0,ne.count+=1,Ve=Ve.filter(function(t){try{return z.on(t,Dt[t]),!0}catch{return!1}}),z.emit=oa,z.reallyExit=na)},Je.exports.load=sn,rn=z.reallyExit,na=function(t){je(global.process)&&(z.exitCode=t||0,Ge("exit",z.exitCode,null),Ge("afterexit",z.exitCode,null),rn.call(z,z.exitCode))},Lt=z.emit,oa=function(t,n){if(t==="exit"&&je(global.process)){n!==void 0&&(z.exitCode=n);var o=Lt.apply(this,arguments);return Ge("exit",z.exitCode,null),Ge("afterexit",z.exitCode,null),o}else return Lt.apply(this,arguments)}):Je.exports=function(){return function(){}};var ea,Ve,ta,dt,ne,Mt,Ge,Dt,Be,sn,rn,na,Lt,oa});var sa=x((rd,cn)=>{"use strict";var aa=Symbol();function ic(e,t,n){let o=t[aa];if(o)return t.stat(e,(a,s)=>{if(a)return n(a);n(null,s.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,a=>{if(a)return n(a);t.stat(e,(s,r)=>{if(s)return n(s);let l=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,aa,{value:l}),n(null,r.mtime,l)})})}function ac(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}cn.exports.probe=ic;cn.exports.getMtime=ac});var ua=x((cd,mt)=>{"use strict";var sc=require("path"),un=Ae(),rc=Qi(),cc=ia(),ra=sa(),Te={};function ut(e,t){return t.lockfilePath||`${e}.lock`}function mn(e,t,n){if(!t.realpath)return n(null,sc.resolve(e));t.fs.realpath(e,n)}function dn(e,t,n){let o=ut(e,t);t.fs.mkdir(o,i=>{if(!i)return ra.probe(o,t.fs,(a,s,r)=>{if(a)return t.fs.rmdir(o,()=>{}),n(a);n(null,s,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(a,s)=>{if(a)return a.code==="ENOENT"?dn(e,{...t,stale:0},n):n(a);if(!ca(s,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));la(e,t,r=>{if(r)return n(r);dn(e,{...t,stale:0},n)})})})}function ca(e,t){return e.mtime.getTime()<Date.now()-t.stale}function la(e,t,n){t.fs.rmdir(ut(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function Nt(e,t){let n=Te[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let a=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||a?ln(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Nt(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return ln(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=ra.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,l=>{let d=n.lastUpdate+t.stale<Date.now();if(!n.released){if(l)return l.code==="ENOENT"||d?ln(e,n,Object.assign(l,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Nt(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,Nt(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function ln(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),Te[e]===t&&delete Te[e],t.options.onCompromised(n)}function lc(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:un,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),mn(e,t,(o,i)=>{if(o)return n(o);let a=rc.operation(t.retries);a.attempt(()=>{dn(i,t,(s,r,l)=>{if(a.retry(s))return;if(s)return n(a.mainError());let d=Te[i]={lockfilePath:ut(i,t),mtime:r,mtimePrecision:l,options:t,lastUpdate:Date.now()};Nt(i,t),n(null,c=>{if(d.released)return c&&c(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));da(i,{...t,realpath:!1},c)})})})})}function da(e,t,n){t={fs:un,realpath:!0,...t},mn(e,t,(o,i)=>{if(o)return n(o);let a=Te[i];if(!a)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));a.updateTimeout&&clearTimeout(a.updateTimeout),a.released=!0,delete Te[i],la(i,t,n)})}function dc(e,t,n){t={stale:1e4,realpath:!0,fs:un,...t},t.stale=Math.max(t.stale||0,2e3),mn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(ut(i,t),(a,s)=>a?a.code==="ENOENT"?n(null,!1):n(a):n(null,!ca(s,t)))})}function uc(){return Te}cc(()=>{for(let e in Te){let t=Te[e].options;try{t.fs.rmdirSync(ut(e,t))}catch{}}});mt.exports.lock=lc;mt.exports.unlock=da;mt.exports.check=dc;mt.exports.getLocks=uc});var pa=x((ld,ma)=>{"use strict";var mc=Ae();function pc(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let a=i.pop(),s;try{s=e[`${o}Sync`](...i)}catch(r){return a(r)}a(null,s)}}),n}function gc(e){return(...t)=>new Promise((n,o)=>{t.push((i,a)=>{i?o(i):n(a)}),e(...t)})}function fc(e){return(...t)=>{let n,o;if(t.push((i,a)=>{n=i,o=a}),e(...t),n)throw n;return o}}function hc(e){if(e={...e},e.fs=pc(e.fs||mc),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}ma.exports={toPromise:gc,toSync:fc,toSyncOptions:hc}});var fa=x((dd,Le)=>{"use strict";var Ye=ua(),{toPromise:Ot,toSync:_t,toSyncOptions:pn}=pa();async function ga(e,t){let n=await Ot(Ye.lock)(e,t);return Ot(n)}function wc(e,t){let n=_t(Ye.lock)(e,pn(t));return _t(n)}function yc(e,t){return Ot(Ye.unlock)(e,t)}function vc(e,t){return _t(Ye.unlock)(e,pn(t))}function bc(e,t){return Ot(Ye.check)(e,t)}function Sc(e,t){return _t(Ye.check)(e,pn(t))}Le.exports=ga;Le.exports.lock=ga;Le.exports.unlock=yc;Le.exports.lockSync=wc;Le.exports.unlockSync=vc;Le.exports.check=bc;Le.exports.checkSync=Sc});var hl={};Ha(hl,{activate:()=>pl,deactivate:()=>fl});module.exports=Wa(hl);var F=L(require("vscode"));var W=L(require("vscode")),pe=L(Ce()),O=L(require("path"));async function Ki(e){let t=W.workspace.workspaceFolders;if(!t){W.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=O.join(n,".github","copilot-instructions.md");if(await pe.pathExists(o)){let i=await W.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await W.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await an(e);return}await Ui(e,n,!1)}async function an(e){let t=W.workspace.workspaceFolders;if(!t){W.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await W.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await W.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[O.join(n,".github","copilot-instructions.md"),O.join(n,".github","instructions"),O.join(n,".github","prompts"),O.join(n,".github","episodic"),O.join(n,".github","domain-knowledge"),O.join(n,".github","config"),O.join(n,".alex-manifest.json")];try{await W.window.withProgress({location:W.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await pe.remove(s)}),await Ui(e,n,!0)}catch(a){W.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function Ui(e,t,n){let o=e.extensionPath,i=O.join(o,".github","copilot-instructions.md");if(!await pe.pathExists(i)){W.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:O.join(o,".github","copilot-instructions.md"),dest:O.join(t,".github","copilot-instructions.md")},{src:O.join(o,".github","instructions"),dest:O.join(t,".github","instructions")},{src:O.join(o,".github","prompts"),dest:O.join(t,".github","prompts")},{src:O.join(o,".github","episodic"),dest:O.join(t,".github","episodic")},{src:O.join(o,".github","domain-knowledge"),dest:O.join(t,".github","domain-knowledge")},{src:O.join(o,".github","config"),dest:O.join(t,".github","config")},{src:O.join(o,".github","agents"),dest:O.join(t,".github","agents")}];try{let s=O.join(t,".github");await pe.ensureDir(s);let r=O.join(s,".write-test");try{await pe.writeFile(r,"test"),await pe.remove(r)}catch(d){throw new Error(`Cannot write to workspace - check folder permissions: ${d.message}`)}await W.window.withProgress({location:W.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async d=>{for(let c of a)d.report({message:`Copying ${O.basename(c.dest)}...`}),await pe.pathExists(c.src)?await pe.copy(c.src,c.dest,{overwrite:n}):console.warn(`Source not found: ${c.src}`)});let l=await W.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(l==="Open Main Brain File"){let d=O.join(t,".github","copilot-instructions.md"),c=await W.workspace.openTextDocument(d);await W.window.showTextDocument(c)}else l==="Run Dream Protocol"&&await W.commands.executeCommand("alex.dream")}catch(s){W.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var Q=L(require("vscode")),ye=L(Ce()),me=L(require("path")),zi={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function qi(e){let t=Q.workspace.workspaceFolders;if(!t){Q.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await Q.window.withProgress({location:Q.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],a=[];for(let y of i){let C=new Q.RelativePattern(t[0],y),E=await Q.workspace.findFiles(C);a=a.concat(E.map(R=>R.fsPath))}if(a=[...new Set(a)],a.length===0){await Q.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await Q.commands.executeCommand("alex.initialize");return}let s=[],r=new Set(a.map(y=>me.normalize(y).toLowerCase())),l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let y of a){let C;try{C=await ye.readFile(y,"utf-8")}catch(N){console.error(`Failed to read file ${y}:`,N);continue}let E=C.split(`
`),R=!1;for(let N=0;N<E.length;N++){let q=E[N];if(q.trim().startsWith("```")){R=!R;continue}if(R)continue;let Y;for(;(Y=l.exec(q))!==null;){let Z=Y[1].trim(),S=Array.from(r).some($=>$.endsWith(me.normalize(Z).toLowerCase()));if(!S){let $=me.join(n,Z);(await ye.pathExists($)||(await Q.workspace.findFiles(new Q.RelativePattern(t[0],`**/${Z}`))).length>0)&&(S=!0)}if(!S){let $=me.dirname(y),U=me.join($,Z);await ye.pathExists(U)&&(S=!0)}["target-file.md","CHANGELOG.md"].includes(Z)&&(S=!0),s.push({sourceFile:y,targetFile:Z,strength:Y[2].trim(),type:Y[3]?.trim()||"association",direction:Y[4]?.trim()||"unidirectional",condition:Y[5]?.trim(),line:N+1,isValid:S})}}}let d=s.filter(y=>!y.isValid),c=new Set(s.map(y=>y.targetFile.toLowerCase())),u=[],m=[];for(let y of d){let C=me.basename(y.targetFile);if(zi[C]){let E=zi[C];try{let R=await ye.readFile(y.sourceFile,"utf-8"),N=y.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),q=new RegExp(`\\[${N}\\]`,"g");if(q.test(R)){let Y=R.replace(q,`[${E}]`);await ye.writeFile(y.sourceFile,Y,"utf-8"),y.repaired=!0,y.newTarget=E,u.push(y)}else m.push(y)}catch(R){console.error(`Failed to repair synapse in ${y.sourceFile}:`,R),m.push(y)}}else m.push(y)}d=m;let p={timestamp:new Date().toISOString(),totalFiles:a.length,totalSynapses:s.length,brokenSynapses:d,repairedSynapses:u,orphanedFiles:[]},w=Jr(p),b=me.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await ye.ensureDir(me.dirname(b)),await ye.writeFile(b,w),d.length>0){if(await Q.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${d.length} broken synapse${d.length>1?"s":""}!

${u.length>0?`\u2705 Auto-repaired: ${u.length}
`:""}\u274C Need manual repair: ${d.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let y=s.length>50?"excellent":s.length>20?"good":"developing";if(await Q.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${a.length} memory files
\u2022 ${s.length} active synapses
${u.length>0?`\u2022 ${u.length} auto-repaired
`:""}\u2022 Network health: ${y}`,"View Full Report","Close")!=="View Full Report")return}let v=await Q.workspace.openTextDocument(b);await Q.window.showTextDocument(v)})}function Jr(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${me.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${me.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var B=L(require("vscode")),f=L(Ce()),k=L(require("path")),Wi=L(require("crypto"));function lt(e){return Wi.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function Yr(e){let t=k.join(e,".github","copilot-instructions.md");if(!await f.pathExists(t))return null;try{let o=(await f.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function Xr(e){try{return(await f.readJson(k.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function Qr(e){let t=k.join(e,".alex-manifest.json");if(await f.pathExists(t))try{return await f.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function Zr(e,t,n){let o=k.join(e,".github","copilot-instructions.md"),i=k.join(t,".github","copilot-instructions.md");if(!await f.pathExists(o)||!await f.pathExists(i))return{success:!1,reason:"File not found"};try{let a=await f.readFile(o,"utf8"),s=await f.readFile(i,"utf8"),r=a.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/),l=r?r[0]:null,d=a.match(/## Synapses[\s\S]*?(?=##|$)/),c=a.split(`
`).length,u=s.split(`
`).length;if(c>u*1.2)return{success:!1,reason:"User file has significant customizations"};let m=a.match(/^## [^\n]+/gm)||[],p=s.match(/^## [^\n]+/gm)||[],w=m.filter(v=>!p.includes(v));if(w.length>2)return{success:!1,reason:`User has ${w.length} custom sections`};let b=s;if(l&&l.includes("P5")&&!l.includes("Available for")){let v=b.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);v&&(b=b.replace(v[0],l))}return b=b.replace(/\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,`**Version**: ${n}`),await f.writeFile(o,b,"utf8"),{success:!0}}catch(a){return{success:!1,reason:a.message}}}async function Hi(e){let t=[];if(!await f.pathExists(e))return t;try{let n=await f.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function ec(e,t){let n=[],o=k.join(e,".github","domain-knowledge");if(await f.pathExists(o)){let i=await f.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function Vi(e){let t=B.workspace.workspaceFolders;if(!t){B.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,i=k.join(n,".github","copilot-instructions.md");if(!await f.pathExists(i)){await B.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await B.commands.executeCommand("alex.initialize");return}let a=await Yr(n),s=await Xr(o);if(a===s){await B.window.showInformationMessage(`\u2705 Alex is already at the latest version (${s}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await B.commands.executeCommand("alex.dream");return}let r=await B.window.showInformationMessage(`\u{1F504} Upgrade Available: v${a||"unknown"} \u2192 v${s}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(r==="What's New?"){let l=k.join(o,"CHANGELOG.md");if(await f.pathExists(l)){let d=await B.workspace.openTextDocument(l);await B.window.showTextDocument(d)}return}r==="Start Upgrade"&&await tc(e,n,o,a,s)}async function tc(e,t,n,o,i){let a=k.join(n,".github","copilot-instructions.md");if(!await f.pathExists(a)){B.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),l=k.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await B.window.withProgress({location:B.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async u=>{u.report({message:"Creating complete backup...",increment:15});try{await f.ensureDir(l);let P=k.join(l,".write-test");await f.writeFile(P,"test"),await f.remove(P)}catch(P){throw new Error(`Cannot create backup directory - check disk space and permissions: ${P.message}`)}let m=k.join(t,".github");await f.pathExists(m)&&(await f.copy(m,k.join(l,".github")),s.backed_up.push(".github/ (all cognitive memory)")),u.report({message:"Analyzing installed files...",increment:10});let p=await Qr(t);p||(p={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),u.report({message:"Scanning for schema migration needs...",increment:15});let w=[],b=k.join(t,".github","copilot-instructions.md");await f.pathExists(b)&&w.push(b);let v=k.join(t,".github","domain-knowledge");if(await f.pathExists(v)){let P=await f.readdir(v);for(let h of P)h.endsWith(".md")&&w.push(k.join(v,h))}let y=k.join(t,".github","episodic");if(await f.pathExists(y)){let P=await f.readdir(y);for(let h of P)h.endsWith(".md")&&w.push(k.join(y,h))}for(let P of w){let h=await Hi(P);if(h.length>0){let T=k.relative(t,P);s.migrationTasks.push({file:T,type:"schema-migration",description:"Synapse schema migration needed",details:h})}}u.report({message:"Identifying user-created files...",increment:10});let C=await ec(t,p);for(let P of C){s.preserved.push(`${P} (user-created)`);let h=k.join(t,P),T=await Hi(h);T.length>0&&s.migrationTasks.push({file:P,type:"schema-migration",description:"User-created file needs schema migration",details:T})}u.report({message:"Merging core brain file...",increment:10});let E=await Zr(t,n,i);E.success?s.updated.push(".github/copilot-instructions.md (auto-merged)"):s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires manual merge",details:[`Auto-merge failed: ${E.reason}`,"UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),u.report({message:"Updating system files...",increment:20});let R=k.join(n,".github","instructions"),N=k.join(t,".github","instructions");if(await f.pathExists(R)){let P=await f.readdir(R);for(let h of P){let T=k.join(R,h),I=k.join(N,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/instructions/${h}`]={type:"system",originalChecksum:lt($e)},ve?s.updated.push(`.github/instructions/${h}`):s.added.push(`.github/instructions/${h}`)}}}let q=k.join(n,".github","prompts"),Y=k.join(t,".github","prompts");if(await f.pathExists(q)){let P=await f.readdir(q);for(let h of P){let T=k.join(q,h),I=k.join(Y,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/prompts/${h}`]={type:"system",originalChecksum:lt($e)},ve?s.updated.push(`.github/prompts/${h}`):s.added.push(`.github/prompts/${h}`)}}}let Z=k.join(n,".github","agents"),S=k.join(t,".github","agents");if(await f.pathExists(Z)){await f.ensureDir(S);let P=await f.readdir(Z);for(let h of P){let T=k.join(Z,h),I=k.join(S,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/agents/${h}`]={type:"system",originalChecksum:lt($e)},ve?s.updated.push(`.github/agents/${h}`):s.added.push(`.github/agents/${h}`)}}}let A=k.join(n,".github","config"),$=k.join(t,".github","config");if(await f.pathExists(A)){await f.ensureDir($);let P=await f.readdir(A);for(let h of P)if(h.includes("template")||h==="USER-PROFILE-TEMPLATE.md"){let T=k.join(A,h),I=k.join($,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0}),ve?s.updated.push(`.github/config/${h}`):s.added.push(`.github/config/${h}`)}}}u.report({message:"Processing domain knowledge...",increment:10});let U=k.join(n,".github","domain-knowledge"),X=k.join(t,".github","domain-knowledge");if(await f.pathExists(U)){await f.ensureDir(X);let P=await f.readdir(U);for(let h of P){let T=k.join(U,h),I=k.join(X,h);if((await f.stat(T)).isFile()){let ve=await f.readFile(T,"utf8"),$e=lt(ve);if(!await f.pathExists(I))await f.copy(T,I),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:$e},s.added.push(`.github/domain-knowledge/${h}`);else{let _a=await f.readFile(I,"utf8"),ja=lt(_a),zn=p.files[`.github/domain-knowledge/${h}`]?.originalChecksum;if(zn&&ja!==zn){let zt=I.replace(/\.md$/,`.v${i}.md`);await f.copy(T,zt),s.preserved.push(`.github/domain-knowledge/${h} (modified by user, new version: ${k.basename(zt)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${h}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${h}`,`New version available: ${k.basename(zt)}`,"Review and merge changes as needed"]})}else await f.copy(T,I,{overwrite:!0}),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:$e},s.updated.push(`.github/domain-knowledge/${h}`)}}}}u.report({message:"Saving manifest...",increment:5}),p.version=i,p.upgradedAt=new Date().toISOString();let J=k.join(t,".alex-manifest.json"),j=J+".tmp";await f.writeJson(j,p,{spaces:2}),await f.move(j,J,{overwrite:!0}),u.report({message:"Generating upgrade instructions...",increment:5}),await nc(t,o,i,s,l,r)});let d=s.migrationTasks.length===1?"task":"tasks",c=await B.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Migration ${d}: ${s.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(c==="Open Instructions (Recommended)"){let u=k.join(t,"UPGRADE-INSTRUCTIONS.md"),m=await B.workspace.openTextDocument(u);await B.window.showTextDocument(m)}else if(c==="View Full Report"){let u=k.join(t,"archive","upgrades",`upgrade-report-${r}.md`),m=await B.workspace.openTextDocument(u);await B.window.showTextDocument(m)}}catch(d){B.window.showErrorMessage(`\u274C Upgrade failed: ${d.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(d.message)}}async function nc(e,t,n,o,i,a){let s=`# \u{1F504} Alex Upgrade: Phase 2 Required

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

${o.migrationTasks.length>0?o.migrationTasks.map((d,c)=>`
### Task ${c+1}: ${d.file}

**Type**: ${d.type}  
**Description**: ${d.description}

${d.details.map(u=>`- ${u}`).join(`
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
`;await f.writeFile(k.join(e,"UPGRADE-INSTRUCTIONS.md"),s,"utf8");let r=`# Alex Cognitive Architecture Upgrade Report

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

${o.migrationTasks.length>0?o.migrationTasks.map((d,c)=>`
### ${c+1}. ${d.file}

**Type**: \`${d.type}\`  
**Description**: ${d.description}

**Details**:
${d.details.map(u=>`- ${u}`).join(`
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
`,l=k.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await f.ensureDir(k.dirname(l)),await f.writeFile(l,r,"utf8")}var _=L(require("vscode")),ke=L(Ce()),Kt=L(require("path"));var M=L(require("vscode")),D=L(Ce()),ue=L(require("path")),Cn=L(require("os")),Ta=L(fa());var ha=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,wa=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ie=".alex",ya={root:Ie,knowledge:`${Ie}/global-knowledge`,patterns:`${Ie}/global-knowledge/patterns`,insights:`${Ie}/global-knowledge/insights`,index:`${Ie}/global-knowledge/index.json`,projectRegistry:`${Ie}/project-registry.json`,globalProfile:`${Ie}/user-profile.json`},gn={pattern:"GK-",insight:"GI-"};var he=L(require("vscode")),V=L(Ce()),Ee=L(require("path")),va=L(require("https"));var Ke="alex-knowledge-index.json",ba="Alex Cognitive Architecture - Global Knowledge Base";async function kc(){try{return await he.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function pt(e,t={}){let n=await kc();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let a=new URL(`https://api.github.com${e}`),s={hostname:a.hostname,path:a.pathname+a.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=va.request(s,l=>{let d="";l.on("data",c=>{d+=c}),l.on("end",()=>{if(l.statusCode&&l.statusCode>=200&&l.statusCode<300)if(l.statusCode===204||!d)o(null);else try{o(JSON.parse(d))}catch(c){i(new Error(`Failed to parse GitHub response: ${c}`))}else i(new Error(`GitHub API error (${l.statusCode}): ${d}`))})});r.on("error",l=>i(l)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function Sa(){return Ee.join(oe("root"),"sync-metadata.json")}async function jt(){let e=Sa();try{if(await V.pathExists(e))return await V.readJson(e)}catch{}return{}}async function Qe(e){let t=Sa();await V.writeJson(t,e,{spaces:2})}async function bn(){let e=await jt();if(e.gistId)try{let i=await pt(`/gists/${e.gistId}`);if(i)return i}catch{}let t=oe("index");if(await V.pathExists(t))try{let i=await V.readJson(t);if(i.cloudGistId){let a=await pt(`/gists/${i.cloudGistId}`);if(a)return await Qe({...e,gistId:a.id}),a}}catch{}let n=await pt("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===ba||i.files[Ke]);return o&&await Qe({...e,gistId:o.id}),o||null}async function ka(e){let t={};for(let[i,a]of Object.entries(e))t[i]={content:a};let n=await pt("/gists",{method:"POST",body:{description:ba,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await jt();return await Qe({...o,gistId:n.id}),n}async function Pa(e,t){let n={};for(let[i,a]of Object.entries(t))n[i]=a===null?null:{content:a};let o=await pt(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function Gt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function gt(){try{let e=await jt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=oe("index");if(!await V.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await V.readJson(t),o=Gt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function ft(){try{await se();let e=oe("index");if(!await V.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await V.readJson(e),n=await bn(),o=!n;n||(n=await ka({[Ke]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[Ke]:JSON.stringify(t,null,2)};for(let s of t.entries)if(await V.pathExists(s.filePath)){let r=await V.readFile(s.filePath,"utf-8"),l=Ee.basename(s.filePath);i[l]=r}n=await Pa(n.id,i),await Ue(()=>t);let a=Gt(t);return await Qe({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:a,lastRemoteHash:a}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function ht(){try{await se();let e=await bn();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[Ke];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let a of n.entries){let s=Ee.basename(a.filePath),r=e.files[s];if(r){let l=a.type==="pattern"?"patterns":"insights",d=Ee.join(oe(l),s);a.filePath=d,await V.writeFile(d,r.content,"utf-8"),o++}}await Ue(()=>n);let i=Gt(n);return await Qe({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function Ze(){try{await se();let e=oe("index"),t;await V.pathExists(e)?t=await V.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await bn(),o;n&&n.files[Ke]?o=JSON.parse(n.files[Ke].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let u of o.entries)i.set(u.id,u);for(let u of t.entries){let m=i.get(u.id);(!m||new Date(u.modified)>new Date(m.modified))&&i.set(u.id,u)}let a={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},s={[Ke]:JSON.stringify(a,null,2)};for(let u of a.entries)if(await V.pathExists(u.filePath)){let m=await V.readFile(u.filePath,"utf-8"),p=Ee.basename(u.filePath);s[p]=m}let r=0;if(n)for(let u of o.entries){let m=Ee.basename(u.filePath),p=n.files[m],w=u.type==="pattern"?"patterns":"insights",b=Ee.join(oe(w),m);if(p&&!await V.pathExists(b)){await V.writeFile(b,p.content,"utf-8");let v=i.get(u.id);v&&(v.filePath=b),r++}}n?await Pa(n.id,s):n=await ka(s),await Ue(()=>a);let l=Gt(a);await Qe({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:l,lastRemoteHash:l});let d=t.entries.filter(u=>!o.entries.find(m=>m.id===u.id)).length,c=r;return{success:!0,status:"up-to-date",message:`Synced! ${d} pushed, ${c} pulled. Total: ${a.entries.length} entries.`,entriesPushed:d,entriesPulled:c}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function et(){let e=await jt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var yn=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new he.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await ft();break;case"pull":i=await ht();break;default:i=await Ze()}let s=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;s+=`**Status**: ${i.status}
`,s+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(s+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(s+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await et();return r&&(s+=`
**Cloud URL**: ${r}
`),new he.LanguageModelToolResult([new he.LanguageModelTextPart(s)])}};function xa(e){e.subscriptions.push(he.lm.registerTool("alex_cloud_sync",new yn))}var Xe,fn,hn=!1,Pc=300*1e3,xc=60*1e3,wn;function Cc(){return wn||(wn=he.window.createOutputChannel("Alex Unconscious Mind")),wn}function Se(e){let t=new Date().toISOString();Cc().appendLine(`[${t}] ${e}`)}async function vn(){if(hn)return Se("Sync already in progress, skipping"),null;if(fn&&Date.now()-fn.getTime()<xc)return Se("Too soon since last sync, skipping"),null;hn=!0,fn=new Date;try{if(Se("Starting transparent background sync..."),(await gt()).status==="up-to-date")return Se("Already up-to-date, no sync needed"),{success:!0,status:"up-to-date",message:"Already synced"};let t=await Ze();return Se(`Sync complete: ${t.message}`),t}catch(e){return Se(`Transparent sync failed: ${e}`),{success:!1,status:"error",message:`${e}`}}finally{hn=!1}}async function tt(){setTimeout(async()=>{let e=await vn();e&&e.success&&e.entriesPushed&&e.entriesPushed>0&&Se(`Auto-synced ${e.entriesPushed} entries after modification`)},2e3)}function Ca(e){Xe&&clearInterval(Xe),Se("Background sync enabled - Alex unconscious mind active"),setTimeout(async()=>{Se("Running startup sync..."),await vn()},1e4),Xe=setInterval(async()=>{await vn()},Pc),e.subscriptions.push({dispose:()=>{Xe&&(clearInterval(Xe),Xe=void 0),Se("Background sync disabled")}})}var Tc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function Tn(){return ue.join(Cn.homedir(),Ie)}function oe(e){return ue.join(Cn.homedir(),ya[e])}async function se(){let e=[oe("root"),oe("knowledge"),oe("patterns"),oe("insights")];for(let t of e)await D.ensureDir(t)}async function In(e,t){await D.pathExists(e)||await D.ensureFile(e);let n;try{return n=await Ta.lock(e,Tc),await t()}finally{n&&await n()}}async function Ue(e){let t=oe("index");return await se(),await In(t,async()=>{let n;try{if(await D.pathExists(t)){let o=await D.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await D.writeJson(t,n,{spaces:2}),n})}async function Ia(e){let t=oe("projectRegistry");return await se(),await In(t,async()=>{let n;try{if(await D.pathExists(t)){let o=await D.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await D.writeJson(t,n,{spaces:2}),n})}async function En(){let e=oe("index");return await se(),await In(e,async()=>{try{if(await D.pathExists(e)){let n=await D.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await D.writeJson(e,t,{spaces:2}),t})}async function $n(){let e=oe("projectRegistry");return await se(),await Ia(t=>t)}async function Ea(){let e=M.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=ue.basename(t),o=0,i=new M.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await M.workspace.findFiles(i)).length;let s;return await Ia(r=>{let l=r.projects.findIndex(c=>c.path===t),d={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return l>=0?(r.projects[l]={...r.projects[l],...d},s=r.projects[l]):(r.projects.push(d),s=d),r}),s}function $a(e,t){let n=e==="pattern"?gn.pattern:gn.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function Ic(e,t,n,o,i){await se();let a=$a("pattern",e),s=`${a}.md`,r=ue.join(oe("patterns"),s),l=`# ${e}

**ID**: ${a}  
**Category**: ${n}  
**Tags**: ${o.join(", ")}  
**Source**: ${i||"Manual entry"}  
**Created**: ${new Date().toISOString()}  

---

${t}

---

## Synapses

*Add cross-references to related knowledge files here*

`;await D.writeFile(r,l,"utf-8");let d={id:a,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await Ue(c=>(c.entries.push(d),c)),d}async function Ec(e,t,n,o,i){let a=e.filePath;if(!a||!await D.pathExists(a))throw new Error(`Global pattern file not found: ${a}`);let s=[...new Set([...e.tags||[],...o])],r=`# ${e.title}

**ID**: ${e.id}  
**Category**: ${n}  
**Tags**: ${s.join(", ")}  
**Source**: ${i||e.sourceProject||"Manual entry"}  
**Created**: ${e.created}  
**Modified**: ${new Date().toISOString()}  

---

${t}

---

## Synapses

*Add cross-references to related knowledge files here*

`;await D.writeFile(a,r,"utf-8");let l={...e,category:n,tags:s,modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":"")};return await Ue(d=>{let c=d.entries.findIndex(u=>u.id===e.id);return c>=0&&(d.entries[c]=l),d}),l}async function Fn(e,t,n,o,i,a,s){await se();let r=$a("insight",e),l=`${r}.md`,d=ue.join(oe("insights"),l),c=`# ${e}

**ID**: ${r}  
**Category**: ${n}  
**Tags**: ${o.join(", ")}  
**Source Project**: ${i||"Unknown"}  
**Date**: ${new Date().toISOString()}  

---

## Context

${a||"No problem context provided."}

## Insight

${t}

## Solution

${s||"See insight above."}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${o.join(", ")}
- Related patterns

## Related Projects

- ${i||"Origin project"}

`;await D.writeFile(d,c,"utf-8");let u={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:d};return await Ue(m=>(m.entries.push(u),m)),u}async function wt(e,t={}){let n=await En(),o=e.toLowerCase(),i=o.split(/\s+/).filter(s=>s.length>2),a=[];for(let s of n.entries){if(t.type&&t.type!=="all"&&s.type!==t.type||t.category&&s.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(d=>s.tags.map(c=>c.toLowerCase()).includes(d.toLowerCase())))continue;let r=0;s.title.toLowerCase().includes(o)&&(r+=10);for(let l of i)s.title.toLowerCase().includes(l)&&(r+=3);for(let l of s.tags){(l.toLowerCase().includes(o)||o.includes(l.toLowerCase()))&&(r+=5);for(let d of i)l.toLowerCase().includes(d)&&(r+=2)}s.summary.toLowerCase().includes(o)&&(r+=3);for(let l of i)s.summary.toLowerCase().includes(l)&&(r+=1);if(s.category.toLowerCase().includes(o)&&(r+=2),r>0){let l;if(await D.pathExists(s.filePath))try{l=await D.readFile(s.filePath,"utf-8");for(let d of i){let c=(l.toLowerCase().match(new RegExp(d,"g"))||[]).length;r+=Math.min(c,5)*.5}}catch{}a.push({entry:s,relevance:r,content:l})}}return a.sort((s,r)=>r.relevance-s.relevance),a.slice(0,t.limit||10)}async function Fa(e,t,n=[]){try{let o=await D.readFile(e,"utf-8"),i=ue.basename(e,".md"),a=o.match(/^#\s+(.+)$/m),s=a?a[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),l=r?r[1].split(",").map(m=>m.trim()):[],d=[...new Set([...l,...n])],c=M.workspace.workspaceFolders,u=c?ue.basename(c[0].uri.fsPath):void 0;return await Ic(s,o,t,d,u)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}var $c=["DK-SKILL-WISHLIST","DK-GENERIC-FRAMEWORK","VERSION-NAMING-CONVENTION"];async function Fc(e){let t=ue.basename(e,".md"),n=await D.readFile(e,"utf-8"),o=0,i=[],a=n.match(/^#\s+(.+)$/m),s=a?a[1]:t.replace(/^DK-/,"").replace(/-/g," "),r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g,l=n.match(r);l&&l.length>0&&(o+=3,i.push(`Has ${l.length} synapse connection(s)`));let d=n.match(/^##\s+.+$/gm);d&&d.length>=3&&(o+=2,i.push(`Well-structured with ${d.length} sections`));let c=n.match(/\*\*Tags\*\*:\s*(.+)$/m),u=[];c&&(u=c[1].split(",").map(N=>N.trim()).filter(N=>N.length>0),u.length>0&&(o+=1,i.push(`Has ${u.length} tag(s)`))),n.length>1e3&&(o+=1,i.push("Substantial content (>1KB)")),n.length>5e3&&(o+=2,i.push("Rich content (>5KB)"));let m=n.match(/```[\s\S]*?```/g);m&&m.length>0&&(o+=2,i.push(`Contains ${m.length} code example(s)`));let w=[/pattern/i,/best practice/i,/guideline/i,/framework/i,/principle/i,/architecture/i,/design/i,/approach/i].filter(N=>N.test(n)).length;w>=2&&(o+=Math.min(w,3),i.push("Contains general/reusable concepts"));let b=Ac(n,t),v=await En(),y=s.toLowerCase().replace(/[^a-z0-9]/g,"-"),C=v.entries.find(N=>N.title.toLowerCase().replace(/[^a-z0-9]/g,"-")===y||N.id.includes(y)),E=!!C,R=!1;if(E&&C)try{let q=(await D.stat(e)).mtime,Y=new Date(C.modified);R=q>Y}catch{R=!1}return{filePath:e,filename:t,title:s,score:o,reasons:i,category:b,tags:u,isPromotionCandidate:o>=5&&!E,alreadyPromoted:E,existingEntry:C,hasLocalChanges:R}}function Ac(e,t){let n=e.toLowerCase(),o=t.toLowerCase(),i=[[/error|exception|fault|handling/i,"error-handling"],[/api|rest|graphql|endpoint/i,"api-design"],[/test|spec|jest|mocha|assertion/i,"testing"],[/debug|troubleshoot|diagnos/i,"debugging"],[/performance|optimi|cache|speed/i,"performance"],[/architecture|design|pattern|structure/i,"architecture"],[/security|auth|encrypt|vulnerab/i,"security"],[/deploy|ci\/cd|pipeline|docker|kubernetes/i,"deployment"],[/document|readme|comment|diagram/i,"documentation"],[/refactor|clean|improve|modernize/i,"refactoring"],[/tool|config|setup|environment/i,"tooling"]];for(let[a,s]of i)if(a.test(n)||a.test(o))return s;return"general"}async function Aa(e,t={}){let{dryRun:n=!1,minScore:o=5}=t;await se();let i={evaluated:0,promoted:[],updated:[],skipped:[],alreadyGlobal:[]},a=ue.join(e,".github","domain-knowledge");if(!await D.pathExists(a))return i;let r=(await D.readdir(a)).filter(l=>l.startsWith("DK-")&&l.endsWith(".md"));for(let l of r){let d=ue.join(a,l),c=l.replace(".md","");if($c.some(u=>c.includes(u))){i.skipped.push({filename:l,reason:"Excluded meta-file"});continue}i.evaluated++;try{let u=await Fc(d);if(u.alreadyPromoted){if(u.hasLocalChanges&&u.existingEntry)if(n)i.updated.push({...u.existingEntry,modified:new Date().toISOString(),summary:"[DRY-RUN] Would be updated from local changes"});else{let m=await D.readFile(d,"utf-8"),p=M.workspace.workspaceFolders,w=p?ue.basename(p[0].uri.fsPath):void 0,b=await Ec(u.existingEntry,m,u.category,u.tags,w);i.updated.push(b)}else i.alreadyGlobal.push(l);continue}if(!u.isPromotionCandidate||u.score<o){i.skipped.push({filename:l,reason:`Score ${u.score}/${o} - ${u.reasons.join(", ")||"Needs more structure/content"}`});continue}if(n)i.promoted.push({id:`[DRY-RUN] ${c}`,title:u.title,type:"pattern",category:u.category,tags:u.tags,created:new Date().toISOString(),modified:new Date().toISOString(),summary:`Would be promoted with score ${u.score}`,filePath:d});else{let m=await Fa(d,u.category,u.tags);m&&i.promoted.push(m)}}catch(u){i.skipped.push({filename:l,reason:`Error: ${u}`})}}return!n&&(i.promoted.length>0||i.updated.length>0)&&tt(),i}async function An(){let e=await En(),t={},n={};for(let a of e.entries){t[a.category]=(t[a.category]||0)+1;for(let s of a.tags)n[s]=(n[s]||0)+1}let o=Object.entries(n).map(([a,s])=>({tag:a,count:s})).sort((a,s)=>s.count-a.count).slice(0,10),i=[...e.entries].sort((a,s)=>new Date(s.created).getTime()-new Date(a.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(a=>a.type==="pattern").length,totalInsights:e.entries.filter(a=>a.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var Sn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new M.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await se();let{query:o,type:i,category:a,tags:s}=t.input,r=await wt(o,{type:i,category:a,tags:s?s.split(",").map(d=>d.trim()):void 0,limit:10});if(r.length===0)return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`No global knowledge found matching "${o}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`)]);let l=`## Global Knowledge Search Results

`;l+=`Found **${r.length}** relevant entries for "${o}":

`;for(let{entry:d,relevance:c}of r){let u=d.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";l+=`### ${u} ${d.title}
`,l+=`- **Type**: ${d.type} | **Category**: ${d.category}
`,l+=`- **Tags**: ${d.tags.join(", ")}
`,d.sourceProject&&(l+=`- **Source**: ${d.sourceProject}
`),l+=`- **Summary**: ${d.summary}
`,l+=`- **File**: \`${d.filePath}\`

`}return new M.LanguageModelToolResult([new M.LanguageModelTextPart(l)])}},kn=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new M.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await se();let{title:o,insight:i,category:a,tags:s,problem:r,solution:l}=t.input,d=M.workspace.workspaceFolders,c=d?ue.basename(d[0].uri.fsPath):void 0,u=await Fn(o,i,a||"general",s?s.split(",").map(p=>p.trim()):[],c,r,l);tt();let m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${u.id}  
**Title**: ${u.title}  
**Category**: ${u.category}  
**Tags**: ${u.tags.join(", ")}  
**Source Project**: ${u.sourceProject||"Unknown"}  
**File**: \`${u.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(m)])}},Pn=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${ue.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new M.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:a}=t.input;if(!await D.pathExists(o))return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let s=await Fa(o,i||"general",a?a.split(",").map(l=>l.trim()):[]);if(!s)return new M.LanguageModelToolResult([new M.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);tt();let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${s.id}  
**Title**: ${s.title}  
**Category**: ${s.category}  
**Tags**: ${s.tags.join(", ")}  
**Global File**: \`${s.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(r)])}},xn=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await se();let o=await An(),i=await $n(),a="";try{let r=await gt();a=`| Cloud Sync | ${r.status==="up-to-date"?"\u2705":r.status==="needs-push"?"\u{1F4E4}":r.status==="needs-pull"?"\u{1F4E5}":r.status==="error"?"\u274C":"\u26AA"} ${r.status} |
`}catch{a=`| Cloud Sync | \u26AA Not configured |
`}let s=`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${o.totalPatterns} |
| Global Insights | ${o.totalInsights} |
| Known Projects | ${i.projects.length} |
${a}
### Knowledge by Category
`;for(let[r,l]of Object.entries(o.categories))s+=`- **${r}**: ${l}
`;if(o.topTags.length>0){s+=`
### Top Tags
`;for(let{tag:r,count:l}of o.topTags)s+=`- ${r}: ${l}
`}if(o.recentEntries.length>0){s+=`
### Recent Entries
`;for(let r of o.recentEntries){let l=r.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";s+=`- ${l} **${r.title}** (${r.category})
`}}if(i.projects.length>0){s+=`
### Known Projects
`;for(let r of i.projects.slice(0,5))s+=`- **${r.name}** - ${r.knowledgeFiles} knowledge files
`}return s+=`
### Global Knowledge Location
\`${Tn()}\`
`,new M.LanguageModelToolResult([new M.LanguageModelTextPart(s)])}};function Ra(e){e.subscriptions.push(M.lm.registerTool("alex_global_knowledge_search",new Sn),M.lm.registerTool("alex_save_insight",new kn),M.lm.registerTool("alex_promote_knowledge",new Pn),M.lm.registerTool("alex_global_knowledge_status",new xn))}async function Ma(e){let t=_.workspace.workspaceFolders;if(!t){_.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed.");return}let n=t[0].uri.fsPath,o={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},globalKnowledgePromotion:{evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0},recommendations:[],sessionFile:""};await _.window.withProgress({location:_.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async r=>{r.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Rc(t[0],o),r.report({message:"Phase 2: Checking version consistency...",increment:20}),await Mc(n,o),r.report({message:"Phase 3: Assessing memory architecture...",increment:40}),await Dc(t[0],o),r.report({message:"Phase 4: Auto-promoting knowledge to global...",increment:55}),await Lc(n,o),r.report({message:"Phase 5: Generating recommendations...",increment:75}),Nc(o),r.report({message:"Phase 6: Documenting session...",increment:90}),await Oc(n,o),r.report({message:"Self-actualization complete!",increment:100})});let a=`Self-Actualization Complete ${o.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":o.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":o.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${o.synapseHealth.totalSynapses} (${o.synapseHealth.brokenConnections} broken)
Memory Files: ${o.memoryConsolidation.proceduralFiles+o.memoryConsolidation.episodicFiles+o.memoryConsolidation.domainFiles}
Recommendations: ${o.recommendations.length}`,s=await _.window.showInformationMessage(a,"View Report","Open Session File");if(s==="View Report")_c(o);else if(s==="Open Session File"&&o.sessionFile){let r=await _.workspace.openTextDocument(o.sessionFile);await _.window.showTextDocument(r)}return o}async function Rc(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new _.RelativePattern(e,i),s=await _.workspace.findFiles(a);for(let r of s){t.synapseHealth.totalFiles++;try{let d=(await ke.readFile(r.fsPath,"utf-8")).split(`
`),c=!1;for(let u of d){if(u.trim().startsWith("```")){c=!c;continue}if(c)continue;let m;for(;(m=o.exec(u))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await _.workspace.findFiles(new _.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Mc(e,t){let n=Kt.join(e,".github","copilot-instructions.md");try{if(await ke.pathExists(n)){let r=(await ke.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=_.workspace.workspaceFolders?.[0];if(a)for(let s of i){let r=new _.RelativePattern(a,s),l=await _.workspace.findFiles(r);for(let d of l)try{let c=await ke.readFile(d.fsPath,"utf-8");for(let u of o)if(u.test(c)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Dc(e,t){let n=await _.workspace.findFiles(new _.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await _.workspace.findFiles(new _.RelativePattern(e,".github/prompts/*.md")),i=await _.workspace.findFiles(new _.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await _.workspace.findFiles(new _.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}async function Lc(e,t){try{let n=await Aa(e,{minScore:5});t.globalKnowledgePromotion={evaluated:n.evaluated,promoted:n.promoted.map(o=>o.title),updated:n.updated.map(o=>o.title),skipped:n.skipped.length,alreadyGlobal:n.alreadyGlobal.length}}catch(n){console.error("Auto-promotion failed:",n),t.globalKnowledgePromotion={evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0}}}function Nc(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections"),e.globalKnowledgePromotion.promoted.length>0&&e.recommendations.push(`\u{1F310} Auto-promoted ${e.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`),e.globalKnowledgePromotion.updated.length>0&&e.recommendations.push(`\u{1F504} Updated ${e.globalKnowledgePromotion.updated.length} global knowledge file(s) with local changes!`),e.globalKnowledgePromotion.skipped>0&&e.globalKnowledgePromotion.promoted.length===0&&e.globalKnowledgePromotion.updated.length===0&&e.recommendations.push(`\u{1F4D6} ${e.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`)}async function Oc(e,t){let n=Kt.join(e,".github","episodic");await ke.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Kt.join(n,a),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",l=`# Self-Actualization Session - ${i}

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
| Health Status | ${r} ${t.synapseHealth.healthStatus} |

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

## \u{1F310} Global Knowledge Promotion (Unconscious Mind)

| Metric | Value |
|--------|-------|
| DK Files Evaluated | ${t.globalKnowledgePromotion.evaluated} |
| Auto-Promoted | ${t.globalKnowledgePromotion.promoted.length} |
| Updated | ${t.globalKnowledgePromotion.updated.length} |
| Skipped (needs improvement) | ${t.globalKnowledgePromotion.skipped} |
| Already Global (unchanged) | ${t.globalKnowledgePromotion.alreadyGlobal} |

${t.globalKnowledgePromotion.promoted.length>0?`### Newly Promoted Knowledge
${t.globalKnowledgePromotion.promoted.map(d=>`- \u{1F4D0} **${d}**`).join(`
`)}
`:""}${t.globalKnowledgePromotion.updated.length>0?`### Updated Global Knowledge
${t.globalKnowledgePromotion.updated.map(d=>`- \u{1F504} **${d}**`).join(`
`)}
`:""}${t.globalKnowledgePromotion.promoted.length===0&&t.globalKnowledgePromotion.updated.length===0?"*No new knowledge promoted or updated this session.*":""}

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
`;await ke.writeFile(s,l,"utf-8"),t.sessionFile=s}function _c(e){let t=_.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",_.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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

    <h2>\u{1F310} Global Knowledge Promotion</h2>
    <div class="metric">
        <div class="metric-value">${e.globalKnowledgePromotion.evaluated}</div>
        <div class="metric-label">Evaluated</div>
    </div>
    <div class="metric">
        <div class="metric-value" style="color: #22c55e">${e.globalKnowledgePromotion.promoted.length}</div>
        <div class="metric-label">Promoted</div>
    </div>
    <div class="metric">
        <div class="metric-value" style="color: #3b82f6">${e.globalKnowledgePromotion.updated.length}</div>
        <div class="metric-label">Updated</div>
    </div>
    <div class="metric">
        <div class="metric-value">${e.globalKnowledgePromotion.alreadyGlobal}</div>
        <div class="metric-label">Unchanged</div>
    </div>
    ${e.globalKnowledgePromotion.promoted.length>0?`
    <p><strong>Newly Promoted:</strong></p>
    <ul>${e.globalKnowledgePromotion.promoted.map(o=>`<li>\u{1F4D0} ${o}</li>`).join("")}</ul>
    `:""}
    ${e.globalKnowledgePromotion.updated.length>0?`
    <p><strong>Updated from Local Changes:</strong></p>
    <ul>${e.globalKnowledgePromotion.updated.map(o=>`<li>\u{1F504} ${o}</li>`).join("")}</ul>
    `:""}

    <h2>Recommendations</h2>
    ${e.recommendations.length>0?e.recommendations.map(o=>`<div class="recommendation">${o}</div>`).join(""):"<p>\u2705 No recommendations - architecture is optimal!</p>"}
</body>
</html>`}var G=L(require("vscode")),Na=L(require("path"));var g=L(require("vscode")),K=L(Ce()),ge=L(require("path"));var Rn=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new g.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,r=0,l=0,d=[],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){let w=new g.RelativePattern(o[0],p),b=await g.workspace.findFiles(w);for(let v of b){s++;try{let C=(await K.readFile(v.fsPath,"utf-8")).split(`
`),E=!1;for(let R=0;R<C.length;R++){let N=C[R];if(N.trim().startsWith("```")){E=!E;continue}if(E)continue;let q;for(;(q=c.exec(N))!==null;){r++;let Y=q[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${Y}`))).length===0&&(l++,t.input.detailed&&d.push(`- ${ge.basename(v.fsPath)}:${R+1} \u2192 ${Y} (not found)`))}}}catch{}}}let u=l===0?"EXCELLENT":l<5?"GOOD":l<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${r} |
| Broken Connections | ${l} |
| Health Status | ${u} |
`;return t.input.detailed&&d.length>0&&(m+=`
### Issues Found
${d.join(`
`)}`),l>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Mn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new g.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let r=[];for(let c of s){let u=new g.RelativePattern(o[0],c),m=await g.workspace.findFiles(u);for(let p of m)try{let b=(await K.readFile(p.fsPath,"utf-8")).split(`
`),v=[];for(let y=0;y<b.length;y++)if(b[y].toLowerCase().includes(i)){let C=Math.max(0,y-1),E=Math.min(b.length-1,y+1),R=b.slice(C,E+1).join(`
`);v.push(`Line ${y+1}:
${R}`)}v.length>0&&r.push({file:ge.basename(p.fsPath),matches:v.slice(0,3)})}catch{}}let l=[];if(r.length===0)try{l=await wt(t.input.query,{limit:5})}catch{}if(r.length===0&&l.length===0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`No matches found for "${t.input.query}" in local ${a} memory or global knowledge base.`)]);let d="";if(r.length>0){d+=`## Local Memory Results for "${t.input.query}"

`,d+=`Found ${r.length} file(s) with matches:

`;for(let c of r.slice(0,5)){d+=`### ${c.file}
`;for(let u of c.matches)d+=`\`\`\`
${u}
\`\`\`
`;d+=`
`}}if(l.length>0){r.length===0?(d+=`## \u{1F310} Global Knowledge Results (Unconscious Retrieval)

`,d+=`*Local search found nothing. Automatically searched cross-project knowledge:*

`):d+=`## \u{1F310} Related Global Knowledge

`;for(let{entry:c}of l.slice(0,3)){let u=c.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";d+=`### ${u} ${c.title}
`,d+=`- **Type**: ${c.type} | **Category**: ${c.category}
`,d+=`- **Tags**: ${c.tags.join(", ")}
`,d+=`- **Summary**: ${c.summary}

`}}return new g.LanguageModelToolResult([new g.LanguageModelTextPart(d)])}},Dn=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ge.join(i,".github","copilot-instructions.md");if(!await K.pathExists(a))return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md")),u="Unknown";try{let w=(await K.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);w&&(u=w[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${u} |
| Procedural Memory | ${r.length} files |
| Episodic Memory | ${l.length+d.length} files |
| Domain Knowledge | ${c.length} files |

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
`;return new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Ln=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`),new g.LanguageModelToolResult([new g.LanguageModelTextPart(a.join(`
`))])}},Nn=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ge.join(i,"config","USER-PROFILE.md"),s=ge.join(i,"config","user-profile.json"),{action:r,field:l,value:d}=t.input;try{switch(r){case"exists":let c=await K.pathExists(s);return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:c,path:s}))]);case"get":if(!await K.pathExists(s))return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let u=await K.readJson(s);return l?new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({[l]:u[l]}))]):new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify(u))]);case"update":if(!l||d===void 0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await K.ensureDir(ge.join(i,"config"));let m={};if(await K.pathExists(s)&&(m=await K.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(l)){let p=m[l]||[];Array.isArray(p)?p.includes(d)||(m[l]=[...p,d]):m[l]=[d]}else m[l]=d;return m.lastUpdated=new Date().toISOString(),await K.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({success:!0,field:l,value:d,message:`Updated ${l} to: ${d}`}))]);default:return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(c){return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Error accessing user profile: ${c.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await K.writeFile(t,o,"utf-8")}},On=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new g.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let v=ge.join(i,".github","copilot-instructions.md");if(await K.pathExists(v)){let C=(await K.readFile(v,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);C&&(a=C[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let v of r){let y=new g.RelativePattern(o[0],v),C=await g.workspace.findFiles(y);for(let E of C){s.synapseHealth.totalFiles++;try{let N=(await K.readFile(E.fsPath,"utf-8")).split(`
`),q=!1;for(let Y of N){if(Y.trim().startsWith("```")){q=!q;continue}if(q)continue;let Z;for(;(Z=l.exec(Y))!==null;){s.synapseHealth.totalSynapses++;let S=Z[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${S}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),m=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=d.length,s.memoryArchitecture.episodicFiles=c.length+u.length,s.memoryArchitecture.domainFiles=m.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let v=ge.join(i,".github","episodic");await K.ensureDir(v);let C=new Date().toISOString().split("T")[0],E=`self-actualization-${C}.prompt.md`;p=ge.join(v,E);let R=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",N=`# Self-Actualization Session - ${C}

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
| Health Status | ${R} ${s.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${s.memoryArchitecture.proceduralFiles} |
| Episodic | ${s.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${s.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${s.recommendations.length>0?s.recommendations.map(q=>`- ${q}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await K.writeFile(p,N,"utf-8")}let b=`## Self-Actualization Report

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

${s.recommendations.length>0?s.recommendations.map(v=>`- ${v}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return p&&(b+=`
### Session Recorded

Meditation session documented at: \`${ge.basename(p)}\``),new g.LanguageModelToolResult([new g.LanguageModelTextPart(b)])}};async function Ut(){let e=g.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ge.join(t,"config","user-profile.json");try{if(await K.pathExists(n))return await K.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function Da(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function La(e){e.subscriptions.push(g.lm.registerTool("alex_synapse_health",new Rn)),e.subscriptions.push(g.lm.registerTool("alex_memory_search",new Mn)),e.subscriptions.push(g.lm.registerTool("alex_architecture_status",new Dn)),e.subscriptions.push(g.lm.registerTool("alex_mcp_recommendations",new Ln)),e.subscriptions.push(g.lm.registerTool("alex_user_profile",new Nn)),e.subscriptions.push(g.lm.registerTool("alex_self_actualization",new On)),console.log("Alex Language Model Tools registered")}var _n=L(require("vscode")),yt=L(Ce()),jn=L(require("path"));function Gn(){let e=_n.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function Kn(e,t=!1){let n=jn.join(e,".github","copilot-instructions.md");if(!await yt.pathExists(n))return null;try{let o=await yt.readFile(n,"utf8"),i=t?wa:ha,a=o.match(i);return a?a[1]:null}catch{return null}}var jc=[/(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)/i,/(?:this works because|the reason is|what fixed it|solved by|resolved by)/i,/(?:always remember to|never forget to|make sure to|be careful to)/i,/(?:debugging tip|performance tip|security tip)/i],Gc=["pattern","anti-pattern","best practice","gotcha","pitfall","workaround","solution","fix","resolved","debugging","performance","optimization","security","architecture"];function Kc(e){let t=e.toLowerCase(),n=0;for(let a of jc)a.test(e)&&n++;let o=[];for(let a of Gc)t.includes(a)&&o.push(a);let i=n*.3+o.length*.1;return{detected:i>=.3||n>=1,confidence:Math.min(i,1),keywords:o}}async function Uc(e,t,n){try{let o=e.split(/[.!?]/)[0].trim(),i=o.length>10&&o.length<100?o:`Auto-captured insight - ${new Date().toISOString().split("T")[0]}`,a="general";t.includes("debugging")?a="debugging":t.includes("performance")||t.includes("optimization")?a="performance":t.includes("security")?a="security":t.includes("architecture")?a="architecture":(t.includes("pattern")||t.includes("anti-pattern"))&&(a="patterns"),await Fn(i,e,a,t,n,"Auto-detected from conversation",e),tt(),console.log(`[Unconscious] Auto-saved insight: ${i}`)}catch(o){console.warn("[Unconscious] Failed to auto-save insight:",o)}}var vt=[],zc=5;function qc(e,t){vt.push(e),vt.length>zc&&vt.shift();let n=vt.join(" "),o=Kc(n);o.detected&&o.confidence>=.5&&(Uc(e,o.keywords,t),vt=[])}var Hc=async(e,t,n,o)=>e.command==="meditate"?await Wc(e,t,n,o):e.command==="dream"?await Vc(e,t,n,o):e.command==="learn"?await Bc(e,t,n,o):e.command==="status"?await Jc(e,t,n,o):e.command==="azure"?await Yc(e,t,n,o):e.command==="m365"?await Xc(e,t,n,o):e.command==="profile"?await Qc(e,t,n,o):e.command==="selfactualize"?await ol(e,t,n,o):e.command==="knowledge"?await il(e,t,n,o):e.command==="saveinsight"?await al(e,t,n,o):e.command==="promote"?await sl(e,t,n,o):e.command==="knowledgestatus"?await rl(e,t,n,o):e.command==="sync"?await cl(e,t,n,o):e.command==="push"?await ll(e,t,n,o):e.command==="pull"?await dl(e,t,n,o):e.command==="docs"?await ul(e,t,n,o):el(e.prompt)&&tl(t)?await nl(e,t,n,o):await Zc(e,t,n,o);async function Wc(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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

### \u{1F30D} Global Knowledge Contribution
Consider contributing reusable insights to your global knowledge base:
- **Patterns** that could help in other projects
- **Insights** from debugging or problem-solving
- **Best practices** you've discovered

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
### What would you like me to consolidate?
`),e.prompt&&(n.markdown(`
**Focus area**: ${e.prompt}
`),n.markdown(`
I'll analyze this topic and identify:
- Key insights to preserve
- Connections to existing knowledge
- Potential memory file updates
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function Vc(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function Bc(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function Jc(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=Gn(),a=i.isValid&&i.rootPath?await Kn(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function Yc(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function Xc(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function Qc(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Ut();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function Zc(e,t,n,o){let i=G.workspace.workspaceFolders,a=i?Na.basename(i[0].uri.fsPath):void 0;qc(e.prompt,a);let s=await Ut(),r=t.history.filter(c=>c instanceof G.ChatRequestTurn||c instanceof G.ChatResponseTurn),l="";if(s){let c=s.nickname||s.name;l=`
## User Profile (Use this to personalize responses)
${c?`- **User's name**: ${c} (always address them by name)`:"- User has not shared their name yet"}
${s.role?`- **Role**: ${s.role}`:""}
${s.experienceLevel?`- **Experience**: ${s.experienceLevel}`:""}
${s.formality?`- **Communication style**: ${s.formality}`:"- Communication style: balanced"}
${s.detailLevel?`- **Detail preference**: ${s.detailLevel}`:""}
${s.explanationStyle?`- **Explanation style**: ${s.explanationStyle}`:""}
${s.humor?`- **Humor**: ${s.humor}`:""}
${s.proactiveSuggestions?`- **Proactive suggestions**: ${s.proactiveSuggestions}`:""}
${s.primaryTechnologies?.length?`- **Technologies**: ${s.primaryTechnologies.join(", ")}`:""}
${s.learningGoals?.length?`- **Learning goals**: ${s.learningGoals.join(", ")}`:""}
${s.expertiseAreas?.length?`- **Expertise areas**: ${s.expertiseAreas.join(", ")}`:""}
`}else l=`
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;let d=`You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${l}

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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let c=await G.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(c.length===0){let w=Da(s);return n.markdown(`${w}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let u=c[0],m=[G.LanguageModelChatMessage.User(d),G.LanguageModelChatMessage.User(e.prompt)],p=await u.sendRequest(m,{},o);for await(let w of p.text)n.markdown(w)}catch(c){if(c instanceof G.LanguageModelError)console.error("Language model error:",c.message,c.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw c}return{metadata:{command:"general"}}}function el(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function tl(e){return e.history.length===0||e.history.length<=2}async function nl(e,t,n,o){let i=await Ut(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let l=await gt();l.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):l.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=Gn(),r=s.isValid&&s.rootPath?await Kn(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function ol(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function il(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

Use this command to search across knowledge learned from ALL your projects.

### Usage
\`@alex /knowledge <search query>\`

### Examples
- \`@alex /knowledge error handling patterns\`
- \`@alex /knowledge react state management\`
- \`@alex /knowledge azure deployment\`

### What's in Global Knowledge?
- **Patterns (GK-*)**: Reusable solutions and best practices
- **Insights (GI-*)**: Specific learnings with timestamps

`),{metadata:{command:"knowledge"}};n.progress(`\u{1F50D} Searching global knowledge for: ${e.prompt}`);try{let i=await wt(e.prompt,{limit:5});if(i.length===0)n.markdown(`## \u{1F310} No Global Knowledge Found

No results found for "**${e.prompt}**".

### Build Your Knowledge Base
- \`@alex /saveinsight\` - Save a new learning
- \`@alex /promote\` - Promote project knowledge to global
- \`@alex /knowledgestatus\` - View what you have

\u{1F4A1} *Tip: Use \`@alex /saveinsight\` after solving a tricky problem to remember it for future projects!*
`);else{n.markdown(`## \u{1F310} Global Knowledge Results

Found **${i.length}** results for "**${e.prompt}**":

`);for(let{entry:a,relevance:s}of i){let r=a.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";n.markdown(`### ${r} ${a.title}
- **Type**: ${a.type} | **Category**: ${a.category}
- **Tags**: ${a.tags.join(", ")}
${a.sourceProject?`- **From**: ${a.sourceProject}`:""}
- **Summary**: ${a.summary}

---
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function al(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

This saves a valuable learning that can help you in other projects.

### How to Use
Tell me about the insight you want to save. I'll help structure it with:
- **Title**: Clear, descriptive name
- **Problem**: What challenge you faced
- **Insight**: What you learned
- **Solution**: How you solved it
- **Tags**: Technologies/concepts involved

### Example
\`@alex /saveinsight I learned that React useEffect cleanup functions run before the next effect, which fixed my memory leak when unmounting components. Tags: react, hooks, useEffect\`

`),e.prompt&&n.markdown(`### Your Input
${e.prompt}

I'll use the **alex_save_insight** tool to save this. The tool will:
1. Parse your insight
2. Extract relevant tags and category
3. Save to global knowledge base
4. Make it searchable across all projects

`),{metadata:{command:"saveinsight"}}}async function sl(e,t,n,o){n.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

Promote a project-local knowledge file (DK-*.md) to make it available across all your projects.

### Usage
\`@alex /promote <path to DK file>\`

### Example
\`@alex /promote .github/domain-knowledge/DK-ERROR-HANDLING.md\`

### What Happens
1. The file is copied to your global knowledge base
2. It gets indexed for cross-project search
3. Original project stays as the source reference
4. Available via \`/knowledge\` in any project

### Current Project's Knowledge Files
`);let i=G.workspace.workspaceFolders;if(i){let a=new G.RelativePattern(i[0],".github/domain-knowledge/DK-*.md"),s=await G.workspace.findFiles(a);if(s.length>0){n.markdown(`Found ${s.length} knowledge files:
`);for(let r of s){let l=G.workspace.asRelativePath(r);n.markdown(`- \`${l}\`
`)}}else n.markdown(`*No DK-*.md files found in this project.*
`)}return{metadata:{command:"promote"}}}async function rl(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await An(),a=await $n();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| \u{1F4D0} Global Patterns | ${i.totalPatterns} |
| \u{1F4A1} Global Insights | ${i.totalInsights} |
| \u{1F4C1} Known Projects | ${a.projects.length} |

`),Object.keys(i.categories).length>0){n.markdown(`### Knowledge by Category
`);for(let[s,r]of Object.entries(i.categories))n.markdown(`- **${s}**: ${r}
`)}if(i.topTags.length>0){n.markdown(`
### Top Tags
`);for(let{tag:s,count:r}of i.topTags)n.markdown(`- ${s}: ${r} entries
`)}if(i.recentEntries.length>0){n.markdown(`
### Recent Entries
`);for(let s of i.recentEntries){let r=s.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";n.markdown(`- ${r} **${s.title}** (${s.category})
`)}}if(a.projects.length>0){n.markdown(`
### Known Projects
`);for(let s of a.projects.slice(0,5))n.markdown(`- **${s.name}** - ${s.knowledgeFiles} knowledge files
`);a.projects.length>5&&n.markdown(`- *...and ${a.projects.length-5} more*
`)}n.markdown(`
### \u{1F4CD} Global Knowledge Location
\`${Tn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function cl(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await Ze(),a=await et();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),a&&n.markdown(`**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function ll(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await ft(),a=await et();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),a&&n.markdown(`
**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function dl(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await ht();i.success?n.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${i.message}
`):n.markdown(`## \u274C Pull Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pulling: ${i}`)}return{metadata:{command:"pull"}}}async function ul(e,t,n,o){return n.markdown(`## \u{1F4DA} Alex Documentation

Opening the documentation index...

### Available Documents

| Document | Description |
|----------|-------------|
| **Cognitive Architecture** | Complete system overview with diagrams |
| **Copilot Integration** | How Alex uses native Copilot features |
| **Conscious Mind** | User-facing tools and interactions |
| **Unconscious Mind** | Automatic background processes |
| **Memory Systems** | How Alex stores and retrieves knowledge |
| **Project Structure** | .github folder files and functions |
| **Global Knowledge** | Cross-project learning system |
| **Cloud Sync** | GitHub Gist backup and sharing |
| **Quick Reference** | Commands, tools, and shortcuts |

`),await G.commands.executeCommand("alex.openDocs"),n.markdown(`
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`),{metadata:{command:"docs"}}}var ml={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Oa(e){let t=G.chat.createChatParticipant("alex.cognitive",Hc);return t.iconPath=G.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=ml,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===G.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var Un=!1;async function bt(e,t){if(Un){F.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}Un=!0;try{return await t()}finally{Un=!1}}function pl(e){console.log("Alex Cognitive Architecture is now active!"),gl(e),Oa(e),La(e),Ra(e),xa(e),Ca(e),se().then(()=>{Ea().catch(c=>{console.warn("Failed to register current project:",c)})}).catch(c=>{console.warn("Failed to initialize global knowledge directories:",c)});let t=F.commands.registerCommand("alex.initialize",async()=>{await bt("Initialize",()=>Ki(e))}),n=F.commands.registerCommand("alex.reset",async()=>{await bt("Reset",()=>an(e))}),o=F.commands.registerCommand("alex.dream",async()=>{await bt("Dream Protocol",()=>qi(e))}),i=F.commands.registerCommand("alex.upgrade",async()=>{await bt("Upgrade",()=>Vi(e))}),a=F.commands.registerCommand("alex.selfActualize",async()=>{await bt("Self-Actualization",()=>Ma(e))}),s=F.commands.registerCommand("alex.syncKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let c=await Ze();if(c.success){let u=await et(),m=u?"View Gist":void 0;await F.window.showInformationMessage(`\u2705 ${c.message}`,...m?[m]:[])==="View Gist"&&u&&F.env.openExternal(F.Uri.parse(u))}else F.window.showErrorMessage(`\u274C ${c.message}`)})}),r=F.commands.registerCommand("alex.pushKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let c=await ft();c.success?F.window.showInformationMessage(`\u2705 ${c.message}`):F.window.showErrorMessage(`\u274C ${c.message}`)})}),l=F.commands.registerCommand("alex.pullKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let c=await ht();c.success?F.window.showInformationMessage(`\u2705 ${c.message}`):F.window.showErrorMessage(`\u274C ${c.message}`)})}),d=F.commands.registerCommand("alex.openDocs",async()=>{let c=F.Uri.joinPath(e.extensionUri,"alex_docs","README.md");try{await F.commands.executeCommand("markdown.showPreview",c)}catch{let u=await F.workspace.openTextDocument(c);await F.window.showTextDocument(u)}});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a),e.subscriptions.push(s),e.subscriptions.push(r),e.subscriptions.push(l),e.subscriptions.push(d)}async function gl(e){let t="alex.lastKnownVersion",n=F.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[a]=i.split(".").map(Number),[s]=o.split(".").map(Number),r=s>a,l="Run Upgrade",d="View Changelog",c="Dismiss",u=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await F.window.showInformationMessage(u,l,d,c);if(m===l)F.commands.executeCommand("alex.upgrade");else if(m===d){let p=F.Uri.joinPath(n.extensionUri,"CHANGELOG.md");F.commands.executeCommand("markdown.showPreview",p)}}function fl(){}0&&(module.exports={activate,deactivate});
