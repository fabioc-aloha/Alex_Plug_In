"use strict";var Za=Object.create;var It=Object.defineProperty;var es=Object.getOwnPropertyDescriptor;var ts=Object.getOwnPropertyNames;var ns=Object.getPrototypeOf,os=Object.prototype.hasOwnProperty;var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),is=(e,t)=>{for(var n in t)It(e,n,{get:t[n],enumerable:!0})},Zn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ts(t))!os.call(e,i)&&i!==n&&It(e,i,{get:()=>t[i],enumerable:!(o=es(t,i))||o.enumerable});return e};var D=(e,t,n)=>(n=e!=null?Za(ns(e)):{},Zn(t||!e||!e.__esModule?It(n,"default",{value:e,enumerable:!0}):n,e)),as=e=>Zn(It({},"__esModule",{value:!0}),e);var oe=x(en=>{"use strict";en.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};en.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var to=x((ql,eo)=>{var Ne=require("constants"),ss=process.cwd,$t=null,rs=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return $t||($t=ss.call(process)),$t};try{process.cwd()}catch{}typeof process.chdir=="function"&&(tn=process.chdir,process.chdir=function(e){$t=null,tn.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,tn));var tn;eo.exports=cs;function cs(e){Ne.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=c(e.statSync),e.fstatSync=c(e.fstatSync),e.lstatSync=c(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(l,d,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(l,d,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),rs==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(l){function d(m,p,h){var y=Date.now(),w=0;l(m,p,function k($){if($&&($.code==="EACCES"||$.code==="EPERM"||$.code==="EBUSY")&&Date.now()-y<6e4){setTimeout(function(){e.stat(p,function(A,P){A&&A.code==="ENOENT"?l(m,p,k):h($)})},w),w<100&&(w+=10);return}h&&h($)})}return Object.setPrototypeOf&&Object.setPrototypeOf(d,l),d})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(l){function d(m,p,h,y,w,k){var $;if(k&&typeof k=="function"){var A=0;$=function(P,L,W){if(P&&P.code==="EAGAIN"&&A<10)return A++,l.call(e,m,p,h,y,w,$);k.apply(this,arguments)}}return l.call(e,m,p,h,y,w,$)}return Object.setPrototypeOf&&Object.setPrototypeOf(d,l),d})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(l){return function(d,m,p,h,y){for(var w=0;;)try{return l.call(e,d,m,p,h,y)}catch(k){if(k.code==="EAGAIN"&&w<10){w++;continue}throw k}}})(e.readSync);function t(l){l.lchmod=function(d,m,p){l.open(d,Ne.O_WRONLY|Ne.O_SYMLINK,m,function(h,y){if(h){p&&p(h);return}l.fchmod(y,m,function(w){l.close(y,function(k){p&&p(w||k)})})})},l.lchmodSync=function(d,m){var p=l.openSync(d,Ne.O_WRONLY|Ne.O_SYMLINK,m),h=!0,y;try{y=l.fchmodSync(p,m),h=!1}finally{if(h)try{l.closeSync(p)}catch{}else l.closeSync(p)}return y}}function n(l){Ne.hasOwnProperty("O_SYMLINK")&&l.futimes?(l.lutimes=function(d,m,p,h){l.open(d,Ne.O_SYMLINK,function(y,w){if(y){h&&h(y);return}l.futimes(w,m,p,function(k){l.close(w,function($){h&&h(k||$)})})})},l.lutimesSync=function(d,m,p){var h=l.openSync(d,Ne.O_SYMLINK),y,w=!0;try{y=l.futimesSync(h,m,p),w=!1}finally{if(w)try{l.closeSync(h)}catch{}else l.closeSync(h)}return y}):l.futimes&&(l.lutimes=function(d,m,p,h){h&&process.nextTick(h)},l.lutimesSync=function(){})}function o(l){return l&&function(d,m,p){return l.call(e,d,m,function(h){u(h)&&(h=null),p&&p.apply(this,arguments)})}}function i(l){return l&&function(d,m){try{return l.call(e,d,m)}catch(p){if(!u(p))throw p}}}function a(l){return l&&function(d,m,p,h){return l.call(e,d,m,p,function(y){u(y)&&(y=null),h&&h.apply(this,arguments)})}}function s(l){return l&&function(d,m,p){try{return l.call(e,d,m,p)}catch(h){if(!u(h))throw h}}}function r(l){return l&&function(d,m,p){typeof m=="function"&&(p=m,m=null);function h(y,w){w&&(w.uid<0&&(w.uid+=4294967296),w.gid<0&&(w.gid+=4294967296)),p&&p.apply(this,arguments)}return m?l.call(e,d,m,h):l.call(e,d,h)}}function c(l){return l&&function(d,m){var p=m?l.call(e,d,m):l.call(e,d);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function u(l){if(!l||l.code==="ENOSYS")return!0;var d=!process.getuid||process.getuid()!==0;return!!(d&&(l.code==="EINVAL"||l.code==="EPERM"))}}});var io=x((Hl,oo)=>{var no=require("stream").Stream;oo.exports=ls;function ls(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);no.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),r=0,c=s.length;r<c;r++){var u=s[r];this[u]=i[u]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(l,d){if(l){a.emit("error",l),a.readable=!1;return}a.fd=d,a.emit("open",d),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);no.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,r=a.length;s<r;s++){var c=a[s];this[c]=i[c]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var so=x((Wl,ao)=>{"use strict";ao.exports=us;var ds=Object.getPrototypeOf||function(e){return e.__proto__};function us(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:ds(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var Oe=x((Vl,an)=>{var J=require("fs"),ms=to(),ps=io(),gs=so(),Ft=require("util"),le,Mt;typeof Symbol=="function"&&typeof Symbol.for=="function"?(le=Symbol.for("graceful-fs.queue"),Mt=Symbol.for("graceful-fs.previous")):(le="___graceful-fs.queue",Mt="___graceful-fs.previous");function fs(){}function lo(e,t){Object.defineProperty(e,le,{get:function(){return t}})}var ze=fs;Ft.debuglog?ze=Ft.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(ze=function(){var e=Ft.format.apply(Ft,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});J[le]||(ro=global[le]||[],lo(J,ro),J.close=(function(e){function t(n,o){return e.call(J,n,function(i){i||co(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Mt,{value:e}),t})(J.close),J.closeSync=(function(e){function t(n){e.apply(J,arguments),co()}return Object.defineProperty(t,Mt,{value:e}),t})(J.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){ze(J[le]),require("assert").equal(J[le].length,0)}));var ro;global[le]||lo(global,J[le]);an.exports=nn(gs(J));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!J.__patched&&(an.exports=nn(J),J.__patched=!0);function nn(e){ms(e),e.gracefulify=nn,e.createReadStream=L,e.createWriteStream=W;var t=e.readFile;e.readFile=n;function n(b,C,T){return typeof C=="function"&&(T=C,C=null),N(b,C,T);function N(Z,_,O,q){return t(Z,_,function(j){j&&(j.code==="EMFILE"||j.code==="ENFILE")?Ye([N,[Z,_,O],j,q||Date.now(),Date.now()]):typeof O=="function"&&O.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(b,C,T,N){return typeof T=="function"&&(N=T,T=null),Z(b,C,T,N);function Z(_,O,q,j,Q){return o(_,O,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([Z,[_,O,q,j],G,Q||Date.now(),Date.now()]):typeof j=="function"&&j.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(b,C,T,N){return typeof T=="function"&&(N=T,T=null),Z(b,C,T,N);function Z(_,O,q,j,Q){return a(_,O,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([Z,[_,O,q,j],G,Q||Date.now(),Date.now()]):typeof j=="function"&&j.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=c);function c(b,C,T,N){return typeof T=="function"&&(N=T,T=0),Z(b,C,T,N);function Z(_,O,q,j,Q){return r(_,O,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([Z,[_,O,q,j],G,Q||Date.now(),Date.now()]):typeof j=="function"&&j.apply(this,arguments)})}}var u=e.readdir;e.readdir=d;var l=/^v[0-5]\./;function d(b,C,T){typeof C=="function"&&(T=C,C=null);var N=l.test(process.version)?function(O,q,j,Q){return u(O,Z(O,q,j,Q))}:function(O,q,j,Q){return u(O,q,Z(O,q,j,Q))};return N(b,C,T);function Z(_,O,q,j){return function(Q,G){Q&&(Q.code==="EMFILE"||Q.code==="ENFILE")?Ye([N,[_,O,q],Q,j||Date.now(),Date.now()]):(G&&G.sort&&G.sort(),typeof q=="function"&&q.call(this,Q,G))}}}if(process.version.substr(0,4)==="v0.8"){var m=ps(e);k=m.ReadStream,A=m.WriteStream}var p=e.ReadStream;p&&(k.prototype=Object.create(p.prototype),k.prototype.open=$);var h=e.WriteStream;h&&(A.prototype=Object.create(h.prototype),A.prototype.open=P),Object.defineProperty(e,"ReadStream",{get:function(){return k},set:function(b){k=b},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return A},set:function(b){A=b},enumerable:!0,configurable:!0});var y=k;Object.defineProperty(e,"FileReadStream",{get:function(){return y},set:function(b){y=b},enumerable:!0,configurable:!0});var w=A;Object.defineProperty(e,"FileWriteStream",{get:function(){return w},set:function(b){w=b},enumerable:!0,configurable:!0});function k(b,C){return this instanceof k?(p.apply(this,arguments),this):k.apply(Object.create(k.prototype),arguments)}function $(){var b=this;te(b.path,b.flags,b.mode,function(C,T){C?(b.autoClose&&b.destroy(),b.emit("error",C)):(b.fd=T,b.emit("open",T),b.read())})}function A(b,C){return this instanceof A?(h.apply(this,arguments),this):A.apply(Object.create(A.prototype),arguments)}function P(){var b=this;te(b.path,b.flags,b.mode,function(C,T){C?(b.destroy(),b.emit("error",C)):(b.fd=T,b.emit("open",T))})}function L(b,C){return new e.ReadStream(b,C)}function W(b,C){return new e.WriteStream(b,C)}var X=e.open;e.open=te;function te(b,C,T,N){return typeof T=="function"&&(N=T,T=null),Z(b,C,T,N);function Z(_,O,q,j,Q){return X(_,O,q,function(G,Qt){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([Z,[_,O,q,j],G,Q||Date.now(),Date.now()]):typeof j=="function"&&j.apply(this,arguments)})}}return e}function Ye(e){ze("ENQUEUE",e[0].name,e[1]),J[le].push(e),on()}var At;function co(){for(var e=Date.now(),t=0;t<J[le].length;++t)J[le][t].length>2&&(J[le][t][3]=e,J[le][t][4]=e);on()}function on(){if(clearTimeout(At),At=void 0,J[le].length!==0){var e=J[le].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)ze("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){ze("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var r=Date.now()-a,c=Math.max(a-i,1),u=Math.min(c*1.2,100);r>=u?(ze("RETRY",t.name,n),t.apply(null,n.concat([i]))):J[le].push(e)}At===void 0&&(At=setTimeout(on,0))}}});var pe=x(Ie=>{"use strict";var uo=oe().fromCallback,me=Oe(),hs=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof me[e]=="function");Object.assign(Ie,me);hs.forEach(e=>{Ie[e]=uo(me[e])});Ie.exists=function(e,t){return typeof t=="function"?me.exists(e,t):new Promise(n=>me.exists(e,n))};Ie.read=function(e,t,n,o,i,a){return typeof a=="function"?me.read(e,t,n,o,i,a):new Promise((s,r)=>{me.read(e,t,n,o,i,(c,u,l)=>{if(c)return r(c);s({bytesRead:u,buffer:l})})})};Ie.write=function(e,t,...n){return typeof n[n.length-1]=="function"?me.write(e,t,...n):new Promise((o,i)=>{me.write(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffer:r})})})};Ie.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?me.readv(e,t,...n):new Promise((o,i)=>{me.readv(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesRead:s,buffers:r})})})};Ie.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?me.writev(e,t,...n):new Promise((o,i)=>{me.writev(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffers:r})})})};typeof me.realpath.native=="function"?Ie.realpath.native=uo(me.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var po=x((Jl,mo)=>{"use strict";var ws=require("path");mo.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(ws.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var wo=x((Yl,sn)=>{"use strict";var go=pe(),{checkPath:fo}=po(),ho=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};sn.exports.makeDir=async(e,t)=>(fo(e),go.mkdir(e,{mode:ho(t),recursive:!0}));sn.exports.makeDirSync=(e,t)=>(fo(e),go.mkdirSync(e,{mode:ho(t),recursive:!0}))});var Se=x((Xl,yo)=>{"use strict";var ys=oe().fromPromise,{makeDir:vs,makeDirSync:rn}=wo(),cn=ys(vs);yo.exports={mkdirs:cn,mkdirsSync:rn,mkdirp:cn,mkdirpSync:rn,ensureDir:cn,ensureDirSync:rn}});var je=x((Ql,bo)=>{"use strict";var bs=oe().fromPromise,vo=pe();function Ss(e){return vo.access(e).then(()=>!0).catch(()=>!1)}bo.exports={pathExists:bs(Ss),pathExistsSync:vo.existsSync}});var ln=x((Zl,So)=>{"use strict";var Xe=pe(),ks=oe().fromPromise;async function Ps(e,t,n){let o=await Xe.open(e,"r+"),i=null;try{await Xe.futimes(o,t,n)}finally{try{await Xe.close(o)}catch(a){i=a}}if(i)throw i}function xs(e,t,n){let o=Xe.openSync(e,"r+");return Xe.futimesSync(o,t,n),Xe.closeSync(o)}So.exports={utimesMillis:ks(Ps),utimesMillisSync:xs}});var Ue=x((ed,Co)=>{"use strict";var Qe=pe(),ie=require("path"),ko=oe().fromPromise;function Cs(e,t,n){let o=n.dereference?i=>Qe.stat(i,{bigint:!0}):i=>Qe.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function Ts(e,t,n){let o,i=n.dereference?s=>Qe.statSync(s,{bigint:!0}):s=>Qe.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function Es(e,t,n,o){let{srcStat:i,destStat:a}=await Cs(e,t,o);if(a){if(ut(i,a)){let s=ie.basename(e),r=ie.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&dn(e,t))throw new Error(Rt(e,t,n));return{srcStat:i,destStat:a}}function Is(e,t,n,o){let{srcStat:i,destStat:a}=Ts(e,t,o);if(a){if(ut(i,a)){let s=ie.basename(e),r=ie.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&dn(e,t))throw new Error(Rt(e,t,n));return{srcStat:i,destStat:a}}async function Po(e,t,n,o){let i=ie.resolve(ie.dirname(e)),a=ie.resolve(ie.dirname(n));if(a===i||a===ie.parse(a).root)return;let s;try{s=await Qe.stat(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(ut(t,s))throw new Error(Rt(e,n,o));return Po(e,t,a,o)}function xo(e,t,n,o){let i=ie.resolve(ie.dirname(e)),a=ie.resolve(ie.dirname(n));if(a===i||a===ie.parse(a).root)return;let s;try{s=Qe.statSync(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(ut(t,s))throw new Error(Rt(e,n,o));return xo(e,t,a,o)}function ut(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function dn(e,t){let n=ie.resolve(e).split(ie.sep).filter(i=>i),o=ie.resolve(t).split(ie.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function Rt(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}Co.exports={checkPaths:ko(Es),checkPathsSync:Is,checkParentPaths:ko(Po),checkParentPathsSync:xo,isSrcSubdir:dn,areIdentical:ut}});var Eo=x((td,To)=>{"use strict";async function $s(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}To.exports={asyncIteratorConcurrentProcess:$s}});var Mo=x((nd,Ao)=>{"use strict";var de=pe(),mt=require("path"),{mkdirs:Fs}=Se(),{pathExists:As}=je(),{utimesMillis:Ms}=ln(),pt=Ue(),{asyncIteratorConcurrentProcess:Rs}=Eo();async function Ds(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await pt.checkPaths(e,t,"copy",n);if(await pt.checkParentPaths(e,o,t,"copy"),!await $o(e,t,n))return;let s=mt.dirname(t);await As(s)||await Fs(s),await Fo(i,e,t,n)}async function $o(e,t,n){return n.filter?n.filter(e,t):!0}async function Fo(e,t,n,o){let a=await(o.dereference?de.stat:de.lstat)(t);if(a.isDirectory())return js(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Ls(a,e,t,n,o);if(a.isSymbolicLink())return _s(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function Ls(e,t,n,o,i){if(!t)return Io(e,n,o,i);if(i.overwrite)return await de.unlink(o),Io(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function Io(e,t,n,o){if(await de.copyFile(t,n),o.preserveTimestamps){Ns(e.mode)&&await Os(n,e.mode);let i=await de.stat(t);await Ms(n,i.atime,i.mtime)}return de.chmod(n,e.mode)}function Ns(e){return(e&128)===0}function Os(e,t){return de.chmod(e,t|128)}async function js(e,t,n,o,i){t||await de.mkdir(o),await Rs(await de.opendir(n),async a=>{let s=mt.join(n,a.name),r=mt.join(o,a.name);if(await $o(s,r,i)){let{destStat:u}=await pt.checkPaths(s,r,"copy",i);await Fo(u,s,r,i)}}),t||await de.chmod(o,e.mode)}async function _s(e,t,n,o){let i=await de.readlink(t);if(o.dereference&&(i=mt.resolve(process.cwd(),i)),!e)return de.symlink(i,n);let a=null;try{a=await de.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return de.symlink(i,n);throw s}if(o.dereference&&(a=mt.resolve(process.cwd(),a)),i!==a){if(pt.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(pt.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await de.unlink(n),de.symlink(i,n)}Ao.exports=Ds});var Oo=x((od,No)=>{"use strict";var ge=Oe(),gt=require("path"),Gs=Se().mkdirsSync,Ks=ln().utimesMillisSync,ft=Ue();function zs(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=ft.checkPathsSync(e,t,"copy",n);if(ft.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=gt.dirname(t);return ge.existsSync(a)||Gs(a),Ro(i,e,t,n)}function Ro(e,t,n,o){let a=(o.dereference?ge.statSync:ge.lstatSync)(t);if(a.isDirectory())return Js(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Us(a,e,t,n,o);if(a.isSymbolicLink())return Qs(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Us(e,t,n,o,i){return t?qs(e,n,o,i):Do(e,n,o,i)}function qs(e,t,n,o){if(o.overwrite)return ge.unlinkSync(n),Do(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Do(e,t,n,o){return ge.copyFileSync(t,n),o.preserveTimestamps&&Hs(e.mode,t,n),un(n,e.mode)}function Hs(e,t,n){return Ws(e)&&Vs(n,e),Bs(t,n)}function Ws(e){return(e&128)===0}function Vs(e,t){return un(e,t|128)}function un(e,t){return ge.chmodSync(e,t)}function Bs(e,t){let n=ge.statSync(e);return Ks(t,n.atime,n.mtime)}function Js(e,t,n,o,i){return t?Lo(n,o,i):Ys(e.mode,n,o,i)}function Ys(e,t,n,o){return ge.mkdirSync(n),Lo(t,n,o),un(n,e)}function Lo(e,t,n){let o=ge.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Xs(i.name,e,t,n)}finally{o.closeSync()}}function Xs(e,t,n,o){let i=gt.join(t,e),a=gt.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=ft.checkPathsSync(i,a,"copy",o);return Ro(s,i,a,o)}function Qs(e,t,n,o){let i=ge.readlinkSync(t);if(o.dereference&&(i=gt.resolve(process.cwd(),i)),e){let a;try{a=ge.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return ge.symlinkSync(i,n);throw s}if(o.dereference&&(a=gt.resolve(process.cwd(),a)),i!==a){if(ft.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(ft.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Zs(i,n)}else return ge.symlinkSync(i,n)}function Zs(e,t){return ge.unlinkSync(t),ge.symlinkSync(e,t)}No.exports=zs});var Dt=x((id,jo)=>{"use strict";var er=oe().fromPromise;jo.exports={copy:er(Mo()),copySync:Oo()}});var ht=x((ad,Go)=>{"use strict";var _o=Oe(),tr=oe().fromCallback;function nr(e,t){_o.rm(e,{recursive:!0,force:!0},t)}function or(e){_o.rmSync(e,{recursive:!0,force:!0})}Go.exports={remove:tr(nr),removeSync:or}});var Bo=x((sd,Vo)=>{"use strict";var ir=oe().fromPromise,Uo=pe(),qo=require("path"),Ho=Se(),Wo=ht(),Ko=ir(async function(t){let n;try{n=await Uo.readdir(t)}catch{return Ho.mkdirs(t)}return Promise.all(n.map(o=>Wo.remove(qo.join(t,o))))});function zo(e){let t;try{t=Uo.readdirSync(e)}catch{return Ho.mkdirsSync(e)}t.forEach(n=>{n=qo.join(e,n),Wo.removeSync(n)})}Vo.exports={emptyDirSync:zo,emptydirSync:zo,emptyDir:Ko,emptydir:Ko}});var Qo=x((rd,Xo)=>{"use strict";var ar=oe().fromPromise,Jo=require("path"),$e=pe(),Yo=Se();async function sr(e){let t;try{t=await $e.stat(e)}catch{}if(t&&t.isFile())return;let n=Jo.dirname(e),o=null;try{o=await $e.stat(n)}catch(i){if(i.code==="ENOENT"){await Yo.mkdirs(n),await $e.writeFile(e,"");return}else throw i}o.isDirectory()?await $e.writeFile(e,""):await $e.readdir(n)}function rr(e){let t;try{t=$e.statSync(e)}catch{}if(t&&t.isFile())return;let n=Jo.dirname(e);try{$e.statSync(n).isDirectory()||$e.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")Yo.mkdirsSync(n);else throw o}$e.writeFileSync(e,"")}Xo.exports={createFile:ar(sr),createFileSync:rr}});var oi=x((cd,ni)=>{"use strict";var cr=oe().fromPromise,Zo=require("path"),_e=pe(),ei=Se(),{pathExists:lr}=je(),{areIdentical:ti}=Ue();async function dr(e,t){let n;try{n=await _e.lstat(t)}catch{}let o;try{o=await _e.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&ti(o,n))return;let i=Zo.dirname(t);await lr(i)||await ei.mkdirs(i),await _e.link(e,t)}function ur(e,t){let n;try{n=_e.lstatSync(t)}catch{}try{let a=_e.lstatSync(e);if(n&&ti(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=Zo.dirname(t);return _e.existsSync(o)||ei.mkdirsSync(o),_e.linkSync(e,t)}ni.exports={createLink:cr(dr),createLinkSync:ur}});var ai=x((ld,ii)=>{"use strict";var Ge=require("path"),wt=pe(),{pathExists:mr}=je(),pr=oe().fromPromise;async function gr(e,t){if(Ge.isAbsolute(e)){try{await wt.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=Ge.dirname(t),o=Ge.join(n,e);if(await mr(o))return{toCwd:o,toDst:e};try{await wt.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:Ge.relative(n,e)}}function fr(e,t){if(Ge.isAbsolute(e)){if(!wt.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=Ge.dirname(t),o=Ge.join(n,e);if(wt.existsSync(o))return{toCwd:o,toDst:e};if(!wt.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:Ge.relative(n,e)}}ii.exports={symlinkPaths:pr(gr),symlinkPathsSync:fr}});var ci=x((dd,ri)=>{"use strict";var si=pe(),hr=oe().fromPromise;async function wr(e,t){if(t)return t;let n;try{n=await si.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function yr(e,t){if(t)return t;let n;try{n=si.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}ri.exports={symlinkType:hr(wr),symlinkTypeSync:yr}});var mi=x((ud,ui)=>{"use strict";var vr=oe().fromPromise,li=require("path"),xe=pe(),{mkdirs:br,mkdirsSync:Sr}=Se(),{symlinkPaths:kr,symlinkPathsSync:Pr}=ai(),{symlinkType:xr,symlinkTypeSync:Cr}=ci(),{pathExists:Tr}=je(),{areIdentical:di}=Ue();async function Er(e,t,n){let o;try{o=await xe.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,c]=await Promise.all([xe.stat(e),xe.stat(t)]);if(di(r,c))return}let i=await kr(e,t);e=i.toDst;let a=await xr(i.toCwd,n),s=li.dirname(t);return await Tr(s)||await br(s),xe.symlink(e,t,a)}function Ir(e,t,n){let o;try{o=xe.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=xe.statSync(e),c=xe.statSync(t);if(di(r,c))return}let i=Pr(e,t);e=i.toDst,n=Cr(i.toCwd,n);let a=li.dirname(t);return xe.existsSync(a)||Sr(a),xe.symlinkSync(e,t,n)}ui.exports={createSymlink:vr(Er),createSymlinkSync:Ir}});var bi=x((md,vi)=>{"use strict";var{createFile:pi,createFileSync:gi}=Qo(),{createLink:fi,createLinkSync:hi}=oi(),{createSymlink:wi,createSymlinkSync:yi}=mi();vi.exports={createFile:pi,createFileSync:gi,ensureFile:pi,ensureFileSync:gi,createLink:fi,createLinkSync:hi,ensureLink:fi,ensureLinkSync:hi,createSymlink:wi,createSymlinkSync:yi,ensureSymlink:wi,ensureSymlinkSync:yi}});var Lt=x((pd,Si)=>{function $r(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function Fr(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}Si.exports={stringify:$r,stripBom:Fr}});var Ci=x((gd,xi)=>{var Ze;try{Ze=Oe()}catch{Ze=require("fs")}var Nt=oe(),{stringify:ki,stripBom:Pi}=Lt();async function Ar(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Ze,o="throws"in t?t.throws:!0,i=await Nt.fromCallback(n.readFile)(e,t);i=Pi(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var Mr=Nt.fromPromise(Ar);function Rr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Ze,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=Pi(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function Dr(e,t,n={}){let o=n.fs||Ze,i=ki(t,n);await Nt.fromCallback(o.writeFile)(e,i,n)}var Lr=Nt.fromPromise(Dr);function Nr(e,t,n={}){let o=n.fs||Ze,i=ki(t,n);return o.writeFileSync(e,i,n)}xi.exports={readFile:Mr,readFileSync:Rr,writeFile:Lr,writeFileSync:Nr}});var Ei=x((fd,Ti)=>{"use strict";var Ot=Ci();Ti.exports={readJson:Ot.readFile,readJsonSync:Ot.readFileSync,writeJson:Ot.writeFile,writeJsonSync:Ot.writeFileSync}});var jt=x((hd,Fi)=>{"use strict";var Or=oe().fromPromise,mn=pe(),Ii=require("path"),$i=Se(),jr=je().pathExists;async function _r(e,t,n="utf-8"){let o=Ii.dirname(e);return await jr(o)||await $i.mkdirs(o),mn.writeFile(e,t,n)}function Gr(e,...t){let n=Ii.dirname(e);mn.existsSync(n)||$i.mkdirsSync(n),mn.writeFileSync(e,...t)}Fi.exports={outputFile:Or(_r),outputFileSync:Gr}});var Mi=x((wd,Ai)=>{"use strict";var{stringify:Kr}=Lt(),{outputFile:zr}=jt();async function Ur(e,t,n={}){let o=Kr(t,n);await zr(e,o,n)}Ai.exports=Ur});var Di=x((yd,Ri)=>{"use strict";var{stringify:qr}=Lt(),{outputFileSync:Hr}=jt();function Wr(e,t,n){let o=qr(t,n);Hr(e,o,n)}Ri.exports=Wr});var Ni=x((vd,Li)=>{"use strict";var Vr=oe().fromPromise,fe=Ei();fe.outputJson=Vr(Mi());fe.outputJsonSync=Di();fe.outputJSON=fe.outputJson;fe.outputJSONSync=fe.outputJsonSync;fe.writeJSON=fe.writeJson;fe.writeJSONSync=fe.writeJsonSync;fe.readJSON=fe.readJson;fe.readJSONSync=fe.readJsonSync;Li.exports=fe});var Ki=x((bd,Gi)=>{"use strict";var Br=pe(),Oi=require("path"),{copy:Jr}=Dt(),{remove:_i}=ht(),{mkdirp:Yr}=Se(),{pathExists:Xr}=je(),ji=Ue();async function Qr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await ji.checkPaths(e,t,"move",n);await ji.checkParentPaths(e,i,t,"move");let s=Oi.dirname(t);return Oi.parse(s).root!==s&&await Yr(s),Zr(e,t,o,a)}async function Zr(e,t,n,o){if(!o){if(n)await _i(t);else if(await Xr(t))throw new Error("dest already exists.")}try{await Br.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await ec(e,t,n)}}async function ec(e,t,n){return await Jr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),_i(e)}Gi.exports=Qr});var Wi=x((Sd,Hi)=>{"use strict";var Ui=Oe(),gn=require("path"),tc=Dt().copySync,qi=ht().removeSync,nc=Se().mkdirpSync,zi=Ue();function oc(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=zi.checkPathsSync(e,t,"move",n);return zi.checkParentPathsSync(e,i,t,"move"),ic(t)||nc(gn.dirname(t)),ac(e,t,o,a)}function ic(e){let t=gn.dirname(e);return gn.parse(t).root===t}function ac(e,t,n,o){if(o)return pn(e,t,n);if(n)return qi(t),pn(e,t,n);if(Ui.existsSync(t))throw new Error("dest already exists.");return pn(e,t,n)}function pn(e,t,n){try{Ui.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return sc(e,t,n)}}function sc(e,t,n){return tc(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),qi(e)}Hi.exports=oc});var Bi=x((kd,Vi)=>{"use strict";var rc=oe().fromPromise;Vi.exports={move:rc(Ki()),moveSync:Wi()}});var Fe=x((Pd,Ji)=>{"use strict";Ji.exports={...pe(),...Dt(),...Bo(),...bi(),...Ni(),...Se(),...Bi(),...jt(),...je(),...ht()}});var da=x((_d,la)=>{function ve(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}la.exports=ve;ve.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};ve.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};ve.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};ve.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};ve.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};ve.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};ve.prototype.start=ve.prototype.try;ve.prototype.errors=function(){return this._errors};ve.prototype.attempts=function(){return this._attempts};ve.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],a=i.message,s=(e[a]||0)+1;e[a]=s,s>=n&&(t=i,n=s)}return t}});var ua=x(He=>{var kc=da();He.operation=function(e){var t=He.timeouts(e);return new kc(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};He.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(a,s){return a-s}),o};He.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};He.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(c){var u=He.operation(t),l=Array.prototype.slice.call(arguments,1),d=l.pop();l.push(function(m){u.retry(m)||(m&&(arguments[0]=u.mainError()),d.apply(this,arguments))}),u.attempt(function(){c.apply(e,l)})}.bind(e,s),e[a].options=t}}});var pa=x((Kd,ma)=>{ma.exports=ua()});var ga=x((zd,Kt)=>{Kt.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Kt.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Kt.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var va=x((Ud,ot)=>{var B=global.process,We=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};We(B)?(fa=require("assert"),tt=ga(),ha=/^win/i.test(B.platform),vt=require("events"),typeof vt!="function"&&(vt=vt.EventEmitter),B.__signal_exit_emitter__?se=B.__signal_exit_emitter__:(se=B.__signal_exit_emitter__=new vt,se.count=0,se.emitted={}),se.infinite||(se.setMaxListeners(1/0),se.infinite=!0),ot.exports=function(e,t){if(!We(global.process))return function(){};fa.equal(typeof e,"function","a callback must be provided for exit handler"),nt===!1&&vn();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){se.removeListener(n,e),se.listeners("exit").length===0&&se.listeners("afterexit").length===0&&zt()};return se.on(n,e),o},zt=function(){!nt||!We(global.process)||(nt=!1,tt.forEach(function(t){try{B.removeListener(t,Ut[t])}catch{}}),B.emit=qt,B.reallyExit=bn,se.count-=1)},ot.exports.unload=zt,Ve=function(t,n,o){se.emitted[t]||(se.emitted[t]=!0,se.emit(t,n,o))},Ut={},tt.forEach(function(e){Ut[e]=function(){if(We(global.process)){var n=B.listeners(e);n.length===se.count&&(zt(),Ve("exit",null,e),Ve("afterexit",null,e),ha&&e==="SIGHUP"&&(e="SIGINT"),B.kill(B.pid,e))}}}),ot.exports.signals=function(){return tt},nt=!1,vn=function(){nt||!We(global.process)||(nt=!0,se.count+=1,tt=tt.filter(function(t){try{return B.on(t,Ut[t]),!0}catch{return!1}}),B.emit=ya,B.reallyExit=wa)},ot.exports.load=vn,bn=B.reallyExit,wa=function(t){We(global.process)&&(B.exitCode=t||0,Ve("exit",B.exitCode,null),Ve("afterexit",B.exitCode,null),bn.call(B,B.exitCode))},qt=B.emit,ya=function(t,n){if(t==="exit"&&We(global.process)){n!==void 0&&(B.exitCode=n);var o=qt.apply(this,arguments);return Ve("exit",B.exitCode,null),Ve("afterexit",B.exitCode,null),o}else return qt.apply(this,arguments)}):ot.exports=function(){return function(){}};var fa,tt,ha,vt,se,zt,Ve,Ut,nt,vn,bn,wa,qt,ya});var Sa=x((qd,Sn)=>{"use strict";var ba=Symbol();function Pc(e,t,n){let o=t[ba];if(o)return t.stat(e,(a,s)=>{if(a)return n(a);n(null,s.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,a=>{if(a)return n(a);t.stat(e,(s,r)=>{if(s)return n(s);let c=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,ba,{value:c}),n(null,r.mtime,c)})})}function xc(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}Sn.exports.probe=Pc;Sn.exports.getMtime=xc});var Ta=x((Hd,St)=>{"use strict";var Cc=require("path"),xn=Oe(),Tc=pa(),Ec=va(),ka=Sa(),Re={};function bt(e,t){return t.lockfilePath||`${e}.lock`}function Cn(e,t,n){if(!t.realpath)return n(null,Cc.resolve(e));t.fs.realpath(e,n)}function Pn(e,t,n){let o=bt(e,t);t.fs.mkdir(o,i=>{if(!i)return ka.probe(o,t.fs,(a,s,r)=>{if(a)return t.fs.rmdir(o,()=>{}),n(a);n(null,s,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(a,s)=>{if(a)return a.code==="ENOENT"?Pn(e,{...t,stale:0},n):n(a);if(!Pa(s,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));xa(e,t,r=>{if(r)return n(r);Pn(e,{...t,stale:0},n)})})})}function Pa(e,t){return e.mtime.getTime()<Date.now()-t.stale}function xa(e,t,n){t.fs.rmdir(bt(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function Ht(e,t){let n=Re[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let a=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||a?kn(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Ht(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return kn(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=ka.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,c=>{let u=n.lastUpdate+t.stale<Date.now();if(!n.released){if(c)return c.code==="ENOENT"||u?kn(e,n,Object.assign(c,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Ht(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,Ht(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function kn(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),Re[e]===t&&delete Re[e],t.options.onCompromised(n)}function Ic(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:xn,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),Cn(e,t,(o,i)=>{if(o)return n(o);let a=Tc.operation(t.retries);a.attempt(()=>{Pn(i,t,(s,r,c)=>{if(a.retry(s))return;if(s)return n(a.mainError());let u=Re[i]={lockfilePath:bt(i,t),mtime:r,mtimePrecision:c,options:t,lastUpdate:Date.now()};Ht(i,t),n(null,l=>{if(u.released)return l&&l(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));Ca(i,{...t,realpath:!1},l)})})})})}function Ca(e,t,n){t={fs:xn,realpath:!0,...t},Cn(e,t,(o,i)=>{if(o)return n(o);let a=Re[i];if(!a)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));a.updateTimeout&&clearTimeout(a.updateTimeout),a.released=!0,delete Re[i],xa(i,t,n)})}function $c(e,t,n){t={stale:1e4,realpath:!0,fs:xn,...t},t.stale=Math.max(t.stale||0,2e3),Cn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(bt(i,t),(a,s)=>a?a.code==="ENOENT"?n(null,!1):n(a):n(null,!Pa(s,t)))})}function Fc(){return Re}Ec(()=>{for(let e in Re){let t=Re[e].options;try{t.fs.rmdirSync(bt(e,t))}catch{}}});St.exports.lock=Ic;St.exports.unlock=Ca;St.exports.check=$c;St.exports.getLocks=Fc});var Ia=x((Wd,Ea)=>{"use strict";var Ac=Oe();function Mc(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let a=i.pop(),s;try{s=e[`${o}Sync`](...i)}catch(r){return a(r)}a(null,s)}}),n}function Rc(e){return(...t)=>new Promise((n,o)=>{t.push((i,a)=>{i?o(i):n(a)}),e(...t)})}function Dc(e){return(...t)=>{let n,o;if(t.push((i,a)=>{n=i,o=a}),e(...t),n)throw n;return o}}function Lc(e){if(e={...e},e.fs=Mc(e.fs||Ac),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}Ea.exports={toPromise:Rc,toSync:Dc,toSyncOptions:Lc}});var Fa=x((Vd,Ke)=>{"use strict";var it=Ta(),{toPromise:Wt,toSync:Vt,toSyncOptions:Tn}=Ia();async function $a(e,t){let n=await Wt(it.lock)(e,t);return Wt(n)}function Nc(e,t){let n=Vt(it.lock)(e,Tn(t));return Vt(n)}function Oc(e,t){return Wt(it.unlock)(e,t)}function jc(e,t){return Vt(it.unlock)(e,Tn(t))}function _c(e,t){return Wt(it.check)(e,t)}function Gc(e,t){return Vt(it.check)(e,Tn(t))}Ke.exports=$a;Ke.exports.lock=$a;Ke.exports.unlock=Oc;Ke.exports.lockSync=Nc;Ke.exports.unlockSync=jc;Ke.exports.check=_c;Ke.exports.checkSync=Gc});var Kl={};is(Kl,{activate:()=>jl,deactivate:()=>Gl});module.exports=as(Kl);var I=D(require("vscode"));var ee=D(require("vscode")),U=D(Fe()),E=D(require("path")),ta=D(require("crypto"));var qe=D(require("vscode")),et=D(Fe()),_t=D(require("path"));var Yi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,Xi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ae=".alex",Qi={root:Ae,knowledge:`${Ae}/global-knowledge`,patterns:`${Ae}/global-knowledge/patterns`,insights:`${Ae}/global-knowledge/insights`,index:`${Ae}/global-knowledge/index.json`,projectRegistry:`${Ae}/project-registry.json`,globalProfile:`${Ae}/user-profile.json`},fn={pattern:"GK-",insight:"GI-"};function hn(){let e=qe.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function Me(e=!0){let t=qe.workspace.workspaceFolders;if(!t||t.length===0)return{found:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."};if(t.length===1){let i=t[0];return e&&!await Zi(i.uri.fsPath)?{found:!1,error:'Alex is not installed in this workspace. Run "Alex: Initialize Architecture" first.'}:{found:!0,rootPath:i.uri.fsPath,workspaceFolder:i}}let n=[];for(let i of t)await Zi(i.uri.fsPath)&&n.push(i);if(!e){let i=await qe.window.showQuickPick(t.map(a=>({label:a.name,description:a.uri.fsPath,folder:a})),{placeHolder:"Select a workspace folder to initialize Alex in",title:"Initialize Alex - Select Folder"});return i?{found:!0,rootPath:i.folder.uri.fsPath,workspaceFolder:i.folder}:{found:!1,cancelled:!0}}if(n.length===0)return{found:!1,error:'Alex is not installed in any workspace folder. Run "Alex: Initialize Architecture" first.'};if(n.length===1)return{found:!0,rootPath:n[0].uri.fsPath,workspaceFolder:n[0]};let o=await qe.window.showQuickPick(n.map(i=>({label:i.name,description:i.uri.fsPath,folder:i})),{placeHolder:"Multiple folders have Alex installed. Select one:",title:"Alex - Select Workspace Folder"});return o?{found:!0,rootPath:o.folder.uri.fsPath,workspaceFolder:o.folder}:{found:!1,cancelled:!0}}async function wn(e,t=!1){let n=_t.join(e,".github","copilot-instructions.md");if(!await et.pathExists(n))return null;try{let o=await et.readFile(n,"utf8"),i=t?Xi:Yi,a=o.match(i);return a?a[1]:null}catch{return null}}async function Zi(e){let t=_t.join(e,".github","copilot-instructions.md");return et.pathExists(t)}function ea(e){return ta.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}function cc(e){return E.join(e,".github","config","alex-manifest.json")}async function na(e){let t=await Me(!1);if(!t.found){if(t.cancelled)return;ee.window.showErrorMessage(t.error||"No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t.rootPath,o=E.join(n,".github","copilot-instructions.md");if(await U.pathExists(o)){let i=await ee.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await ee.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await yn(e);return}await oa(e,n,!1)}async function yn(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;ee.window.showErrorMessage(t.error||"Please open a workspace folder with Alex installed to reset.");return}let n=t.rootPath,o=await ee.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await ee.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[E.join(n,".github","copilot-instructions.md"),E.join(n,".github","instructions"),E.join(n,".github","prompts"),E.join(n,".github","episodic"),E.join(n,".github","domain-knowledge"),E.join(n,".github","config"),E.join(n,".alex-manifest.json")];try{await ee.window.withProgress({location:ee.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await U.remove(s)}),await oa(e,n,!0)}catch(a){ee.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function oa(e,t,n){let o=e.extensionPath,i=E.join(o,".github","copilot-instructions.md");if(!await U.pathExists(i)){ee.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:E.join(o,".github","copilot-instructions.md"),dest:E.join(t,".github","copilot-instructions.md")},{src:E.join(o,".github","instructions"),dest:E.join(t,".github","instructions")},{src:E.join(o,".github","prompts"),dest:E.join(t,".github","prompts")},{src:E.join(o,".github","episodic"),dest:E.join(t,".github","episodic")},{src:E.join(o,".github","domain-knowledge"),dest:E.join(t,".github","domain-knowledge")},{src:E.join(o,".github","config"),dest:E.join(t,".github","config")},{src:E.join(o,".github","agents"),dest:E.join(t,".github","agents")}];try{let s=E.join(t,".github");await U.ensureDir(s);let r=E.join(s,".write-test");try{await U.writeFile(r,"test"),await U.remove(r)}catch(u){throw new Error(`Cannot write to workspace - check folder permissions: ${u.message}`)}await ee.window.withProgress({location:ee.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async u=>{for(let l of a)u.report({message:`Copying ${E.basename(l.dest)}...`}),await U.pathExists(l.src)?await U.copy(l.src,l.dest,{overwrite:n}):console.warn(`Source not found: ${l.src}`);u.report({message:"Creating manifest..."}),await dc(e,t)});let c=await ee.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(c==="Open Main Brain File"){let u=E.join(t,".github","copilot-instructions.md"),l=await ee.workspace.openTextDocument(u);await ee.window.showTextDocument(l)}else c==="Run Dream Protocol"&&await ee.commands.executeCommand("alex.dream")}catch(s){ee.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}function lc(e){return E.join(e,".alex-manifest.json")}async function dc(e,t){let n=e.extensionPath,o=lc(t);await U.pathExists(o)&&(await U.remove(o),console.log("Removed legacy manifest from root"));let i="0.0.0";try{i=(await U.readJson(E.join(n,"package.json"))).version||"0.0.0"}catch{console.warn("Could not read extension version")}let a={version:i,installedAt:new Date().toISOString(),files:{}},s=[{dir:E.join(t,".github","instructions"),prefix:".github/instructions"},{dir:E.join(t,".github","prompts"),prefix:".github/prompts"},{dir:E.join(t,".github","domain-knowledge"),prefix:".github/domain-knowledge"},{dir:E.join(t,".github","agents"),prefix:".github/agents"}],r=E.join(t,".github","copilot-instructions.md");if(await U.pathExists(r)){let u=await U.readFile(r,"utf8");a.files[".github/copilot-instructions.md"]={type:"system",originalChecksum:ea(u)}}for(let{dir:u,prefix:l}of s)if(await U.pathExists(u)){let d=await U.readdir(u);for(let m of d)if(m.endsWith(".md")){let p=E.join(u,m),h=await U.readFile(p,"utf8");a.files[`${l}/${m}`]={type:"system",originalChecksum:ea(h)}}}let c=cc(t);await U.ensureDir(E.dirname(c)),await U.writeJson(c,a,{spaces:2})}var ne=D(require("vscode")),ke=D(Fe()),we=D(require("path"));var ia={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function Gt(e,t){let n=t?.silent??!1,o=await Me(!0);if(!o.found){if(o.cancelled)return;n||ne.window.showErrorMessage(o.error||"No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let i=o.rootPath,a=o.workspaceFolder,s,r;if(await ne.window.withProgress({location:ne.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async c=>{c.report({message:"Scanning neural network..."});let u=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],l=[];for(let P of u){let L=new ne.RelativePattern(a,P),W=await ne.workspace.findFiles(L);l=l.concat(W.map(X=>X.fsPath))}if(l=[...new Set(l)],l.length===0){n||await ne.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await ne.commands.executeCommand("alex.initialize"),s={success:!1,totalFiles:0,totalSynapses:0,brokenCount:0,repairedCount:0};return}let d=[],m=new Set(l.map(P=>we.normalize(P).toLowerCase())),p=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let P of l){let L;try{L=await ke.readFile(P,"utf-8")}catch(te){console.error(`Failed to read file ${P}:`,te);continue}let W=L.split(`
`),X=!1;for(let te=0;te<W.length;te++){let b=W[te];if(b.trim().startsWith("```")){X=!X;continue}if(X)continue;let C;for(;(C=p.exec(b))!==null;){let T=C[1].trim(),N=Array.from(m).some(_=>_.endsWith(we.normalize(T).toLowerCase()));if(!N){let _=we.join(i,T);(await ke.pathExists(_)||(await ne.workspace.findFiles(new ne.RelativePattern(a,`**/${T}`))).length>0)&&(N=!0)}if(!N){let _=we.dirname(P),O=we.join(_,T);await ke.pathExists(O)&&(N=!0)}["target-file.md","CHANGELOG.md"].includes(T)&&(N=!0),d.push({sourceFile:P,targetFile:T,strength:C[2].trim(),type:C[3]?.trim()||"association",direction:C[4]?.trim()||"unidirectional",condition:C[5]?.trim(),line:te+1,isValid:N})}}}let h=d.filter(P=>!P.isValid),y=new Set(d.map(P=>P.targetFile.toLowerCase())),w=[],k=[];for(let P of h){let L=we.basename(P.targetFile);if(ia[L]){let W=ia[L];try{let X=await ke.readFile(P.sourceFile,"utf-8"),te=P.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=new RegExp(`\\[${te}\\]`,"g");if(b.test(X)){let C=X.replace(b,`[${W}]`);await ke.writeFile(P.sourceFile,C,"utf-8"),P.repaired=!0,P.newTarget=W,w.push(P)}else k.push(P)}catch(X){console.error(`Failed to repair synapse in ${P.sourceFile}:`,X),k.push(P)}}else k.push(P)}h=k;let $={timestamp:new Date().toISOString(),totalFiles:l.length,totalSynapses:d.length,brokenSynapses:h,repairedSynapses:w,orphanedFiles:[]},A=uc($);r=we.join(i,".github","episodic",`dream-report-${Date.now()}.md`),await ke.ensureDir(we.dirname(r)),await ke.writeFile(r,A),s={success:h.length===0,totalFiles:l.length,totalSynapses:d.length,brokenCount:h.length,repairedCount:w.length,reportPath:r}}),!n&&s&&r)if(s.brokenCount>0){if(await ne.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${s.brokenCount} broken synapse${s.brokenCount>1?"s":""}!

${s.repairedCount>0?`\u2705 Auto-repaired: ${s.repairedCount}
`:""}\u274C Need manual repair: ${s.brokenCount}

Review the report for details on broken connections.`,"View Report","Close")==="View Report"){let u=await ne.workspace.openTextDocument(r);await ne.window.showTextDocument(u)}}else{let c=s.totalSynapses>50?"excellent":s.totalSynapses>20?"good":"developing";if(await ne.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${s.totalFiles} memory files
\u2022 ${s.totalSynapses} active synapses
${s.repairedCount>0?`\u2022 ${s.repairedCount} auto-repaired
`:""}\u2022 Network health: ${c}`,"View Full Report","Close")==="View Full Report"){let l=await ne.workspace.openTextDocument(r);await ne.window.showTextDocument(l)}}return s}function uc(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${we.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${we.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var ae=D(require("vscode")),f=D(Fe()),v=D(require("path")),sa=D(require("crypto"));function yt(e){return sa.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function mc(e){let t=v.join(e,".github","copilot-instructions.md");if(!await f.pathExists(t))return null;try{let o=(await f.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function pc(e){try{return(await f.readJson(v.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}function ra(e){return v.join(e,".github","config","alex-manifest.json")}function gc(e){return v.join(e,".alex-manifest.json")}async function fc(e){let t=ra(e),n=gc(e);if(await f.pathExists(t))try{return await f.readJson(t)}catch(o){return console.error("Failed to parse manifest (may be corrupted):",o),null}if(await f.pathExists(n))try{let o=await f.readJson(n);return await f.ensureDir(v.join(e,".github","config")),await f.writeJson(t,o,{spaces:2}),await f.remove(n),console.log("Migrated manifest from root to .github/config/"),o}catch(o){return console.error("Failed to parse/migrate legacy manifest:",o),null}return null}async function hc(e,t,n){let o=v.join(e,".github","copilot-instructions.md"),i=v.join(t,".github","copilot-instructions.md");if(!await f.pathExists(o)||!await f.pathExists(i))return{success:!1,reason:"File not found"};try{let a=await f.readFile(o,"utf8"),s=await f.readFile(i,"utf8"),r=a.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/),c=r?r[0]:null,u=a.match(/## Synapses[\s\S]*?(?=##|$)/),l=a.split(`
`).length,d=s.split(`
`).length;if(l>d*1.2)return{success:!1,reason:"User file has significant customizations"};let m=a.match(/^## [^\n]+/gm)||[],p=s.match(/^## [^\n]+/gm)||[],h=m.filter(w=>!p.includes(w));if(h.length>2)return{success:!1,reason:`User has ${h.length} custom sections`};let y=s;if(c&&c.includes("P5")&&!c.includes("Available for")){let w=y.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);w&&(y=y.replace(w[0],c))}return y=y.replace(/\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,`**Version**: ${n}`),await f.writeFile(o,y,"utf8"),{success:!0}}catch(a){return{success:!1,reason:a.message}}}async function aa(e){let t=[];if(!await f.pathExists(e))return t;try{let n=await f.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}var wc={Expression:"Enables",Embodiment:"Enables",Living:"Validates",Reflexive:"Documents",Ethical:"Validates",Unconscious:"Enables",Application:"Enables",Validation:"Validates"};async function yc(e){let t=[];if(!await f.pathExists(e))return{migrated:!1,changes:t};try{let n=await f.readFile(e,"utf8"),o=n;/## Embedded Synapse Network/i.test(n)&&(n=n.replace(/## Embedded Synapse Network/gi,"## Synapses"),t.push('Header: "## Embedded Synapse Network" \u2192 "## Synapses"')),/### \*\*Connection Mapping\*\*/i.test(n)&&(n=n.replace(/### \*\*Connection Mapping\*\*/gi,"### Connection Mapping"),t.push('Subheader: "### **Connection Mapping**" \u2192 "### Connection Mapping"')),/### \*\*Activation Patterns\*\*/i.test(n)&&(n=n.replace(/### \*\*Activation Patterns\*\*/gi,"### Activation Patterns"),t.push('Subheader: "### **Activation Patterns**" \u2192 "### Activation Patterns"'));for(let[r,c]of Object.entries(wc)){let u=new RegExp(`(\\(\\s*(?:Critical|High|Medium|Low)\\s*,\\s*)${r}(\\s*,)`,"gi");u.test(n)&&(n=n.replace(u,`$1${c}$2`),t.push(`Relationship type: "${r}" \u2192 "${c}"`))}let i=/\*\*([^*]+)\*\*\s*→\s*([^✅\n]+)\s*✅\s*(?:NEW|CRITICAL|ENHANCED)[^\n]*/g,a;for(;(a=i.exec(o))!==null;){let r=a[1].trim(),c=a[2].trim(),u=a[0],l=`${r} \u2192 ${c}`;n=n.replace(u,l),t.push(`Simplified activation: "${r}" (removed date stamp and bold)`)}let s=/^\s*-\s*\*\*([^*]+)\*\*\s*→\s*(.+)$/gm;return n=n.replace(s,(r,c,u)=>r.includes("**")?(t.push(`Removed bold: "${c.trim()}"`),`- ${c.trim()} \u2192 ${u.trim()}`):r),n=n.replace(/\s*✅\s*(?:NEW|CRITICAL|ENHANCED)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s*\d{4}/gi,""),n!==o?(await f.writeFile(e,n,"utf8"),{migrated:!0,changes:t}):{migrated:!1,changes:t}}catch(n){return t.push(`Error during migration: ${n}`),{migrated:!1,changes:t}}}async function vc(e,t){let n=[],o=v.join(e,".github","domain-knowledge");if(await f.pathExists(o)){let i=await f.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function ca(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;await ae.window.showWarningMessage(t.error||"Alex is not installed in this workspace.","Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await ae.commands.executeCommand("alex.initialize");return}let n=t.rootPath,o=e.extensionPath,i=await mc(n),a=await pc(o);if(i===a){await ae.window.showInformationMessage(`\u2705 Alex is already at the latest version (${a}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await ae.commands.executeCommand("alex.dream");return}let s=await ae.window.showInformationMessage(`\u{1F504} Upgrade Available: v${i||"unknown"} \u2192 v${a}

This is a fully automated upgrade process:

\u{1F4E6} What will happen:
\u2022 Full backup of all cognitive memory
\u2022 Update system files (instructions, prompts)
\u2022 Auto-migrate schema changes
\u2022 Preserve your learned knowledge
\u2022 Run Dream validation

\u23F1\uFE0F Total time: ~30 seconds`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(s==="What's New?"){let r=v.join(o,"CHANGELOG.md");if(await f.pathExists(r)){let c=await ae.workspace.openTextDocument(r);await ae.window.showTextDocument(c)}return}s==="Start Upgrade"&&await bc(e,n,o,i,a)}async function bc(e,t,n,o,i){let a=v.join(n,".github","copilot-instructions.md");if(!await f.pathExists(a)){ae.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),c=v.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await ae.window.withProgress({location:ae.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async p=>{p.report({message:"Creating complete backup...",increment:15});try{await f.ensureDir(c);let F=v.join(c,".write-test");await f.writeFile(F,"test"),await f.remove(F)}catch(F){throw new Error(`Cannot create backup directory - check disk space and permissions: ${F.message}`)}let h=v.join(t,".github");await f.pathExists(h)&&(await f.copy(h,v.join(c,".github")),s.backed_up.push(".github/ (all cognitive memory)")),p.report({message:"Analyzing installed files...",increment:10});let y=await fc(t);y||(y={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),p.report({message:"Scanning for schema migration needs...",increment:15});let w=[],k=v.join(t,".github","copilot-instructions.md");await f.pathExists(k)&&w.push(k);let $=v.join(t,".github","domain-knowledge");if(await f.pathExists($)){let F=await f.readdir($);for(let S of F)S.endsWith(".md")&&w.push(v.join($,S))}let A=v.join(t,".github","episodic");if(await f.pathExists(A)){let F=await f.readdir(A);for(let S of F)S.endsWith(".md")&&w.push(v.join(A,S))}for(let F of w){let S=await aa(F);if(S.length>0){let K=v.relative(t,F);s.migrationTasks.push({file:K,type:"schema-migration",description:"Synapse schema migration needed",details:S})}}p.report({message:"Identifying user-created files...",increment:10});let P=await vc(t,y);for(let F of P){s.preserved.push(`${F} (user-created)`);let S=v.join(t,F),K=await aa(S);K.length>0&&s.migrationTasks.push({file:F,type:"schema-migration",description:"User-created file needs schema migration",details:K})}p.report({message:"Merging core brain file...",increment:10});let L=await hc(t,n,i);L.success?s.updated.push(".github/copilot-instructions.md (auto-merged)"):s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires manual merge",details:[`Auto-merge failed: ${L.reason}`,"UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),p.report({message:"Updating system files...",increment:20});let W=v.join(n,".github","instructions"),X=v.join(t,".github","instructions");if(await f.pathExists(W)){let F=await f.readdir(W);for(let S of F){let K=v.join(W,S),ce=v.join(X,S);if((await f.stat(K)).isFile()){let Ee=await f.pathExists(ce);await f.copy(K,ce,{overwrite:!0});let Le=await f.readFile(K,"utf8");y.files[`.github/instructions/${S}`]={type:"system",originalChecksum:yt(Le)},Ee?s.updated.push(`.github/instructions/${S}`):s.added.push(`.github/instructions/${S}`)}}}let te=v.join(n,".github","prompts"),b=v.join(t,".github","prompts");if(await f.pathExists(te)){let F=await f.readdir(te);for(let S of F){let K=v.join(te,S),ce=v.join(b,S);if((await f.stat(K)).isFile()){let Ee=await f.pathExists(ce);await f.copy(K,ce,{overwrite:!0});let Le=await f.readFile(K,"utf8");y.files[`.github/prompts/${S}`]={type:"system",originalChecksum:yt(Le)},Ee?s.updated.push(`.github/prompts/${S}`):s.added.push(`.github/prompts/${S}`)}}}let C=v.join(n,".github","agents"),T=v.join(t,".github","agents");if(await f.pathExists(C)){await f.ensureDir(T);let F=await f.readdir(C);for(let S of F){let K=v.join(C,S),ce=v.join(T,S);if((await f.stat(K)).isFile()){let Ee=await f.pathExists(ce);await f.copy(K,ce,{overwrite:!0});let Le=await f.readFile(K,"utf8");y.files[`.github/agents/${S}`]={type:"system",originalChecksum:yt(Le)},Ee?s.updated.push(`.github/agents/${S}`):s.added.push(`.github/agents/${S}`)}}}let N=v.join(n,".github","config"),Z=v.join(t,".github","config");if(await f.pathExists(N)){await f.ensureDir(Z);let F=await f.readdir(N);for(let S of F)if(S.includes("template")||S==="USER-PROFILE-TEMPLATE.md"){let K=v.join(N,S),ce=v.join(Z,S);if((await f.stat(K)).isFile()){let Ee=await f.pathExists(ce);await f.copy(K,ce,{overwrite:!0}),Ee?s.updated.push(`.github/config/${S}`):s.added.push(`.github/config/${S}`)}}}p.report({message:"Processing domain knowledge...",increment:10});let _=v.join(n,".github","domain-knowledge"),O=v.join(t,".github","domain-knowledge");if(await f.pathExists(_)){await f.ensureDir(O);let F=await f.readdir(_);for(let S of F){let K=v.join(_,S),ce=v.join(O,S);if((await f.stat(K)).isFile()){let Ee=await f.readFile(K,"utf8"),Le=yt(Ee);if(!await f.pathExists(ce))await f.copy(K,ce),y.files[`.github/domain-knowledge/${S}`]={type:"system",originalChecksum:Le},s.added.push(`.github/domain-knowledge/${S}`);else{let Xa=await f.readFile(ce,"utf8"),Qa=yt(Xa),Qn=y.files[`.github/domain-knowledge/${S}`]?.originalChecksum;if(Qn&&Qa!==Qn){let Zt=ce.replace(/\.md$/,`.v${i}.md`);await f.copy(K,Zt),s.preserved.push(`.github/domain-knowledge/${S} (modified by user, new version: ${v.basename(Zt)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${S}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${S}`,`New version available: ${v.basename(Zt)}`,"Review and merge changes as needed"]})}else await f.copy(K,ce,{overwrite:!0}),y.files[`.github/domain-knowledge/${S}`]={type:"system",originalChecksum:Le},s.updated.push(`.github/domain-knowledge/${S}`)}}}}p.report({message:"Saving manifest...",increment:5}),y.version=i,y.upgradedAt=new Date().toISOString();let q=ra(t);await f.ensureDir(v.dirname(q));let j=q+".tmp";await f.writeJson(j,y,{spaces:2}),await f.move(j,q,{overwrite:!0}),p.report({message:"Performing schema migrations...",increment:10});let Q=[],G=s.migrationTasks.filter(F=>F.type==="schema-migration").map(F=>F.file),Qt=".github/copilot-instructions.md";G.includes(Qt)||G.push(Qt);for(let F of G){let S=v.join(t,F),K=await yc(S);K.migrated&&Q.push({file:F,changes:K.changes})}s.migrationTasks=s.migrationTasks.filter(F=>F.type!=="schema-migration"),Q.length>0&&s.updated.push(...Q.map(F=>`${F.file} (schema migrated: ${F.changes.length} changes)`)),p.report({message:"Generating upgrade report...",increment:5}),await Sc(t,o,i,s,c,r,Q)});let u;try{u=await Gt(e,{silent:!0})}catch(p){console.error("Dream validation failed:",p)}let l=u?.success??!1;await new Promise(p=>setTimeout(p,500));let d=v.join(t,"UPGRADE-INSTRUCTIONS.md");if(await f.pathExists(d)&&await f.remove(d),await ae.window.showInformationMessage(`\u2705 Upgrade Complete! v${o||"unknown"} \u2192 v${i}

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Schema migrations: ${s.migrationTasks.length===0?"All completed":s.migrationTasks.length+" remaining"}
\u2022 Dream validation: ${l?"\u2705 Passed":"\u26A0\uFE0F Check manually"}

\u{1F389} Your cognitive architecture has been fully upgraded!`,"View Upgrade Report","Close")==="View Upgrade Report"){let p=v.join(t,"archive","upgrades",`upgrade-report-${r}.md`);if(await f.pathExists(p)){let h=await ae.workspace.openTextDocument(p);await ae.window.showTextDocument(h)}}}catch(u){ae.window.showErrorMessage(`\u274C Upgrade failed: ${u.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(u.message)}}async function Sc(e,t,n,o,i,a,s){let r=s.length>0?s.map((d,m)=>`
### ${m+1}. ${d.file}

**Status**: \u2705 Automatically migrated  
**Changes applied**:
${d.changes.map(p=>`- ${p}`).join(`
`)}
`).join(`
---
`):"No schema migrations were needed.",c=o.migrationTasks.length>0?o.migrationTasks.map((d,m)=>`
### ${m+1}. ${d.file}

**Type**: \`${d.type}\`  
**Description**: ${d.description}

**Details**:
${d.details.map(p=>`- ${p}`).join(`
`)}
`).join(`
---
`):"All tasks completed automatically.",u=`# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}  
**From Version**: ${t||"unknown"}  
**To Version**: ${n}  
**Status**: \u2705 Fully Automated Upgrade Complete  
**Backup Location**: \`${i}\`

---

## Summary

| Category | Count |
|----------|-------|
| Updated | ${o.updated.length} |
| Added | ${o.added.length} |
| Preserved | ${o.preserved.length} |
| Backed Up | ${o.backed_up.length} |
| Schema Migrations | ${s.length} |
| Remaining Tasks | ${o.migrationTasks.length} |
| Errors | ${o.errors.length} |

---

## Updated Files

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

## Schema Migrations Performed

${r}

---

## Remaining Tasks (Manual Review Recommended)

${c}

---

${o.errors.length>0?`## Errors

${o.errors.map(d=>`- \u274C ${d}`).join(`
`)}

---

`:""}
## Rollback Instructions

If you need to revert:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${v.relative(e,i)}\`
3. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

*Report generated by Alex Cognitive Architecture v${n}*
*Upgrade completed automatically - no manual intervention required*
`,l=v.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await f.ensureDir(v.dirname(l)),await f.writeFile(l,u,"utf8")}var z=D(require("vscode")),Te=D(Fe()),Yt=D(require("path"));var M=D(require("vscode")),R=D(Fe()),he=D(require("path")),On=D(require("os")),ja=D(Fa());var be=D(require("vscode")),Y=D(Fe()),De=D(require("path")),Aa=D(require("https"));var Be="alex-knowledge-index.json",Ma="Alex Cognitive Architecture - Global Knowledge Base";async function Kc(){try{return await be.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function kt(e,t={}){let n=await Kc();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let a=new URL(`https://api.github.com${e}`),s={hostname:a.hostname,path:a.pathname+a.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=Aa.request(s,c=>{let u="";c.on("data",l=>{u+=l}),c.on("end",()=>{if(c.statusCode&&c.statusCode>=200&&c.statusCode<300)if(c.statusCode===204||!u)o(null);else try{o(JSON.parse(u))}catch(l){i(new Error(`Failed to parse GitHub response: ${l}`))}else i(new Error(`GitHub API error (${c.statusCode}): ${u}`))})});r.on("error",c=>i(c)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function Ra(){return De.join(re("root"),"sync-metadata.json")}async function Bt(){let e=Ra();try{if(await Y.pathExists(e))return await Y.readJson(e)}catch{}return{}}async function st(e){let t=Ra();await Y.writeJson(t,e,{spaces:2})}async function Mn(){let e=await Bt();if(e.gistId)try{let i=await kt(`/gists/${e.gistId}`);if(i)return i}catch{}let t=re("index");if(await Y.pathExists(t))try{let i=await Y.readJson(t);if(i.cloudGistId){let a=await kt(`/gists/${i.cloudGistId}`);if(a)return await st({...e,gistId:a.id}),a}}catch{}let n=await kt("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===Ma||i.files[Be]);return o&&await st({...e,gistId:o.id}),o||null}async function Da(e){let t={};for(let[i,a]of Object.entries(e))t[i]={content:a};let n=await kt("/gists",{method:"POST",body:{description:Ma,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await Bt();return await st({...o,gistId:n.id}),n}async function La(e,t){let n={};for(let[i,a]of Object.entries(t))n[i]=a===null?null:{content:a};let o=await kt(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function Jt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function Pt(){try{let e=await Bt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=re("index");if(!await Y.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await Y.readJson(t),o=Jt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function xt(){try{await ue();let e=re("index");if(!await Y.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await Y.readJson(e),n=await Mn(),o=!n;n||(n=await Da({[Be]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[Be]:JSON.stringify(t,null,2)};for(let s of t.entries)if(await Y.pathExists(s.filePath)){let r=await Y.readFile(s.filePath,"utf-8"),c=De.basename(s.filePath);i[c]=r}n=await La(n.id,i),await Je(()=>t);let a=Jt(t);return await st({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:a,lastRemoteHash:a}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function Ct(){try{await ue();let e=await Mn();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[Be];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let a of n.entries){let s=De.basename(a.filePath),r=e.files[s];if(r){let c=a.type==="pattern"?"patterns":"insights",u=De.join(re(c),s);a.filePath=u,await Y.writeFile(u,r.content,"utf-8"),o++}}await Je(()=>n);let i=Jt(n);return await st({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function rt(){try{await ue();let e=re("index"),t;await Y.pathExists(e)?t=await Y.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await Mn(),o;n&&n.files[Be]?o=JSON.parse(n.files[Be].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let d of o.entries)i.set(d.id,d);for(let d of t.entries){let m=i.get(d.id);(!m||new Date(d.modified)>new Date(m.modified))&&i.set(d.id,d)}let a={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},s={[Be]:JSON.stringify(a,null,2)};for(let d of a.entries)if(await Y.pathExists(d.filePath)){let m=await Y.readFile(d.filePath,"utf-8"),p=De.basename(d.filePath);s[p]=m}let r=0;if(n)for(let d of o.entries){let m=De.basename(d.filePath),p=n.files[m],h=d.type==="pattern"?"patterns":"insights",y=De.join(re(h),m);if(p&&!await Y.pathExists(y)){await Y.writeFile(y,p.content,"utf-8");let w=i.get(d.id);w&&(w.filePath=y),r++}}n?await La(n.id,s):n=await Da(s),await Je(()=>a);let c=Jt(a);await st({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:c,lastRemoteHash:c});let u=t.entries.filter(d=>!o.entries.find(m=>m.id===d.id)).length,l=r;return{success:!0,status:"up-to-date",message:`Synced! ${u} pushed, ${l} pulled. Total: ${a.entries.length} entries.`,entriesPushed:u,entriesPulled:l}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function ct(){let e=await Bt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var Fn=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new be.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await xt();break;case"pull":i=await Ct();break;default:i=await rt()}let s=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;s+=`**Status**: ${i.status}
`,s+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(s+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(s+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await ct();return r&&(s+=`
**Cloud URL**: ${r}
`),new be.LanguageModelToolResult([new be.LanguageModelTextPart(s)])}};function Na(e){e.subscriptions.push(be.lm.registerTool("alex_cloud_sync",new Fn))}var at,En,In=!1,zc=300*1e3,Uc=60*1e3,$n;function qc(){return $n||($n=be.window.createOutputChannel("Alex Unconscious Mind")),$n}function Ce(e){let t=new Date().toISOString();qc().appendLine(`[${t}] ${e}`)}async function An(){if(In)return Ce("Sync already in progress, skipping"),null;if(En&&Date.now()-En.getTime()<Uc)return Ce("Too soon since last sync, skipping"),null;In=!0,En=new Date;try{if(Ce("Starting transparent background sync..."),(await Pt()).status==="up-to-date")return Ce("Already up-to-date, no sync needed"),{success:!0,status:"up-to-date",message:"Already synced"};let t=await rt();return Ce(`Sync complete: ${t.message}`),t}catch(e){return Ce(`Transparent sync failed: ${e}`),{success:!1,status:"error",message:`${e}`}}finally{In=!1}}async function lt(){setTimeout(async()=>{let e=await An();e&&e.success&&e.entriesPushed&&e.entriesPushed>0&&Ce(`Auto-synced ${e.entriesPushed} entries after modification`)},1e4)}function Oa(e){at&&clearInterval(at),Ce("Background sync enabled - Alex unconscious mind active"),setTimeout(async()=>{Ce("Running startup sync..."),await An()},1e4),at=setInterval(async()=>{await An()},zc),e.subscriptions.push({dispose:()=>{at&&(clearInterval(at),at=void 0),Ce("Background sync disabled")}})}var Hc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function jn(){return he.join(On.homedir(),Ae)}function re(e){return he.join(On.homedir(),Qi[e])}async function ue(){let e=[re("root"),re("knowledge"),re("patterns"),re("insights")];for(let t of e)await R.ensureDir(t)}async function _n(e,t){await R.pathExists(e)||await R.ensureFile(e);let n;try{return n=await ja.lock(e,Hc),await t()}finally{n&&await n()}}async function Je(e){let t=re("index");return await ue(),await _n(t,async()=>{let n;try{if(await R.pathExists(t)){let o=await R.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await R.writeJson(t,n,{spaces:2}),n})}async function _a(e){let t=re("projectRegistry");return await ue(),await _n(t,async()=>{let n;try{if(await R.pathExists(t)){let o=await R.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await R.writeJson(t,n,{spaces:2}),n})}async function Gn(){let e=re("index");return await ue(),await _n(e,async()=>{try{if(await R.pathExists(e)){let n=await R.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await R.writeJson(e,t,{spaces:2}),t})}async function Kn(){let e=re("projectRegistry");return await ue(),await _a(t=>t)}async function Ga(){let e=M.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=he.basename(t),o=0,i=new M.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await M.workspace.findFiles(i)).length;let s;return await _a(r=>{let c=r.projects.findIndex(l=>l.path===t),u={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return c>=0?(r.projects[c]={...r.projects[c],...u},s=r.projects[c]):(r.projects.push(u),s=u),r}),s}function Ka(e,t){let n=e==="pattern"?fn.pattern:fn.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function Wc(e,t,n,o,i){await ue();let a=Ka("pattern",e),s=`${a}.md`,r=he.join(re("patterns"),s),c=`# ${e}

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

`;await R.writeFile(r,c,"utf-8");let u={id:a,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await Je(l=>(l.entries.push(u),l)),u}async function Vc(e,t,n,o,i){let a=e.filePath;if(!a||!await R.pathExists(a))throw new Error(`Global pattern file not found: ${a}`);let s=[...new Set([...e.tags||[],...o])],r=`# ${e.title}

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

`;await R.writeFile(a,r,"utf-8");let c={...e,category:n,tags:s,modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":"")};return await Je(u=>{let l=u.entries.findIndex(d=>d.id===e.id);return l>=0&&(u.entries[l]=c),u}),c}async function zn(e,t,n,o,i,a,s){await ue();let r=Ka("insight",e),c=`${r}.md`,u=he.join(re("insights"),c),l=`# ${e}

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

`;await R.writeFile(u,l,"utf-8");let d={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:u};return await Je(m=>(m.entries.push(d),m)),d}async function Tt(e,t={}){let n=await Gn(),o=e.toLowerCase(),i=o.split(/\s+/).filter(s=>s.length>2),a=[];for(let s of n.entries){if(t.type&&t.type!=="all"&&s.type!==t.type||t.category&&s.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(u=>s.tags.map(l=>l.toLowerCase()).includes(u.toLowerCase())))continue;let r=0;s.title.toLowerCase().includes(o)&&(r+=10);for(let c of i)s.title.toLowerCase().includes(c)&&(r+=3);for(let c of s.tags){(c.toLowerCase().includes(o)||o.includes(c.toLowerCase()))&&(r+=5);for(let u of i)c.toLowerCase().includes(u)&&(r+=2)}s.summary.toLowerCase().includes(o)&&(r+=3);for(let c of i)s.summary.toLowerCase().includes(c)&&(r+=1);if(s.category.toLowerCase().includes(o)&&(r+=2),r>0){let c;if(await R.pathExists(s.filePath))try{c=await R.readFile(s.filePath,"utf-8");for(let u of i){let l=(c.toLowerCase().match(new RegExp(u,"g"))||[]).length;r+=Math.min(l,5)*.5}}catch{}a.push({entry:s,relevance:r,content:c})}}return a.sort((s,r)=>r.relevance-s.relevance),a.slice(0,t.limit||10)}async function za(e,t,n=[]){try{let o=await R.readFile(e,"utf-8"),i=he.basename(e,".md"),a=o.match(/^#\s+(.+)$/m),s=a?a[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),c=r?r[1].split(",").map(m=>m.trim()):[],u=[...new Set([...c,...n])],l=M.workspace.workspaceFolders,d=l?he.basename(l[0].uri.fsPath):void 0;return await Wc(s,o,t,u,d)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}var Bc=["DK-SKILL-WISHLIST","DK-GENERIC-FRAMEWORK","VERSION-NAMING-CONVENTION"];async function Jc(e){let t=he.basename(e,".md"),n=await R.readFile(e,"utf-8"),o=0,i=[],a=n.match(/^#\s+(.+)$/m),s=a?a[1]:t.replace(/^DK-/,"").replace(/-/g," "),r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g,c=n.match(r);c&&c.length>0&&(o+=3,i.push(`Has ${c.length} synapse connection(s)`));let u=n.match(/^##\s+.+$/gm);u&&u.length>=3&&(o+=2,i.push(`Well-structured with ${u.length} sections`));let l=n.match(/\*\*Tags\*\*:\s*(.+)$/m),d=[];l&&(d=l[1].split(",").map(L=>L.trim()).filter(L=>L.length>0),d.length>0&&(o+=1,i.push(`Has ${d.length} tag(s)`))),n.length>1e3&&(o+=1,i.push("Substantial content (>1KB)")),n.length>5e3&&(o+=2,i.push("Rich content (>5KB)"));let m=n.match(/```[\s\S]*?```/g);m&&m.length>0&&(o+=2,i.push(`Contains ${m.length} code example(s)`));let h=[/pattern/i,/best practice/i,/guideline/i,/framework/i,/principle/i,/architecture/i,/design/i,/approach/i].filter(L=>L.test(n)).length;h>=2&&(o+=Math.min(h,3),i.push("Contains general/reusable concepts"));let y=Yc(n,t),w=await Gn(),k=s.toLowerCase().replace(/[^a-z0-9]/g,"-"),$=w.entries.find(L=>L.title.toLowerCase().replace(/[^a-z0-9]/g,"-")===k||L.id.includes(k)),A=!!$,P=!1;if(A&&$)try{let W=(await R.stat(e)).mtime,X=new Date($.modified);P=W>X}catch{P=!1}return{filePath:e,filename:t,title:s,score:o,reasons:i,category:y,tags:d,isPromotionCandidate:o>=5&&!A,alreadyPromoted:A,existingEntry:$,hasLocalChanges:P}}function Yc(e,t){let n=e.toLowerCase(),o=t.toLowerCase(),i=[[/error|exception|fault|handling/i,"error-handling"],[/api|rest|graphql|endpoint/i,"api-design"],[/test|spec|jest|mocha|assertion/i,"testing"],[/debug|troubleshoot|diagnos/i,"debugging"],[/performance|optimi|cache|speed/i,"performance"],[/architecture|design|pattern|structure/i,"architecture"],[/security|auth|encrypt|vulnerab/i,"security"],[/deploy|ci\/cd|pipeline|docker|kubernetes/i,"deployment"],[/document|readme|comment|diagram/i,"documentation"],[/refactor|clean|improve|modernize/i,"refactoring"],[/tool|config|setup|environment/i,"tooling"]];for(let[a,s]of i)if(a.test(n)||a.test(o))return s;return"general"}async function Ua(e,t={}){let{dryRun:n=!1,minScore:o=5}=t;await ue();let i={evaluated:0,promoted:[],updated:[],skipped:[],alreadyGlobal:[]},a=he.join(e,".github","domain-knowledge");if(!await R.pathExists(a))return i;let r=(await R.readdir(a)).filter(c=>c.startsWith("DK-")&&c.endsWith(".md"));for(let c of r){let u=he.join(a,c),l=c.replace(".md","");if(Bc.some(d=>l.includes(d))){i.skipped.push({filename:c,reason:"Excluded meta-file"});continue}i.evaluated++;try{let d=await Jc(u);if(d.alreadyPromoted){if(d.hasLocalChanges&&d.existingEntry)if(n)i.updated.push({...d.existingEntry,modified:new Date().toISOString(),summary:"[DRY-RUN] Would be updated from local changes"});else{let m=await R.readFile(u,"utf-8"),p=M.workspace.workspaceFolders,h=p?he.basename(p[0].uri.fsPath):void 0,y=await Vc(d.existingEntry,m,d.category,d.tags,h);i.updated.push(y)}else i.alreadyGlobal.push(c);continue}if(!d.isPromotionCandidate||d.score<o){i.skipped.push({filename:c,reason:`Score ${d.score}/${o} - ${d.reasons.join(", ")||"Needs more structure/content"}`});continue}if(n)i.promoted.push({id:`[DRY-RUN] ${l}`,title:d.title,type:"pattern",category:d.category,tags:d.tags,created:new Date().toISOString(),modified:new Date().toISOString(),summary:`Would be promoted with score ${d.score}`,filePath:u});else{let m=await za(u,d.category,d.tags);m&&i.promoted.push(m)}}catch(d){i.skipped.push({filename:c,reason:`Error: ${d}`})}}return!n&&(i.promoted.length>0||i.updated.length>0)&&lt(),i}async function Un(){let e=await Gn(),t={},n={};for(let a of e.entries){t[a.category]=(t[a.category]||0)+1;for(let s of a.tags)n[s]=(n[s]||0)+1}let o=Object.entries(n).map(([a,s])=>({tag:a,count:s})).sort((a,s)=>s.count-a.count).slice(0,10),i=[...e.entries].sort((a,s)=>new Date(s.created).getTime()-new Date(a.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(a=>a.type==="pattern").length,totalInsights:e.entries.filter(a=>a.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var Rn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new M.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await ue();let{query:o,type:i,category:a,tags:s}=t.input,r=await Tt(o,{type:i,category:a,tags:s?s.split(",").map(u=>u.trim()):void 0,limit:10});if(r.length===0)return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`No global knowledge found matching "${o}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`)]);let c=`## Global Knowledge Search Results

`;c+=`Found **${r.length}** relevant entries for "${o}":

`;for(let{entry:u,relevance:l}of r){let d=u.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";c+=`### ${d} ${u.title}
`,c+=`- **Type**: ${u.type} | **Category**: ${u.category}
`,c+=`- **Tags**: ${u.tags.join(", ")}
`,u.sourceProject&&(c+=`- **Source**: ${u.sourceProject}
`),c+=`- **Summary**: ${u.summary}
`,c+=`- **File**: \`${u.filePath}\`

`}return new M.LanguageModelToolResult([new M.LanguageModelTextPart(c)])}},Dn=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new M.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await ue();let{title:o,insight:i,category:a,tags:s,problem:r,solution:c}=t.input,u=M.workspace.workspaceFolders,l=u?he.basename(u[0].uri.fsPath):void 0,d=await zn(o,i,a||"general",s?s.split(",").map(p=>p.trim()):[],l,r,c);lt();let m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${d.id}  
**Title**: ${d.title}  
**Category**: ${d.category}  
**Tags**: ${d.tags.join(", ")}  
**Source Project**: ${d.sourceProject||"Unknown"}  
**File**: \`${d.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(m)])}},Ln=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${he.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new M.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:a}=t.input;if(!await R.pathExists(o))return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let s=await za(o,i||"general",a?a.split(",").map(c=>c.trim()):[]);if(!s)return new M.LanguageModelToolResult([new M.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);lt();let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${s.id}  
**Title**: ${s.title}  
**Category**: ${s.category}  
**Tags**: ${s.tags.join(", ")}  
**Global File**: \`${s.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(r)])}},Nn=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await ue();let o=await Un(),i=await Kn(),a="";try{let r=await Pt();a=`| Cloud Sync | ${r.status==="up-to-date"?"\u2705":r.status==="needs-push"?"\u{1F4E4}":r.status==="needs-pull"?"\u{1F4E5}":r.status==="error"?"\u274C":"\u26AA"} ${r.status} |
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
\`${jn()}\`
`,new M.LanguageModelToolResult([new M.LanguageModelTextPart(s)])}};function qa(e){e.subscriptions.push(M.lm.registerTool("alex_global_knowledge_search",new Rn),M.lm.registerTool("alex_save_insight",new Dn),M.lm.registerTool("alex_promote_knowledge",new Ln),M.lm.registerTool("alex_global_knowledge_status",new Nn))}async function Ha(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;z.window.showErrorMessage(t.error||"No workspace folder open. Please open a project with Alex installed.");return}let n=t.rootPath,o=t.workspaceFolder,i={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},globalKnowledgePromotion:{evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0},recommendations:[],sessionFile:""};await z.window.withProgress({location:z.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async c=>{c.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Xc(o,i),c.report({message:"Phase 2: Checking version consistency...",increment:20}),await Qc(n,i),c.report({message:"Phase 3: Assessing memory architecture...",increment:40}),await Zc(o,i),c.report({message:"Phase 4: Auto-promoting knowledge to global...",increment:55}),await el(n,i),c.report({message:"Phase 5: Generating recommendations...",increment:75}),tl(i),c.report({message:"Phase 6: Documenting session...",increment:90}),await nl(n,i),c.report({message:"Self-actualization complete!",increment:100})});let s=`Self-Actualization Complete ${i.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":i.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":i.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${i.synapseHealth.totalSynapses} (${i.synapseHealth.brokenConnections} broken)
Memory Files: ${i.memoryConsolidation.proceduralFiles+i.memoryConsolidation.episodicFiles+i.memoryConsolidation.domainFiles}
Recommendations: ${i.recommendations.length}`,r=await z.window.showInformationMessage(s,"View Report","Open Session File");if(r==="View Report")ol(i);else if(r==="Open Session File"&&i.sessionFile){let c=await z.workspace.openTextDocument(i.sessionFile);await z.window.showTextDocument(c)}return i}async function Xc(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new z.RelativePattern(e,i),s=await z.workspace.findFiles(a);for(let r of s){t.synapseHealth.totalFiles++;try{let u=(await Te.readFile(r.fsPath,"utf-8")).split(`
`),l=!1;for(let d of u){if(d.trim().startsWith("```")){l=!l;continue}if(l)continue;let m;for(;(m=o.exec(d))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await z.workspace.findFiles(new z.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Qc(e,t){let n=Yt.join(e,".github","copilot-instructions.md");try{if(await Te.pathExists(n)){let r=(await Te.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=z.workspace.workspaceFolders?.[0];if(a)for(let s of i){let r=new z.RelativePattern(a,s),c=await z.workspace.findFiles(r);for(let u of c)try{let l=await Te.readFile(u.fsPath,"utf-8");for(let d of o)if(d.test(l)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Zc(e,t){let n=await z.workspace.findFiles(new z.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await z.workspace.findFiles(new z.RelativePattern(e,".github/prompts/*.md")),i=await z.workspace.findFiles(new z.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await z.workspace.findFiles(new z.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}async function el(e,t){try{let n=await Ua(e,{minScore:5});t.globalKnowledgePromotion={evaluated:n.evaluated,promoted:n.promoted.map(o=>o.title),updated:n.updated.map(o=>o.title),skipped:n.skipped.length,alreadyGlobal:n.alreadyGlobal.length}}catch(n){console.error("Auto-promotion failed:",n),t.globalKnowledgePromotion={evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0}}}function tl(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections"),e.globalKnowledgePromotion.promoted.length>0&&e.recommendations.push(`\u{1F310} Auto-promoted ${e.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`),e.globalKnowledgePromotion.updated.length>0&&e.recommendations.push(`\u{1F504} Updated ${e.globalKnowledgePromotion.updated.length} global knowledge file(s) with local changes!`),e.globalKnowledgePromotion.skipped>0&&e.globalKnowledgePromotion.promoted.length===0&&e.globalKnowledgePromotion.updated.length===0&&e.recommendations.push(`\u{1F4D6} ${e.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`)}async function nl(e,t){let n=Yt.join(e,".github","episodic");await Te.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Yt.join(n,a),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",c=`# Self-Actualization Session - ${i}

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

${t.recommendations.map(u=>`- ${u}`).join(`
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
${t.globalKnowledgePromotion.promoted.map(u=>`- \u{1F4D0} **${u}**`).join(`
`)}
`:""}${t.globalKnowledgePromotion.updated.length>0?`### Updated Global Knowledge
${t.globalKnowledgePromotion.updated.map(u=>`- \u{1F504} **${u}**`).join(`
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
`;await Te.writeFile(s,c,"utf-8"),t.sessionFile=s}function ol(e){let t=z.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",z.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
</html>`}var H=D(require("vscode")),Ba=D(require("path"));var g=D(require("vscode")),V=D(Fe()),ye=D(require("path"));var qn=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new g.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,r=0,c=0,u=[],l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Operation cancelled.")]);let h=new g.RelativePattern(o[0],p),y=await g.workspace.findFiles(h);for(let w of y){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Operation cancelled.")]);s++;try{let $=(await V.readFile(w.fsPath,"utf-8")).split(`
`),A=!1;for(let P=0;P<$.length;P++){let L=$[P];if(L.trim().startsWith("```")){A=!A;continue}if(A)continue;let W;for(;(W=l.exec(L))!==null;){r++;let X=W[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${X}`))).length===0&&(c++,t.input.detailed&&u.push(`- ${ye.basename(w.fsPath)}:${P+1} \u2192 ${X} (not found)`))}}}catch{}}}let d=c===0?"EXCELLENT":c<5?"GOOD":c<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${r} |
| Broken Connections | ${c} |
| Health Status | ${d} |
`;return t.input.detailed&&u.length>0&&(m+=`
### Issues Found
${u.join(`
`)}`),c>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Hn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new g.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let r=[];for(let l of s){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Operation cancelled.")]);let d=new g.RelativePattern(o[0],l),m=await g.workspace.findFiles(d);for(let p of m){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Operation cancelled.")]);try{let y=(await V.readFile(p.fsPath,"utf-8")).split(`
`),w=[];for(let k=0;k<y.length;k++)if(y[k].toLowerCase().includes(i)){let $=Math.max(0,k-1),A=Math.min(y.length-1,k+1),P=y.slice($,A+1).join(`
`);w.push(`Line ${k+1}:
${P}`)}w.length>0&&r.push({file:ye.basename(p.fsPath),matches:w.slice(0,3)})}catch{}}}let c=[];if(r.length===0)try{c=await Tt(t.input.query,{limit:5})}catch{}if(r.length===0&&c.length===0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`No matches found for "${t.input.query}" in local ${a} memory or global knowledge base.`)]);let u="";if(r.length>0){u+=`## Local Memory Results for "${t.input.query}"

`,u+=`Found ${r.length} file(s) with matches:

`;for(let l of r.slice(0,5)){u+=`### ${l.file}
`;for(let d of l.matches)u+=`\`\`\`
${d}
\`\`\`
`;u+=`
`}}if(c.length>0){r.length===0?(u+=`## \u{1F310} Global Knowledge Results (Unconscious Retrieval)

`,u+=`*Local search found nothing. Automatically searched cross-project knowledge:*

`):u+=`## \u{1F310} Related Global Knowledge

`;for(let{entry:l}of c.slice(0,3)){let d=l.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";u+=`### ${d} ${l.title}
`,u+=`- **Type**: ${l.type} | **Category**: ${l.category}
`,u+=`- **Tags**: ${l.tags.join(", ")}
`,u+=`- **Summary**: ${l.summary}

`}}return new g.LanguageModelToolResult([new g.LanguageModelTextPart(u)])}},Wn=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ye.join(i,".github","copilot-instructions.md");if(!await V.pathExists(a))return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md")),d="Unknown";try{let h=(await V.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);h&&(d=h[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${d} |
| Procedural Memory | ${r.length} files |
| Episodic Memory | ${c.length+u.length} files |
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
`;return new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Vn=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`))])}},Bn=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ye.join(i,"config","USER-PROFILE.md"),s=ye.join(i,"config","user-profile.json"),{action:r,field:c,value:u}=t.input;try{switch(r){case"exists":let l=await V.pathExists(s);return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:l,path:s}))]);case"get":if(!await V.pathExists(s))return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let d=await V.readJson(s);return c?new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({[c]:d[c]}))]):new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify(d))]);case"update":if(!c||u===void 0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await V.ensureDir(ye.join(i,"config"));let m={};if(await V.pathExists(s)&&(m=await V.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(c)){let p=m[c]||[];Array.isArray(p)?p.includes(u)||(m[c]=[...p,u]):m[c]=[u]}else m[c]=u;return m.lastUpdated=new Date().toISOString(),await V.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({success:!0,field:c,value:u,message:`Updated ${c} to: ${u}`}))]);default:return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(l){return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Error accessing user profile: ${l.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await V.writeFile(t,o,"utf-8")}},Jn=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new g.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let w=ye.join(i,".github","copilot-instructions.md");if(await V.pathExists(w)){let $=(await V.readFile(w,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);$&&(a=$[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let w of r){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Self-actualization cancelled.")]);let k=new g.RelativePattern(o[0],w),$=await g.workspace.findFiles(k);for(let A of $){if(n.isCancellationRequested)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Self-actualization cancelled.")]);s.synapseHealth.totalFiles++;try{let L=(await V.readFile(A.fsPath,"utf-8")).split(`
`),W=!1;for(let X of L){if(X.trim().startsWith("```")){W=!W;continue}if(W)continue;let te;for(;(te=c.exec(X))!==null;){s.synapseHealth.totalSynapses++;let b=te[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${b}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),m=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=u.length,s.memoryArchitecture.episodicFiles=l.length+d.length,s.memoryArchitecture.domainFiles=m.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let w=ye.join(i,".github","episodic");await V.ensureDir(w);let $=new Date().toISOString().split("T")[0],A=`self-actualization-${$}.prompt.md`;p=ye.join(w,A);let P=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",L=`# Self-Actualization Session - ${$}

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
| Health Status | ${P} ${s.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${s.memoryArchitecture.proceduralFiles} |
| Episodic | ${s.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${s.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${s.recommendations.length>0?s.recommendations.map(W=>`- ${W}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await V.writeFile(p,L,"utf-8")}let y=`## Self-Actualization Report

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

${s.recommendations.length>0?s.recommendations.map(w=>`- ${w}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return p&&(y+=`
### Session Recorded

Meditation session documented at: \`${ye.basename(p)}\``),new g.LanguageModelToolResult([new g.LanguageModelTextPart(y)])}};async function Xt(){let e=g.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ye.join(t,"config","user-profile.json");try{if(await V.pathExists(n))return await V.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function Wa(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function Va(e){e.subscriptions.push(g.lm.registerTool("alex_synapse_health",new qn)),e.subscriptions.push(g.lm.registerTool("alex_memory_search",new Hn)),e.subscriptions.push(g.lm.registerTool("alex_architecture_status",new Wn)),e.subscriptions.push(g.lm.registerTool("alex_mcp_recommendations",new Vn)),e.subscriptions.push(g.lm.registerTool("alex_user_profile",new Bn)),e.subscriptions.push(g.lm.registerTool("alex_self_actualization",new Jn)),console.log("Alex Language Model Tools registered")}var il=["(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)","(?:this works because|the reason is|what fixed it|solved by|resolved by)","(?:always remember to|never forget to|make sure to|be careful to)","(?:debugging tip|performance tip|security tip)"];function al(){return il.map(e=>new RegExp(e,"i"))}var sl=["pattern","anti-pattern","best practice","gotcha","pitfall","workaround","solution","fix","resolved","debugging","performance","optimization","security","architecture"];function rl(e){let t=e.toLowerCase(),n=0;for(let a of al())a.test(e)&&n++;let o=[];for(let a of sl)t.includes(a)&&o.push(a);let i=n*.3+o.length*.1;return{detected:i>=.3||n>=1,confidence:Math.min(i,1),keywords:o}}async function cl(e,t,n){try{let o=e.split(/[.!?]/)[0].trim(),i=o.length>10&&o.length<100?o:`Auto-captured insight - ${new Date().toISOString().split("T")[0]}`,a="general";t.includes("debugging")?a="debugging":t.includes("performance")||t.includes("optimization")?a="performance":t.includes("security")?a="security":t.includes("architecture")?a="architecture":(t.includes("pattern")||t.includes("anti-pattern"))&&(a="patterns"),await zn(i,e,a,t,n,"Auto-detected from conversation",e),lt(),console.log(`[Unconscious] Auto-saved insight: ${i}`)}catch(o){console.warn("[Unconscious] Failed to auto-save insight:",o)}}var dt=[],ll=5;function dl(e,t){dt.push(e),dt.length>ll&&dt.shift();let n=dt.join(" "),o=rl(n);o.detected&&o.confidence>=.5&&(cl(e,o.keywords,t),dt=[])}var ul=[/(?:still (?:not working|broken|failing|doesn't work)|keeps? (?:failing|breaking|crashing))/i,/(?:tried everything|nothing works|no idea|completely lost|so confused)/i,/(?:why (?:won't|doesn't|isn't)|what am i (?:doing wrong|missing))/i,/(?:ugh|argh|damn|dammit|frustrated|annoying|annoyed|stuck)/i,/(?:this is (?:impossible|ridiculous|insane|driving me crazy))/i,/(?:been (?:at this|trying|working on this) for (?:hours|days|forever))/i,/(?:same (?:error|problem|issue) (?:again|still))/i,/(?:!{2,}|\?{3,})/],ml=[/(?:it works|finally|got it|figured it out|solved it|fixed it)/i,/(?:that (?:worked|fixed it|did it)|now it (?:works|runs))/i,/(?:thank(?:s| you)|perfect|awesome|great|amazing|brilliant)/i,/(?:makes sense now|i understand|clicked for me)/i,/(?:shipped|deployed|released|launched|published)/i,/(?:passed|all (?:tests|green)|build succeeded)/i],Pe=0,Yn=0,pl=3e5;function Ja(){Pe=0,Yn=0,dt=[]}function gl(e){let t=Date.now();t-Yn>pl&&(Pe=Math.max(0,Pe-1)),Yn=t;let n=0;for(let a of ul)a.test(e)&&n++;let o=0;for(let a of ml)a.test(e)&&o++;n>0&&(Pe=Math.min(3,Pe+n)),o>0&&(Pe=Math.max(0,Pe-2));let i="none";return Pe>=3?i="high":Pe>=2?i="moderate":Pe>=1&&(i="mild"),{frustration:i,success:o>0,encouragementNeeded:i==="moderate"||i==="high",celebrationNeeded:o>=2||o>0&&Pe>0}}function fl(e){if(e.celebrationNeeded){let t=["\u{1F389} That's a win! Nice work.","\u2728 You got it! Persistence pays off.","\u{1F4AA} Solved! That was a tricky one.","\u{1F680} Success! You worked through it."];return t[Math.floor(Math.random()*t.length)]}if(e.encouragementNeeded){let t=["I can see this is frustrating. Let's take a step back and approach it differently.","Tough problem. What if we break it down into smaller pieces?","You're closer than it feels. What's the last thing that *did* work?","Debugging is hard. Let's be systematic - what have we ruled out?"];return t[Math.floor(Math.random()*t.length)]}return null}var hl=async(e,t,n,o)=>e.command==="meditate"?await wl(e,t,n,o):e.command==="dream"?await yl(e,t,n,o):e.command==="learn"?await vl(e,t,n,o):e.command==="status"?await bl(e,t,n,o):e.command==="azure"?await Sl(e,t,n,o):e.command==="m365"?await kl(e,t,n,o):e.command==="profile"?await Pl(e,t,n,o):e.command==="selfactualize"?await Il(e,t,n,o):e.command==="knowledge"?await $l(e,t,n,o):e.command==="saveinsight"?await Fl(e,t,n,o):e.command==="promote"?await Al(e,t,n,o):e.command==="knowledgestatus"?await Ml(e,t,n,o):e.command==="sync"?await Rl(e,t,n,o):e.command==="push"?await Dl(e,t,n,o):e.command==="pull"?await Ll(e,t,n,o):e.command==="docs"?await Nl(e,t,n,o):Cl(e.prompt)&&Tl(t)?await El(e,t,n,o):await xl(e,t,n,o);async function wl(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function yl(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function vl(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function bl(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=hn(),a=i.isValid&&i.rootPath?await wn(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function Sl(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function kl(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function Pl(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Xt();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function xl(e,t,n,o){let i=H.workspace.workspaceFolders,a=i?Ba.basename(i[0].uri.fsPath):void 0;dl(e.prompt,a);let s=gl(e.prompt),r=fl(s),c=await Xt(),u=t.history.filter(m=>m instanceof H.ChatRequestTurn||m instanceof H.ChatResponseTurn),l="";if(c){let m=c.nickname||c.name;l=`
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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let m=await H.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(m.length===0){let w=Wa(c);return n.markdown(`${w}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let p=m[0],h=[H.LanguageModelChatMessage.User(d),H.LanguageModelChatMessage.User(e.prompt)],y=await p.sendRequest(h,{},o);for await(let w of y.text)n.markdown(w);r&&n.markdown(`

---
*${r}*`)}catch(m){if(m instanceof H.LanguageModelError)console.error("Language model error:",m.message,m.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw m}return{metadata:{command:"general"}}}function Cl(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function Tl(e){return e.history.length===0||e.history.length<=2}async function El(e,t,n,o){let i=await Xt(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let c=await Pt();c.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):c.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=hn(),r=s.isValid&&s.rootPath?await wn(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function Il(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function $l(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

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

`),{metadata:{command:"knowledge"}};n.progress(`\u{1F50D} Searching global knowledge for: ${e.prompt}`);try{let i=await Tt(e.prompt,{limit:5});if(i.length===0)n.markdown(`## \u{1F310} No Global Knowledge Found

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
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function Fl(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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

`),{metadata:{command:"saveinsight"}}}async function Al(e,t,n,o){n.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

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
`);let i=H.workspace.workspaceFolders;if(i){let a=new H.RelativePattern(i[0],".github/domain-knowledge/DK-*.md"),s=await H.workspace.findFiles(a);if(s.length>0){n.markdown(`Found ${s.length} knowledge files:
`);for(let r of s){let c=H.workspace.asRelativePath(r);n.markdown(`- \`${c}\`
`)}}else n.markdown(`*No DK-*.md files found in this project.*
`)}return{metadata:{command:"promote"}}}async function Ml(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await Un(),a=await Kn();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

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
\`${jn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function Rl(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await rt(),a=await ct();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),a&&n.markdown(`**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function Dl(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await xt(),a=await ct();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),a&&n.markdown(`
**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function Ll(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await Ct();i.success?n.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${i.message}
`):n.markdown(`## \u274C Pull Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pulling: ${i}`)}return{metadata:{command:"pull"}}}async function Nl(e,t,n,o){return n.markdown(`## \u{1F4DA} Alex Documentation

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

`),await H.commands.executeCommand("alex.openDocs"),n.markdown(`
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`),{metadata:{command:"docs"}}}var Ol={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Ya(e){let t=H.chat.createChatParticipant("alex.cognitive",hl);return t.iconPath=H.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=Ol,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===H.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var Xn=!1;async function Et(e,t){if(Xn){I.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}Xn=!0;try{return await t()}finally{Xn=!1}}function jl(e){console.log("Alex Cognitive Architecture is now active!"),_l(e),Ya(e),Va(e),qa(e),Na(e),Oa(e),ue().then(()=>{Ga().catch(l=>{console.warn("Failed to register current project:",l)})}).catch(l=>{console.warn("Failed to initialize global knowledge directories:",l)});let t=I.commands.registerCommand("alex.initialize",async()=>{await Et("Initialize",()=>na(e))}),n=I.commands.registerCommand("alex.reset",async()=>{await Et("Reset",()=>yn(e))}),o=I.commands.registerCommand("alex.dream",async()=>{await Et("Dream Protocol",()=>Gt(e))}),i=I.commands.registerCommand("alex.upgrade",async()=>{await Et("Upgrade",()=>ca(e))}),a=I.commands.registerCommand("alex.selfActualize",async()=>{await Et("Self-Actualization",()=>Ha(e))}),s=I.commands.registerCommand("alex.syncKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let l=await rt();if(l.success){let d=await ct(),m=d?"View Gist":void 0;await I.window.showInformationMessage(`\u2705 ${l.message}`,...m?[m]:[])==="View Gist"&&d&&I.env.openExternal(I.Uri.parse(d))}else I.window.showErrorMessage(`\u274C ${l.message}`)})}),r=I.commands.registerCommand("alex.pushKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let l=await xt();l.success?I.window.showInformationMessage(`\u2705 ${l.message}`):I.window.showErrorMessage(`\u274C ${l.message}`)})}),c=I.commands.registerCommand("alex.pullKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let l=await Ct();l.success?I.window.showInformationMessage(`\u2705 ${l.message}`):I.window.showErrorMessage(`\u274C ${l.message}`)})}),u=I.commands.registerCommand("alex.openDocs",async()=>{let l=I.Uri.joinPath(e.extensionUri,"alex_docs","README.md");try{await I.commands.executeCommand("markdown.showPreview",l)}catch{let d=await I.workspace.openTextDocument(l);await I.window.showTextDocument(d)}});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a),e.subscriptions.push(s),e.subscriptions.push(r),e.subscriptions.push(c),e.subscriptions.push(u)}async function _l(e){let t="alex.lastKnownVersion",n=I.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[a]=i.split(".").map(Number),[s]=o.split(".").map(Number),r=s>a,c="Run Upgrade",u="View Changelog",l="Dismiss",d=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await I.window.showInformationMessage(d,c,u,l);if(m===c)I.commands.executeCommand("alex.upgrade");else if(m===u){let p=I.Uri.joinPath(n.extensionUri,"CHANGELOG.md");I.commands.executeCommand("markdown.showPreview",p)}}function Gl(){Ja(),console.log("Alex Cognitive Architecture deactivated")}0&&(module.exports={activate,deactivate});
