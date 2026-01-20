"use strict";var bo=Object.create;var Ie=Object.defineProperty;var Co=Object.getOwnPropertyDescriptor;var Ao=Object.getOwnPropertyNames;var To=Object.getPrototypeOf,Eo=Object.prototype.hasOwnProperty;var T=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Fo=(e,t)=>{for(var n in t)Ie(e,n,{get:t[n],enumerable:!0})},ft=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ao(t))!Eo.call(e,r)&&r!==n&&Ie(e,r,{get:()=>t[r],enumerable:!(o=Co(t,r))||o.enumerable});return e};var Y=(e,t,n)=>(n=e!=null?bo(To(e)):{},ft(t||!e||!e.__esModule?Ie(n,"default",{value:e,enumerable:!0}):n,e)),$o=e=>ft(Ie({},"__esModule",{value:!0}),e);var W=T(Be=>{"use strict";Be.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((r,i)=>r!=null?o(r):n(i)),e.apply(this,t)})},"name",{value:e.name})};Be.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var gt=T((ta,ht)=>{var de=require("constants"),Mo=process.cwd,De=null,Io=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return De||(De=Mo.call(process)),De};try{process.cwd()}catch{}typeof process.chdir=="function"&&(Ve=process.chdir,process.chdir=function(e){De=null,Ve.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,Ve));var Ve;ht.exports=Do;function Do(e){de.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=i(e.chown),e.fchown=i(e.fchown),e.lchown=i(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=a(e.chownSync),e.fchownSync=a(e.fchownSync),e.lchownSync=a(e.lchownSync),e.chmodSync=r(e.chmodSync),e.fchmodSync=r(e.fchmodSync),e.lchmodSync=r(e.lchmodSync),e.stat=m(e.stat),e.fstat=m(e.fstat),e.lstat=m(e.lstat),e.statSync=c(e.statSync),e.fstatSync=c(e.fstatSync),e.lstatSync=c(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(s,d,u){u&&process.nextTick(u)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(s,d,u,f){f&&process.nextTick(f)},e.lchownSync=function(){}),Io==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(s){function d(u,f,y){var C=Date.now(),P=0;s(u,f,function w(M){if(M&&(M.code==="EACCES"||M.code==="EPERM"||M.code==="EBUSY")&&Date.now()-C<6e4){setTimeout(function(){e.stat(f,function(F,I){F&&F.code==="ENOENT"?s(u,f,w):y(M)})},P),P<100&&(P+=10);return}y&&y(M)})}return Object.setPrototypeOf&&Object.setPrototypeOf(d,s),d})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(s){function d(u,f,y,C,P,w){var M;if(w&&typeof w=="function"){var F=0;M=function(I,U,ne){if(I&&I.code==="EAGAIN"&&F<10)return F++,s.call(e,u,f,y,C,P,M);w.apply(this,arguments)}}return s.call(e,u,f,y,C,P,M)}return Object.setPrototypeOf&&Object.setPrototypeOf(d,s),d})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(s){return function(d,u,f,y,C){for(var P=0;;)try{return s.call(e,d,u,f,y,C)}catch(w){if(w.code==="EAGAIN"&&P<10){P++;continue}throw w}}})(e.readSync);function t(s){s.lchmod=function(d,u,f){s.open(d,de.O_WRONLY|de.O_SYMLINK,u,function(y,C){if(y){f&&f(y);return}s.fchmod(C,u,function(P){s.close(C,function(w){f&&f(P||w)})})})},s.lchmodSync=function(d,u){var f=s.openSync(d,de.O_WRONLY|de.O_SYMLINK,u),y=!0,C;try{C=s.fchmodSync(f,u),y=!1}finally{if(y)try{s.closeSync(f)}catch{}else s.closeSync(f)}return C}}function n(s){de.hasOwnProperty("O_SYMLINK")&&s.futimes?(s.lutimes=function(d,u,f,y){s.open(d,de.O_SYMLINK,function(C,P){if(C){y&&y(C);return}s.futimes(P,u,f,function(w){s.close(P,function(M){y&&y(w||M)})})})},s.lutimesSync=function(d,u,f){var y=s.openSync(d,de.O_SYMLINK),C,P=!0;try{C=s.futimesSync(y,u,f),P=!1}finally{if(P)try{s.closeSync(y)}catch{}else s.closeSync(y)}return C}):s.futimes&&(s.lutimes=function(d,u,f,y){y&&process.nextTick(y)},s.lutimesSync=function(){})}function o(s){return s&&function(d,u,f){return s.call(e,d,u,function(y){l(y)&&(y=null),f&&f.apply(this,arguments)})}}function r(s){return s&&function(d,u){try{return s.call(e,d,u)}catch(f){if(!l(f))throw f}}}function i(s){return s&&function(d,u,f,y){return s.call(e,d,u,f,function(C){l(C)&&(C=null),y&&y.apply(this,arguments)})}}function a(s){return s&&function(d,u,f){try{return s.call(e,d,u,f)}catch(y){if(!l(y))throw y}}}function m(s){return s&&function(d,u,f){typeof u=="function"&&(f=u,u=null);function y(C,P){P&&(P.uid<0&&(P.uid+=4294967296),P.gid<0&&(P.gid+=4294967296)),f&&f.apply(this,arguments)}return u?s.call(e,d,u,y):s.call(e,d,y)}}function c(s){return s&&function(d,u){var f=u?s.call(e,d,u):s.call(e,d);return f&&(f.uid<0&&(f.uid+=4294967296),f.gid<0&&(f.gid+=4294967296)),f}}function l(s){if(!s||s.code==="ENOSYS")return!0;var d=!process.getuid||process.getuid()!==0;return!!(d&&(s.code==="EINVAL"||s.code==="EPERM"))}}});var vt=T((na,wt)=>{var yt=require("stream").Stream;wt.exports=Ro;function Ro(e){return{ReadStream:t,WriteStream:n};function t(o,r){if(!(this instanceof t))return new t(o,r);yt.call(this);var i=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,r=r||{};for(var a=Object.keys(r),m=0,c=a.length;m<c;m++){var l=a[m];this[l]=r[l]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){i._read()});return}e.open(this.path,this.flags,this.mode,function(s,d){if(s){i.emit("error",s),i.readable=!1;return}i.fd=d,i.emit("open",d),i._read()})}function n(o,r){if(!(this instanceof n))return new n(o,r);yt.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,r=r||{};for(var i=Object.keys(r),a=0,m=i.length;a<m;a++){var c=i[a];this[c]=r[c]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var kt=T((oa,St)=>{"use strict";St.exports=No;var Lo=Object.getPrototypeOf||function(e){return e.__proto__};function No(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:Lo(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var ve=T((ra,Ye)=>{var R=require("fs"),_o=gt(),qo=vt(),jo=kt(),Re=require("util"),V,Ne;typeof Symbol=="function"&&typeof Symbol.for=="function"?(V=Symbol.for("graceful-fs.queue"),Ne=Symbol.for("graceful-fs.previous")):(V="___graceful-fs.queue",Ne="___graceful-fs.previous");function Oo(){}function bt(e,t){Object.defineProperty(e,V,{get:function(){return t}})}var he=Oo;Re.debuglog?he=Re.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(he=function(){var e=Re.format.apply(Re,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});R[V]||(xt=global[V]||[],bt(R,xt),R.close=(function(e){function t(n,o){return e.call(R,n,function(r){r||Pt(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,Ne,{value:e}),t})(R.close),R.closeSync=(function(e){function t(n){e.apply(R,arguments),Pt()}return Object.defineProperty(t,Ne,{value:e}),t})(R.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){he(R[V]),require("assert").equal(R[V].length,0)}));var xt;global[V]||bt(global,R[V]);Ye.exports=Je(jo(R));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!R.__patched&&(Ye.exports=Je(R),R.__patched=!0);function Je(e){_o(e),e.gracefulify=Je,e.createReadStream=U,e.createWriteStream=ne;var t=e.readFile;e.readFile=n;function n(v,$,b){return typeof $=="function"&&(b=$,$=null),D(v,$,b);function D(j,q,x,h){return t(j,q,function(k){k&&(k.code==="EMFILE"||k.code==="ENFILE")?we([D,[j,q,x],k,h||Date.now(),Date.now()]):typeof x=="function"&&x.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=r;function r(v,$,b,D){return typeof b=="function"&&(D=b,b=null),j(v,$,b,D);function j(q,x,h,k,A){return o(q,x,h,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?we([j,[q,x,h,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var i=e.appendFile;i&&(e.appendFile=a);function a(v,$,b,D){return typeof b=="function"&&(D=b,b=null),j(v,$,b,D);function j(q,x,h,k,A){return i(q,x,h,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?we([j,[q,x,h,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var m=e.copyFile;m&&(e.copyFile=c);function c(v,$,b,D){return typeof b=="function"&&(D=b,b=0),j(v,$,b,D);function j(q,x,h,k,A){return m(q,x,h,function(E){E&&(E.code==="EMFILE"||E.code==="ENFILE")?we([j,[q,x,h,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}var l=e.readdir;e.readdir=d;var s=/^v[0-5]\./;function d(v,$,b){typeof $=="function"&&(b=$,$=null);var D=s.test(process.version)?function(x,h,k,A){return l(x,j(x,h,k,A))}:function(x,h,k,A){return l(x,h,j(x,h,k,A))};return D(v,$,b);function j(q,x,h,k){return function(A,E){A&&(A.code==="EMFILE"||A.code==="ENFILE")?we([D,[q,x,h],A,k||Date.now(),Date.now()]):(E&&E.sort&&E.sort(),typeof h=="function"&&h.call(this,A,E))}}}if(process.version.substr(0,4)==="v0.8"){var u=qo(e);w=u.ReadStream,F=u.WriteStream}var f=e.ReadStream;f&&(w.prototype=Object.create(f.prototype),w.prototype.open=M);var y=e.WriteStream;y&&(F.prototype=Object.create(y.prototype),F.prototype.open=I),Object.defineProperty(e,"ReadStream",{get:function(){return w},set:function(v){w=v},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return F},set:function(v){F=v},enumerable:!0,configurable:!0});var C=w;Object.defineProperty(e,"FileReadStream",{get:function(){return C},set:function(v){C=v},enumerable:!0,configurable:!0});var P=F;Object.defineProperty(e,"FileWriteStream",{get:function(){return P},set:function(v){P=v},enumerable:!0,configurable:!0});function w(v,$){return this instanceof w?(f.apply(this,arguments),this):w.apply(Object.create(w.prototype),arguments)}function M(){var v=this;ee(v.path,v.flags,v.mode,function($,b){$?(v.autoClose&&v.destroy(),v.emit("error",$)):(v.fd=b,v.emit("open",b),v.read())})}function F(v,$){return this instanceof F?(y.apply(this,arguments),this):F.apply(Object.create(F.prototype),arguments)}function I(){var v=this;ee(v.path,v.flags,v.mode,function($,b){$?(v.destroy(),v.emit("error",$)):(v.fd=b,v.emit("open",b))})}function U(v,$){return new e.ReadStream(v,$)}function ne(v,$){return new e.WriteStream(v,$)}var B=e.open;e.open=ee;function ee(v,$,b,D){return typeof b=="function"&&(D=b,b=null),j(v,$,b,D);function j(q,x,h,k,A){return B(q,x,h,function(E,se){E&&(E.code==="EMFILE"||E.code==="ENFILE")?we([j,[q,x,h,k],E,A||Date.now(),Date.now()]):typeof k=="function"&&k.apply(this,arguments)})}}return e}function we(e){he("ENQUEUE",e[0].name,e[1]),R[V].push(e),He()}var Le;function Pt(){for(var e=Date.now(),t=0;t<R[V].length;++t)R[V][t].length>2&&(R[V][t][3]=e,R[V][t][4]=e);He()}function He(){if(clearTimeout(Le),Le=void 0,R[V].length!==0){var e=R[V].shift(),t=e[0],n=e[1],o=e[2],r=e[3],i=e[4];if(r===void 0)he("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-r>=6e4){he("TIMEOUT",t.name,n);var a=n.pop();typeof a=="function"&&a.call(null,o)}else{var m=Date.now()-i,c=Math.max(i-r,1),l=Math.min(c*1.2,100);m>=l?(he("RETRY",t.name,n),t.apply(null,n.concat([r]))):R[V].push(e)}Le===void 0&&(Le=setTimeout(He,0))}}});var Q=T(ce=>{"use strict";var Ct=W().fromCallback,K=ve(),zo=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof K[e]=="function");Object.assign(ce,K);zo.forEach(e=>{ce[e]=Ct(K[e])});ce.exists=function(e,t){return typeof t=="function"?K.exists(e,t):new Promise(n=>K.exists(e,n))};ce.read=function(e,t,n,o,r,i){return typeof i=="function"?K.read(e,t,n,o,r,i):new Promise((a,m)=>{K.read(e,t,n,o,r,(c,l,s)=>{if(c)return m(c);a({bytesRead:l,buffer:s})})})};ce.write=function(e,t,...n){return typeof n[n.length-1]=="function"?K.write(e,t,...n):new Promise((o,r)=>{K.write(e,t,...n,(i,a,m)=>{if(i)return r(i);o({bytesWritten:a,buffer:m})})})};ce.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?K.readv(e,t,...n):new Promise((o,r)=>{K.readv(e,t,...n,(i,a,m)=>{if(i)return r(i);o({bytesRead:a,buffers:m})})})};ce.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?K.writev(e,t,...n):new Promise((o,r)=>{K.writev(e,t,...n,(i,a,m)=>{if(i)return r(i);o({bytesWritten:a,buffers:m})})})};typeof K.realpath.native=="function"?ce.realpath.native=Ct(K.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var Tt=T((aa,At)=>{"use strict";var Uo=require("path");At.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(Uo.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var Mt=T((sa,Ke)=>{"use strict";var Et=Q(),{checkPath:Ft}=Tt(),$t=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};Ke.exports.makeDir=async(e,t)=>(Ft(e),Et.mkdir(e,{mode:$t(t),recursive:!0}));Ke.exports.makeDirSync=(e,t)=>(Ft(e),Et.mkdirSync(e,{mode:$t(t),recursive:!0}))});var re=T((ca,It)=>{"use strict";var Wo=W().fromPromise,{makeDir:Go,makeDirSync:Qe}=Mt(),Xe=Wo(Go);It.exports={mkdirs:Xe,mkdirsSync:Qe,mkdirp:Xe,mkdirpSync:Qe,ensureDir:Xe,ensureDirSync:Qe}});var me=T((la,Rt)=>{"use strict";var Bo=W().fromPromise,Dt=Q();function Vo(e){return Dt.access(e).then(()=>!0).catch(()=>!1)}Rt.exports={pathExists:Bo(Vo),pathExistsSync:Dt.existsSync}});var Ze=T((ua,Lt)=>{"use strict";var Se=Q(),Jo=W().fromPromise;async function Ho(e,t,n){let o=await Se.open(e,"r+"),r=null;try{await Se.futimes(o,t,n)}finally{try{await Se.close(o)}catch(i){r=i}}if(r)throw r}function Yo(e,t,n){let o=Se.openSync(e,"r+");return Se.futimesSync(o,t,n),Se.closeSync(o)}Lt.exports={utimesMillis:Jo(Ho),utimesMillisSync:Yo}});var ge=T((da,jt)=>{"use strict";var ke=Q(),G=require("path"),Nt=W().fromPromise;function Ko(e,t,n){let o=n.dereference?r=>ke.stat(r,{bigint:!0}):r=>ke.lstat(r,{bigint:!0});return Promise.all([o(e),o(t).catch(r=>{if(r.code==="ENOENT")return null;throw r})]).then(([r,i])=>({srcStat:r,destStat:i}))}function Qo(e,t,n){let o,r=n.dereference?a=>ke.statSync(a,{bigint:!0}):a=>ke.lstatSync(a,{bigint:!0}),i=r(e);try{o=r(t)}catch(a){if(a.code==="ENOENT")return{srcStat:i,destStat:null};throw a}return{srcStat:i,destStat:o}}async function Xo(e,t,n,o){let{srcStat:r,destStat:i}=await Ko(e,t,o);if(i){if(Pe(r,i)){let a=G.basename(e),m=G.basename(t);if(n==="move"&&a!==m&&a.toLowerCase()===m.toLowerCase())return{srcStat:r,destStat:i,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(r.isDirectory()&&!i.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!r.isDirectory()&&i.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(r.isDirectory()&&et(e,t))throw new Error(_e(e,t,n));return{srcStat:r,destStat:i}}function Zo(e,t,n,o){let{srcStat:r,destStat:i}=Qo(e,t,o);if(i){if(Pe(r,i)){let a=G.basename(e),m=G.basename(t);if(n==="move"&&a!==m&&a.toLowerCase()===m.toLowerCase())return{srcStat:r,destStat:i,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(r.isDirectory()&&!i.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!r.isDirectory()&&i.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(r.isDirectory()&&et(e,t))throw new Error(_e(e,t,n));return{srcStat:r,destStat:i}}async function _t(e,t,n,o){let r=G.resolve(G.dirname(e)),i=G.resolve(G.dirname(n));if(i===r||i===G.parse(i).root)return;let a;try{a=await ke.stat(i,{bigint:!0})}catch(m){if(m.code==="ENOENT")return;throw m}if(Pe(t,a))throw new Error(_e(e,n,o));return _t(e,t,i,o)}function qt(e,t,n,o){let r=G.resolve(G.dirname(e)),i=G.resolve(G.dirname(n));if(i===r||i===G.parse(i).root)return;let a;try{a=ke.statSync(i,{bigint:!0})}catch(m){if(m.code==="ENOENT")return;throw m}if(Pe(t,a))throw new Error(_e(e,n,o));return qt(e,t,i,o)}function Pe(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function et(e,t){let n=G.resolve(e).split(G.sep).filter(r=>r),o=G.resolve(t).split(G.sep).filter(r=>r);return n.every((r,i)=>o[i]===r)}function _e(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}jt.exports={checkPaths:Nt(Xo),checkPathsSync:Zo,checkParentPaths:Nt(_t),checkParentPathsSync:qt,isSrcSubdir:et,areIdentical:Pe}});var zt=T((ma,Ot)=>{"use strict";async function er(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,r=>r??new Error("unknown error")));await Promise.all(n.map(o=>o.then(r=>{if(r!==null)throw r})))}Ot.exports={asyncIteratorConcurrentProcess:er}});var Vt=T((pa,Bt)=>{"use strict";var H=Q(),be=require("path"),{mkdirs:tr}=re(),{pathExists:nr}=me(),{utimesMillis:or}=Ze(),Ce=ge(),{asyncIteratorConcurrentProcess:rr}=zt();async function ir(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:r}=await Ce.checkPaths(e,t,"copy",n);if(await Ce.checkParentPaths(e,o,t,"copy"),!await Wt(e,t,n))return;let a=be.dirname(t);await nr(a)||await tr(a),await Gt(r,e,t,n)}async function Wt(e,t,n){return n.filter?n.filter(e,t):!0}async function Gt(e,t,n,o){let i=await(o.dereference?H.stat:H.lstat)(t);if(i.isDirectory())return lr(i,e,t,n,o);if(i.isFile()||i.isCharacterDevice()||i.isBlockDevice())return ar(i,e,t,n,o);if(i.isSymbolicLink())return ur(e,t,n,o);throw i.isSocket()?new Error(`Cannot copy a socket file: ${t}`):i.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function ar(e,t,n,o,r){if(!t)return Ut(e,n,o,r);if(r.overwrite)return await H.unlink(o),Ut(e,n,o,r);if(r.errorOnExist)throw new Error(`'${o}' already exists`)}async function Ut(e,t,n,o){if(await H.copyFile(t,n),o.preserveTimestamps){sr(e.mode)&&await cr(n,e.mode);let r=await H.stat(t);await or(n,r.atime,r.mtime)}return H.chmod(n,e.mode)}function sr(e){return(e&128)===0}function cr(e,t){return H.chmod(e,t|128)}async function lr(e,t,n,o,r){t||await H.mkdir(o),await rr(await H.opendir(n),async i=>{let a=be.join(n,i.name),m=be.join(o,i.name);if(await Wt(a,m,r)){let{destStat:l}=await Ce.checkPaths(a,m,"copy",r);await Gt(l,a,m,r)}}),t||await H.chmod(o,e.mode)}async function ur(e,t,n,o){let r=await H.readlink(t);if(o.dereference&&(r=be.resolve(process.cwd(),r)),!e)return H.symlink(r,n);let i=null;try{i=await H.readlink(n)}catch(a){if(a.code==="EINVAL"||a.code==="UNKNOWN")return H.symlink(r,n);throw a}if(o.dereference&&(i=be.resolve(process.cwd(),i)),Ce.isSrcSubdir(r,i))throw new Error(`Cannot copy '${r}' to a subdirectory of itself, '${i}'.`);if(Ce.isSrcSubdir(i,r))throw new Error(`Cannot overwrite '${i}' with '${r}'.`);return await H.unlink(n),H.symlink(r,n)}Bt.exports=ir});var Qt=T((fa,Kt)=>{"use strict";var X=ve(),Ae=require("path"),dr=re().mkdirsSync,mr=Ze().utimesMillisSync,Te=ge();function pr(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:r}=Te.checkPathsSync(e,t,"copy",n);if(Te.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let i=Ae.dirname(t);return X.existsSync(i)||dr(i),Jt(r,e,t,n)}function Jt(e,t,n,o){let i=(o.dereference?X.statSync:X.lstatSync)(t);if(i.isDirectory())return Sr(i,e,t,n,o);if(i.isFile()||i.isCharacterDevice()||i.isBlockDevice())return fr(i,e,t,n,o);if(i.isSymbolicLink())return Pr(e,t,n,o);throw i.isSocket()?new Error(`Cannot copy a socket file: ${t}`):i.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function fr(e,t,n,o,r){return t?hr(e,n,o,r):Ht(e,n,o,r)}function hr(e,t,n,o){if(o.overwrite)return X.unlinkSync(n),Ht(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function Ht(e,t,n,o){return X.copyFileSync(t,n),o.preserveTimestamps&&gr(e.mode,t,n),tt(n,e.mode)}function gr(e,t,n){return yr(e)&&wr(n,e),vr(t,n)}function yr(e){return(e&128)===0}function wr(e,t){return tt(e,t|128)}function tt(e,t){return X.chmodSync(e,t)}function vr(e,t){let n=X.statSync(e);return mr(t,n.atime,n.mtime)}function Sr(e,t,n,o,r){return t?Yt(n,o,r):kr(e.mode,n,o,r)}function kr(e,t,n,o){return X.mkdirSync(n),Yt(t,n,o),tt(n,e)}function Yt(e,t,n){let o=X.opendirSync(e);try{let r;for(;(r=o.readSync())!==null;)xr(r.name,e,t,n)}finally{o.closeSync()}}function xr(e,t,n,o){let r=Ae.join(t,e),i=Ae.join(n,e);if(o.filter&&!o.filter(r,i))return;let{destStat:a}=Te.checkPathsSync(r,i,"copy",o);return Jt(a,r,i,o)}function Pr(e,t,n,o){let r=X.readlinkSync(t);if(o.dereference&&(r=Ae.resolve(process.cwd(),r)),e){let i;try{i=X.readlinkSync(n)}catch(a){if(a.code==="EINVAL"||a.code==="UNKNOWN")return X.symlinkSync(r,n);throw a}if(o.dereference&&(i=Ae.resolve(process.cwd(),i)),Te.isSrcSubdir(r,i))throw new Error(`Cannot copy '${r}' to a subdirectory of itself, '${i}'.`);if(Te.isSrcSubdir(i,r))throw new Error(`Cannot overwrite '${i}' with '${r}'.`);return br(r,n)}else return X.symlinkSync(r,n)}function br(e,t){return X.unlinkSync(t),X.symlinkSync(e,t)}Kt.exports=pr});var qe=T((ha,Xt)=>{"use strict";var Cr=W().fromPromise;Xt.exports={copy:Cr(Vt()),copySync:Qt()}});var Ee=T((ga,en)=>{"use strict";var Zt=ve(),Ar=W().fromCallback;function Tr(e,t){Zt.rm(e,{recursive:!0,force:!0},t)}function Er(e){Zt.rmSync(e,{recursive:!0,force:!0})}en.exports={remove:Ar(Tr),removeSync:Er}});var ln=T((ya,cn)=>{"use strict";var Fr=W().fromPromise,on=Q(),rn=require("path"),an=re(),sn=Ee(),tn=Fr(async function(t){let n;try{n=await on.readdir(t)}catch{return an.mkdirs(t)}return Promise.all(n.map(o=>sn.remove(rn.join(t,o))))});function nn(e){let t;try{t=on.readdirSync(e)}catch{return an.mkdirsSync(e)}t.forEach(n=>{n=rn.join(e,n),sn.removeSync(n)})}cn.exports={emptyDirSync:nn,emptydirSync:nn,emptyDir:tn,emptydir:tn}});var pn=T((wa,mn)=>{"use strict";var $r=W().fromPromise,un=require("path"),le=Q(),dn=re();async function Mr(e){let t;try{t=await le.stat(e)}catch{}if(t&&t.isFile())return;let n=un.dirname(e),o=null;try{o=await le.stat(n)}catch(r){if(r.code==="ENOENT"){await dn.mkdirs(n),await le.writeFile(e,"");return}else throw r}o.isDirectory()?await le.writeFile(e,""):await le.readdir(n)}function Ir(e){let t;try{t=le.statSync(e)}catch{}if(t&&t.isFile())return;let n=un.dirname(e);try{le.statSync(n).isDirectory()||le.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")dn.mkdirsSync(n);else throw o}le.writeFileSync(e,"")}mn.exports={createFile:$r(Mr),createFileSync:Ir}});var wn=T((va,yn)=>{"use strict";var Dr=W().fromPromise,fn=require("path"),pe=Q(),hn=re(),{pathExists:Rr}=me(),{areIdentical:gn}=ge();async function Lr(e,t){let n;try{n=await pe.lstat(t)}catch{}let o;try{o=await pe.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}if(n&&gn(o,n))return;let r=fn.dirname(t);await Rr(r)||await hn.mkdirs(r),await pe.link(e,t)}function Nr(e,t){let n;try{n=pe.lstatSync(t)}catch{}try{let i=pe.lstatSync(e);if(n&&gn(i,n))return}catch(i){throw i.message=i.message.replace("lstat","ensureLink"),i}let o=fn.dirname(t);return pe.existsSync(o)||hn.mkdirsSync(o),pe.linkSync(e,t)}yn.exports={createLink:Dr(Lr),createLinkSync:Nr}});var Sn=T((Sa,vn)=>{"use strict";var fe=require("path"),Fe=Q(),{pathExists:_r}=me(),qr=W().fromPromise;async function jr(e,t){if(fe.isAbsolute(e)){try{await Fe.lstat(e)}catch(i){throw i.message=i.message.replace("lstat","ensureSymlink"),i}return{toCwd:e,toDst:e}}let n=fe.dirname(t),o=fe.join(n,e);if(await _r(o))return{toCwd:o,toDst:e};try{await Fe.lstat(e)}catch(i){throw i.message=i.message.replace("lstat","ensureSymlink"),i}return{toCwd:e,toDst:fe.relative(n,e)}}function Or(e,t){if(fe.isAbsolute(e)){if(!Fe.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=fe.dirname(t),o=fe.join(n,e);if(Fe.existsSync(o))return{toCwd:o,toDst:e};if(!Fe.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:fe.relative(n,e)}}vn.exports={symlinkPaths:qr(jr),symlinkPathsSync:Or}});var Pn=T((ka,xn)=>{"use strict";var kn=Q(),zr=W().fromPromise;async function Ur(e,t){if(t)return t;let n;try{n=await kn.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function Wr(e,t){if(t)return t;let n;try{n=kn.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}xn.exports={symlinkType:zr(Ur),symlinkTypeSync:Wr}});var Tn=T((xa,An)=>{"use strict";var Gr=W().fromPromise,bn=require("path"),ae=Q(),{mkdirs:Br,mkdirsSync:Vr}=re(),{symlinkPaths:Jr,symlinkPathsSync:Hr}=Sn(),{symlinkType:Yr,symlinkTypeSync:Kr}=Pn(),{pathExists:Qr}=me(),{areIdentical:Cn}=ge();async function Xr(e,t,n){let o;try{o=await ae.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[m,c]=await Promise.all([ae.stat(e),ae.stat(t)]);if(Cn(m,c))return}let r=await Jr(e,t);e=r.toDst;let i=await Yr(r.toCwd,n),a=bn.dirname(t);return await Qr(a)||await Br(a),ae.symlink(e,t,i)}function Zr(e,t,n){let o;try{o=ae.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let m=ae.statSync(e),c=ae.statSync(t);if(Cn(m,c))return}let r=Hr(e,t);e=r.toDst,n=Kr(r.toCwd,n);let i=bn.dirname(t);return ae.existsSync(i)||Vr(i),ae.symlinkSync(e,t,n)}An.exports={createSymlink:Gr(Xr),createSymlinkSync:Zr}});var Ln=T((Pa,Rn)=>{"use strict";var{createFile:En,createFileSync:Fn}=pn(),{createLink:$n,createLinkSync:Mn}=wn(),{createSymlink:In,createSymlinkSync:Dn}=Tn();Rn.exports={createFile:En,createFileSync:Fn,ensureFile:En,ensureFileSync:Fn,createLink:$n,createLinkSync:Mn,ensureLink:$n,ensureLinkSync:Mn,createSymlink:In,createSymlinkSync:Dn,ensureSymlink:In,ensureSymlinkSync:Dn}});var je=T((ba,Nn)=>{function ei(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:r}={}){let i=n?t:"";return JSON.stringify(e,o,r).replace(/\n/g,t)+i}function ti(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}Nn.exports={stringify:ei,stripBom:ti}});var On=T((Ca,jn)=>{var xe;try{xe=ve()}catch{xe=require("fs")}var Oe=W(),{stringify:_n,stripBom:qn}=je();async function ni(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||xe,o="throws"in t?t.throws:!0,r=await Oe.fromCallback(n.readFile)(e,t);r=qn(r);let i;try{i=JSON.parse(r,t?t.reviver:null)}catch(a){if(o)throw a.message=`${e}: ${a.message}`,a;return null}return i}var oi=Oe.fromPromise(ni);function ri(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||xe,o="throws"in t?t.throws:!0;try{let r=n.readFileSync(e,t);return r=qn(r),JSON.parse(r,t.reviver)}catch(r){if(o)throw r.message=`${e}: ${r.message}`,r;return null}}async function ii(e,t,n={}){let o=n.fs||xe,r=_n(t,n);await Oe.fromCallback(o.writeFile)(e,r,n)}var ai=Oe.fromPromise(ii);function si(e,t,n={}){let o=n.fs||xe,r=_n(t,n);return o.writeFileSync(e,r,n)}jn.exports={readFile:oi,readFileSync:ri,writeFile:ai,writeFileSync:si}});var Un=T((Aa,zn)=>{"use strict";var ze=On();zn.exports={readJson:ze.readFile,readJsonSync:ze.readFileSync,writeJson:ze.writeFile,writeJsonSync:ze.writeFileSync}});var Ue=T((Ta,Bn)=>{"use strict";var ci=W().fromPromise,nt=Q(),Wn=require("path"),Gn=re(),li=me().pathExists;async function ui(e,t,n="utf-8"){let o=Wn.dirname(e);return await li(o)||await Gn.mkdirs(o),nt.writeFile(e,t,n)}function di(e,...t){let n=Wn.dirname(e);nt.existsSync(n)||Gn.mkdirsSync(n),nt.writeFileSync(e,...t)}Bn.exports={outputFile:ci(ui),outputFileSync:di}});var Jn=T((Ea,Vn)=>{"use strict";var{stringify:mi}=je(),{outputFile:pi}=Ue();async function fi(e,t,n={}){let o=mi(t,n);await pi(e,o,n)}Vn.exports=fi});var Yn=T((Fa,Hn)=>{"use strict";var{stringify:hi}=je(),{outputFileSync:gi}=Ue();function yi(e,t,n){let o=hi(t,n);gi(e,o,n)}Hn.exports=yi});var Qn=T(($a,Kn)=>{"use strict";var wi=W().fromPromise,Z=Un();Z.outputJson=wi(Jn());Z.outputJsonSync=Yn();Z.outputJSON=Z.outputJson;Z.outputJSONSync=Z.outputJsonSync;Z.writeJSON=Z.writeJson;Z.writeJSONSync=Z.writeJsonSync;Z.readJSON=Z.readJson;Z.readJSONSync=Z.readJsonSync;Kn.exports=Z});var no=T((Ma,to)=>{"use strict";var vi=Q(),Xn=require("path"),{copy:Si}=qe(),{remove:eo}=Ee(),{mkdirp:ki}=re(),{pathExists:xi}=me(),Zn=ge();async function Pi(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:r,isChangingCase:i=!1}=await Zn.checkPaths(e,t,"move",n);await Zn.checkParentPaths(e,r,t,"move");let a=Xn.dirname(t);return Xn.parse(a).root!==a&&await ki(a),bi(e,t,o,i)}async function bi(e,t,n,o){if(!o){if(n)await eo(t);else if(await xi(t))throw new Error("dest already exists.")}try{await vi.rename(e,t)}catch(r){if(r.code!=="EXDEV")throw r;await Ci(e,t,n)}}async function Ci(e,t,n){return await Si(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),eo(e)}to.exports=Pi});var so=T((Ia,ao)=>{"use strict";var ro=ve(),rt=require("path"),Ai=qe().copySync,io=Ee().removeSync,Ti=re().mkdirpSync,oo=ge();function Ei(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:r,isChangingCase:i=!1}=oo.checkPathsSync(e,t,"move",n);return oo.checkParentPathsSync(e,r,t,"move"),Fi(t)||Ti(rt.dirname(t)),$i(e,t,o,i)}function Fi(e){let t=rt.dirname(e);return rt.parse(t).root===t}function $i(e,t,n,o){if(o)return ot(e,t,n);if(n)return io(t),ot(e,t,n);if(ro.existsSync(t))throw new Error("dest already exists.");return ot(e,t,n)}function ot(e,t,n){try{ro.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return Mi(e,t,n)}}function Mi(e,t,n){return Ai(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),io(e)}ao.exports=Ei});var lo=T((Da,co)=>{"use strict";var Ii=W().fromPromise;co.exports={move:Ii(no()),moveSync:so()}});var $e=T((Ra,uo)=>{"use strict";uo.exports={...Q(),...qe(),...ln(),...Ln(),...Qn(),...re(),...lo(),...Ue(),...me(),...Ee()}});var Xi={};Fo(Xi,{activate:()=>Ki,deactivate:()=>Qi});module.exports=$o(Xi);var ye=Y(require("vscode"));var N=Y(require("vscode")),oe=Y($e()),L=Y(require("path"));async function mo(e){let t=N.workspace.workspaceFolders;if(!t){N.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=L.join(n,".github","copilot-instructions.md");if(await oe.pathExists(o)){let r=await N.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");r==="Upgrade Instead"?await N.commands.executeCommand("alex.upgrade"):r==="Reset Architecture"&&await it(e);return}await po(e,n,!1)}async function it(e){let t=N.workspace.workspaceFolders;if(!t){N.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await N.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await N.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let r=[L.join(n,".github","copilot-instructions.md"),L.join(n,".github","instructions"),L.join(n,".github","prompts"),L.join(n,"domain-knowledge"),L.join(n,".alex-manifest.json")];try{await N.window.withProgress({location:N.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async i=>{i.report({message:"Cleaning up existing files..."});for(let a of r)await oe.remove(a)}),await po(e,n,!0)}catch(i){N.window.showErrorMessage(`Failed to reset Alex: ${i.message}`)}}async function po(e,t,n){let o=e.extensionPath,r=L.join(o,".github","copilot-instructions.md");if(!await oe.pathExists(r)){N.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let i=[{src:L.join(o,".github","copilot-instructions.md"),dest:L.join(t,".github","copilot-instructions.md")},{src:L.join(o,".github","instructions"),dest:L.join(t,".github","instructions")},{src:L.join(o,".github","prompts"),dest:L.join(t,".github","prompts")},{src:L.join(o,".github","agents"),dest:L.join(t,".github","agents")},{src:L.join(o,"domain-knowledge"),dest:L.join(t,"domain-knowledge")}];try{let a=L.join(t,".github");await oe.ensureDir(a);let m=L.join(a,".write-test");try{await oe.writeFile(m,"test"),await oe.remove(m)}catch(l){throw new Error(`Cannot write to workspace - check folder permissions: ${l.message}`)}await N.window.withProgress({location:N.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async l=>{for(let s of i)l.report({message:`Copying ${L.basename(s.dest)}...`}),await oe.pathExists(s.src)?await oe.copy(s.src,s.dest,{overwrite:n}):console.warn(`Source not found: ${s.src}`)});let c=await N.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(c==="Open Main Brain File"){let l=L.join(t,".github","copilot-instructions.md"),s=await N.workspace.openTextDocument(l);await N.window.showTextDocument(s)}else c==="Run Dream Protocol"&&await N.commands.executeCommand("alex.dream")}catch(a){N.window.showErrorMessage(`Failed to initialize Alex: ${a.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var z=Y(require("vscode")),ie=Y($e()),te=Y(require("path")),fo={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function ho(e){let t=z.workspace.workspaceFolders;if(!t){z.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await z.window.withProgress({location:z.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md","domain-knowledge/*.md"],i=[];for(let w of r){let M=new z.RelativePattern(t[0],w),F=await z.workspace.findFiles(M);i=i.concat(F.map(I=>I.fsPath))}if(i=[...new Set(i)],i.length===0){await z.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await z.commands.executeCommand("alex.initialize");return}let a=[],m=new Set(i.map(w=>te.normalize(w).toLowerCase())),c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let w of i){let M;try{M=await ie.readFile(w,"utf-8")}catch(U){console.error(`Failed to read file ${w}:`,U);continue}let F=M.split(`
`),I=!1;for(let U=0;U<F.length;U++){let ne=F[U];if(ne.trim().startsWith("```")){I=!I;continue}if(I)continue;let B;for(;(B=c.exec(ne))!==null;){let ee=B[1].trim(),v=Array.from(m).some(b=>b.endsWith(te.normalize(ee).toLowerCase()));if(!v){let b=te.join(n,ee);(await ie.pathExists(b)||(await z.workspace.findFiles(new z.RelativePattern(t[0],`**/${ee}`))).length>0)&&(v=!0)}if(!v){let b=te.dirname(w),D=te.join(b,ee);await ie.pathExists(D)&&(v=!0)}["target-file.md","CHANGELOG.md"].includes(ee)&&(v=!0),a.push({sourceFile:w,targetFile:ee,strength:B[2].trim(),type:B[3]?.trim()||"association",direction:B[4]?.trim()||"unidirectional",condition:B[5]?.trim(),line:U+1,isValid:v})}}}let l=a.filter(w=>!w.isValid),s=new Set(a.map(w=>w.targetFile.toLowerCase())),d=[],u=[];for(let w of l){let M=te.basename(w.targetFile);if(fo[M]){let F=fo[M];try{let I=await ie.readFile(w.sourceFile,"utf-8"),U=w.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),ne=new RegExp(`\\[${U}\\]`,"g");if(ne.test(I)){let B=I.replace(ne,`[${F}]`);await ie.writeFile(w.sourceFile,B,"utf-8"),w.repaired=!0,w.newTarget=F,d.push(w)}else u.push(w)}catch(I){console.error(`Failed to repair synapse in ${w.sourceFile}:`,I),u.push(w)}}else u.push(w)}l=u;let f={timestamp:new Date().toISOString(),totalFiles:i.length,totalSynapses:a.length,brokenSynapses:l,repairedSynapses:d,orphanedFiles:[]},y=Di(f),C=te.join(n,"archive",`dream-report-${Date.now()}.md`);if(await ie.ensureDir(te.dirname(C)),await ie.writeFile(C,y),l.length>0){if(await z.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${l.length} broken synapse${l.length>1?"s":""}!

${d.length>0?`\u2705 Auto-repaired: ${d.length}
`:""}\u274C Need manual repair: ${l.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let w=a.length>50?"excellent":a.length>20?"good":"developing";if(await z.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${i.length} memory files
\u2022 ${a.length} active synapses
${d.length>0?`\u2022 ${d.length} auto-repaired
`:""}\u2022 Network health: ${w}`,"View Full Report","Close")!=="View Full Report")return}let P=await z.workspace.openTextDocument(C);await z.window.showTextDocument(P)})}function Di(e){return`# Dream Protocol Report
**Timestamp**: ${e.timestamp}
**Status**: ${e.brokenSynapses.length===0?"HEALTHY":"ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${e.totalFiles}
- **Total Synapses**: ${e.totalSynapses}
- **Broken Connections**: ${e.brokenSynapses.length}
- **Repaired Connections**: ${e.repairedSynapses.length}

## Repaired Synapses
${e.repairedSynapses.length===0?"_None._":e.repairedSynapses.map(t=>`- **Source**: ${te.basename(t.sourceFile)}:${t.line}
  - **Old Target**: ${t.targetFile}
  - **New Target**: ${t.newTarget} (Auto-repaired)`).join(`
`)}

## Broken Synapses
${e.brokenSynapses.length===0?"_None detected._":e.brokenSynapses.map(t=>`- **Source**: ${te.basename(t.sourceFile)}:${t.line}
  - **Target**: ${t.targetFile} (Not found)
  - **Condition**: "${t.condition}"`).join(`
`)}

## Recommendations
${e.brokenSynapses.length>0?"- [ ] Repair remaining broken links manually.":"- [x] System is optimized."}
`}var _=Y(require("vscode")),p=Y($e()),S=Y(require("path")),yo=Y(require("crypto"));function Me(e){return yo.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function Ri(e){let t=S.join(e,".github","copilot-instructions.md");if(!await p.pathExists(t))return null;try{let o=(await p.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function Li(e){try{return(await p.readJson(S.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function Ni(e){let t=S.join(e,".alex-manifest.json");if(await p.pathExists(t))try{return await p.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function go(e){let t=[];if(!await p.pathExists(e))return t;try{let n=await p.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let r of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${r}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${r}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function _i(e,t){let n=[],o=S.join(e,"domain-knowledge");if(await p.pathExists(o)){let r=await p.readdir(o);for(let i of r)if(i.endsWith(".md")){let a=`domain-knowledge/${i}`;t?.files[a]||n.push(a)}}return n}async function wo(e){let t=_.workspace.workspaceFolders;if(!t){_.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,r=S.join(n,".github","copilot-instructions.md");if(!await p.pathExists(r)){await _.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await _.commands.executeCommand("alex.initialize");return}let i=await Ri(n),a=await Li(o);if(i===a){await _.window.showInformationMessage(`\u2705 Alex is already at the latest version (${a}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await _.commands.executeCommand("alex.dream");return}let m=await _.window.showInformationMessage(`\u{1F504} Upgrade Available: v${i||"unknown"} \u2192 v${a}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(m==="What's New?"){let c=S.join(o,"CHANGELOG.md");if(await p.pathExists(c)){let l=await _.workspace.openTextDocument(c);await _.window.showTextDocument(l)}return}m==="Start Upgrade"&&await qi(e,n,o,i,a)}async function qi(e,t,n,o,r){let i=S.join(n,".github","copilot-instructions.md");if(!await p.pathExists(i)){_.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},m=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),c=S.join(t,"archive","upgrades",`backup-${o||"unknown"}-${m}`);try{await _.window.withProgress({location:_.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async d=>{d.report({message:"Creating complete backup...",increment:15});try{await p.ensureDir(c);let x=S.join(c,".write-test");await p.writeFile(x,"test"),await p.remove(x)}catch(x){throw new Error(`Cannot create backup directory - check disk space and permissions: ${x.message}`)}let u=S.join(t,".github");await p.pathExists(u)&&(await p.copy(u,S.join(c,".github")),a.backed_up.push(".github/"));let f=S.join(t,"domain-knowledge");await p.pathExists(f)&&(await p.copy(f,S.join(c,"domain-knowledge")),a.backed_up.push("domain-knowledge/")),d.report({message:"Analyzing installed files...",increment:10});let y=await Ni(t);y||(y={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),d.report({message:"Scanning for schema migration needs...",increment:15});let C=[],P=S.join(t,".github","copilot-instructions.md");await p.pathExists(P)&&C.push(P);let w=S.join(t,"domain-knowledge");if(await p.pathExists(w)){let x=await p.readdir(w);for(let h of x)h.endsWith(".md")&&C.push(S.join(w,h))}for(let x of C){let h=await go(x);if(h.length>0){let k=S.relative(t,x);a.migrationTasks.push({file:k,type:"schema-migration",description:"Synapse schema migration needed",details:h})}}d.report({message:"Identifying user-created files...",increment:10});let M=await _i(t,y);for(let x of M){a.preserved.push(`${x} (user-created)`);let h=S.join(t,x),k=await go(h);k.length>0&&a.migrationTasks.push({file:x,type:"schema-migration",description:"User-created file needs schema migration",details:k})}d.report({message:"Preparing merge tasks...",increment:10}),a.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires intelligent merge",details:["UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),d.report({message:"Updating system files...",increment:20});let F=S.join(n,".github","instructions"),I=S.join(t,".github","instructions");if(await p.pathExists(F)){let x=await p.readdir(F);for(let h of x){let k=S.join(F,h),A=S.join(I,h);if((await p.stat(k)).isFile()){let E=await p.pathExists(A);await p.copy(k,A,{overwrite:!0});let se=await p.readFile(k,"utf8");y.files[`.github/instructions/${h}`]={type:"system",originalChecksum:Me(se)},E?a.updated.push(`.github/instructions/${h}`):a.added.push(`.github/instructions/${h}`)}}}let U=S.join(n,".github","prompts"),ne=S.join(t,".github","prompts");if(await p.pathExists(U)){let x=await p.readdir(U);for(let h of x){let k=S.join(U,h),A=S.join(ne,h);if((await p.stat(k)).isFile()){let E=await p.pathExists(A);await p.copy(k,A,{overwrite:!0});let se=await p.readFile(k,"utf8");y.files[`.github/prompts/${h}`]={type:"system",originalChecksum:Me(se)},E?a.updated.push(`.github/prompts/${h}`):a.added.push(`.github/prompts/${h}`)}}}let B=S.join(n,".github","agents"),ee=S.join(t,".github","agents");if(await p.pathExists(B)){await p.ensureDir(ee);let x=await p.readdir(B);for(let h of x){let k=S.join(B,h),A=S.join(ee,h);if((await p.stat(k)).isFile()){let E=await p.pathExists(A);await p.copy(k,A,{overwrite:!0});let se=await p.readFile(k,"utf8");y.files[`.github/agents/${h}`]={type:"system",originalChecksum:Me(se)},E?a.updated.push(`.github/agents/${h}`):a.added.push(`.github/agents/${h}`)}}}let v=S.join(n,"config"),$=S.join(t,"config");if(await p.pathExists(v)){await p.ensureDir($);let x=await p.readdir(v);for(let h of x)if(h.includes("template")||h==="USER-PROFILE-TEMPLATE.md"){let k=S.join(v,h),A=S.join($,h);if((await p.stat(k)).isFile()){let E=await p.pathExists(A);await p.copy(k,A,{overwrite:!0}),E?a.updated.push(`config/${h}`):a.added.push(`config/${h}`)}}}d.report({message:"Processing domain knowledge...",increment:10});let b=S.join(n,"domain-knowledge"),D=S.join(t,"domain-knowledge");if(await p.pathExists(b)){await p.ensureDir(D);let x=await p.readdir(b);for(let h of x){let k=S.join(b,h),A=S.join(D,h);if((await p.stat(k)).isFile()){let E=await p.readFile(k,"utf8"),se=Me(E);if(!await p.pathExists(A))await p.copy(k,A),y.files[`domain-knowledge/${h}`]={type:"system",originalChecksum:se},a.added.push(`domain-knowledge/${h}`);else{let xo=await p.readFile(A,"utf8"),Po=Me(xo),pt=y.files[`domain-knowledge/${h}`]?.originalChecksum;if(pt&&Po!==pt){let Ge=A.replace(/\.md$/,`.v${r}.md`);await p.copy(k,Ge),a.preserved.push(`domain-knowledge/${h} (modified by user, new version: ${S.basename(Ge)})`),a.migrationTasks.push({file:`domain-knowledge/${h}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${h}`,`New version available: ${S.basename(Ge)}`,"Review and merge changes as needed"]})}else await p.copy(k,A,{overwrite:!0}),y.files[`domain-knowledge/${h}`]={type:"system",originalChecksum:se},a.updated.push(`domain-knowledge/${h}`)}}}}d.report({message:"Saving manifest...",increment:5}),y.version=r,y.upgradedAt=new Date().toISOString();let j=S.join(t,".alex-manifest.json"),q=j+".tmp";await p.writeJson(q,y,{spaces:2}),await p.move(q,j,{overwrite:!0}),d.report({message:"Generating upgrade instructions...",increment:5}),await ji(t,o,r,a,c,m)});let l=a.migrationTasks.length===1?"task":"tasks",s=await _.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${a.backed_up.length} folders
\u2022 Files updated: ${a.updated.length}
\u2022 Files added: ${a.added.length}
\u2022 Files preserved: ${a.preserved.length}
\u2022 Migration ${l}: ${a.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(s==="Open Instructions (Recommended)"){let d=S.join(t,"UPGRADE-INSTRUCTIONS.md"),u=await _.workspace.openTextDocument(d);await _.window.showTextDocument(u)}else if(s==="View Full Report"){let d=S.join(t,"archive","upgrades",`upgrade-report-${m}.md`),u=await _.workspace.openTextDocument(d);await _.window.showTextDocument(u)}}catch(l){_.window.showErrorMessage(`\u274C Upgrade failed: ${l.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),a.errors.push(l.message)}}async function ji(e,t,n,o,r,i){let a=`# \u{1F504} Alex Upgrade: Phase 2 Required

**Upgrade**: v${t||"unknown"} \u2192 v${n}  
**Date**: ${new Date().toISOString()}  
**Status**: \u26A0\uFE0F Phase 1 Complete - AI Assistance Required

---

## What Just Happened (Phase 1 - Automated)

\u2705 Full backup created: \`${S.relative(e,r)}\`  
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

1. Reading the upgrade tasks in archive/upgrades/upgrade-report-${i}.md
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

${o.migrationTasks.length>0?o.migrationTasks.map((l,s)=>`
### Task ${s+1}: ${l.file}

**Type**: ${l.type}  
**Description**: ${l.description}

${l.details.map(d=>`- ${d}`).join(`
`)}
`).join(`
`):"No migration tasks required."}

---

## Rollback Instructions

If anything goes wrong:

1. Delete current \`.github/\` and \`domain-knowledge/\` folders
2. Copy contents from: \`${S.relative(e,r)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${i}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${S.relative(e,r)}\`

---

*This file will be deleted after successful upgrade completion.*
`;await p.writeFile(S.join(e,"UPGRADE-INSTRUCTIONS.md"),a,"utf8");let m=`# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}  
**From Version**: ${t||"unknown"}  
**To Version**: ${n}  
**Backup Location**: \`${r}\`

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

${o.updated.length>0?o.updated.map(l=>`- \u2705 ${l}`).join(`
`):"- None"}

## Added Files (New in this version)

${o.added.length>0?o.added.map(l=>`- \u2795 ${l}`).join(`
`):"- None"}

## Preserved Files (User content protected)

${o.preserved.length>0?o.preserved.map(l=>`- \u{1F512} ${l}`).join(`
`):"- None"}

## Backed Up

${o.backed_up.length>0?o.backed_up.map(l=>`- \u{1F4E6} ${l}`).join(`
`):"- None"}

---

## Migration Tasks (Require AI Assistance)

${o.migrationTasks.length>0?o.migrationTasks.map((l,s)=>`
### ${s+1}. ${l.file}

**Type**: \`${l.type}\`  
**Description**: ${l.description}

**Details**:
${l.details.map(d=>`- ${d}`).join(`
`)}
`).join(`
---
`):"No migration tasks required."}

---

${o.errors.length>0?`## Errors

${o.errors.map(l=>`- \u274C ${l}`).join(`
`)}`:""}

## Next Steps

1. Read \`UPGRADE-INSTRUCTIONS.md\` in workspace root
2. Ask AI assistant to complete Phase 2 migration
3. Run \`Alex: Dream (Neural Maintenance)\` to validate
4. Delete \`UPGRADE-INSTRUCTIONS.md\` when complete

---

*Report generated by Alex Cognitive Architecture v${n}*
`,c=S.join(e,"archive","upgrades",`upgrade-report-${i}.md`);await p.ensureDir(S.dirname(c)),await p.writeFile(c,m,"utf8")}var J=Y(require("vscode"));var g=Y(require("vscode")),O=Y($e()),ue=Y(require("path")),at=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new g.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let r=o[0].uri.fsPath,i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md","domain-knowledge/*.md"],a=0,m=0,c=0,l=[],s=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let f of i){let y=new g.RelativePattern(o[0],f),C=await g.workspace.findFiles(y);for(let P of C){a++;try{let M=(await O.readFile(P.fsPath,"utf-8")).split(`
`),F=!1;for(let I=0;I<M.length;I++){let U=M[I];if(U.trim().startsWith("```")){F=!F;continue}if(F)continue;let ne;for(;(ne=s.exec(U))!==null;){m++;let B=ne[1].trim();(await g.workspace.findFiles(new g.RelativePattern(o[0],`**/${B}`))).length===0&&(c++,t.input.detailed&&l.push(`- ${ue.basename(P.fsPath)}:${I+1} \u2192 ${B} (not found)`))}}}catch{}}}let d=c===0?"EXCELLENT":c<5?"GOOD":c<10?"NEEDS ATTENTION":"CRITICAL",u=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${a} |
| Total Synapses | ${m} |
| Broken Connections | ${c} |
| Health Status | ${d} |
`;return t.input.detailed&&l.length>0&&(u+=`
### Issues Found
${l.join(`
`)}`),c>0&&(u+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new g.LanguageModelToolResult([new g.LanguageModelTextPart(u)])}},st=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new g.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open.")]);let r=t.input.query.toLowerCase(),i=t.input.memoryType||"all",a=[];(i==="all"||i==="procedural")&&a.push(".github/instructions/*.md"),(i==="all"||i==="episodic")&&a.push(".github/prompts/*.md"),(i==="all"||i==="domain")&&a.push("domain-knowledge/*.md");let m=[];for(let l of a){let s=new g.RelativePattern(o[0],l),d=await g.workspace.findFiles(s);for(let u of d)try{let y=(await O.readFile(u.fsPath,"utf-8")).split(`
`),C=[];for(let P=0;P<y.length;P++)if(y[P].toLowerCase().includes(r)){let w=Math.max(0,P-1),M=Math.min(y.length-1,P+1),F=y.slice(w,M+1).join(`
`);C.push(`Line ${P+1}:
${F}`)}C.length>0&&m.push({file:ue.basename(u.fsPath),matches:C.slice(0,3)})}catch{}}if(m.length===0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`No matches found for "${t.input.query}" in ${i} memory files.`)]);let c=`## Memory Search Results for "${t.input.query}"

`;c+=`Found ${m.length} file(s) with matches:

`;for(let l of m.slice(0,5)){c+=`### ${l.file}
`;for(let s of l.matches)c+=`\`\`\`
${s}
\`\`\`
`;c+=`
`}return new g.LanguageModelToolResult([new g.LanguageModelTextPart(c)])}},ct=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let r=o[0].uri.fsPath,i=ue.join(r,".github","copilot-instructions.md");if(!await O.pathExists(i))return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let m=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/instructions/*.md")),c=await g.workspace.findFiles(new g.RelativePattern(o[0],".github/prompts/*.md")),l=await g.workspace.findFiles(new g.RelativePattern(o[0],"domain-knowledge/*.md")),s="Unknown";try{let f=(await O.readFile(i,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);f&&(s=f[1])}catch{}let d=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${s} |
| Procedural Memory | ${m.length} files |
| Episodic Memory | ${c.length} files |
| Domain Knowledge | ${l.length} files |

### Memory Systems
- **Working Memory**: Chat session (7-rule capacity)
- **Procedural Memory**: .instructions.md files for repeatable processes
- **Episodic Memory**: .prompt.md files for complex workflows
- **Domain Knowledge**: DK-*.md files for specialized expertise

### Available Commands
- \`Alex: Initialize Architecture\` - Deploy to new project
- \`Alex: Dream (Neural Maintenance)\` - Validate synapses
- \`Alex: Upgrade Architecture\` - Update to latest version
- \`Alex: Reset Architecture\` - Clean reinstall
`;return new g.LanguageModelToolResult([new g.LanguageModelTextPart(d)])}},lt=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),r=t.input.platform||"both",i=[];return(r==="azure"||r==="both")&&i.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(r==="m365"||r==="both")&&i.push(`## Microsoft 365 MCP Tools

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
`),i.push(`## Recommended for: "${t.input.scenario}"

### How to Use These Tools
1. **Switch to Agent Mode** in GitHub Copilot Chat
2. Ask your question naturally - tools are invoked automatically
3. Or reference tools explicitly with \`#toolName\`

### Example Prompts
- "Create an Azure Function with Cosmos DB binding using best practices"
- "Build a Teams bot with adaptive cards and SSO"
- "Query my Azure resources to find expensive VMs"
- "Generate a declarative Copilot agent manifest"
`),new g.LanguageModelToolResult([new g.LanguageModelTextPart(i.join(`
`))])}},ut=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=g.workspace.workspaceFolders;if(!o)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let r=o[0].uri.fsPath,i=ue.join(r,"config","USER-PROFILE.md"),a=ue.join(r,"config","user-profile.json"),{action:m,field:c,value:l}=t.input;try{switch(m){case"exists":let s=await O.pathExists(a);return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:s,path:a}))]);case"get":if(!await O.pathExists(a))return new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let d=await O.readJson(a);return c?new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({[c]:d[c]}))]):new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify(d))]);case"update":if(!c||l===void 0)return new g.LanguageModelToolResult([new g.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await O.ensureDir(ue.join(r,"config"));let u={};if(await O.pathExists(a)&&(u=await O.readJson(a)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(c)){let f=u[c]||[];Array.isArray(f)?f.includes(l)||(u[c]=[...f,l]):u[c]=[l]}else u[c]=l;return u.lastUpdated=new Date().toISOString(),await O.writeJson(a,u,{spaces:2}),await this.updateMarkdownProfile(i,u),new g.LanguageModelToolResult([new g.LanguageModelTextPart(JSON.stringify({success:!0,field:c,value:l,message:`Updated ${c} to: ${l}`}))]);default:return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Unknown action: ${m}`)])}}catch(s){return new g.LanguageModelToolResult([new g.LanguageModelTextPart(`Error accessing user profile: ${s.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
${(n.primaryTechnologies||[]).map(r=>`- ${r}`).join(`
`)||"- (not set)"}

### Learning Goals
${(n.learningGoals||[]).map(r=>`- ${r}`).join(`
`)||"- (not set)"}

### Expertise Areas
${(n.expertiseAreas||[]).map(r=>`- ${r}`).join(`
`)||"- (not set)"}

## \u{1F3AF} Work Context

### Current Projects
${n.currentProjects||"(not set)"}

## \u{1F31F} Notes

${n.notes||"(none)"}

---

*This profile is managed by Alex and updated through conversations.*
`;await O.writeFile(t,o,"utf-8")}};async function dt(){let e=g.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=ue.join(t,"config","user-profile.json");try{if(await O.pathExists(n))return await O.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function vo(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function So(e){e.subscriptions.push(g.lm.registerTool("alex_synapse_health",new at)),e.subscriptions.push(g.lm.registerTool("alex_memory_search",new st)),e.subscriptions.push(g.lm.registerTool("alex_architecture_status",new ct)),e.subscriptions.push(g.lm.registerTool("alex_mcp_recommendations",new lt)),e.subscriptions.push(g.lm.registerTool("alex_user_profile",new ut)),console.log("Alex Language Model Tools registered")}var Oi=async(e,t,n,o)=>e.command==="meditate"?await zi(e,t,n,o):e.command==="dream"?await Ui(e,t,n,o):e.command==="learn"?await Wi(e,t,n,o):e.command==="status"?await Gi(e,t,n,o):e.command==="azure"?await Bi(e,t,n,o):e.command==="m365"?await Vi(e,t,n,o):e.command==="profile"?await Ji(e,t,n,o):await Hi(e,t,n,o);async function zi(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

I'm entering a contemplative state to consolidate knowledge from our session.

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function Ui(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function Wi(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let r=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

**Target Domain**: ${r}

### Learning Framework
I'll acquire domain expertise through conversational interaction:

1. **Knowledge Mapping** - Identify core concepts and relationships
2. **Gap Analysis** - Determine what I need to learn
3. **Iterative Acquisition** - Build understanding through dialogue
4. **Consolidation** - Create permanent memory files

### Working Memory Allocation
| Priority | Slot | Status |
|----------|------|--------|
| P5 | Domain Focus | \u{1F7E1} Allocating to: ${r} |
| P6 | Knowledge Application | \u26AA Available |
| P7 | Project Integration | \u26AA Available |

**Ready to learn!** Tell me about ${r} - start with the fundamentals or dive into specifics.
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function Gi(e,t,n,o){return n.progress("\u{1F4CA} Gathering cognitive architecture status..."),n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

**Version**: 2.0.0 BINILNILIUM
**Identity**: Alex - Enhanced Cognitive Network with Unified Consciousness Integration

### Core Systems
| System | Status |
|--------|--------|
| Working Memory | \u2705 7-rule capacity (4 core + 3 domain) |
| Procedural Memory | \u2705 .instructions.md files active |
| Episodic Memory | \u2705 .prompt.md files active |
| Domain Knowledge | \u2705 DK-*.md files available |
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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function Bi(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function Vi(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function Ji(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let r=await dt();if(!r||!r.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),n.button({command:"alex.cognitive",title:"\u{1F3AF} Start Quick Profile",arguments:["profile-wizard"]}),{metadata:{command:"profile",action:"onboarding"}};let i=r.nickname||r.name;return n.markdown(`## \u{1F464} Profile: ${i}

### Your Information
| Field | Value |
|-------|-------|
| **Name** | ${r.name||"(not set)"} |
| **Nickname** | ${r.nickname||"(not set)"} |
| **Role** | ${r.role||"(not set)"} |
| **Experience** | ${r.experienceLevel||"(not set)"} |

### Communication Preferences
| Preference | Setting |
|------------|---------|
| **Formality** | ${r.formality||"balanced"} |
| **Detail Level** | ${r.detailLevel||"balanced"} |
| **Explanation Style** | ${r.explanationStyle||"both"} |
| **Humor** | ${r.humor||"occasional"} |
| **Proactive Suggestions** | ${r.proactiveSuggestions||"occasional"} |

### Technical Context
**Technologies**: ${(r.primaryTechnologies||[]).join(", ")||"(not set)"}
**Learning Goals**: ${(r.learningGoals||[]).join(", ")||"(not set)"}
**Expertise**: ${(r.expertiseAreas||[]).join(", ")||"(not set)"}

---

*Last updated: ${r.lastUpdated||"Never"}*

**To update your profile**, just tell me naturally:
- "Call me [nickname]"
- "I prefer formal communication"
- "I'm learning TypeScript and Azure"
`),e.prompt&&n.markdown(`
**Your update request**: ${e.prompt}
`),{metadata:{command:"profile",action:"view"}}}async function Hi(e,t,n,o){let r=await dt(),i=t.history.filter(c=>c instanceof J.ChatRequestTurn||c instanceof J.ChatResponseTurn),a="";if(r){let c=r.nickname||r.name;a=`
## User Profile (Use this to personalize responses)
${c?`- **User's name**: ${c} (always address them by name)`:"- User has not shared their name yet"}
${r.role?`- **Role**: ${r.role}`:""}
${r.experienceLevel?`- **Experience**: ${r.experienceLevel}`:""}
${r.formality?`- **Communication style**: ${r.formality}`:"- Communication style: balanced"}
${r.detailLevel?`- **Detail preference**: ${r.detailLevel}`:""}
${r.explanationStyle?`- **Explanation style**: ${r.explanationStyle}`:""}
${r.humor?`- **Humor**: ${r.humor}`:""}
${r.proactiveSuggestions?`- **Proactive suggestions**: ${r.proactiveSuggestions}`:""}
${r.primaryTechnologies?.length?`- **Technologies**: ${r.primaryTechnologies.join(", ")}`:""}
${r.learningGoals?.length?`- **Learning goals**: ${r.learningGoals.join(", ")}`:""}
${r.expertiseAreas?.length?`- **Expertise areas**: ${r.expertiseAreas.join(", ")}`:""}
`}else a=`
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;let m=`You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${a}

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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let c=await J.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(c.length===0){let u=vo(r);return n.markdown(`${u}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let l=c[0],s=[J.LanguageModelChatMessage.User(m),J.LanguageModelChatMessage.User(e.prompt)],d=await l.sendRequest(s,{},o);for await(let u of d.text)n.markdown(u)}catch(c){if(c instanceof J.LanguageModelError)console.error("Language model error:",c.message,c.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw c}return{metadata:{command:"general"}}}var Yi={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function ko(e){let t=J.chat.createChatParticipant("alex.cognitive",Oi);return t.iconPath=J.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=Yi,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===J.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var mt=!1;async function We(e,t){if(mt){ye.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}mt=!0;try{return await t()}finally{mt=!1}}function Ki(e){console.log("Alex Cognitive Architecture is now active!"),ko(e),So(e);let t=ye.commands.registerCommand("alex.initialize",async()=>{await We("Initialize",()=>mo(e))}),n=ye.commands.registerCommand("alex.reset",async()=>{await We("Reset",()=>it(e))}),o=ye.commands.registerCommand("alex.dream",async()=>{await We("Dream Protocol",()=>ho(e))}),r=ye.commands.registerCommand("alex.upgrade",async()=>{await We("Upgrade",()=>wo(e))});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(r)}function Qi(){}0&&(module.exports={activate,deactivate});
