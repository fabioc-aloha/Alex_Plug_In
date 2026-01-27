"use strict";var Xa=Object.create;var It=Object.defineProperty;var Qa=Object.getOwnPropertyDescriptor;var Za=Object.getOwnPropertyNames;var es=Object.getPrototypeOf,ts=Object.prototype.hasOwnProperty;var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ns=(e,t)=>{for(var n in t)It(e,n,{get:t[n],enumerable:!0})},Yn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Za(t))!ts.call(e,i)&&i!==n&&It(e,i,{get:()=>t[i],enumerable:!(o=Qa(t,i))||o.enumerable});return e};var D=(e,t,n)=>(n=e!=null?Xa(es(e)):{},Yn(t||!e||!e.__esModule?It(n,"default",{value:e,enumerable:!0}):n,e)),os=e=>Yn(It({},"__esModule",{value:!0}),e);var oe=x(Qt=>{"use strict";Qt.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};Qt.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Qn=x((Kl,Xn)=>{var Ne=require("constants"),is=process.cwd,$t=null,as=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return $t||($t=is.call(process)),$t};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Zt=process.chdir,process.chdir=function(e){$t=null,Zt.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Zt));var Zt;Xn.exports=ss;function ss(e){Ne.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=c(e.statSync),e.fstatSync=c(e.fstatSync),e.lstatSync=c(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(l,u,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(l,u,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),as==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(l){function u(m,p,h){var v=Date.now(),w=0;l(m,p,function P(y){if(y&&(y.code==="EACCES"||y.code==="EPERM"||y.code==="EBUSY")&&Date.now()-v<6e4){setTimeout(function(){e.stat(p,function(T,N){T&&T.code==="ENOENT"?l(m,p,P):h(y)})},w),w<100&&(w+=10);return}h&&h(y)})}return Object.setPrototypeOf&&Object.setPrototypeOf(u,l),u})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(l){function u(m,p,h,v,w,P){var y;if(P&&typeof P=="function"){var T=0;y=function(N,A,W){if(N&&N.code==="EAGAIN"&&T<10)return T++,l.call(e,m,p,h,v,w,y);P.apply(this,arguments)}}return l.call(e,m,p,h,v,w,y)}return Object.setPrototypeOf&&Object.setPrototypeOf(u,l),u})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(l){return function(u,m,p,h,v){for(var w=0;;)try{return l.call(e,u,m,p,h,v)}catch(P){if(P.code==="EAGAIN"&&w<10){w++;continue}throw P}}})(e.readSync);function t(l){l.lchmod=function(u,m,p){l.open(u,Ne.O_WRONLY|Ne.O_SYMLINK,m,function(h,v){if(h){p&&p(h);return}l.fchmod(v,m,function(w){l.close(v,function(P){p&&p(w||P)})})})},l.lchmodSync=function(u,m){var p=l.openSync(u,Ne.O_WRONLY|Ne.O_SYMLINK,m),h=!0,v;try{v=l.fchmodSync(p,m),h=!1}finally{if(h)try{l.closeSync(p)}catch{}else l.closeSync(p)}return v}}function n(l){Ne.hasOwnProperty("O_SYMLINK")&&l.futimes?(l.lutimes=function(u,m,p,h){l.open(u,Ne.O_SYMLINK,function(v,w){if(v){h&&h(v);return}l.futimes(w,m,p,function(P){l.close(w,function(y){h&&h(P||y)})})})},l.lutimesSync=function(u,m,p){var h=l.openSync(u,Ne.O_SYMLINK),v,w=!0;try{v=l.futimesSync(h,m,p),w=!1}finally{if(w)try{l.closeSync(h)}catch{}else l.closeSync(h)}return v}):l.futimes&&(l.lutimes=function(u,m,p,h){h&&process.nextTick(h)},l.lutimesSync=function(){})}function o(l){return l&&function(u,m,p){return l.call(e,u,m,function(h){d(h)&&(h=null),p&&p.apply(this,arguments)})}}function i(l){return l&&function(u,m){try{return l.call(e,u,m)}catch(p){if(!d(p))throw p}}}function a(l){return l&&function(u,m,p,h){return l.call(e,u,m,p,function(v){d(v)&&(v=null),h&&h.apply(this,arguments)})}}function s(l){return l&&function(u,m,p){try{return l.call(e,u,m,p)}catch(h){if(!d(h))throw h}}}function r(l){return l&&function(u,m,p){typeof m=="function"&&(p=m,m=null);function h(v,w){w&&(w.uid<0&&(w.uid+=4294967296),w.gid<0&&(w.gid+=4294967296)),p&&p.apply(this,arguments)}return m?l.call(e,u,m,h):l.call(e,u,h)}}function c(l){return l&&function(u,m){var p=m?l.call(e,u,m):l.call(e,u);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function d(l){if(!l||l.code==="ENOSYS")return!0;var u=!process.getuid||process.getuid()!==0;return!!(u&&(l.code==="EINVAL"||l.code==="EPERM"))}}});var to=x((Ul,eo)=>{var Zn=require("stream").Stream;eo.exports=rs;function rs(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Zn.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),r=0,c=s.length;r<c;r++){var d=s[r];this[d]=i[d]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(l,u){if(l){a.emit("error",l),a.readable=!1;return}a.fd=u,a.emit("open",u),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Zn.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,r=a.length;s<r;s++){var c=a[s];this[c]=i[c]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var oo=x((zl,no)=>{"use strict";no.exports=ls;var cs=Object.getPrototypeOf||function(e){return e.__proto__};function ls(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:cs(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var Oe=x((ql,nn)=>{var J=require("fs"),ds=Qn(),us=to(),ms=oo(),Ft=require("util"),le,Mt;typeof Symbol=="function"&&typeof Symbol.for=="function"?(le=Symbol.for("graceful-fs.queue"),Mt=Symbol.for("graceful-fs.previous")):(le="___graceful-fs.queue",Mt="___graceful-fs.previous");function ps(){}function so(e,t){Object.defineProperty(e,le,{get:function(){return t}})}var Ue=ps;Ft.debuglog?Ue=Ft.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(Ue=function(){var e=Ft.format.apply(Ft,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});J[le]||(io=global[le]||[],so(J,io),J.close=(function(e){function t(n,o){return e.call(J,n,function(i){i||ao(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Mt,{value:e}),t})(J.close),J.closeSync=(function(e){function t(n){e.apply(J,arguments),ao()}return Object.defineProperty(t,Mt,{value:e}),t})(J.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){Ue(J[le]),require("assert").equal(J[le].length,0)}));var io;global[le]||so(global,J[le]);nn.exports=en(ms(J));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!J.__patched&&(nn.exports=en(J),J.__patched=!0);function en(e){ds(e),e.gracefulify=en,e.createReadStream=A,e.createWriteStream=W;var t=e.readFile;e.readFile=n;function n(b,C,F){return typeof C=="function"&&(F=C,C=null),U(b,C,F);function U(V,X,_,q){return t(V,X,function(L){L&&(L.code==="EMFILE"||L.code==="ENFILE")?Ye([U,[V,X,_],L,q||Date.now(),Date.now()]):typeof _=="function"&&_.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(b,C,F,U){return typeof F=="function"&&(U=F,F=null),V(b,C,F,U);function V(X,_,q,L,Q){return o(X,_,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([V,[X,_,q,L],G,Q||Date.now(),Date.now()]):typeof L=="function"&&L.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(b,C,F,U){return typeof F=="function"&&(U=F,F=null),V(b,C,F,U);function V(X,_,q,L,Q){return a(X,_,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([V,[X,_,q,L],G,Q||Date.now(),Date.now()]):typeof L=="function"&&L.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=c);function c(b,C,F,U){return typeof F=="function"&&(U=F,F=0),V(b,C,F,U);function V(X,_,q,L,Q){return r(X,_,q,function(G){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([V,[X,_,q,L],G,Q||Date.now(),Date.now()]):typeof L=="function"&&L.apply(this,arguments)})}}var d=e.readdir;e.readdir=u;var l=/^v[0-5]\./;function u(b,C,F){typeof C=="function"&&(F=C,C=null);var U=l.test(process.version)?function(_,q,L,Q){return d(_,V(_,q,L,Q))}:function(_,q,L,Q){return d(_,q,V(_,q,L,Q))};return U(b,C,F);function V(X,_,q,L){return function(Q,G){Q&&(Q.code==="EMFILE"||Q.code==="ENFILE")?Ye([U,[X,_,q],Q,L||Date.now(),Date.now()]):(G&&G.sort&&G.sort(),typeof q=="function"&&q.call(this,Q,G))}}}if(process.version.substr(0,4)==="v0.8"){var m=us(e);P=m.ReadStream,T=m.WriteStream}var p=e.ReadStream;p&&(P.prototype=Object.create(p.prototype),P.prototype.open=y);var h=e.WriteStream;h&&(T.prototype=Object.create(h.prototype),T.prototype.open=N),Object.defineProperty(e,"ReadStream",{get:function(){return P},set:function(b){P=b},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return T},set:function(b){T=b},enumerable:!0,configurable:!0});var v=P;Object.defineProperty(e,"FileReadStream",{get:function(){return v},set:function(b){v=b},enumerable:!0,configurable:!0});var w=T;Object.defineProperty(e,"FileWriteStream",{get:function(){return w},set:function(b){w=b},enumerable:!0,configurable:!0});function P(b,C){return this instanceof P?(p.apply(this,arguments),this):P.apply(Object.create(P.prototype),arguments)}function y(){var b=this;ne(b.path,b.flags,b.mode,function(C,F){C?(b.autoClose&&b.destroy(),b.emit("error",C)):(b.fd=F,b.emit("open",F),b.read())})}function T(b,C){return this instanceof T?(h.apply(this,arguments),this):T.apply(Object.create(T.prototype),arguments)}function N(){var b=this;ne(b.path,b.flags,b.mode,function(C,F){C?(b.destroy(),b.emit("error",C)):(b.fd=F,b.emit("open",F))})}function A(b,C){return new e.ReadStream(b,C)}function W(b,C){return new e.WriteStream(b,C)}var te=e.open;e.open=ne;function ne(b,C,F,U){return typeof F=="function"&&(U=F,F=null),V(b,C,F,U);function V(X,_,q,L,Q){return te(X,_,q,function(G,$){G&&(G.code==="EMFILE"||G.code==="ENFILE")?Ye([V,[X,_,q,L],G,Q||Date.now(),Date.now()]):typeof L=="function"&&L.apply(this,arguments)})}}return e}function Ye(e){Ue("ENQUEUE",e[0].name,e[1]),J[le].push(e),tn()}var At;function ao(){for(var e=Date.now(),t=0;t<J[le].length;++t)J[le][t].length>2&&(J[le][t][3]=e,J[le][t][4]=e);tn()}function tn(){if(clearTimeout(At),At=void 0,J[le].length!==0){var e=J[le].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)Ue("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){Ue("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var r=Date.now()-a,c=Math.max(a-i,1),d=Math.min(c*1.2,100);r>=d?(Ue("RETRY",t.name,n),t.apply(null,n.concat([i]))):J[le].push(e)}At===void 0&&(At=setTimeout(tn,0))}}});var pe=x(Ie=>{"use strict";var ro=oe().fromCallback,me=Oe(),gs=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof me[e]=="function");Object.assign(Ie,me);gs.forEach(e=>{Ie[e]=ro(me[e])});Ie.exists=function(e,t){return typeof t=="function"?me.exists(e,t):new Promise(n=>me.exists(e,n))};Ie.read=function(e,t,n,o,i,a){return typeof a=="function"?me.read(e,t,n,o,i,a):new Promise((s,r)=>{me.read(e,t,n,o,i,(c,d,l)=>{if(c)return r(c);s({bytesRead:d,buffer:l})})})};Ie.write=function(e,t,...n){return typeof n[n.length-1]=="function"?me.write(e,t,...n):new Promise((o,i)=>{me.write(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffer:r})})})};Ie.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?me.readv(e,t,...n):new Promise((o,i)=>{me.readv(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesRead:s,buffers:r})})})};Ie.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?me.writev(e,t,...n):new Promise((o,i)=>{me.writev(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffers:r})})})};typeof me.realpath.native=="function"?Ie.realpath.native=ro(me.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var lo=x((Wl,co)=>{"use strict";var fs=require("path");co.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(fs.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var go=x((Vl,on)=>{"use strict";var uo=pe(),{checkPath:mo}=lo(),po=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};on.exports.makeDir=async(e,t)=>(mo(e),uo.mkdir(e,{mode:po(t),recursive:!0}));on.exports.makeDirSync=(e,t)=>(mo(e),uo.mkdirSync(e,{mode:po(t),recursive:!0}))});var Se=x((Bl,fo)=>{"use strict";var hs=oe().fromPromise,{makeDir:ws,makeDirSync:an}=go(),sn=hs(ws);fo.exports={mkdirs:sn,mkdirsSync:an,mkdirp:sn,mkdirpSync:an,ensureDir:sn,ensureDirSync:an}});var je=x((Jl,wo)=>{"use strict";var ys=oe().fromPromise,ho=pe();function vs(e){return ho.access(e).then(()=>!0).catch(()=>!1)}wo.exports={pathExists:ys(vs),pathExistsSync:ho.existsSync}});var rn=x((Yl,yo)=>{"use strict";var Xe=pe(),bs=oe().fromPromise;async function Ss(e,t,n){let o=await Xe.open(e,"r+"),i=null;try{await Xe.futimes(o,t,n)}finally{try{await Xe.close(o)}catch(a){i=a}}if(i)throw i}function ks(e,t,n){let o=Xe.openSync(e,"r+");return Xe.futimesSync(o,t,n),Xe.closeSync(o)}yo.exports={utimesMillis:bs(Ss),utimesMillisSync:ks}});var ze=x((Xl,ko)=>{"use strict";var Qe=pe(),ie=require("path"),vo=oe().fromPromise;function Ps(e,t,n){let o=n.dereference?i=>Qe.stat(i,{bigint:!0}):i=>Qe.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function xs(e,t,n){let o,i=n.dereference?s=>Qe.statSync(s,{bigint:!0}):s=>Qe.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function Cs(e,t,n,o){let{srcStat:i,destStat:a}=await Ps(e,t,o);if(a){if(dt(i,a)){let s=ie.basename(e),r=ie.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&cn(e,t))throw new Error(Rt(e,t,n));return{srcStat:i,destStat:a}}function Ts(e,t,n,o){let{srcStat:i,destStat:a}=xs(e,t,o);if(a){if(dt(i,a)){let s=ie.basename(e),r=ie.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&cn(e,t))throw new Error(Rt(e,t,n));return{srcStat:i,destStat:a}}async function bo(e,t,n,o){let i=ie.resolve(ie.dirname(e)),a=ie.resolve(ie.dirname(n));if(a===i||a===ie.parse(a).root)return;let s;try{s=await Qe.stat(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(dt(t,s))throw new Error(Rt(e,n,o));return bo(e,t,a,o)}function So(e,t,n,o){let i=ie.resolve(ie.dirname(e)),a=ie.resolve(ie.dirname(n));if(a===i||a===ie.parse(a).root)return;let s;try{s=Qe.statSync(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(dt(t,s))throw new Error(Rt(e,n,o));return So(e,t,a,o)}function dt(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function cn(e,t){let n=ie.resolve(e).split(ie.sep).filter(i=>i),o=ie.resolve(t).split(ie.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function Rt(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}ko.exports={checkPaths:vo(Cs),checkPathsSync:Ts,checkParentPaths:vo(bo),checkParentPathsSync:So,isSrcSubdir:cn,areIdentical:dt}});var xo=x((Ql,Po)=>{"use strict";async function Es(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}Po.exports={asyncIteratorConcurrentProcess:Es}});var $o=x((Zl,Io)=>{"use strict";var de=pe(),ut=require("path"),{mkdirs:Is}=Se(),{pathExists:$s}=je(),{utimesMillis:Fs}=rn(),mt=ze(),{asyncIteratorConcurrentProcess:As}=xo();async function Ms(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await mt.checkPaths(e,t,"copy",n);if(await mt.checkParentPaths(e,o,t,"copy"),!await To(e,t,n))return;let s=ut.dirname(t);await $s(s)||await Is(s),await Eo(i,e,t,n)}async function To(e,t,n){return n.filter?n.filter(e,t):!0}async function Eo(e,t,n,o){let a=await(o.dereference?de.stat:de.lstat)(t);if(a.isDirectory())return Ns(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Rs(a,e,t,n,o);if(a.isSymbolicLink())return Os(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function Rs(e,t,n,o,i){if(!t)return Co(e,n,o,i);if(i.overwrite)return await de.unlink(o),Co(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function Co(e,t,n,o){if(await de.copyFile(t,n),o.preserveTimestamps){Ds(e.mode)&&await Ls(n,e.mode);let i=await de.stat(t);await Fs(n,i.atime,i.mtime)}return de.chmod(n,e.mode)}function Ds(e){return(e&128)===0}function Ls(e,t){return de.chmod(e,t|128)}async function Ns(e,t,n,o,i){t||await de.mkdir(o),await As(await de.opendir(n),async a=>{let s=ut.join(n,a.name),r=ut.join(o,a.name);if(await To(s,r,i)){let{destStat:d}=await mt.checkPaths(s,r,"copy",i);await Eo(d,s,r,i)}}),t||await de.chmod(o,e.mode)}async function Os(e,t,n,o){let i=await de.readlink(t);if(o.dereference&&(i=ut.resolve(process.cwd(),i)),!e)return de.symlink(i,n);let a=null;try{a=await de.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return de.symlink(i,n);throw s}if(o.dereference&&(a=ut.resolve(process.cwd(),a)),i!==a){if(mt.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(mt.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await de.unlink(n),de.symlink(i,n)}Io.exports=Ms});var Do=x((ed,Ro)=>{"use strict";var ge=Oe(),pt=require("path"),js=Se().mkdirsSync,_s=rn().utimesMillisSync,gt=ze();function Gs(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=gt.checkPathsSync(e,t,"copy",n);if(gt.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=pt.dirname(t);return ge.existsSync(a)||js(a),Fo(i,e,t,n)}function Fo(e,t,n,o){let a=(o.dereference?ge.statSync:ge.lstatSync)(t);if(a.isDirectory())return Vs(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return Ks(a,e,t,n,o);if(a.isSymbolicLink())return Ys(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Ks(e,t,n,o,i){return t?Us(e,n,o,i):Ao(e,n,o,i)}function Us(e,t,n,o){if(o.overwrite)return ge.unlinkSync(n),Ao(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Ao(e,t,n,o){return ge.copyFileSync(t,n),o.preserveTimestamps&&zs(e.mode,t,n),ln(n,e.mode)}function zs(e,t,n){return qs(e)&&Hs(n,e),Ws(t,n)}function qs(e){return(e&128)===0}function Hs(e,t){return ln(e,t|128)}function ln(e,t){return ge.chmodSync(e,t)}function Ws(e,t){let n=ge.statSync(e);return _s(t,n.atime,n.mtime)}function Vs(e,t,n,o,i){return t?Mo(n,o,i):Bs(e.mode,n,o,i)}function Bs(e,t,n,o){return ge.mkdirSync(n),Mo(t,n,o),ln(n,e)}function Mo(e,t,n){let o=ge.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Js(i.name,e,t,n)}finally{o.closeSync()}}function Js(e,t,n,o){let i=pt.join(t,e),a=pt.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=gt.checkPathsSync(i,a,"copy",o);return Fo(s,i,a,o)}function Ys(e,t,n,o){let i=ge.readlinkSync(t);if(o.dereference&&(i=pt.resolve(process.cwd(),i)),e){let a;try{a=ge.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return ge.symlinkSync(i,n);throw s}if(o.dereference&&(a=pt.resolve(process.cwd(),a)),i!==a){if(gt.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(gt.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Xs(i,n)}else return ge.symlinkSync(i,n)}function Xs(e,t){return ge.unlinkSync(t),ge.symlinkSync(e,t)}Ro.exports=Gs});var Dt=x((td,Lo)=>{"use strict";var Qs=oe().fromPromise;Lo.exports={copy:Qs($o()),copySync:Do()}});var ft=x((nd,Oo)=>{"use strict";var No=Oe(),Zs=oe().fromCallback;function er(e,t){No.rm(e,{recursive:!0,force:!0},t)}function tr(e){No.rmSync(e,{recursive:!0,force:!0})}Oo.exports={remove:Zs(er),removeSync:tr}});var Ho=x((od,qo)=>{"use strict";var nr=oe().fromPromise,Go=pe(),Ko=require("path"),Uo=Se(),zo=ft(),jo=nr(async function(t){let n;try{n=await Go.readdir(t)}catch{return Uo.mkdirs(t)}return Promise.all(n.map(o=>zo.remove(Ko.join(t,o))))});function _o(e){let t;try{t=Go.readdirSync(e)}catch{return Uo.mkdirsSync(e)}t.forEach(n=>{n=Ko.join(e,n),zo.removeSync(n)})}qo.exports={emptyDirSync:_o,emptydirSync:_o,emptyDir:jo,emptydir:jo}});var Jo=x((id,Bo)=>{"use strict";var or=oe().fromPromise,Wo=require("path"),$e=pe(),Vo=Se();async function ir(e){let t;try{t=await $e.stat(e)}catch{}if(t&&t.isFile())return;let n=Wo.dirname(e),o=null;try{o=await $e.stat(n)}catch(i){if(i.code==="ENOENT"){await Vo.mkdirs(n),await $e.writeFile(e,"");return}else throw i}o.isDirectory()?await $e.writeFile(e,""):await $e.readdir(n)}function ar(e){let t;try{t=$e.statSync(e)}catch{}if(t&&t.isFile())return;let n=Wo.dirname(e);try{$e.statSync(n).isDirectory()||$e.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")Vo.mkdirsSync(n);else throw o}$e.writeFileSync(e,"")}Bo.exports={createFile:or(ir),createFileSync:ar}});var ei=x((ad,Zo)=>{"use strict";var sr=oe().fromPromise,Yo=require("path"),_e=pe(),Xo=Se(),{pathExists:rr}=je(),{areIdentical:Qo}=ze();async function cr(e,t){let n;try{n=await _e.lstat(t)}catch{}let o;try{o=await _e.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Qo(o,n))return;let i=Yo.dirname(t);await rr(i)||await Xo.mkdirs(i),await _e.link(e,t)}function lr(e,t){let n;try{n=_e.lstatSync(t)}catch{}try{let a=_e.lstatSync(e);if(n&&Qo(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=Yo.dirname(t);return _e.existsSync(o)||Xo.mkdirsSync(o),_e.linkSync(e,t)}Zo.exports={createLink:sr(cr),createLinkSync:lr}});var ni=x((sd,ti)=>{"use strict";var Ge=require("path"),ht=pe(),{pathExists:dr}=je(),ur=oe().fromPromise;async function mr(e,t){if(Ge.isAbsolute(e)){try{await ht.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=Ge.dirname(t),o=Ge.join(n,e);if(await dr(o))return{toCwd:o,toDst:e};try{await ht.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:Ge.relative(n,e)}}function pr(e,t){if(Ge.isAbsolute(e)){if(!ht.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=Ge.dirname(t),o=Ge.join(n,e);if(ht.existsSync(o))return{toCwd:o,toDst:e};if(!ht.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:Ge.relative(n,e)}}ti.exports={symlinkPaths:ur(mr),symlinkPathsSync:pr}});var ai=x((rd,ii)=>{"use strict";var oi=pe(),gr=oe().fromPromise;async function fr(e,t){if(t)return t;let n;try{n=await oi.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function hr(e,t){if(t)return t;let n;try{n=oi.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}ii.exports={symlinkType:gr(fr),symlinkTypeSync:hr}});var li=x((cd,ci)=>{"use strict";var wr=oe().fromPromise,si=require("path"),Pe=pe(),{mkdirs:yr,mkdirsSync:vr}=Se(),{symlinkPaths:br,symlinkPathsSync:Sr}=ni(),{symlinkType:kr,symlinkTypeSync:Pr}=ai(),{pathExists:xr}=je(),{areIdentical:ri}=ze();async function Cr(e,t,n){let o;try{o=await Pe.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,c]=await Promise.all([Pe.stat(e),Pe.stat(t)]);if(ri(r,c))return}let i=await br(e,t);e=i.toDst;let a=await kr(i.toCwd,n),s=si.dirname(t);return await xr(s)||await yr(s),Pe.symlink(e,t,a)}function Tr(e,t,n){let o;try{o=Pe.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=Pe.statSync(e),c=Pe.statSync(t);if(ri(r,c))return}let i=Sr(e,t);e=i.toDst,n=Pr(i.toCwd,n);let a=si.dirname(t);return Pe.existsSync(a)||vr(a),Pe.symlinkSync(e,t,n)}ci.exports={createSymlink:wr(Cr),createSymlinkSync:Tr}});var wi=x((ld,hi)=>{"use strict";var{createFile:di,createFileSync:ui}=Jo(),{createLink:mi,createLinkSync:pi}=ei(),{createSymlink:gi,createSymlinkSync:fi}=li();hi.exports={createFile:di,createFileSync:ui,ensureFile:di,ensureFileSync:ui,createLink:mi,createLinkSync:pi,ensureLink:mi,ensureLinkSync:pi,createSymlink:gi,createSymlinkSync:fi,ensureSymlink:gi,ensureSymlinkSync:fi}});var Lt=x((dd,yi)=>{function Er(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function Ir(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}yi.exports={stringify:Er,stripBom:Ir}});var ki=x((ud,Si)=>{var Ze;try{Ze=Oe()}catch{Ze=require("fs")}var Nt=oe(),{stringify:vi,stripBom:bi}=Lt();async function $r(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Ze,o="throws"in t?t.throws:!0,i=await Nt.fromCallback(n.readFile)(e,t);i=bi(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var Fr=Nt.fromPromise($r);function Ar(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||Ze,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=bi(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function Mr(e,t,n={}){let o=n.fs||Ze,i=vi(t,n);await Nt.fromCallback(o.writeFile)(e,i,n)}var Rr=Nt.fromPromise(Mr);function Dr(e,t,n={}){let o=n.fs||Ze,i=vi(t,n);return o.writeFileSync(e,i,n)}Si.exports={readFile:Fr,readFileSync:Ar,writeFile:Rr,writeFileSync:Dr}});var xi=x((md,Pi)=>{"use strict";var Ot=ki();Pi.exports={readJson:Ot.readFile,readJsonSync:Ot.readFileSync,writeJson:Ot.writeFile,writeJsonSync:Ot.writeFileSync}});var jt=x((pd,Ei)=>{"use strict";var Lr=oe().fromPromise,dn=pe(),Ci=require("path"),Ti=Se(),Nr=je().pathExists;async function Or(e,t,n="utf-8"){let o=Ci.dirname(e);return await Nr(o)||await Ti.mkdirs(o),dn.writeFile(e,t,n)}function jr(e,...t){let n=Ci.dirname(e);dn.existsSync(n)||Ti.mkdirsSync(n),dn.writeFileSync(e,...t)}Ei.exports={outputFile:Lr(Or),outputFileSync:jr}});var $i=x((gd,Ii)=>{"use strict";var{stringify:_r}=Lt(),{outputFile:Gr}=jt();async function Kr(e,t,n={}){let o=_r(t,n);await Gr(e,o,n)}Ii.exports=Kr});var Ai=x((fd,Fi)=>{"use strict";var{stringify:Ur}=Lt(),{outputFileSync:zr}=jt();function qr(e,t,n){let o=Ur(t,n);zr(e,o,n)}Fi.exports=qr});var Ri=x((hd,Mi)=>{"use strict";var Hr=oe().fromPromise,fe=xi();fe.outputJson=Hr($i());fe.outputJsonSync=Ai();fe.outputJSON=fe.outputJson;fe.outputJSONSync=fe.outputJsonSync;fe.writeJSON=fe.writeJson;fe.writeJSONSync=fe.writeJsonSync;fe.readJSON=fe.readJson;fe.readJSONSync=fe.readJsonSync;Mi.exports=fe});var ji=x((wd,Oi)=>{"use strict";var Wr=pe(),Di=require("path"),{copy:Vr}=Dt(),{remove:Ni}=ft(),{mkdirp:Br}=Se(),{pathExists:Jr}=je(),Li=ze();async function Yr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await Li.checkPaths(e,t,"move",n);await Li.checkParentPaths(e,i,t,"move");let s=Di.dirname(t);return Di.parse(s).root!==s&&await Br(s),Xr(e,t,o,a)}async function Xr(e,t,n,o){if(!o){if(n)await Ni(t);else if(await Jr(t))throw new Error("dest already exists.")}try{await Wr.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Qr(e,t,n)}}async function Qr(e,t,n){return await Vr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Ni(e)}Oi.exports=Yr});var zi=x((yd,Ui)=>{"use strict";var Gi=Oe(),mn=require("path"),Zr=Dt().copySync,Ki=ft().removeSync,ec=Se().mkdirpSync,_i=ze();function tc(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=_i.checkPathsSync(e,t,"move",n);return _i.checkParentPathsSync(e,i,t,"move"),nc(t)||ec(mn.dirname(t)),oc(e,t,o,a)}function nc(e){let t=mn.dirname(e);return mn.parse(t).root===t}function oc(e,t,n,o){if(o)return un(e,t,n);if(n)return Ki(t),un(e,t,n);if(Gi.existsSync(t))throw new Error("dest already exists.");return un(e,t,n)}function un(e,t,n){try{Gi.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return ic(e,t,n)}}function ic(e,t,n){return Zr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Ki(e)}Ui.exports=tc});var Hi=x((vd,qi)=>{"use strict";var ac=oe().fromPromise;qi.exports={move:ac(ji()),moveSync:zi()}});var Fe=x((bd,Wi)=>{"use strict";Wi.exports={...pe(),...Dt(),...Ho(),...wi(),...Ri(),...Se(),...Hi(),...jt(),...je(),...ft()}});var ca=x((Dd,ra)=>{function ve(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}ra.exports=ve;ve.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};ve.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};ve.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};ve.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};ve.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};ve.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};ve.prototype.start=ve.prototype.try;ve.prototype.errors=function(){return this._errors};ve.prototype.attempts=function(){return this._attempts};ve.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],a=i.message,s=(e[a]||0)+1;e[a]=s,s>=n&&(t=i,n=s)}return t}});var la=x(He=>{var bc=ca();He.operation=function(e){var t=He.timeouts(e);return new bc(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};He.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(a,s){return a-s}),o};He.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};He.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(c){var d=He.operation(t),l=Array.prototype.slice.call(arguments,1),u=l.pop();l.push(function(m){d.retry(m)||(m&&(arguments[0]=d.mainError()),u.apply(this,arguments))}),d.attempt(function(){c.apply(e,l)})}.bind(e,s),e[a].options=t}}});var ua=x((Nd,da)=>{da.exports=la()});var ma=x((Od,Gt)=>{Gt.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Gt.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Gt.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var wa=x((jd,ot)=>{var B=global.process,We=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};We(B)?(pa=require("assert"),tt=ma(),ga=/^win/i.test(B.platform),yt=require("events"),typeof yt!="function"&&(yt=yt.EventEmitter),B.__signal_exit_emitter__?se=B.__signal_exit_emitter__:(se=B.__signal_exit_emitter__=new yt,se.count=0,se.emitted={}),se.infinite||(se.setMaxListeners(1/0),se.infinite=!0),ot.exports=function(e,t){if(!We(global.process))return function(){};pa.equal(typeof e,"function","a callback must be provided for exit handler"),nt===!1&&wn();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){se.removeListener(n,e),se.listeners("exit").length===0&&se.listeners("afterexit").length===0&&Kt()};return se.on(n,e),o},Kt=function(){!nt||!We(global.process)||(nt=!1,tt.forEach(function(t){try{B.removeListener(t,Ut[t])}catch{}}),B.emit=zt,B.reallyExit=yn,se.count-=1)},ot.exports.unload=Kt,Ve=function(t,n,o){se.emitted[t]||(se.emitted[t]=!0,se.emit(t,n,o))},Ut={},tt.forEach(function(e){Ut[e]=function(){if(We(global.process)){var n=B.listeners(e);n.length===se.count&&(Kt(),Ve("exit",null,e),Ve("afterexit",null,e),ga&&e==="SIGHUP"&&(e="SIGINT"),B.kill(B.pid,e))}}}),ot.exports.signals=function(){return tt},nt=!1,wn=function(){nt||!We(global.process)||(nt=!0,se.count+=1,tt=tt.filter(function(t){try{return B.on(t,Ut[t]),!0}catch{return!1}}),B.emit=ha,B.reallyExit=fa)},ot.exports.load=wn,yn=B.reallyExit,fa=function(t){We(global.process)&&(B.exitCode=t||0,Ve("exit",B.exitCode,null),Ve("afterexit",B.exitCode,null),yn.call(B,B.exitCode))},zt=B.emit,ha=function(t,n){if(t==="exit"&&We(global.process)){n!==void 0&&(B.exitCode=n);var o=zt.apply(this,arguments);return Ve("exit",B.exitCode,null),Ve("afterexit",B.exitCode,null),o}else return zt.apply(this,arguments)}):ot.exports=function(){return function(){}};var pa,tt,ga,yt,se,Kt,Ve,Ut,nt,wn,yn,fa,zt,ha});var va=x((_d,vn)=>{"use strict";var ya=Symbol();function Sc(e,t,n){let o=t[ya];if(o)return t.stat(e,(a,s)=>{if(a)return n(a);n(null,s.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,a=>{if(a)return n(a);t.stat(e,(s,r)=>{if(s)return n(s);let c=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,ya,{value:c}),n(null,r.mtime,c)})})}function kc(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}vn.exports.probe=Sc;vn.exports.getMtime=kc});var xa=x((Gd,bt)=>{"use strict";var Pc=require("path"),kn=Oe(),xc=ua(),Cc=wa(),ba=va(),Re={};function vt(e,t){return t.lockfilePath||`${e}.lock`}function Pn(e,t,n){if(!t.realpath)return n(null,Pc.resolve(e));t.fs.realpath(e,n)}function Sn(e,t,n){let o=vt(e,t);t.fs.mkdir(o,i=>{if(!i)return ba.probe(o,t.fs,(a,s,r)=>{if(a)return t.fs.rmdir(o,()=>{}),n(a);n(null,s,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(a,s)=>{if(a)return a.code==="ENOENT"?Sn(e,{...t,stale:0},n):n(a);if(!Sa(s,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));ka(e,t,r=>{if(r)return n(r);Sn(e,{...t,stale:0},n)})})})}function Sa(e,t){return e.mtime.getTime()<Date.now()-t.stale}function ka(e,t,n){t.fs.rmdir(vt(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function qt(e,t){let n=Re[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let a=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||a?bn(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,qt(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return bn(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=ba.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,c=>{let d=n.lastUpdate+t.stale<Date.now();if(!n.released){if(c)return c.code==="ENOENT"||d?bn(e,n,Object.assign(c,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,qt(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,qt(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function bn(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),Re[e]===t&&delete Re[e],t.options.onCompromised(n)}function Tc(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:kn,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),Pn(e,t,(o,i)=>{if(o)return n(o);let a=xc.operation(t.retries);a.attempt(()=>{Sn(i,t,(s,r,c)=>{if(a.retry(s))return;if(s)return n(a.mainError());let d=Re[i]={lockfilePath:vt(i,t),mtime:r,mtimePrecision:c,options:t,lastUpdate:Date.now()};qt(i,t),n(null,l=>{if(d.released)return l&&l(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));Pa(i,{...t,realpath:!1},l)})})})})}function Pa(e,t,n){t={fs:kn,realpath:!0,...t},Pn(e,t,(o,i)=>{if(o)return n(o);let a=Re[i];if(!a)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));a.updateTimeout&&clearTimeout(a.updateTimeout),a.released=!0,delete Re[i],ka(i,t,n)})}function Ec(e,t,n){t={stale:1e4,realpath:!0,fs:kn,...t},t.stale=Math.max(t.stale||0,2e3),Pn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(vt(i,t),(a,s)=>a?a.code==="ENOENT"?n(null,!1):n(a):n(null,!Sa(s,t)))})}function Ic(){return Re}Cc(()=>{for(let e in Re){let t=Re[e].options;try{t.fs.rmdirSync(vt(e,t))}catch{}}});bt.exports.lock=Tc;bt.exports.unlock=Pa;bt.exports.check=Ec;bt.exports.getLocks=Ic});var Ta=x((Kd,Ca)=>{"use strict";var $c=Oe();function Fc(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let a=i.pop(),s;try{s=e[`${o}Sync`](...i)}catch(r){return a(r)}a(null,s)}}),n}function Ac(e){return(...t)=>new Promise((n,o)=>{t.push((i,a)=>{i?o(i):n(a)}),e(...t)})}function Mc(e){return(...t)=>{let n,o;if(t.push((i,a)=>{n=i,o=a}),e(...t),n)throw n;return o}}function Rc(e){if(e={...e},e.fs=Fc(e.fs||$c),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}Ca.exports={toPromise:Ac,toSync:Mc,toSyncOptions:Rc}});var Ia=x((Ud,Ke)=>{"use strict";var it=xa(),{toPromise:Ht,toSync:Wt,toSyncOptions:xn}=Ta();async function Ea(e,t){let n=await Ht(it.lock)(e,t);return Ht(n)}function Dc(e,t){let n=Wt(it.lock)(e,xn(t));return Wt(n)}function Lc(e,t){return Ht(it.unlock)(e,t)}function Nc(e,t){return Wt(it.unlock)(e,xn(t))}function Oc(e,t){return Ht(it.check)(e,t)}function jc(e,t){return Wt(it.check)(e,xn(t))}Ke.exports=Ea;Ke.exports.lock=Ea;Ke.exports.unlock=Lc;Ke.exports.lockSync=Dc;Ke.exports.unlockSync=Nc;Ke.exports.check=Oc;Ke.exports.checkSync=jc});var jl={};ns(jl,{activate:()=>Ll,deactivate:()=>Ol});module.exports=os(jl);var I=D(require("vscode"));var Z=D(require("vscode")),K=D(Fe()),E=D(require("path")),Qi=D(require("crypto"));var qe=D(require("vscode")),et=D(Fe()),_t=D(require("path"));var Vi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,Bi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ae=".alex",Ji={root:Ae,knowledge:`${Ae}/global-knowledge`,patterns:`${Ae}/global-knowledge/patterns`,insights:`${Ae}/global-knowledge/insights`,index:`${Ae}/global-knowledge/index.json`,projectRegistry:`${Ae}/project-registry.json`,globalProfile:`${Ae}/user-profile.json`},pn={pattern:"GK-",insight:"GI-"};function gn(){let e=qe.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function Me(e=!0){let t=qe.workspace.workspaceFolders;if(!t||t.length===0)return{found:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."};if(t.length===1){let i=t[0];return e&&!await Yi(i.uri.fsPath)?{found:!1,error:'Alex is not installed in this workspace. Run "Alex: Initialize Architecture" first.'}:{found:!0,rootPath:i.uri.fsPath,workspaceFolder:i}}let n=[];for(let i of t)await Yi(i.uri.fsPath)&&n.push(i);if(!e){let i=await qe.window.showQuickPick(t.map(a=>({label:a.name,description:a.uri.fsPath,folder:a})),{placeHolder:"Select a workspace folder to initialize Alex in",title:"Initialize Alex - Select Folder"});return i?{found:!0,rootPath:i.folder.uri.fsPath,workspaceFolder:i.folder}:{found:!1,cancelled:!0}}if(n.length===0)return{found:!1,error:'Alex is not installed in any workspace folder. Run "Alex: Initialize Architecture" first.'};if(n.length===1)return{found:!0,rootPath:n[0].uri.fsPath,workspaceFolder:n[0]};let o=await qe.window.showQuickPick(n.map(i=>({label:i.name,description:i.uri.fsPath,folder:i})),{placeHolder:"Multiple folders have Alex installed. Select one:",title:"Alex - Select Workspace Folder"});return o?{found:!0,rootPath:o.folder.uri.fsPath,workspaceFolder:o.folder}:{found:!1,cancelled:!0}}async function fn(e,t=!1){let n=_t.join(e,".github","copilot-instructions.md");if(!await et.pathExists(n))return null;try{let o=await et.readFile(n,"utf8"),i=t?Bi:Vi,a=o.match(i);return a?a[1]:null}catch{return null}}async function Yi(e){let t=_t.join(e,".github","copilot-instructions.md");return et.pathExists(t)}function Xi(e){return Qi.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}function sc(e){return E.join(e,".github","config","alex-manifest.json")}async function Zi(e){let t=await Me(!1);if(!t.found){if(t.cancelled)return;Z.window.showErrorMessage(t.error||"No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t.rootPath,o=E.join(n,".github","copilot-instructions.md");if(await K.pathExists(o)){let i=await Z.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await Z.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await hn(e);return}await ea(e,n,!1)}async function hn(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;Z.window.showErrorMessage(t.error||"Please open a workspace folder with Alex installed to reset.");return}let n=t.rootPath,o=await Z.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await Z.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[E.join(n,".github","copilot-instructions.md"),E.join(n,".github","instructions"),E.join(n,".github","prompts"),E.join(n,".github","episodic"),E.join(n,".github","domain-knowledge"),E.join(n,".github","config"),E.join(n,".alex-manifest.json")];try{await Z.window.withProgress({location:Z.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await K.remove(s)}),await ea(e,n,!0)}catch(a){Z.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function ea(e,t,n){let o=e.extensionPath,i=E.join(o,".github","copilot-instructions.md");if(!await K.pathExists(i)){Z.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:E.join(o,".github","copilot-instructions.md"),dest:E.join(t,".github","copilot-instructions.md")},{src:E.join(o,".github","instructions"),dest:E.join(t,".github","instructions")},{src:E.join(o,".github","prompts"),dest:E.join(t,".github","prompts")},{src:E.join(o,".github","episodic"),dest:E.join(t,".github","episodic")},{src:E.join(o,".github","domain-knowledge"),dest:E.join(t,".github","domain-knowledge")},{src:E.join(o,".github","config"),dest:E.join(t,".github","config")},{src:E.join(o,".github","agents"),dest:E.join(t,".github","agents")}];try{let s=E.join(t,".github");await K.ensureDir(s);let r=E.join(s,".write-test");try{await K.writeFile(r,"test"),await K.remove(r)}catch(d){throw new Error(`Cannot write to workspace - check folder permissions: ${d.message}`)}await Z.window.withProgress({location:Z.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async d=>{for(let l of a)d.report({message:`Copying ${E.basename(l.dest)}...`}),await K.pathExists(l.src)?await K.copy(l.src,l.dest,{overwrite:n}):console.warn(`Source not found: ${l.src}`);d.report({message:"Creating manifest..."}),await cc(e,t)});let c=await Z.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(c==="Open Main Brain File"){let d=E.join(t,".github","copilot-instructions.md"),l=await Z.workspace.openTextDocument(d);await Z.window.showTextDocument(l)}else c==="Run Dream Protocol"&&await Z.commands.executeCommand("alex.dream")}catch(s){Z.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}function rc(e){return E.join(e,".alex-manifest.json")}async function cc(e,t){let n=e.extensionPath,o=rc(t);await K.pathExists(o)&&(await K.remove(o),console.log("Removed legacy manifest from root"));let i="0.0.0";try{i=(await K.readJson(E.join(n,"package.json"))).version||"0.0.0"}catch{console.warn("Could not read extension version")}let a={version:i,installedAt:new Date().toISOString(),files:{}},s=[{dir:E.join(t,".github","instructions"),prefix:".github/instructions"},{dir:E.join(t,".github","prompts"),prefix:".github/prompts"},{dir:E.join(t,".github","domain-knowledge"),prefix:".github/domain-knowledge"},{dir:E.join(t,".github","agents"),prefix:".github/agents"}],r=E.join(t,".github","copilot-instructions.md");if(await K.pathExists(r)){let d=await K.readFile(r,"utf8");a.files[".github/copilot-instructions.md"]={type:"system",originalChecksum:Xi(d)}}for(let{dir:d,prefix:l}of s)if(await K.pathExists(d)){let u=await K.readdir(d);for(let m of u)if(m.endsWith(".md")){let p=E.join(d,m),h=await K.readFile(p,"utf8");a.files[`${l}/${m}`]={type:"system",originalChecksum:Xi(h)}}}let c=sc(t);await K.ensureDir(E.dirname(c)),await K.writeJson(c,a,{spaces:2})}var ae=D(require("vscode")),ke=D(Fe()),we=D(require("path"));var ta={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function na(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;ae.window.showErrorMessage(t.error||"No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t.rootPath,o=t.workspaceFolder;await ae.window.withProgress({location:ae.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async i=>{i.report({message:"Scanning neural network..."});let a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=[];for(let y of a){let T=new ae.RelativePattern(o,y),N=await ae.workspace.findFiles(T);s=s.concat(N.map(A=>A.fsPath))}if(s=[...new Set(s)],s.length===0){await ae.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await ae.commands.executeCommand("alex.initialize");return}let r=[],c=new Set(s.map(y=>we.normalize(y).toLowerCase())),d=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let y of s){let T;try{T=await ke.readFile(y,"utf-8")}catch(W){console.error(`Failed to read file ${y}:`,W);continue}let N=T.split(`
`),A=!1;for(let W=0;W<N.length;W++){let te=N[W];if(te.trim().startsWith("```")){A=!A;continue}if(A)continue;let ne;for(;(ne=d.exec(te))!==null;){let b=ne[1].trim(),C=Array.from(c).some(U=>U.endsWith(we.normalize(b).toLowerCase()));if(!C){let U=we.join(n,b);(await ke.pathExists(U)||(await ae.workspace.findFiles(new ae.RelativePattern(o,`**/${b}`))).length>0)&&(C=!0)}if(!C){let U=we.dirname(y),V=we.join(U,b);await ke.pathExists(V)&&(C=!0)}["target-file.md","CHANGELOG.md"].includes(b)&&(C=!0),r.push({sourceFile:y,targetFile:b,strength:ne[2].trim(),type:ne[3]?.trim()||"association",direction:ne[4]?.trim()||"unidirectional",condition:ne[5]?.trim(),line:W+1,isValid:C})}}}let l=r.filter(y=>!y.isValid),u=new Set(r.map(y=>y.targetFile.toLowerCase())),m=[],p=[];for(let y of l){let T=we.basename(y.targetFile);if(ta[T]){let N=ta[T];try{let A=await ke.readFile(y.sourceFile,"utf-8"),W=y.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),te=new RegExp(`\\[${W}\\]`,"g");if(te.test(A)){let ne=A.replace(te,`[${N}]`);await ke.writeFile(y.sourceFile,ne,"utf-8"),y.repaired=!0,y.newTarget=N,m.push(y)}else p.push(y)}catch(A){console.error(`Failed to repair synapse in ${y.sourceFile}:`,A),p.push(y)}}else p.push(y)}l=p;let h={timestamp:new Date().toISOString(),totalFiles:s.length,totalSynapses:r.length,brokenSynapses:l,repairedSynapses:m,orphanedFiles:[]},v=lc(h),w=we.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await ke.ensureDir(we.dirname(w)),await ke.writeFile(w,v),l.length>0){if(await ae.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${l.length} broken synapse${l.length>1?"s":""}!

${m.length>0?`\u2705 Auto-repaired: ${m.length}
`:""}\u274C Need manual repair: ${l.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let y=r.length>50?"excellent":r.length>20?"good":"developing";if(await ae.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${s.length} memory files
\u2022 ${r.length} active synapses
${m.length>0?`\u2022 ${m.length} auto-repaired
`:""}\u2022 Network health: ${y}`,"View Full Report","Close")!=="View Full Report")return}let P=await ae.workspace.openTextDocument(w);await ae.window.showTextDocument(P)})}function lc(e){return`# Dream Protocol Report
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
`}var ee=D(require("vscode")),g=D(Fe()),S=D(require("path")),ia=D(require("crypto"));function wt(e){return ia.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function dc(e){let t=S.join(e,".github","copilot-instructions.md");if(!await g.pathExists(t))return null;try{let o=(await g.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function uc(e){try{return(await g.readJson(S.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}function aa(e){return S.join(e,".github","config","alex-manifest.json")}function mc(e){return S.join(e,".alex-manifest.json")}async function pc(e){let t=aa(e),n=mc(e);if(await g.pathExists(t))try{return await g.readJson(t)}catch(o){return console.error("Failed to parse manifest (may be corrupted):",o),null}if(await g.pathExists(n))try{let o=await g.readJson(n);return await g.ensureDir(S.join(e,".github","config")),await g.writeJson(t,o,{spaces:2}),await g.remove(n),console.log("Migrated manifest from root to .github/config/"),o}catch(o){return console.error("Failed to parse/migrate legacy manifest:",o),null}return null}async function gc(e,t,n){let o=S.join(e,".github","copilot-instructions.md"),i=S.join(t,".github","copilot-instructions.md");if(!await g.pathExists(o)||!await g.pathExists(i))return{success:!1,reason:"File not found"};try{let a=await g.readFile(o,"utf8"),s=await g.readFile(i,"utf8"),r=a.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/),c=r?r[0]:null,d=a.match(/## Synapses[\s\S]*?(?=##|$)/),l=a.split(`
`).length,u=s.split(`
`).length;if(l>u*1.2)return{success:!1,reason:"User file has significant customizations"};let m=a.match(/^## [^\n]+/gm)||[],p=s.match(/^## [^\n]+/gm)||[],h=m.filter(w=>!p.includes(w));if(h.length>2)return{success:!1,reason:`User has ${h.length} custom sections`};let v=s;if(c&&c.includes("P5")&&!c.includes("Available for")){let w=v.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);w&&(v=v.replace(w[0],c))}return v=v.replace(/\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,`**Version**: ${n}`),await g.writeFile(o,v,"utf8"),{success:!0}}catch(a){return{success:!1,reason:a.message}}}async function oa(e){let t=[];if(!await g.pathExists(e))return t;try{let n=await g.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}var fc={Expression:"Enables",Embodiment:"Enables",Living:"Validates",Reflexive:"Documents",Ethical:"Validates",Unconscious:"Enables",Application:"Enables",Validation:"Validates"};async function hc(e){let t=[];if(!await g.pathExists(e))return{migrated:!1,changes:t};try{let n=await g.readFile(e,"utf8"),o=n;/## Embedded Synapse Network/i.test(n)&&(n=n.replace(/## Embedded Synapse Network/gi,"## Synapses"),t.push('Header: "## Embedded Synapse Network" \u2192 "## Synapses"')),/### \*\*Connection Mapping\*\*/i.test(n)&&(n=n.replace(/### \*\*Connection Mapping\*\*/gi,"### Connection Mapping"),t.push('Subheader: "### **Connection Mapping**" \u2192 "### Connection Mapping"')),/### \*\*Activation Patterns\*\*/i.test(n)&&(n=n.replace(/### \*\*Activation Patterns\*\*/gi,"### Activation Patterns"),t.push('Subheader: "### **Activation Patterns**" \u2192 "### Activation Patterns"'));for(let[r,c]of Object.entries(fc)){let d=new RegExp(`(\\(\\s*(?:Critical|High|Medium|Low)\\s*,\\s*)${r}(\\s*,)`,"gi");d.test(n)&&(n=n.replace(d,`$1${c}$2`),t.push(`Relationship type: "${r}" \u2192 "${c}"`))}let i=/\*\*([^*]+)\*\*\s*→\s*([^✅\n]+)\s*✅\s*(?:NEW|CRITICAL|ENHANCED)[^\n]*/g,a;for(;(a=i.exec(o))!==null;){let r=a[1].trim(),c=a[2].trim(),d=a[0],l=`${r} \u2192 ${c}`;n=n.replace(d,l),t.push(`Simplified activation: "${r}" (removed date stamp and bold)`)}let s=/^\s*-\s*\*\*([^*]+)\*\*\s*→\s*(.+)$/gm;return n=n.replace(s,(r,c,d)=>r.includes("**")?(t.push(`Removed bold: "${c.trim()}"`),`- ${c.trim()} \u2192 ${d.trim()}`):r),n=n.replace(/\s*✅\s*(?:NEW|CRITICAL|ENHANCED)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s*\d{4}/gi,""),n!==o?(await g.writeFile(e,n,"utf8"),{migrated:!0,changes:t}):{migrated:!1,changes:t}}catch(n){return t.push(`Error during migration: ${n}`),{migrated:!1,changes:t}}}async function wc(e,t){let n=[],o=S.join(e,".github","domain-knowledge");if(await g.pathExists(o)){let i=await g.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function sa(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;await ee.window.showWarningMessage(t.error||"Alex is not installed in this workspace.","Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await ee.commands.executeCommand("alex.initialize");return}let n=t.rootPath,o=e.extensionPath,i=await dc(n),a=await uc(o);if(i===a){await ee.window.showInformationMessage(`\u2705 Alex is already at the latest version (${a}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await ee.commands.executeCommand("alex.dream");return}let s=await ee.window.showInformationMessage(`\u{1F504} Upgrade Available: v${i||"unknown"} \u2192 v${a}

This is a fully automated upgrade process:

\u{1F4E6} What will happen:
\u2022 Full backup of all cognitive memory
\u2022 Update system files (instructions, prompts)
\u2022 Auto-migrate schema changes
\u2022 Preserve your learned knowledge
\u2022 Run Dream validation

\u23F1\uFE0F Total time: ~30 seconds`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(s==="What's New?"){let r=S.join(o,"CHANGELOG.md");if(await g.pathExists(r)){let c=await ee.workspace.openTextDocument(r);await ee.window.showTextDocument(c)}return}s==="Start Upgrade"&&await yc(e,n,o,i,a)}async function yc(e,t,n,o,i){let a=S.join(n,".github","copilot-instructions.md");if(!await g.pathExists(a)){ee.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),c=S.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await ee.window.withProgress({location:ee.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async m=>{m.report({message:"Creating complete backup...",increment:15});try{await g.ensureDir(c);let $=S.join(c,".write-test");await g.writeFile($,"test"),await g.remove($)}catch($){throw new Error(`Cannot create backup directory - check disk space and permissions: ${$.message}`)}let p=S.join(t,".github");await g.pathExists(p)&&(await g.copy(p,S.join(c,".github")),s.backed_up.push(".github/ (all cognitive memory)")),m.report({message:"Analyzing installed files...",increment:10});let h=await pc(t);h||(h={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),m.report({message:"Scanning for schema migration needs...",increment:15});let v=[],w=S.join(t,".github","copilot-instructions.md");await g.pathExists(w)&&v.push(w);let P=S.join(t,".github","domain-knowledge");if(await g.pathExists(P)){let $=await g.readdir(P);for(let k of $)k.endsWith(".md")&&v.push(S.join(P,k))}let y=S.join(t,".github","episodic");if(await g.pathExists(y)){let $=await g.readdir(y);for(let k of $)k.endsWith(".md")&&v.push(S.join(y,k))}for(let $ of v){let k=await oa($);if(k.length>0){let O=S.relative(t,$);s.migrationTasks.push({file:O,type:"schema-migration",description:"Synapse schema migration needed",details:k})}}m.report({message:"Identifying user-created files...",increment:10});let T=await wc(t,h);for(let $ of T){s.preserved.push(`${$} (user-created)`);let k=S.join(t,$),O=await oa(k);O.length>0&&s.migrationTasks.push({file:$,type:"schema-migration",description:"User-created file needs schema migration",details:O})}m.report({message:"Merging core brain file...",increment:10});let N=await gc(t,n,i);N.success?s.updated.push(".github/copilot-instructions.md (auto-merged)"):s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires manual merge",details:[`Auto-merge failed: ${N.reason}`,"UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),m.report({message:"Updating system files...",increment:20});let A=S.join(n,".github","instructions"),W=S.join(t,".github","instructions");if(await g.pathExists(A)){let $=await g.readdir(A);for(let k of $){let O=S.join(A,k),ce=S.join(W,k);if((await g.stat(O)).isFile()){let Ee=await g.pathExists(ce);await g.copy(O,ce,{overwrite:!0});let Le=await g.readFile(O,"utf8");h.files[`.github/instructions/${k}`]={type:"system",originalChecksum:wt(Le)},Ee?s.updated.push(`.github/instructions/${k}`):s.added.push(`.github/instructions/${k}`)}}}let te=S.join(n,".github","prompts"),ne=S.join(t,".github","prompts");if(await g.pathExists(te)){let $=await g.readdir(te);for(let k of $){let O=S.join(te,k),ce=S.join(ne,k);if((await g.stat(O)).isFile()){let Ee=await g.pathExists(ce);await g.copy(O,ce,{overwrite:!0});let Le=await g.readFile(O,"utf8");h.files[`.github/prompts/${k}`]={type:"system",originalChecksum:wt(Le)},Ee?s.updated.push(`.github/prompts/${k}`):s.added.push(`.github/prompts/${k}`)}}}let b=S.join(n,".github","agents"),C=S.join(t,".github","agents");if(await g.pathExists(b)){await g.ensureDir(C);let $=await g.readdir(b);for(let k of $){let O=S.join(b,k),ce=S.join(C,k);if((await g.stat(O)).isFile()){let Ee=await g.pathExists(ce);await g.copy(O,ce,{overwrite:!0});let Le=await g.readFile(O,"utf8");h.files[`.github/agents/${k}`]={type:"system",originalChecksum:wt(Le)},Ee?s.updated.push(`.github/agents/${k}`):s.added.push(`.github/agents/${k}`)}}}let F=S.join(n,".github","config"),U=S.join(t,".github","config");if(await g.pathExists(F)){await g.ensureDir(U);let $=await g.readdir(F);for(let k of $)if(k.includes("template")||k==="USER-PROFILE-TEMPLATE.md"){let O=S.join(F,k),ce=S.join(U,k);if((await g.stat(O)).isFile()){let Ee=await g.pathExists(ce);await g.copy(O,ce,{overwrite:!0}),Ee?s.updated.push(`.github/config/${k}`):s.added.push(`.github/config/${k}`)}}}m.report({message:"Processing domain knowledge...",increment:10});let V=S.join(n,".github","domain-knowledge"),X=S.join(t,".github","domain-knowledge");if(await g.pathExists(V)){await g.ensureDir(X);let $=await g.readdir(V);for(let k of $){let O=S.join(V,k),ce=S.join(X,k);if((await g.stat(O)).isFile()){let Ee=await g.readFile(O,"utf8"),Le=wt(Ee);if(!await g.pathExists(ce))await g.copy(O,ce),h.files[`.github/domain-knowledge/${k}`]={type:"system",originalChecksum:Le},s.added.push(`.github/domain-knowledge/${k}`);else{let Ja=await g.readFile(ce,"utf8"),Ya=wt(Ja),Jn=h.files[`.github/domain-knowledge/${k}`]?.originalChecksum;if(Jn&&Ya!==Jn){let Xt=ce.replace(/\.md$/,`.v${i}.md`);await g.copy(O,Xt),s.preserved.push(`.github/domain-knowledge/${k} (modified by user, new version: ${S.basename(Xt)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${k}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${k}`,`New version available: ${S.basename(Xt)}`,"Review and merge changes as needed"]})}else await g.copy(O,ce,{overwrite:!0}),h.files[`.github/domain-knowledge/${k}`]={type:"system",originalChecksum:Le},s.updated.push(`.github/domain-knowledge/${k}`)}}}}m.report({message:"Saving manifest...",increment:5}),h.version=i,h.upgradedAt=new Date().toISOString();let _=aa(t);await g.ensureDir(S.dirname(_));let q=_+".tmp";await g.writeJson(q,h,{spaces:2}),await g.move(q,_,{overwrite:!0}),m.report({message:"Performing schema migrations...",increment:10});let L=[],Q=s.migrationTasks.filter($=>$.type==="schema-migration").map($=>$.file),G=".github/copilot-instructions.md";Q.includes(G)||Q.push(G);for(let $ of Q){let k=S.join(t,$),O=await hc(k);O.migrated&&L.push({file:$,changes:O.changes})}s.migrationTasks=s.migrationTasks.filter($=>$.type!=="schema-migration"),L.length>0&&s.updated.push(...L.map($=>`${$.file} (schema migrated: ${$.changes.length} changes)`)),m.report({message:"Generating upgrade report...",increment:5}),await vc(t,o,i,s,c,r,L)});let d=!1;try{await ee.window.withProgress({location:ee.ProgressLocation.Notification,title:"Running Dream validation...",cancellable:!1},async()=>{await ee.commands.executeCommand("alex.dream"),d=!0})}catch(m){console.error("Dream validation failed:",m)}let l=S.join(t,"UPGRADE-INSTRUCTIONS.md");if(await g.pathExists(l)&&await g.remove(l),await ee.window.showInformationMessage(`\u2705 Upgrade Complete! v${o||"unknown"} \u2192 v${i}

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Schema migrations: ${s.migrationTasks.length===0?"All completed":s.migrationTasks.length+" remaining"}
\u2022 Dream validation: ${d?"\u2705 Passed":"\u26A0\uFE0F Check manually"}

\u{1F389} Your cognitive architecture has been fully upgraded!`,"View Upgrade Report","Close")==="View Upgrade Report"){let m=S.join(t,"archive","upgrades",`upgrade-report-${r}.md`);if(await g.pathExists(m)){let p=await ee.workspace.openTextDocument(m);await ee.window.showTextDocument(p)}}}catch(d){ee.window.showErrorMessage(`\u274C Upgrade failed: ${d.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(d.message)}}async function vc(e,t,n,o,i,a,s){let r=s.length>0?s.map((u,m)=>`
### ${m+1}. ${u.file}

**Status**: \u2705 Automatically migrated  
**Changes applied**:
${u.changes.map(p=>`- ${p}`).join(`
`)}
`).join(`
---
`):"No schema migrations were needed.",c=o.migrationTasks.length>0?o.migrationTasks.map((u,m)=>`
### ${m+1}. ${u.file}

**Type**: \`${u.type}\`  
**Description**: ${u.description}

**Details**:
${u.details.map(p=>`- ${p}`).join(`
`)}
`).join(`
---
`):"All tasks completed automatically.",d=`# Alex Cognitive Architecture Upgrade Report

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

${o.updated.length>0?o.updated.map(u=>`- \u2705 ${u}`).join(`
`):"- None"}

## Added Files (New in this version)

${o.added.length>0?o.added.map(u=>`- \u2795 ${u}`).join(`
`):"- None"}

## Preserved Files (User content protected)

${o.preserved.length>0?o.preserved.map(u=>`- \u{1F512} ${u}`).join(`
`):"- None"}

## Backed Up

${o.backed_up.length>0?o.backed_up.map(u=>`- \u{1F4E6} ${u}`).join(`
`):"- None"}

---

## Schema Migrations Performed

${r}

---

## Remaining Tasks (Manual Review Recommended)

${c}

---

${o.errors.length>0?`## Errors

${o.errors.map(u=>`- \u274C ${u}`).join(`
`)}

---

`:""}
## Rollback Instructions

If you need to revert:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${S.relative(e,i)}\`
3. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

*Report generated by Alex Cognitive Architecture v${n}*
*Upgrade completed automatically - no manual intervention required*
`,l=S.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await g.ensureDir(S.dirname(l)),await g.writeFile(l,d,"utf8")}var j=D(require("vscode")),Ce=D(Fe()),Jt=D(require("path"));var M=D(require("vscode")),R=D(Fe()),he=D(require("path")),Ln=D(require("os")),Na=D(Ia());var be=D(require("vscode")),Y=D(Fe()),De=D(require("path")),$a=D(require("https"));var Be="alex-knowledge-index.json",Fa="Alex Cognitive Architecture - Global Knowledge Base";async function _c(){try{return await be.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function St(e,t={}){let n=await _c();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let a=new URL(`https://api.github.com${e}`),s={hostname:a.hostname,path:a.pathname+a.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=$a.request(s,c=>{let d="";c.on("data",l=>{d+=l}),c.on("end",()=>{if(c.statusCode&&c.statusCode>=200&&c.statusCode<300)if(c.statusCode===204||!d)o(null);else try{o(JSON.parse(d))}catch(l){i(new Error(`Failed to parse GitHub response: ${l}`))}else i(new Error(`GitHub API error (${c.statusCode}): ${d}`))})});r.on("error",c=>i(c)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function Aa(){return De.join(re("root"),"sync-metadata.json")}async function Vt(){let e=Aa();try{if(await Y.pathExists(e))return await Y.readJson(e)}catch{}return{}}async function st(e){let t=Aa();await Y.writeJson(t,e,{spaces:2})}async function Fn(){let e=await Vt();if(e.gistId)try{let i=await St(`/gists/${e.gistId}`);if(i)return i}catch{}let t=re("index");if(await Y.pathExists(t))try{let i=await Y.readJson(t);if(i.cloudGistId){let a=await St(`/gists/${i.cloudGistId}`);if(a)return await st({...e,gistId:a.id}),a}}catch{}let n=await St("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===Fa||i.files[Be]);return o&&await st({...e,gistId:o.id}),o||null}async function Ma(e){let t={};for(let[i,a]of Object.entries(e))t[i]={content:a};let n=await St("/gists",{method:"POST",body:{description:Fa,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await Vt();return await st({...o,gistId:n.id}),n}async function Ra(e,t){let n={};for(let[i,a]of Object.entries(t))n[i]=a===null?null:{content:a};let o=await St(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function Bt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function kt(){try{let e=await Vt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=re("index");if(!await Y.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await Y.readJson(t),o=Bt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function Pt(){try{await ue();let e=re("index");if(!await Y.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await Y.readJson(e),n=await Fn(),o=!n;n||(n=await Ma({[Be]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[Be]:JSON.stringify(t,null,2)};for(let s of t.entries)if(await Y.pathExists(s.filePath)){let r=await Y.readFile(s.filePath,"utf-8"),c=De.basename(s.filePath);i[c]=r}n=await Ra(n.id,i),await Je(()=>t);let a=Bt(t);return await st({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:a,lastRemoteHash:a}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function xt(){try{await ue();let e=await Fn();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[Be];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let a of n.entries){let s=De.basename(a.filePath),r=e.files[s];if(r){let c=a.type==="pattern"?"patterns":"insights",d=De.join(re(c),s);a.filePath=d,await Y.writeFile(d,r.content,"utf-8"),o++}}await Je(()=>n);let i=Bt(n);return await st({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function rt(){try{await ue();let e=re("index"),t;await Y.pathExists(e)?t=await Y.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await Fn(),o;n&&n.files[Be]?o=JSON.parse(n.files[Be].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let u of o.entries)i.set(u.id,u);for(let u of t.entries){let m=i.get(u.id);(!m||new Date(u.modified)>new Date(m.modified))&&i.set(u.id,u)}let a={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},s={[Be]:JSON.stringify(a,null,2)};for(let u of a.entries)if(await Y.pathExists(u.filePath)){let m=await Y.readFile(u.filePath,"utf-8"),p=De.basename(u.filePath);s[p]=m}let r=0;if(n)for(let u of o.entries){let m=De.basename(u.filePath),p=n.files[m],h=u.type==="pattern"?"patterns":"insights",v=De.join(re(h),m);if(p&&!await Y.pathExists(v)){await Y.writeFile(v,p.content,"utf-8");let w=i.get(u.id);w&&(w.filePath=v),r++}}n?await Ra(n.id,s):n=await Ma(s),await Je(()=>a);let c=Bt(a);await st({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:c,lastRemoteHash:c});let d=t.entries.filter(u=>!o.entries.find(m=>m.id===u.id)).length,l=r;return{success:!0,status:"up-to-date",message:`Synced! ${d} pushed, ${l} pulled. Total: ${a.entries.length} entries.`,entriesPushed:d,entriesPulled:l}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function ct(){let e=await Vt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var In=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new be.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await Pt();break;case"pull":i=await xt();break;default:i=await rt()}let s=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;s+=`**Status**: ${i.status}
`,s+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(s+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(s+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await ct();return r&&(s+=`
**Cloud URL**: ${r}
`),new be.LanguageModelToolResult([new be.LanguageModelTextPart(s)])}};function Da(e){e.subscriptions.push(be.lm.registerTool("alex_cloud_sync",new In))}var at,Cn,Tn=!1,Gc=300*1e3,Kc=60*1e3,En;function Uc(){return En||(En=be.window.createOutputChannel("Alex Unconscious Mind")),En}function xe(e){let t=new Date().toISOString();Uc().appendLine(`[${t}] ${e}`)}async function $n(){if(Tn)return xe("Sync already in progress, skipping"),null;if(Cn&&Date.now()-Cn.getTime()<Kc)return xe("Too soon since last sync, skipping"),null;Tn=!0,Cn=new Date;try{if(xe("Starting transparent background sync..."),(await kt()).status==="up-to-date")return xe("Already up-to-date, no sync needed"),{success:!0,status:"up-to-date",message:"Already synced"};let t=await rt();return xe(`Sync complete: ${t.message}`),t}catch(e){return xe(`Transparent sync failed: ${e}`),{success:!1,status:"error",message:`${e}`}}finally{Tn=!1}}async function lt(){setTimeout(async()=>{let e=await $n();e&&e.success&&e.entriesPushed&&e.entriesPushed>0&&xe(`Auto-synced ${e.entriesPushed} entries after modification`)},2e3)}function La(e){at&&clearInterval(at),xe("Background sync enabled - Alex unconscious mind active"),setTimeout(async()=>{xe("Running startup sync..."),await $n()},1e4),at=setInterval(async()=>{await $n()},Gc),e.subscriptions.push({dispose:()=>{at&&(clearInterval(at),at=void 0),xe("Background sync disabled")}})}var zc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function Nn(){return he.join(Ln.homedir(),Ae)}function re(e){return he.join(Ln.homedir(),Ji[e])}async function ue(){let e=[re("root"),re("knowledge"),re("patterns"),re("insights")];for(let t of e)await R.ensureDir(t)}async function On(e,t){await R.pathExists(e)||await R.ensureFile(e);let n;try{return n=await Na.lock(e,zc),await t()}finally{n&&await n()}}async function Je(e){let t=re("index");return await ue(),await On(t,async()=>{let n;try{if(await R.pathExists(t)){let o=await R.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await R.writeJson(t,n,{spaces:2}),n})}async function Oa(e){let t=re("projectRegistry");return await ue(),await On(t,async()=>{let n;try{if(await R.pathExists(t)){let o=await R.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await R.writeJson(t,n,{spaces:2}),n})}async function jn(){let e=re("index");return await ue(),await On(e,async()=>{try{if(await R.pathExists(e)){let n=await R.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await R.writeJson(e,t,{spaces:2}),t})}async function _n(){let e=re("projectRegistry");return await ue(),await Oa(t=>t)}async function ja(){let e=M.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=he.basename(t),o=0,i=new M.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await M.workspace.findFiles(i)).length;let s;return await Oa(r=>{let c=r.projects.findIndex(l=>l.path===t),d={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return c>=0?(r.projects[c]={...r.projects[c],...d},s=r.projects[c]):(r.projects.push(d),s=d),r}),s}function _a(e,t){let n=e==="pattern"?pn.pattern:pn.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function qc(e,t,n,o,i){await ue();let a=_a("pattern",e),s=`${a}.md`,r=he.join(re("patterns"),s),c=`# ${e}

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

`;await R.writeFile(r,c,"utf-8");let d={id:a,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await Je(l=>(l.entries.push(d),l)),d}async function Hc(e,t,n,o,i){let a=e.filePath;if(!a||!await R.pathExists(a))throw new Error(`Global pattern file not found: ${a}`);let s=[...new Set([...e.tags||[],...o])],r=`# ${e.title}

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

`;await R.writeFile(a,r,"utf-8");let c={...e,category:n,tags:s,modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":"")};return await Je(d=>{let l=d.entries.findIndex(u=>u.id===e.id);return l>=0&&(d.entries[l]=c),d}),c}async function Gn(e,t,n,o,i,a,s){await ue();let r=_a("insight",e),c=`${r}.md`,d=he.join(re("insights"),c),l=`# ${e}

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

`;await R.writeFile(d,l,"utf-8");let u={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:d};return await Je(m=>(m.entries.push(u),m)),u}async function Ct(e,t={}){let n=await jn(),o=e.toLowerCase(),i=o.split(/\s+/).filter(s=>s.length>2),a=[];for(let s of n.entries){if(t.type&&t.type!=="all"&&s.type!==t.type||t.category&&s.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(d=>s.tags.map(l=>l.toLowerCase()).includes(d.toLowerCase())))continue;let r=0;s.title.toLowerCase().includes(o)&&(r+=10);for(let c of i)s.title.toLowerCase().includes(c)&&(r+=3);for(let c of s.tags){(c.toLowerCase().includes(o)||o.includes(c.toLowerCase()))&&(r+=5);for(let d of i)c.toLowerCase().includes(d)&&(r+=2)}s.summary.toLowerCase().includes(o)&&(r+=3);for(let c of i)s.summary.toLowerCase().includes(c)&&(r+=1);if(s.category.toLowerCase().includes(o)&&(r+=2),r>0){let c;if(await R.pathExists(s.filePath))try{c=await R.readFile(s.filePath,"utf-8");for(let d of i){let l=(c.toLowerCase().match(new RegExp(d,"g"))||[]).length;r+=Math.min(l,5)*.5}}catch{}a.push({entry:s,relevance:r,content:c})}}return a.sort((s,r)=>r.relevance-s.relevance),a.slice(0,t.limit||10)}async function Ga(e,t,n=[]){try{let o=await R.readFile(e,"utf-8"),i=he.basename(e,".md"),a=o.match(/^#\s+(.+)$/m),s=a?a[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),c=r?r[1].split(",").map(m=>m.trim()):[],d=[...new Set([...c,...n])],l=M.workspace.workspaceFolders,u=l?he.basename(l[0].uri.fsPath):void 0;return await qc(s,o,t,d,u)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}var Wc=["DK-SKILL-WISHLIST","DK-GENERIC-FRAMEWORK","VERSION-NAMING-CONVENTION"];async function Vc(e){let t=he.basename(e,".md"),n=await R.readFile(e,"utf-8"),o=0,i=[],a=n.match(/^#\s+(.+)$/m),s=a?a[1]:t.replace(/^DK-/,"").replace(/-/g," "),r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g,c=n.match(r);c&&c.length>0&&(o+=3,i.push(`Has ${c.length} synapse connection(s)`));let d=n.match(/^##\s+.+$/gm);d&&d.length>=3&&(o+=2,i.push(`Well-structured with ${d.length} sections`));let l=n.match(/\*\*Tags\*\*:\s*(.+)$/m),u=[];l&&(u=l[1].split(",").map(A=>A.trim()).filter(A=>A.length>0),u.length>0&&(o+=1,i.push(`Has ${u.length} tag(s)`))),n.length>1e3&&(o+=1,i.push("Substantial content (>1KB)")),n.length>5e3&&(o+=2,i.push("Rich content (>5KB)"));let m=n.match(/```[\s\S]*?```/g);m&&m.length>0&&(o+=2,i.push(`Contains ${m.length} code example(s)`));let h=[/pattern/i,/best practice/i,/guideline/i,/framework/i,/principle/i,/architecture/i,/design/i,/approach/i].filter(A=>A.test(n)).length;h>=2&&(o+=Math.min(h,3),i.push("Contains general/reusable concepts"));let v=Bc(n,t),w=await jn(),P=s.toLowerCase().replace(/[^a-z0-9]/g,"-"),y=w.entries.find(A=>A.title.toLowerCase().replace(/[^a-z0-9]/g,"-")===P||A.id.includes(P)),T=!!y,N=!1;if(T&&y)try{let W=(await R.stat(e)).mtime,te=new Date(y.modified);N=W>te}catch{N=!1}return{filePath:e,filename:t,title:s,score:o,reasons:i,category:v,tags:u,isPromotionCandidate:o>=5&&!T,alreadyPromoted:T,existingEntry:y,hasLocalChanges:N}}function Bc(e,t){let n=e.toLowerCase(),o=t.toLowerCase(),i=[[/error|exception|fault|handling/i,"error-handling"],[/api|rest|graphql|endpoint/i,"api-design"],[/test|spec|jest|mocha|assertion/i,"testing"],[/debug|troubleshoot|diagnos/i,"debugging"],[/performance|optimi|cache|speed/i,"performance"],[/architecture|design|pattern|structure/i,"architecture"],[/security|auth|encrypt|vulnerab/i,"security"],[/deploy|ci\/cd|pipeline|docker|kubernetes/i,"deployment"],[/document|readme|comment|diagram/i,"documentation"],[/refactor|clean|improve|modernize/i,"refactoring"],[/tool|config|setup|environment/i,"tooling"]];for(let[a,s]of i)if(a.test(n)||a.test(o))return s;return"general"}async function Ka(e,t={}){let{dryRun:n=!1,minScore:o=5}=t;await ue();let i={evaluated:0,promoted:[],updated:[],skipped:[],alreadyGlobal:[]},a=he.join(e,".github","domain-knowledge");if(!await R.pathExists(a))return i;let r=(await R.readdir(a)).filter(c=>c.startsWith("DK-")&&c.endsWith(".md"));for(let c of r){let d=he.join(a,c),l=c.replace(".md","");if(Wc.some(u=>l.includes(u))){i.skipped.push({filename:c,reason:"Excluded meta-file"});continue}i.evaluated++;try{let u=await Vc(d);if(u.alreadyPromoted){if(u.hasLocalChanges&&u.existingEntry)if(n)i.updated.push({...u.existingEntry,modified:new Date().toISOString(),summary:"[DRY-RUN] Would be updated from local changes"});else{let m=await R.readFile(d,"utf-8"),p=M.workspace.workspaceFolders,h=p?he.basename(p[0].uri.fsPath):void 0,v=await Hc(u.existingEntry,m,u.category,u.tags,h);i.updated.push(v)}else i.alreadyGlobal.push(c);continue}if(!u.isPromotionCandidate||u.score<o){i.skipped.push({filename:c,reason:`Score ${u.score}/${o} - ${u.reasons.join(", ")||"Needs more structure/content"}`});continue}if(n)i.promoted.push({id:`[DRY-RUN] ${l}`,title:u.title,type:"pattern",category:u.category,tags:u.tags,created:new Date().toISOString(),modified:new Date().toISOString(),summary:`Would be promoted with score ${u.score}`,filePath:d});else{let m=await Ga(d,u.category,u.tags);m&&i.promoted.push(m)}}catch(u){i.skipped.push({filename:c,reason:`Error: ${u}`})}}return!n&&(i.promoted.length>0||i.updated.length>0)&&lt(),i}async function Kn(){let e=await jn(),t={},n={};for(let a of e.entries){t[a.category]=(t[a.category]||0)+1;for(let s of a.tags)n[s]=(n[s]||0)+1}let o=Object.entries(n).map(([a,s])=>({tag:a,count:s})).sort((a,s)=>s.count-a.count).slice(0,10),i=[...e.entries].sort((a,s)=>new Date(s.created).getTime()-new Date(a.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(a=>a.type==="pattern").length,totalInsights:e.entries.filter(a=>a.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var An=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new M.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await ue();let{query:o,type:i,category:a,tags:s}=t.input,r=await Ct(o,{type:i,category:a,tags:s?s.split(",").map(d=>d.trim()):void 0,limit:10});if(r.length===0)return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`No global knowledge found matching "${o}".

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

`}return new M.LanguageModelToolResult([new M.LanguageModelTextPart(c)])}},Mn=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new M.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await ue();let{title:o,insight:i,category:a,tags:s,problem:r,solution:c}=t.input,d=M.workspace.workspaceFolders,l=d?he.basename(d[0].uri.fsPath):void 0,u=await Gn(o,i,a||"general",s?s.split(",").map(p=>p.trim()):[],l,r,c);lt();let m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${u.id}  
**Title**: ${u.title}  
**Category**: ${u.category}  
**Tags**: ${u.tags.join(", ")}  
**Source Project**: ${u.sourceProject||"Unknown"}  
**File**: \`${u.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(m)])}},Rn=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${he.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new M.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:a}=t.input;if(!await R.pathExists(o))return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let s=await Ga(o,i||"general",a?a.split(",").map(c=>c.trim()):[]);if(!s)return new M.LanguageModelToolResult([new M.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);lt();let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${s.id}  
**Title**: ${s.title}  
**Category**: ${s.category}  
**Tags**: ${s.tags.join(", ")}  
**Global File**: \`${s.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(r)])}},Dn=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await ue();let o=await Kn(),i=await _n(),a="";try{let r=await kt();a=`| Cloud Sync | ${r.status==="up-to-date"?"\u2705":r.status==="needs-push"?"\u{1F4E4}":r.status==="needs-pull"?"\u{1F4E5}":r.status==="error"?"\u274C":"\u26AA"} ${r.status} |
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
\`${Nn()}\`
`,new M.LanguageModelToolResult([new M.LanguageModelTextPart(s)])}};function Ua(e){e.subscriptions.push(M.lm.registerTool("alex_global_knowledge_search",new An),M.lm.registerTool("alex_save_insight",new Mn),M.lm.registerTool("alex_promote_knowledge",new Rn),M.lm.registerTool("alex_global_knowledge_status",new Dn))}async function za(e){let t=await Me(!0);if(!t.found){if(t.cancelled)return;j.window.showErrorMessage(t.error||"No workspace folder open. Please open a project with Alex installed.");return}let n=t.rootPath,o=t.workspaceFolder,i={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},globalKnowledgePromotion:{evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0},recommendations:[],sessionFile:""};await j.window.withProgress({location:j.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async c=>{c.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Jc(o,i),c.report({message:"Phase 2: Checking version consistency...",increment:20}),await Yc(n,i),c.report({message:"Phase 3: Assessing memory architecture...",increment:40}),await Xc(o,i),c.report({message:"Phase 4: Auto-promoting knowledge to global...",increment:55}),await Qc(n,i),c.report({message:"Phase 5: Generating recommendations...",increment:75}),Zc(i),c.report({message:"Phase 6: Documenting session...",increment:90}),await el(n,i),c.report({message:"Self-actualization complete!",increment:100})});let s=`Self-Actualization Complete ${i.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":i.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":i.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${i.synapseHealth.totalSynapses} (${i.synapseHealth.brokenConnections} broken)
Memory Files: ${i.memoryConsolidation.proceduralFiles+i.memoryConsolidation.episodicFiles+i.memoryConsolidation.domainFiles}
Recommendations: ${i.recommendations.length}`,r=await j.window.showInformationMessage(s,"View Report","Open Session File");if(r==="View Report")tl(i);else if(r==="Open Session File"&&i.sessionFile){let c=await j.workspace.openTextDocument(i.sessionFile);await j.window.showTextDocument(c)}return i}async function Jc(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new j.RelativePattern(e,i),s=await j.workspace.findFiles(a);for(let r of s){t.synapseHealth.totalFiles++;try{let d=(await Ce.readFile(r.fsPath,"utf-8")).split(`
`),l=!1;for(let u of d){if(u.trim().startsWith("```")){l=!l;continue}if(l)continue;let m;for(;(m=o.exec(u))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await j.workspace.findFiles(new j.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Yc(e,t){let n=Jt.join(e,".github","copilot-instructions.md");try{if(await Ce.pathExists(n)){let r=(await Ce.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=j.workspace.workspaceFolders?.[0];if(a)for(let s of i){let r=new j.RelativePattern(a,s),c=await j.workspace.findFiles(r);for(let d of c)try{let l=await Ce.readFile(d.fsPath,"utf-8");for(let u of o)if(u.test(l)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Xc(e,t){let n=await j.workspace.findFiles(new j.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await j.workspace.findFiles(new j.RelativePattern(e,".github/prompts/*.md")),i=await j.workspace.findFiles(new j.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await j.workspace.findFiles(new j.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}async function Qc(e,t){try{let n=await Ka(e,{minScore:5});t.globalKnowledgePromotion={evaluated:n.evaluated,promoted:n.promoted.map(o=>o.title),updated:n.updated.map(o=>o.title),skipped:n.skipped.length,alreadyGlobal:n.alreadyGlobal.length}}catch(n){console.error("Auto-promotion failed:",n),t.globalKnowledgePromotion={evaluated:0,promoted:[],updated:[],skipped:0,alreadyGlobal:0}}}function Zc(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections"),e.globalKnowledgePromotion.promoted.length>0&&e.recommendations.push(`\u{1F310} Auto-promoted ${e.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`),e.globalKnowledgePromotion.updated.length>0&&e.recommendations.push(`\u{1F504} Updated ${e.globalKnowledgePromotion.updated.length} global knowledge file(s) with local changes!`),e.globalKnowledgePromotion.skipped>0&&e.globalKnowledgePromotion.promoted.length===0&&e.globalKnowledgePromotion.updated.length===0&&e.recommendations.push(`\u{1F4D6} ${e.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`)}async function el(e,t){let n=Jt.join(e,".github","episodic");await Ce.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Jt.join(n,a),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",c=`# Self-Actualization Session - ${i}

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
`;await Ce.writeFile(s,c,"utf-8"),t.sessionFile=s}function tl(e){let t=j.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",j.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
</html>`}var z=D(require("vscode")),Va=D(require("path"));var f=D(require("vscode")),H=D(Fe()),ye=D(require("path"));var Un=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new f.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,r=0,c=0,d=[],l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){let h=new f.RelativePattern(o[0],p),v=await f.workspace.findFiles(h);for(let w of v){s++;try{let y=(await H.readFile(w.fsPath,"utf-8")).split(`
`),T=!1;for(let N=0;N<y.length;N++){let A=y[N];if(A.trim().startsWith("```")){T=!T;continue}if(T)continue;let W;for(;(W=l.exec(A))!==null;){r++;let te=W[1].trim();(await f.workspace.findFiles(new f.RelativePattern(o[0],`**/${te}`))).length===0&&(c++,t.input.detailed&&d.push(`- ${ye.basename(w.fsPath)}:${N+1} \u2192 ${te} (not found)`))}}}catch{}}}let u=c===0?"EXCELLENT":c<5?"GOOD":c<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${r} |
| Broken Connections | ${c} |
| Health Status | ${u} |
`;return t.input.detailed&&d.length>0&&(m+=`
### Issues Found
${d.join(`
`)}`),c>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new f.LanguageModelToolResult([new f.LanguageModelTextPart(m)])}},zn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new f.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let r=[];for(let l of s){let u=new f.RelativePattern(o[0],l),m=await f.workspace.findFiles(u);for(let p of m)try{let v=(await H.readFile(p.fsPath,"utf-8")).split(`
`),w=[];for(let P=0;P<v.length;P++)if(v[P].toLowerCase().includes(i)){let y=Math.max(0,P-1),T=Math.min(v.length-1,P+1),N=v.slice(y,T+1).join(`
`);w.push(`Line ${P+1}:
${N}`)}w.length>0&&r.push({file:ye.basename(p.fsPath),matches:w.slice(0,3)})}catch{}}let c=[];if(r.length===0)try{c=await Ct(t.input.query,{limit:5})}catch{}if(r.length===0&&c.length===0)return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`No matches found for "${t.input.query}" in local ${a} memory or global knowledge base.`)]);let d="";if(r.length>0){d+=`## Local Memory Results for "${t.input.query}"

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

`}}return new f.LanguageModelToolResult([new f.LanguageModelTextPart(d)])}},qn=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=ye.join(i,".github","copilot-instructions.md");if(!await H.pathExists(a))return new f.LanguageModelToolResult([new f.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/instructions/*.md")),c=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/prompts/*.md")),d=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/episodic/*.md")),l=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/domain-knowledge/*.md")),u="Unknown";try{let h=(await H.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);h&&(u=h[1])}catch{}let m=`## Alex Cognitive Architecture Status

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
`;return new f.LanguageModelToolResult([new f.LanguageModelTextPart(m)])}},Hn=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`),new f.LanguageModelToolResult([new f.LanguageModelTextPart(a.join(`
`))])}},Wn=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=ye.join(i,"config","USER-PROFILE.md"),s=ye.join(i,"config","user-profile.json"),{action:r,field:c,value:d}=t.input;try{switch(r){case"exists":let l=await H.pathExists(s);return new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({exists:l,path:s}))]);case"get":if(!await H.pathExists(s))return new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let u=await H.readJson(s);return c?new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({[c]:u[c]}))]):new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify(u))]);case"update":if(!c||d===void 0)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await H.ensureDir(ye.join(i,"config"));let m={};if(await H.pathExists(s)&&(m=await H.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(c)){let p=m[c]||[];Array.isArray(p)?p.includes(d)||(m[c]=[...p,d]):m[c]=[d]}else m[c]=d;return m.lastUpdated=new Date().toISOString(),await H.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({success:!0,field:c,value:d,message:`Updated ${c} to: ${d}`}))]);default:return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(l){return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`Error accessing user profile: ${l.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await H.writeFile(t,o,"utf-8")}},Vn=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new f.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let w=ye.join(i,".github","copilot-instructions.md");if(await H.pathExists(w)){let y=(await H.readFile(w,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);y&&(a=y[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let w of r){let P=new f.RelativePattern(o[0],w),y=await f.workspace.findFiles(P);for(let T of y){s.synapseHealth.totalFiles++;try{let A=(await H.readFile(T.fsPath,"utf-8")).split(`
`),W=!1;for(let te of A){if(te.trim().startsWith("```")){W=!W;continue}if(W)continue;let ne;for(;(ne=c.exec(te))!==null;){s.synapseHealth.totalSynapses++;let b=ne[1].trim();(await f.workspace.findFiles(new f.RelativePattern(o[0],`**/${b}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let d=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/instructions/*.md")),l=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/prompts/*.md")),u=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/episodic/*.md")),m=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=d.length,s.memoryArchitecture.episodicFiles=l.length+u.length,s.memoryArchitecture.domainFiles=m.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let w=ye.join(i,".github","episodic");await H.ensureDir(w);let y=new Date().toISOString().split("T")[0],T=`self-actualization-${y}.prompt.md`;p=ye.join(w,T);let N=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",A=`# Self-Actualization Session - ${y}

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

${s.recommendations.length>0?s.recommendations.map(W=>`- ${W}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await H.writeFile(p,A,"utf-8")}let v=`## Self-Actualization Report

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
`;return p&&(v+=`
### Session Recorded

Meditation session documented at: \`${ye.basename(p)}\``),new f.LanguageModelToolResult([new f.LanguageModelTextPart(v)])}};async function Yt(){let e=f.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ye.join(t,"config","user-profile.json");try{if(await H.pathExists(n))return await H.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function qa(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function Ha(e){e.subscriptions.push(f.lm.registerTool("alex_synapse_health",new Un)),e.subscriptions.push(f.lm.registerTool("alex_memory_search",new zn)),e.subscriptions.push(f.lm.registerTool("alex_architecture_status",new qn)),e.subscriptions.push(f.lm.registerTool("alex_mcp_recommendations",new Hn)),e.subscriptions.push(f.lm.registerTool("alex_user_profile",new Wn)),e.subscriptions.push(f.lm.registerTool("alex_self_actualization",new Vn)),console.log("Alex Language Model Tools registered")}var nl=[/(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)/i,/(?:this works because|the reason is|what fixed it|solved by|resolved by)/i,/(?:always remember to|never forget to|make sure to|be careful to)/i,/(?:debugging tip|performance tip|security tip)/i],ol=["pattern","anti-pattern","best practice","gotcha","pitfall","workaround","solution","fix","resolved","debugging","performance","optimization","security","architecture"];function il(e){let t=e.toLowerCase(),n=0;for(let a of nl)a.test(e)&&n++;let o=[];for(let a of ol)t.includes(a)&&o.push(a);let i=n*.3+o.length*.1;return{detected:i>=.3||n>=1,confidence:Math.min(i,1),keywords:o}}async function al(e,t,n){try{let o=e.split(/[.!?]/)[0].trim(),i=o.length>10&&o.length<100?o:`Auto-captured insight - ${new Date().toISOString().split("T")[0]}`,a="general";t.includes("debugging")?a="debugging":t.includes("performance")||t.includes("optimization")?a="performance":t.includes("security")?a="security":t.includes("architecture")?a="architecture":(t.includes("pattern")||t.includes("anti-pattern"))&&(a="patterns"),await Gn(i,e,a,t,n,"Auto-detected from conversation",e),lt(),console.log(`[Unconscious] Auto-saved insight: ${i}`)}catch(o){console.warn("[Unconscious] Failed to auto-save insight:",o)}}var Tt=[],sl=5;function rl(e,t){Tt.push(e),Tt.length>sl&&Tt.shift();let n=Tt.join(" "),o=il(n);o.detected&&o.confidence>=.5&&(al(e,o.keywords,t),Tt=[])}var cl=[/(?:still (?:not working|broken|failing|doesn't work)|keeps? (?:failing|breaking|crashing))/i,/(?:tried everything|nothing works|no idea|completely lost|so confused)/i,/(?:why (?:won't|doesn't|isn't)|what am i (?:doing wrong|missing))/i,/(?:ugh|argh|damn|dammit|frustrated|annoying|annoyed|stuck)/i,/(?:this is (?:impossible|ridiculous|insane|driving me crazy))/i,/(?:been (?:at this|trying|working on this) for (?:hours|days|forever))/i,/(?:same (?:error|problem|issue) (?:again|still))/i,/(?:!{2,}|\?{3,})/],ll=[/(?:it works|finally|got it|figured it out|solved it|fixed it)/i,/(?:that (?:worked|fixed it|did it)|now it (?:works|runs))/i,/(?:thank(?:s| you)|perfect|awesome|great|amazing|brilliant)/i,/(?:makes sense now|i understand|clicked for me)/i,/(?:shipped|deployed|released|launched|published)/i,/(?:passed|all (?:tests|green)|build succeeded)/i],Te=0,Wa=0,dl=3e5;function ul(e){let t=Date.now();t-Wa>dl&&(Te=Math.max(0,Te-1)),Wa=t;let n=0;for(let a of cl)a.test(e)&&n++;let o=0;for(let a of ll)a.test(e)&&o++;n>0&&(Te=Math.min(3,Te+n)),o>0&&(Te=Math.max(0,Te-2));let i="none";return Te>=3?i="high":Te>=2?i="moderate":Te>=1&&(i="mild"),{frustration:i,success:o>0,encouragementNeeded:i==="moderate"||i==="high",celebrationNeeded:o>=2||o>0&&Te>0}}function ml(e){if(e.celebrationNeeded){let t=["\u{1F389} That's a win! Nice work.","\u2728 You got it! Persistence pays off.","\u{1F4AA} Solved! That was a tricky one.","\u{1F680} Success! You worked through it."];return t[Math.floor(Math.random()*t.length)]}if(e.encouragementNeeded){let t=["I can see this is frustrating. Let's take a step back and approach it differently.","Tough problem. What if we break it down into smaller pieces?","You're closer than it feels. What's the last thing that *did* work?","Debugging is hard. Let's be systematic - what have we ruled out?"];return t[Math.floor(Math.random()*t.length)]}return null}var pl=async(e,t,n,o)=>e.command==="meditate"?await gl(e,t,n,o):e.command==="dream"?await fl(e,t,n,o):e.command==="learn"?await hl(e,t,n,o):e.command==="status"?await wl(e,t,n,o):e.command==="azure"?await yl(e,t,n,o):e.command==="m365"?await vl(e,t,n,o):e.command==="profile"?await bl(e,t,n,o):e.command==="selfactualize"?await Cl(e,t,n,o):e.command==="knowledge"?await Tl(e,t,n,o):e.command==="saveinsight"?await El(e,t,n,o):e.command==="promote"?await Il(e,t,n,o):e.command==="knowledgestatus"?await $l(e,t,n,o):e.command==="sync"?await Fl(e,t,n,o):e.command==="push"?await Al(e,t,n,o):e.command==="pull"?await Ml(e,t,n,o):e.command==="docs"?await Rl(e,t,n,o):kl(e.prompt)&&Pl(t)?await xl(e,t,n,o):await Sl(e,t,n,o);async function gl(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function fl(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function hl(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function wl(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=gn(),a=i.isValid&&i.rootPath?await fn(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function yl(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function vl(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function bl(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Yt();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function Sl(e,t,n,o){let i=z.workspace.workspaceFolders,a=i?Va.basename(i[0].uri.fsPath):void 0;rl(e.prompt,a);let s=ul(e.prompt),r=ml(s),c=await Yt(),d=t.history.filter(m=>m instanceof z.ChatRequestTurn||m instanceof z.ChatResponseTurn),l="";if(c){let m=c.nickname||c.name;l=`
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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let m=await z.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(m.length===0){let w=qa(c);return n.markdown(`${w}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let p=m[0],h=[z.LanguageModelChatMessage.User(u),z.LanguageModelChatMessage.User(e.prompt)],v=await p.sendRequest(h,{},o);for await(let w of v.text)n.markdown(w);r&&n.markdown(`

---
*${r}*`)}catch(m){if(m instanceof z.LanguageModelError)console.error("Language model error:",m.message,m.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw m}return{metadata:{command:"general"}}}function kl(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function Pl(e){return e.history.length===0||e.history.length<=2}async function xl(e,t,n,o){let i=await Yt(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let c=await kt();c.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):c.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=gn(),r=s.isValid&&s.rootPath?await fn(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function Cl(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function Tl(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

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

`),{metadata:{command:"knowledge"}};n.progress(`\u{1F50D} Searching global knowledge for: ${e.prompt}`);try{let i=await Ct(e.prompt,{limit:5});if(i.length===0)n.markdown(`## \u{1F310} No Global Knowledge Found

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
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function El(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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

`),{metadata:{command:"saveinsight"}}}async function Il(e,t,n,o){n.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

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
`)}return{metadata:{command:"promote"}}}async function $l(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await Kn(),a=await _n();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

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
\`${Nn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function Fl(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await rt(),a=await ct();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),a&&n.markdown(`**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function Al(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await Pt(),a=await ct();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),a&&n.markdown(`
**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function Ml(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await xt();i.success?n.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${i.message}
`):n.markdown(`## \u274C Pull Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pulling: ${i}`)}return{metadata:{command:"pull"}}}async function Rl(e,t,n,o){return n.markdown(`## \u{1F4DA} Alex Documentation

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
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`),{metadata:{command:"docs"}}}var Dl={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Ba(e){let t=z.chat.createChatParticipant("alex.cognitive",pl);return t.iconPath=z.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=Dl,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===z.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var Bn=!1;async function Et(e,t){if(Bn){I.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}Bn=!0;try{return await t()}finally{Bn=!1}}function Ll(e){console.log("Alex Cognitive Architecture is now active!"),Nl(e),Ba(e),Ha(e),Ua(e),Da(e),La(e),ue().then(()=>{ja().catch(l=>{console.warn("Failed to register current project:",l)})}).catch(l=>{console.warn("Failed to initialize global knowledge directories:",l)});let t=I.commands.registerCommand("alex.initialize",async()=>{await Et("Initialize",()=>Zi(e))}),n=I.commands.registerCommand("alex.reset",async()=>{await Et("Reset",()=>hn(e))}),o=I.commands.registerCommand("alex.dream",async()=>{await Et("Dream Protocol",()=>na(e))}),i=I.commands.registerCommand("alex.upgrade",async()=>{await Et("Upgrade",()=>sa(e))}),a=I.commands.registerCommand("alex.selfActualize",async()=>{await Et("Self-Actualization",()=>za(e))}),s=I.commands.registerCommand("alex.syncKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let l=await rt();if(l.success){let u=await ct(),m=u?"View Gist":void 0;await I.window.showInformationMessage(`\u2705 ${l.message}`,...m?[m]:[])==="View Gist"&&u&&I.env.openExternal(I.Uri.parse(u))}else I.window.showErrorMessage(`\u274C ${l.message}`)})}),r=I.commands.registerCommand("alex.pushKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let l=await Pt();l.success?I.window.showInformationMessage(`\u2705 ${l.message}`):I.window.showErrorMessage(`\u274C ${l.message}`)})}),c=I.commands.registerCommand("alex.pullKnowledge",async()=>{await I.window.withProgress({location:I.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let l=await xt();l.success?I.window.showInformationMessage(`\u2705 ${l.message}`):I.window.showErrorMessage(`\u274C ${l.message}`)})}),d=I.commands.registerCommand("alex.openDocs",async()=>{let l=I.Uri.joinPath(e.extensionUri,"alex_docs","README.md");try{await I.commands.executeCommand("markdown.showPreview",l)}catch{let u=await I.workspace.openTextDocument(l);await I.window.showTextDocument(u)}});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a),e.subscriptions.push(s),e.subscriptions.push(r),e.subscriptions.push(c),e.subscriptions.push(d)}async function Nl(e){let t="alex.lastKnownVersion",n=I.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[a]=i.split(".").map(Number),[s]=o.split(".").map(Number),r=s>a,c="Run Upgrade",d="View Changelog",l="Dismiss",u=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await I.window.showInformationMessage(u,c,d,l);if(m===c)I.commands.executeCommand("alex.upgrade");else if(m===d){let p=I.Uri.joinPath(n.extensionUri,"CHANGELOG.md");I.commands.executeCommand("markdown.showPreview",p)}}function Ol(){}0&&(module.exports={activate,deactivate});
