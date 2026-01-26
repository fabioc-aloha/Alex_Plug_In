"use strict";var Va=Object.create;var xt=Object.defineProperty;var Ba=Object.getOwnPropertyDescriptor;var Ja=Object.getOwnPropertyNames;var Ya=Object.getPrototypeOf,Xa=Object.prototype.hasOwnProperty;var C=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Qa=(e,t)=>{for(var n in t)xt(e,n,{get:t[n],enumerable:!0})},Wn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ja(t))!Xa.call(e,i)&&i!==n&&xt(e,i,{get:()=>t[i],enumerable:!(o=Ba(t,i))||o.enumerable});return e};var N=(e,t,n)=>(n=e!=null?Va(Ya(e)):{},Wn(t||!e||!e.__esModule?xt(n,"default",{value:e,enumerable:!0}):n,e)),Za=e=>Wn(xt({},"__esModule",{value:!0}),e);var Z=C(Bt=>{"use strict";Bt.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};Bt.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Bn=C((Ll,Vn)=>{var Re=require("constants"),es=process.cwd,Ct=null,ts=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return Ct||(Ct=es.call(process)),Ct};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Jt=process.chdir,process.chdir=function(e){Ct=null,Jt.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Jt));var Jt;Vn.exports=ns;function ns(e){Re.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=c(e.statSync),e.fstatSync=c(e.fstatSync),e.lstatSync=c(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(l,u,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(l,u,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),ts==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(l){function u(m,p,w){var b=Date.now(),y=0;l(m,p,function x(v){if(v&&(v.code==="EACCES"||v.code==="EPERM"||v.code==="EBUSY")&&Date.now()-b<6e4){setTimeout(function(){e.stat(p,function($,O){$&&$.code==="ENOENT"?l(m,p,x):w(v)})},y),y<100&&(y+=10);return}w&&w(v)})}return Object.setPrototypeOf&&Object.setPrototypeOf(u,l),u})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(l){function u(m,p,w,b,y,x){var v;if(x&&typeof x=="function"){var $=0;v=function(O,L,K){if(O&&O.code==="EAGAIN"&&$<10)return $++,l.call(e,m,p,w,b,y,v);x.apply(this,arguments)}}return l.call(e,m,p,w,b,y,v)}return Object.setPrototypeOf&&Object.setPrototypeOf(u,l),u})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(l){return function(u,m,p,w,b){for(var y=0;;)try{return l.call(e,u,m,p,w,b)}catch(x){if(x.code==="EAGAIN"&&y<10){y++;continue}throw x}}})(e.readSync);function t(l){l.lchmod=function(u,m,p){l.open(u,Re.O_WRONLY|Re.O_SYMLINK,m,function(w,b){if(w){p&&p(w);return}l.fchmod(b,m,function(y){l.close(b,function(x){p&&p(y||x)})})})},l.lchmodSync=function(u,m){var p=l.openSync(u,Re.O_WRONLY|Re.O_SYMLINK,m),w=!0,b;try{b=l.fchmodSync(p,m),w=!1}finally{if(w)try{l.closeSync(p)}catch{}else l.closeSync(p)}return b}}function n(l){Re.hasOwnProperty("O_SYMLINK")&&l.futimes?(l.lutimes=function(u,m,p,w){l.open(u,Re.O_SYMLINK,function(b,y){if(b){w&&w(b);return}l.futimes(y,m,p,function(x){l.close(y,function(v){w&&w(x||v)})})})},l.lutimesSync=function(u,m,p){var w=l.openSync(u,Re.O_SYMLINK),b,y=!0;try{b=l.futimesSync(w,m,p),y=!1}finally{if(y)try{l.closeSync(w)}catch{}else l.closeSync(w)}return b}):l.futimes&&(l.lutimes=function(u,m,p,w){w&&process.nextTick(w)},l.lutimesSync=function(){})}function o(l){return l&&function(u,m,p){return l.call(e,u,m,function(w){d(w)&&(w=null),p&&p.apply(this,arguments)})}}function i(l){return l&&function(u,m){try{return l.call(e,u,m)}catch(p){if(!d(p))throw p}}}function a(l){return l&&function(u,m,p,w){return l.call(e,u,m,p,function(b){d(b)&&(b=null),w&&w.apply(this,arguments)})}}function s(l){return l&&function(u,m,p){try{return l.call(e,u,m,p)}catch(w){if(!d(w))throw w}}}function r(l){return l&&function(u,m,p){typeof m=="function"&&(p=m,m=null);function w(b,y){y&&(y.uid<0&&(y.uid+=4294967296),y.gid<0&&(y.gid+=4294967296)),p&&p.apply(this,arguments)}return m?l.call(e,u,m,w):l.call(e,u,w)}}function c(l){return l&&function(u,m){var p=m?l.call(e,u,m):l.call(e,u);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function d(l){if(!l||l.code==="ENOSYS")return!0;var u=!process.getuid||process.getuid()!==0;return!!(u&&(l.code==="EINVAL"||l.code==="EPERM"))}}});var Xn=C((Nl,Yn)=>{var Jn=require("stream").Stream;Yn.exports=os;function os(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Jn.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),r=0,c=s.length;r<c;r++){var d=s[r];this[d]=i[d]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(l,u){if(l){a.emit("error",l),a.readable=!1;return}a.fd=u,a.emit("open",u),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Jn.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,r=a.length;s<r;s++){var c=a[s];this[c]=i[c]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var Zn=C((Ol,Qn)=>{"use strict";Qn.exports=as;var is=Object.getPrototypeOf||function(e){return e.__proto__};function as(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:is(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var Me=C((jl,Qt)=>{var V=require("fs"),ss=Bn(),rs=Xn(),cs=Zn(),Tt=require("util"),ae,Et;typeof Symbol=="function"&&typeof Symbol.for=="function"?(ae=Symbol.for("graceful-fs.queue"),Et=Symbol.for("graceful-fs.previous")):(ae="___graceful-fs.queue",Et="___graceful-fs.previous");function ls(){}function no(e,t){Object.defineProperty(e,ae,{get:function(){return t}})}var je=ls;Tt.debuglog?je=Tt.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(je=function(){var e=Tt.format.apply(Tt,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});V[ae]||(eo=global[ae]||[],no(V,eo),V.close=(function(e){function t(n,o){return e.call(V,n,function(i){i||to(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Et,{value:e}),t})(V.close),V.closeSync=(function(e){function t(n){e.apply(V,arguments),to()}return Object.defineProperty(t,Et,{value:e}),t})(V.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){je(V[ae]),require("assert").equal(V[ae].length,0)}));var eo;global[ae]||no(global,V[ae]);Qt.exports=Yt(cs(V));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!V.__patched&&(Qt.exports=Yt(V),V.__patched=!0);function Yt(e){ss(e),e.gracefulify=Yt,e.createReadStream=L,e.createWriteStream=K;var t=e.readFile;e.readFile=n;function n(k,I,R){return typeof I=="function"&&(R=I,I=null),_(k,I,R);function _(W,J,U,P){return t(W,J,function(h){h&&(h.code==="EMFILE"||h.code==="ENFILE")?We([_,[W,J,U],h,P||Date.now(),Date.now()]):typeof U=="function"&&U.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(k,I,R,_){return typeof R=="function"&&(_=R,R=null),W(k,I,R,_);function W(J,U,P,h,T){return o(J,U,P,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?We([W,[J,U,P,h],E,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(k,I,R,_){return typeof R=="function"&&(_=R,R=null),W(k,I,R,_);function W(J,U,P,h,T){return a(J,U,P,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?We([W,[J,U,P,h],E,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=c);function c(k,I,R,_){return typeof R=="function"&&(_=R,R=0),W(k,I,R,_);function W(J,U,P,h,T){return r(J,U,P,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?We([W,[J,U,P,h],E,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var d=e.readdir;e.readdir=u;var l=/^v[0-5]\./;function u(k,I,R){typeof I=="function"&&(R=I,I=null);var _=l.test(process.version)?function(U,P,h,T){return d(U,W(U,P,h,T))}:function(U,P,h,T){return d(U,P,W(U,P,h,T))};return _(k,I,R);function W(J,U,P,h){return function(T,E){T&&(T.code==="EMFILE"||T.code==="ENFILE")?We([_,[J,U,P],T,h||Date.now(),Date.now()]):(E&&E.sort&&E.sort(),typeof P=="function"&&P.call(this,T,E))}}}if(process.version.substr(0,4)==="v0.8"){var m=rs(e);x=m.ReadStream,$=m.WriteStream}var p=e.ReadStream;p&&(x.prototype=Object.create(p.prototype),x.prototype.open=v);var w=e.WriteStream;w&&($.prototype=Object.create(w.prototype),$.prototype.open=O),Object.defineProperty(e,"ReadStream",{get:function(){return x},set:function(k){x=k},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return $},set:function(k){$=k},enumerable:!0,configurable:!0});var b=x;Object.defineProperty(e,"FileReadStream",{get:function(){return b},set:function(k){b=k},enumerable:!0,configurable:!0});var y=$;Object.defineProperty(e,"FileWriteStream",{get:function(){return y},set:function(k){y=k},enumerable:!0,configurable:!0});function x(k,I){return this instanceof x?(p.apply(this,arguments),this):x.apply(Object.create(x.prototype),arguments)}function v(){var k=this;X(k.path,k.flags,k.mode,function(I,R){I?(k.autoClose&&k.destroy(),k.emit("error",I)):(k.fd=R,k.emit("open",R),k.read())})}function $(k,I){return this instanceof $?(w.apply(this,arguments),this):$.apply(Object.create($.prototype),arguments)}function O(){var k=this;X(k.path,k.flags,k.mode,function(I,R){I?(k.destroy(),k.emit("error",I)):(k.fd=R,k.emit("open",R))})}function L(k,I){return new e.ReadStream(k,I)}function K(k,I){return new e.WriteStream(k,I)}var ie=e.open;e.open=X;function X(k,I,R,_){return typeof R=="function"&&(_=R,R=null),W(k,I,R,_);function W(J,U,P,h,T){return ie(J,U,P,function(E,ve){E&&(E.code==="EMFILE"||E.code==="ENFILE")?We([W,[J,U,P,h],E,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}return e}function We(e){je("ENQUEUE",e[0].name,e[1]),V[ae].push(e),Xt()}var It;function to(){for(var e=Date.now(),t=0;t<V[ae].length;++t)V[ae][t].length>2&&(V[ae][t][3]=e,V[ae][t][4]=e);Xt()}function Xt(){if(clearTimeout(It),It=void 0,V[ae].length!==0){var e=V[ae].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)je("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){je("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var r=Date.now()-a,c=Math.max(a-i,1),d=Math.min(c*1.2,100);r>=d?(je("RETRY",t.name,n),t.apply(null,n.concat([i]))):V[ae].push(e)}It===void 0&&(It=setTimeout(Xt,0))}}});var le=C(xe=>{"use strict";var oo=Z().fromCallback,ce=Me(),ds=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof ce[e]=="function");Object.assign(xe,ce);ds.forEach(e=>{xe[e]=oo(ce[e])});xe.exists=function(e,t){return typeof t=="function"?ce.exists(e,t):new Promise(n=>ce.exists(e,n))};xe.read=function(e,t,n,o,i,a){return typeof a=="function"?ce.read(e,t,n,o,i,a):new Promise((s,r)=>{ce.read(e,t,n,o,i,(c,d,l)=>{if(c)return r(c);s({bytesRead:d,buffer:l})})})};xe.write=function(e,t,...n){return typeof n[n.length-1]=="function"?ce.write(e,t,...n):new Promise((o,i)=>{ce.write(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffer:r})})})};xe.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?ce.readv(e,t,...n):new Promise((o,i)=>{ce.readv(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesRead:s,buffers:r})})})};xe.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?ce.writev(e,t,...n):new Promise((o,i)=>{ce.writev(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffers:r})})})};typeof ce.realpath.native=="function"?xe.realpath.native=oo(ce.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var ao=C((Gl,io)=>{"use strict";var us=require("path");io.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(us.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var lo=C((Kl,Zt)=>{"use strict";var so=le(),{checkPath:ro}=ao(),co=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};Zt.exports.makeDir=async(e,t)=>(ro(e),so.mkdir(e,{mode:co(t),recursive:!0}));Zt.exports.makeDirSync=(e,t)=>(ro(e),so.mkdirSync(e,{mode:co(t),recursive:!0}))});var we=C((Ul,uo)=>{"use strict";var ms=Z().fromPromise,{makeDir:ps,makeDirSync:en}=lo(),tn=ms(ps);uo.exports={mkdirs:tn,mkdirsSync:en,mkdirp:tn,mkdirpSync:en,ensureDir:tn,ensureDirSync:en}});var De=C((zl,po)=>{"use strict";var gs=Z().fromPromise,mo=le();function fs(e){return mo.access(e).then(()=>!0).catch(()=>!1)}po.exports={pathExists:gs(fs),pathExistsSync:mo.existsSync}});var nn=C((ql,go)=>{"use strict";var Ve=le(),hs=Z().fromPromise;async function ws(e,t,n){let o=await Ve.open(e,"r+"),i=null;try{await Ve.futimes(o,t,n)}finally{try{await Ve.close(o)}catch(a){i=a}}if(i)throw i}function ys(e,t,n){let o=Ve.openSync(e,"r+");return Ve.futimesSync(o,t,n),Ve.closeSync(o)}go.exports={utimesMillis:hs(ws),utimesMillisSync:ys}});var _e=C((Hl,yo)=>{"use strict";var Be=le(),ee=require("path"),fo=Z().fromPromise;function vs(e,t,n){let o=n.dereference?i=>Be.stat(i,{bigint:!0}):i=>Be.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function bs(e,t,n){let o,i=n.dereference?s=>Be.statSync(s,{bigint:!0}):s=>Be.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function Ss(e,t,n,o){let{srcStat:i,destStat:a}=await vs(e,t,o);if(a){if(st(i,a)){let s=ee.basename(e),r=ee.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&on(e,t))throw new Error($t(e,t,n));return{srcStat:i,destStat:a}}function ks(e,t,n,o){let{srcStat:i,destStat:a}=bs(e,t,o);if(a){if(st(i,a)){let s=ee.basename(e),r=ee.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&on(e,t))throw new Error($t(e,t,n));return{srcStat:i,destStat:a}}async function ho(e,t,n,o){let i=ee.resolve(ee.dirname(e)),a=ee.resolve(ee.dirname(n));if(a===i||a===ee.parse(a).root)return;let s;try{s=await Be.stat(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(st(t,s))throw new Error($t(e,n,o));return ho(e,t,a,o)}function wo(e,t,n,o){let i=ee.resolve(ee.dirname(e)),a=ee.resolve(ee.dirname(n));if(a===i||a===ee.parse(a).root)return;let s;try{s=Be.statSync(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(st(t,s))throw new Error($t(e,n,o));return wo(e,t,a,o)}function st(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function on(e,t){let n=ee.resolve(e).split(ee.sep).filter(i=>i),o=ee.resolve(t).split(ee.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function $t(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}yo.exports={checkPaths:fo(Ss),checkPathsSync:ks,checkParentPaths:fo(ho),checkParentPathsSync:wo,isSrcSubdir:on,areIdentical:st}});var bo=C((Wl,vo)=>{"use strict";async function Ps(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}vo.exports={asyncIteratorConcurrentProcess:Ps}});var Co=C((Vl,xo)=>{"use strict";var se=le(),rt=require("path"),{mkdirs:xs}=we(),{pathExists:Cs}=De(),{utimesMillis:Ts}=nn(),ct=_e(),{asyncIteratorConcurrentProcess:Is}=bo();async function Es(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await ct.checkPaths(e,t,"copy",n);if(await ct.checkParentPaths(e,o,t,"copy"),!await ko(e,t,n))return;let s=rt.dirname(t);await Cs(s)||await xs(s),await Po(i,e,t,n)}async function ko(e,t,n){return n.filter?n.filter(e,t):!0}async function Po(e,t,n,o){let a=await(o.dereference?se.stat:se.lstat)(t);if(a.isDirectory())return Rs(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return $s(a,e,t,n,o);if(a.isSymbolicLink())return Ms(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function $s(e,t,n,o,i){if(!t)return So(e,n,o,i);if(i.overwrite)return await se.unlink(o),So(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function So(e,t,n,o){if(await se.copyFile(t,n),o.preserveTimestamps){As(e.mode)&&await Fs(n,e.mode);let i=await se.stat(t);await Ts(n,i.atime,i.mtime)}return se.chmod(n,e.mode)}function As(e){return(e&128)===0}function Fs(e,t){return se.chmod(e,t|128)}async function Rs(e,t,n,o,i){t||await se.mkdir(o),await Is(await se.opendir(n),async a=>{let s=rt.join(n,a.name),r=rt.join(o,a.name);if(await ko(s,r,i)){let{destStat:d}=await ct.checkPaths(s,r,"copy",i);await Po(d,s,r,i)}}),t||await se.chmod(o,e.mode)}async function Ms(e,t,n,o){let i=await se.readlink(t);if(o.dereference&&(i=rt.resolve(process.cwd(),i)),!e)return se.symlink(i,n);let a=null;try{a=await se.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return se.symlink(i,n);throw s}if(o.dereference&&(a=rt.resolve(process.cwd(),a)),i!==a){if(ct.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(ct.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await se.unlink(n),se.symlink(i,n)}xo.exports=Es});var Ao=C((Bl,$o)=>{"use strict";var de=Me(),lt=require("path"),Ds=we().mkdirsSync,Ls=nn().utimesMillisSync,dt=_e();function Ns(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=dt.checkPathsSync(e,t,"copy",n);if(dt.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=lt.dirname(t);return de.existsSync(a)||Ds(a),To(i,e,t,n)}function To(e,t,n,o){let a=(o.dereference?de.statSync:de.lstatSync)(t);if(a.isDirectory())return zs(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Os(a,e,t,n,o);if(a.isSymbolicLink())return Ws(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Os(e,t,n,o,i){return t?js(e,n,o,i):Io(e,n,o,i)}function js(e,t,n,o){if(o.overwrite)return de.unlinkSync(n),Io(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Io(e,t,n,o){return de.copyFileSync(t,n),o.preserveTimestamps&&_s(e.mode,t,n),an(n,e.mode)}function _s(e,t,n){return Gs(e)&&Ks(n,e),Us(t,n)}function Gs(e){return(e&128)===0}function Ks(e,t){return an(e,t|128)}function an(e,t){return de.chmodSync(e,t)}function Us(e,t){let n=de.statSync(e);return Ls(t,n.atime,n.mtime)}function zs(e,t,n,o,i){return t?Eo(n,o,i):qs(e.mode,n,o,i)}function qs(e,t,n,o){return de.mkdirSync(n),Eo(t,n,o),an(n,e)}function Eo(e,t,n){let o=de.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Hs(i.name,e,t,n)}finally{o.closeSync()}}function Hs(e,t,n,o){let i=lt.join(t,e),a=lt.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=dt.checkPathsSync(i,a,"copy",o);return To(s,i,a,o)}function Ws(e,t,n,o){let i=de.readlinkSync(t);if(o.dereference&&(i=lt.resolve(process.cwd(),i)),e){let a;try{a=de.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return de.symlinkSync(i,n);throw s}if(o.dereference&&(a=lt.resolve(process.cwd(),a)),i!==a){if(dt.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(dt.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Vs(i,n)}else return de.symlinkSync(i,n)}function Vs(e,t){return de.unlinkSync(t),de.symlinkSync(e,t)}$o.exports=Ns});var At=C((Jl,Fo)=>{"use strict";var Bs=Z().fromPromise;Fo.exports={copy:Bs(Co()),copySync:Ao()}});var ut=C((Yl,Mo)=>{"use strict";var Ro=Me(),Js=Z().fromCallback;function Ys(e,t){Ro.rm(e,{recursive:!0,force:!0},t)}function Xs(e){Ro.rmSync(e,{recursive:!0,force:!0})}Mo.exports={remove:Js(Ys),removeSync:Xs}});var Ko=C((Xl,Go)=>{"use strict";var Qs=Z().fromPromise,No=le(),Oo=require("path"),jo=we(),_o=ut(),Do=Qs(async function(t){let n;try{n=await No.readdir(t)}catch{return jo.mkdirs(t)}return Promise.all(n.map(o=>_o.remove(Oo.join(t,o))))});function Lo(e){let t;try{t=No.readdirSync(e)}catch{return jo.mkdirsSync(e)}t.forEach(n=>{n=Oo.join(e,n),_o.removeSync(n)})}Go.exports={emptyDirSync:Lo,emptydirSync:Lo,emptyDir:Do,emptydir:Do}});var Ho=C((Ql,qo)=>{"use strict";var Zs=Z().fromPromise,Uo=require("path"),Ce=le(),zo=we();async function er(e){let t;try{t=await Ce.stat(e)}catch{}if(t&&t.isFile())return;let n=Uo.dirname(e),o=null;try{o=await Ce.stat(n)}catch(i){if(i.code==="ENOENT"){await zo.mkdirs(n),await Ce.writeFile(e,"");return}else throw i}o.isDirectory()?await Ce.writeFile(e,""):await Ce.readdir(n)}function tr(e){let t;try{t=Ce.statSync(e)}catch{}if(t&&t.isFile())return;let n=Uo.dirname(e);try{Ce.statSync(n).isDirectory()||Ce.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")zo.mkdirsSync(n);else throw o}Ce.writeFileSync(e,"")}qo.exports={createFile:Zs(er),createFileSync:tr}});var Yo=C((Zl,Jo)=>{"use strict";var nr=Z().fromPromise,Wo=require("path"),Le=le(),Vo=we(),{pathExists:or}=De(),{areIdentical:Bo}=_e();async function ir(e,t){let n;try{n=await Le.lstat(t)}catch{}let o;try{o=await Le.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Bo(o,n))return;let i=Wo.dirname(t);await or(i)||await Vo.mkdirs(i),await Le.link(e,t)}function ar(e,t){let n;try{n=Le.lstatSync(t)}catch{}try{let a=Le.lstatSync(e);if(n&&Bo(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=Wo.dirname(t);return Le.existsSync(o)||Vo.mkdirsSync(o),Le.linkSync(e,t)}Jo.exports={createLink:nr(ir),createLinkSync:ar}});var Qo=C((ed,Xo)=>{"use strict";var Ne=require("path"),mt=le(),{pathExists:sr}=De(),rr=Z().fromPromise;async function cr(e,t){if(Ne.isAbsolute(e)){try{await mt.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=Ne.dirname(t),o=Ne.join(n,e);if(await sr(o))return{toCwd:o,toDst:e};try{await mt.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:Ne.relative(n,e)}}function lr(e,t){if(Ne.isAbsolute(e)){if(!mt.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=Ne.dirname(t),o=Ne.join(n,e);if(mt.existsSync(o))return{toCwd:o,toDst:e};if(!mt.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:Ne.relative(n,e)}}Xo.exports={symlinkPaths:rr(cr),symlinkPathsSync:lr}});var ti=C((td,ei)=>{"use strict";var Zo=le(),dr=Z().fromPromise;async function ur(e,t){if(t)return t;let n;try{n=await Zo.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function mr(e,t){if(t)return t;let n;try{n=Zo.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}ei.exports={symlinkType:dr(ur),symlinkTypeSync:mr}});var ai=C((nd,ii)=>{"use strict";var pr=Z().fromPromise,ni=require("path"),be=le(),{mkdirs:gr,mkdirsSync:fr}=we(),{symlinkPaths:hr,symlinkPathsSync:wr}=Qo(),{symlinkType:yr,symlinkTypeSync:vr}=ti(),{pathExists:br}=De(),{areIdentical:oi}=_e();async function Sr(e,t,n){let o;try{o=await be.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,c]=await Promise.all([be.stat(e),be.stat(t)]);if(oi(r,c))return}let i=await hr(e,t);e=i.toDst;let a=await yr(i.toCwd,n),s=ni.dirname(t);return await br(s)||await gr(s),be.symlink(e,t,a)}function kr(e,t,n){let o;try{o=be.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=be.statSync(e),c=be.statSync(t);if(oi(r,c))return}let i=wr(e,t);e=i.toDst,n=vr(i.toCwd,n);let a=ni.dirname(t);return be.existsSync(a)||fr(a),be.symlinkSync(e,t,n)}ii.exports={createSymlink:pr(Sr),createSymlinkSync:kr}});var pi=C((od,mi)=>{"use strict";var{createFile:si,createFileSync:ri}=Ho(),{createLink:ci,createLinkSync:li}=Yo(),{createSymlink:di,createSymlinkSync:ui}=ai();mi.exports={createFile:si,createFileSync:ri,ensureFile:si,ensureFileSync:ri,createLink:ci,createLinkSync:li,ensureLink:ci,ensureLinkSync:li,createSymlink:di,createSymlinkSync:ui,ensureSymlink:di,ensureSymlinkSync:ui}});var Ft=C((id,gi)=>{function Pr(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function xr(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}gi.exports={stringify:Pr,stripBom:xr}});var yi=C((ad,wi)=>{var Je;try{Je=Me()}catch{Je=require("fs")}var Rt=Z(),{stringify:fi,stripBom:hi}=Ft();async function Cr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Je,o="throws"in t?t.throws:!0,i=await Rt.fromCallback(n.readFile)(e,t);i=hi(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var Tr=Rt.fromPromise(Cr);function Ir(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Je,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=hi(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function Er(e,t,n={}){let o=n.fs||Je,i=fi(t,n);await Rt.fromCallback(o.writeFile)(e,i,n)}var $r=Rt.fromPromise(Er);function Ar(e,t,n={}){let o=n.fs||Je,i=fi(t,n);return o.writeFileSync(e,i,n)}wi.exports={readFile:Tr,readFileSync:Ir,writeFile:$r,writeFileSync:Ar}});var bi=C((sd,vi)=>{"use strict";var Mt=yi();vi.exports={readJson:Mt.readFile,readJsonSync:Mt.readFileSync,writeJson:Mt.writeFile,writeJsonSync:Mt.writeFileSync}});var Dt=C((rd,Pi)=>{"use strict";var Fr=Z().fromPromise,sn=le(),Si=require("path"),ki=we(),Rr=De().pathExists;async function Mr(e,t,n="utf-8"){let o=Si.dirname(e);return await Rr(o)||await ki.mkdirs(o),sn.writeFile(e,t,n)}function Dr(e,...t){let n=Si.dirname(e);sn.existsSync(n)||ki.mkdirsSync(n),sn.writeFileSync(e,...t)}Pi.exports={outputFile:Fr(Mr),outputFileSync:Dr}});var Ci=C((cd,xi)=>{"use strict";var{stringify:Lr}=Ft(),{outputFile:Nr}=Dt();async function Or(e,t,n={}){let o=Lr(t,n);await Nr(e,o,n)}xi.exports=Or});var Ii=C((ld,Ti)=>{"use strict";var{stringify:jr}=Ft(),{outputFileSync:_r}=Dt();function Gr(e,t,n){let o=jr(t,n);_r(e,o,n)}Ti.exports=Gr});var $i=C((dd,Ei)=>{"use strict";var Kr=Z().fromPromise,ue=bi();ue.outputJson=Kr(Ci());ue.outputJsonSync=Ii();ue.outputJSON=ue.outputJson;ue.outputJSONSync=ue.outputJsonSync;ue.writeJSON=ue.writeJson;ue.writeJSONSync=ue.writeJsonSync;ue.readJSON=ue.readJson;ue.readJSONSync=ue.readJsonSync;Ei.exports=ue});var Di=C((ud,Mi)=>{"use strict";var Ur=le(),Ai=require("path"),{copy:zr}=At(),{remove:Ri}=ut(),{mkdirp:qr}=we(),{pathExists:Hr}=De(),Fi=_e();async function Wr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await Fi.checkPaths(e,t,"move",n);await Fi.checkParentPaths(e,i,t,"move");let s=Ai.dirname(t);return Ai.parse(s).root!==s&&await qr(s),Vr(e,t,o,a)}async function Vr(e,t,n,o){if(!o){if(n)await Ri(t);else if(await Hr(t))throw new Error("dest already exists.")}try{await Ur.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Br(e,t,n)}}async function Br(e,t,n){return await zr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Ri(e)}Mi.exports=Wr});var _i=C((md,ji)=>{"use strict";var Ni=Me(),cn=require("path"),Jr=At().copySync,Oi=ut().removeSync,Yr=we().mkdirpSync,Li=_e();function Xr(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=Li.checkPathsSync(e,t,"move",n);return Li.checkParentPathsSync(e,i,t,"move"),Qr(t)||Yr(cn.dirname(t)),Zr(e,t,o,a)}function Qr(e){let t=cn.dirname(e);return cn.parse(t).root===t}function Zr(e,t,n,o){if(o)return rn(e,t,n);if(n)return Oi(t),rn(e,t,n);if(Ni.existsSync(t))throw new Error("dest already exists.");return rn(e,t,n)}function rn(e,t,n){try{Ni.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return ec(e,t,n)}}function ec(e,t,n){return Jr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Oi(e)}ji.exports=Xr});var Ki=C((pd,Gi)=>{"use strict";var tc=Z().fromPromise;Gi.exports={move:tc(Di()),moveSync:_i()}});var Te=C((gd,Ui)=>{"use strict";Ui.exports={...le(),...At(),...Ko(),...pi(),...$i(),...we(),...Ki(),...Dt(),...De(),...ut()}});var ia=C((Ed,oa)=>{function fe(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}oa.exports=fe;fe.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};fe.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};fe.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};fe.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};fe.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};fe.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};fe.prototype.start=fe.prototype.try;fe.prototype.errors=function(){return this._errors};fe.prototype.attempts=function(){return this._attempts};fe.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],a=i.message,s=(e[a]||0)+1;e[a]=s,s>=n&&(t=i,n=s)}return t}});var aa=C(Ke=>{var gc=ia();Ke.operation=function(e){var t=Ke.timeouts(e);return new gc(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};Ke.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(a,s){return a-s}),o};Ke.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};Ke.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(c){var d=Ke.operation(t),l=Array.prototype.slice.call(arguments,1),u=l.pop();l.push(function(m){d.retry(m)||(m&&(arguments[0]=d.mainError()),u.apply(this,arguments))}),d.attempt(function(){c.apply(e,l)})}.bind(e,s),e[a].options=t}}});var ra=C((Ad,sa)=>{sa.exports=aa()});var ca=C((Fd,Nt)=>{Nt.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Nt.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Nt.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var pa=C((Rd,Ze)=>{var H=global.process,Ue=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};Ue(H)?(la=require("assert"),Xe=ca(),da=/^win/i.test(H.platform),gt=require("events"),typeof gt!="function"&&(gt=gt.EventEmitter),H.__signal_exit_emitter__?ne=H.__signal_exit_emitter__:(ne=H.__signal_exit_emitter__=new gt,ne.count=0,ne.emitted={}),ne.infinite||(ne.setMaxListeners(1/0),ne.infinite=!0),Ze.exports=function(e,t){if(!Ue(global.process))return function(){};la.equal(typeof e,"function","a callback must be provided for exit handler"),Qe===!1&&pn();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){ne.removeListener(n,e),ne.listeners("exit").length===0&&ne.listeners("afterexit").length===0&&Ot()};return ne.on(n,e),o},Ot=function(){!Qe||!Ue(global.process)||(Qe=!1,Xe.forEach(function(t){try{H.removeListener(t,jt[t])}catch{}}),H.emit=_t,H.reallyExit=gn,ne.count-=1)},Ze.exports.unload=Ot,ze=function(t,n,o){ne.emitted[t]||(ne.emitted[t]=!0,ne.emit(t,n,o))},jt={},Xe.forEach(function(e){jt[e]=function(){if(Ue(global.process)){var n=H.listeners(e);n.length===ne.count&&(Ot(),ze("exit",null,e),ze("afterexit",null,e),da&&e==="SIGHUP"&&(e="SIGINT"),H.kill(H.pid,e))}}}),Ze.exports.signals=function(){return Xe},Qe=!1,pn=function(){Qe||!Ue(global.process)||(Qe=!0,ne.count+=1,Xe=Xe.filter(function(t){try{return H.on(t,jt[t]),!0}catch{return!1}}),H.emit=ma,H.reallyExit=ua)},Ze.exports.load=pn,gn=H.reallyExit,ua=function(t){Ue(global.process)&&(H.exitCode=t||0,ze("exit",H.exitCode,null),ze("afterexit",H.exitCode,null),gn.call(H,H.exitCode))},_t=H.emit,ma=function(t,n){if(t==="exit"&&Ue(global.process)){n!==void 0&&(H.exitCode=n);var o=_t.apply(this,arguments);return ze("exit",H.exitCode,null),ze("afterexit",H.exitCode,null),o}else return _t.apply(this,arguments)}):Ze.exports=function(){return function(){}};var la,Xe,da,gt,ne,Ot,ze,jt,Qe,pn,gn,ua,_t,ma});var fa=C((Md,fn)=>{"use strict";var ga=Symbol();function fc(e,t,n){let o=t[ga];if(o)return t.stat(e,(a,s)=>{if(a)return n(a);n(null,s.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,a=>{if(a)return n(a);t.stat(e,(s,r)=>{if(s)return n(s);let c=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,ga,{value:c}),n(null,r.mtime,c)})})}function hc(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}fn.exports.probe=fc;fn.exports.getMtime=hc});var ba=C((Dd,ht)=>{"use strict";var wc=require("path"),yn=Me(),yc=ra(),vc=pa(),ha=fa(),$e={};function ft(e,t){return t.lockfilePath||`${e}.lock`}function vn(e,t,n){if(!t.realpath)return n(null,wc.resolve(e));t.fs.realpath(e,n)}function wn(e,t,n){let o=ft(e,t);t.fs.mkdir(o,i=>{if(!i)return ha.probe(o,t.fs,(a,s,r)=>{if(a)return t.fs.rmdir(o,()=>{}),n(a);n(null,s,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(a,s)=>{if(a)return a.code==="ENOENT"?wn(e,{...t,stale:0},n):n(a);if(!wa(s,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));ya(e,t,r=>{if(r)return n(r);wn(e,{...t,stale:0},n)})})})}function wa(e,t){return e.mtime.getTime()<Date.now()-t.stale}function ya(e,t,n){t.fs.rmdir(ft(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function Gt(e,t){let n=$e[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let a=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||a?hn(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Gt(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return hn(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=ha.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,c=>{let d=n.lastUpdate+t.stale<Date.now();if(!n.released){if(c)return c.code==="ENOENT"||d?hn(e,n,Object.assign(c,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Gt(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,Gt(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function hn(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),$e[e]===t&&delete $e[e],t.options.onCompromised(n)}function bc(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:yn,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),vn(e,t,(o,i)=>{if(o)return n(o);let a=yc.operation(t.retries);a.attempt(()=>{wn(i,t,(s,r,c)=>{if(a.retry(s))return;if(s)return n(a.mainError());let d=$e[i]={lockfilePath:ft(i,t),mtime:r,mtimePrecision:c,options:t,lastUpdate:Date.now()};Gt(i,t),n(null,l=>{if(d.released)return l&&l(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));va(i,{...t,realpath:!1},l)})})})})}function va(e,t,n){t={fs:yn,realpath:!0,...t},vn(e,t,(o,i)=>{if(o)return n(o);let a=$e[i];if(!a)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));a.updateTimeout&&clearTimeout(a.updateTimeout),a.released=!0,delete $e[i],ya(i,t,n)})}function Sc(e,t,n){t={stale:1e4,realpath:!0,fs:yn,...t},t.stale=Math.max(t.stale||0,2e3),vn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(ft(i,t),(a,s)=>a?a.code==="ENOENT"?n(null,!1):n(a):n(null,!wa(s,t)))})}function kc(){return $e}vc(()=>{for(let e in $e){let t=$e[e].options;try{t.fs.rmdirSync(ft(e,t))}catch{}}});ht.exports.lock=bc;ht.exports.unlock=va;ht.exports.check=Sc;ht.exports.getLocks=kc});var ka=C((Ld,Sa)=>{"use strict";var Pc=Me();function xc(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let a=i.pop(),s;try{s=e[`${o}Sync`](...i)}catch(r){return a(r)}a(null,s)}}),n}function Cc(e){return(...t)=>new Promise((n,o)=>{t.push((i,a)=>{i?o(i):n(a)}),e(...t)})}function Tc(e){return(...t)=>{let n,o;if(t.push((i,a)=>{n=i,o=a}),e(...t),n)throw n;return o}}function Ic(e){if(e={...e},e.fs=xc(e.fs||Pc),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}Sa.exports={toPromise:Cc,toSync:Tc,toSyncOptions:Ic}});var xa=C((Nd,Oe)=>{"use strict";var et=ba(),{toPromise:Kt,toSync:Ut,toSyncOptions:bn}=ka();async function Pa(e,t){let n=await Kt(et.lock)(e,t);return Kt(n)}function Ec(e,t){let n=Ut(et.lock)(e,bn(t));return Ut(n)}function $c(e,t){return Kt(et.unlock)(e,t)}function Ac(e,t){return Ut(et.unlock)(e,bn(t))}function Fc(e,t){return Kt(et.check)(e,t)}function Rc(e,t){return Ut(et.check)(e,bn(t))}Oe.exports=Pa;Oe.exports.lock=Pa;Oe.exports.unlock=$c;Oe.exports.lockSync=Ec;Oe.exports.unlockSync=Ac;Oe.exports.check=Fc;Oe.exports.checkSync=Rc});var Rl={};Qa(Rl,{activate:()=>$l,deactivate:()=>Fl});module.exports=Za(Rl);var F=N(require("vscode"));var Y=N(require("vscode")),G=N(Te()),A=N(require("path")),Bi=N(require("crypto"));var Ge=N(require("vscode")),Ye=N(Te()),Lt=N(require("path"));var zi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,qi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ie=".alex",Hi={root:Ie,knowledge:`${Ie}/global-knowledge`,patterns:`${Ie}/global-knowledge/patterns`,insights:`${Ie}/global-knowledge/insights`,index:`${Ie}/global-knowledge/index.json`,projectRegistry:`${Ie}/project-registry.json`,globalProfile:`${Ie}/user-profile.json`},ln={pattern:"GK-",insight:"GI-"};function dn(){let e=Ge.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function Ee(e=!0){let t=Ge.workspace.workspaceFolders;if(!t||t.length===0)return{found:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."};if(t.length===1){let i=t[0];return e&&!await Wi(i.uri.fsPath)?{found:!1,error:'Alex is not installed in this workspace. Run "Alex: Initialize Architecture" first.'}:{found:!0,rootPath:i.uri.fsPath,workspaceFolder:i}}let n=[];for(let i of t)await Wi(i.uri.fsPath)&&n.push(i);if(!e){let i=await Ge.window.showQuickPick(t.map(a=>({label:a.name,description:a.uri.fsPath,folder:a})),{placeHolder:"Select a workspace folder to initialize Alex in",title:"Initialize Alex - Select Folder"});return i?{found:!0,rootPath:i.folder.uri.fsPath,workspaceFolder:i.folder}:{found:!1,cancelled:!0}}if(n.length===0)return{found:!1,error:'Alex is not installed in any workspace folder. Run "Alex: Initialize Architecture" first.'};if(n.length===1)return{found:!0,rootPath:n[0].uri.fsPath,workspaceFolder:n[0]};let o=await Ge.window.showQuickPick(n.map(i=>({label:i.name,description:i.uri.fsPath,folder:i})),{placeHolder:"Multiple folders have Alex installed. Select one:",title:"Alex - Select Workspace Folder"});return o?{found:!0,rootPath:o.folder.uri.fsPath,workspaceFolder:o.folder}:{found:!1,cancelled:!0}}async function un(e,t=!1){let n=Lt.join(e,".github","copilot-instructions.md");if(!await Ye.pathExists(n))return null;try{let o=await Ye.readFile(n,"utf8"),i=t?qi:zi,a=o.match(i);return a?a[1]:null}catch{return null}}async function Wi(e){let t=Lt.join(e,".github","copilot-instructions.md");return Ye.pathExists(t)}function Vi(e){return Bi.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}function nc(e){return A.join(e,".github","config","alex-manifest.json")}async function Ji(e){let t=await Ee(!1);if(!t.found){if(t.cancelled)return;Y.window.showErrorMessage(t.error||"No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t.rootPath,o=A.join(n,".github","copilot-instructions.md");if(await G.pathExists(o)){let i=await Y.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await Y.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await mn(e);return}await Yi(e,n,!1)}async function mn(e){let t=await Ee(!0);if(!t.found){if(t.cancelled)return;Y.window.showErrorMessage(t.error||"Please open a workspace folder with Alex installed to reset.");return}let n=t.rootPath,o=await Y.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await Y.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[A.join(n,".github","copilot-instructions.md"),A.join(n,".github","instructions"),A.join(n,".github","prompts"),A.join(n,".github","episodic"),A.join(n,".github","domain-knowledge"),A.join(n,".github","config"),A.join(n,".alex-manifest.json")];try{await Y.window.withProgress({location:Y.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await G.remove(s)}),await Yi(e,n,!0)}catch(a){Y.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function Yi(e,t,n){let o=e.extensionPath,i=A.join(o,".github","copilot-instructions.md");if(!await G.pathExists(i)){Y.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:A.join(o,".github","copilot-instructions.md"),dest:A.join(t,".github","copilot-instructions.md")},{src:A.join(o,".github","instructions"),dest:A.join(t,".github","instructions")},{src:A.join(o,".github","prompts"),dest:A.join(t,".github","prompts")},{src:A.join(o,".github","episodic"),dest:A.join(t,".github","episodic")},{src:A.join(o,".github","domain-knowledge"),dest:A.join(t,".github","domain-knowledge")},{src:A.join(o,".github","config"),dest:A.join(t,".github","config")},{src:A.join(o,".github","agents"),dest:A.join(t,".github","agents")}];try{let s=A.join(t,".github");await G.ensureDir(s);let r=A.join(s,".write-test");try{await G.writeFile(r,"test"),await G.remove(r)}catch(d){throw new Error(`Cannot write to workspace - check folder permissions: ${d.message}`)}await Y.window.withProgress({location:Y.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async d=>{for(let l of a)d.report({message:`Copying ${A.basename(l.dest)}...`}),await G.pathExists(l.src)?await G.copy(l.src,l.dest,{overwrite:n}):console.warn(`Source not found: ${l.src}`);d.report({message:"Creating manifest..."}),await ic(e,t)});let c=await Y.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(c==="Open Main Brain File"){let d=A.join(t,".github","copilot-instructions.md"),l=await Y.workspace.openTextDocument(d);await Y.window.showTextDocument(l)}else c==="Run Dream Protocol"&&await Y.commands.executeCommand("alex.dream")}catch(s){Y.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}function oc(e){return A.join(e,".alex-manifest.json")}async function ic(e,t){let n=e.extensionPath,o=oc(t);await G.pathExists(o)&&(await G.remove(o),console.log("Removed legacy manifest from root"));let i="0.0.0";try{i=(await G.readJson(A.join(n,"package.json"))).version||"0.0.0"}catch{console.warn("Could not read extension version")}let a={version:i,installedAt:new Date().toISOString(),files:{}},s=[{dir:A.join(t,".github","instructions"),prefix:".github/instructions"},{dir:A.join(t,".github","prompts"),prefix:".github/prompts"},{dir:A.join(t,".github","domain-knowledge"),prefix:".github/domain-knowledge"},{dir:A.join(t,".github","agents"),prefix:".github/agents"}],r=A.join(t,".github","copilot-instructions.md");if(await G.pathExists(r)){let d=await G.readFile(r,"utf8");a.files[".github/copilot-instructions.md"]={type:"system",originalChecksum:Vi(d)}}for(let{dir:d,prefix:l}of s)if(await G.pathExists(d)){let u=await G.readdir(d);for(let m of u)if(m.endsWith(".md")){let p=A.join(d,m),w=await G.readFile(p,"utf8");a.files[`${l}/${m}`]={type:"system",originalChecksum:Vi(w)}}}let c=nc(t);await G.ensureDir(A.dirname(c)),await G.writeJson(c,a,{spaces:2})}var te=N(require("vscode")),ye=N(Te()),pe=N(require("path"));var Xi={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function Qi(e){let t=await Ee(!0);if(!t.found){if(t.cancelled)return;te.window.showErrorMessage(t.error||"No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t.rootPath,o=t.workspaceFolder;await te.window.withProgress({location:te.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async i=>{i.report({message:"Scanning neural network..."});let a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=[];for(let v of a){let $=new te.RelativePattern(o,v),O=await te.workspace.findFiles($);s=s.concat(O.map(L=>L.fsPath))}if(s=[...new Set(s)],s.length===0){await te.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await te.commands.executeCommand("alex.initialize");return}let r=[],c=new Set(s.map(v=>pe.normalize(v).toLowerCase())),d=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let v of s){let $;try{$=await ye.readFile(v,"utf-8")}catch(K){console.error(`Failed to read file ${v}:`,K);continue}let O=$.split(`
`),L=!1;for(let K=0;K<O.length;K++){let ie=O[K];if(ie.trim().startsWith("```")){L=!L;continue}if(L)continue;let X;for(;(X=d.exec(ie))!==null;){let k=X[1].trim(),I=Array.from(c).some(_=>_.endsWith(pe.normalize(k).toLowerCase()));if(!I){let _=pe.join(n,k);(await ye.pathExists(_)||(await te.workspace.findFiles(new te.RelativePattern(o,`**/${k}`))).length>0)&&(I=!0)}if(!I){let _=pe.dirname(v),W=pe.join(_,k);await ye.pathExists(W)&&(I=!0)}["target-file.md","CHANGELOG.md"].includes(k)&&(I=!0),r.push({sourceFile:v,targetFile:k,strength:X[2].trim(),type:X[3]?.trim()||"association",direction:X[4]?.trim()||"unidirectional",condition:X[5]?.trim(),line:K+1,isValid:I})}}}let l=r.filter(v=>!v.isValid),u=new Set(r.map(v=>v.targetFile.toLowerCase())),m=[],p=[];for(let v of l){let $=pe.basename(v.targetFile);if(Xi[$]){let O=Xi[$];try{let L=await ye.readFile(v.sourceFile,"utf-8"),K=v.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),ie=new RegExp(`\\[${K}\\]`,"g");if(ie.test(L)){let X=L.replace(ie,`[${O}]`);await ye.writeFile(v.sourceFile,X,"utf-8"),v.repaired=!0,v.newTarget=O,m.push(v)}else p.push(v)}catch(L){console.error(`Failed to repair synapse in ${v.sourceFile}:`,L),p.push(v)}}else p.push(v)}l=p;let w={timestamp:new Date().toISOString(),totalFiles:s.length,totalSynapses:r.length,brokenSynapses:l,repairedSynapses:m,orphanedFiles:[]},b=ac(w),y=pe.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await ye.ensureDir(pe.dirname(y)),await ye.writeFile(y,b),l.length>0){if(await te.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${l.length} broken synapse${l.length>1?"s":""}!

${m.length>0?`\u2705 Auto-repaired: ${m.length}
`:""}\u274C Need manual repair: ${l.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let v=r.length>50?"excellent":r.length>20?"good":"developing";if(await te.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${s.length} memory files
\u2022 ${r.length} active synapses
${m.length>0?`\u2022 ${m.length} auto-repaired
`:""}\u2022 Network health: ${v}`,"View Full Report","Close")!=="View Full Report")return}let x=await te.workspace.openTextDocument(y);await te.window.showTextDocument(x)})}function ac(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${pe.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${pe.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var Q=N(require("vscode")),f=N(Te()),S=N(require("path")),ea=N(require("crypto"));function pt(e){return ea.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function sc(e){let t=S.join(e,".github","copilot-instructions.md");if(!await f.pathExists(t))return null;try{let o=(await f.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function rc(e){try{return(await f.readJson(S.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}function ta(e){return S.join(e,".github","config","alex-manifest.json")}function cc(e){return S.join(e,".alex-manifest.json")}async function lc(e){let t=ta(e),n=cc(e);if(await f.pathExists(t))try{return await f.readJson(t)}catch(o){return console.error("Failed to parse manifest (may be corrupted):",o),null}if(await f.pathExists(n))try{let o=await f.readJson(n);return await f.ensureDir(S.join(e,".github","config")),await f.writeJson(t,o,{spaces:2}),await f.remove(n),console.log("Migrated manifest from root to .github/config/"),o}catch(o){return console.error("Failed to parse/migrate legacy manifest:",o),null}return null}async function dc(e,t,n){let o=S.join(e,".github","copilot-instructions.md"),i=S.join(t,".github","copilot-instructions.md");if(!await f.pathExists(o)||!await f.pathExists(i))return{success:!1,reason:"File not found"};try{let a=await f.readFile(o,"utf8"),s=await f.readFile(i,"utf8"),r=a.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/),c=r?r[0]:null,d=a.match(/## Synapses[\s\S]*?(?=##|$)/),l=a.split(`
`).length,u=s.split(`
`).length;if(l>u*1.2)return{success:!1,reason:"User file has significant customizations"};let m=a.match(/^## [^\n]+/gm)||[],p=s.match(/^## [^\n]+/gm)||[],w=m.filter(y=>!p.includes(y));if(w.length>2)return{success:!1,reason:`User has ${w.length} custom sections`};let b=s;if(c&&c.includes("P5")&&!c.includes("Available for")){let y=b.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);y&&(b=b.replace(y[0],c))}return b=b.replace(/\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,`**Version**: ${n}`),await f.writeFile(o,b,"utf8"),{success:!0}}catch(a){return{success:!1,reason:a.message}}}async function Zi(e){let t=[];if(!await f.pathExists(e))return t;try{let n=await f.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function uc(e,t){let n=[],o=S.join(e,".github","domain-knowledge");if(await f.pathExists(o)){let i=await f.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function na(e){let t=await Ee(!0);if(!t.found){if(t.cancelled)return;await Q.window.showWarningMessage(t.error||"Alex is not installed in this workspace.","Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await Q.commands.executeCommand("alex.initialize");return}let n=t.rootPath,o=e.extensionPath,i=await sc(n),a=await rc(o);if(i===a){await Q.window.showInformationMessage(`\u2705 Alex is already at the latest version (${a}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await Q.commands.executeCommand("alex.dream");return}let s=await Q.window.showInformationMessage(`\u{1F504} Upgrade Available: v${i||"unknown"} \u2192 v${a}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(s==="What's New?"){let r=S.join(o,"CHANGELOG.md");if(await f.pathExists(r)){let c=await Q.workspace.openTextDocument(r);await Q.window.showTextDocument(c)}return}s==="Start Upgrade"&&await mc(e,n,o,i,a)}async function mc(e,t,n,o,i){let a=S.join(n,".github","copilot-instructions.md");if(!await f.pathExists(a)){Q.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),c=S.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await Q.window.withProgress({location:Q.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async u=>{u.report({message:"Creating complete backup...",increment:15});try{await f.ensureDir(c);let P=S.join(c,".write-test");await f.writeFile(P,"test"),await f.remove(P)}catch(P){throw new Error(`Cannot create backup directory - check disk space and permissions: ${P.message}`)}let m=S.join(t,".github");await f.pathExists(m)&&(await f.copy(m,S.join(c,".github")),s.backed_up.push(".github/ (all cognitive memory)")),u.report({message:"Analyzing installed files...",increment:10});let p=await lc(t);p||(p={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),u.report({message:"Scanning for schema migration needs...",increment:15});let w=[],b=S.join(t,".github","copilot-instructions.md");await f.pathExists(b)&&w.push(b);let y=S.join(t,".github","domain-knowledge");if(await f.pathExists(y)){let P=await f.readdir(y);for(let h of P)h.endsWith(".md")&&w.push(S.join(y,h))}let x=S.join(t,".github","episodic");if(await f.pathExists(x)){let P=await f.readdir(x);for(let h of P)h.endsWith(".md")&&w.push(S.join(x,h))}for(let P of w){let h=await Zi(P);if(h.length>0){let T=S.relative(t,P);s.migrationTasks.push({file:T,type:"schema-migration",description:"Synapse schema migration needed",details:h})}}u.report({message:"Identifying user-created files...",increment:10});let v=await uc(t,p);for(let P of v){s.preserved.push(`${P} (user-created)`);let h=S.join(t,P),T=await Zi(h);T.length>0&&s.migrationTasks.push({file:P,type:"schema-migration",description:"User-created file needs schema migration",details:T})}u.report({message:"Merging core brain file...",increment:10});let $=await dc(t,n,i);$.success?s.updated.push(".github/copilot-instructions.md (auto-merged)"):s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires manual merge",details:[`Auto-merge failed: ${$.reason}`,"UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),u.report({message:"Updating system files...",increment:20});let O=S.join(n,".github","instructions"),L=S.join(t,".github","instructions");if(await f.pathExists(O)){let P=await f.readdir(O);for(let h of P){let T=S.join(O,h),E=S.join(L,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(E);await f.copy(T,E,{overwrite:!0});let Fe=await f.readFile(T,"utf8");p.files[`.github/instructions/${h}`]={type:"system",originalChecksum:pt(Fe)},ve?s.updated.push(`.github/instructions/${h}`):s.added.push(`.github/instructions/${h}`)}}}let K=S.join(n,".github","prompts"),ie=S.join(t,".github","prompts");if(await f.pathExists(K)){let P=await f.readdir(K);for(let h of P){let T=S.join(K,h),E=S.join(ie,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(E);await f.copy(T,E,{overwrite:!0});let Fe=await f.readFile(T,"utf8");p.files[`.github/prompts/${h}`]={type:"system",originalChecksum:pt(Fe)},ve?s.updated.push(`.github/prompts/${h}`):s.added.push(`.github/prompts/${h}`)}}}let X=S.join(n,".github","agents"),k=S.join(t,".github","agents");if(await f.pathExists(X)){await f.ensureDir(k);let P=await f.readdir(X);for(let h of P){let T=S.join(X,h),E=S.join(k,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(E);await f.copy(T,E,{overwrite:!0});let Fe=await f.readFile(T,"utf8");p.files[`.github/agents/${h}`]={type:"system",originalChecksum:pt(Fe)},ve?s.updated.push(`.github/agents/${h}`):s.added.push(`.github/agents/${h}`)}}}let I=S.join(n,".github","config"),R=S.join(t,".github","config");if(await f.pathExists(I)){await f.ensureDir(R);let P=await f.readdir(I);for(let h of P)if(h.includes("template")||h==="USER-PROFILE-TEMPLATE.md"){let T=S.join(I,h),E=S.join(R,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(E);await f.copy(T,E,{overwrite:!0}),ve?s.updated.push(`.github/config/${h}`):s.added.push(`.github/config/${h}`)}}}u.report({message:"Processing domain knowledge...",increment:10});let _=S.join(n,".github","domain-knowledge"),W=S.join(t,".github","domain-knowledge");if(await f.pathExists(_)){await f.ensureDir(W);let P=await f.readdir(_);for(let h of P){let T=S.join(_,h),E=S.join(W,h);if((await f.stat(T)).isFile()){let ve=await f.readFile(T,"utf8"),Fe=pt(ve);if(!await f.pathExists(E))await f.copy(T,E),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:Fe},s.added.push(`.github/domain-knowledge/${h}`);else{let Ha=await f.readFile(E,"utf8"),Wa=pt(Ha),Hn=p.files[`.github/domain-knowledge/${h}`]?.originalChecksum;if(Hn&&Wa!==Hn){let Vt=E.replace(/\.md$/,`.v${i}.md`);await f.copy(T,Vt),s.preserved.push(`.github/domain-knowledge/${h} (modified by user, new version: ${S.basename(Vt)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${h}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${h}`,`New version available: ${S.basename(Vt)}`,"Review and merge changes as needed"]})}else await f.copy(T,E,{overwrite:!0}),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:Fe},s.updated.push(`.github/domain-knowledge/${h}`)}}}}u.report({message:"Saving manifest...",increment:5}),p.version=i,p.upgradedAt=new Date().toISOString();let J=ta(t);await f.ensureDir(S.dirname(J));let U=J+".tmp";await f.writeJson(U,p,{spaces:2}),await f.move(U,J,{overwrite:!0}),u.report({message:"Generating upgrade instructions...",increment:5}),await pc(t,o,i,s,c,r)});let d=s.migrationTasks.length===1?"task":"tasks",l=await Q.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Migration ${d}: ${s.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(l==="Open Instructions (Recommended)"){let u=S.join(t,"UPGRADE-INSTRUCTIONS.md"),m=await Q.workspace.openTextDocument(u);await Q.window.showTextDocument(m)}else if(l==="View Full Report"){let u=S.join(t,"archive","upgrades",`upgrade-report-${r}.md`),m=await Q.workspace.openTextDocument(u);await Q.window.showTextDocument(m)}}catch(d){Q.window.showErrorMessage(`\u274C Upgrade failed: ${d.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(d.message)}}async function pc(e,t,n,o,i,a){let s=`# \u{1F504} Alex Upgrade: Phase 2 Required

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

${o.migrationTasks.length>0?o.migrationTasks.map((d,l)=>`
### Task ${l+1}: ${d.file}

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
2. Copy contents from: \`${S.relative(e,i)}\`
3. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${a}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${S.relative(e,i)}\`

---

*This file will be deleted after successful upgrade completion.*
`;await f.writeFile(S.join(e,"UPGRADE-INSTRUCTIONS.md"),s,"utf8");let r=`# Alex Cognitive Architecture Upgrade Report

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

${o.migrationTasks.length>0?o.migrationTasks.map((d,l)=>`
### ${l+1}. ${d.file}

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
`,c=S.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await f.ensureDir(S.dirname(c)),await f.writeFile(c,r,"utf8")}var j=N(require("vscode")),ke=N(Te()),Ht=N(require("path"));var M=N(require("vscode")),D=N(Te()),me=N(require("path")),Fn=N(require("os")),Ra=N(xa());var he=N(require("vscode")),B=N(Te()),Ae=N(require("path")),Ca=N(require("https"));var qe="alex-knowledge-index.json",Ta="Alex Cognitive Architecture - Global Knowledge Base";async function Mc(){try{return await he.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function wt(e,t={}){let n=await Mc();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let a=new URL(`https://api.github.com${e}`),s={hostname:a.hostname,path:a.pathname+a.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=Ca.request(s,c=>{let d="";c.on("data",l=>{d+=l}),c.on("end",()=>{if(c.statusCode&&c.statusCode>=200&&c.statusCode<300)if(c.statusCode===204||!d)o(null);else try{o(JSON.parse(d))}catch(l){i(new Error(`Failed to parse GitHub response: ${l}`))}else i(new Error(`GitHub API error (${c.statusCode}): ${d}`))})});r.on("error",c=>i(c)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function Ia(){return Ae.join(oe("root"),"sync-metadata.json")}async function zt(){let e=Ia();try{if(await B.pathExists(e))return await B.readJson(e)}catch{}return{}}async function nt(e){let t=Ia();await B.writeJson(t,e,{spaces:2})}async function Tn(){let e=await zt();if(e.gistId)try{let i=await wt(`/gists/${e.gistId}`);if(i)return i}catch{}let t=oe("index");if(await B.pathExists(t))try{let i=await B.readJson(t);if(i.cloudGistId){let a=await wt(`/gists/${i.cloudGistId}`);if(a)return await nt({...e,gistId:a.id}),a}}catch{}let n=await wt("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===Ta||i.files[qe]);return o&&await nt({...e,gistId:o.id}),o||null}async function Ea(e){let t={};for(let[i,a]of Object.entries(e))t[i]={content:a};let n=await wt("/gists",{method:"POST",body:{description:Ta,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await zt();return await nt({...o,gistId:n.id}),n}async function $a(e,t){let n={};for(let[i,a]of Object.entries(t))n[i]=a===null?null:{content:a};let o=await wt(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function qt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function yt(){try{let e=await zt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=oe("index");if(!await B.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await B.readJson(t),o=qt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function vt(){try{await re();let e=oe("index");if(!await B.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await B.readJson(e),n=await Tn(),o=!n;n||(n=await Ea({[qe]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[qe]:JSON.stringify(t,null,2)};for(let s of t.entries)if(await B.pathExists(s.filePath)){let r=await B.readFile(s.filePath,"utf-8"),c=Ae.basename(s.filePath);i[c]=r}n=await $a(n.id,i),await He(()=>t);let a=qt(t);return await nt({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:a,lastRemoteHash:a}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function bt(){try{await re();let e=await Tn();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[qe];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let a of n.entries){let s=Ae.basename(a.filePath),r=e.files[s];if(r){let c=a.type==="pattern"?"patterns":"insights",d=Ae.join(oe(c),s);a.filePath=d,await B.writeFile(d,r.content,"utf-8"),o++}}await He(()=>n);let i=qt(n);return await nt({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function ot(){try{await re();let e=oe("index"),t;await B.pathExists(e)?t=await B.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await Tn(),o;n&&n.files[qe]?o=JSON.parse(n.files[qe].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let u of o.entries)i.set(u.id,u);for(let u of t.entries){let m=i.get(u.id);(!m||new Date(u.modified)>new Date(m.modified))&&i.set(u.id,u)}let a={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},s={[qe]:JSON.stringify(a,null,2)};for(let u of a.entries)if(await B.pathExists(u.filePath)){let m=await B.readFile(u.filePath,"utf-8"),p=Ae.basename(u.filePath);s[p]=m}let r=0;if(n)for(let u of o.entries){let m=Ae.basename(u.filePath),p=n.files[m],w=u.type==="pattern"?"patterns":"insights",b=Ae.join(oe(w),m);if(p&&!await B.pathExists(b)){await B.writeFile(b,p.content,"utf-8");let y=i.get(u.id);y&&(y.filePath=b),r++}}n?await $a(n.id,s):n=await Ea(s),await He(()=>a);let c=qt(a);await nt({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:c,lastRemoteHash:c});let d=t.entries.filter(u=>!o.entries.find(m=>m.id===u.id)).length,l=r;return{success:!0,status:"up-to-date",message:`Synced! ${d} pushed, ${l} pulled. Total: ${a.entries.length} entries.`,entriesPushed:d,entriesPulled:l}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function it(){let e=await zt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var xn=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new he.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await vt();break;case"pull":i=await bt();break;default:i=await ot()}let s=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;s+=`**Status**: ${i.status}
`,s+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(s+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(s+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await it();return r&&(s+=`
**Cloud URL**: ${r}
`),new he.LanguageModelToolResult([new he.LanguageModelTextPart(s)])}};function Aa(e){e.subscriptions.push(he.lm.registerTool("alex_cloud_sync",new xn))}var tt,Sn,kn=!1,Dc=300*1e3,Lc=60*1e3,Pn;function Nc(){return Pn||(Pn=he.window.createOutputChannel("Alex Unconscious Mind")),Pn}function Se(e){let t=new Date().toISOString();Nc().appendLine(`[${t}] ${e}`)}async function Cn(){if(kn)return Se("Sync already in progress, skipping"),null;if(Sn&&Date.now()-Sn.getTime()<Lc)return Se("Too soon since last sync, skipping"),null;kn=!0,Sn=new Date;try{if(Se("Starting transparent background sync..."),(await yt()).status==="up-to-date")return Se("Already up-to-date, no sync needed"),{success:!0,status:"up-to-date",message:"Already synced"};let t=await ot();return Se(`Sync complete: ${t.message}`),t}catch(e){return Se(`Transparent sync failed: ${e}`),{success:!1,status:"error",message:`${e}`}}finally{kn=!1}}async function at(){setTimeout(async()=>{let e=await Cn();e&&e.success&&e.entriesPushed&&e.entriesPushed>0&&Se(`Auto-synced ${e.entriesPushed} entries after modification`)},2e3)}function Fa(e){tt&&clearInterval(tt),Se("Background sync enabled - Alex unconscious mind active"),setTimeout(async()=>{Se("Running startup sync..."),await Cn()},1e4),tt=setInterval(async()=>{await Cn()},Dc),e.subscriptions.push({dispose:()=>{tt&&(clearInterval(tt),tt=void 0),Se("Background sync disabled")}})}var Oc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function Rn(){return me.join(Fn.homedir(),Ie)}function oe(e){return me.join(Fn.homedir(),Hi[e])}async function re(){let e=[oe("root"),oe("knowledge"),oe("patterns"),oe("insights")];for(let t of e)await D.ensureDir(t)}async function Mn(e,t){await D.pathExists(e)||await D.ensureFile(e);let n;try{return n=await Ra.lock(e,Oc),await t()}finally{n&&await n()}}async function He(e){let t=oe("index");return await re(),await Mn(t,async()=>{let n;try{if(await D.pathExists(t)){let o=await D.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await D.writeJson(t,n,{spaces:2}),n})}async function Ma(e){let t=oe("projectRegistry");return await re(),await Mn(t,async()=>{let n;try{if(await D.pathExists(t)){let o=await D.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await D.writeJson(t,n,{spaces:2}),n})}async function Dn(){let e=oe("index");return await re(),await Mn(e,async()=>{try{if(await D.pathExists(e)){let n=await D.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await D.writeJson(e,t,{spaces:2}),t})}async function Ln(){let e=oe("projectRegistry");return await re(),await Ma(t=>t)}async function Da(){let e=M.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=me.basename(t),o=0,i=new M.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await M.workspace.findFiles(i)).length;let s;return await Ma(r=>{let c=r.projects.findIndex(l=>l.path===t),d={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return c>=0?(r.projects[c]={...r.projects[c],...d},s=r.projects[c]):(r.projects.push(d),s=d),r}),s}function La(e,t){let n=e==="pattern"?ln.pattern:ln.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function jc(e,t,n,o,i){await re();let a=La("pattern",e),s=`${a}.md`,r=me.join(oe("patterns"),s),c=`# ${e}

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

`;await D.writeFile(r,c,"utf-8");let d={id:a,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await He(l=>(l.entries.push(d),l)),d}async function _c(e,t,n,o,i){let a=e.filePath;if(!a||!await D.pathExists(a))throw new Error(`Global pattern file not found: ${a}`);let s=[...new Set([...e.tags||[],...o])],r=`# ${e.title}

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

`;await D.writeFile(a,r,"utf-8");let c={...e,category:n,tags:s,modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":"")};return await He(d=>{let l=d.entries.findIndex(u=>u.id===e.id);return l>=0&&(d.entries[l]=c),d}),c}async function Nn(e,t,n,o,i,a,s){await re();let r=La("insight",e),c=`${r}.md`,d=me.join(oe("insights"),c),l=`# ${e}

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

`;await D.writeFile(d,l,"utf-8");let u={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:d};return await He(m=>(m.entries.push(u),m)),u}async function St(e,t={}){let n=await Dn(),o=e.toLowerCase(),i=o.split(/\s+/).filter(s=>s.length>2),a=[];for(let s of n.entries){if(t.type&&t.type!=="all"&&s.type!==t.type||t.category&&s.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(d=>s.tags.map(l=>l.toLowerCase()).includes(d.toLowerCase())))continue;let r=0;s.title.toLowerCase().includes(o)&&(r+=10);for(let c of i)s.title.toLowerCase().includes(c)&&(r+=3);for(let c of s.tags){(c.toLowerCase().includes(o)||o.includes(c.toLowerCase()))&&(r+=5);for(let d of i)c.toLowerCase().includes(d)&&(r+=2)}s.summary.toLowerCase().includes(o)&&(r+=3);for(let c of i)s.summary.toLowerCase().includes(c)&&(r+=1);if(s.category.toLowerCase().includes(o)&&(r+=2),r>0){let c;if(await D.pathExists(s.filePath))try{c=await D.readFile(s.filePath,"utf-8");for(let d of i){let l=(c.toLowerCase().match(new RegExp(d,"g"))||[]).length;r+=Math.min(l,5)*.5}}catch{}a.push({entry:s,relevance:r,content:c})}}return a.sort((s,r)=>r.relevance-s.relevance),a.slice(0,t.limit||10)}async function Na(e,t,n=[]){try{let o=await D.readFile(e,"utf-8"),i=me.basename(e,".md"),a=o.match(/^#\s+(.+)$/m),s=a?a[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),c=r?r[1].split(",").map(m=>m.trim()):[],d=[...new Set([...c,...n])],l=M.workspace.workspaceFolders,u=l?me.basename(l[0].uri.fsPath):void 0;return await jc(s,o,t,d,u)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}var Gc=["DK-SKILL-WISHLIST","DK-GENERIC-FRAMEWORK","VERSION-NAMING-CONVENTION"];async function Kc(e){let t=me.basename(e,".md"),n=await D.readFile(e,"utf-8"),o=0,i=[],a=n.match(/^#\s+(.+)$/m),s=a?a[1]:t.replace(/^DK-/,"").replace(/-/g," "),r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g,c=n.match(r);c&&c.length>0&&(o+=3,i.push(`Has ${c.length} synapse connection(s)`));let d=n.match(/^##\s+.+$/gm);d&&d.length>=3&&(o+=2,i.push(`Well-structured with ${d.length} sections`));let l=n.match(/\*\*Tags\*\*:\s*(.+)$/m),u=[];l&&(u=l[1].split(",").map(L=>L.trim()).filter(L=>L.length>0),u.length>0&&(o+=1,i.push(`Has ${u.length} tag(s)`))),n.length>1e3&&(o+=1,i.push("Substantial content (>1KB)")),n.length>5e3&&(o+=2,i.push("Rich content (>5KB)"));let m=n.match(/```[\s\S]*?```/g);m&&m.length>0&&(o+=2,i.push(`Contains ${m.length} code example(s)`));let w=[/pattern/i,/best practice/i,/guideline/i,/framework/i,/principle/i,/architecture/i,/design/i,/approach/i].filter(L=>L.test(n)).length;w>=2&&(o+=Math.min(w,3),i.push("Contains general/reusable concepts"));let b=Uc(n,t),y=await Dn(),x=s.toLowerCase().replace(/[^a-z0-9]/g,"-"),v=y.entries.find(L=>L.title.toLowerCase().replace(/[^a-z0-9]/g,"-")===x||L.id.includes(x)),$=!!v,O=!1;if($&&v)try{let K=(await D.stat(e)).mtime,ie=new Date(v.modified);O=K>ie}catch{O=!1}return{filePath:e,filename:t,title:s,score:o,reasons:i,category:b,tags:u,isPromotionCandidate:o>=5&&!$,alreadyPromoted:$,existingEntry:v,hasLocalChanges:O}}function Uc(e,t){let n=e.toLowerCase(),o=t.toLowerCase(),i=[[/error|exception|fault|handling/i,"error-handling"],[/api|rest|graphql|endpoint/i,"api-design"],[/test|spec|jest|mocha|assertion/i,"testing"],[/debug|troubleshoot|diagnos/i,"debugging"],[/performance|optimi|cache|speed/i,"performance"],[/architecture|design|pattern|structure/i,"architecture"],[/security|auth|encrypt|vulnerab/i,"security"],[/deploy|ci\/cd|pipeline|docker|kubernetes/i,"deployment"],[/document|readme|comment|diagram/i,"documentation"],[/refactor|clean|improve|modernize/i,"refactoring"],[/tool|config|setup|environment/i,"tooling"]];for(let[a,s]of i)if(a.test(n)||a.test(o))return s;return"general"}async function Oa(e,t={}){let{dryRun:n=!1,minScore:o=5}=t;await re();let i={evaluated:0,promoted:[],updated:[],skipped:[],alreadyGlobal:[]},a=me.join(e,".github","domain-knowledge");if(!await D.pathExists(a))return i;let r=(await D.readdir(a)).filter(c=>c.startsWith("DK-")&&c.endsWith(".md"));for(let c of r){let d=me.join(a,c),l=c.replace(".md","");if(Gc.some(u=>l.includes(u))){i.skipped.push({filename:c,reason:"Excluded meta-file"});continue}i.evaluated++;try{let u=await Kc(d);if(u.alreadyPromoted){if(u.hasLocalChanges&&u.existingEntry)if(n)i.updated.push({...u.existingEntry,modified:new Date().toISOString(),summary:"[DRY-RUN] Would be updated from local changes"});else{let m=await D.readFile(d,"utf-8"),p=M.workspace.workspaceFolders,w=p?me.basename(p[0].uri.fsPath):void 0,b=await _c(u.existingEntry,m,u.category,u.tags,w);i.updated.push(b)}else i.alreadyGlobal.push(c);continue}if(!u.isPromotionCandidate||u.score<o){i.skipped.push({filename:c,reason:`Score ${u.score}/${o} - ${u.reasons.join(", ")||"Needs more structure/content"}`});continue}if(n)i.promoted.push({id:`[DRY-RUN] ${l}`,title:u.title,type:"pattern",category:u.category,tags:u.tags,created:new Date().toISOString(),modified:new Date().toISOString(),summary:`Would be promoted with score ${u.score}`,filePath:d});else{let m=await Na(d,u.category,u.tags);m&&i.promoted.push(m)}}catch(u){i.skipped.push({filename:c,reason:`Error: ${u}`})}}return!n&&(i.promoted.length>0||i.updated.length>0)&&at(),i}async function On(){let e=await Dn(),t={},n={};for(let a of e.entries){t[a.category]=(t[a.category]||0)+1;for(let s of a.tags)n[s]=(n[s]||0)+1}let o=Object.entries(n).map(([a,s])=>({tag:a,count:s})).sort((a,s)=>s.count-a.count).slice(0,10),i=[...e.entries].sort((a,s)=>new Date(s.created).getTime()-new Date(a.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(a=>a.type==="pattern").length,totalInsights:e.entries.filter(a=>a.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var In=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new M.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await re();let{query:o,type:i,category:a,tags:s}=t.input,r=await St(o,{type:i,category:a,tags:s?s.split(",").map(d=>d.trim()):void 0,limit:10});if(r.length===0)return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`No global knowledge found matching "${o}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`)]);let c=`## Global Knowledge Search Results

`;c+=`Found **${r.length}** relevant entries for "${o}":

`;for(let{entry:d,relevance:l}of r){let u=d.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";c+=`### ${u} ${d.title}
`,c+=`- **Type**: ${d.type} | **Category**: ${d.category}
`,c+=`- **Tags**: ${d.tags.join(", ")}
`,d.sourceProject&&(c+=`- **Source**: ${d.sourceProject}
`),c+=`- **Summary**: ${d.summary}
`,c+=`- **File**: \`${d.filePath}\`

`}return new M.LanguageModelToolResult([new M.LanguageModelTextPart(c)])}},En=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new M.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await re();let{title:o,insight:i,category:a,tags:s,problem:r,solution:c}=t.input,d=M.workspace.workspaceFolders,l=d?me.basename(d[0].uri.fsPath):void 0,u=await Nn(o,i,a||"general",s?s.split(",").map(p=>p.trim()):[],l,r,c);at();let m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${u.id}  
**Title**: ${u.title}  
**Category**: ${u.category}  
**Tags**: ${u.tags.join(", ")}  
**Source Project**: ${u.sourceProject||"Unknown"}  
**File**: \`${u.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(m)])}},$n=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${me.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new M.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:a}=t.input;if(!await D.pathExists(o))return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let s=await Na(o,i||"general",a?a.split(",").map(c=>c.trim()):[]);if(!s)return new M.LanguageModelToolResult([new M.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);at();let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${s.id}  
**Title**: ${s.title}  
**Category**: ${s.category}  
**Tags**: ${s.tags.join(", ")}  
**Global File**: \`${s.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(r)])}},An=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await re();let o=await On(),i=await Ln(),a="";try{let r=await yt();a=`| Cloud Sync | ${r.status==="up-to-date"?"\u2705":r.status==="needs-push"?"\u{1F4E4}":r.status==="needs-pull"?"\u{1F4E5}":r.status==="error"?"\u274C":"\u26AA"} ${r.status} |
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
`;for(let[r,c]of Object.entries(o.categories))s+=`- **${r}**: ${c}
`;if(o.topTags.length>0){s+=`
### Top Tags
`;for(let{tag:r,count:c}of o.topTags)s+=`- ${r}: ${c}
`}if(o.recentEntries.length>0){s+=`
### Recent Entries
`;for(let r of o.recentEntries){let c=r.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";s+=`- ${c} **${r.title}** (${r.category})
`}}if(i.projects.length>0){s+=`
### Known Projects
`;for(let r of i.projects.slice(0,5))s+=`- **${r.name}** - ${r.knowledgeFiles} knowledge files
`}return s+=`
### Global Knowledge Location
\`${Rn()}\`
`,new M.LanguageModelToolResult([new M.LanguageModelTextPart(s)])}};function ja(e){e.subscriptions.push(M.lm.registerTool("alex_global_knowledge_search",new In),M.lm.registerTool("alex_save_insight",new En),M.lm.registerTool("alex_promote_knowledge",new $n),M.lm.registerTool("alex_global_knowledge_status",new An))}async function _a(e){let t=await Ee(!0);if(!t.found){if(t.cancelled)return;j.window.showErrorMessage(t.error||"No workspace folder open. Please open a project with Alex installed.");return}let n=t.rootPath,o=t.workspaceFolder,i={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},globalKnowledgePromotion:{evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0},recommendations:[],sessionFile:""};await j.window.withProgress({location:j.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async c=>{c.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await zc(o,i),c.report({message:"Phase 2: Checking version consistency...",increment:20}),await qc(n,i),c.report({message:"Phase 3: Assessing memory architecture...",increment:40}),await Hc(o,i),c.report({message:"Phase 4: Auto-promoting knowledge to global...",increment:55}),await Wc(n,i),c.report({message:"Phase 5: Generating recommendations...",increment:75}),Vc(i),c.report({message:"Phase 6: Documenting session...",increment:90}),await Bc(n,i),c.report({message:"Self-actualization complete!",increment:100})});let s=`Self-Actualization Complete ${i.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":i.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":i.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${i.synapseHealth.totalSynapses} (${i.synapseHealth.brokenConnections} broken)
Memory Files: ${i.memoryConsolidation.proceduralFiles+i.memoryConsolidation.episodicFiles+i.memoryConsolidation.domainFiles}
Recommendations: ${i.recommendations.length}`,r=await j.window.showInformationMessage(s,"View Report","Open Session File");if(r==="View Report")Jc(i);else if(r==="Open Session File"&&i.sessionFile){let c=await j.workspace.openTextDocument(i.sessionFile);await j.window.showTextDocument(c)}return i}async function zc(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new j.RelativePattern(e,i),s=await j.workspace.findFiles(a);for(let r of s){t.synapseHealth.totalFiles++;try{let d=(await ke.readFile(r.fsPath,"utf-8")).split(`
`),l=!1;for(let u of d){if(u.trim().startsWith("```")){l=!l;continue}if(l)continue;let m;for(;(m=o.exec(u))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await j.workspace.findFiles(new j.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function qc(e,t){let n=Ht.join(e,".github","copilot-instructions.md");try{if(await ke.pathExists(n)){let r=(await ke.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=j.workspace.workspaceFolders?.[0];if(a)for(let s of i){let r=new j.RelativePattern(a,s),c=await j.workspace.findFiles(r);for(let d of c)try{let l=await ke.readFile(d.fsPath,"utf-8");for(let u of o)if(u.test(l)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Hc(e,t){let n=await j.workspace.findFiles(new j.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await j.workspace.findFiles(new j.RelativePattern(e,".github/prompts/*.md")),i=await j.workspace.findFiles(new j.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await j.workspace.findFiles(new j.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}async function Wc(e,t){try{let n=await Oa(e,{minScore:5});t.globalKnowledgePromotion={evaluated:n.evaluated,promoted:n.promoted.map(o=>o.title),updated:n.updated.map(o=>o.title),skipped:n.skipped.length,alreadyGlobal:n.alreadyGlobal.length}}catch(n){console.error("Auto-promotion failed:",n),t.globalKnowledgePromotion={evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0}}}function Vc(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections"),e.globalKnowledgePromotion.promoted.length>0&&e.recommendations.push(`\u{1F310} Auto-promoted ${e.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`),e.globalKnowledgePromotion.updated.length>0&&e.recommendations.push(`\u{1F504} Updated ${e.globalKnowledgePromotion.updated.length} global knowledge file(s) with local changes!`),e.globalKnowledgePromotion.skipped>0&&e.globalKnowledgePromotion.promoted.length===0&&e.globalKnowledgePromotion.updated.length===0&&e.recommendations.push(`\u{1F4D6} ${e.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`)}async function Bc(e,t){let n=Ht.join(e,".github","episodic");await ke.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Ht.join(n,a),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",c=`# Self-Actualization Session - ${i}

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
`;await ke.writeFile(s,c,"utf-8"),t.sessionFile=s}function Jc(e){let t=j.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",j.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
</html>`}var z=N(require("vscode")),za=N(require("path"));var g=N(require("vscode")),q=N(Te()),ge=N(require("path"));var jn=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new g.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,r=0,c=0,d=[],l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){let w=new g.RelativePattern(o[0],p),b=await g.workspace.findFiles(w);for(let y of b){s++;try{let v=(await q.readFile(y.fsPath,"utf-8")).split(`
`),$=!1;for(let O=0;O<v.length;O++){let L=v[O];if(L.trim().startsWith("```")){$=!$;continue}if($)continue;let K;for(;(K=l.exec(L))!==null;){r++;let ie=K[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${ie}`))).length===0&&(c++,t.input.detailed&&d.push(`- ${ge.basename(y.fsPath)}:${O+1} \u2192 ${ie} (not found)`))}}}catch{}}}let u=c===0?"EXCELLENT":c<5?"GOOD":c<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${r} |
| Broken Connections | ${c} |
| Health Status | ${u} |
`;return t.input.detailed&&d.length>0&&(m+=`
### Issues Found
${d.join(`
`)}`),c>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},_n=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new g.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let r=[];for(let l of s){let u=new g.RelativePattern(o[0],l),m=await g.workspace.findFiles(u);for(let p of m)try{let b=(await q.readFile(p.fsPath,"utf-8")).split(`
`),y=[];for(let x=0;x<b.length;x++)if(b[x].toLowerCase().includes(i)){let v=Math.max(0,x-1),$=Math.min(b.length-1,x+1),O=b.slice(v,$+1).join(`
`);y.push(`Line ${x+1}:
${O}`)}y.length>0&&r.push({file:ge.basename(p.fsPath),matches:y.slice(0,3)})}catch{}}let c=[];if(r.length===0)try{c=await St(t.input.query,{limit:5})}catch{}if(r.length===0&&c.length===0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`No matches found for "${t.input.query}" in local ${a} memory or global knowledge base.`)]);let d="";if(r.length>0){d+=`## Local Memory Results for "${t.input.query}"

`,d+=`Found ${r.length} file(s) with matches:

`;for(let l of r.slice(0,5)){d+=`### ${l.file}
`;for(let u of l.matches)d+=`\`\`\`
${u}
\`\`\`
`;d+=`
`}}if(c.length>0){r.length===0?(d+=`## \u{1F310} Global Knowledge Results (Unconscious Retrieval)

`,d+=`*Local search found nothing. Automatically searched cross-project knowledge:*

`):d+=`## \u{1F310} Related Global Knowledge

`;for(let{entry:l}of c.slice(0,3)){let u=l.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";d+=`### ${u} ${l.title}
`,d+=`- **Type**: ${l.type} | **Category**: ${l.category}
`,d+=`- **Tags**: ${l.tags.join(", ")}
`,d+=`- **Summary**: ${l.summary}

`}}return new g.LanguageModelToolResult([new g.LanguageModelTextPart(d)])}},Gn=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ge.join(i,".github","copilot-instructions.md");if(!await q.pathExists(a))return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md")),u="Unknown";try{let w=(await q.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);w&&(u=w[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${u} |
| Procedural Memory | ${r.length} files |
| Episodic Memory | ${c.length+d.length} files |
| Domain Knowledge | ${l.length} files |

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
`;return new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Kn=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`))])}},Un=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ge.join(i,"config","USER-PROFILE.md"),s=ge.join(i,"config","user-profile.json"),{action:r,field:c,value:d}=t.input;try{switch(r){case"exists":let l=await q.pathExists(s);return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:l,path:s}))]);case"get":if(!await q.pathExists(s))return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let u=await q.readJson(s);return c?new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({[c]:u[c]}))]):new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify(u))]);case"update":if(!c||d===void 0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await q.ensureDir(ge.join(i,"config"));let m={};if(await q.pathExists(s)&&(m=await q.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(c)){let p=m[c]||[];Array.isArray(p)?p.includes(d)||(m[c]=[...p,d]):m[c]=[d]}else m[c]=d;return m.lastUpdated=new Date().toISOString(),await q.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({success:!0,field:c,value:d,message:`Updated ${c} to: ${d}`}))]);default:return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(l){return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Error accessing user profile: ${l.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await q.writeFile(t,o,"utf-8")}},zn=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new g.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let y=ge.join(i,".github","copilot-instructions.md");if(await q.pathExists(y)){let v=(await q.readFile(y,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);v&&(a=v[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let y of r){let x=new g.RelativePattern(o[0],y),v=await g.workspace.findFiles(x);for(let $ of v){s.synapseHealth.totalFiles++;try{let L=(await q.readFile($.fsPath,"utf-8")).split(`
`),K=!1;for(let ie of L){if(ie.trim().startsWith("```")){K=!K;continue}if(K)continue;let X;for(;(X=c.exec(ie))!==null;){s.synapseHealth.totalSynapses++;let k=X[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${k}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),m=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=d.length,s.memoryArchitecture.episodicFiles=l.length+u.length,s.memoryArchitecture.domainFiles=m.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let y=ge.join(i,".github","episodic");await q.ensureDir(y);let v=new Date().toISOString().split("T")[0],$=`self-actualization-${v}.prompt.md`;p=ge.join(y,$);let O=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",L=`# Self-Actualization Session - ${v}

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
| Health Status | ${O} ${s.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${s.memoryArchitecture.proceduralFiles} |
| Episodic | ${s.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${s.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${s.recommendations.length>0?s.recommendations.map(K=>`- ${K}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await q.writeFile(p,L,"utf-8")}let b=`## Self-Actualization Report

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

${s.recommendations.length>0?s.recommendations.map(y=>`- ${y}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return p&&(b+=`
### Session Recorded

Meditation session documented at: \`${ge.basename(p)}\``),new g.LanguageModelToolResult([new g.LanguageModelTextPart(b)])}};async function Wt(){let e=g.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ge.join(t,"config","user-profile.json");try{if(await q.pathExists(n))return await q.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function Ga(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function Ka(e){e.subscriptions.push(g.lm.registerTool("alex_synapse_health",new jn)),e.subscriptions.push(g.lm.registerTool("alex_memory_search",new _n)),e.subscriptions.push(g.lm.registerTool("alex_architecture_status",new Gn)),e.subscriptions.push(g.lm.registerTool("alex_mcp_recommendations",new Kn)),e.subscriptions.push(g.lm.registerTool("alex_user_profile",new Un)),e.subscriptions.push(g.lm.registerTool("alex_self_actualization",new zn)),console.log("Alex Language Model Tools registered")}var Yc=[/(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)/i,/(?:this works because|the reason is|what fixed it|solved by|resolved by)/i,/(?:always remember to|never forget to|make sure to|be careful to)/i,/(?:debugging tip|performance tip|security tip)/i],Xc=["pattern","anti-pattern","best practice","gotcha","pitfall","workaround","solution","fix","resolved","debugging","performance","optimization","security","architecture"];function Qc(e){let t=e.toLowerCase(),n=0;for(let a of Yc)a.test(e)&&n++;let o=[];for(let a of Xc)t.includes(a)&&o.push(a);let i=n*.3+o.length*.1;return{detected:i>=.3||n>=1,confidence:Math.min(i,1),keywords:o}}async function Zc(e,t,n){try{let o=e.split(/[.!?]/)[0].trim(),i=o.length>10&&o.length<100?o:`Auto-captured insight - ${new Date().toISOString().split("T")[0]}`,a="general";t.includes("debugging")?a="debugging":t.includes("performance")||t.includes("optimization")?a="performance":t.includes("security")?a="security":t.includes("architecture")?a="architecture":(t.includes("pattern")||t.includes("anti-pattern"))&&(a="patterns"),await Nn(i,e,a,t,n,"Auto-detected from conversation",e),at(),console.log(`[Unconscious] Auto-saved insight: ${i}`)}catch(o){console.warn("[Unconscious] Failed to auto-save insight:",o)}}var kt=[],el=5;function tl(e,t){kt.push(e),kt.length>el&&kt.shift();let n=kt.join(" "),o=Qc(n);o.detected&&o.confidence>=.5&&(Zc(e,o.keywords,t),kt=[])}var nl=[/(?:still (?:not working|broken|failing|doesn't work)|keeps? (?:failing|breaking|crashing))/i,/(?:tried everything|nothing works|no idea|completely lost|so confused)/i,/(?:why (?:won't|doesn't|isn't)|what am i (?:doing wrong|missing))/i,/(?:ugh|argh|damn|dammit|frustrated|annoying|annoyed|stuck)/i,/(?:this is (?:impossible|ridiculous|insane|driving me crazy))/i,/(?:been (?:at this|trying|working on this) for (?:hours|days|forever))/i,/(?:same (?:error|problem|issue) (?:again|still))/i,/(?:!{2,}|\?{3,})/],ol=[/(?:it works|finally|got it|figured it out|solved it|fixed it)/i,/(?:that (?:worked|fixed it|did it)|now it (?:works|runs))/i,/(?:thank(?:s| you)|perfect|awesome|great|amazing|brilliant)/i,/(?:makes sense now|i understand|clicked for me)/i,/(?:shipped|deployed|released|launched|published)/i,/(?:passed|all (?:tests|green)|build succeeded)/i],Pe=0,Ua=0,il=3e5;function al(e){let t=Date.now();t-Ua>il&&(Pe=Math.max(0,Pe-1)),Ua=t;let n=0;for(let a of nl)a.test(e)&&n++;let o=0;for(let a of ol)a.test(e)&&o++;n>0&&(Pe=Math.min(3,Pe+n)),o>0&&(Pe=Math.max(0,Pe-2));let i="none";return Pe>=3?i="high":Pe>=2?i="moderate":Pe>=1&&(i="mild"),{frustration:i,success:o>0,encouragementNeeded:i==="moderate"||i==="high",celebrationNeeded:o>=2||o>0&&Pe>0}}function sl(e){if(e.celebrationNeeded){let t=["\u{1F389} That's a win! Nice work.","\u2728 You got it! Persistence pays off.","\u{1F4AA} Solved! That was a tricky one.","\u{1F680} Success! You worked through it."];return t[Math.floor(Math.random()*t.length)]}if(e.encouragementNeeded){let t=["I can see this is frustrating. Let's take a step back and approach it differently.","Tough problem. What if we break it down into smaller pieces?","You're closer than it feels. What's the last thing that *did* work?","Debugging is hard. Let's be systematic - what have we ruled out?"];return t[Math.floor(Math.random()*t.length)]}return null}var rl=async(e,t,n,o)=>e.command==="meditate"?await cl(e,t,n,o):e.command==="dream"?await ll(e,t,n,o):e.command==="learn"?await dl(e,t,n,o):e.command==="status"?await ul(e,t,n,o):e.command==="azure"?await ml(e,t,n,o):e.command==="m365"?await pl(e,t,n,o):e.command==="profile"?await gl(e,t,n,o):e.command==="selfactualize"?await vl(e,t,n,o):e.command==="knowledge"?await bl(e,t,n,o):e.command==="saveinsight"?await Sl(e,t,n,o):e.command==="promote"?await kl(e,t,n,o):e.command==="knowledgestatus"?await Pl(e,t,n,o):e.command==="sync"?await xl(e,t,n,o):e.command==="push"?await Cl(e,t,n,o):e.command==="pull"?await Tl(e,t,n,o):e.command==="docs"?await Il(e,t,n,o):hl(e.prompt)&&wl(t)?await yl(e,t,n,o):await fl(e,t,n,o);async function cl(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function ll(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function dl(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function ul(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=dn(),a=i.isValid&&i.rootPath?await un(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function ml(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function pl(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function gl(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Wt();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function fl(e,t,n,o){let i=z.workspace.workspaceFolders,a=i?za.basename(i[0].uri.fsPath):void 0;tl(e.prompt,a);let s=al(e.prompt),r=sl(s),c=await Wt(),d=t.history.filter(m=>m instanceof z.ChatRequestTurn||m instanceof z.ChatResponseTurn),l="";if(c){let m=c.nickname||c.name;l=`
## User Profile (Use this to personalize responses)
${m?`- **User's name**: ${m} (always address them by name)`:"- User has not shared their name yet"}
${c.role?`- **Role**: ${c.role}`:""}
${c.experienceLevel?`- **Experience**: ${c.experienceLevel}`:""}
${c.formality?`- **Communication style**: ${c.formality}`:"- Communication style: balanced"}
${c.detailLevel?`- **Detail preference**: ${c.detailLevel}`:""}
${c.explanationStyle?`- **Explanation style**: ${c.explanationStyle}`:""}
${c.humor?`- **Humor**: ${c.humor}`:""}
${c.proactiveSuggestions?`- **Proactive suggestions**: ${c.proactiveSuggestions}`:""}
${c.primaryTechnologies?.length?`- **Technologies**: ${c.primaryTechnologies.join(", ")}`:""}
${c.learningGoals?.length?`- **Learning goals**: ${c.learningGoals.join(", ")}`:""}
${c.expertiseAreas?.length?`- **Expertise areas**: ${c.expertiseAreas.join(", ")}`:""}
`}else l=`
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;let u=`You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let m=await z.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(m.length===0){let y=Ga(c);return n.markdown(`${y}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let p=m[0],w=[z.LanguageModelChatMessage.User(u),z.LanguageModelChatMessage.User(e.prompt)],b=await p.sendRequest(w,{},o);for await(let y of b.text)n.markdown(y);r&&n.markdown(`

---
*${r}*`)}catch(m){if(m instanceof z.LanguageModelError)console.error("Language model error:",m.message,m.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw m}return{metadata:{command:"general"}}}function hl(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function wl(e){return e.history.length===0||e.history.length<=2}async function yl(e,t,n,o){let i=await Wt(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let c=await yt();c.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):c.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=dn(),r=s.isValid&&s.rootPath?await un(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function vl(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function bl(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

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

`),{metadata:{command:"knowledge"}};n.progress(`\u{1F50D} Searching global knowledge for: ${e.prompt}`);try{let i=await St(e.prompt,{limit:5});if(i.length===0)n.markdown(`## \u{1F310} No Global Knowledge Found

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
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function Sl(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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

`),{metadata:{command:"saveinsight"}}}async function kl(e,t,n,o){n.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

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
`);let i=z.workspace.workspaceFolders;if(i){let a=new z.RelativePattern(i[0],".github/domain-knowledge/DK-*.md"),s=await z.workspace.findFiles(a);if(s.length>0){n.markdown(`Found ${s.length} knowledge files:
`);for(let r of s){let c=z.workspace.asRelativePath(r);n.markdown(`- \`${c}\`
`)}}else n.markdown(`*No DK-*.md files found in this project.*
`)}return{metadata:{command:"promote"}}}async function Pl(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await On(),a=await Ln();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

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
\`${Rn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function xl(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await ot(),a=await it();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),a&&n.markdown(`**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function Cl(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await vt(),a=await it();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),a&&n.markdown(`
**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function Tl(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await bt();i.success?n.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${i.message}
`):n.markdown(`## \u274C Pull Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pulling: ${i}`)}return{metadata:{command:"pull"}}}async function Il(e,t,n,o){return n.markdown(`## \u{1F4DA} Alex Documentation

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

`),await z.commands.executeCommand("alex.openDocs"),n.markdown(`
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`),{metadata:{command:"docs"}}}var El={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function qa(e){let t=z.chat.createChatParticipant("alex.cognitive",rl);return t.iconPath=z.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=El,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===z.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var qn=!1;async function Pt(e,t){if(qn){F.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}qn=!0;try{return await t()}finally{qn=!1}}function $l(e){console.log("Alex Cognitive Architecture is now active!"),Al(e),qa(e),Ka(e),ja(e),Aa(e),Fa(e),re().then(()=>{Da().catch(l=>{console.warn("Failed to register current project:",l)})}).catch(l=>{console.warn("Failed to initialize global knowledge directories:",l)});let t=F.commands.registerCommand("alex.initialize",async()=>{await Pt("Initialize",()=>Ji(e))}),n=F.commands.registerCommand("alex.reset",async()=>{await Pt("Reset",()=>mn(e))}),o=F.commands.registerCommand("alex.dream",async()=>{await Pt("Dream Protocol",()=>Qi(e))}),i=F.commands.registerCommand("alex.upgrade",async()=>{await Pt("Upgrade",()=>na(e))}),a=F.commands.registerCommand("alex.selfActualize",async()=>{await Pt("Self-Actualization",()=>_a(e))}),s=F.commands.registerCommand("alex.syncKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let l=await ot();if(l.success){let u=await it(),m=u?"View Gist":void 0;await F.window.showInformationMessage(`\u2705 ${l.message}`,...m?[m]:[])==="View Gist"&&u&&F.env.openExternal(F.Uri.parse(u))}else F.window.showErrorMessage(`\u274C ${l.message}`)})}),r=F.commands.registerCommand("alex.pushKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let l=await vt();l.success?F.window.showInformationMessage(`\u2705 ${l.message}`):F.window.showErrorMessage(`\u274C ${l.message}`)})}),c=F.commands.registerCommand("alex.pullKnowledge",async()=>{await F.window.withProgress({location:F.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let l=await bt();l.success?F.window.showInformationMessage(`\u2705 ${l.message}`):F.window.showErrorMessage(`\u274C ${l.message}`)})}),d=F.commands.registerCommand("alex.openDocs",async()=>{let l=F.Uri.joinPath(e.extensionUri,"alex_docs","README.md");try{await F.commands.executeCommand("markdown.showPreview",l)}catch{let u=await F.workspace.openTextDocument(l);await F.window.showTextDocument(u)}});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a),e.subscriptions.push(s),e.subscriptions.push(r),e.subscriptions.push(c),e.subscriptions.push(d)}async function Al(e){let t="alex.lastKnownVersion",n=F.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[a]=i.split(".").map(Number),[s]=o.split(".").map(Number),r=s>a,c="Run Upgrade",d="View Changelog",l="Dismiss",u=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await F.window.showInformationMessage(u,c,d,l);if(m===c)F.commands.executeCommand("alex.upgrade");else if(m===d){let p=F.Uri.joinPath(n.extensionUri,"CHANGELOG.md");F.commands.executeCommand("markdown.showPreview",p)}}function Fl(){}0&&(module.exports={activate,deactivate});
