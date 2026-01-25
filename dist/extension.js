"use strict";var Gs=Object.create;var bt=Object.defineProperty;var Us=Object.getOwnPropertyDescriptor;var Ks=Object.getOwnPropertyNames;var zs=Object.getPrototypeOf,qs=Object.prototype.hasOwnProperty;var C=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Hs=(e,t)=>{for(var n in t)bt(e,n,{get:t[n],enumerable:!0})},qn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ks(t))!qs.call(e,i)&&i!==n&&bt(e,i,{get:()=>t[i],enumerable:!(o=Us(t,i))||o.enumerable});return e};var M=(e,t,n)=>(n=e!=null?Gs(zs(e)):{},qn(t||!e||!e.__esModule?bt(n,"default",{value:e,enumerable:!0}):n,e)),Ws=e=>qn(bt({},"__esModule",{value:!0}),e);var ee=C(qt=>{"use strict";qt.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,s)=>i!=null?o(i):n(s)),e.apply(this,t)})},"name",{value:e.name})};qt.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Wn=C((yl,Hn)=>{var Ae=require("constants"),Vs=process.cwd,kt=null,Bs=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return kt||(kt=Vs.call(process)),kt};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Ht=process.chdir,process.chdir=function(e){kt=null,Ht.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Ht));var Ht;Hn.exports=Js;function Js(e){Ae.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=s(e.chown),e.fchown=s(e.fchown),e.lchown=s(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=a(e.chownSync),e.fchownSync=a(e.fchownSync),e.lchownSync=a(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=l(e.statSync),e.fstatSync=l(e.fstatSync),e.lstatSync=l(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(c,d,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(c,d,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),Bs==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(c){function d(m,p,y){var b=Date.now(),v=0;c(m,p,function w(E){if(E&&(E.code==="EACCES"||E.code==="EPERM"||E.code==="EBUSY")&&Date.now()-b<6e4){setTimeout(function(){e.stat(p,function(x,D){x&&x.code==="ENOENT"?c(m,p,w):y(E)})},v),v<100&&(v+=10);return}y&&y(E)})}return Object.setPrototypeOf&&Object.setPrototypeOf(d,c),d})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(c){function d(m,p,y,b,v,w){var E;if(w&&typeof w=="function"){var x=0;E=function(D,J,V){if(D&&D.code==="EAGAIN"&&x<10)return x++,c.call(e,m,p,y,b,v,E);w.apply(this,arguments)}}return c.call(e,m,p,y,b,v,E)}return Object.setPrototypeOf&&Object.setPrototypeOf(d,c),d})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(c){return function(d,m,p,y,b){for(var v=0;;)try{return c.call(e,d,m,p,y,b)}catch(w){if(w.code==="EAGAIN"&&v<10){v++;continue}throw w}}})(e.readSync);function t(c){c.lchmod=function(d,m,p){c.open(d,Ae.O_WRONLY|Ae.O_SYMLINK,m,function(y,b){if(y){p&&p(y);return}c.fchmod(b,m,function(v){c.close(b,function(w){p&&p(v||w)})})})},c.lchmodSync=function(d,m){var p=c.openSync(d,Ae.O_WRONLY|Ae.O_SYMLINK,m),y=!0,b;try{b=c.fchmodSync(p,m),y=!1}finally{if(y)try{c.closeSync(p)}catch{}else c.closeSync(p)}return b}}function n(c){Ae.hasOwnProperty("O_SYMLINK")&&c.futimes?(c.lutimes=function(d,m,p,y){c.open(d,Ae.O_SYMLINK,function(b,v){if(b){y&&y(b);return}c.futimes(v,m,p,function(w){c.close(v,function(E){y&&y(w||E)})})})},c.lutimesSync=function(d,m,p){var y=c.openSync(d,Ae.O_SYMLINK),b,v=!0;try{b=c.futimesSync(y,m,p),v=!1}finally{if(v)try{c.closeSync(y)}catch{}else c.closeSync(y)}return b}):c.futimes&&(c.lutimes=function(d,m,p,y){y&&process.nextTick(y)},c.lutimesSync=function(){})}function o(c){return c&&function(d,m,p){return c.call(e,d,m,function(y){u(y)&&(y=null),p&&p.apply(this,arguments)})}}function i(c){return c&&function(d,m){try{return c.call(e,d,m)}catch(p){if(!u(p))throw p}}}function s(c){return c&&function(d,m,p,y){return c.call(e,d,m,p,function(b){u(b)&&(b=null),y&&y.apply(this,arguments)})}}function a(c){return c&&function(d,m,p){try{return c.call(e,d,m,p)}catch(y){if(!u(y))throw y}}}function r(c){return c&&function(d,m,p){typeof m=="function"&&(p=m,m=null);function y(b,v){v&&(v.uid<0&&(v.uid+=4294967296),v.gid<0&&(v.gid+=4294967296)),p&&p.apply(this,arguments)}return m?c.call(e,d,m,y):c.call(e,d,y)}}function l(c){return c&&function(d,m){var p=m?c.call(e,d,m):c.call(e,d);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function u(c){if(!c||c.code==="ENOSYS")return!0;var d=!process.getuid||process.getuid()!==0;return!!(d&&(c.code==="EINVAL"||c.code==="EPERM"))}}});var Jn=C((vl,Bn)=>{var Vn=require("stream").Stream;Bn.exports=Ys;function Ys(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Vn.call(this);var s=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var a=Object.keys(i),r=0,l=a.length;r<l;r++){var u=a[r];this[u]=i[u]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){s._read()});return}e.open(this.path,this.flags,this.mode,function(c,d){if(c){s.emit("error",c),s.readable=!1;return}s.fd=d,s.emit("open",d),s._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Vn.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var s=Object.keys(i),a=0,r=s.length;a<r;a++){var l=s[a];this[l]=i[l]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var Xn=C((Sl,Yn)=>{"use strict";Yn.exports=Qs;var Xs=Object.getPrototypeOf||function(e){return e.__proto__};function Qs(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:Xs(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var Fe=C((bl,Bt)=>{var z=require("fs"),Zs=Wn(),ea=Jn(),ta=Xn(),Pt=require("util"),ie,Ct;typeof Symbol=="function"&&typeof Symbol.for=="function"?(ie=Symbol.for("graceful-fs.queue"),Ct=Symbol.for("graceful-fs.previous")):(ie="___graceful-fs.queue",Ct="___graceful-fs.previous");function na(){}function eo(e,t){Object.defineProperty(e,ie,{get:function(){return t}})}var Ne=na;Pt.debuglog?Ne=Pt.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(Ne=function(){var e=Pt.format.apply(Pt,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});z[ie]||(Qn=global[ie]||[],eo(z,Qn),z.close=(function(e){function t(n,o){return e.call(z,n,function(i){i||Zn(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Ct,{value:e}),t})(z.close),z.closeSync=(function(e){function t(n){e.apply(z,arguments),Zn()}return Object.defineProperty(t,Ct,{value:e}),t})(z.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){Ne(z[ie]),require("assert").equal(z[ie].length,0)}));var Qn;global[ie]||eo(global,z[ie]);Bt.exports=Wt(ta(z));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!z.__patched&&(Bt.exports=Wt(z),z.__patched=!0);function Wt(e){Zs(e),e.gracefulify=Wt,e.createReadStream=J,e.createWriteStream=V;var t=e.readFile;e.readFile=n;function n(S,F,$){return typeof F=="function"&&($=F,F=null),U(S,F,$);function U(Y,B,_,P){return t(Y,B,function(h){h&&(h.code==="EMFILE"||h.code==="ENFILE")?Ke([U,[Y,B,_],h,P||Date.now(),Date.now()]):typeof _=="function"&&_.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(S,F,$,U){return typeof $=="function"&&(U=$,$=null),Y(S,F,$,U);function Y(B,_,P,h,T){return o(B,_,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?Ke([Y,[B,_,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var s=e.appendFile;s&&(e.appendFile=a);function a(S,F,$,U){return typeof $=="function"&&(U=$,$=null),Y(S,F,$,U);function Y(B,_,P,h,T){return s(B,_,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?Ke([Y,[B,_,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=l);function l(S,F,$,U){return typeof $=="function"&&(U=$,$=0),Y(S,F,$,U);function Y(B,_,P,h,T){return r(B,_,P,function(I){I&&(I.code==="EMFILE"||I.code==="ENFILE")?Ke([Y,[B,_,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}var u=e.readdir;e.readdir=d;var c=/^v[0-5]\./;function d(S,F,$){typeof F=="function"&&($=F,F=null);var U=c.test(process.version)?function(_,P,h,T){return u(_,Y(_,P,h,T))}:function(_,P,h,T){return u(_,P,Y(_,P,h,T))};return U(S,F,$);function Y(B,_,P,h){return function(T,I){T&&(T.code==="EMFILE"||T.code==="ENFILE")?Ke([U,[B,_,P],T,h||Date.now(),Date.now()]):(I&&I.sort&&I.sort(),typeof P=="function"&&P.call(this,T,I))}}}if(process.version.substr(0,4)==="v0.8"){var m=ea(e);w=m.ReadStream,x=m.WriteStream}var p=e.ReadStream;p&&(w.prototype=Object.create(p.prototype),w.prototype.open=E);var y=e.WriteStream;y&&(x.prototype=Object.create(y.prototype),x.prototype.open=D),Object.defineProperty(e,"ReadStream",{get:function(){return w},set:function(S){w=S},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return x},set:function(S){x=S},enumerable:!0,configurable:!0});var b=w;Object.defineProperty(e,"FileReadStream",{get:function(){return b},set:function(S){b=S},enumerable:!0,configurable:!0});var v=x;Object.defineProperty(e,"FileWriteStream",{get:function(){return v},set:function(S){v=S},enumerable:!0,configurable:!0});function w(S,F){return this instanceof w?(p.apply(this,arguments),this):w.apply(Object.create(w.prototype),arguments)}function E(){var S=this;Z(S.path,S.flags,S.mode,function(F,$){F?(S.autoClose&&S.destroy(),S.emit("error",F)):(S.fd=$,S.emit("open",$),S.read())})}function x(S,F){return this instanceof x?(y.apply(this,arguments),this):x.apply(Object.create(x.prototype),arguments)}function D(){var S=this;Z(S.path,S.flags,S.mode,function(F,$){F?(S.destroy(),S.emit("error",F)):(S.fd=$,S.emit("open",$))})}function J(S,F){return new e.ReadStream(S,F)}function V(S,F){return new e.WriteStream(S,F)}var Q=e.open;e.open=Z;function Z(S,F,$,U){return typeof $=="function"&&(U=$,$=null),Y(S,F,$,U);function Y(B,_,P,h,T){return Q(B,_,P,function(I,ve){I&&(I.code==="EMFILE"||I.code==="ENFILE")?Ke([Y,[B,_,P,h],I,T||Date.now(),Date.now()]):typeof h=="function"&&h.apply(this,arguments)})}}return e}function Ke(e){Ne("ENQUEUE",e[0].name,e[1]),z[ie].push(e),Vt()}var xt;function Zn(){for(var e=Date.now(),t=0;t<z[ie].length;++t)z[ie][t].length>2&&(z[ie][t][3]=e,z[ie][t][4]=e);Vt()}function Vt(){if(clearTimeout(xt),xt=void 0,z[ie].length!==0){var e=z[ie].shift(),t=e[0],n=e[1],o=e[2],i=e[3],s=e[4];if(i===void 0)Ne("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){Ne("TIMEOUT",t.name,n);var a=n.pop();typeof a=="function"&&a.call(null,o)}else{var r=Date.now()-s,l=Math.max(s-i,1),u=Math.min(l*1.2,100);r>=u?(Ne("RETRY",t.name,n),t.apply(null,n.concat([i]))):z[ie].push(e)}xt===void 0&&(xt=setTimeout(Vt,0))}}});var ce=C(Pe=>{"use strict";var to=ee().fromCallback,re=Fe(),oa=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof re[e]=="function");Object.assign(Pe,re);oa.forEach(e=>{Pe[e]=to(re[e])});Pe.exists=function(e,t){return typeof t=="function"?re.exists(e,t):new Promise(n=>re.exists(e,n))};Pe.read=function(e,t,n,o,i,s){return typeof s=="function"?re.read(e,t,n,o,i,s):new Promise((a,r)=>{re.read(e,t,n,o,i,(l,u,c)=>{if(l)return r(l);a({bytesRead:u,buffer:c})})})};Pe.write=function(e,t,...n){return typeof n[n.length-1]=="function"?re.write(e,t,...n):new Promise((o,i)=>{re.write(e,t,...n,(s,a,r)=>{if(s)return i(s);o({bytesWritten:a,buffer:r})})})};Pe.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?re.readv(e,t,...n):new Promise((o,i)=>{re.readv(e,t,...n,(s,a,r)=>{if(s)return i(s);o({bytesRead:a,buffers:r})})})};Pe.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?re.writev(e,t,...n):new Promise((o,i)=>{re.writev(e,t,...n,(s,a,r)=>{if(s)return i(s);o({bytesWritten:a,buffers:r})})})};typeof re.realpath.native=="function"?Pe.realpath.native=to(re.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var oo=C((Pl,no)=>{"use strict";var ia=require("path");no.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(ia.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var ro=C((xl,Jt)=>{"use strict";var io=ce(),{checkPath:so}=oo(),ao=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};Jt.exports.makeDir=async(e,t)=>(so(e),io.mkdir(e,{mode:ao(t),recursive:!0}));Jt.exports.makeDirSync=(e,t)=>(so(e),io.mkdirSync(e,{mode:ao(t),recursive:!0}))});var we=C((Cl,co)=>{"use strict";var sa=ee().fromPromise,{makeDir:aa,makeDirSync:Yt}=ro(),Xt=sa(aa);co.exports={mkdirs:Xt,mkdirsSync:Yt,mkdirp:Xt,mkdirpSync:Yt,ensureDir:Xt,ensureDirSync:Yt}});var Re=C((Tl,uo)=>{"use strict";var ra=ee().fromPromise,lo=ce();function ca(e){return lo.access(e).then(()=>!0).catch(()=>!1)}uo.exports={pathExists:ra(ca),pathExistsSync:lo.existsSync}});var Qt=C((Il,mo)=>{"use strict";var ze=ce(),la=ee().fromPromise;async function ua(e,t,n){let o=await ze.open(e,"r+"),i=null;try{await ze.futimes(o,t,n)}finally{try{await ze.close(o)}catch(s){i=s}}if(i)throw i}function da(e,t,n){let o=ze.openSync(e,"r+");return ze.futimesSync(o,t,n),ze.closeSync(o)}mo.exports={utimesMillis:la(ua),utimesMillisSync:da}});var Oe=C((El,ho)=>{"use strict";var qe=ce(),te=require("path"),po=ee().fromPromise;function ma(e,t,n){let o=n.dereference?i=>qe.stat(i,{bigint:!0}):i=>qe.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,s])=>({srcStat:i,destStat:s}))}function pa(e,t,n){let o,i=n.dereference?a=>qe.statSync(a,{bigint:!0}):a=>qe.lstatSync(a,{bigint:!0}),s=i(e);try{o=i(t)}catch(a){if(a.code==="ENOENT")return{srcStat:s,destStat:null};throw a}return{srcStat:s,destStat:o}}async function ga(e,t,n,o){let{srcStat:i,destStat:s}=await ma(e,t,o);if(s){if(nt(i,s)){let a=te.basename(e),r=te.basename(t);if(n==="move"&&a!==r&&a.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:s,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!s.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&s.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Zt(e,t))throw new Error(Tt(e,t,n));return{srcStat:i,destStat:s}}function fa(e,t,n,o){let{srcStat:i,destStat:s}=pa(e,t,o);if(s){if(nt(i,s)){let a=te.basename(e),r=te.basename(t);if(n==="move"&&a!==r&&a.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:s,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!s.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&s.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Zt(e,t))throw new Error(Tt(e,t,n));return{srcStat:i,destStat:s}}async function go(e,t,n,o){let i=te.resolve(te.dirname(e)),s=te.resolve(te.dirname(n));if(s===i||s===te.parse(s).root)return;let a;try{a=await qe.stat(s,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(nt(t,a))throw new Error(Tt(e,n,o));return go(e,t,s,o)}function fo(e,t,n,o){let i=te.resolve(te.dirname(e)),s=te.resolve(te.dirname(n));if(s===i||s===te.parse(s).root)return;let a;try{a=qe.statSync(s,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(nt(t,a))throw new Error(Tt(e,n,o));return fo(e,t,s,o)}function nt(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function Zt(e,t){let n=te.resolve(e).split(te.sep).filter(i=>i),o=te.resolve(t).split(te.sep).filter(i=>i);return n.every((i,s)=>o[s]===i)}function Tt(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}ho.exports={checkPaths:po(ga),checkPathsSync:fa,checkParentPaths:po(go),checkParentPathsSync:fo,isSrcSubdir:Zt,areIdentical:nt}});var yo=C(($l,wo)=>{"use strict";async function ha(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}wo.exports={asyncIteratorConcurrentProcess:ha}});var Po=C((Al,ko)=>{"use strict";var se=ce(),ot=require("path"),{mkdirs:wa}=we(),{pathExists:ya}=Re(),{utimesMillis:va}=Qt(),it=Oe(),{asyncIteratorConcurrentProcess:Sa}=yo();async function ba(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await it.checkPaths(e,t,"copy",n);if(await it.checkParentPaths(e,o,t,"copy"),!await So(e,t,n))return;let a=ot.dirname(t);await ya(a)||await wa(a),await bo(i,e,t,n)}async function So(e,t,n){return n.filter?n.filter(e,t):!0}async function bo(e,t,n,o){let s=await(o.dereference?se.stat:se.lstat)(t);if(s.isDirectory())return Ca(s,e,t,n,o);if(s.isFile()||s.isCharacterDevice()||s.isBlockDevice())return ka(s,e,t,n,o);if(s.isSymbolicLink())return Ta(e,t,n,o);throw s.isSocket()?new Error(`Cannot copy a socket file: ${t}`):s.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function ka(e,t,n,o,i){if(!t)return vo(e,n,o,i);if(i.overwrite)return await se.unlink(o),vo(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function vo(e,t,n,o){if(await se.copyFile(t,n),o.preserveTimestamps){Pa(e.mode)&&await xa(n,e.mode);let i=await se.stat(t);await va(n,i.atime,i.mtime)}return se.chmod(n,e.mode)}function Pa(e){return(e&128)===0}function xa(e,t){return se.chmod(e,t|128)}async function Ca(e,t,n,o,i){t||await se.mkdir(o),await Sa(await se.opendir(n),async s=>{let a=ot.join(n,s.name),r=ot.join(o,s.name);if(await So(a,r,i)){let{destStat:u}=await it.checkPaths(a,r,"copy",i);await bo(u,a,r,i)}}),t||await se.chmod(o,e.mode)}async function Ta(e,t,n,o){let i=await se.readlink(t);if(o.dereference&&(i=ot.resolve(process.cwd(),i)),!e)return se.symlink(i,n);let s=null;try{s=await se.readlink(n)}catch(a){if(a.code==="EINVAL"||a.code==="UNKNOWN")return se.symlink(i,n);throw a}if(o.dereference&&(s=ot.resolve(process.cwd(),s)),i!==s){if(it.isSrcSubdir(i,s))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);if(it.isSrcSubdir(s,i))throw new Error(`Cannot overwrite '${s}' with '${i}'.`)}return await se.unlink(n),se.symlink(i,n)}ko.exports=ba});var Eo=C((Fl,Io)=>{"use strict";var le=Fe(),st=require("path"),Ia=we().mkdirsSync,Ea=Qt().utimesMillisSync,at=Oe();function $a(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=at.checkPathsSync(e,t,"copy",n);if(at.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let s=st.dirname(t);return le.existsSync(s)||Ia(s),xo(i,e,t,n)}function xo(e,t,n,o){let s=(o.dereference?le.statSync:le.lstatSync)(t);if(s.isDirectory())return Na(s,e,t,n,o);if(s.isFile()||s.isCharacterDevice()||s.isBlockDevice())return Aa(s,e,t,n,o);if(s.isSymbolicLink())return ja(e,t,n,o);throw s.isSocket()?new Error(`Cannot copy a socket file: ${t}`):s.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function Aa(e,t,n,o,i){return t?Fa(e,n,o,i):Co(e,n,o,i)}function Fa(e,t,n,o){if(o.overwrite)return le.unlinkSync(n),Co(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Co(e,t,n,o){return le.copyFileSync(t,n),o.preserveTimestamps&&Ra(e.mode,t,n),en(n,e.mode)}function Ra(e,t,n){return Ma(e)&&Da(n,e),La(t,n)}function Ma(e){return(e&128)===0}function Da(e,t){return en(e,t|128)}function en(e,t){return le.chmodSync(e,t)}function La(e,t){let n=le.statSync(e);return Ea(t,n.atime,n.mtime)}function Na(e,t,n,o,i){return t?To(n,o,i):Oa(e.mode,n,o,i)}function Oa(e,t,n,o){return le.mkdirSync(n),To(t,n,o),en(n,e)}function To(e,t,n){let o=le.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)_a(i.name,e,t,n)}finally{o.closeSync()}}function _a(e,t,n,o){let i=st.join(t,e),s=st.join(n,e);if(o.filter&&!o.filter(i,s))return;let{destStat:a}=at.checkPathsSync(i,s,"copy",o);return xo(a,i,s,o)}function ja(e,t,n,o){let i=le.readlinkSync(t);if(o.dereference&&(i=st.resolve(process.cwd(),i)),e){let s;try{s=le.readlinkSync(n)}catch(a){if(a.code==="EINVAL"||a.code==="UNKNOWN")return le.symlinkSync(i,n);throw a}if(o.dereference&&(s=st.resolve(process.cwd(),s)),i!==s){if(at.isSrcSubdir(i,s))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);if(at.isSrcSubdir(s,i))throw new Error(`Cannot overwrite '${s}' with '${i}'.`)}return Ga(i,n)}else return le.symlinkSync(i,n)}function Ga(e,t){return le.unlinkSync(t),le.symlinkSync(e,t)}Io.exports=$a});var It=C((Rl,$o)=>{"use strict";var Ua=ee().fromPromise;$o.exports={copy:Ua(Po()),copySync:Eo()}});var rt=C((Ml,Fo)=>{"use strict";var Ao=Fe(),Ka=ee().fromCallback;function za(e,t){Ao.rm(e,{recursive:!0,force:!0},t)}function qa(e){Ao.rmSync(e,{recursive:!0,force:!0})}Fo.exports={remove:Ka(za),removeSync:qa}});var jo=C((Dl,_o)=>{"use strict";var Ha=ee().fromPromise,Do=ce(),Lo=require("path"),No=we(),Oo=rt(),Ro=Ha(async function(t){let n;try{n=await Do.readdir(t)}catch{return No.mkdirs(t)}return Promise.all(n.map(o=>Oo.remove(Lo.join(t,o))))});function Mo(e){let t;try{t=Do.readdirSync(e)}catch{return No.mkdirsSync(e)}t.forEach(n=>{n=Lo.join(e,n),Oo.removeSync(n)})}_o.exports={emptyDirSync:Mo,emptydirSync:Mo,emptyDir:Ro,emptydir:Ro}});var zo=C((Ll,Ko)=>{"use strict";var Wa=ee().fromPromise,Go=require("path"),xe=ce(),Uo=we();async function Va(e){let t;try{t=await xe.stat(e)}catch{}if(t&&t.isFile())return;let n=Go.dirname(e),o=null;try{o=await xe.stat(n)}catch(i){if(i.code==="ENOENT"){await Uo.mkdirs(n),await xe.writeFile(e,"");return}else throw i}o.isDirectory()?await xe.writeFile(e,""):await xe.readdir(n)}function Ba(e){let t;try{t=xe.statSync(e)}catch{}if(t&&t.isFile())return;let n=Go.dirname(e);try{xe.statSync(n).isDirectory()||xe.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")Uo.mkdirsSync(n);else throw o}xe.writeFileSync(e,"")}Ko.exports={createFile:Wa(Va),createFileSync:Ba}});var Bo=C((Nl,Vo)=>{"use strict";var Ja=ee().fromPromise,qo=require("path"),Me=ce(),Ho=we(),{pathExists:Ya}=Re(),{areIdentical:Wo}=Oe();async function Xa(e,t){let n;try{n=await Me.lstat(t)}catch{}let o;try{o=await Me.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}if(n&&Wo(o,n))return;let i=qo.dirname(t);await Ya(i)||await Ho.mkdirs(i),await Me.link(e,t)}function Qa(e,t){let n;try{n=Me.lstatSync(t)}catch{}try{let s=Me.lstatSync(e);if(n&&Wo(s,n))return}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}let o=qo.dirname(t);return Me.existsSync(o)||Ho.mkdirsSync(o),Me.linkSync(e,t)}Vo.exports={createLink:Ja(Xa),createLinkSync:Qa}});var Yo=C((Ol,Jo)=>{"use strict";var De=require("path"),ct=ce(),{pathExists:Za}=Re(),er=ee().fromPromise;async function tr(e,t){if(De.isAbsolute(e)){try{await ct.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureSymlink"),s}return{toCwd:e,toDst:e}}let n=De.dirname(t),o=De.join(n,e);if(await Za(o))return{toCwd:o,toDst:e};try{await ct.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureSymlink"),s}return{toCwd:e,toDst:De.relative(n,e)}}function nr(e,t){if(De.isAbsolute(e)){if(!ct.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=De.dirname(t),o=De.join(n,e);if(ct.existsSync(o))return{toCwd:o,toDst:e};if(!ct.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:De.relative(n,e)}}Jo.exports={symlinkPaths:er(tr),symlinkPathsSync:nr}});var Zo=C((_l,Qo)=>{"use strict";var Xo=ce(),or=ee().fromPromise;async function ir(e,t){if(t)return t;let n;try{n=await Xo.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function sr(e,t){if(t)return t;let n;try{n=Xo.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}Qo.exports={symlinkType:or(ir),symlinkTypeSync:sr}});var oi=C((jl,ni)=>{"use strict";var ar=ee().fromPromise,ei=require("path"),Se=ce(),{mkdirs:rr,mkdirsSync:cr}=we(),{symlinkPaths:lr,symlinkPathsSync:ur}=Yo(),{symlinkType:dr,symlinkTypeSync:mr}=Zo(),{pathExists:pr}=Re(),{areIdentical:ti}=Oe();async function gr(e,t,n){let o;try{o=await Se.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,l]=await Promise.all([Se.stat(e),Se.stat(t)]);if(ti(r,l))return}let i=await lr(e,t);e=i.toDst;let s=await dr(i.toCwd,n),a=ei.dirname(t);return await pr(a)||await rr(a),Se.symlink(e,t,s)}function fr(e,t,n){let o;try{o=Se.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=Se.statSync(e),l=Se.statSync(t);if(ti(r,l))return}let i=ur(e,t);e=i.toDst,n=mr(i.toCwd,n);let s=ei.dirname(t);return Se.existsSync(s)||cr(s),Se.symlinkSync(e,t,n)}ni.exports={createSymlink:ar(gr),createSymlinkSync:fr}});var di=C((Gl,ui)=>{"use strict";var{createFile:ii,createFileSync:si}=zo(),{createLink:ai,createLinkSync:ri}=Bo(),{createSymlink:ci,createSymlinkSync:li}=oi();ui.exports={createFile:ii,createFileSync:si,ensureFile:ii,ensureFileSync:si,createLink:ai,createLinkSync:ri,ensureLink:ai,ensureLinkSync:ri,createSymlink:ci,createSymlinkSync:li,ensureSymlink:ci,ensureSymlinkSync:li}});var Et=C((Ul,mi)=>{function hr(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let s=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+s}function wr(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}mi.exports={stringify:hr,stripBom:wr}});var hi=C((Kl,fi)=>{var He;try{He=Fe()}catch{He=require("fs")}var $t=ee(),{stringify:pi,stripBom:gi}=Et();async function yr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||He,o="throws"in t?t.throws:!0,i=await $t.fromCallback(n.readFile)(e,t);i=gi(i);let s;try{s=JSON.parse(i,t?t.reviver:null)}catch(a){if(o)throw a.message=`${e}: ${a.message}`,a;return null}return s}var vr=$t.fromPromise(yr);function Sr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||He,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=gi(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function br(e,t,n={}){let o=n.fs||He,i=pi(t,n);await $t.fromCallback(o.writeFile)(e,i,n)}var kr=$t.fromPromise(br);function Pr(e,t,n={}){let o=n.fs||He,i=pi(t,n);return o.writeFileSync(e,i,n)}fi.exports={readFile:vr,readFileSync:Sr,writeFile:kr,writeFileSync:Pr}});var yi=C((zl,wi)=>{"use strict";var At=hi();wi.exports={readJson:At.readFile,readJsonSync:At.readFileSync,writeJson:At.writeFile,writeJsonSync:At.writeFileSync}});var Ft=C((ql,bi)=>{"use strict";var xr=ee().fromPromise,tn=ce(),vi=require("path"),Si=we(),Cr=Re().pathExists;async function Tr(e,t,n="utf-8"){let o=vi.dirname(e);return await Cr(o)||await Si.mkdirs(o),tn.writeFile(e,t,n)}function Ir(e,...t){let n=vi.dirname(e);tn.existsSync(n)||Si.mkdirsSync(n),tn.writeFileSync(e,...t)}bi.exports={outputFile:xr(Tr),outputFileSync:Ir}});var Pi=C((Hl,ki)=>{"use strict";var{stringify:Er}=Et(),{outputFile:$r}=Ft();async function Ar(e,t,n={}){let o=Er(t,n);await $r(e,o,n)}ki.exports=Ar});var Ci=C((Wl,xi)=>{"use strict";var{stringify:Fr}=Et(),{outputFileSync:Rr}=Ft();function Mr(e,t,n){let o=Fr(t,n);Rr(e,o,n)}xi.exports=Mr});var Ii=C((Vl,Ti)=>{"use strict";var Dr=ee().fromPromise,ue=yi();ue.outputJson=Dr(Pi());ue.outputJsonSync=Ci();ue.outputJSON=ue.outputJson;ue.outputJSONSync=ue.outputJsonSync;ue.writeJSON=ue.writeJson;ue.writeJSONSync=ue.writeJsonSync;ue.readJSON=ue.readJson;ue.readJSONSync=ue.readJsonSync;Ti.exports=ue});var Ri=C((Bl,Fi)=>{"use strict";var Lr=ce(),Ei=require("path"),{copy:Nr}=It(),{remove:Ai}=rt(),{mkdirp:Or}=we(),{pathExists:_r}=Re(),$i=Oe();async function jr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:s=!1}=await $i.checkPaths(e,t,"move",n);await $i.checkParentPaths(e,i,t,"move");let a=Ei.dirname(t);return Ei.parse(a).root!==a&&await Or(a),Gr(e,t,o,s)}async function Gr(e,t,n,o){if(!o){if(n)await Ai(t);else if(await _r(t))throw new Error("dest already exists.")}try{await Lr.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Ur(e,t,n)}}async function Ur(e,t,n){return await Nr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Ai(e)}Fi.exports=jr});var Oi=C((Jl,Ni)=>{"use strict";var Di=Fe(),on=require("path"),Kr=It().copySync,Li=rt().removeSync,zr=we().mkdirpSync,Mi=Oe();function qr(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:s=!1}=Mi.checkPathsSync(e,t,"move",n);return Mi.checkParentPathsSync(e,i,t,"move"),Hr(t)||zr(on.dirname(t)),Wr(e,t,o,s)}function Hr(e){let t=on.dirname(e);return on.parse(t).root===t}function Wr(e,t,n,o){if(o)return nn(e,t,n);if(n)return Li(t),nn(e,t,n);if(Di.existsSync(t))throw new Error("dest already exists.");return nn(e,t,n)}function nn(e,t,n){try{Di.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return Vr(e,t,n)}}function Vr(e,t,n){return Kr(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),Li(e)}Ni.exports=qr});var ji=C((Yl,_i)=>{"use strict";var Br=ee().fromPromise;_i.exports={move:Br(Ri()),moveSync:Oi()}});var Ce=C((Xl,Gi)=>{"use strict";Gi.exports={...ce(),...It(),...jo(),...di(),...Ii(),...we(),...ji(),...Ft(),...Re(),...rt()}});var Ji=C((tu,Bi)=>{function fe(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}Bi.exports=fe;fe.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};fe.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};fe.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};fe.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};fe.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};fe.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};fe.prototype.start=fe.prototype.try;fe.prototype.errors=function(){return this._errors};fe.prototype.attempts=function(){return this._attempts};fe.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],s=i.message,a=(e[s]||0)+1;e[s]=a,a>=n&&(t=i,n=a)}return t}});var Yi=C(_e=>{var oc=Ji();_e.operation=function(e){var t=_e.timeouts(e);return new oc(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};_e.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(s,a){return s-a}),o};_e.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};_e.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var s=n[i],a=e[s];e[s]=function(l){var u=_e.operation(t),c=Array.prototype.slice.call(arguments,1),d=c.pop();c.push(function(m){u.retry(m)||(m&&(arguments[0]=u.mainError()),d.apply(this,arguments))}),u.attempt(function(){l.apply(e,c)})}.bind(e,a),e[s].options=t}}});var Qi=C((ou,Xi)=>{Xi.exports=Yi()});var Zi=C((iu,Rt)=>{Rt.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Rt.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Rt.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var is=C((su,Be)=>{var K=global.process,je=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};je(K)?(es=require("assert"),We=Zi(),ts=/^win/i.test(K.platform),ut=require("events"),typeof ut!="function"&&(ut=ut.EventEmitter),K.__signal_exit_emitter__?ne=K.__signal_exit_emitter__:(ne=K.__signal_exit_emitter__=new ut,ne.count=0,ne.emitted={}),ne.infinite||(ne.setMaxListeners(1/0),ne.infinite=!0),Be.exports=function(e,t){if(!je(global.process))return function(){};es.equal(typeof e,"function","a callback must be provided for exit handler"),Ve===!1&&an();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){ne.removeListener(n,e),ne.listeners("exit").length===0&&ne.listeners("afterexit").length===0&&Mt()};return ne.on(n,e),o},Mt=function(){!Ve||!je(global.process)||(Ve=!1,We.forEach(function(t){try{K.removeListener(t,Dt[t])}catch{}}),K.emit=Lt,K.reallyExit=rn,ne.count-=1)},Be.exports.unload=Mt,Ge=function(t,n,o){ne.emitted[t]||(ne.emitted[t]=!0,ne.emit(t,n,o))},Dt={},We.forEach(function(e){Dt[e]=function(){if(je(global.process)){var n=K.listeners(e);n.length===ne.count&&(Mt(),Ge("exit",null,e),Ge("afterexit",null,e),ts&&e==="SIGHUP"&&(e="SIGINT"),K.kill(K.pid,e))}}}),Be.exports.signals=function(){return We},Ve=!1,an=function(){Ve||!je(global.process)||(Ve=!0,ne.count+=1,We=We.filter(function(t){try{return K.on(t,Dt[t]),!0}catch{return!1}}),K.emit=os,K.reallyExit=ns)},Be.exports.load=an,rn=K.reallyExit,ns=function(t){je(global.process)&&(K.exitCode=t||0,Ge("exit",K.exitCode,null),Ge("afterexit",K.exitCode,null),rn.call(K,K.exitCode))},Lt=K.emit,os=function(t,n){if(t==="exit"&&je(global.process)){n!==void 0&&(K.exitCode=n);var o=Lt.apply(this,arguments);return Ge("exit",K.exitCode,null),Ge("afterexit",K.exitCode,null),o}else return Lt.apply(this,arguments)}):Be.exports=function(){return function(){}};var es,We,ts,ut,ne,Mt,Ge,Dt,Ve,an,rn,ns,Lt,os});var as=C((au,cn)=>{"use strict";var ss=Symbol();function ic(e,t,n){let o=t[ss];if(o)return t.stat(e,(s,a)=>{if(s)return n(s);n(null,a.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,s=>{if(s)return n(s);t.stat(e,(a,r)=>{if(a)return n(a);let l=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,ss,{value:l}),n(null,r.mtime,l)})})}function sc(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}cn.exports.probe=ic;cn.exports.getMtime=sc});var ds=C((ru,mt)=>{"use strict";var ac=require("path"),dn=Fe(),rc=Qi(),cc=is(),rs=as(),Te={};function dt(e,t){return t.lockfilePath||`${e}.lock`}function mn(e,t,n){if(!t.realpath)return n(null,ac.resolve(e));t.fs.realpath(e,n)}function un(e,t,n){let o=dt(e,t);t.fs.mkdir(o,i=>{if(!i)return rs.probe(o,t.fs,(s,a,r)=>{if(s)return t.fs.rmdir(o,()=>{}),n(s);n(null,a,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(s,a)=>{if(s)return s.code==="ENOENT"?un(e,{...t,stale:0},n):n(s);if(!cs(a,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));ls(e,t,r=>{if(r)return n(r);un(e,{...t,stale:0},n)})})})}function cs(e,t){return e.mtime.getTime()<Date.now()-t.stale}function ls(e,t,n){t.fs.rmdir(dt(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function Nt(e,t){let n=Te[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let s=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||s?ln(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Nt(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return ln(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=rs.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,l=>{let u=n.lastUpdate+t.stale<Date.now();if(!n.released){if(l)return l.code==="ENOENT"||u?ln(e,n,Object.assign(l,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,Nt(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,Nt(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function ln(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),Te[e]===t&&delete Te[e],t.options.onCompromised(n)}function lc(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:dn,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),mn(e,t,(o,i)=>{if(o)return n(o);let s=rc.operation(t.retries);s.attempt(()=>{un(i,t,(a,r,l)=>{if(s.retry(a))return;if(a)return n(s.mainError());let u=Te[i]={lockfilePath:dt(i,t),mtime:r,mtimePrecision:l,options:t,lastUpdate:Date.now()};Nt(i,t),n(null,c=>{if(u.released)return c&&c(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));us(i,{...t,realpath:!1},c)})})})})}function us(e,t,n){t={fs:dn,realpath:!0,...t},mn(e,t,(o,i)=>{if(o)return n(o);let s=Te[i];if(!s)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));s.updateTimeout&&clearTimeout(s.updateTimeout),s.released=!0,delete Te[i],ls(i,t,n)})}function uc(e,t,n){t={stale:1e4,realpath:!0,fs:dn,...t},t.stale=Math.max(t.stale||0,2e3),mn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(dt(i,t),(s,a)=>s?s.code==="ENOENT"?n(null,!1):n(s):n(null,!cs(a,t)))})}function dc(){return Te}cc(()=>{for(let e in Te){let t=Te[e].options;try{t.fs.rmdirSync(dt(e,t))}catch{}}});mt.exports.lock=lc;mt.exports.unlock=us;mt.exports.check=uc;mt.exports.getLocks=dc});var ps=C((cu,ms)=>{"use strict";var mc=Fe();function pc(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let s=i.pop(),a;try{a=e[`${o}Sync`](...i)}catch(r){return s(r)}s(null,a)}}),n}function gc(e){return(...t)=>new Promise((n,o)=>{t.push((i,s)=>{i?o(i):n(s)}),e(...t)})}function fc(e){return(...t)=>{let n,o;if(t.push((i,s)=>{n=i,o=s}),e(...t),n)throw n;return o}}function hc(e){if(e={...e},e.fs=pc(e.fs||mc),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}ms.exports={toPromise:gc,toSync:fc,toSyncOptions:hc}});var fs=C((lu,Le)=>{"use strict";var Je=ds(),{toPromise:Ot,toSync:_t,toSyncOptions:pn}=ps();async function gs(e,t){let n=await Ot(Je.lock)(e,t);return Ot(n)}function wc(e,t){let n=_t(Je.lock)(e,pn(t));return _t(n)}function yc(e,t){return Ot(Je.unlock)(e,t)}function vc(e,t){return _t(Je.unlock)(e,pn(t))}function Sc(e,t){return Ot(Je.check)(e,t)}function bc(e,t){return _t(Je.check)(e,pn(t))}Le.exports=gs;Le.exports.lock=gs;Le.exports.unlock=yc;Le.exports.lockSync=wc;Le.exports.unlockSync=vc;Le.exports.check=Sc;Le.exports.checkSync=bc});var fl={};Hs(fl,{activate:()=>ml,deactivate:()=>gl});module.exports=Ws(fl);var A=M(require("vscode"));var q=M(require("vscode")),pe=M(Ce()),L=M(require("path"));async function Ui(e){let t=q.workspace.workspaceFolders;if(!t){q.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=L.join(n,".github","copilot-instructions.md");if(await pe.pathExists(o)){let i=await q.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await q.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await sn(e);return}await Ki(e,n,!1)}async function sn(e){let t=q.workspace.workspaceFolders;if(!t){q.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await q.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await q.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[L.join(n,".github","copilot-instructions.md"),L.join(n,".github","instructions"),L.join(n,".github","prompts"),L.join(n,".github","episodic"),L.join(n,".github","domain-knowledge"),L.join(n,".github","config"),L.join(n,".alex-manifest.json")];try{await q.window.withProgress({location:q.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async s=>{s.report({message:"Cleaning up existing files..."});for(let a of i)await pe.remove(a)}),await Ki(e,n,!0)}catch(s){q.window.showErrorMessage(`Failed to reset Alex: ${s.message}`)}}async function Ki(e,t,n){let o=e.extensionPath,i=L.join(o,".github","copilot-instructions.md");if(!await pe.pathExists(i)){q.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s=[{src:L.join(o,".github","copilot-instructions.md"),dest:L.join(t,".github","copilot-instructions.md")},{src:L.join(o,".github","instructions"),dest:L.join(t,".github","instructions")},{src:L.join(o,".github","prompts"),dest:L.join(t,".github","prompts")},{src:L.join(o,".github","episodic"),dest:L.join(t,".github","episodic")},{src:L.join(o,".github","domain-knowledge"),dest:L.join(t,".github","domain-knowledge")},{src:L.join(o,".github","config"),dest:L.join(t,".github","config")},{src:L.join(o,".github","agents"),dest:L.join(t,".github","agents")}];try{let a=L.join(t,".github");await pe.ensureDir(a);let r=L.join(a,".write-test");try{await pe.writeFile(r,"test"),await pe.remove(r)}catch(u){throw new Error(`Cannot write to workspace - check folder permissions: ${u.message}`)}await q.window.withProgress({location:q.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async u=>{for(let c of s)u.report({message:`Copying ${L.basename(c.dest)}...`}),await pe.pathExists(c.src)?await pe.copy(c.src,c.dest,{overwrite:n}):console.warn(`Source not found: ${c.src}`)});let l=await q.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(l==="Open Main Brain File"){let u=L.join(t,".github","copilot-instructions.md"),c=await q.workspace.openTextDocument(u);await q.window.showTextDocument(c)}else l==="Run Dream Protocol"&&await q.commands.executeCommand("alex.dream")}catch(a){q.window.showErrorMessage(`Failed to initialize Alex: ${a.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var X=M(require("vscode")),ye=M(Ce()),de=M(require("path")),zi={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function qi(e){let t=X.workspace.workspaceFolders;if(!t){X.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await X.window.withProgress({location:X.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=[];for(let w of i){let E=new X.RelativePattern(t[0],w),x=await X.workspace.findFiles(E);s=s.concat(x.map(D=>D.fsPath))}if(s=[...new Set(s)],s.length===0){await X.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await X.commands.executeCommand("alex.initialize");return}let a=[],r=new Set(s.map(w=>de.normalize(w).toLowerCase())),l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let w of s){let E;try{E=await ye.readFile(w,"utf-8")}catch(J){console.error(`Failed to read file ${w}:`,J);continue}let x=E.split(`
`),D=!1;for(let J=0;J<x.length;J++){let V=x[J];if(V.trim().startsWith("```")){D=!D;continue}if(D)continue;let Q;for(;(Q=l.exec(V))!==null;){let Z=Q[1].trim(),S=Array.from(r).some($=>$.endsWith(de.normalize(Z).toLowerCase()));if(!S){let $=de.join(n,Z);(await ye.pathExists($)||(await X.workspace.findFiles(new X.RelativePattern(t[0],`**/${Z}`))).length>0)&&(S=!0)}if(!S){let $=de.dirname(w),U=de.join($,Z);await ye.pathExists(U)&&(S=!0)}["target-file.md","CHANGELOG.md"].includes(Z)&&(S=!0),a.push({sourceFile:w,targetFile:Z,strength:Q[2].trim(),type:Q[3]?.trim()||"association",direction:Q[4]?.trim()||"unidirectional",condition:Q[5]?.trim(),line:J+1,isValid:S})}}}let u=a.filter(w=>!w.isValid),c=new Set(a.map(w=>w.targetFile.toLowerCase())),d=[],m=[];for(let w of u){let E=de.basename(w.targetFile);if(zi[E]){let x=zi[E];try{let D=await ye.readFile(w.sourceFile,"utf-8"),J=w.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),V=new RegExp(`\\[${J}\\]`,"g");if(V.test(D)){let Q=D.replace(V,`[${x}]`);await ye.writeFile(w.sourceFile,Q,"utf-8"),w.repaired=!0,w.newTarget=x,d.push(w)}else m.push(w)}catch(D){console.error(`Failed to repair synapse in ${w.sourceFile}:`,D),m.push(w)}}else m.push(w)}u=m;let p={timestamp:new Date().toISOString(),totalFiles:s.length,totalSynapses:a.length,brokenSynapses:u,repairedSynapses:d,orphanedFiles:[]},y=Jr(p),b=de.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await ye.ensureDir(de.dirname(b)),await ye.writeFile(b,y),u.length>0){if(await X.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${u.length} broken synapse${u.length>1?"s":""}!

${d.length>0?`\u2705 Auto-repaired: ${d.length}
`:""}\u274C Need manual repair: ${u.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let w=a.length>50?"excellent":a.length>20?"good":"developing";if(await X.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${s.length} memory files
\u2022 ${a.length} active synapses
${d.length>0?`\u2022 ${d.length} auto-repaired
`:""}\u2022 Network health: ${w}`,"View Full Report","Close")!=="View Full Report")return}let v=await X.workspace.openTextDocument(b);await X.window.showTextDocument(v)})}function Jr(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${de.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${de.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var W=M(require("vscode")),f=M(Ce()),k=M(require("path")),Wi=M(require("crypto"));function lt(e){return Wi.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function Yr(e){let t=k.join(e,".github","copilot-instructions.md");if(!await f.pathExists(t))return null;try{let o=(await f.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function Xr(e){try{return(await f.readJson(k.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function Qr(e){let t=k.join(e,".alex-manifest.json");if(await f.pathExists(t))try{return await f.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function Zr(e,t,n){let o=k.join(e,".github","copilot-instructions.md"),i=k.join(t,".github","copilot-instructions.md");if(!await f.pathExists(o)||!await f.pathExists(i))return{success:!1,reason:"File not found"};try{let s=await f.readFile(o,"utf8"),a=await f.readFile(i,"utf8"),r=s.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/),l=r?r[0]:null,u=s.match(/## Synapses[\s\S]*?(?=##|$)/),c=s.split(`
`).length,d=a.split(`
`).length;if(c>d*1.2)return{success:!1,reason:"User file has significant customizations"};let m=s.match(/^## [^\n]+/gm)||[],p=a.match(/^## [^\n]+/gm)||[],y=m.filter(v=>!p.includes(v));if(y.length>2)return{success:!1,reason:`User has ${y.length} custom sections`};let b=a;if(l&&l.includes("P5")&&!l.includes("Available for")){let v=b.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);v&&(b=b.replace(v[0],l))}return b=b.replace(/\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,`**Version**: ${n}`),await f.writeFile(o,b,"utf8"),{success:!0}}catch(s){return{success:!1,reason:s.message}}}async function Hi(e){let t=[];if(!await f.pathExists(e))return t;try{let n=await f.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function ec(e,t){let n=[],o=k.join(e,".github","domain-knowledge");if(await f.pathExists(o)){let i=await f.readdir(o);for(let s of i)if(s.endsWith(".md")){let a=`.github/domain-knowledge/${s}`;t?.files[a]||n.push(a)}}return n}async function Vi(e){let t=W.workspace.workspaceFolders;if(!t){W.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,i=k.join(n,".github","copilot-instructions.md");if(!await f.pathExists(i)){await W.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await W.commands.executeCommand("alex.initialize");return}let s=await Yr(n),a=await Xr(o);if(s===a){await W.window.showInformationMessage(`\u2705 Alex is already at the latest version (${a}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await W.commands.executeCommand("alex.dream");return}let r=await W.window.showInformationMessage(`\u{1F504} Upgrade Available: v${s||"unknown"} \u2192 v${a}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(r==="What's New?"){let l=k.join(o,"CHANGELOG.md");if(await f.pathExists(l)){let u=await W.workspace.openTextDocument(l);await W.window.showTextDocument(u)}return}r==="Start Upgrade"&&await tc(e,n,o,s,a)}async function tc(e,t,n,o,i){let s=k.join(n,".github","copilot-instructions.md");if(!await f.pathExists(s)){W.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),l=k.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await W.window.withProgress({location:W.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async d=>{d.report({message:"Creating complete backup...",increment:15});try{await f.ensureDir(l);let P=k.join(l,".write-test");await f.writeFile(P,"test"),await f.remove(P)}catch(P){throw new Error(`Cannot create backup directory - check disk space and permissions: ${P.message}`)}let m=k.join(t,".github");await f.pathExists(m)&&(await f.copy(m,k.join(l,".github")),a.backed_up.push(".github/ (all cognitive memory)")),d.report({message:"Analyzing installed files...",increment:10});let p=await Qr(t);p||(p={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),d.report({message:"Scanning for schema migration needs...",increment:15});let y=[],b=k.join(t,".github","copilot-instructions.md");await f.pathExists(b)&&y.push(b);let v=k.join(t,".github","domain-knowledge");if(await f.pathExists(v)){let P=await f.readdir(v);for(let h of P)h.endsWith(".md")&&y.push(k.join(v,h))}let w=k.join(t,".github","episodic");if(await f.pathExists(w)){let P=await f.readdir(w);for(let h of P)h.endsWith(".md")&&y.push(k.join(w,h))}for(let P of y){let h=await Hi(P);if(h.length>0){let T=k.relative(t,P);a.migrationTasks.push({file:T,type:"schema-migration",description:"Synapse schema migration needed",details:h})}}d.report({message:"Identifying user-created files...",increment:10});let E=await ec(t,p);for(let P of E){a.preserved.push(`${P} (user-created)`);let h=k.join(t,P),T=await Hi(h);T.length>0&&a.migrationTasks.push({file:P,type:"schema-migration",description:"User-created file needs schema migration",details:T})}d.report({message:"Merging core brain file...",increment:10});let x=await Zr(t,n,i);x.success?a.updated.push(".github/copilot-instructions.md (auto-merged)"):a.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires manual merge",details:[`Auto-merge failed: ${x.reason}`,"UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),d.report({message:"Updating system files...",increment:20});let D=k.join(n,".github","instructions"),J=k.join(t,".github","instructions");if(await f.pathExists(D)){let P=await f.readdir(D);for(let h of P){let T=k.join(D,h),I=k.join(J,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/instructions/${h}`]={type:"system",originalChecksum:lt($e)},ve?a.updated.push(`.github/instructions/${h}`):a.added.push(`.github/instructions/${h}`)}}}let V=k.join(n,".github","prompts"),Q=k.join(t,".github","prompts");if(await f.pathExists(V)){let P=await f.readdir(V);for(let h of P){let T=k.join(V,h),I=k.join(Q,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/prompts/${h}`]={type:"system",originalChecksum:lt($e)},ve?a.updated.push(`.github/prompts/${h}`):a.added.push(`.github/prompts/${h}`)}}}let Z=k.join(n,".github","agents"),S=k.join(t,".github","agents");if(await f.pathExists(Z)){await f.ensureDir(S);let P=await f.readdir(Z);for(let h of P){let T=k.join(Z,h),I=k.join(S,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0});let $e=await f.readFile(T,"utf8");p.files[`.github/agents/${h}`]={type:"system",originalChecksum:lt($e)},ve?a.updated.push(`.github/agents/${h}`):a.added.push(`.github/agents/${h}`)}}}let F=k.join(n,".github","config"),$=k.join(t,".github","config");if(await f.pathExists(F)){await f.ensureDir($);let P=await f.readdir(F);for(let h of P)if(h.includes("template")||h==="USER-PROFILE-TEMPLATE.md"){let T=k.join(F,h),I=k.join($,h);if((await f.stat(T)).isFile()){let ve=await f.pathExists(I);await f.copy(T,I,{overwrite:!0}),ve?a.updated.push(`.github/config/${h}`):a.added.push(`.github/config/${h}`)}}}d.report({message:"Processing domain knowledge...",increment:10});let U=k.join(n,".github","domain-knowledge"),Y=k.join(t,".github","domain-knowledge");if(await f.pathExists(U)){await f.ensureDir(Y);let P=await f.readdir(U);for(let h of P){let T=k.join(U,h),I=k.join(Y,h);if((await f.stat(T)).isFile()){let ve=await f.readFile(T,"utf8"),$e=lt(ve);if(!await f.pathExists(I))await f.copy(T,I),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:$e},a.added.push(`.github/domain-knowledge/${h}`);else{let _s=await f.readFile(I,"utf8"),js=lt(_s),zn=p.files[`.github/domain-knowledge/${h}`]?.originalChecksum;if(zn&&js!==zn){let zt=I.replace(/\.md$/,`.v${i}.md`);await f.copy(T,zt),a.preserved.push(`.github/domain-knowledge/${h} (modified by user, new version: ${k.basename(zt)})`),a.migrationTasks.push({file:`.github/domain-knowledge/${h}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${h}`,`New version available: ${k.basename(zt)}`,"Review and merge changes as needed"]})}else await f.copy(T,I,{overwrite:!0}),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:$e},a.updated.push(`.github/domain-knowledge/${h}`)}}}}d.report({message:"Saving manifest...",increment:5}),p.version=i,p.upgradedAt=new Date().toISOString();let B=k.join(t,".alex-manifest.json"),_=B+".tmp";await f.writeJson(_,p,{spaces:2}),await f.move(_,B,{overwrite:!0}),d.report({message:"Generating upgrade instructions...",increment:5}),await nc(t,o,i,a,l,r)});let u=a.migrationTasks.length===1?"task":"tasks",c=await W.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${a.backed_up.length} folders
\u2022 Files updated: ${a.updated.length}
\u2022 Files added: ${a.added.length}
\u2022 Files preserved: ${a.preserved.length}
\u2022 Migration ${u}: ${a.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(c==="Open Instructions (Recommended)"){let d=k.join(t,"UPGRADE-INSTRUCTIONS.md"),m=await W.workspace.openTextDocument(d);await W.window.showTextDocument(m)}else if(c==="View Full Report"){let d=k.join(t,"archive","upgrades",`upgrade-report-${r}.md`),m=await W.workspace.openTextDocument(d);await W.window.showTextDocument(m)}}catch(u){W.window.showErrorMessage(`\u274C Upgrade failed: ${u.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),a.errors.push(u.message)}}async function nc(e,t,n,o,i,s){let a=`# \u{1F504} Alex Upgrade: Phase 2 Required

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

1. Reading the upgrade tasks in archive/upgrades/upgrade-report-${s}.md
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

${o.migrationTasks.length>0?o.migrationTasks.map((u,c)=>`
### Task ${c+1}: ${u.file}

**Type**: ${u.type}  
**Description**: ${u.description}

${u.details.map(d=>`- ${d}`).join(`
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

- Full upgrade report: \`archive/upgrades/upgrade-report-${s}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${k.relative(e,i)}\`

---

*This file will be deleted after successful upgrade completion.*
`;await f.writeFile(k.join(e,"UPGRADE-INSTRUCTIONS.md"),a,"utf8");let r=`# Alex Cognitive Architecture Upgrade Report

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

## Migration Tasks (Require AI Assistance)

${o.migrationTasks.length>0?o.migrationTasks.map((u,c)=>`
### ${c+1}. ${u.file}

**Type**: \`${u.type}\`  
**Description**: ${u.description}

**Details**:
${u.details.map(d=>`- ${d}`).join(`
`)}
`).join(`
---
`):"No migration tasks required."}

---

${o.errors.length>0?`## Errors

${o.errors.map(u=>`- \u274C ${u}`).join(`
`)}`:""}

## Next Steps

1. Read \`UPGRADE-INSTRUCTIONS.md\` in workspace root
2. Ask AI assistant to complete Phase 2 migration
3. Run \`Alex: Dream (Neural Maintenance)\` to validate
4. Delete \`UPGRADE-INSTRUCTIONS.md\` when complete

---

*Report generated by Alex Cognitive Architecture v${n}*
`,l=k.join(e,"archive","upgrades",`upgrade-report-${s}.md`);await f.ensureDir(k.dirname(l)),await f.writeFile(l,r,"utf8")}var N=M(require("vscode")),ke=M(Ce()),Ut=M(require("path"));var R=M(require("vscode")),O=M(Ce()),me=M(require("path")),Cn=M(require("os")),Ts=M(fs());var hs=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,ws=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ie=".alex",ys={root:Ie,knowledge:`${Ie}/global-knowledge`,patterns:`${Ie}/global-knowledge/patterns`,insights:`${Ie}/global-knowledge/insights`,index:`${Ie}/global-knowledge/index.json`,projectRegistry:`${Ie}/project-registry.json`,globalProfile:`${Ie}/user-profile.json`},gn={pattern:"GK-",insight:"GI-"};var he=M(require("vscode")),H=M(Ce()),Ee=M(require("path")),vs=M(require("https"));var Ue="alex-knowledge-index.json",Ss="Alex Cognitive Architecture - Global Knowledge Base";async function kc(){try{return await he.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function pt(e,t={}){let n=await kc();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let s=new URL(`https://api.github.com${e}`),a={hostname:s.hostname,path:s.pathname+s.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=vs.request(a,l=>{let u="";l.on("data",c=>{u+=c}),l.on("end",()=>{if(l.statusCode&&l.statusCode>=200&&l.statusCode<300)if(l.statusCode===204||!u)o(null);else try{o(JSON.parse(u))}catch(c){i(new Error(`Failed to parse GitHub response: ${c}`))}else i(new Error(`GitHub API error (${l.statusCode}): ${u}`))})});r.on("error",l=>i(l)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function bs(){return Ee.join(oe("root"),"sync-metadata.json")}async function jt(){let e=bs();try{if(await H.pathExists(e))return await H.readJson(e)}catch{}return{}}async function Xe(e){let t=bs();await H.writeJson(t,e,{spaces:2})}async function Sn(){let e=await jt();if(e.gistId)try{let i=await pt(`/gists/${e.gistId}`);if(i)return i}catch{}let t=oe("index");if(await H.pathExists(t))try{let i=await H.readJson(t);if(i.cloudGistId){let s=await pt(`/gists/${i.cloudGistId}`);if(s)return await Xe({...e,gistId:s.id}),s}}catch{}let n=await pt("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===Ss||i.files[Ue]);return o&&await Xe({...e,gistId:o.id}),o||null}async function ks(e){let t={};for(let[i,s]of Object.entries(e))t[i]={content:s};let n=await pt("/gists",{method:"POST",body:{description:Ss,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await jt();return await Xe({...o,gistId:n.id}),n}async function Ps(e,t){let n={};for(let[i,s]of Object.entries(t))n[i]=s===null?null:{content:s};let o=await pt(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function Gt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function gt(){try{let e=await jt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=oe("index");if(!await H.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await H.readJson(t),o=Gt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function ft(){try{await ae();let e=oe("index");if(!await H.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await H.readJson(e),n=await Sn(),o=!n;n||(n=await ks({[Ue]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[Ue]:JSON.stringify(t,null,2)};for(let a of t.entries)if(await H.pathExists(a.filePath)){let r=await H.readFile(a.filePath,"utf-8"),l=Ee.basename(a.filePath);i[l]=r}n=await Ps(n.id,i),await tt(()=>t);let s=Gt(t);return await Xe({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:s,lastRemoteHash:s}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function ht(){try{await ae();let e=await Sn();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[Ue];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let s of n.entries){let a=Ee.basename(s.filePath),r=e.files[a];if(r){let l=s.type==="pattern"?"patterns":"insights",u=Ee.join(oe(l),a);s.filePath=u,await H.writeFile(u,r.content,"utf-8"),o++}}await tt(()=>n);let i=Gt(n);return await Xe({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function Qe(){try{await ae();let e=oe("index"),t;await H.pathExists(e)?t=await H.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await Sn(),o;n&&n.files[Ue]?o=JSON.parse(n.files[Ue].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let d of o.entries)i.set(d.id,d);for(let d of t.entries){let m=i.get(d.id);(!m||new Date(d.modified)>new Date(m.modified))&&i.set(d.id,d)}let s={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},a={[Ue]:JSON.stringify(s,null,2)};for(let d of s.entries)if(await H.pathExists(d.filePath)){let m=await H.readFile(d.filePath,"utf-8"),p=Ee.basename(d.filePath);a[p]=m}let r=0;if(n)for(let d of o.entries){let m=Ee.basename(d.filePath),p=n.files[m],y=d.type==="pattern"?"patterns":"insights",b=Ee.join(oe(y),m);if(p&&!await H.pathExists(b)){await H.writeFile(b,p.content,"utf-8");let v=i.get(d.id);v&&(v.filePath=b),r++}}n?await Ps(n.id,a):n=await ks(a),await tt(()=>s);let l=Gt(s);await Xe({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:l,lastRemoteHash:l});let u=t.entries.filter(d=>!o.entries.find(m=>m.id===d.id)).length,c=r;return{success:!0,status:"up-to-date",message:`Synced! ${u} pushed, ${c} pulled. Total: ${s.entries.length} entries.`,entriesPushed:u,entriesPulled:c}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function Ze(){let e=await jt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var yn=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new he.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await ft();break;case"pull":i=await ht();break;default:i=await Qe()}let a=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;a+=`**Status**: ${i.status}
`,a+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(a+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(a+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await Ze();return r&&(a+=`
**Cloud URL**: ${r}
`),new he.LanguageModelToolResult([new he.LanguageModelTextPart(a)])}};function xs(e){e.subscriptions.push(he.lm.registerTool("alex_cloud_sync",new yn))}var Ye,fn,hn=!1,Pc=300*1e3,xc=60*1e3,wn;function Cc(){return wn||(wn=he.window.createOutputChannel("Alex Unconscious Mind")),wn}function be(e){let t=new Date().toISOString();Cc().appendLine(`[${t}] ${e}`)}async function vn(){if(hn)return be("Sync already in progress, skipping"),null;if(fn&&Date.now()-fn.getTime()<xc)return be("Too soon since last sync, skipping"),null;hn=!0,fn=new Date;try{if(be("Starting transparent background sync..."),(await gt()).status==="up-to-date")return be("Already up-to-date, no sync needed"),{success:!0,status:"up-to-date",message:"Already synced"};let t=await Qe();return be(`Sync complete: ${t.message}`),t}catch(e){return be(`Transparent sync failed: ${e}`),{success:!1,status:"error",message:`${e}`}}finally{hn=!1}}async function et(){setTimeout(async()=>{let e=await vn();e&&e.success&&e.entriesPushed&&e.entriesPushed>0&&be(`Auto-synced ${e.entriesPushed} entries after modification`)},2e3)}function Cs(e){Ye&&clearInterval(Ye),be("Background sync enabled - Alex unconscious mind active"),setTimeout(async()=>{be("Running startup sync..."),await vn()},1e4),Ye=setInterval(async()=>{await vn()},Pc),e.subscriptions.push({dispose:()=>{Ye&&(clearInterval(Ye),Ye=void 0),be("Background sync disabled")}})}var Tc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function Tn(){return me.join(Cn.homedir(),Ie)}function oe(e){return me.join(Cn.homedir(),ys[e])}async function ae(){let e=[oe("root"),oe("knowledge"),oe("patterns"),oe("insights")];for(let t of e)await O.ensureDir(t)}async function In(e,t){await O.pathExists(e)||await O.ensureFile(e);let n;try{return n=await Ts.lock(e,Tc),await t()}finally{n&&await n()}}async function tt(e){let t=oe("index");return await ae(),await In(t,async()=>{let n;try{if(await O.pathExists(t)){let o=await O.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await O.writeJson(t,n,{spaces:2}),n})}async function Is(e){let t=oe("projectRegistry");return await ae(),await In(t,async()=>{let n;try{if(await O.pathExists(t)){let o=await O.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await O.writeJson(t,n,{spaces:2}),n})}async function En(){let e=oe("index");return await ae(),await In(e,async()=>{try{if(await O.pathExists(e)){let n=await O.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await O.writeJson(e,t,{spaces:2}),t})}async function $n(){let e=oe("projectRegistry");return await ae(),await Is(t=>t)}async function Es(){let e=R.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=me.basename(t),o=0,i=new R.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await R.workspace.findFiles(i)).length;let a;return await Is(r=>{let l=r.projects.findIndex(c=>c.path===t),u={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return l>=0?(r.projects[l]={...r.projects[l],...u},a=r.projects[l]):(r.projects.push(u),a=u),r}),a}function $s(e,t){let n=e==="pattern"?gn.pattern:gn.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function Ic(e,t,n,o,i){await ae();let s=$s("pattern",e),a=`${s}.md`,r=me.join(oe("patterns"),a),l=`# ${e}

**ID**: ${s}  
**Category**: ${n}  
**Tags**: ${o.join(", ")}  
**Source**: ${i||"Manual entry"}  
**Created**: ${new Date().toISOString()}  

---

${t}

---

## Synapses

*Add cross-references to related knowledge files here*

`;await O.writeFile(r,l,"utf-8");let u={id:s,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await tt(c=>(c.entries.push(u),c)),u}async function An(e,t,n,o,i,s,a){await ae();let r=$s("insight",e),l=`${r}.md`,u=me.join(oe("insights"),l),c=`# ${e}

**ID**: ${r}  
**Category**: ${n}  
**Tags**: ${o.join(", ")}  
**Source Project**: ${i||"Unknown"}  
**Date**: ${new Date().toISOString()}  

---

## Context

${s||"No problem context provided."}

## Insight

${t}

## Solution

${a||"See insight above."}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${o.join(", ")}
- Related patterns

## Related Projects

- ${i||"Origin project"}

`;await O.writeFile(u,c,"utf-8");let d={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:u};return await tt(m=>(m.entries.push(d),m)),d}async function wt(e,t={}){let n=await En(),o=e.toLowerCase(),i=o.split(/\s+/).filter(a=>a.length>2),s=[];for(let a of n.entries){if(t.type&&t.type!=="all"&&a.type!==t.type||t.category&&a.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(u=>a.tags.map(c=>c.toLowerCase()).includes(u.toLowerCase())))continue;let r=0;a.title.toLowerCase().includes(o)&&(r+=10);for(let l of i)a.title.toLowerCase().includes(l)&&(r+=3);for(let l of a.tags){(l.toLowerCase().includes(o)||o.includes(l.toLowerCase()))&&(r+=5);for(let u of i)l.toLowerCase().includes(u)&&(r+=2)}a.summary.toLowerCase().includes(o)&&(r+=3);for(let l of i)a.summary.toLowerCase().includes(l)&&(r+=1);if(a.category.toLowerCase().includes(o)&&(r+=2),r>0){let l;if(await O.pathExists(a.filePath))try{l=await O.readFile(a.filePath,"utf-8");for(let u of i){let c=(l.toLowerCase().match(new RegExp(u,"g"))||[]).length;r+=Math.min(c,5)*.5}}catch{}s.push({entry:a,relevance:r,content:l})}}return s.sort((a,r)=>r.relevance-a.relevance),s.slice(0,t.limit||10)}async function As(e,t,n=[]){try{let o=await O.readFile(e,"utf-8"),i=me.basename(e,".md"),s=o.match(/^#\s+(.+)$/m),a=s?s[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),l=r?r[1].split(",").map(m=>m.trim()):[],u=[...new Set([...l,...n])],c=R.workspace.workspaceFolders,d=c?me.basename(c[0].uri.fsPath):void 0;return await Ic(a,o,t,u,d)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}var Ec=["DK-SKILL-WISHLIST","DK-GENERIC-FRAMEWORK","VERSION-NAMING-CONVENTION"];async function $c(e){let t=me.basename(e,".md"),n=await O.readFile(e,"utf-8"),o=0,i=[],s=n.match(/^#\s+(.+)$/m),a=s?s[1]:t.replace(/^DK-/,"").replace(/-/g," "),r=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g,l=n.match(r);l&&l.length>0&&(o+=3,i.push(`Has ${l.length} synapse connection(s)`));let u=n.match(/^##\s+.+$/gm);u&&u.length>=3&&(o+=2,i.push(`Well-structured with ${u.length} sections`));let c=n.match(/\*\*Tags\*\*:\s*(.+)$/m),d=[];c&&(d=c[1].split(",").map(x=>x.trim()).filter(x=>x.length>0),d.length>0&&(o+=1,i.push(`Has ${d.length} tag(s)`))),n.length>1e3&&(o+=1,i.push("Substantial content (>1KB)")),n.length>5e3&&(o+=2,i.push("Rich content (>5KB)"));let m=n.match(/```[\s\S]*?```/g);m&&m.length>0&&(o+=2,i.push(`Contains ${m.length} code example(s)`));let y=[/pattern/i,/best practice/i,/guideline/i,/framework/i,/principle/i,/architecture/i,/design/i,/approach/i].filter(x=>x.test(n)).length;y>=2&&(o+=Math.min(y,3),i.push("Contains general/reusable concepts"));let b=Ac(n,t),v=await En(),w=a.toLowerCase().replace(/[^a-z0-9]/g,"-"),E=v.entries.some(x=>x.title.toLowerCase().replace(/[^a-z0-9]/g,"-")===w||x.id.includes(w));return{filePath:e,filename:t,title:a,score:o,reasons:i,category:b,tags:d,isPromotionCandidate:o>=5&&!E,alreadyPromoted:E}}function Ac(e,t){let n=e.toLowerCase(),o=t.toLowerCase(),i=[[/error|exception|fault|handling/i,"error-handling"],[/api|rest|graphql|endpoint/i,"api-design"],[/test|spec|jest|mocha|assertion/i,"testing"],[/debug|troubleshoot|diagnos/i,"debugging"],[/performance|optimi|cache|speed/i,"performance"],[/architecture|design|pattern|structure/i,"architecture"],[/security|auth|encrypt|vulnerab/i,"security"],[/deploy|ci\/cd|pipeline|docker|kubernetes/i,"deployment"],[/document|readme|comment|diagram/i,"documentation"],[/refactor|clean|improve|modernize/i,"refactoring"],[/tool|config|setup|environment/i,"tooling"]];for(let[s,a]of i)if(s.test(n)||s.test(o))return a;return"general"}async function Fs(e,t={}){let{dryRun:n=!1,minScore:o=5}=t;await ae();let i={evaluated:0,promoted:[],skipped:[],alreadyGlobal:[]},s=me.join(e,".github","domain-knowledge");if(!await O.pathExists(s))return i;let r=(await O.readdir(s)).filter(l=>l.startsWith("DK-")&&l.endsWith(".md"));for(let l of r){let u=me.join(s,l),c=l.replace(".md","");if(Ec.some(d=>c.includes(d))){i.skipped.push({filename:l,reason:"Excluded meta-file"});continue}i.evaluated++;try{let d=await $c(u);if(d.alreadyPromoted){i.alreadyGlobal.push(l);continue}if(!d.isPromotionCandidate||d.score<o){i.skipped.push({filename:l,reason:`Score ${d.score}/${o} - ${d.reasons.join(", ")||"Needs more structure/content"}`});continue}if(n)i.promoted.push({id:`[DRY-RUN] ${c}`,title:d.title,type:"pattern",category:d.category,tags:d.tags,created:new Date().toISOString(),modified:new Date().toISOString(),summary:`Would be promoted with score ${d.score}`,filePath:u});else{let m=await As(u,d.category,d.tags);m&&i.promoted.push(m)}}catch(d){i.skipped.push({filename:l,reason:`Error: ${d}`})}}return!n&&i.promoted.length>0&&et(),i}async function Fn(){let e=await En(),t={},n={};for(let s of e.entries){t[s.category]=(t[s.category]||0)+1;for(let a of s.tags)n[a]=(n[a]||0)+1}let o=Object.entries(n).map(([s,a])=>({tag:s,count:a})).sort((s,a)=>a.count-s.count).slice(0,10),i=[...e.entries].sort((s,a)=>new Date(a.created).getTime()-new Date(s.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(s=>s.type==="pattern").length,totalInsights:e.entries.filter(s=>s.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var bn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new R.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await ae();let{query:o,type:i,category:s,tags:a}=t.input,r=await wt(o,{type:i,category:s,tags:a?a.split(",").map(u=>u.trim()):void 0,limit:10});if(r.length===0)return new R.LanguageModelToolResult([new R.LanguageModelTextPart(`No global knowledge found matching "${o}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`)]);let l=`## Global Knowledge Search Results

`;l+=`Found **${r.length}** relevant entries for "${o}":

`;for(let{entry:u,relevance:c}of r){let d=u.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";l+=`### ${d} ${u.title}
`,l+=`- **Type**: ${u.type} | **Category**: ${u.category}
`,l+=`- **Tags**: ${u.tags.join(", ")}
`,u.sourceProject&&(l+=`- **Source**: ${u.sourceProject}
`),l+=`- **Summary**: ${u.summary}
`,l+=`- **File**: \`${u.filePath}\`

`}return new R.LanguageModelToolResult([new R.LanguageModelTextPart(l)])}},kn=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new R.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await ae();let{title:o,insight:i,category:s,tags:a,problem:r,solution:l}=t.input,u=R.workspace.workspaceFolders,c=u?me.basename(u[0].uri.fsPath):void 0,d=await An(o,i,s||"general",a?a.split(",").map(p=>p.trim()):[],c,r,l);et();let m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${d.id}  
**Title**: ${d.title}  
**Category**: ${d.category}  
**Tags**: ${d.tags.join(", ")}  
**Source Project**: ${d.sourceProject||"Unknown"}  
**File**: \`${d.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new R.LanguageModelToolResult([new R.LanguageModelTextPart(m)])}},Pn=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${me.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new R.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:s}=t.input;if(!await O.pathExists(o))return new R.LanguageModelToolResult([new R.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let a=await As(o,i||"general",s?s.split(",").map(l=>l.trim()):[]);if(!a)return new R.LanguageModelToolResult([new R.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);et();let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${a.id}  
**Title**: ${a.title}  
**Category**: ${a.category}  
**Tags**: ${a.tags.join(", ")}  
**Global File**: \`${a.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;return new R.LanguageModelToolResult([new R.LanguageModelTextPart(r)])}},xn=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await ae();let o=await Fn(),i=await $n(),s="";try{let r=await gt();s=`| Cloud Sync | ${r.status==="up-to-date"?"\u2705":r.status==="needs-push"?"\u{1F4E4}":r.status==="needs-pull"?"\u{1F4E5}":r.status==="error"?"\u274C":"\u26AA"} ${r.status} |
`}catch{s=`| Cloud Sync | \u26AA Not configured |
`}let a=`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${o.totalPatterns} |
| Global Insights | ${o.totalInsights} |
| Known Projects | ${i.projects.length} |
${s}
### Knowledge by Category
`;for(let[r,l]of Object.entries(o.categories))a+=`- **${r}**: ${l}
`;if(o.topTags.length>0){a+=`
### Top Tags
`;for(let{tag:r,count:l}of o.topTags)a+=`- ${r}: ${l}
`}if(o.recentEntries.length>0){a+=`
### Recent Entries
`;for(let r of o.recentEntries){let l=r.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";a+=`- ${l} **${r.title}** (${r.category})
`}}if(i.projects.length>0){a+=`
### Known Projects
`;for(let r of i.projects.slice(0,5))a+=`- **${r.name}** - ${r.knowledgeFiles} knowledge files
`}return a+=`
### Global Knowledge Location
\`${Tn()}\`
`,new R.LanguageModelToolResult([new R.LanguageModelTextPart(a)])}};function Rs(e){e.subscriptions.push(R.lm.registerTool("alex_global_knowledge_search",new bn),R.lm.registerTool("alex_save_insight",new kn),R.lm.registerTool("alex_promote_knowledge",new Pn),R.lm.registerTool("alex_global_knowledge_status",new xn))}async function Ms(e){let t=N.workspace.workspaceFolders;if(!t){N.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed.");return}let n=t[0].uri.fsPath,o={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},globalKnowledgePromotion:{evaluated:0,promoted:[],skipped:0,alreadyGlobal:0},recommendations:[],sessionFile:""};await N.window.withProgress({location:N.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async r=>{r.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Fc(t[0],o),r.report({message:"Phase 2: Checking version consistency...",increment:20}),await Rc(n,o),r.report({message:"Phase 3: Assessing memory architecture...",increment:40}),await Mc(t[0],o),r.report({message:"Phase 4: Auto-promoting knowledge to global...",increment:55}),await Dc(n,o),r.report({message:"Phase 5: Generating recommendations...",increment:75}),Lc(o),r.report({message:"Phase 6: Documenting session...",increment:90}),await Nc(n,o),r.report({message:"Self-actualization complete!",increment:100})});let s=`Self-Actualization Complete ${o.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":o.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":o.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${o.synapseHealth.totalSynapses} (${o.synapseHealth.brokenConnections} broken)
Memory Files: ${o.memoryConsolidation.proceduralFiles+o.memoryConsolidation.episodicFiles+o.memoryConsolidation.domainFiles}
Recommendations: ${o.recommendations.length}`,a=await N.window.showInformationMessage(s,"View Report","Open Session File");if(a==="View Report")Oc(o);else if(a==="Open Session File"&&o.sessionFile){let r=await N.workspace.openTextDocument(o.sessionFile);await N.window.showTextDocument(r)}return o}async function Fc(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let s=new N.RelativePattern(e,i),a=await N.workspace.findFiles(s);for(let r of a){t.synapseHealth.totalFiles++;try{let u=(await ke.readFile(r.fsPath,"utf-8")).split(`
`),c=!1;for(let d of u){if(d.trim().startsWith("```")){c=!c;continue}if(c)continue;let m;for(;(m=o.exec(d))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await N.workspace.findFiles(new N.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function Rc(e,t){let n=Ut.join(e,".github","copilot-instructions.md");try{if(await ke.pathExists(n)){let r=(await ke.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],s=N.workspace.workspaceFolders?.[0];if(s)for(let a of i){let r=new N.RelativePattern(s,a),l=await N.workspace.findFiles(r);for(let u of l)try{let c=await ke.readFile(u.fsPath,"utf-8");for(let d of o)if(d.test(c)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Mc(e,t){let n=await N.workspace.findFiles(new N.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await N.workspace.findFiles(new N.RelativePattern(e,".github/prompts/*.md")),i=await N.workspace.findFiles(new N.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let s=await N.workspace.findFiles(new N.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=s.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}async function Dc(e,t){try{let n=await Fs(e,{minScore:5});t.globalKnowledgePromotion={evaluated:n.evaluated,promoted:n.promoted.map(o=>o.title),skipped:n.skipped.length,alreadyGlobal:n.alreadyGlobal.length}}catch(n){console.error("Auto-promotion failed:",n),t.globalKnowledgePromotion={evaluated:0,promoted:[],skipped:0,alreadyGlobal:0}}}function Lc(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections"),e.globalKnowledgePromotion.promoted.length>0&&e.recommendations.push(`\u{1F310} Auto-promoted ${e.globalKnowledgePromotion.promoted.length} domain knowledge file(s) to global knowledge base!`),e.globalKnowledgePromotion.skipped>0&&e.globalKnowledgePromotion.promoted.length===0&&e.recommendations.push(`\u{1F4D6} ${e.globalKnowledgePromotion.skipped} DK file(s) not ready for promotion - add synapses, structure, and examples to qualify`)}async function Nc(e,t){let n=Ut.join(e,".github","episodic");await ke.ensureDir(n);let i=new Date().toISOString().split("T")[0],s=`self-actualization-${i}.prompt.md`,a=Ut.join(n,s),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",l=`# Self-Actualization Session - ${i}

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
| Skipped (needs improvement) | ${t.globalKnowledgePromotion.skipped} |
| Already Global | ${t.globalKnowledgePromotion.alreadyGlobal} |

${t.globalKnowledgePromotion.promoted.length>0?`### Newly Promoted Knowledge
${t.globalKnowledgePromotion.promoted.map(u=>`- \u{1F4D0} **${u}**`).join(`
`)}
`:"*No new knowledge promoted this session.*"}

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
`;await ke.writeFile(a,l,"utf-8"),t.sessionFile=a}function Oc(e){let t=N.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",N.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
        <div class="metric-value">${e.globalKnowledgePromotion.alreadyGlobal}</div>
        <div class="metric-label">Already Global</div>
    </div>
    ${e.globalKnowledgePromotion.promoted.length>0?`
    <p><strong>Newly Promoted:</strong></p>
    <ul>${e.globalKnowledgePromotion.promoted.map(o=>`<li>\u{1F4D0} ${o}</li>`).join("")}</ul>
    `:""}

    <h2>Recommendations</h2>
    ${e.recommendations.length>0?e.recommendations.map(o=>`<div class="recommendation">${o}</div>`).join(""):"<p>\u2705 No recommendations - architecture is optimal!</p>"}
</body>
</html>`}var j=M(require("vscode")),Ns=M(require("path"));var g=M(require("vscode")),G=M(Ce()),ge=M(require("path"));var Rn=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new g.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,s=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],a=0,r=0,l=0,u=[],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of s){let y=new g.RelativePattern(o[0],p),b=await g.workspace.findFiles(y);for(let v of b){a++;try{let E=(await G.readFile(v.fsPath,"utf-8")).split(`
`),x=!1;for(let D=0;D<E.length;D++){let J=E[D];if(J.trim().startsWith("```")){x=!x;continue}if(x)continue;let V;for(;(V=c.exec(J))!==null;){r++;let Q=V[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${Q}`))).length===0&&(l++,t.input.detailed&&u.push(`- ${ge.basename(v.fsPath)}:${D+1} \u2192 ${Q} (not found)`))}}}catch{}}}let d=l===0?"EXCELLENT":l<5?"GOOD":l<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${a} |
| Total Synapses | ${r} |
| Broken Connections | ${l} |
| Health Status | ${d} |
`;return t.input.detailed&&u.length>0&&(m+=`
### Issues Found
${u.join(`
`)}`),l>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Mn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new g.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),s=t.input.memoryType||"all",a=[];(s==="all"||s==="procedural")&&a.push(".github/instructions/*.md"),(s==="all"||s==="episodic")&&(a.push(".github/prompts/*.md"),a.push(".github/episodic/*.md")),(s==="all"||s==="domain")&&a.push(".github/domain-knowledge/*.md");let r=[];for(let c of a){let d=new g.RelativePattern(o[0],c),m=await g.workspace.findFiles(d);for(let p of m)try{let b=(await G.readFile(p.fsPath,"utf-8")).split(`
`),v=[];for(let w=0;w<b.length;w++)if(b[w].toLowerCase().includes(i)){let E=Math.max(0,w-1),x=Math.min(b.length-1,w+1),D=b.slice(E,x+1).join(`
`);v.push(`Line ${w+1}:
${D}`)}v.length>0&&r.push({file:ge.basename(p.fsPath),matches:v.slice(0,3)})}catch{}}let l=[];if(r.length===0)try{l=await wt(t.input.query,{limit:5})}catch{}if(r.length===0&&l.length===0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`No matches found for "${t.input.query}" in local ${s} memory or global knowledge base.`)]);let u="";if(r.length>0){u+=`## Local Memory Results for "${t.input.query}"

`,u+=`Found ${r.length} file(s) with matches:

`;for(let c of r.slice(0,5)){u+=`### ${c.file}
`;for(let d of c.matches)u+=`\`\`\`
${d}
\`\`\`
`;u+=`
`}}if(l.length>0){r.length===0?(u+=`## \u{1F310} Global Knowledge Results (Unconscious Retrieval)

`,u+=`*Local search found nothing. Automatically searched cross-project knowledge:*

`):u+=`## \u{1F310} Related Global Knowledge

`;for(let{entry:c}of l.slice(0,3)){let d=c.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";u+=`### ${d} ${c.title}
`,u+=`- **Type**: ${c.type} | **Category**: ${c.category}
`,u+=`- **Tags**: ${c.tags.join(", ")}
`,u+=`- **Summary**: ${c.summary}

`}}return new g.LanguageModelToolResult([new g.LanguageModelTextPart(u)])}},Dn=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,s=ge.join(i,".github","copilot-instructions.md");if(!await G.pathExists(s))return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md")),d="Unknown";try{let y=(await G.readFile(s,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);y&&(d=y[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${d} |
| Procedural Memory | ${r.length} files |
| Episodic Memory | ${l.length+u.length} files |
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
`;return new g.LanguageModelToolResult([new g.LanguageModelTextPart(m)])}},Ln=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",s=[];return(i==="azure"||i==="both")&&s.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&s.push(`## Microsoft 365 MCP Tools

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
`),s.push(`## Recommended for: "${t.input.scenario}"

### How to Use These Tools
1. **Switch to Agent Mode** in GitHub Copilot Chat
2. Ask your question naturally - tools are invoked automatically
3. Or reference tools explicitly with \`#toolName\`

### Example Prompts
- "Create an Azure Function with Cosmos DB binding using best practices"
- "Build a Teams bot with adaptive cards and SSO"
- "Query my Azure resources to find expensive VMs"
- "Generate a declarative Copilot agent manifest"
`),new g.LanguageModelToolResult([new g.LanguageModelTextPart(s.join(`
`))])}},Nn=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,s=ge.join(i,"config","USER-PROFILE.md"),a=ge.join(i,"config","user-profile.json"),{action:r,field:l,value:u}=t.input;try{switch(r){case"exists":let c=await G.pathExists(a);return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:c,path:a}))]);case"get":if(!await G.pathExists(a))return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let d=await G.readJson(a);return l?new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({[l]:d[l]}))]):new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify(d))]);case"update":if(!l||u===void 0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await G.ensureDir(ge.join(i,"config"));let m={};if(await G.pathExists(a)&&(m=await G.readJson(a)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(l)){let p=m[l]||[];Array.isArray(p)?p.includes(u)||(m[l]=[...p,u]):m[l]=[u]}else m[l]=u;return m.lastUpdated=new Date().toISOString(),await G.writeJson(a,m,{spaces:2}),await this.updateMarkdownProfile(s,m),new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({success:!0,field:l,value:u,message:`Updated ${l} to: ${u}`}))]);default:return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(c){return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Error accessing user profile: ${c.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await G.writeFile(t,o,"utf-8")}},On=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new g.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,s="Unknown";try{let v=ge.join(i,".github","copilot-instructions.md");if(await G.pathExists(v)){let E=(await G.readFile(v,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);E&&(s=E[1])}}catch{}let a={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:s,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],l=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let v of r){let w=new g.RelativePattern(o[0],v),E=await g.workspace.findFiles(w);for(let x of E){a.synapseHealth.totalFiles++;try{let J=(await G.readFile(x.fsPath,"utf-8")).split(`
`),V=!1;for(let Q of J){if(Q.trim().startsWith("```")){V=!V;continue}if(V)continue;let Z;for(;(Z=l.exec(Q))!==null;){a.synapseHealth.totalSynapses++;let S=Z[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${S}`))).length===0&&a.synapseHealth.brokenConnections++}}}catch{}}}a.synapseHealth.healthStatus=a.synapseHealth.brokenConnections===0?"EXCELLENT":a.synapseHealth.brokenConnections<5?"GOOD":a.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let u=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),d=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/episodic/*.md")),m=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/domain-knowledge/*.md"));a.memoryArchitecture.proceduralFiles=u.length,a.memoryArchitecture.episodicFiles=c.length+d.length,a.memoryArchitecture.domainFiles=m.length,a.synapseHealth.brokenConnections>0&&a.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${a.synapseHealth.brokenConnections} broken synapse(s)`),a.memoryArchitecture.domainFiles<3&&a.recommendations.push(`Consider acquiring more domain knowledge - only ${a.memoryArchitecture.domainFiles} DK file(s) present`),a.memoryArchitecture.episodicFiles<5&&a.recommendations.push(`Run more meditation sessions to build episodic memory - only ${a.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let v=ge.join(i,".github","episodic");await G.ensureDir(v);let E=new Date().toISOString().split("T")[0],x=`self-actualization-${E}.prompt.md`;p=ge.join(v,x);let D=a.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":a.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":a.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",J=`# Self-Actualization Session - ${E}

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
| Health Status | ${D} ${a.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${a.memoryArchitecture.proceduralFiles} |
| Episodic | ${a.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${a.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${a.recommendations.length>0?a.recommendations.map(V=>`- ${V}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await G.writeFile(p,J,"utf-8")}let b=`## Self-Actualization Report

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

${a.recommendations.length>0?a.recommendations.map(v=>`- ${v}`).join(`
`):"- \u2728 Architecture is healthy and optimized!"}
`;return p&&(b+=`
### Session Recorded

Meditation session documented at: \`${ge.basename(p)}\``),new g.LanguageModelToolResult([new g.LanguageModelTextPart(b)])}};async function Kt(){let e=g.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ge.join(t,"config","user-profile.json");try{if(await G.pathExists(n))return await G.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function Ds(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function Ls(e){e.subscriptions.push(g.lm.registerTool("alex_synapse_health",new Rn)),e.subscriptions.push(g.lm.registerTool("alex_memory_search",new Mn)),e.subscriptions.push(g.lm.registerTool("alex_architecture_status",new Dn)),e.subscriptions.push(g.lm.registerTool("alex_mcp_recommendations",new Ln)),e.subscriptions.push(g.lm.registerTool("alex_user_profile",new Nn)),e.subscriptions.push(g.lm.registerTool("alex_self_actualization",new On)),console.log("Alex Language Model Tools registered")}var _n=M(require("vscode")),yt=M(Ce()),jn=M(require("path"));function Gn(){let e=_n.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function Un(e,t=!1){let n=jn.join(e,".github","copilot-instructions.md");if(!await yt.pathExists(n))return null;try{let o=await yt.readFile(n,"utf8"),i=t?ws:hs,s=o.match(i);return s?s[1]:null}catch{return null}}var _c=[/(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)/i,/(?:this works because|the reason is|what fixed it|solved by|resolved by)/i,/(?:always remember to|never forget to|make sure to|be careful to)/i,/(?:debugging tip|performance tip|security tip)/i],jc=["pattern","anti-pattern","best practice","gotcha","pitfall","workaround","solution","fix","resolved","debugging","performance","optimization","security","architecture"];function Gc(e){let t=e.toLowerCase(),n=0;for(let s of _c)s.test(e)&&n++;let o=[];for(let s of jc)t.includes(s)&&o.push(s);let i=n*.3+o.length*.1;return{detected:i>=.3||n>=1,confidence:Math.min(i,1),keywords:o}}async function Uc(e,t,n){try{let o=e.split(/[.!?]/)[0].trim(),i=o.length>10&&o.length<100?o:`Auto-captured insight - ${new Date().toISOString().split("T")[0]}`,s="general";t.includes("debugging")?s="debugging":t.includes("performance")||t.includes("optimization")?s="performance":t.includes("security")?s="security":t.includes("architecture")?s="architecture":(t.includes("pattern")||t.includes("anti-pattern"))&&(s="patterns"),await An(i,e,s,t,n,"Auto-detected from conversation",e),et(),console.log(`[Unconscious] Auto-saved insight: ${i}`)}catch(o){console.warn("[Unconscious] Failed to auto-save insight:",o)}}var vt=[],Kc=5;function zc(e,t){vt.push(e),vt.length>Kc&&vt.shift();let n=vt.join(" "),o=Gc(n);o.detected&&o.confidence>=.5&&(Uc(e,o.keywords,t),vt=[])}var qc=async(e,t,n,o)=>e.command==="meditate"?await Hc(e,t,n,o):e.command==="dream"?await Wc(e,t,n,o):e.command==="learn"?await Vc(e,t,n,o):e.command==="status"?await Bc(e,t,n,o):e.command==="azure"?await Jc(e,t,n,o):e.command==="m365"?await Yc(e,t,n,o):e.command==="profile"?await Xc(e,t,n,o):e.command==="selfactualize"?await nl(e,t,n,o):e.command==="knowledge"?await ol(e,t,n,o):e.command==="saveinsight"?await il(e,t,n,o):e.command==="promote"?await sl(e,t,n,o):e.command==="knowledgestatus"?await al(e,t,n,o):e.command==="sync"?await rl(e,t,n,o):e.command==="push"?await cl(e,t,n,o):e.command==="pull"?await ll(e,t,n,o):e.command==="docs"?await ul(e,t,n,o):Zc(e.prompt)&&el(t)?await tl(e,t,n,o):await Qc(e,t,n,o);async function Hc(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function Wc(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function Vc(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function Bc(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=Gn(),s=i.isValid&&i.rootPath?await Un(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

**Version**: ${s}
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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function Jc(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function Yc(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function Xc(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Kt();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),n.button({command:"alex.cognitive",title:"\u{1F3AF} Start Quick Profile",arguments:["profile-wizard"]}),{metadata:{command:"profile",action:"onboarding"}};let s=i.nickname||i.name;return n.markdown(`## \u{1F464} Profile: ${s}

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
`),{metadata:{command:"profile",action:"view"}}}async function Qc(e,t,n,o){let i=j.workspace.workspaceFolders,s=i?Ns.basename(i[0].uri.fsPath):void 0;zc(e.prompt,s);let a=await Kt(),r=t.history.filter(c=>c instanceof j.ChatRequestTurn||c instanceof j.ChatResponseTurn),l="";if(a){let c=a.nickname||a.name;l=`
## User Profile (Use this to personalize responses)
${c?`- **User's name**: ${c} (always address them by name)`:"- User has not shared their name yet"}
${a.role?`- **Role**: ${a.role}`:""}
${a.experienceLevel?`- **Experience**: ${a.experienceLevel}`:""}
${a.formality?`- **Communication style**: ${a.formality}`:"- Communication style: balanced"}
${a.detailLevel?`- **Detail preference**: ${a.detailLevel}`:""}
${a.explanationStyle?`- **Explanation style**: ${a.explanationStyle}`:""}
${a.humor?`- **Humor**: ${a.humor}`:""}
${a.proactiveSuggestions?`- **Proactive suggestions**: ${a.proactiveSuggestions}`:""}
${a.primaryTechnologies?.length?`- **Technologies**: ${a.primaryTechnologies.join(", ")}`:""}
${a.learningGoals?.length?`- **Learning goals**: ${a.learningGoals.join(", ")}`:""}
${a.expertiseAreas?.length?`- **Expertise areas**: ${a.expertiseAreas.join(", ")}`:""}
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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let c=await j.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(c.length===0){let y=Ds(a);return n.markdown(`${y}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let d=c[0],m=[j.LanguageModelChatMessage.User(u),j.LanguageModelChatMessage.User(e.prompt)],p=await d.sendRequest(m,{},o);for await(let y of p.text)n.markdown(y)}catch(c){if(c instanceof j.LanguageModelError)console.error("Language model error:",c.message,c.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw c}return{metadata:{command:"general"}}}function Zc(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function el(e){return e.history.length===0||e.history.length<=2}async function tl(e,t,n,o){let i=await Kt(),s=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),s?n.markdown(`## \u{1F44B} Hello, ${s}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let l=await gt();l.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):l.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let a=Gn(),r=a.isValid&&a.rootPath?await Un(a.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function nl(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function ol(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

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

`);for(let{entry:s,relevance:a}of i){let r=s.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";n.markdown(`### ${r} ${s.title}
- **Type**: ${s.type} | **Category**: ${s.category}
- **Tags**: ${s.tags.join(", ")}
${s.sourceProject?`- **From**: ${s.sourceProject}`:""}
- **Summary**: ${s.summary}

---
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function il(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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
`);let i=j.workspace.workspaceFolders;if(i){let s=new j.RelativePattern(i[0],".github/domain-knowledge/DK-*.md"),a=await j.workspace.findFiles(s);if(a.length>0){n.markdown(`Found ${a.length} knowledge files:
`);for(let r of a){let l=j.workspace.asRelativePath(r);n.markdown(`- \`${l}\`
`)}}else n.markdown(`*No DK-*.md files found in this project.*
`)}return{metadata:{command:"promote"}}}async function al(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await Fn(),s=await $n();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| \u{1F4D0} Global Patterns | ${i.totalPatterns} |
| \u{1F4A1} Global Insights | ${i.totalInsights} |
| \u{1F4C1} Known Projects | ${s.projects.length} |

`),Object.keys(i.categories).length>0){n.markdown(`### Knowledge by Category
`);for(let[a,r]of Object.entries(i.categories))n.markdown(`- **${a}**: ${r}
`)}if(i.topTags.length>0){n.markdown(`
### Top Tags
`);for(let{tag:a,count:r}of i.topTags)n.markdown(`- ${a}: ${r} entries
`)}if(i.recentEntries.length>0){n.markdown(`
### Recent Entries
`);for(let a of i.recentEntries){let r=a.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";n.markdown(`- ${r} **${a.title}** (${a.category})
`)}}if(s.projects.length>0){n.markdown(`
### Known Projects
`);for(let a of s.projects.slice(0,5))n.markdown(`- **${a.name}** - ${a.knowledgeFiles} knowledge files
`);s.projects.length>5&&n.markdown(`- *...and ${s.projects.length-5} more*
`)}n.markdown(`
### \u{1F4CD} Global Knowledge Location
\`${Tn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function rl(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await Qe(),s=await Ze();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),s&&n.markdown(`**Cloud URL**: [View Gist](${s})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function cl(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await ft(),s=await Ze();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),s&&n.markdown(`
**Cloud URL**: [View Gist](${s})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function ll(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await ht();i.success?n.markdown(`## \u{1F4E5} Pull Complete

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

`),await j.commands.executeCommand("alex.openDocs"),n.markdown(`
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`),{metadata:{command:"docs"}}}var dl={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function Os(e){let t=j.chat.createChatParticipant("alex.cognitive",qc);return t.iconPath=j.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=dl,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===j.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var Kn=!1;async function St(e,t){if(Kn){A.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}Kn=!0;try{return await t()}finally{Kn=!1}}function ml(e){console.log("Alex Cognitive Architecture is now active!"),pl(e),Os(e),Ls(e),Rs(e),xs(e),Cs(e),ae().then(()=>{Es().catch(c=>{console.warn("Failed to register current project:",c)})}).catch(c=>{console.warn("Failed to initialize global knowledge directories:",c)});let t=A.commands.registerCommand("alex.initialize",async()=>{await St("Initialize",()=>Ui(e))}),n=A.commands.registerCommand("alex.reset",async()=>{await St("Reset",()=>sn(e))}),o=A.commands.registerCommand("alex.dream",async()=>{await St("Dream Protocol",()=>qi(e))}),i=A.commands.registerCommand("alex.upgrade",async()=>{await St("Upgrade",()=>Vi(e))}),s=A.commands.registerCommand("alex.selfActualize",async()=>{await St("Self-Actualization",()=>Ms(e))}),a=A.commands.registerCommand("alex.syncKnowledge",async()=>{await A.window.withProgress({location:A.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let c=await Qe();if(c.success){let d=await Ze(),m=d?"View Gist":void 0;await A.window.showInformationMessage(`\u2705 ${c.message}`,...m?[m]:[])==="View Gist"&&d&&A.env.openExternal(A.Uri.parse(d))}else A.window.showErrorMessage(`\u274C ${c.message}`)})}),r=A.commands.registerCommand("alex.pushKnowledge",async()=>{await A.window.withProgress({location:A.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let c=await ft();c.success?A.window.showInformationMessage(`\u2705 ${c.message}`):A.window.showErrorMessage(`\u274C ${c.message}`)})}),l=A.commands.registerCommand("alex.pullKnowledge",async()=>{await A.window.withProgress({location:A.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let c=await ht();c.success?A.window.showInformationMessage(`\u2705 ${c.message}`):A.window.showErrorMessage(`\u274C ${c.message}`)})}),u=A.commands.registerCommand("alex.openDocs",async()=>{let c=A.Uri.joinPath(e.extensionUri,"alex_docs","README.md");try{await A.commands.executeCommand("markdown.showPreview",c)}catch{let d=await A.workspace.openTextDocument(c);await A.window.showTextDocument(d)}});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(s),e.subscriptions.push(a),e.subscriptions.push(r),e.subscriptions.push(l),e.subscriptions.push(u)}async function pl(e){let t="alex.lastKnownVersion",n=A.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[s]=i.split(".").map(Number),[a]=o.split(".").map(Number),r=a>s,l="Run Upgrade",u="View Changelog",c="Dismiss",d=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await A.window.showInformationMessage(d,l,u,c);if(m===l)A.commands.executeCommand("alex.upgrade");else if(m===u){let p=A.Uri.joinPath(n.extensionUri,"CHANGELOG.md");A.commands.executeCommand("markdown.showPreview",p)}}function gl(){}0&&(module.exports={activate,deactivate});
