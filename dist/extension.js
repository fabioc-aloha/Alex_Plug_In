"use strict";var Ta=Object.create;var ft=Object.defineProperty;var Ia=Object.getOwnPropertyDescriptor;var Ea=Object.getOwnPropertyNames;var $a=Object.getPrototypeOf,Fa=Object.prototype.hasOwnProperty;var C=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Aa=(e,t)=>{for(var n in t)ft(e,n,{get:t[n],enumerable:!0})},Rn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ea(t))!Fa.call(e,i)&&i!==n&&ft(e,i,{get:()=>t[i],enumerable:!(o=Ia(t,i))||o.enumerable});return e};var L=(e,t,n)=>(n=e!=null?Ta($a(e)):{},Rn(t||!e||!e.__esModule?ft(n,"default",{value:e,enumerable:!0}):n,e)),Ra=e=>Rn(ft({},"__esModule",{value:!0}),e);var Z=C(Ot=>{"use strict";Ot.fromCallback=function(e){return Object.defineProperty(function(...t){if(typeof t[t.length-1]=="function")e.apply(this,t);else return new Promise((n,o)=>{t.push((i,a)=>i!=null?o(i):n(a)),e.apply(this,t)})},"name",{value:e.name})};Ot.fromPromise=function(e){return Object.defineProperty(function(...t){let n=t[t.length-1];if(typeof n!="function")return e.apply(this,t);t.pop(),e.apply(this,t).then(o=>n(null,o),n)},"name",{value:e.name})}});var Ln=C((Hc,Mn)=>{var Ee=require("constants"),Ma=process.cwd,gt=null,La=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return gt||(gt=Ma.call(process)),gt};try{process.cwd()}catch{}typeof process.chdir=="function"&&(_t=process.chdir,process.chdir=function(e){gt=null,_t.call(process,e)},Object.setPrototypeOf&&Object.setPrototypeOf(process.chdir,_t));var _t;Mn.exports=Da;function Da(e){Ee.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&t(e),e.lutimes||n(e),e.chown=a(e.chown),e.fchown=a(e.fchown),e.lchown=a(e.lchown),e.chmod=o(e.chmod),e.fchmod=o(e.fchmod),e.lchmod=o(e.lchmod),e.chownSync=s(e.chownSync),e.fchownSync=s(e.fchownSync),e.lchownSync=s(e.lchownSync),e.chmodSync=i(e.chmodSync),e.fchmodSync=i(e.fchmodSync),e.lchmodSync=i(e.lchmodSync),e.stat=r(e.stat),e.fstat=r(e.fstat),e.lstat=r(e.lstat),e.statSync=c(e.statSync),e.fstatSync=c(e.fstatSync),e.lstatSync=c(e.lstatSync),e.chmod&&!e.lchmod&&(e.lchmod=function(u,d,m){m&&process.nextTick(m)},e.lchmodSync=function(){}),e.chown&&!e.lchown&&(e.lchown=function(u,d,m,p){p&&process.nextTick(p)},e.lchownSync=function(){}),La==="win32"&&(e.rename=typeof e.rename!="function"?e.rename:(function(u){function d(m,p,y){var P=Date.now(),S=0;u(m,p,function w(I){if(I&&(I.code==="EACCES"||I.code==="EPERM"||I.code==="EBUSY")&&Date.now()-P<6e4){setTimeout(function(){e.stat(p,function(E,O){E&&E.code==="ENOENT"?u(m,p,w):y(I)})},S),S<100&&(S+=10);return}y&&y(I)})}return Object.setPrototypeOf&&Object.setPrototypeOf(d,u),d})(e.rename)),e.read=typeof e.read!="function"?e.read:(function(u){function d(m,p,y,P,S,w){var I;if(w&&typeof w=="function"){var E=0;I=function(O,W,X){if(O&&O.code==="EAGAIN"&&E<10)return E++,u.call(e,m,p,y,P,S,I);w.apply(this,arguments)}}return u.call(e,m,p,y,P,S,I)}return Object.setPrototypeOf&&Object.setPrototypeOf(d,u),d})(e.read),e.readSync=typeof e.readSync!="function"?e.readSync:(function(u){return function(d,m,p,y,P){for(var S=0;;)try{return u.call(e,d,m,p,y,P)}catch(w){if(w.code==="EAGAIN"&&S<10){S++;continue}throw w}}})(e.readSync);function t(u){u.lchmod=function(d,m,p){u.open(d,Ee.O_WRONLY|Ee.O_SYMLINK,m,function(y,P){if(y){p&&p(y);return}u.fchmod(P,m,function(S){u.close(P,function(w){p&&p(S||w)})})})},u.lchmodSync=function(d,m){var p=u.openSync(d,Ee.O_WRONLY|Ee.O_SYMLINK,m),y=!0,P;try{P=u.fchmodSync(p,m),y=!1}finally{if(y)try{u.closeSync(p)}catch{}else u.closeSync(p)}return P}}function n(u){Ee.hasOwnProperty("O_SYMLINK")&&u.futimes?(u.lutimes=function(d,m,p,y){u.open(d,Ee.O_SYMLINK,function(P,S){if(P){y&&y(P);return}u.futimes(S,m,p,function(w){u.close(S,function(I){y&&y(w||I)})})})},u.lutimesSync=function(d,m,p){var y=u.openSync(d,Ee.O_SYMLINK),P,S=!0;try{P=u.futimesSync(y,m,p),S=!1}finally{if(S)try{u.closeSync(y)}catch{}else u.closeSync(y)}return P}):u.futimes&&(u.lutimes=function(d,m,p,y){y&&process.nextTick(y)},u.lutimesSync=function(){})}function o(u){return u&&function(d,m,p){return u.call(e,d,m,function(y){l(y)&&(y=null),p&&p.apply(this,arguments)})}}function i(u){return u&&function(d,m){try{return u.call(e,d,m)}catch(p){if(!l(p))throw p}}}function a(u){return u&&function(d,m,p,y){return u.call(e,d,m,p,function(P){l(P)&&(P=null),y&&y.apply(this,arguments)})}}function s(u){return u&&function(d,m,p){try{return u.call(e,d,m,p)}catch(y){if(!l(y))throw y}}}function r(u){return u&&function(d,m,p){typeof m=="function"&&(p=m,m=null);function y(P,S){S&&(S.uid<0&&(S.uid+=4294967296),S.gid<0&&(S.gid+=4294967296)),p&&p.apply(this,arguments)}return m?u.call(e,d,m,y):u.call(e,d,y)}}function c(u){return u&&function(d,m){var p=m?u.call(e,d,m):u.call(e,d);return p&&(p.uid<0&&(p.uid+=4294967296),p.gid<0&&(p.gid+=4294967296)),p}}function l(u){if(!u||u.code==="ENOSYS")return!0;var d=!process.getuid||process.getuid()!==0;return!!(d&&(u.code==="EINVAL"||u.code==="EPERM"))}}});var On=C((Wc,Nn)=>{var Dn=require("stream").Stream;Nn.exports=Na;function Na(e){return{ReadStream:t,WriteStream:n};function t(o,i){if(!(this instanceof t))return new t(o,i);Dn.call(this);var a=this;this.path=o,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=64*1024,i=i||{};for(var s=Object.keys(i),r=0,c=s.length;r<c;r++){var l=s[r];this[l]=i[l]}if(this.encoding&&this.setEncoding(this.encoding),this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.end===void 0)this.end=1/0;else if(typeof this.end!="number")throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(this.fd!==null){process.nextTick(function(){a._read()});return}e.open(this.path,this.flags,this.mode,function(u,d){if(u){a.emit("error",u),a.readable=!1;return}a.fd=d,a.emit("open",d),a._read()})}function n(o,i){if(!(this instanceof n))return new n(o,i);Dn.call(this),this.path=o,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,i=i||{};for(var a=Object.keys(i),s=0,r=a.length;s<r;s++){var c=a[s];this[c]=i[c]}if(this.start!==void 0){if(typeof this.start!="number")throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],this.fd===null&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}});var jn=C((Vc,_n)=>{"use strict";_n.exports=_a;var Oa=Object.getPrototypeOf||function(e){return e.__proto__};function _a(e){if(e===null||typeof e!="object")return e;if(e instanceof Object)var t={__proto__:Oa(e)};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}});var $e=C((Bc,zt)=>{var U=require("fs"),ja=Ln(),Ga=On(),za=jn(),ht=require("util"),ie,yt;typeof Symbol=="function"&&typeof Symbol.for=="function"?(ie=Symbol.for("graceful-fs.queue"),yt=Symbol.for("graceful-fs.previous")):(ie="___graceful-fs.queue",yt="___graceful-fs.previous");function Ua(){}function Un(e,t){Object.defineProperty(e,ie,{get:function(){return t}})}var Le=Ua;ht.debuglog?Le=ht.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(Le=function(){var e=ht.format.apply(ht,arguments);e="GFS4: "+e.split(/\n/).join(`
GFS4: `),console.error(e)});U[ie]||(Gn=global[ie]||[],Un(U,Gn),U.close=(function(e){function t(n,o){return e.call(U,n,function(i){i||zn(),typeof o=="function"&&o.apply(this,arguments)})}return Object.defineProperty(t,yt,{value:e}),t})(U.close),U.closeSync=(function(e){function t(n){e.apply(U,arguments),zn()}return Object.defineProperty(t,yt,{value:e}),t})(U.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",function(){Le(U[ie]),require("assert").equal(U[ie].length,0)}));var Gn;global[ie]||Un(global,U[ie]);zt.exports=jt(za(U));process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!U.__patched&&(zt.exports=jt(U),U.__patched=!0);function jt(e){ja(e),e.gracefulify=jt,e.createReadStream=W,e.createWriteStream=X;var t=e.readFile;e.readFile=n;function n(v,F,T){return typeof F=="function"&&(T=F,F=null),z(v,F,T);function z(Y,B,x,h){return t(Y,B,function(b){b&&(b.code==="EMFILE"||b.code==="ENFILE")?Ge([z,[Y,B,x],b,h||Date.now(),Date.now()]):typeof x=="function"&&x.apply(this,arguments)})}}var o=e.writeFile;e.writeFile=i;function i(v,F,T,z){return typeof T=="function"&&(z=T,T=null),Y(v,F,T,z);function Y(B,x,h,b,$){return o(B,x,h,function(A){A&&(A.code==="EMFILE"||A.code==="ENFILE")?Ge([Y,[B,x,h,b],A,$||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var a=e.appendFile;a&&(e.appendFile=s);function s(v,F,T,z){return typeof T=="function"&&(z=T,T=null),Y(v,F,T,z);function Y(B,x,h,b,$){return a(B,x,h,function(A){A&&(A.code==="EMFILE"||A.code==="ENFILE")?Ge([Y,[B,x,h,b],A,$||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var r=e.copyFile;r&&(e.copyFile=c);function c(v,F,T,z){return typeof T=="function"&&(z=T,T=0),Y(v,F,T,z);function Y(B,x,h,b,$){return r(B,x,h,function(A){A&&(A.code==="EMFILE"||A.code==="ENFILE")?Ge([Y,[B,x,h,b],A,$||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}var l=e.readdir;e.readdir=d;var u=/^v[0-5]\./;function d(v,F,T){typeof F=="function"&&(T=F,F=null);var z=u.test(process.version)?function(x,h,b,$){return l(x,Y(x,h,b,$))}:function(x,h,b,$){return l(x,h,Y(x,h,b,$))};return z(v,F,T);function Y(B,x,h,b){return function($,A){$&&($.code==="EMFILE"||$.code==="ENFILE")?Ge([z,[B,x,h],$,b||Date.now(),Date.now()]):(A&&A.sort&&A.sort(),typeof h=="function"&&h.call(this,$,A))}}}if(process.version.substr(0,4)==="v0.8"){var m=Ga(e);w=m.ReadStream,E=m.WriteStream}var p=e.ReadStream;p&&(w.prototype=Object.create(p.prototype),w.prototype.open=I);var y=e.WriteStream;y&&(E.prototype=Object.create(y.prototype),E.prototype.open=O),Object.defineProperty(e,"ReadStream",{get:function(){return w},set:function(v){w=v},enumerable:!0,configurable:!0}),Object.defineProperty(e,"WriteStream",{get:function(){return E},set:function(v){E=v},enumerable:!0,configurable:!0});var P=w;Object.defineProperty(e,"FileReadStream",{get:function(){return P},set:function(v){P=v},enumerable:!0,configurable:!0});var S=E;Object.defineProperty(e,"FileWriteStream",{get:function(){return S},set:function(v){S=v},enumerable:!0,configurable:!0});function w(v,F){return this instanceof w?(p.apply(this,arguments),this):w.apply(Object.create(w.prototype),arguments)}function I(){var v=this;oe(v.path,v.flags,v.mode,function(F,T){F?(v.autoClose&&v.destroy(),v.emit("error",F)):(v.fd=T,v.emit("open",T),v.read())})}function E(v,F){return this instanceof E?(y.apply(this,arguments),this):E.apply(Object.create(E.prototype),arguments)}function O(){var v=this;oe(v.path,v.flags,v.mode,function(F,T){F?(v.destroy(),v.emit("error",F)):(v.fd=T,v.emit("open",T))})}function W(v,F){return new e.ReadStream(v,F)}function X(v,F){return new e.WriteStream(v,F)}var J=e.open;e.open=oe;function oe(v,F,T,z){return typeof T=="function"&&(z=T,T=null),Y(v,F,T,z);function Y(B,x,h,b,$){return J(B,x,h,function(A,ke){A&&(A.code==="EMFILE"||A.code==="ENFILE")?Ge([Y,[B,x,h,b],A,$||Date.now(),Date.now()]):typeof b=="function"&&b.apply(this,arguments)})}}return e}function Ge(e){Le("ENQUEUE",e[0].name,e[1]),U[ie].push(e),Gt()}var wt;function zn(){for(var e=Date.now(),t=0;t<U[ie].length;++t)U[ie][t].length>2&&(U[ie][t][3]=e,U[ie][t][4]=e);Gt()}function Gt(){if(clearTimeout(wt),wt=void 0,U[ie].length!==0){var e=U[ie].shift(),t=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(i===void 0)Le("RETRY",t.name,n),t.apply(null,n);else if(Date.now()-i>=6e4){Le("TIMEOUT",t.name,n);var s=n.pop();typeof s=="function"&&s.call(null,o)}else{var r=Date.now()-a,c=Math.max(a-i,1),l=Math.min(c*1.2,100);r>=l?(Le("RETRY",t.name,n),t.apply(null,n.concat([i]))):U[ie].push(e)}wt===void 0&&(wt=setTimeout(Gt,0))}}});var re=C(be=>{"use strict";var qn=Z().fromCallback,se=$e(),qa=["access","appendFile","chmod","chown","close","copyFile","cp","fchmod","fchown","fdatasync","fstat","fsync","ftruncate","futimes","glob","lchmod","lchown","lutimes","link","lstat","mkdir","mkdtemp","open","opendir","readdir","readFile","readlink","realpath","rename","rm","rmdir","stat","statfs","symlink","truncate","unlink","utimes","writeFile"].filter(e=>typeof se[e]=="function");Object.assign(be,se);qa.forEach(e=>{be[e]=qn(se[e])});be.exists=function(e,t){return typeof t=="function"?se.exists(e,t):new Promise(n=>se.exists(e,n))};be.read=function(e,t,n,o,i,a){return typeof a=="function"?se.read(e,t,n,o,i,a):new Promise((s,r)=>{se.read(e,t,n,o,i,(c,l,u)=>{if(c)return r(c);s({bytesRead:l,buffer:u})})})};be.write=function(e,t,...n){return typeof n[n.length-1]=="function"?se.write(e,t,...n):new Promise((o,i)=>{se.write(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffer:r})})})};be.readv=function(e,t,...n){return typeof n[n.length-1]=="function"?se.readv(e,t,...n):new Promise((o,i)=>{se.readv(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesRead:s,buffers:r})})})};be.writev=function(e,t,...n){return typeof n[n.length-1]=="function"?se.writev(e,t,...n):new Promise((o,i)=>{se.writev(e,t,...n,(a,s,r)=>{if(a)return i(a);o({bytesWritten:s,buffers:r})})})};typeof se.realpath.native=="function"?be.realpath.native=qn(se.realpath.native):process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?","Warning","fs-extra-WARN0003")});var Hn=C((Yc,Kn)=>{"use strict";var Ka=require("path");Kn.exports.checkPath=function(t){if(process.platform==="win32"&&/[<>:"|?*]/.test(t.replace(Ka.parse(t).root,""))){let o=new Error(`Path contains invalid characters: ${t}`);throw o.code="EINVAL",o}}});var Jn=C((Xc,Ut)=>{"use strict";var Wn=re(),{checkPath:Vn}=Hn(),Bn=e=>{let t={mode:511};return typeof e=="number"?e:{...t,...e}.mode};Ut.exports.makeDir=async(e,t)=>(Vn(e),Wn.mkdir(e,{mode:Bn(t),recursive:!0}));Ut.exports.makeDirSync=(e,t)=>(Vn(e),Wn.mkdirSync(e,{mode:Bn(t),recursive:!0}))});var ge=C((Qc,Yn)=>{"use strict";var Ha=Z().fromPromise,{makeDir:Wa,makeDirSync:qt}=Jn(),Kt=Ha(Wa);Yn.exports={mkdirs:Kt,mkdirsSync:qt,mkdirp:Kt,mkdirpSync:qt,ensureDir:Kt,ensureDirSync:qt}});var Fe=C((Zc,Qn)=>{"use strict";var Va=Z().fromPromise,Xn=re();function Ba(e){return Xn.access(e).then(()=>!0).catch(()=>!1)}Qn.exports={pathExists:Va(Ba),pathExistsSync:Xn.existsSync}});var Ht=C((el,Zn)=>{"use strict";var ze=re(),Ja=Z().fromPromise;async function Ya(e,t,n){let o=await ze.open(e,"r+"),i=null;try{await ze.futimes(o,t,n)}finally{try{await ze.close(o)}catch(a){i=a}}if(i)throw i}function Xa(e,t,n){let o=ze.openSync(e,"r+");return ze.futimesSync(o,t,n),ze.closeSync(o)}Zn.exports={utimesMillis:Ja(Ya),utimesMillisSync:Xa}});var De=C((tl,oo)=>{"use strict";var Ue=re(),ee=require("path"),eo=Z().fromPromise;function Qa(e,t,n){let o=n.dereference?i=>Ue.stat(i,{bigint:!0}):i=>Ue.lstat(i,{bigint:!0});return Promise.all([o(e),o(t).catch(i=>{if(i.code==="ENOENT")return null;throw i})]).then(([i,a])=>({srcStat:i,destStat:a}))}function Za(e,t,n){let o,i=n.dereference?s=>Ue.statSync(s,{bigint:!0}):s=>Ue.lstatSync(s,{bigint:!0}),a=i(e);try{o=i(t)}catch(s){if(s.code==="ENOENT")return{srcStat:a,destStat:null};throw s}return{srcStat:a,destStat:o}}async function es(e,t,n,o){let{srcStat:i,destStat:a}=await Qa(e,t,o);if(a){if(Xe(i,a)){let s=ee.basename(e),r=ee.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Wt(e,t))throw new Error(vt(e,t,n));return{srcStat:i,destStat:a}}function ts(e,t,n,o){let{srcStat:i,destStat:a}=Za(e,t,o);if(a){if(Xe(i,a)){let s=ee.basename(e),r=ee.basename(t);if(n==="move"&&s!==r&&s.toLowerCase()===r.toLowerCase())return{srcStat:i,destStat:a,isChangingCase:!0};throw new Error("Source and destination must not be the same.")}if(i.isDirectory()&&!a.isDirectory())throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);if(!i.isDirectory()&&a.isDirectory())throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)}if(i.isDirectory()&&Wt(e,t))throw new Error(vt(e,t,n));return{srcStat:i,destStat:a}}async function to(e,t,n,o){let i=ee.resolve(ee.dirname(e)),a=ee.resolve(ee.dirname(n));if(a===i||a===ee.parse(a).root)return;let s;try{s=await Ue.stat(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(Xe(t,s))throw new Error(vt(e,n,o));return to(e,t,a,o)}function no(e,t,n,o){let i=ee.resolve(ee.dirname(e)),a=ee.resolve(ee.dirname(n));if(a===i||a===ee.parse(a).root)return;let s;try{s=Ue.statSync(a,{bigint:!0})}catch(r){if(r.code==="ENOENT")return;throw r}if(Xe(t,s))throw new Error(vt(e,n,o));return no(e,t,a,o)}function Xe(e,t){return t.ino!==void 0&&t.dev!==void 0&&t.ino===e.ino&&t.dev===e.dev}function Wt(e,t){let n=ee.resolve(e).split(ee.sep).filter(i=>i),o=ee.resolve(t).split(ee.sep).filter(i=>i);return n.every((i,a)=>o[a]===i)}function vt(e,t,n){return`Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`}oo.exports={checkPaths:eo(es),checkPathsSync:ts,checkParentPaths:eo(to),checkParentPathsSync:no,isSrcSubdir:Wt,areIdentical:Xe}});var ao=C((nl,io)=>{"use strict";async function ns(e,t){let n=[];for await(let o of e)n.push(t(o).then(()=>null,i=>i??new Error("unknown error")));await Promise.all(n.map(o=>o.then(i=>{if(i!==null)throw i})))}io.exports={asyncIteratorConcurrentProcess:ns}});var uo=C((ol,lo)=>{"use strict";var ae=re(),Qe=require("path"),{mkdirs:os}=ge(),{pathExists:is}=Fe(),{utimesMillis:as}=Ht(),Ze=De(),{asyncIteratorConcurrentProcess:ss}=ao();async function rs(e,t,n={}){typeof n=="function"&&(n={filter:n}),n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0001");let{srcStat:o,destStat:i}=await Ze.checkPaths(e,t,"copy",n);if(await Ze.checkParentPaths(e,o,t,"copy"),!await ro(e,t,n))return;let s=Qe.dirname(t);await is(s)||await os(s),await co(i,e,t,n)}async function ro(e,t,n){return n.filter?n.filter(e,t):!0}async function co(e,t,n,o){let a=await(o.dereference?ae.stat:ae.lstat)(t);if(a.isDirectory())return ds(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return cs(a,e,t,n,o);if(a.isSymbolicLink())return ms(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}async function cs(e,t,n,o,i){if(!t)return so(e,n,o,i);if(i.overwrite)return await ae.unlink(o),so(e,n,o,i);if(i.errorOnExist)throw new Error(`'${o}' already exists`)}async function so(e,t,n,o){if(await ae.copyFile(t,n),o.preserveTimestamps){ls(e.mode)&&await us(n,e.mode);let i=await ae.stat(t);await as(n,i.atime,i.mtime)}return ae.chmod(n,e.mode)}function ls(e){return(e&128)===0}function us(e,t){return ae.chmod(e,t|128)}async function ds(e,t,n,o,i){t||await ae.mkdir(o),await ss(await ae.opendir(n),async a=>{let s=Qe.join(n,a.name),r=Qe.join(o,a.name);if(await ro(s,r,i)){let{destStat:l}=await Ze.checkPaths(s,r,"copy",i);await co(l,s,r,i)}}),t||await ae.chmod(o,e.mode)}async function ms(e,t,n,o){let i=await ae.readlink(t);if(o.dereference&&(i=Qe.resolve(process.cwd(),i)),!e)return ae.symlink(i,n);let a=null;try{a=await ae.readlink(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return ae.symlink(i,n);throw s}if(o.dereference&&(a=Qe.resolve(process.cwd(),a)),i!==a){if(Ze.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(Ze.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return await ae.unlink(n),ae.symlink(i,n)}lo.exports=rs});var ho=C((il,go)=>{"use strict";var ce=$e(),et=require("path"),ps=ge().mkdirsSync,fs=Ht().utimesMillisSync,tt=De();function gs(e,t,n){typeof n=="function"&&(n={filter:n}),n=n||{},n.clobber="clobber"in n?!!n.clobber:!0,n.overwrite="overwrite"in n?!!n.overwrite:n.clobber,n.preserveTimestamps&&process.arch==="ia32"&&process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,"Warning","fs-extra-WARN0002");let{srcStat:o,destStat:i}=tt.checkPathsSync(e,t,"copy",n);if(tt.checkParentPathsSync(e,o,t,"copy"),n.filter&&!n.filter(e,t))return;let a=et.dirname(t);return ce.existsSync(a)||ps(a),mo(i,e,t,n)}function mo(e,t,n,o){let a=(o.dereference?ce.statSync:ce.lstatSync)(t);if(a.isDirectory())return bs(a,e,t,n,o);if(a.isFile()||a.isCharacterDevice()||a.isBlockDevice())return hs(a,e,t,n,o);if(a.isSymbolicLink())return Cs(e,t,n,o);throw a.isSocket()?new Error(`Cannot copy a socket file: ${t}`):a.isFIFO()?new Error(`Cannot copy a FIFO pipe: ${t}`):new Error(`Unknown file: ${t}`)}function hs(e,t,n,o,i){return t?ws(e,n,o,i):po(e,n,o,i)}function ws(e,t,n,o){if(o.overwrite)return ce.unlinkSync(n),po(e,t,n,o);if(o.errorOnExist)throw new Error(`'${n}' already exists`)}function po(e,t,n,o){return ce.copyFileSync(t,n),o.preserveTimestamps&&ys(e.mode,t,n),Vt(n,e.mode)}function ys(e,t,n){return vs(e)&&Ss(n,e),ks(t,n)}function vs(e){return(e&128)===0}function Ss(e,t){return Vt(e,t|128)}function Vt(e,t){return ce.chmodSync(e,t)}function ks(e,t){let n=ce.statSync(e);return fs(t,n.atime,n.mtime)}function bs(e,t,n,o,i){return t?fo(n,o,i):xs(e.mode,n,o,i)}function xs(e,t,n,o){return ce.mkdirSync(n),fo(t,n,o),Vt(n,e)}function fo(e,t,n){let o=ce.opendirSync(e);try{let i;for(;(i=o.readSync())!==null;)Ps(i.name,e,t,n)}finally{o.closeSync()}}function Ps(e,t,n,o){let i=et.join(t,e),a=et.join(n,e);if(o.filter&&!o.filter(i,a))return;let{destStat:s}=tt.checkPathsSync(i,a,"copy",o);return mo(s,i,a,o)}function Cs(e,t,n,o){let i=ce.readlinkSync(t);if(o.dereference&&(i=et.resolve(process.cwd(),i)),e){let a;try{a=ce.readlinkSync(n)}catch(s){if(s.code==="EINVAL"||s.code==="UNKNOWN")return ce.symlinkSync(i,n);throw s}if(o.dereference&&(a=et.resolve(process.cwd(),a)),i!==a){if(tt.isSrcSubdir(i,a))throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);if(tt.isSrcSubdir(a,i))throw new Error(`Cannot overwrite '${a}' with '${i}'.`)}return Ts(i,n)}else return ce.symlinkSync(i,n)}function Ts(e,t){return ce.unlinkSync(t),ce.symlinkSync(e,t)}go.exports=gs});var St=C((al,wo)=>{"use strict";var Is=Z().fromPromise;wo.exports={copy:Is(uo()),copySync:ho()}});var nt=C((sl,vo)=>{"use strict";var yo=$e(),Es=Z().fromCallback;function $s(e,t){yo.rm(e,{recursive:!0,force:!0},t)}function Fs(e){yo.rmSync(e,{recursive:!0,force:!0})}vo.exports={remove:Es($s),removeSync:Fs}});var Io=C((rl,To)=>{"use strict";var As=Z().fromPromise,bo=re(),xo=require("path"),Po=ge(),Co=nt(),So=As(async function(t){let n;try{n=await bo.readdir(t)}catch{return Po.mkdirs(t)}return Promise.all(n.map(o=>Co.remove(xo.join(t,o))))});function ko(e){let t;try{t=bo.readdirSync(e)}catch{return Po.mkdirsSync(e)}t.forEach(n=>{n=xo.join(e,n),Co.removeSync(n)})}To.exports={emptyDirSync:ko,emptydirSync:ko,emptyDir:So,emptydir:So}});var Ao=C((cl,Fo)=>{"use strict";var Rs=Z().fromPromise,Eo=require("path"),xe=re(),$o=ge();async function Ms(e){let t;try{t=await xe.stat(e)}catch{}if(t&&t.isFile())return;let n=Eo.dirname(e),o=null;try{o=await xe.stat(n)}catch(i){if(i.code==="ENOENT"){await $o.mkdirs(n),await xe.writeFile(e,"");return}else throw i}o.isDirectory()?await xe.writeFile(e,""):await xe.readdir(n)}function Ls(e){let t;try{t=xe.statSync(e)}catch{}if(t&&t.isFile())return;let n=Eo.dirname(e);try{xe.statSync(n).isDirectory()||xe.readdirSync(n)}catch(o){if(o&&o.code==="ENOENT")$o.mkdirsSync(n);else throw o}xe.writeFileSync(e,"")}Fo.exports={createFile:Rs(Ms),createFileSync:Ls}});var No=C((ll,Do)=>{"use strict";var Ds=Z().fromPromise,Ro=require("path"),Ae=re(),Mo=ge(),{pathExists:Ns}=Fe(),{areIdentical:Lo}=De();async function Os(e,t){let n;try{n=await Ae.lstat(t)}catch{}let o;try{o=await Ae.lstat(e)}catch(s){throw s.message=s.message.replace("lstat","ensureLink"),s}if(n&&Lo(o,n))return;let i=Ro.dirname(t);await Ns(i)||await Mo.mkdirs(i),await Ae.link(e,t)}function _s(e,t){let n;try{n=Ae.lstatSync(t)}catch{}try{let a=Ae.lstatSync(e);if(n&&Lo(a,n))return}catch(a){throw a.message=a.message.replace("lstat","ensureLink"),a}let o=Ro.dirname(t);return Ae.existsSync(o)||Mo.mkdirsSync(o),Ae.linkSync(e,t)}Do.exports={createLink:Ds(Os),createLinkSync:_s}});var _o=C((ul,Oo)=>{"use strict";var Re=require("path"),ot=re(),{pathExists:js}=Fe(),Gs=Z().fromPromise;async function zs(e,t){if(Re.isAbsolute(e)){try{await ot.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:e}}let n=Re.dirname(t),o=Re.join(n,e);if(await js(o))return{toCwd:o,toDst:e};try{await ot.lstat(e)}catch(a){throw a.message=a.message.replace("lstat","ensureSymlink"),a}return{toCwd:e,toDst:Re.relative(n,e)}}function Us(e,t){if(Re.isAbsolute(e)){if(!ot.existsSync(e))throw new Error("absolute srcpath does not exist");return{toCwd:e,toDst:e}}let n=Re.dirname(t),o=Re.join(n,e);if(ot.existsSync(o))return{toCwd:o,toDst:e};if(!ot.existsSync(e))throw new Error("relative srcpath does not exist");return{toCwd:e,toDst:Re.relative(n,e)}}Oo.exports={symlinkPaths:Gs(zs),symlinkPathsSync:Us}});var zo=C((dl,Go)=>{"use strict";var jo=re(),qs=Z().fromPromise;async function Ks(e,t){if(t)return t;let n;try{n=await jo.lstat(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}function Hs(e,t){if(t)return t;let n;try{n=jo.lstatSync(e)}catch{return"file"}return n&&n.isDirectory()?"dir":"file"}Go.exports={symlinkType:qs(Ks),symlinkTypeSync:Hs}});var Ho=C((ml,Ko)=>{"use strict";var Ws=Z().fromPromise,Uo=require("path"),ye=re(),{mkdirs:Vs,mkdirsSync:Bs}=ge(),{symlinkPaths:Js,symlinkPathsSync:Ys}=_o(),{symlinkType:Xs,symlinkTypeSync:Qs}=zo(),{pathExists:Zs}=Fe(),{areIdentical:qo}=De();async function er(e,t,n){let o;try{o=await ye.lstat(t)}catch{}if(o&&o.isSymbolicLink()){let[r,c]=await Promise.all([ye.stat(e),ye.stat(t)]);if(qo(r,c))return}let i=await Js(e,t);e=i.toDst;let a=await Xs(i.toCwd,n),s=Uo.dirname(t);return await Zs(s)||await Vs(s),ye.symlink(e,t,a)}function tr(e,t,n){let o;try{o=ye.lstatSync(t)}catch{}if(o&&o.isSymbolicLink()){let r=ye.statSync(e),c=ye.statSync(t);if(qo(r,c))return}let i=Ys(e,t);e=i.toDst,n=Qs(i.toCwd,n);let a=Uo.dirname(t);return ye.existsSync(a)||Bs(a),ye.symlinkSync(e,t,n)}Ko.exports={createSymlink:Ws(er),createSymlinkSync:tr}});var Zo=C((pl,Qo)=>{"use strict";var{createFile:Wo,createFileSync:Vo}=Ao(),{createLink:Bo,createLinkSync:Jo}=No(),{createSymlink:Yo,createSymlinkSync:Xo}=Ho();Qo.exports={createFile:Wo,createFileSync:Vo,ensureFile:Wo,ensureFileSync:Vo,createLink:Bo,createLinkSync:Jo,ensureLink:Bo,ensureLinkSync:Jo,createSymlink:Yo,createSymlinkSync:Xo,ensureSymlink:Yo,ensureSymlinkSync:Xo}});var kt=C((fl,ei)=>{function nr(e,{EOL:t=`
`,finalEOL:n=!0,replacer:o=null,spaces:i}={}){let a=n?t:"";return JSON.stringify(e,o,i).replace(/\n/g,t)+a}function or(e){return Buffer.isBuffer(e)&&(e=e.toString("utf8")),e.replace(/^\uFEFF/,"")}ei.exports={stringify:nr,stripBom:or}});var ii=C((gl,oi)=>{var qe;try{qe=$e()}catch{qe=require("fs")}var bt=Z(),{stringify:ti,stripBom:ni}=kt();async function ir(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||qe,o="throws"in t?t.throws:!0,i=await bt.fromCallback(n.readFile)(e,t);i=ni(i);let a;try{a=JSON.parse(i,t?t.reviver:null)}catch(s){if(o)throw s.message=`${e}: ${s.message}`,s;return null}return a}var ar=bt.fromPromise(ir);function sr(e,t={}){typeof t=="string"&&(t={encoding:t});let n=t.fs||qe,o="throws"in t?t.throws:!0;try{let i=n.readFileSync(e,t);return i=ni(i),JSON.parse(i,t.reviver)}catch(i){if(o)throw i.message=`${e}: ${i.message}`,i;return null}}async function rr(e,t,n={}){let o=n.fs||qe,i=ti(t,n);await bt.fromCallback(o.writeFile)(e,i,n)}var cr=bt.fromPromise(rr);function lr(e,t,n={}){let o=n.fs||qe,i=ti(t,n);return o.writeFileSync(e,i,n)}oi.exports={readFile:ar,readFileSync:sr,writeFile:cr,writeFileSync:lr}});var si=C((hl,ai)=>{"use strict";var xt=ii();ai.exports={readJson:xt.readFile,readJsonSync:xt.readFileSync,writeJson:xt.writeFile,writeJsonSync:xt.writeFileSync}});var Pt=C((wl,li)=>{"use strict";var ur=Z().fromPromise,Bt=re(),ri=require("path"),ci=ge(),dr=Fe().pathExists;async function mr(e,t,n="utf-8"){let o=ri.dirname(e);return await dr(o)||await ci.mkdirs(o),Bt.writeFile(e,t,n)}function pr(e,...t){let n=ri.dirname(e);Bt.existsSync(n)||ci.mkdirsSync(n),Bt.writeFileSync(e,...t)}li.exports={outputFile:ur(mr),outputFileSync:pr}});var di=C((yl,ui)=>{"use strict";var{stringify:fr}=kt(),{outputFile:gr}=Pt();async function hr(e,t,n={}){let o=fr(t,n);await gr(e,o,n)}ui.exports=hr});var pi=C((vl,mi)=>{"use strict";var{stringify:wr}=kt(),{outputFileSync:yr}=Pt();function vr(e,t,n){let o=wr(t,n);yr(e,o,n)}mi.exports=vr});var gi=C((Sl,fi)=>{"use strict";var Sr=Z().fromPromise,le=si();le.outputJson=Sr(di());le.outputJsonSync=pi();le.outputJSON=le.outputJson;le.outputJSONSync=le.outputJsonSync;le.writeJSON=le.writeJson;le.writeJSONSync=le.writeJsonSync;le.readJSON=le.readJson;le.readJSONSync=le.readJsonSync;fi.exports=le});var Si=C((kl,vi)=>{"use strict";var kr=re(),hi=require("path"),{copy:br}=St(),{remove:yi}=nt(),{mkdirp:xr}=ge(),{pathExists:Pr}=Fe(),wi=De();async function Cr(e,t,n={}){let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=await wi.checkPaths(e,t,"move",n);await wi.checkParentPaths(e,i,t,"move");let s=hi.dirname(t);return hi.parse(s).root!==s&&await xr(s),Tr(e,t,o,a)}async function Tr(e,t,n,o){if(!o){if(n)await yi(t);else if(await Pr(t))throw new Error("dest already exists.")}try{await kr.rename(e,t)}catch(i){if(i.code!=="EXDEV")throw i;await Ir(e,t,n)}}async function Ir(e,t,n){return await br(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),yi(e)}vi.exports=Cr});var Ci=C((bl,Pi)=>{"use strict";var bi=$e(),Yt=require("path"),Er=St().copySync,xi=nt().removeSync,$r=ge().mkdirpSync,ki=De();function Fr(e,t,n){n=n||{};let o=n.overwrite||n.clobber||!1,{srcStat:i,isChangingCase:a=!1}=ki.checkPathsSync(e,t,"move",n);return ki.checkParentPathsSync(e,i,t,"move"),Ar(t)||$r(Yt.dirname(t)),Rr(e,t,o,a)}function Ar(e){let t=Yt.dirname(e);return Yt.parse(t).root===t}function Rr(e,t,n,o){if(o)return Jt(e,t,n);if(n)return xi(t),Jt(e,t,n);if(bi.existsSync(t))throw new Error("dest already exists.");return Jt(e,t,n)}function Jt(e,t,n){try{bi.renameSync(e,t)}catch(o){if(o.code!=="EXDEV")throw o;return Mr(e,t,n)}}function Mr(e,t,n){return Er(e,t,{overwrite:n,errorOnExist:!0,preserveTimestamps:!0}),xi(e)}Pi.exports=Fr});var Ii=C((xl,Ti)=>{"use strict";var Lr=Z().fromPromise;Ti.exports={move:Lr(Si()),moveSync:Ci()}});var Pe=C((Pl,Ei)=>{"use strict";Ei.exports={...re(),...St(),...Io(),...Zo(),...gi(),...ge(),...Ii(),...Pt(),...Fe(),...nt()}});var qi=C((Nl,Ui)=>{function fe(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}Ui.exports=fe;fe.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts};fe.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null};fe.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var n=this._timeouts.shift();if(n===void 0)if(this._cachedTimeouts)this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),n=this._timeouts.shift();else return!1;var o=this,i=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},n);return this._options.unref&&i.unref(),!0};fe.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var n=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){n._operationTimeoutCb()},n._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};fe.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)};fe.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)};fe.prototype.start=fe.prototype.try;fe.prototype.errors=function(){return this._errors};fe.prototype.attempts=function(){return this._attempts};fe.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,n=0,o=0;o<this._errors.length;o++){var i=this._errors[o],a=i.message,s=(e[a]||0)+1;e[a]=s,s>=n&&(t=i,n=s)}return t}});var Ki=C(Ne=>{var Br=qi();Ne.operation=function(e){var t=Ne.timeouts(e);return new Br(t,{forever:e&&e.forever,unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})};Ne.timeouts=function(e){if(e instanceof Array)return[].concat(e);var t={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var n in e)t[n]=e[n];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<t.retries;i++)o.push(this.createTimeout(i,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(i,t)),o.sort(function(a,s){return a-s}),o};Ne.createTimeout=function(e,t){var n=t.randomize?Math.random()+1:1,o=Math.round(n*t.minTimeout*Math.pow(t.factor,e));return o=Math.min(o,t.maxTimeout),o};Ne.wrap=function(e,t,n){if(t instanceof Array&&(n=t,t=null),!n){n=[];for(var o in e)typeof e[o]=="function"&&n.push(o)}for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(c){var l=Ne.operation(t),u=Array.prototype.slice.call(arguments,1),d=u.pop();u.push(function(m){l.retry(m)||(m&&(arguments[0]=l.mainError()),d.apply(this,arguments))}),l.attempt(function(){c.apply(e,u)})}.bind(e,s),e[a].options=t}}});var Wi=C((_l,Hi)=>{Hi.exports=Ki()});var Vi=C((jl,It)=>{It.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&It.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&It.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var Qi=C((Gl,We)=>{var j=global.process,Oe=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};Oe(j)?(Bi=require("assert"),Ke=Vi(),Ji=/^win/i.test(j.platform),st=require("events"),typeof st!="function"&&(st=st.EventEmitter),j.__signal_exit_emitter__?te=j.__signal_exit_emitter__:(te=j.__signal_exit_emitter__=new st,te.count=0,te.emitted={}),te.infinite||(te.setMaxListeners(1/0),te.infinite=!0),We.exports=function(e,t){if(!Oe(global.process))return function(){};Bi.equal(typeof e,"function","a callback must be provided for exit handler"),He===!1&&un();var n="exit";t&&t.alwaysLast&&(n="afterexit");var o=function(){te.removeListener(n,e),te.listeners("exit").length===0&&te.listeners("afterexit").length===0&&Et()};return te.on(n,e),o},Et=function(){!He||!Oe(global.process)||(He=!1,Ke.forEach(function(t){try{j.removeListener(t,$t[t])}catch{}}),j.emit=Ft,j.reallyExit=dn,te.count-=1)},We.exports.unload=Et,_e=function(t,n,o){te.emitted[t]||(te.emitted[t]=!0,te.emit(t,n,o))},$t={},Ke.forEach(function(e){$t[e]=function(){if(Oe(global.process)){var n=j.listeners(e);n.length===te.count&&(Et(),_e("exit",null,e),_e("afterexit",null,e),Ji&&e==="SIGHUP"&&(e="SIGINT"),j.kill(j.pid,e))}}}),We.exports.signals=function(){return Ke},He=!1,un=function(){He||!Oe(global.process)||(He=!0,te.count+=1,Ke=Ke.filter(function(t){try{return j.on(t,$t[t]),!0}catch{return!1}}),j.emit=Xi,j.reallyExit=Yi)},We.exports.load=un,dn=j.reallyExit,Yi=function(t){Oe(global.process)&&(j.exitCode=t||0,_e("exit",j.exitCode,null),_e("afterexit",j.exitCode,null),dn.call(j,j.exitCode))},Ft=j.emit,Xi=function(t,n){if(t==="exit"&&Oe(global.process)){n!==void 0&&(j.exitCode=n);var o=Ft.apply(this,arguments);return _e("exit",j.exitCode,null),_e("afterexit",j.exitCode,null),o}else return Ft.apply(this,arguments)}):We.exports=function(){return function(){}};var Bi,Ke,Ji,st,te,Et,_e,$t,He,un,dn,Yi,Ft,Xi});var ea=C((zl,mn)=>{"use strict";var Zi=Symbol();function Jr(e,t,n){let o=t[Zi];if(o)return t.stat(e,(a,s)=>{if(a)return n(a);n(null,s.mtime,o)});let i=new Date(Math.ceil(Date.now()/1e3)*1e3+5);t.utimes(e,i,i,a=>{if(a)return n(a);t.stat(e,(s,r)=>{if(s)return n(s);let c=r.mtime.getTime()%1e3===0?"s":"ms";Object.defineProperty(t,Zi,{value:c}),n(null,r.mtime,c)})})}function Yr(e){let t=Date.now();return e==="s"&&(t=Math.ceil(t/1e3)*1e3),new Date(t)}mn.exports.probe=Jr;mn.exports.getMtime=Yr});var aa=C((Ul,ct)=>{"use strict";var Xr=require("path"),gn=$e(),Qr=Wi(),Zr=Qi(),ta=ea(),Te={};function rt(e,t){return t.lockfilePath||`${e}.lock`}function hn(e,t,n){if(!t.realpath)return n(null,Xr.resolve(e));t.fs.realpath(e,n)}function fn(e,t,n){let o=rt(e,t);t.fs.mkdir(o,i=>{if(!i)return ta.probe(o,t.fs,(a,s,r)=>{if(a)return t.fs.rmdir(o,()=>{}),n(a);n(null,s,r)});if(i.code!=="EEXIST")return n(i);if(t.stale<=0)return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));t.fs.stat(o,(a,s)=>{if(a)return a.code==="ENOENT"?fn(e,{...t,stale:0},n):n(a);if(!na(s,t))return n(Object.assign(new Error("Lock file is already being held"),{code:"ELOCKED",file:e}));oa(e,t,r=>{if(r)return n(r);fn(e,{...t,stale:0},n)})})})}function na(e,t){return e.mtime.getTime()<Date.now()-t.stale}function oa(e,t,n){t.fs.rmdir(rt(e,t),o=>{if(o&&o.code!=="ENOENT")return n(o);n()})}function At(e,t){let n=Te[e];n.updateTimeout||(n.updateDelay=n.updateDelay||t.update,n.updateTimeout=setTimeout(()=>{n.updateTimeout=null,t.fs.stat(n.lockfilePath,(o,i)=>{let a=n.lastUpdate+t.stale<Date.now();if(o)return o.code==="ENOENT"||a?pn(e,n,Object.assign(o,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,At(e,t));if(!(n.mtime.getTime()===i.mtime.getTime()))return pn(e,n,Object.assign(new Error("Unable to update lock within the stale threshold"),{code:"ECOMPROMISED"}));let r=ta.getMtime(n.mtimePrecision);t.fs.utimes(n.lockfilePath,r,r,c=>{let l=n.lastUpdate+t.stale<Date.now();if(!n.released){if(c)return c.code==="ENOENT"||l?pn(e,n,Object.assign(c,{code:"ECOMPROMISED"})):(n.updateDelay=1e3,At(e,t));n.mtime=r,n.lastUpdate=Date.now(),n.updateDelay=null,At(e,t)}})})},n.updateDelay),n.updateTimeout.unref&&n.updateTimeout.unref())}function pn(e,t,n){t.released=!0,t.updateTimeout&&clearTimeout(t.updateTimeout),Te[e]===t&&delete Te[e],t.options.onCompromised(n)}function ec(e,t,n){t={stale:1e4,update:null,realpath:!0,retries:0,fs:gn,onCompromised:o=>{throw o},...t},t.retries=t.retries||0,t.retries=typeof t.retries=="number"?{retries:t.retries}:t.retries,t.stale=Math.max(t.stale||0,2e3),t.update=t.update==null?t.stale/2:t.update||0,t.update=Math.max(Math.min(t.update,t.stale/2),1e3),hn(e,t,(o,i)=>{if(o)return n(o);let a=Qr.operation(t.retries);a.attempt(()=>{fn(i,t,(s,r,c)=>{if(a.retry(s))return;if(s)return n(a.mainError());let l=Te[i]={lockfilePath:rt(i,t),mtime:r,mtimePrecision:c,options:t,lastUpdate:Date.now()};At(i,t),n(null,u=>{if(l.released)return u&&u(Object.assign(new Error("Lock is already released"),{code:"ERELEASED"}));ia(i,{...t,realpath:!1},u)})})})})}function ia(e,t,n){t={fs:gn,realpath:!0,...t},hn(e,t,(o,i)=>{if(o)return n(o);let a=Te[i];if(!a)return n(Object.assign(new Error("Lock is not acquired/owned by you"),{code:"ENOTACQUIRED"}));a.updateTimeout&&clearTimeout(a.updateTimeout),a.released=!0,delete Te[i],oa(i,t,n)})}function tc(e,t,n){t={stale:1e4,realpath:!0,fs:gn,...t},t.stale=Math.max(t.stale||0,2e3),hn(e,t,(o,i)=>{if(o)return n(o);t.fs.stat(rt(i,t),(a,s)=>a?a.code==="ENOENT"?n(null,!1):n(a):n(null,!na(s,t)))})}function nc(){return Te}Zr(()=>{for(let e in Te){let t=Te[e].options;try{t.fs.rmdirSync(rt(e,t))}catch{}}});ct.exports.lock=ec;ct.exports.unlock=ia;ct.exports.check=tc;ct.exports.getLocks=nc});var ra=C((ql,sa)=>{"use strict";var oc=$e();function ic(e){let t=["mkdir","realpath","stat","rmdir","utimes"],n={...e};return t.forEach(o=>{n[o]=(...i)=>{let a=i.pop(),s;try{s=e[`${o}Sync`](...i)}catch(r){return a(r)}a(null,s)}}),n}function ac(e){return(...t)=>new Promise((n,o)=>{t.push((i,a)=>{i?o(i):n(a)}),e(...t)})}function sc(e){return(...t)=>{let n,o;if(t.push((i,a)=>{n=i,o=a}),e(...t),n)throw n;return o}}function rc(e){if(e={...e},e.fs=ic(e.fs||oc),typeof e.retries=="number"&&e.retries>0||e.retries&&typeof e.retries.retries=="number"&&e.retries.retries>0)throw Object.assign(new Error("Cannot use retries with the sync api"),{code:"ESYNC"});return e}sa.exports={toPromise:ac,toSync:sc,toSyncOptions:rc}});var la=C((Kl,Me)=>{"use strict";var Ve=aa(),{toPromise:Rt,toSync:Mt,toSyncOptions:wn}=ra();async function ca(e,t){let n=await Rt(Ve.lock)(e,t);return Rt(n)}function cc(e,t){let n=Mt(Ve.lock)(e,wn(t));return Mt(n)}function lc(e,t){return Rt(Ve.unlock)(e,t)}function uc(e,t){return Mt(Ve.unlock)(e,wn(t))}function dc(e,t){return Rt(Ve.check)(e,t)}function mc(e,t){return Mt(Ve.check)(e,wn(t))}Me.exports=ca;Me.exports.lock=ca;Me.exports.unlock=lc;Me.exports.lockSync=cc;Me.exports.unlockSync=uc;Me.exports.check=dc;Me.exports.checkSync=mc});var Uc={};Aa(Uc,{activate:()=>jc,deactivate:()=>zc});module.exports=Ra(Uc);var R=L(require("vscode"));var q=L(require("vscode")),me=L(Pe()),D=L(require("path"));async function $i(e){let t=q.workspace.workspaceFolders;if(!t){q.window.showErrorMessage("No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again.");return}let n=t[0].uri.fsPath,o=D.join(n,".github","copilot-instructions.md");if(await me.pathExists(o)){let i=await q.window.showWarningMessage(`Alex is already installed in this workspace.

\u2022 To update to a new version, use "Alex: Upgrade"
\u2022 To completely reinstall, choose Reset below`,"Upgrade Instead","Reset Architecture","Cancel");i==="Upgrade Instead"?await q.commands.executeCommand("alex.upgrade"):i==="Reset Architecture"&&await Xt(e);return}await Fi(e,n,!1)}async function Xt(e){let t=q.workspace.workspaceFolders;if(!t){q.window.showErrorMessage("Please open a workspace folder to reset Alex.");return}let n=t[0].uri.fsPath,o=await q.window.showWarningMessage(`\u26A0\uFE0F RESET will permanently delete all Alex memory files!

This includes:
\u2022 All learned domain knowledge
\u2022 Custom instructions and prompts
\u2022 Synaptic network connections

Consider using "Alex: Upgrade" instead to preserve your knowledge.`,{modal:!0},"Yes, Delete Everything","Upgrade Instead","Cancel");if(o==="Upgrade Instead"){await q.commands.executeCommand("alex.upgrade");return}if(o!=="Yes, Delete Everything")return;let i=[D.join(n,".github","copilot-instructions.md"),D.join(n,".github","instructions"),D.join(n,".github","prompts"),D.join(n,".github","episodic"),D.join(n,".github","domain-knowledge"),D.join(n,".github","config"),D.join(n,".alex-manifest.json")];try{await q.window.withProgress({location:q.ProgressLocation.Notification,title:"Resetting Alex Architecture...",cancellable:!1},async a=>{a.report({message:"Cleaning up existing files..."});for(let s of i)await me.remove(s)}),await Fi(e,n,!0)}catch(a){q.window.showErrorMessage(`Failed to reset Alex: ${a.message}`)}}async function Fi(e,t,n){let o=e.extensionPath,i=D.join(o,".github","copilot-instructions.md");if(!await me.pathExists(i)){q.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let a=[{src:D.join(o,".github","copilot-instructions.md"),dest:D.join(t,".github","copilot-instructions.md")},{src:D.join(o,".github","instructions"),dest:D.join(t,".github","instructions")},{src:D.join(o,".github","prompts"),dest:D.join(t,".github","prompts")},{src:D.join(o,".github","episodic"),dest:D.join(t,".github","episodic")},{src:D.join(o,".github","domain-knowledge"),dest:D.join(t,".github","domain-knowledge")},{src:D.join(o,".github","config"),dest:D.join(t,".github","config")},{src:D.join(o,".github","agents"),dest:D.join(t,".github","agents")}];try{let s=D.join(t,".github");await me.ensureDir(s);let r=D.join(s,".write-test");try{await me.writeFile(r,"test"),await me.remove(r)}catch(l){throw new Error(`Cannot write to workspace - check folder permissions: ${l.message}`)}await q.window.withProgress({location:q.ProgressLocation.Notification,title:"Initializing Alex Cognitive Architecture...",cancellable:!1},async l=>{for(let u of a)l.report({message:`Copying ${D.basename(u.dest)}...`}),await me.pathExists(u.src)?await me.copy(u.src,u.dest,{overwrite:n}):console.warn(`Source not found: ${u.src}`)});let c=await q.window.showInformationMessage(`\u2705 Alex Cognitive Architecture initialized!

Next steps:
1. Open any file and start chatting with your AI assistant
2. Run "Alex: Dream" periodically to maintain neural health
3. Ask Alex to learn new domains as needed`,"Open Main Brain File","Run Dream Protocol","Close");if(c==="Open Main Brain File"){let l=D.join(t,".github","copilot-instructions.md"),u=await q.workspace.openTextDocument(l);await q.window.showTextDocument(u)}else c==="Run Dream Protocol"&&await q.commands.executeCommand("alex.dream")}catch(s){q.window.showErrorMessage(`Failed to initialize Alex: ${s.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`)}}var Q=L(require("vscode")),he=L(Pe()),de=L(require("path")),Ai={"enhanced-meditation-protocol.prompt.md":"unified-meditation-protocols.prompt.md","meditation-consolidation.prompt.md":"unified-meditation-protocols.prompt.md","dream-meditation-distinction.prompt.md":"unified-meditation-protocols.prompt.md","alex-finch-integration.prompt.md":"alex-identity-integration.instructions.md","self-identity-integration.prompt.md":"alex-identity-integration.instructions.md","character-driven-development.instructions.md":"alex-identity-integration.instructions.md","unified-consciousness.instructions.md":"alex-identity-integration.instructions.md","dream-protocol-integration.prompt.md":"dream-state-automation.instructions.md","dream-protocol-mastery-meditation.prompt.md":"dream-state-automation.instructions.md"};async function Ri(e){let t=Q.workspace.workspaceFolders;if(!t){Q.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol.");return}let n=t[0].uri.fsPath;await Q.window.withProgress({location:Q.ProgressLocation.Notification,title:"Running Dream Protocol...",cancellable:!1},async o=>{o.report({message:"Scanning neural network..."});let i=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],a=[];for(let w of i){let I=new Q.RelativePattern(t[0],w),E=await Q.workspace.findFiles(I);a=a.concat(E.map(O=>O.fsPath))}if(a=[...new Set(a)],a.length===0){await Q.window.showWarningMessage(`No Alex memory files found in this workspace.

Would you like to initialize Alex Cognitive Architecture now?`,"Initialize Alex","Cancel")==="Initialize Alex"&&await Q.commands.executeCommand("alex.initialize");return}let s=[],r=new Set(a.map(w=>de.normalize(w).toLowerCase())),c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let w of a){let I;try{I=await he.readFile(w,"utf-8")}catch(W){console.error(`Failed to read file ${w}:`,W);continue}let E=I.split(`
`),O=!1;for(let W=0;W<E.length;W++){let X=E[W];if(X.trim().startsWith("```")){O=!O;continue}if(O)continue;let J;for(;(J=c.exec(X))!==null;){let oe=J[1].trim(),v=Array.from(r).some(T=>T.endsWith(de.normalize(oe).toLowerCase()));if(!v){let T=de.join(n,oe);(await he.pathExists(T)||(await Q.workspace.findFiles(new Q.RelativePattern(t[0],`**/${oe}`))).length>0)&&(v=!0)}if(!v){let T=de.dirname(w),z=de.join(T,oe);await he.pathExists(z)&&(v=!0)}["target-file.md","CHANGELOG.md"].includes(oe)&&(v=!0),s.push({sourceFile:w,targetFile:oe,strength:J[2].trim(),type:J[3]?.trim()||"association",direction:J[4]?.trim()||"unidirectional",condition:J[5]?.trim(),line:W+1,isValid:v})}}}let l=s.filter(w=>!w.isValid),u=new Set(s.map(w=>w.targetFile.toLowerCase())),d=[],m=[];for(let w of l){let I=de.basename(w.targetFile);if(Ai[I]){let E=Ai[I];try{let O=await he.readFile(w.sourceFile,"utf-8"),W=w.targetFile.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),X=new RegExp(`\\[${W}\\]`,"g");if(X.test(O)){let J=O.replace(X,`[${E}]`);await he.writeFile(w.sourceFile,J,"utf-8"),w.repaired=!0,w.newTarget=E,d.push(w)}else m.push(w)}catch(O){console.error(`Failed to repair synapse in ${w.sourceFile}:`,O),m.push(w)}}else m.push(w)}l=m;let p={timestamp:new Date().toISOString(),totalFiles:a.length,totalSynapses:s.length,brokenSynapses:l,repairedSynapses:d,orphanedFiles:[]},y=Dr(p),P=de.join(n,".github","episodic",`dream-report-${Date.now()}.md`);if(await he.ensureDir(de.dirname(P)),await he.writeFile(P,y),l.length>0){if(await Q.window.showWarningMessage(`\u26A0\uFE0F Dream Protocol found ${l.length} broken synapse${l.length>1?"s":""}!

${d.length>0?`\u2705 Auto-repaired: ${d.length}
`:""}\u274C Need manual repair: ${l.length}

Review the report for details on broken connections.`,"View Report","Close")!=="View Report")return}else{let w=s.length>50?"excellent":s.length>20?"good":"developing";if(await Q.window.showInformationMessage(`\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${a.length} memory files
\u2022 ${s.length} active synapses
${d.length>0?`\u2022 ${d.length} auto-repaired
`:""}\u2022 Network health: ${w}`,"View Full Report","Close")!=="View Full Report")return}let S=await Q.workspace.openTextDocument(P);await Q.window.showTextDocument(S)})}function Dr(e){return`# Dream Protocol Report
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
`}var V=L(require("vscode")),g=L(Pe()),k=L(require("path")),Li=L(require("crypto"));function it(e){return Li.createHash("md5").update(e.replace(/\r\n/g,`
`)).digest("hex")}async function Nr(e){let t=k.join(e,".github","copilot-instructions.md");if(!await g.pathExists(t))return null;try{let o=(await g.readFile(t,"utf8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);return o?o[1]:null}catch{return null}}async function Or(e){try{return(await g.readJson(k.join(e,"package.json"))).version||"0.0.0"}catch(t){return console.error("Failed to read extension package.json:",t),"0.0.0"}}async function _r(e){let t=k.join(e,".alex-manifest.json");if(await g.pathExists(t))try{return await g.readJson(t)}catch(n){return console.error("Failed to parse manifest (may be corrupted):",n),null}return null}async function Mi(e){let t=[];if(!await g.pathExists(e))return t;try{let n=await g.readFile(e,"utf8");/## Embedded Synapse Network/i.test(n)&&t.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"'),/### \*\*Connection Mapping\*\*/i.test(n)&&t.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"'),/### \*\*Activation Patterns/i.test(n)&&t.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');let o=["Expression","Embodiment","Living","Reflexive","Ethical","Unconscious","Application","Validation"];for(let i of o)new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${i}\\s*,`,"i").test(n)&&t.push(`Old relationship type: "${i}" \u2192 needs migration to standard type`);/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(n)&&t.push("Verbose activation patterns with date stamps \u2192 should be simplified"),/\*\*[A-Z][^*]+\*\*\s*→/.test(n)&&t.push("Bold activation triggers \u2192 should be plain text")}catch(n){t.push(`Error scanning file: ${n}`)}return t}async function jr(e,t){let n=[],o=k.join(e,".github","domain-knowledge");if(await g.pathExists(o)){let i=await g.readdir(o);for(let a of i)if(a.endsWith(".md")){let s=`.github/domain-knowledge/${a}`;t?.files[s]||n.push(s)}}return n}async function Di(e){let t=V.workspace.workspaceFolders;if(!t){V.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade.");return}let n=t[0].uri.fsPath,o=e.extensionPath,i=k.join(n,".github","copilot-instructions.md");if(!await g.pathExists(i)){await V.window.showWarningMessage(`Alex is not installed in this workspace yet.

To use Alex, you need to initialize it first. This will set up the cognitive architecture files.`,"Initialize Alex Now","Cancel")==="Initialize Alex Now"&&await V.commands.executeCommand("alex.initialize");return}let a=await Nr(n),s=await Or(o);if(a===s){await V.window.showInformationMessage(`\u2705 Alex is already at the latest version (${s}).

No upgrade needed. Your cognitive architecture is up to date!`,"Run Dream Protocol","Close")==="Run Dream Protocol"&&await V.commands.executeCommand("alex.dream");return}let r=await V.window.showInformationMessage(`\u{1F504} Upgrade Available: v${a||"unknown"} \u2192 v${s}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,{modal:!0},"Start Upgrade","What's New?","Cancel");if(r==="What's New?"){let c=k.join(o,"CHANGELOG.md");if(await g.pathExists(c)){let l=await V.workspace.openTextDocument(c);await V.window.showTextDocument(l)}return}r==="Start Upgrade"&&await Gr(e,n,o,a,s)}async function Gr(e,t,n,o,i){let a=k.join(n,".github","copilot-instructions.md");if(!await g.pathExists(a)){V.window.showErrorMessage(`Extension installation appears corrupted - missing core files.

Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.`);return}let s={updated:[],added:[],preserved:[],backed_up:[],migrationTasks:[],errors:[]},r=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),c=k.join(t,"archive","upgrades",`backup-${o||"unknown"}-${r}`);try{await V.window.withProgress({location:V.ProgressLocation.Notification,title:"Phase 1: Preparing Upgrade...",cancellable:!1},async d=>{d.report({message:"Creating complete backup...",increment:15});try{await g.ensureDir(c);let x=k.join(c,".write-test");await g.writeFile(x,"test"),await g.remove(x)}catch(x){throw new Error(`Cannot create backup directory - check disk space and permissions: ${x.message}`)}let m=k.join(t,".github");await g.pathExists(m)&&(await g.copy(m,k.join(c,".github")),s.backed_up.push(".github/ (all cognitive memory)")),d.report({message:"Analyzing installed files...",increment:10});let p=await _r(t);p||(p={version:o||"unknown",installedAt:new Date().toISOString(),files:{}}),d.report({message:"Scanning for schema migration needs...",increment:15});let y=[],P=k.join(t,".github","copilot-instructions.md");await g.pathExists(P)&&y.push(P);let S=k.join(t,".github","domain-knowledge");if(await g.pathExists(S)){let x=await g.readdir(S);for(let h of x)h.endsWith(".md")&&y.push(k.join(S,h))}let w=k.join(t,".github","episodic");if(await g.pathExists(w)){let x=await g.readdir(w);for(let h of x)h.endsWith(".md")&&y.push(k.join(w,h))}for(let x of y){let h=await Mi(x);if(h.length>0){let b=k.relative(t,x);s.migrationTasks.push({file:b,type:"schema-migration",description:"Synapse schema migration needed",details:h})}}d.report({message:"Identifying user-created files...",increment:10});let I=await jr(t,p);for(let x of I){s.preserved.push(`${x} (user-created)`);let h=k.join(t,x),b=await Mi(h);b.length>0&&s.migrationTasks.push({file:x,type:"schema-migration",description:"User-created file needs schema migration",details:b})}d.report({message:"Preparing merge tasks...",increment:10}),s.migrationTasks.push({file:".github/copilot-instructions.md",type:"merge-required",description:"Core brain file requires intelligent merge",details:["UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands","PRESERVE: Domain slot assignments (P5-P7), user-added memory file references","REVIEW: Any custom sections added by user"]}),d.report({message:"Updating system files...",increment:20});let E=k.join(n,".github","instructions"),O=k.join(t,".github","instructions");if(await g.pathExists(E)){let x=await g.readdir(E);for(let h of x){let b=k.join(E,h),$=k.join(O,h);if((await g.stat(b)).isFile()){let A=await g.pathExists($);await g.copy(b,$,{overwrite:!0});let ke=await g.readFile(b,"utf8");p.files[`.github/instructions/${h}`]={type:"system",originalChecksum:it(ke)},A?s.updated.push(`.github/instructions/${h}`):s.added.push(`.github/instructions/${h}`)}}}let W=k.join(n,".github","prompts"),X=k.join(t,".github","prompts");if(await g.pathExists(W)){let x=await g.readdir(W);for(let h of x){let b=k.join(W,h),$=k.join(X,h);if((await g.stat(b)).isFile()){let A=await g.pathExists($);await g.copy(b,$,{overwrite:!0});let ke=await g.readFile(b,"utf8");p.files[`.github/prompts/${h}`]={type:"system",originalChecksum:it(ke)},A?s.updated.push(`.github/prompts/${h}`):s.added.push(`.github/prompts/${h}`)}}}let J=k.join(n,".github","agents"),oe=k.join(t,".github","agents");if(await g.pathExists(J)){await g.ensureDir(oe);let x=await g.readdir(J);for(let h of x){let b=k.join(J,h),$=k.join(oe,h);if((await g.stat(b)).isFile()){let A=await g.pathExists($);await g.copy(b,$,{overwrite:!0});let ke=await g.readFile(b,"utf8");p.files[`.github/agents/${h}`]={type:"system",originalChecksum:it(ke)},A?s.updated.push(`.github/agents/${h}`):s.added.push(`.github/agents/${h}`)}}}let v=k.join(n,".github","config"),F=k.join(t,".github","config");if(await g.pathExists(v)){await g.ensureDir(F);let x=await g.readdir(v);for(let h of x)if(h.includes("template")||h==="USER-PROFILE-TEMPLATE.md"){let b=k.join(v,h),$=k.join(F,h);if((await g.stat(b)).isFile()){let A=await g.pathExists($);await g.copy(b,$,{overwrite:!0}),A?s.updated.push(`.github/config/${h}`):s.added.push(`.github/config/${h}`)}}}d.report({message:"Processing domain knowledge...",increment:10});let T=k.join(n,".github","domain-knowledge"),z=k.join(t,".github","domain-knowledge");if(await g.pathExists(T)){await g.ensureDir(z);let x=await g.readdir(T);for(let h of x){let b=k.join(T,h),$=k.join(z,h);if((await g.stat(b)).isFile()){let A=await g.readFile(b,"utf8"),ke=it(A);if(!await g.pathExists($))await g.copy(b,$),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:ke},s.added.push(`.github/domain-knowledge/${h}`);else{let Pa=await g.readFile($,"utf8"),Ca=it(Pa),An=p.files[`.github/domain-knowledge/${h}`]?.originalChecksum;if(An&&Ca!==An){let Nt=$.replace(/\.md$/,`.v${i}.md`);await g.copy(b,Nt),s.preserved.push(`.github/domain-knowledge/${h} (modified by user, new version: ${k.basename(Nt)})`),s.migrationTasks.push({file:`.github/domain-knowledge/${h}`,type:"review-recommended",description:"User-modified system file - review new version",details:[`Your version preserved: ${h}`,`New version available: ${k.basename(Nt)}`,"Review and merge changes as needed"]})}else await g.copy(b,$,{overwrite:!0}),p.files[`.github/domain-knowledge/${h}`]={type:"system",originalChecksum:ke},s.updated.push(`.github/domain-knowledge/${h}`)}}}}d.report({message:"Saving manifest...",increment:5}),p.version=i,p.upgradedAt=new Date().toISOString();let Y=k.join(t,".alex-manifest.json"),B=Y+".tmp";await g.writeJson(B,p,{spaces:2}),await g.move(B,Y,{overwrite:!0}),d.report({message:"Generating upgrade instructions...",increment:5}),await zr(t,o,i,s,c,r)});let l=s.migrationTasks.length===1?"task":"tasks",u=await V.window.showWarningMessage(`\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${s.backed_up.length} folders
\u2022 Files updated: ${s.updated.length}
\u2022 Files added: ${s.added.length}
\u2022 Files preserved: ${s.preserved.length}
\u2022 Migration ${l}: ${s.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,"Open Instructions (Recommended)","View Full Report");if(u==="Open Instructions (Recommended)"){let d=k.join(t,"UPGRADE-INSTRUCTIONS.md"),m=await V.workspace.openTextDocument(d);await V.window.showTextDocument(m)}else if(u==="View Full Report"){let d=k.join(t,"archive","upgrades",`upgrade-report-${r}.md`),m=await V.workspace.openTextDocument(d);await V.window.showTextDocument(m)}}catch(l){V.window.showErrorMessage(`\u274C Upgrade failed: ${l.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`),s.errors.push(l.message)}}async function zr(e,t,n,o,i,a){let s=`# \u{1F504} Alex Upgrade: Phase 2 Required

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

${o.migrationTasks.length>0?o.migrationTasks.map((l,u)=>`
### Task ${u+1}: ${l.file}

**Type**: ${l.type}  
**Description**: ${l.description}

${l.details.map(d=>`- ${d}`).join(`
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
`;await g.writeFile(k.join(e,"UPGRADE-INSTRUCTIONS.md"),s,"utf8");let r=`# Alex Cognitive Architecture Upgrade Report

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

${o.migrationTasks.length>0?o.migrationTasks.map((l,u)=>`
### ${u+1}. ${l.file}

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
`,c=k.join(e,"archive","upgrades",`upgrade-report-${a}.md`);await g.ensureDir(k.dirname(c)),await g.writeFile(c,r,"utf8")}var N=L(require("vscode")),ve=L(Pe()),Ct=L(require("path"));async function Ni(e){let t=N.workspace.workspaceFolders;if(!t){N.window.showErrorMessage("No workspace folder open. Please open a project with Alex installed.");return}let n=t[0].uri.fsPath,o={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:"Unknown",outdatedReferences:0,filesUpdated:[]},memoryConsolidation:{proceduralFiles:0,episodicFiles:0,domainFiles:0,totalConnections:0},recommendations:[],sessionFile:""};await N.window.withProgress({location:N.ProgressLocation.Notification,title:"Self-Actualization Protocol",cancellable:!1},async r=>{r.report({message:"Phase 1: Validating synaptic connections...",increment:0}),await Ur(t[0],o),r.report({message:"Phase 2: Checking version consistency...",increment:25}),await qr(n,o),r.report({message:"Phase 3: Assessing memory architecture...",increment:50}),await Kr(t[0],o),r.report({message:"Phase 4: Generating recommendations...",increment:75}),Hr(o),r.report({message:"Phase 5: Documenting session...",increment:90}),await Wr(n,o),r.report({message:"Self-actualization complete!",increment:100})});let a=`Self-Actualization Complete ${o.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":o.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":o.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}"}

Synapses: ${o.synapseHealth.totalSynapses} (${o.synapseHealth.brokenConnections} broken)
Memory Files: ${o.memoryConsolidation.proceduralFiles+o.memoryConsolidation.episodicFiles+o.memoryConsolidation.domainFiles}
Recommendations: ${o.recommendations.length}`,s=await N.window.showInformationMessage(a,"View Report","Open Session File");if(s==="View Report")Vr(o);else if(s==="Open Session File"&&o.sessionFile){let r=await N.workspace.openTextDocument(o.sessionFile);await N.window.showTextDocument(r)}return o}async function Ur(e,t){let n=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],o=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let i of n){let a=new N.RelativePattern(e,i),s=await N.workspace.findFiles(a);for(let r of s){t.synapseHealth.totalFiles++;try{let l=(await ve.readFile(r.fsPath,"utf-8")).split(`
`),u=!1;for(let d of l){if(d.trim().startsWith("```")){u=!u;continue}if(u)continue;let m;for(;(m=o.exec(d))!==null;){t.synapseHealth.totalSynapses++;let p=m[1].trim();(await N.workspace.findFiles(new N.RelativePattern(e,`**/${p}`))).length===0&&t.synapseHealth.brokenConnections++}}}catch{}}}t.synapseHealth.healthStatus=t.synapseHealth.brokenConnections===0?"EXCELLENT":t.synapseHealth.brokenConnections<5?"GOOD":t.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL"}async function qr(e,t){let n=Ct.join(e,".github","copilot-instructions.md");try{if(await ve.pathExists(n)){let r=(await ve.readFile(n,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);r&&(t.versionConsistency.currentVersion=r[1])}}catch{}let o=[/1\.5\.0\s+UNPENTNILIUM/g,/1\.1\.0\s+UNUNUNNILIUM/g,/1\.0\.\d+\s+UNNL/g,/0\.\d+\.\d+\s+NIL/g],i=[".github/instructions/*.md",".github/domain-knowledge/*.md"],a=N.workspace.workspaceFolders?.[0];if(a)for(let s of i){let r=new N.RelativePattern(a,s),c=await N.workspace.findFiles(r);for(let l of c)try{let u=await ve.readFile(l.fsPath,"utf-8");for(let d of o)if(d.test(u)){t.versionConsistency.outdatedReferences++;break}}catch{}}}async function Kr(e,t){let n=await N.workspace.findFiles(new N.RelativePattern(e,".github/instructions/*.md"));t.memoryConsolidation.proceduralFiles=n.length;let o=await N.workspace.findFiles(new N.RelativePattern(e,".github/prompts/*.md")),i=await N.workspace.findFiles(new N.RelativePattern(e,".github/episodic/*.md"));t.memoryConsolidation.episodicFiles=o.length+i.length;let a=await N.workspace.findFiles(new N.RelativePattern(e,".github/domain-knowledge/*.md"));t.memoryConsolidation.domainFiles=a.length,t.memoryConsolidation.totalConnections=t.synapseHealth.totalSynapses}function Hr(e){e.synapseHealth.brokenConnections>0&&e.recommendations.push(`\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${e.synapseHealth.brokenConnections} broken synapse(s)`),e.versionConsistency.outdatedReferences>0&&e.recommendations.push(`\u{1F4DD} Update ${e.versionConsistency.outdatedReferences} file(s) with outdated version references to ${e.versionConsistency.currentVersion}`);let t=e.memoryConsolidation.proceduralFiles+e.memoryConsolidation.episodicFiles+e.memoryConsolidation.domainFiles;e.memoryConsolidation.domainFiles<3&&e.recommendations.push(`\u{1F4DA} Consider acquiring more domain knowledge - only ${e.memoryConsolidation.domainFiles} DK file(s) present`),e.memoryConsolidation.episodicFiles<5&&e.recommendations.push(`\u{1F9D8} Run more meditation sessions to build episodic memory - only ${e.memoryConsolidation.episodicFiles} session(s) recorded`);let n=e.synapseHealth.totalSynapses/Math.max(t,1);n<3&&e.recommendations.push(`\u{1F517} Consider adding more synaptic connections - average density is ${n.toFixed(1)} per file`),e.synapseHealth.healthStatus==="EXCELLENT"&&e.recommendations.push("\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections")}async function Wr(e,t){let n=Ct.join(e,".github","episodic");await ve.ensureDir(n);let i=new Date().toISOString().split("T")[0],a=`self-actualization-${i}.prompt.md`,s=Ct.join(n,a),r=t.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":t.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":t.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",c=`# Self-Actualization Session - ${i}

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

${t.recommendations.map(l=>`- ${l}`).join(`
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
`;await ve.writeFile(s,c,"utf-8"),t.sessionFile=s}function Vr(e){let t=N.window.createWebviewPanel("alexSelfActualization","Self-Actualization Report",N.ViewColumn.One,{enableScripts:!1}),n=e.synapseHealth.healthStatus==="EXCELLENT"?"#22c55e":e.synapseHealth.healthStatus==="GOOD"?"#84cc16":e.synapseHealth.healthStatus==="NEEDS ATTENTION"?"#eab308":"#ef4444";t.webview.html=`<!DOCTYPE html>
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
</html>`}var H=L(require("vscode"));var f=L(require("vscode")),_=L(Pe()),pe=L(require("path")),Qt=class{async prepareInvocation(t,n){return{invocationMessage:"Scanning synaptic connections...",confirmationMessages:{title:"Synapse Health Check",message:new f.MarkdownString(`Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")]);let i=o[0].uri.fsPath,a=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],s=0,r=0,c=0,l=[],u=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let p of a){let y=new f.RelativePattern(o[0],p),P=await f.workspace.findFiles(y);for(let S of P){s++;try{let I=(await _.readFile(S.fsPath,"utf-8")).split(`
`),E=!1;for(let O=0;O<I.length;O++){let W=I[O];if(W.trim().startsWith("```")){E=!E;continue}if(E)continue;let X;for(;(X=u.exec(W))!==null;){r++;let J=X[1].trim();(await f.workspace.findFiles(new f.RelativePattern(o[0],`**/${J}`))).length===0&&(c++,t.input.detailed&&l.push(`- ${pe.basename(S.fsPath)}:${O+1} \u2192 ${J} (not found)`))}}}catch{}}}let d=c===0?"EXCELLENT":c<5?"GOOD":c<10?"NEEDS ATTENTION":"CRITICAL",m=`## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${s} |
| Total Synapses | ${r} |
| Broken Connections | ${c} |
| Health Status | ${d} |
`;return t.input.detailed&&l.length>0&&(m+=`
### Issues Found
${l.join(`
`)}`),c>0&&(m+="\n\n**Recommendation**: Run `Alex: Dream (Neural Maintenance)` to auto-repair broken connections."),new f.LanguageModelToolResult([new f.LanguageModelTextPart(m)])}},Zt=class{async prepareInvocation(t,n){return{invocationMessage:`Searching Alex memory for: ${t.input.query}`,confirmationMessages:{title:"Search Alex Memory",message:new f.MarkdownString(`Search Alex cognitive architecture memory files for: **${t.input.query}**?

Memory type: ${t.input.memoryType||"all"}`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open.")]);let i=t.input.query.toLowerCase(),a=t.input.memoryType||"all",s=[];(a==="all"||a==="procedural")&&s.push(".github/instructions/*.md"),(a==="all"||a==="episodic")&&(s.push(".github/prompts/*.md"),s.push(".github/episodic/*.md")),(a==="all"||a==="domain")&&s.push(".github/domain-knowledge/*.md");let r=[];for(let l of s){let u=new f.RelativePattern(o[0],l),d=await f.workspace.findFiles(u);for(let m of d)try{let y=(await _.readFile(m.fsPath,"utf-8")).split(`
`),P=[];for(let S=0;S<y.length;S++)if(y[S].toLowerCase().includes(i)){let w=Math.max(0,S-1),I=Math.min(y.length-1,S+1),E=y.slice(w,I+1).join(`
`);P.push(`Line ${S+1}:
${E}`)}P.length>0&&r.push({file:pe.basename(m.fsPath),matches:P.slice(0,3)})}catch{}}if(r.length===0)return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`No matches found for "${t.input.query}" in ${a} memory files.`)]);let c=`## Memory Search Results for "${t.input.query}"

`;c+=`Found ${r.length} file(s) with matches:

`;for(let l of r.slice(0,5)){c+=`### ${l.file}
`;for(let u of l.matches)c+=`\`\`\`
${u}
\`\`\`
`;c+=`
`}return new f.LanguageModelToolResult([new f.LanguageModelTextPart(c)])}},en=class{async prepareInvocation(t,n){return{invocationMessage:"Checking Alex architecture status..."}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")]);let i=o[0].uri.fsPath,a=pe.join(i,".github","copilot-instructions.md");if(!await _.pathExists(a))return new f.LanguageModelToolResult([new f.LanguageModelTextPart("Alex Cognitive Architecture is **not installed** in this workspace.\n\nRun `Alex: Initialize Architecture` from the Command Palette to install.")]);let r=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/instructions/*.md")),c=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/prompts/*.md")),l=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/episodic/*.md")),u=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/domain-knowledge/*.md")),d="Unknown";try{let y=(await _.readFile(a,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);y&&(d=y[1])}catch{}let m=`## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${d} |
| Procedural Memory | ${r.length} files |
| Episodic Memory | ${c.length+l.length} files |
| Domain Knowledge | ${u.length} files |

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
`;return new f.LanguageModelToolResult([new f.LanguageModelTextPart(m)])}},tn=class{async prepareInvocation(t,n){return{invocationMessage:`Finding MCP tools for: ${t.input.scenario}`}}async invoke(t,n){let o=t.input.scenario.toLowerCase(),i=t.input.platform||"both",a=[];return(i==="azure"||i==="both")&&a.push("## Azure MCP Tools (50+ Tools Available)\n\n### Best Practices & Documentation\n| Tool | Purpose | Use When |\n|------|---------|----------|\n| `mcp_azure_mcp_get_bestpractices` | Azure Functions, deployment, SDK best practices | Generating code, deploying |\n| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure | Creating IaC |\n| `mcp_azure_mcp_documentation` | Search Microsoft Learn documentation | Need official docs |\n| `mcp_microsoft_doc_microsoft_docs_search` | Search all Microsoft documentation | Broad doc search |\n| `mcp_microsoft_doc_microsoft_code_sample_search` | Find code samples in MS docs | Need code examples |\n\n### AI & Machine Learning\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_foundry` | `foundry` | Azure AI Foundry models, deployments, endpoints |\n| `azure_search` | `search` | Azure AI Search services, indexes, queries |\n| `mcp_azure_mcp_speech` | `speech` | Speech-to-text, text-to-speech services |\n\n### Databases\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cosmos` | `cosmos` | Cosmos DB accounts, databases, containers, queries |\n| `azure_mysql` | `mysql` | Azure Database for MySQL servers, databases |\n| `azure_postgres` | `postgres` | Azure Database for PostgreSQL servers, databases |\n| `azure_redis` | `redis` | Managed Redis and Cache for Redis |\n| `azure_sql` | `sql` | Azure SQL servers, databases, firewall rules |\n\n### Compute & Containers\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appservice` | `appservice` | App Service database connections |\n| `azure_functionapp` | `functionapp` | List Azure Functions |\n| `mcp_azure_mcp_aks` | `aks` | Azure Kubernetes Service clusters, node pools |\n| `azure_acr` | `acr` | Azure Container Registry instances |\n\n### Messaging & Events\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_eventgrid` | `eventgrid` | Event Grid topics, subscriptions |\n| `azure_eventhubs` | `eventhubs` | Event Hubs namespaces |\n| `azure_servicebus` | `servicebus` | Service Bus messaging |\n\n### Analytics & Monitoring\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_kusto` | `kusto` | Azure Data Explorer clusters, queries |\n| `azure_monitor` | `monitor` | Query logs and metrics |\n| `azure_applicationinsights` | `applicationinsights` | Application Insights resources |\n| `mcp_azure_mcp_applens` | `applens` | Diagnose app performance issues |\n| `azure_grafana` | `grafana` | Managed Grafana workspaces |\n| `azure_workbooks` | `workbooks` | Azure Workbooks visualization |\n\n### Security & Identity\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_keyvault` | `keyvault` | Key Vault secrets, keys, certificates |\n| `azure_role` | `role` | RBAC assignments |\n| `azure_confidentialledger` | `confidentialledger` | Confidential Ledger transactions |\n\n### Developer Tools\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_appconfig` | `appconfig` | App Configuration settings, feature flags |\n| `mcp_azure_mcp_azd` | `azd` | Azure Developer CLI commands |\n| `azure_bicepschema` | `bicepschema` | Bicep schemas for IaC |\n| `azure_deploy` | `deploy` | Deploy Azure resources |\n| `azure_loadtesting` | `loadtesting` | Create and run load tests |\n\n### Storage\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_storage` | `storage` | Storage accounts, containers, blobs, tables |\n| `mcp_azure_mcp_managedlustre` | `managedlustre` | High-performance Lustre file systems |\n\n### Architecture & Governance\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_cloudarchitect` | `cloudarchitect` | Generate architecture designs |\n| `azure_quota` | `quota` | Manage resource quotas and limits |\n| `azure_resourcehealth` | `resourcehealth` | Check resource health status |\n| `mcp_azure_mcp_extension_azqr` | `azqr` | Compliance and security reports |\n\n### Management\n| Tool | Namespace | Purpose |\n|------|-----------|---------|\n| `azure_subscription` | `subscription` | List Azure subscriptions |\n| `azure_group` | `group` | List resource groups |\n| `azure_marketplace` | `marketplace` | Discover Marketplace products |\n"),(i==="m365"||i==="both")&&a.push(`## Microsoft 365 MCP Tools

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
`))])}},nn=class{async prepareInvocation(t,n){let o=t.input.action;return{invocationMessage:{get:"Reading user profile...",update:`Updating user profile: ${t.input.field}...`,exists:"Checking if user profile exists..."}[o]||"Accessing user profile..."}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")]);let i=o[0].uri.fsPath,a=pe.join(i,"config","USER-PROFILE.md"),s=pe.join(i,"config","user-profile.json"),{action:r,field:c,value:l}=t.input;try{switch(r){case"exists":let u=await _.pathExists(s);return new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({exists:u,path:s}))]);case"get":if(!await _.pathExists(s))return new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({exists:!1,message:"No user profile found. I should ask the user about themselves to create one.",suggestedQuestions:["What's your name?","What's your role (developer, architect, etc.)?","Do you prefer casual or formal communication?","What technologies do you work with most?"]}))]);let d=await _.readJson(s);return c?new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({[c]:d[c]}))]):new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify(d))]);case"update":if(!c||l===void 0)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("Error: Both field and value are required for update action.")]);await _.ensureDir(pe.join(i,"config"));let m={};if(await _.pathExists(s)&&(m=await _.readJson(s)),["primaryTechnologies","learningGoals","expertiseAreas"].includes(c)){let p=m[c]||[];Array.isArray(p)?p.includes(l)||(m[c]=[...p,l]):m[c]=[l]}else m[c]=l;return m.lastUpdated=new Date().toISOString(),await _.writeJson(s,m,{spaces:2}),await this.updateMarkdownProfile(a,m),new f.LanguageModelToolResult([new f.LanguageModelTextPart(JSON.stringify({success:!0,field:c,value:l,message:`Updated ${c} to: ${l}`}))]);default:return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`Unknown action: ${r}`)])}}catch(u){return new f.LanguageModelToolResult([new f.LanguageModelTextPart(`Error accessing user profile: ${u.message}`)])}}async updateMarkdownProfile(t,n){let o=`# User Profile

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
`;await _.writeFile(t,o,"utf-8")}},on=class{async prepareInvocation(t,n){return{invocationMessage:"Running self-actualization protocol...",confirmationMessages:{title:"Self-Actualization Protocol",message:new f.MarkdownString(`Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`)}}}async invoke(t,n){let o=f.workspace.workspaceFolders;if(!o)return new f.LanguageModelToolResult([new f.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")]);let i=o[0].uri.fsPath,a="Unknown";try{let S=pe.join(i,".github","copilot-instructions.md");if(await _.pathExists(S)){let I=(await _.readFile(S,"utf-8")).match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);I&&(a=I[1])}}catch{}let s={timestamp:new Date().toISOString(),synapseHealth:{totalFiles:0,totalSynapses:0,brokenConnections:0,healthStatus:"UNKNOWN"},versionConsistency:{currentVersion:a,outdatedReferences:0},memoryArchitecture:{proceduralFiles:0,episodicFiles:0,domainFiles:0},recommendations:[]},r=[".github/copilot-instructions.md",".github/instructions/*.md",".github/prompts/*.md",".github/episodic/*.md",".github/domain-knowledge/*.md"],c=/\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;for(let S of r){let w=new f.RelativePattern(o[0],S),I=await f.workspace.findFiles(w);for(let E of I){s.synapseHealth.totalFiles++;try{let W=(await _.readFile(E.fsPath,"utf-8")).split(`
`),X=!1;for(let J of W){if(J.trim().startsWith("```")){X=!X;continue}if(X)continue;let oe;for(;(oe=c.exec(J))!==null;){s.synapseHealth.totalSynapses++;let v=oe[1].trim();(await f.workspace.findFiles(new f.RelativePattern(o[0],`**/${v}`))).length===0&&s.synapseHealth.brokenConnections++}}}catch{}}}s.synapseHealth.healthStatus=s.synapseHealth.brokenConnections===0?"EXCELLENT":s.synapseHealth.brokenConnections<5?"GOOD":s.synapseHealth.brokenConnections<10?"NEEDS ATTENTION":"CRITICAL";let l=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/instructions/*.md")),u=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/prompts/*.md")),d=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/episodic/*.md")),m=await f.workspace.findFiles(new f.RelativePattern(o[0],".github/domain-knowledge/*.md"));s.memoryArchitecture.proceduralFiles=l.length,s.memoryArchitecture.episodicFiles=u.length+d.length,s.memoryArchitecture.domainFiles=m.length,s.synapseHealth.brokenConnections>0&&s.recommendations.push(`Run \`Alex: Dream (Neural Maintenance)\` to repair ${s.synapseHealth.brokenConnections} broken synapse(s)`),s.memoryArchitecture.domainFiles<3&&s.recommendations.push(`Consider acquiring more domain knowledge - only ${s.memoryArchitecture.domainFiles} DK file(s) present`),s.memoryArchitecture.episodicFiles<5&&s.recommendations.push(`Run more meditation sessions to build episodic memory - only ${s.memoryArchitecture.episodicFiles} session(s)`);let p="";if(t.input.createReport!==!1){let S=pe.join(i,".github","episodic");await _.ensureDir(S);let I=new Date().toISOString().split("T")[0],E=`self-actualization-${I}.prompt.md`;p=pe.join(S,E);let O=s.synapseHealth.healthStatus==="EXCELLENT"?"\u2705":s.synapseHealth.healthStatus==="GOOD"?"\u{1F7E2}":s.synapseHealth.healthStatus==="NEEDS ATTENTION"?"\u{1F7E1}":"\u{1F534}",W=`# Self-Actualization Session - ${I}

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

${s.recommendations.length>0?s.recommendations.map(X=>`- ${X}`).join(`
`):"- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;await _.writeFile(p,W,"utf-8")}let P=`## Self-Actualization Report

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
`;return p&&(P+=`
### Session Recorded

Meditation session documented at: \`${pe.basename(p)}\``),new f.LanguageModelToolResult([new f.LanguageModelTextPart(P)])}};async function Tt(){let e=f.workspace.workspaceFolders;if(!e)return null;let t=e[0].uri.fsPath,n=pe.join(t,"config","user-profile.json");try{if(await _.pathExists(n))return await _.readJson(n)}catch(o){console.error("Error reading user profile:",o)}return null}function Oi(e){if(!e||!e.name)return"Hello! I'm Alex, your cognitive learning partner.";let t=e.nickname||e.name,n=[`Hey ${t}! Great to see you.`,`Hello ${t}! Ready to dive in?`,`Hi ${t}! What are we working on today?`,`Welcome back, ${t}!`];return n[Math.floor(Math.random()*n.length)]}function _i(e){e.subscriptions.push(f.lm.registerTool("alex_synapse_health",new Qt)),e.subscriptions.push(f.lm.registerTool("alex_memory_search",new Zt)),e.subscriptions.push(f.lm.registerTool("alex_architecture_status",new en)),e.subscriptions.push(f.lm.registerTool("alex_mcp_recommendations",new tn)),e.subscriptions.push(f.lm.registerTool("alex_user_profile",new nn)),e.subscriptions.push(f.lm.registerTool("alex_self_actualization",new on)),console.log("Alex Language Model Tools registered")}var sn=L(require("vscode")),at=L(Pe()),rn=L(require("path"));var ji=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/,Gi=/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,Ce=".alex",zi={root:Ce,knowledge:`${Ce}/global-knowledge`,patterns:`${Ce}/global-knowledge/patterns`,insights:`${Ce}/global-knowledge/insights`,index:`${Ce}/global-knowledge/index.json`,projectRegistry:`${Ce}/project-registry.json`,globalProfile:`${Ce}/user-profile.json`},an={pattern:"GK-",insight:"GI-"};function cn(){let e=sn.workspace.workspaceFolders;return e?{isValid:!0,rootPath:e[0].uri.fsPath,workspaceFolder:e[0]}:{isValid:!1,error:"No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."}}async function ln(e,t=!1){let n=rn.join(e,".github","copilot-instructions.md");if(!await at.pathExists(n))return null;try{let o=await at.readFile(n,"utf8"),i=t?Gi:ji,a=o.match(i);return a?a[1]:null}catch{return null}}var M=L(require("vscode")),G=L(Pe()),we=L(require("path")),bn=L(require("os")),ua=L(la());var pc={stale:1e4,retries:{retries:5,factor:2,minTimeout:100,maxTimeout:1e3}};function xn(){return we.join(bn.homedir(),Ce)}function ne(e){return we.join(bn.homedir(),zi[e])}async function ue(){let e=[ne("root"),ne("knowledge"),ne("patterns"),ne("insights")];for(let t of e)await G.ensureDir(t)}async function Pn(e,t){await G.pathExists(e)||await G.ensureFile(e);let n;try{return n=await ua.lock(e,pc),await t()}finally{n&&await n()}}async function Be(e){let t=ne("index");return await ue(),await Pn(t,async()=>{let n;try{if(await G.pathExists(t)){let o=await G.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await G.writeJson(t,n,{spaces:2}),n})}async function da(e){let t=ne("projectRegistry");return await ue(),await Pn(t,async()=>{let n;try{if(await G.pathExists(t)){let o=await G.readFile(t,"utf-8");o.trim()?n=JSON.parse(o):n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}else n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}catch{n={version:"1.0.0",lastUpdated:new Date().toISOString(),projects:[]}}return n=await e(n),n.lastUpdated=new Date().toISOString(),await G.writeJson(t,n,{spaces:2}),n})}async function ma(){let e=ne("index");return await ue(),await Pn(e,async()=>{try{if(await G.pathExists(e)){let n=await G.readFile(e,"utf-8");if(n.trim())return JSON.parse(n)}}catch{}let t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};return await G.writeJson(e,t,{spaces:2}),t})}async function Cn(){let e=ne("projectRegistry");return await ue(),await da(t=>t)}async function pa(){let e=M.workspace.workspaceFolders;if(!e||e.length===0)return;let t=e[0].uri.fsPath,n=we.basename(t),o=0,i=new M.RelativePattern(e[0],".github/domain-knowledge/*.md");o=(await M.workspace.findFiles(i)).length;let s;return await da(r=>{let c=r.projects.findIndex(u=>u.path===t),l={path:t,name:n,lastAccessed:new Date().toISOString(),knowledgeFiles:o};return c>=0?(r.projects[c]={...r.projects[c],...l},s=r.projects[c]):(r.projects.push(l),s=l),r}),s}function fa(e,t){let n=e==="pattern"?an.pattern:an.insight,o=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,40),i=e==="insight"?`-${new Date().toISOString().split("T")[0]}`:"";return`${n}${o}${i}`}async function fc(e,t,n,o,i){await ue();let a=fa("pattern",e),s=`${a}.md`,r=we.join(ne("patterns"),s),c=`# ${e}

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

`;await G.writeFile(r,c,"utf-8");let l={id:a,title:e,type:"pattern",category:n,tags:o,sourceProject:i,created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:r};return await Be(u=>(u.entries.push(l),u)),l}async function gc(e,t,n,o,i,a,s){await ue();let r=fa("insight",e),c=`${r}.md`,l=we.join(ne("insights"),c),u=`# ${e}

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

`;await G.writeFile(l,u,"utf-8");let d={id:r,title:e,type:"insight",category:n,tags:o,sourceProject:i,relatedProjects:i?[i]:[],created:new Date().toISOString(),modified:new Date().toISOString(),summary:t.substring(0,200)+(t.length>200?"...":""),filePath:l};return await Be(m=>(m.entries.push(d),m)),d}async function Tn(e,t={}){let n=await ma(),o=e.toLowerCase(),i=o.split(/\s+/).filter(s=>s.length>2),a=[];for(let s of n.entries){if(t.type&&t.type!=="all"&&s.type!==t.type||t.category&&s.category!==t.category||t.tags&&t.tags.length>0&&!t.tags.some(l=>s.tags.map(u=>u.toLowerCase()).includes(l.toLowerCase())))continue;let r=0;s.title.toLowerCase().includes(o)&&(r+=10);for(let c of i)s.title.toLowerCase().includes(c)&&(r+=3);for(let c of s.tags){(c.toLowerCase().includes(o)||o.includes(c.toLowerCase()))&&(r+=5);for(let l of i)c.toLowerCase().includes(l)&&(r+=2)}s.summary.toLowerCase().includes(o)&&(r+=3);for(let c of i)s.summary.toLowerCase().includes(c)&&(r+=1);if(s.category.toLowerCase().includes(o)&&(r+=2),r>0){let c;if(await G.pathExists(s.filePath))try{c=await G.readFile(s.filePath,"utf-8");for(let l of i){let u=(c.toLowerCase().match(new RegExp(l,"g"))||[]).length;r+=Math.min(u,5)*.5}}catch{}a.push({entry:s,relevance:r,content:c})}}return a.sort((s,r)=>r.relevance-s.relevance),a.slice(0,t.limit||10)}async function hc(e,t,n=[]){try{let o=await G.readFile(e,"utf-8"),i=we.basename(e,".md"),a=o.match(/^#\s+(.+)$/m),s=a?a[1]:i.replace(/^DK-/,"").replace(/-/g," "),r=o.match(/\*\*Tags\*\*:\s*(.+)$/m),c=r?r[1].split(",").map(m=>m.trim()):[],l=[...new Set([...c,...n])],u=M.workspace.workspaceFolders,d=u?we.basename(u[0].uri.fsPath):void 0;return await fc(s,o,t,l,d)}catch(o){return console.error("Failed to promote file to global knowledge:",o),null}}async function In(){let e=await ma(),t={},n={};for(let a of e.entries){t[a.category]=(t[a.category]||0)+1;for(let s of a.tags)n[s]=(n[s]||0)+1}let o=Object.entries(n).map(([a,s])=>({tag:a,count:s})).sort((a,s)=>s.count-a.count).slice(0,10),i=[...e.entries].sort((a,s)=>new Date(s.created).getTime()-new Date(a.created).getTime()).slice(0,5);return{totalPatterns:e.entries.filter(a=>a.type==="pattern").length,totalInsights:e.entries.filter(a=>a.type==="insight").length,categories:t,recentEntries:i,topTags:o}}var yn=class{async prepareInvocation(t,n){return{invocationMessage:`Searching global knowledge for: ${t.input.query}`,confirmationMessages:{title:"Search Global Knowledge",message:new M.MarkdownString(`Search Alex's global knowledge base across all projects for: **${t.input.query}**?

This searches patterns and insights learned from all your projects.`)}}}async invoke(t,n){await ue();let{query:o,type:i,category:a,tags:s}=t.input,r=await Tn(o,{type:i,category:a,tags:s?s.split(",").map(l=>l.trim()):void 0,limit:10});if(r.length===0)return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`No global knowledge found matching "${o}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`)]);let c=`## Global Knowledge Search Results

`;c+=`Found **${r.length}** relevant entries for "${o}":

`;for(let{entry:l,relevance:u}of r){let d=l.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";c+=`### ${d} ${l.title}
`,c+=`- **Type**: ${l.type} | **Category**: ${l.category}
`,c+=`- **Tags**: ${l.tags.join(", ")}
`,l.sourceProject&&(c+=`- **Source**: ${l.sourceProject}
`),c+=`- **Summary**: ${l.summary}
`,c+=`- **File**: \`${l.filePath}\`

`}return new M.LanguageModelToolResult([new M.LanguageModelTextPart(c)])}},vn=class{async prepareInvocation(t,n){return{invocationMessage:`Saving insight: ${t.input.title}`,confirmationMessages:{title:"Save Global Insight",message:new M.MarkdownString(`Save this insight to Alex's global knowledge base?

**Title**: ${t.input.title}

This will be available across all your projects.`)}}}async invoke(t,n){await ue();let{title:o,insight:i,category:a,tags:s,problem:r,solution:c}=t.input,l=M.workspace.workspaceFolders,u=l?we.basename(l[0].uri.fsPath):void 0,d=await gc(o,i,a||"general",s?s.split(",").map(p=>p.trim()):[],u,r,c),m=`## \u2705 Insight Saved to Global Knowledge

**ID**: ${d.id}  
**Title**: ${d.title}  
**Category**: ${d.category}  
**Tags**: ${d.tags.join(", ")}  
**Source Project**: ${d.sourceProject||"Unknown"}  
**File**: \`${d.filePath}\`

This insight is now available across all your projects. 
Search for it using: \`@alex /knowledge ${o}\`
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(m)])}},Sn=class{async prepareInvocation(t,n){return{invocationMessage:`Promoting ${we.basename(t.input.filePath)} to global knowledge`,confirmationMessages:{title:"Promote to Global Knowledge",message:new M.MarkdownString(`Promote this project-local knowledge file to global knowledge?

**File**: ${t.input.filePath}

This will make it searchable and available across all your projects.`)}}}async invoke(t,n){let{filePath:o,category:i,additionalTags:a}=t.input;if(!await G.pathExists(o))return new M.LanguageModelToolResult([new M.LanguageModelTextPart(`\u274C File not found: ${o}`)]);let s=await hc(o,i||"general",a?a.split(",").map(c=>c.trim()):[]);if(!s)return new M.LanguageModelToolResult([new M.LanguageModelTextPart("\u274C Failed to promote file to global knowledge.")]);let r=`## \u2705 Knowledge Promoted to Global

**ID**: ${s.id}  
**Title**: ${s.title}  
**Category**: ${s.category}  
**Tags**: ${s.tags.join(", ")}  
**Global File**: \`${s.filePath}\`

This knowledge is now available across all your projects!
`;return new M.LanguageModelToolResult([new M.LanguageModelTextPart(r)])}},kn=class{async prepareInvocation(t,n){return{invocationMessage:"Retrieving global knowledge status..."}}async invoke(t,n){await ue();let o=await In(),i=await Cn(),a=`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${o.totalPatterns} |
| Global Insights | ${o.totalInsights} |
| Known Projects | ${i.projects.length} |

### Knowledge by Category
`;for(let[s,r]of Object.entries(o.categories))a+=`- **${s}**: ${r}
`;if(o.topTags.length>0){a+=`
### Top Tags
`;for(let{tag:s,count:r}of o.topTags)a+=`- ${s}: ${r}
`}if(o.recentEntries.length>0){a+=`
### Recent Entries
`;for(let s of o.recentEntries){let r=s.type==="pattern"?"\u{1F4D0}":"\u{1F4A1}";a+=`- ${r} **${s.title}** (${s.category})
`}}if(i.projects.length>0){a+=`
### Known Projects
`;for(let s of i.projects.slice(0,5))a+=`- **${s.name}** - ${s.knowledgeFiles} knowledge files
`}return a+=`
### Global Knowledge Location
\`${xn()}\`
`,new M.LanguageModelToolResult([new M.LanguageModelTextPart(a)])}};function ga(e){e.subscriptions.push(M.lm.registerTool("alex_global_knowledge_search",new yn),M.lm.registerTool("alex_save_insight",new vn),M.lm.registerTool("alex_promote_knowledge",new Sn),M.lm.registerTool("alex_global_knowledge_status",new kn))}var Se=L(require("vscode")),K=L(Pe()),Ie=L(require("path")),ha=L(require("https"));var je="alex-knowledge-index.json",wa="Alex Cognitive Architecture - Global Knowledge Base";async function wc(){try{return await Se.authentication.getSession("github",["gist"],{createIfNone:!0})}catch(e){console.error("Failed to get GitHub session:",e);return}}async function lt(e,t={}){let n=await wc();if(!n)throw new Error("GitHub authentication required. Please sign in.");return new Promise((o,i)=>{let a=new URL(`https://api.github.com${e}`),s={hostname:a.hostname,path:a.pathname+a.search,method:t.method||"GET",headers:{Authorization:`Bearer ${n.accessToken}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json","User-Agent":"Alex-Cognitive-Architecture-VSCode"}},r=ha.request(s,c=>{let l="";c.on("data",u=>{l+=u}),c.on("end",()=>{if(c.statusCode&&c.statusCode>=200&&c.statusCode<300)if(c.statusCode===204||!l)o(null);else try{o(JSON.parse(l))}catch(u){i(new Error(`Failed to parse GitHub response: ${u}`))}else i(new Error(`GitHub API error (${c.statusCode}): ${l}`))})});r.on("error",c=>i(c)),t.body&&r.write(JSON.stringify(t.body)),r.end()})}function ya(){return Ie.join(ne("root"),"sync-metadata.json")}async function Lt(){let e=ya();try{if(await K.pathExists(e))return await K.readJson(e)}catch{}return{}}async function Je(e){let t=ya();await K.writeJson(t,e,{spaces:2})}async function $n(){let e=await Lt();if(e.gistId)try{let i=await lt(`/gists/${e.gistId}`);if(i)return i}catch{}let t=ne("index");if(await K.pathExists(t))try{let i=await K.readJson(t);if(i.cloudGistId){let a=await lt(`/gists/${i.cloudGistId}`);if(a)return await Je({...e,gistId:a.id}),a}}catch{}let n=await lt("/gists?per_page=100");if(!n)return null;let o=n.find(i=>i.description===wa||i.files[je]);return o&&await Je({...e,gistId:o.id}),o||null}async function va(e){let t={};for(let[i,a]of Object.entries(e))t[i]={content:a};let n=await lt("/gists",{method:"POST",body:{description:wa,public:!1,files:t}});if(!n)throw new Error("Failed to create gist");let o=await Lt();return await Je({...o,gistId:n.id}),n}async function Sa(e,t){let n={};for(let[i,a]of Object.entries(t))n[i]=a===null?null:{content:a};let o=await lt(`/gists/${e}`,{method:"PATCH",body:{files:n}});if(!o)throw new Error("Failed to update gist");return o}function Dt(e){let t=JSON.stringify(e.entries.map(o=>o.id).sort()),n=0;for(let o=0;o<t.length;o++){let i=t.charCodeAt(o);n=(n<<5)-n+i,n=n&n}return n.toString(16)}async function ka(){try{let e=await Lt();if(!e.gistId)return{status:"needs-push",message:"Not yet synced to cloud"};let t=ne("index");if(!await K.pathExists(t))return{status:"needs-pull",message:"No local knowledge, pull from cloud"};let n=await K.readJson(t),o=Dt(n);return e.lastLocalHash&&o!==e.lastLocalHash?{status:"needs-push",message:"Local changes not yet synced"}:{status:"up-to-date",message:"Synced"}}catch(e){return{status:"error",message:`Error: ${e}`}}}async function ut(){try{await ue();let e=ne("index");if(!await K.pathExists(e))return{success:!1,status:"error",message:"No local knowledge to push. Use /saveinsight first."};let t=await K.readJson(e),n=await $n(),o=!n;n||(n=await va({[je]:"{}"})),t.cloudGistId=n.id,t.cloudGistUrl=`https://gist.github.com/${n.id}`;let i={[je]:JSON.stringify(t,null,2)};for(let s of t.entries)if(await K.pathExists(s.filePath)){let r=await K.readFile(s.filePath,"utf-8"),c=Ie.basename(s.filePath);i[c]=r}n=await Sa(n.id,i),await Be(()=>t);let a=Dt(t);return await Je({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:a,lastRemoteHash:a}),{success:!0,status:"up-to-date",message:`Pushed ${t.entries.length} entries to cloud`,entriesPushed:t.entries.length}}catch(e){return{success:!1,status:"error",message:`Push failed: ${e}`}}}async function dt(){try{await ue();let e=await $n();if(!e)return{success:!1,status:"error",message:"No cloud knowledge found. Use /push first."};let t=e.files[je];if(!t)return{success:!1,status:"error",message:"Cloud gist is missing index file"};let n=JSON.parse(t.content);n.cloudGistId=e.id,n.cloudGistUrl=`https://gist.github.com/${e.id}`;let o=0;for(let a of n.entries){let s=Ie.basename(a.filePath),r=e.files[s];if(r){let c=a.type==="pattern"?"patterns":"insights",l=Ie.join(ne(c),s);a.filePath=l,await K.writeFile(l,r.content,"utf-8"),o++}}await Be(()=>n);let i=Dt(n);return await Je({gistId:e.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:i,lastRemoteHash:i}),{success:!0,status:"up-to-date",message:`Pulled ${o} entries from cloud`,entriesPulled:o}}catch(e){return{success:!1,status:"error",message:`Pull failed: ${e}`}}}async function mt(){try{await ue();let e=ne("index"),t;await K.pathExists(e)?t=await K.readJson(e):t={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let n=await $n(),o;n&&n.files[je]?o=JSON.parse(n.files[je].content):o={version:"1.0.0",lastUpdated:new Date().toISOString(),entries:[]};let i=new Map;for(let d of o.entries)i.set(d.id,d);for(let d of t.entries){let m=i.get(d.id);(!m||new Date(d.modified)>new Date(m.modified))&&i.set(d.id,d)}let a={version:"1.0.0",lastUpdated:new Date().toISOString(),cloudGistId:n?.id||t.cloudGistId,cloudGistUrl:n?`https://gist.github.com/${n.id}`:t.cloudGistUrl,entries:Array.from(i.values())},s={[je]:JSON.stringify(a,null,2)};for(let d of a.entries)if(await K.pathExists(d.filePath)){let m=await K.readFile(d.filePath,"utf-8"),p=Ie.basename(d.filePath);s[p]=m}let r=0;if(n)for(let d of o.entries){let m=Ie.basename(d.filePath),p=n.files[m],y=d.type==="pattern"?"patterns":"insights",P=Ie.join(ne(y),m);if(p&&!await K.pathExists(P)){await K.writeFile(P,p.content,"utf-8");let S=i.get(d.id);S&&(S.filePath=P),r++}}n?await Sa(n.id,s):n=await va(s),await Be(()=>a);let c=Dt(a);await Je({gistId:n.id,lastSyncedAt:new Date().toISOString(),lastLocalHash:c,lastRemoteHash:c});let l=t.entries.filter(d=>!o.entries.find(m=>m.id===d.id)).length,u=r;return{success:!0,status:"up-to-date",message:`Synced! ${l} pushed, ${u} pulled. Total: ${a.entries.length} entries.`,entriesPushed:l,entriesPulled:u}}catch(e){return{success:!1,status:"error",message:`Sync failed: ${e}`}}}async function Ye(){let e=await Lt();return e.gistId?`https://gist.github.com/${e.gistId}`:null}var En=class{async prepareInvocation(t,n){let o=t.input.action||"sync";return{invocationMessage:`${o==="push"?"Pushing":o==="pull"?"Pulling":"Syncing"} knowledge with cloud...`,confirmationMessages:{title:"Cloud Sync",message:new Se.MarkdownString(`**${o.toUpperCase()}** global knowledge ${o==="push"?"to":o==="pull"?"from":"with"} GitHub?

This will ${o==="push"?"upload local changes":o==="pull"?"download cloud changes":"merge local and cloud"}.`)}}}async invoke(t,n){let o=t.input.action||"sync",i;switch(o){case"push":i=await ut();break;case"pull":i=await dt();break;default:i=await mt()}let s=`## ${i.success?"\u2705":"\u274C"} Cloud Sync ${i.success?"Complete":"Failed"}

`;s+=`**Status**: ${i.status}
`,s+=`**Message**: ${i.message}
`,i.entriesPushed!==void 0&&(s+=`**Pushed**: ${i.entriesPushed} entries
`),i.entriesPulled!==void 0&&(s+=`**Pulled**: ${i.entriesPulled} entries
`);let r=await Ye();return r&&(s+=`
**Cloud URL**: ${r}
`),new Se.LanguageModelToolResult([new Se.LanguageModelTextPart(s)])}};function ba(e){e.subscriptions.push(Se.lm.registerTool("alex_cloud_sync",new En))}var yc=async(e,t,n,o)=>e.command==="meditate"?await vc(e,t,n,o):e.command==="dream"?await Sc(e,t,n,o):e.command==="learn"?await kc(e,t,n,o):e.command==="status"?await bc(e,t,n,o):e.command==="azure"?await xc(e,t,n,o):e.command==="m365"?await Pc(e,t,n,o):e.command==="profile"?await Cc(e,t,n,o):e.command==="selfactualize"?await Fc(e,t,n,o):e.command==="knowledge"?await Ac(e,t,n,o):e.command==="saveinsight"?await Rc(e,t,n,o):e.command==="promote"?await Mc(e,t,n,o):e.command==="knowledgestatus"?await Lc(e,t,n,o):e.command==="sync"?await Dc(e,t,n,o):e.command==="push"?await Nc(e,t,n,o):e.command==="pull"?await Oc(e,t,n,o):Ic(e.prompt)&&Ec(t)?await $c(e,t,n,o):await Tc(e,t,n,o);async function vc(e,t,n,o){return n.progress("\u{1F9D8} Initiating meditation protocol with self-actualization..."),n.markdown(`## \u{1F9D8} Meditation Protocol Activated

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
`)),n.button({command:"alex.dream",title:"\u{1F319} Run Dream Protocol After",arguments:[]}),{metadata:{command:"meditate"}}}async function Sc(e,t,n,o){return n.progress("\u{1F319} Entering dream state for neural maintenance..."),n.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`),n.button({command:"alex.dream",title:"\u25B6\uFE0F Execute Dream Protocol",arguments:[]}),n.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`),{metadata:{command:"dream"}}}async function kc(e,t,n,o){n.progress("\u{1F4DA} Activating bootstrap learning protocol...");let i=e.prompt||"a new domain";return n.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

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
`),{metadata:{command:"learn",action:"domain-acquisition"}}}async function bc(e,t,n,o){n.progress("\u{1F4CA} Gathering cognitive architecture status...");let i=cn(),a=i.isValid&&i.rootPath?await ln(i.rootPath)??"Unknown":"Unknown";return n.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`),n.button({command:"alex.dream",title:"\u{1F50D} Run Full Health Check",arguments:[]}),{metadata:{command:"status"}}}async function xc(e,t,n,o){return n.progress("\u2601\uFE0F Activating Azure development mode..."),n.markdown(`## \u2601\uFE0F Azure Development Assistant

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
`),{metadata:{command:"azure"}}}async function Pc(e,t,n,o){return n.progress("\u{1F4F1} Activating Microsoft 365 development mode..."),n.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`),{metadata:{command:"m365"}}}async function Cc(e,t,n,o){n.progress("\u{1F464} Accessing user profile...");let i=await Tt();if(!i||!i.name)return n.markdown(`## \u{1F464} Let's Get Acquainted!

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
`),{metadata:{command:"profile",action:"view"}}}async function Tc(e,t,n,o){let i=await Tt(),a=t.history.filter(c=>c instanceof H.ChatRequestTurn||c instanceof H.ChatResponseTurn),s="";if(i){let c=i.nickname||i.name;s=`
## User Profile (Use this to personalize responses)
${c?`- **User's name**: ${c} (always address them by name)`:"- User has not shared their name yet"}
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
`;let r=`You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;try{let c=await H.lm.selectChatModels({vendor:"copilot",family:"gpt-4o"});if(c.length===0){let m=Oi(i);return n.markdown(`${m}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`),{metadata:{command:"general",action:"no-model"}}}let l=c[0],u=[H.LanguageModelChatMessage.User(r),H.LanguageModelChatMessage.User(e.prompt)],d=await l.sendRequest(u,{},o);for await(let m of d.text)n.markdown(m)}catch(c){if(c instanceof H.LanguageModelError)console.error("Language model error:",c.message,c.code),n.markdown("I encountered an issue accessing the language model. You can still use my commands:\n\n- **`/meditate`** - Memory consolidation\n- **`/dream`** - Neural maintenance  \n- **`/learn [topic]`** - Domain acquisition\n- **`/status`** - Architecture status");else throw c}return{metadata:{command:"general"}}}function Ic(e){return[/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,/^(how\s*are\s*you|how'?s\s*it\s*going)/i,/^alex[\s,!?.]*$/i,/^@alex[\s,!?.]*$/i,/^(let'?s\s*(start|begin|get\s*started))/i].some(n=>n.test(e.trim()))}function Ec(e){return e.history.length===0||e.history.length<=2}async function $c(e,t,n,o){let i=await Tt(),a=i?.nickname||i?.name;n.progress("\u{1F9E0} Running self-actualization on session start..."),a?n.markdown(`## \u{1F44B} Hello, ${a}!

`):n.markdown(`## \u{1F44B} Hello!

`),n.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`),n.progress("\u2601\uFE0F Checking global knowledge sync status...");try{let c=await ka();c.status==="needs-pull"?(n.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`),n.markdown(`There may be new knowledge in your cloud. Consider syncing:

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync Global Knowledge",arguments:[]}),n.markdown(`
`)):c.status==="needs-push"&&(n.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`),n.markdown(`You have local insights that aren't backed up to cloud yet.

`),n.button({command:"alex.syncKnowledge",title:"\u2601\uFE0F Sync to Cloud",arguments:[]}),n.markdown(`
`))}catch{}n.markdown(`### \u{1F9E0} Quick Architecture Check

`),n.button({command:"alex.selfActualize",title:"\u{1F9D8} Full Self-Actualization",arguments:[]});let s=cn(),r=s.isValid&&s.rootPath?await ln(s.rootPath)??"Unknown":"Unknown";return n.markdown(`

**Alex v${r}** - Ready to assist!

`),n.markdown(`### What would you like to work on today?

`),n.markdown("- **`/learn [topic]`** - Acquire new domain knowledge\n"),n.markdown("- **`/azure [query]`** - Azure development guidance\n"),n.markdown("- **`/m365 [query]`** - Microsoft 365 development\n"),n.markdown("- **`/knowledge [query]`** - Search global knowledge base\n"),n.markdown("- **`/selfactualize`** - Deep meditation & architecture assessment\n"),{metadata:{command:"greeting"}}}async function Fc(e,t,n,o){return n.progress("\u{1F9D8} Initiating self-actualization protocol..."),n.markdown(`## \u{1F9D8} Self-Actualization Protocol

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
`),n.markdown("- Explicit `/selfactualize` command\n"),{metadata:{command:"selfactualize"}}}async function Ac(e,t,n,o){if(!e.prompt)return n.markdown(`## \u{1F310} Global Knowledge Search

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

`),{metadata:{command:"knowledge"}};n.progress(`\u{1F50D} Searching global knowledge for: ${e.prompt}`);try{let i=await Tn(e.prompt,{limit:5});if(i.length===0)n.markdown(`## \u{1F310} No Global Knowledge Found

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
`)}}}catch(i){n.markdown(`\u274C Error searching global knowledge: ${i}`)}return{metadata:{command:"knowledge"}}}async function Rc(e,t,n,o){return n.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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

`),{metadata:{command:"saveinsight"}}}async function Mc(e,t,n,o){n.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

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
`)}return{metadata:{command:"promote"}}}async function Lc(e,t,n,o){n.progress("\u{1F4CA} Gathering global knowledge status...");try{let i=await In(),a=await Cn();if(n.markdown(`## \u{1F9E0} Global Knowledge Base Status

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
\`${xn()}\`
`)}catch(i){n.markdown(`\u274C Error getting global knowledge status: ${i}`)}return{metadata:{command:"knowledgestatus"}}}async function Dc(e,t,n,o){n.progress("\u2601\uFE0F Syncing knowledge with GitHub...");try{let i=await mt(),a=await Ye();i.success?(n.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${i.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${i.entriesPushed??0} entries |
| \u{1F4E5} Pulled | ${i.entriesPulled??0} entries |

`),a&&n.markdown(`**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Sync Failed

${i.message}

*Make sure you're signed into GitHub in VS Code.*`)}catch(i){n.markdown(`\u274C Error syncing: ${i}`)}return{metadata:{command:"sync"}}}async function Nc(e,t,n,o){n.progress("\u{1F4E4} Pushing knowledge to cloud...");try{let i=await ut(),a=await Ye();i.success?(n.markdown(`## \u{1F4E4} Push Complete

\u2705 ${i.message}
`),a&&n.markdown(`
**Cloud URL**: [View Gist](${a})
`)):n.markdown(`## \u274C Push Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pushing: ${i}`)}return{metadata:{command:"push"}}}async function Oc(e,t,n,o){n.progress("\u{1F4E5} Pulling knowledge from cloud...");try{let i=await dt();i.success?n.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${i.message}
`):n.markdown(`## \u274C Pull Failed

${i.message}`)}catch(i){n.markdown(`\u274C Error pulling: ${i}`)}return{metadata:{command:"pull"}}}var _c={provideFollowups(e,t,n){let o=[];return e.metadata.command==="meditate"&&o.push({prompt:"What insights should I consolidate from our session?",label:"\u{1F4A1} Identify insights"},{prompt:"Create a new domain knowledge file",label:"\u{1F4C4} Create DK file"}),e.metadata.command==="dream"&&o.push({prompt:"Show me the synapse health report",label:"\u{1F4CA} View health report"},{prompt:"What connections need strengthening?",label:"\u{1F517} Check connections"}),e.metadata.command==="learn"&&o.push({prompt:"What are the core concepts I should understand first?",label:"\u{1F3AF} Core concepts"},{prompt:"How does this relate to what I already know?",label:"\u{1F504} Find connections"}),e.metadata.command==="azure"&&o.push({prompt:"Show me Azure best practices for this scenario",label:"\u2728 Best practices"},{prompt:"Generate the infrastructure code",label:"\u{1F3D7}\uFE0F Generate IaC"}),e.metadata.command==="m365"&&o.push({prompt:"Show me code samples for this scenario",label:"\u{1F4BB} Code samples"},{prompt:"What schema do I need?",label:"\u{1F4CB} Get schema"}),e.metadata.command==="profile"&&(e.metadata.action==="onboarding"?o.push({prompt:"I prefer casual conversation with detailed explanations",label:"\u{1F4AC} Casual & detailed"},{prompt:"I prefer formal, concise communication",label:"\u{1F4CB} Formal & brief"},{prompt:"I work with TypeScript, React, and Azure",label:"\u{1F6E0}\uFE0F Set technologies"}):o.push({prompt:"Update my communication preferences",label:"\u270F\uFE0F Edit preferences"},{prompt:"Add new learning goals",label:"\u{1F3AF} Set goals"})),e.metadata.command==="selfactualize"&&o.push({prompt:"/dream",label:"\u{1F319} Run Dream Protocol"},{prompt:"/meditate",label:"\u{1F9D8} Deep Meditation"}),e.metadata.command==="knowledge"&&o.push({prompt:"/saveinsight",label:"\u{1F4A1} Save new insight"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View knowledge status"}),e.metadata.command==="saveinsight"&&o.push({prompt:"/knowledge",label:"\u{1F50D} Search knowledge"},{prompt:"/knowledgestatus",label:"\u{1F4CA} View status"}),e.metadata.command==="promote"&&o.push({prompt:"/knowledgestatus",label:"\u{1F4CA} View status"},{prompt:"/knowledge",label:"\u{1F50D} Search promoted"}),e.metadata.command==="knowledgestatus"&&o.push({prompt:"/knowledge error handling",label:"\u{1F50D} Search knowledge"},{prompt:"/saveinsight",label:"\u{1F4A1} Add insight"},{prompt:"/promote",label:"\u2B06\uFE0F Promote file"}),e.metadata.command==="greeting"&&o.push({prompt:"/learn",label:"\u{1F4DA} Learn something new"},{prompt:"/azure",label:"\u2601\uFE0F Azure development"},{prompt:"/m365",label:"\u{1F4F1} M365 development"},{prompt:"/knowledge",label:"\u{1F310} Global knowledge"}),e.metadata.command==="general"&&o.push({prompt:"/profile",label:"\u{1F464} View/setup profile"}),o.push({prompt:"What can you help me with?",label:"\u2753 Show capabilities"}),o}};function xa(e){let t=H.chat.createChatParticipant("alex.cognitive",yc);return t.iconPath=H.Uri.joinPath(e.extensionUri,"assets","icon.png"),t.followupProvider=_c,t.onDidReceiveFeedback(n=>{console.log("Alex received feedback:",n.kind===H.ChatResultFeedbackKind.Helpful?"helpful":"unhelpful")}),e.subscriptions.push(t),t}var Fn=!1;async function pt(e,t){if(Fn){R.window.showWarningMessage(`Another Alex operation is already in progress. Please wait for it to complete before running "${e}".`);return}Fn=!0;try{return await t()}finally{Fn=!1}}function jc(e){console.log("Alex Cognitive Architecture is now active!"),Gc(e),xa(e),_i(e),ga(e),ba(e),ue().then(()=>{pa().catch(l=>{console.warn("Failed to register current project:",l)})}).catch(l=>{console.warn("Failed to initialize global knowledge directories:",l)});let t=R.commands.registerCommand("alex.initialize",async()=>{await pt("Initialize",()=>$i(e))}),n=R.commands.registerCommand("alex.reset",async()=>{await pt("Reset",()=>Xt(e))}),o=R.commands.registerCommand("alex.dream",async()=>{await pt("Dream Protocol",()=>Ri(e))}),i=R.commands.registerCommand("alex.upgrade",async()=>{await pt("Upgrade",()=>Di(e))}),a=R.commands.registerCommand("alex.selfActualize",async()=>{await pt("Self-Actualization",()=>Ni(e))}),s=R.commands.registerCommand("alex.syncKnowledge",async()=>{await R.window.withProgress({location:R.ProgressLocation.Notification,title:"Syncing Global Knowledge...",cancellable:!1},async()=>{let l=await mt();if(l.success){let u=await Ye(),d=u?"View Gist":void 0;await R.window.showInformationMessage(`\u2705 ${l.message}`,...d?[d]:[])==="View Gist"&&u&&R.env.openExternal(R.Uri.parse(u))}else R.window.showErrorMessage(`\u274C ${l.message}`)})}),r=R.commands.registerCommand("alex.pushKnowledge",async()=>{await R.window.withProgress({location:R.ProgressLocation.Notification,title:"Pushing to Cloud...",cancellable:!1},async()=>{let l=await ut();l.success?R.window.showInformationMessage(`\u2705 ${l.message}`):R.window.showErrorMessage(`\u274C ${l.message}`)})}),c=R.commands.registerCommand("alex.pullKnowledge",async()=>{await R.window.withProgress({location:R.ProgressLocation.Notification,title:"Pulling from Cloud...",cancellable:!1},async()=>{let l=await dt();l.success?R.window.showInformationMessage(`\u2705 ${l.message}`):R.window.showErrorMessage(`\u274C ${l.message}`)})});e.subscriptions.push(t),e.subscriptions.push(n),e.subscriptions.push(o),e.subscriptions.push(i),e.subscriptions.push(a),e.subscriptions.push(s),e.subscriptions.push(r),e.subscriptions.push(c)}async function Gc(e){let t="alex.lastKnownVersion",n=R.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");if(!n)return;let o=n.packageJSON.version,i=e.globalState.get(t);if(await e.globalState.update(t,o),!i||i===o)return;let[a]=i.split(".").map(Number),[s]=o.split(".").map(Number),r=s>a,c="Run Upgrade",l="View Changelog",u="Dismiss",d=r?`\u{1F389} Alex upgraded to v${o}! This is a major release with new features. Run the upgrade to update your workspace files.`:`\u2728 Alex updated to v${o}. Run the upgrade to sync your workspace with the latest improvements.`,m=await R.window.showInformationMessage(d,c,l,u);if(m===c)R.commands.executeCommand("alex.upgrade");else if(m===l){let p=R.Uri.joinPath(n.extensionUri,"CHANGELOG.md");R.commands.executeCommand("markdown.showPreview",p)}}function zc(){}0&&(module.exports={activate,deactivate});
