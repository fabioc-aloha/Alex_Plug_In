"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function") fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            args.push((err, res) => err != null ? reject(err) : resolve(res));
            fn.apply(this, args);
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function") return fn.apply(this, args);
        else {
          args.pop();
          fn.apply(this, args).then((r) => cb(null, r), cb);
        }
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs9) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs9);
      }
      if (!fs9.lutimes) {
        patchLutimes(fs9);
      }
      fs9.chown = chownFix(fs9.chown);
      fs9.fchown = chownFix(fs9.fchown);
      fs9.lchown = chownFix(fs9.lchown);
      fs9.chmod = chmodFix(fs9.chmod);
      fs9.fchmod = chmodFix(fs9.fchmod);
      fs9.lchmod = chmodFix(fs9.lchmod);
      fs9.chownSync = chownFixSync(fs9.chownSync);
      fs9.fchownSync = chownFixSync(fs9.fchownSync);
      fs9.lchownSync = chownFixSync(fs9.lchownSync);
      fs9.chmodSync = chmodFixSync(fs9.chmodSync);
      fs9.fchmodSync = chmodFixSync(fs9.fchmodSync);
      fs9.lchmodSync = chmodFixSync(fs9.lchmodSync);
      fs9.stat = statFix(fs9.stat);
      fs9.fstat = statFix(fs9.fstat);
      fs9.lstat = statFix(fs9.lstat);
      fs9.statSync = statFixSync(fs9.statSync);
      fs9.fstatSync = statFixSync(fs9.fstatSync);
      fs9.lstatSync = statFixSync(fs9.lstatSync);
      if (fs9.chmod && !fs9.lchmod) {
        fs9.lchmod = function(path10, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs9.lchmodSync = function() {
        };
      }
      if (fs9.chown && !fs9.lchown) {
        fs9.lchown = function(path10, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs9.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs9.rename = typeof fs9.rename !== "function" ? fs9.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs9.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
          return rename;
        })(fs9.rename);
      }
      fs9.read = typeof fs9.read !== "function" ? fs9.read : (function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs9, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
      })(fs9.read);
      fs9.readSync = typeof fs9.readSync !== "function" ? fs9.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs9, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs9.readSync);
      function patchLchmod(fs10) {
        fs10.lchmod = function(path10, mode, callback) {
          fs10.open(
            path10,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs10.fchmod(fd, mode, function(err2) {
                fs10.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs10.lchmodSync = function(path10, mode) {
          var fd = fs10.openSync(path10, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs10.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs10.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs10.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs10) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs10.futimes) {
          fs10.lutimes = function(path10, at, mt, cb) {
            fs10.open(path10, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs10.futimes(fd, at, mt, function(er2) {
                fs10.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs10.lutimesSync = function(path10, at, mt) {
            var fd = fs10.openSync(path10, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs10.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs10.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs10.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs10.futimes) {
          fs10.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs10.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs9, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs9, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs9, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs9, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options ? orig.call(fs9, target, options, callback) : orig.call(fs9, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs9, target, options) : orig.call(fs9, target);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs9) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path10, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path10, options);
        Stream.call(this);
        var self = this;
        this.path = path10;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs9.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path10, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path10, options);
        Stream.call(this);
        this.path = path10;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs9.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy3 = { __proto__: getPrototypeOf(obj) };
      else
        var copy3 = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy3, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy3;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    var fs9 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = /* @__PURE__ */ Symbol.for("graceful-fs.queue");
      previousSymbol = /* @__PURE__ */ Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs9[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs9, queue);
      fs9.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs9, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      })(fs9.close);
      fs9.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs9, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs9.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs9[gracefulQueue]);
          require("assert").equal(fs9[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs9[gracefulQueue]);
    }
    module2.exports = patch(clone(fs9));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs9.__patched) {
      module2.exports = patch(fs9);
      fs9.__patched = true;
    }
    function patch(fs10) {
      polyfills(fs10);
      fs10.gracefulify = patch;
      fs10.createReadStream = createReadStream;
      fs10.createWriteStream = createWriteStream;
      var fs$readFile = fs10.readFile;
      fs10.readFile = readFile8;
      function readFile8(path10, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path10, options, cb);
        function go$readFile(path11, options2, cb2, startTime) {
          return fs$readFile(path11, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path11, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs10.writeFile;
      fs10.writeFile = writeFile8;
      function writeFile8(path10, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path10, data, options, cb);
        function go$writeFile(path11, data2, options2, cb2, startTime) {
          return fs$writeFile(path11, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path11, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs10.appendFile;
      if (fs$appendFile)
        fs10.appendFile = appendFile;
      function appendFile(path10, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path10, data, options, cb);
        function go$appendFile(path11, data2, options2, cb2, startTime) {
          return fs$appendFile(path11, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path11, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs10.copyFile;
      if (fs$copyFile)
        fs10.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs10.readdir;
      fs10.readdir = readdir2;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir2(path10, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path11, options2, cb2, startTime) {
          return fs$readdir(path11, fs$readdirCallback(
            path11,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path11, options2, cb2, startTime) {
          return fs$readdir(path11, options2, fs$readdirCallback(
            path11,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path10, options, cb);
        function fs$readdirCallback(path11, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path11, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs10);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs10.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs10.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs10, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs10, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs10, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs10, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path10, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path10, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path10, options) {
        return new fs10.ReadStream(path10, options);
      }
      function createWriteStream(path10, options) {
        return new fs10.WriteStream(path10, options);
      }
      var fs$open = fs10.open;
      fs10.open = open;
      function open(path10, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path10, flags, mode, cb);
        function go$open(path11, flags2, mode2, cb2, startTime) {
          return fs$open(path11, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path11, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs10;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs9[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs9[gracefulQueue].length; ++i) {
        if (fs9[gracefulQueue][i].length > 2) {
          fs9[gracefulQueue][i][3] = now;
          fs9[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs9[gracefulQueue].length === 0)
        return;
      var elem = fs9[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs9[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs9 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "cp",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "glob",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "statfs",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs9[key] === "function";
    });
    Object.assign(exports2, fs9);
    api.forEach((method) => {
      exports2[method] = u(fs9[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs9.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs9.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs9.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs9.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports2.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs9.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs9.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs9.realpath.native === "function") {
      exports2.realpath.native = u(fs9.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/utils.js"(exports2, module2) {
    "use strict";
    var path10 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path10.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs9.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs9.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    function pathExists9(path10) {
      return fs9.access(path10).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists9),
      pathExistsSync: fs9.existsSync
    };
  }
});

// node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path10, atime, mtime) {
      const fd = await fs9.open(path10, "r+");
      let closeErr = null;
      try {
        await fs9.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs9.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path10, atime, mtime) {
      const fd = fs9.openSync(path10, "r+");
      fs9.futimesSync(fd, atime, mtime);
      return fs9.closeSync(fd);
    }
    module2.exports = {
      utimesMillis: u(utimesMillis),
      utimesMillisSync
    };
  }
});

// node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var path10 = require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs9.stat(file, { bigint: true }) : (file) => fs9.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT") return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs9.statSync(file, { bigint: true }) : (file) => fs9.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    async function checkPaths(src, dest, funcName, opts) {
      const { srcStat, destStat } = await getStats(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path10.basename(src);
          const destBaseName = path10.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path10.basename(src);
          const destBaseName = path10.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    async function checkParentPaths(src, srcStat, dest, funcName) {
      const srcParent = path10.resolve(path10.dirname(src));
      const destParent = path10.resolve(path10.dirname(dest));
      if (destParent === srcParent || destParent === path10.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs9.stat(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPaths(src, srcStat, destParent, funcName);
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path10.resolve(path10.dirname(src));
      const destParent = path10.resolve(path10.dirname(dest));
      if (destParent === srcParent || destParent === path10.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs9.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino !== void 0 && destStat.dev !== void 0 && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path10.resolve(src).split(path10.sep).filter((i) => i);
      const destArr = path10.resolve(dest).split(path10.sep).filter((i) => i);
      return srcArr.every((cur, i) => destArr[i] === cur);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      // checkPaths
      checkPaths: u(checkPaths),
      checkPathsSync,
      // checkParent
      checkParentPaths: u(checkParentPaths),
      checkParentPathsSync,
      // Misc
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/fs-extra/lib/util/async.js
var require_async = __commonJS({
  "node_modules/fs-extra/lib/util/async.js"(exports2, module2) {
    "use strict";
    async function asyncIteratorConcurrentProcess(iterator, fn) {
      const promises = [];
      for await (const item of iterator) {
        promises.push(
          fn(item).then(
            () => null,
            (err) => err ?? new Error("unknown error")
          )
        );
      }
      await Promise.all(
        promises.map(
          (promise) => promise.then((possibleErr) => {
            if (possibleErr !== null) throw possibleErr;
          })
        )
      );
    }
    module2.exports = {
      asyncIteratorConcurrentProcess
    };
  }
});

// node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var path10 = require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists: pathExists9 } = require_path_exists();
    var { utimesMillis } = require_utimes();
    var stat2 = require_stat();
    var { asyncIteratorConcurrentProcess } = require_async();
    async function copy3(src, dest, opts = {}) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      const { srcStat, destStat } = await stat2.checkPaths(src, dest, "copy", opts);
      await stat2.checkParentPaths(src, srcStat, dest, "copy");
      const include = await runFilter(src, dest, opts);
      if (!include) return;
      const destParent = path10.dirname(dest);
      const dirExists = await pathExists9(destParent);
      if (!dirExists) {
        await mkdirs(destParent);
      }
      await getStatsAndPerformCopy(destStat, src, dest, opts);
    }
    async function runFilter(src, dest, opts) {
      if (!opts.filter) return true;
      return opts.filter(src, dest);
    }
    async function getStatsAndPerformCopy(destStat, src, dest, opts) {
      const statFn = opts.dereference ? fs9.stat : fs9.lstat;
      const srcStat = await statFn(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
      if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    async function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat) return copyFile(srcStat, src, dest, opts);
      if (opts.overwrite) {
        await fs9.unlink(dest);
        return copyFile(srcStat, src, dest, opts);
      }
      if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts) {
      await fs9.copyFile(src, dest);
      if (opts.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs9.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs9.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs9.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) {
        await fs9.mkdir(dest);
      }
      await asyncIteratorConcurrentProcess(await fs9.opendir(src), async (item) => {
        const srcItem = path10.join(src, item.name);
        const destItem = path10.join(dest, item.name);
        const include = await runFilter(srcItem, destItem, opts);
        if (include) {
          const { destStat: destStat2 } = await stat2.checkPaths(srcItem, destItem, "copy", opts);
          await getStatsAndPerformCopy(destStat2, srcItem, destItem, opts);
        }
      });
      if (!destStat) {
        await fs9.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts) {
      let resolvedSrc = await fs9.readlink(src);
      if (opts.dereference) {
        resolvedSrc = path10.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs9.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs9.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts.dereference) {
        resolvedDest = path10.resolve(process.cwd(), resolvedDest);
      }
      if (resolvedSrc !== resolvedDest) {
        if (stat2.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat2.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
      }
      await fs9.unlink(dest);
      return fs9.symlink(resolvedSrc, dest);
    }
    module2.exports = copy3;
  }
});

// node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/fs-extra/lib/copy/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path10 = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat2 = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat2.checkPathsSync(src, dest, "copy", opts);
      stat2.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts.filter && !opts.filter(src, dest)) return;
      const destParent = path10.dirname(dest);
      if (!fs9.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs9.statSync : fs9.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat) return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs9.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs9.copyFileSync(src, dest);
      if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs9.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs9.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs9.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      const dir = fs9.opendirSync(src);
      try {
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
          copyDirItem(dirent.name, src, dest, opts);
        }
      } finally {
        dir.closeSync();
      }
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path10.join(src, item);
      const destItem = path10.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem)) return;
      const { destStat } = stat2.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs9.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path10.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs9.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs9.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs9.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path10.resolve(process.cwd(), resolvedDest);
        }
        if (resolvedSrc !== resolvedDest) {
          if (stat2.isSrcSubdir(resolvedSrc, resolvedDest)) {
            throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
          }
          if (stat2.isSrcSubdir(resolvedDest, resolvedSrc)) {
            throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
          }
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs9.unlinkSync(dest);
      return fs9.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove3(path10, callback) {
      fs9.rm(path10, { recursive: true, force: true }, callback);
    }
    function removeSync(path10) {
      fs9.rmSync(path10, { recursive: true, force: true });
    }
    module2.exports = {
      remove: u(remove3),
      removeSync
    };
  }
});

// node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    var path10 = require("path");
    var mkdir = require_mkdirs();
    var remove3 = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs9.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove3.remove(path10.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs9.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path10.join(dir, item);
        remove3.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path10 = require("path");
    var fs9 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs9.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path10.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs9.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs9.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs9.writeFile(file, "");
      } else {
        await fs9.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs9.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path10.dirname(file);
      try {
        if (!fs9.statSync(dir).isDirectory()) {
          fs9.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs9.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path10 = require("path");
    var fs9 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists: pathExists9 } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs9.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs9.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return;
      const dir = path10.dirname(dstpath);
      const dirExists = await pathExists9(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs9.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs9.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs9.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path10.dirname(dstpath);
      const dirExists = fs9.existsSync(dir);
      if (dirExists) return fs9.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs9.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path10 = require("path");
    var fs9 = require_fs();
    var { pathExists: pathExists9 } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path10.isAbsolute(srcpath)) {
        try {
          await fs9.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path10.dirname(dstpath);
      const relativeToDst = path10.join(dstdir, srcpath);
      const exists = await pathExists9(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs9.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path10.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path10.isAbsolute(srcpath)) {
        const exists2 = fs9.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path10.dirname(dstpath);
      const relativeToDst = path10.join(dstdir, srcpath);
      const exists = fs9.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs9.existsSync(srcpath);
      if (!srcExists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path10.relative(dstdir, srcpath)
      };
    }
    module2.exports = {
      symlinkPaths: u(symlinkPaths),
      symlinkPathsSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs9.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs9.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType: u(symlinkType),
      symlinkTypeSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var path10 = require("path");
    var fs9 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists: pathExists9 } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs9.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs9.stat(srcpath),
          fs9.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative2 = await symlinkPaths(srcpath, dstpath);
      srcpath = relative2.toDst;
      const toType = await symlinkType(relative2.toCwd, type);
      const dir = path10.dirname(dstpath);
      if (!await pathExists9(dir)) {
        await mkdirs(dir);
      }
      return fs9.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs9.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs9.statSync(srcpath);
        const dstStat = fs9.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative2 = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative2.toDst;
      type = symlinkTypeSync(relative2.toCwd, type);
      const dir = path10.dirname(dstpath);
      const exists = fs9.existsSync(dir);
      if (exists) return fs9.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs9.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/jsonfile/utils.js"(exports2, module2) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content)) content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/jsonfile/index.js"(exports2, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs9.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile8 = universalify.fromPromise(_readFile);
    function readFileSync(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs9 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs9.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs9.writeFile)(file, str, options);
    }
    var writeFile8 = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs9 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs9.writeFileSync(file, str, options);
    }
    module2.exports = {
      readFile: readFile8,
      readFileSync,
      writeFile: writeFile8,
      writeFileSync
    };
  }
});

// node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/fs-extra/lib/output-file/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs9 = require_fs();
    var path10 = require("path");
    var mkdir = require_mkdirs();
    var pathExists9 = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path10.dirname(file);
      if (!await pathExists9(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs9.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path10.dirname(file);
      if (!fs9.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs9.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs9 = require_fs();
    var path10 = require("path");
    var { copy: copy3 } = require_copy2();
    var { remove: remove3 } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists: pathExists9 } = require_path_exists();
    var stat2 = require_stat();
    async function move2(src, dest, opts = {}) {
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = await stat2.checkPaths(src, dest, "move", opts);
      await stat2.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path10.dirname(dest);
      const parsedParentPath = path10.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove3(dest);
        } else if (await pathExists9(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs9.rename(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") {
          throw err;
        }
        await moveAcrossDevice(src, dest, overwrite);
      }
    }
    async function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      await copy3(src, dest, opts);
      return remove3(src);
    }
    module2.exports = move2;
  }
});

// node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/fs-extra/lib/move/move-sync.js"(exports2, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    var path10 = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat2 = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat2.checkPathsSync(src, dest, "move", opts);
      stat2.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path10.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path10.dirname(dest);
      const parsedPath = path10.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs9.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs9.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// node_modules/retry/lib/retry_operation.js
var require_retry_operation = __commonJS({
  "node_modules/retry/lib/retry_operation.js"(exports2, module2) {
    function RetryOperation(timeouts, options) {
      if (typeof options === "boolean") {
        options = { forever: options };
      }
      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
      this._timeouts = timeouts;
      this._options = options || {};
      this._maxRetryTime = options && options.maxRetryTime || Infinity;
      this._fn = null;
      this._errors = [];
      this._attempts = 1;
      this._operationTimeout = null;
      this._operationTimeoutCb = null;
      this._timeout = null;
      this._operationStart = null;
      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0);
      }
    }
    module2.exports = RetryOperation;
    RetryOperation.prototype.reset = function() {
      this._attempts = 1;
      this._timeouts = this._originalTimeouts;
    };
    RetryOperation.prototype.stop = function() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeouts = [];
      this._cachedTimeouts = null;
    };
    RetryOperation.prototype.retry = function(err) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      if (!err) {
        return false;
      }
      var currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.unshift(new Error("RetryOperation timeout occurred"));
        return false;
      }
      this._errors.push(err);
      var timeout = this._timeouts.shift();
      if (timeout === void 0) {
        if (this._cachedTimeouts) {
          this._errors.splice(this._errors.length - 1, this._errors.length);
          this._timeouts = this._cachedTimeouts.slice(0);
          timeout = this._timeouts.shift();
        } else {
          return false;
        }
      }
      var self = this;
      var timer = setTimeout(function() {
        self._attempts++;
        if (self._operationTimeoutCb) {
          self._timeout = setTimeout(function() {
            self._operationTimeoutCb(self._attempts);
          }, self._operationTimeout);
          if (self._options.unref) {
            self._timeout.unref();
          }
        }
        self._fn(self._attempts);
      }, timeout);
      if (this._options.unref) {
        timer.unref();
      }
      return true;
    };
    RetryOperation.prototype.attempt = function(fn, timeoutOps) {
      this._fn = fn;
      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout;
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb;
        }
      }
      var self = this;
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function() {
          self._operationTimeoutCb();
        }, self._operationTimeout);
      }
      this._operationStart = (/* @__PURE__ */ new Date()).getTime();
      this._fn(this._attempts);
    };
    RetryOperation.prototype.try = function(fn) {
      console.log("Using RetryOperation.try() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = function(fn) {
      console.log("Using RetryOperation.start() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = RetryOperation.prototype.try;
    RetryOperation.prototype.errors = function() {
      return this._errors;
    };
    RetryOperation.prototype.attempts = function() {
      return this._attempts;
    };
    RetryOperation.prototype.mainError = function() {
      if (this._errors.length === 0) {
        return null;
      }
      var counts = {};
      var mainError = null;
      var mainErrorCount = 0;
      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i];
        var message = error.message;
        var count = (counts[message] || 0) + 1;
        counts[message] = count;
        if (count >= mainErrorCount) {
          mainError = error;
          mainErrorCount = count;
        }
      }
      return mainError;
    };
  }
});

// node_modules/retry/lib/retry.js
var require_retry = __commonJS({
  "node_modules/retry/lib/retry.js"(exports2) {
    var RetryOperation = require_retry_operation();
    exports2.operation = function(options) {
      var timeouts = exports2.timeouts(options);
      return new RetryOperation(timeouts, {
        forever: options && options.forever,
        unref: options && options.unref,
        maxRetryTime: options && options.maxRetryTime
      });
    };
    exports2.timeouts = function(options) {
      if (options instanceof Array) {
        return [].concat(options);
      }
      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1e3,
        maxTimeout: Infinity,
        randomize: false
      };
      for (var key in options) {
        opts[key] = options[key];
      }
      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error("minTimeout is greater than maxTimeout");
      }
      var timeouts = [];
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts));
      }
      if (options && options.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts));
      }
      timeouts.sort(function(a, b) {
        return a - b;
      });
      return timeouts;
    };
    exports2.createTimeout = function(attempt, opts) {
      var random = opts.randomize ? Math.random() + 1 : 1;
      var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
      timeout = Math.min(timeout, opts.maxTimeout);
      return timeout;
    };
    exports2.wrap = function(obj, options, methods) {
      if (options instanceof Array) {
        methods = options;
        options = null;
      }
      if (!methods) {
        methods = [];
        for (var key in obj) {
          if (typeof obj[key] === "function") {
            methods.push(key);
          }
        }
      }
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        var original = obj[method];
        obj[method] = function retryWrapper(original2) {
          var op = exports2.operation(options);
          var args = Array.prototype.slice.call(arguments, 1);
          var callback = args.pop();
          args.push(function(err) {
            if (op.retry(err)) {
              return;
            }
            if (err) {
              arguments[0] = op.mainError();
            }
            callback.apply(this, arguments);
          });
          op.attempt(function() {
            original2.apply(obj, args);
          });
        }.bind(obj, original);
        obj[method].options = options;
      }
    };
  }
});

// node_modules/retry/index.js
var require_retry2 = __commonJS({
  "node_modules/retry/index.js"(exports2, module2) {
    module2.exports = require_retry();
  }
});

// node_modules/proper-lockfile/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/proper-lockfile/node_modules/signal-exit/signals.js"(exports2, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/proper-lockfile/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/proper-lockfile/node_modules/signal-exit/index.js"(exports2, module2) {
    var process2 = global.process;
    var processOk = function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    };
    if (!processOk(process2)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process2.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove3 = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove3;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code || /* istanbul ignore next */
        0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/proper-lockfile/lib/mtime-precision.js
var require_mtime_precision = __commonJS({
  "node_modules/proper-lockfile/lib/mtime-precision.js"(exports2, module2) {
    "use strict";
    var cacheSymbol = /* @__PURE__ */ Symbol();
    function probe(file, fs9, callback) {
      const cachedPrecision = fs9[cacheSymbol];
      if (cachedPrecision) {
        return fs9.stat(file, (err, stat2) => {
          if (err) {
            return callback(err);
          }
          callback(null, stat2.mtime, cachedPrecision);
        });
      }
      const mtime = new Date(Math.ceil(Date.now() / 1e3) * 1e3 + 5);
      fs9.utimes(file, mtime, mtime, (err) => {
        if (err) {
          return callback(err);
        }
        fs9.stat(file, (err2, stat2) => {
          if (err2) {
            return callback(err2);
          }
          const precision = stat2.mtime.getTime() % 1e3 === 0 ? "s" : "ms";
          Object.defineProperty(fs9, cacheSymbol, { value: precision });
          callback(null, stat2.mtime, precision);
        });
      });
    }
    function getMtime(precision) {
      let now = Date.now();
      if (precision === "s") {
        now = Math.ceil(now / 1e3) * 1e3;
      }
      return new Date(now);
    }
    module2.exports.probe = probe;
    module2.exports.getMtime = getMtime;
  }
});

// node_modules/proper-lockfile/lib/lockfile.js
var require_lockfile = __commonJS({
  "node_modules/proper-lockfile/lib/lockfile.js"(exports2, module2) {
    "use strict";
    var path10 = require("path");
    var fs9 = require_graceful_fs();
    var retry = require_retry2();
    var onExit = require_signal_exit();
    var mtimePrecision = require_mtime_precision();
    var locks = {};
    function getLockFile(file, options) {
      return options.lockfilePath || `${file}.lock`;
    }
    function resolveCanonicalPath(file, options, callback) {
      if (!options.realpath) {
        return callback(null, path10.resolve(file));
      }
      options.fs.realpath(file, callback);
    }
    function acquireLock(file, options, callback) {
      const lockfilePath = getLockFile(file, options);
      options.fs.mkdir(lockfilePath, (err) => {
        if (!err) {
          return mtimePrecision.probe(lockfilePath, options.fs, (err2, mtime, mtimePrecision2) => {
            if (err2) {
              options.fs.rmdir(lockfilePath, () => {
              });
              return callback(err2);
            }
            callback(null, mtime, mtimePrecision2);
          });
        }
        if (err.code !== "EEXIST") {
          return callback(err);
        }
        if (options.stale <= 0) {
          return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file }));
        }
        options.fs.stat(lockfilePath, (err2, stat2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return acquireLock(file, { ...options, stale: 0 }, callback);
            }
            return callback(err2);
          }
          if (!isLockStale(stat2, options)) {
            return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file }));
          }
          removeLock(file, options, (err3) => {
            if (err3) {
              return callback(err3);
            }
            acquireLock(file, { ...options, stale: 0 }, callback);
          });
        });
      });
    }
    function isLockStale(stat2, options) {
      return stat2.mtime.getTime() < Date.now() - options.stale;
    }
    function removeLock(file, options, callback) {
      options.fs.rmdir(getLockFile(file, options), (err) => {
        if (err && err.code !== "ENOENT") {
          return callback(err);
        }
        callback();
      });
    }
    function updateLock(file, options) {
      const lock3 = locks[file];
      if (lock3.updateTimeout) {
        return;
      }
      lock3.updateDelay = lock3.updateDelay || options.update;
      lock3.updateTimeout = setTimeout(() => {
        lock3.updateTimeout = null;
        options.fs.stat(lock3.lockfilePath, (err, stat2) => {
          const isOverThreshold = lock3.lastUpdate + options.stale < Date.now();
          if (err) {
            if (err.code === "ENOENT" || isOverThreshold) {
              return setLockAsCompromised(file, lock3, Object.assign(err, { code: "ECOMPROMISED" }));
            }
            lock3.updateDelay = 1e3;
            return updateLock(file, options);
          }
          const isMtimeOurs = lock3.mtime.getTime() === stat2.mtime.getTime();
          if (!isMtimeOurs) {
            return setLockAsCompromised(
              file,
              lock3,
              Object.assign(
                new Error("Unable to update lock within the stale threshold"),
                { code: "ECOMPROMISED" }
              )
            );
          }
          const mtime = mtimePrecision.getMtime(lock3.mtimePrecision);
          options.fs.utimes(lock3.lockfilePath, mtime, mtime, (err2) => {
            const isOverThreshold2 = lock3.lastUpdate + options.stale < Date.now();
            if (lock3.released) {
              return;
            }
            if (err2) {
              if (err2.code === "ENOENT" || isOverThreshold2) {
                return setLockAsCompromised(file, lock3, Object.assign(err2, { code: "ECOMPROMISED" }));
              }
              lock3.updateDelay = 1e3;
              return updateLock(file, options);
            }
            lock3.mtime = mtime;
            lock3.lastUpdate = Date.now();
            lock3.updateDelay = null;
            updateLock(file, options);
          });
        });
      }, lock3.updateDelay);
      if (lock3.updateTimeout.unref) {
        lock3.updateTimeout.unref();
      }
    }
    function setLockAsCompromised(file, lock3, err) {
      lock3.released = true;
      if (lock3.updateTimeout) {
        clearTimeout(lock3.updateTimeout);
      }
      if (locks[file] === lock3) {
        delete locks[file];
      }
      lock3.options.onCompromised(err);
    }
    function lock2(file, options, callback) {
      options = {
        stale: 1e4,
        update: null,
        realpath: true,
        retries: 0,
        fs: fs9,
        onCompromised: (err) => {
          throw err;
        },
        ...options
      };
      options.retries = options.retries || 0;
      options.retries = typeof options.retries === "number" ? { retries: options.retries } : options.retries;
      options.stale = Math.max(options.stale || 0, 2e3);
      options.update = options.update == null ? options.stale / 2 : options.update || 0;
      options.update = Math.max(Math.min(options.update, options.stale / 2), 1e3);
      resolveCanonicalPath(file, options, (err, file2) => {
        if (err) {
          return callback(err);
        }
        const operation = retry.operation(options.retries);
        operation.attempt(() => {
          acquireLock(file2, options, (err2, mtime, mtimePrecision2) => {
            if (operation.retry(err2)) {
              return;
            }
            if (err2) {
              return callback(operation.mainError());
            }
            const lock3 = locks[file2] = {
              lockfilePath: getLockFile(file2, options),
              mtime,
              mtimePrecision: mtimePrecision2,
              options,
              lastUpdate: Date.now()
            };
            updateLock(file2, options);
            callback(null, (releasedCallback) => {
              if (lock3.released) {
                return releasedCallback && releasedCallback(Object.assign(new Error("Lock is already released"), { code: "ERELEASED" }));
              }
              unlock(file2, { ...options, realpath: false }, releasedCallback);
            });
          });
        });
      });
    }
    function unlock(file, options, callback) {
      options = {
        fs: fs9,
        realpath: true,
        ...options
      };
      resolveCanonicalPath(file, options, (err, file2) => {
        if (err) {
          return callback(err);
        }
        const lock3 = locks[file2];
        if (!lock3) {
          return callback(Object.assign(new Error("Lock is not acquired/owned by you"), { code: "ENOTACQUIRED" }));
        }
        lock3.updateTimeout && clearTimeout(lock3.updateTimeout);
        lock3.released = true;
        delete locks[file2];
        removeLock(file2, options, callback);
      });
    }
    function check(file, options, callback) {
      options = {
        stale: 1e4,
        realpath: true,
        fs: fs9,
        ...options
      };
      options.stale = Math.max(options.stale || 0, 2e3);
      resolveCanonicalPath(file, options, (err, file2) => {
        if (err) {
          return callback(err);
        }
        options.fs.stat(getLockFile(file2, options), (err2, stat2) => {
          if (err2) {
            return err2.code === "ENOENT" ? callback(null, false) : callback(err2);
          }
          return callback(null, !isLockStale(stat2, options));
        });
      });
    }
    function getLocks() {
      return locks;
    }
    onExit(() => {
      for (const file in locks) {
        const options = locks[file].options;
        try {
          options.fs.rmdirSync(getLockFile(file, options));
        } catch (e) {
        }
      }
    });
    module2.exports.lock = lock2;
    module2.exports.unlock = unlock;
    module2.exports.check = check;
    module2.exports.getLocks = getLocks;
  }
});

// node_modules/proper-lockfile/lib/adapter.js
var require_adapter = __commonJS({
  "node_modules/proper-lockfile/lib/adapter.js"(exports2, module2) {
    "use strict";
    var fs9 = require_graceful_fs();
    function createSyncFs(fs10) {
      const methods = ["mkdir", "realpath", "stat", "rmdir", "utimes"];
      const newFs = { ...fs10 };
      methods.forEach((method) => {
        newFs[method] = (...args) => {
          const callback = args.pop();
          let ret;
          try {
            ret = fs10[`${method}Sync`](...args);
          } catch (err) {
            return callback(err);
          }
          callback(null, ret);
        };
      });
      return newFs;
    }
    function toPromise(method) {
      return (...args) => new Promise((resolve, reject) => {
        args.push((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
        method(...args);
      });
    }
    function toSync(method) {
      return (...args) => {
        let err;
        let result;
        args.push((_err, _result) => {
          err = _err;
          result = _result;
        });
        method(...args);
        if (err) {
          throw err;
        }
        return result;
      };
    }
    function toSyncOptions(options) {
      options = { ...options };
      options.fs = createSyncFs(options.fs || fs9);
      if (typeof options.retries === "number" && options.retries > 0 || options.retries && typeof options.retries.retries === "number" && options.retries.retries > 0) {
        throw Object.assign(new Error("Cannot use retries with the sync api"), { code: "ESYNC" });
      }
      return options;
    }
    module2.exports = {
      toPromise,
      toSync,
      toSyncOptions
    };
  }
});

// node_modules/proper-lockfile/index.js
var require_proper_lockfile = __commonJS({
  "node_modules/proper-lockfile/index.js"(exports2, module2) {
    "use strict";
    var lockfile2 = require_lockfile();
    var { toPromise, toSync, toSyncOptions } = require_adapter();
    async function lock2(file, options) {
      const release = await toPromise(lockfile2.lock)(file, options);
      return toPromise(release);
    }
    function lockSync(file, options) {
      const release = toSync(lockfile2.lock)(file, toSyncOptions(options));
      return toSync(release);
    }
    function unlock(file, options) {
      return toPromise(lockfile2.unlock)(file, options);
    }
    function unlockSync(file, options) {
      return toSync(lockfile2.unlock)(file, toSyncOptions(options));
    }
    function check(file, options) {
      return toPromise(lockfile2.check)(file, options);
    }
    function checkSync(file, options) {
      return toSync(lockfile2.check)(file, toSyncOptions(options));
    }
    module2.exports = lock2;
    module2.exports.lock = lock2;
    module2.exports.unlock = unlock;
    module2.exports.lockSync = lockSync;
    module2.exports.unlockSync = unlockSync;
    module2.exports.check = check;
    module2.exports.checkSync = checkSync;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode10 = __toESM(require("vscode"));

// src/commands/initialize.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require_lib());
var path = __toESM(require("path"));
async function initializeArchitecture(context) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage(
      "No workspace folder open. Please open a project folder first (File \u2192 Open Folder), then run this command again."
    );
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const markerFile = path.join(rootPath, ".github", "copilot-instructions.md");
  if (await fs.pathExists(markerFile)) {
    const result = await vscode.window.showWarningMessage(
      'Alex is already installed in this workspace.\n\n\u2022 To update to a new version, use "Alex: Upgrade"\n\u2022 To completely reinstall, choose Reset below',
      "Upgrade Instead",
      "Reset Architecture",
      "Cancel"
    );
    if (result === "Upgrade Instead") {
      await vscode.commands.executeCommand("alex.upgrade");
    } else if (result === "Reset Architecture") {
      await resetArchitecture(context);
    }
    return;
  }
  await performInitialization(context, rootPath, false);
}
async function resetArchitecture(context) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("Please open a workspace folder to reset Alex.");
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const confirm = await vscode.window.showWarningMessage(
    '\u26A0\uFE0F RESET will permanently delete all Alex memory files!\n\nThis includes:\n\u2022 All learned domain knowledge\n\u2022 Custom instructions and prompts\n\u2022 Synaptic network connections\n\nConsider using "Alex: Upgrade" instead to preserve your knowledge.',
    { modal: true },
    "Yes, Delete Everything",
    "Upgrade Instead",
    "Cancel"
  );
  if (confirm === "Upgrade Instead") {
    await vscode.commands.executeCommand("alex.upgrade");
    return;
  }
  if (confirm !== "Yes, Delete Everything") {
    return;
  }
  const pathsToDelete = [
    path.join(rootPath, ".github", "copilot-instructions.md"),
    path.join(rootPath, ".github", "instructions"),
    path.join(rootPath, ".github", "prompts"),
    path.join(rootPath, ".github", "episodic"),
    path.join(rootPath, ".github", "domain-knowledge"),
    path.join(rootPath, ".github", "config"),
    path.join(rootPath, ".alex-manifest.json")
    // Clean up manifest too
  ];
  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Resetting Alex Architecture...",
      cancellable: false
    }, async (progress) => {
      progress.report({ message: "Cleaning up existing files..." });
      for (const p of pathsToDelete) {
        await fs.remove(p);
      }
    });
    await performInitialization(context, rootPath, true);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to reset Alex: ${error.message}`);
  }
}
async function performInitialization(context, rootPath, overwrite) {
  const extensionPath = context.extensionPath;
  const requiredSource = path.join(extensionPath, ".github", "copilot-instructions.md");
  if (!await fs.pathExists(requiredSource)) {
    vscode.window.showErrorMessage(
      "Extension installation appears corrupted - missing core files.\n\nPlease reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace."
    );
    return;
  }
  const sources = [
    { src: path.join(extensionPath, ".github", "copilot-instructions.md"), dest: path.join(rootPath, ".github", "copilot-instructions.md") },
    { src: path.join(extensionPath, ".github", "instructions"), dest: path.join(rootPath, ".github", "instructions") },
    { src: path.join(extensionPath, ".github", "prompts"), dest: path.join(rootPath, ".github", "prompts") },
    { src: path.join(extensionPath, ".github", "episodic"), dest: path.join(rootPath, ".github", "episodic") },
    { src: path.join(extensionPath, ".github", "domain-knowledge"), dest: path.join(rootPath, ".github", "domain-knowledge") },
    { src: path.join(extensionPath, ".github", "config"), dest: path.join(rootPath, ".github", "config") },
    { src: path.join(extensionPath, ".github", "agents"), dest: path.join(rootPath, ".github", "agents") }
  ];
  try {
    const testDir = path.join(rootPath, ".github");
    await fs.ensureDir(testDir);
    const testFile = path.join(testDir, ".write-test");
    try {
      await fs.writeFile(testFile, "test");
      await fs.remove(testFile);
    } catch (permError) {
      throw new Error(`Cannot write to workspace - check folder permissions: ${permError.message}`);
    }
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Initializing Alex Cognitive Architecture...",
      cancellable: false
    }, async (progress) => {
      for (const item of sources) {
        progress.report({ message: `Copying ${path.basename(item.dest)}...` });
        if (await fs.pathExists(item.src)) {
          await fs.copy(item.src, item.dest, { overwrite });
        } else {
          console.warn(`Source not found: ${item.src}`);
        }
      }
    });
    const result = await vscode.window.showInformationMessage(
      '\u2705 Alex Cognitive Architecture initialized!\n\nNext steps:\n1. Open any file and start chatting with your AI assistant\n2. Run "Alex: Dream" periodically to maintain neural health\n3. Ask Alex to learn new domains as needed',
      "Open Main Brain File",
      "Run Dream Protocol",
      "Close"
    );
    if (result === "Open Main Brain File") {
      const brainFile = path.join(rootPath, ".github", "copilot-instructions.md");
      const doc = await vscode.workspace.openTextDocument(brainFile);
      await vscode.window.showTextDocument(doc);
    } else if (result === "Run Dream Protocol") {
      await vscode.commands.executeCommand("alex.dream");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to initialize Alex: ${error.message}

Try closing VS Code, deleting the .github folder, and running initialize again.`);
  }
}

// src/commands/dream.ts
var vscode2 = __toESM(require("vscode"));
var fs2 = __toESM(require_lib());
var path2 = __toESM(require("path"));
var consolidatedMappings = {
  "enhanced-meditation-protocol.prompt.md": "unified-meditation-protocols.prompt.md",
  "meditation-consolidation.prompt.md": "unified-meditation-protocols.prompt.md",
  "dream-meditation-distinction.prompt.md": "unified-meditation-protocols.prompt.md",
  "alex-finch-integration.prompt.md": "alex-identity-integration.instructions.md",
  "self-identity-integration.prompt.md": "alex-identity-integration.instructions.md",
  "character-driven-development.instructions.md": "alex-identity-integration.instructions.md",
  "unified-consciousness.instructions.md": "alex-identity-integration.instructions.md",
  "dream-protocol-integration.prompt.md": "dream-state-automation.instructions.md",
  "dream-protocol-mastery-meditation.prompt.md": "dream-state-automation.instructions.md"
};
async function runDreamProtocol(context) {
  const workspaceFolders = vscode2.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode2.window.showErrorMessage(
      "No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Dream Protocol."
    );
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  await vscode2.window.withProgress({
    location: vscode2.ProgressLocation.Notification,
    title: "Running Dream Protocol...",
    cancellable: false
  }, async (progress) => {
    progress.report({ message: "Scanning neural network..." });
    const patterns = [
      ".github/copilot-instructions.md",
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/episodic/*.md",
      ".github/domain-knowledge/*.md"
    ];
    let allFiles = [];
    for (const pattern of patterns) {
      const relativePattern = new vscode2.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode2.workspace.findFiles(relativePattern);
      allFiles = allFiles.concat(files.map((uri) => uri.fsPath));
    }
    allFiles = [...new Set(allFiles)];
    if (allFiles.length === 0) {
      const result = await vscode2.window.showWarningMessage(
        "No Alex memory files found in this workspace.\n\nWould you like to initialize Alex Cognitive Architecture now?",
        "Initialize Alex",
        "Cancel"
      );
      if (result === "Initialize Alex") {
        await vscode2.commands.executeCommand("alex.initialize");
      }
      return;
    }
    const synapses = [];
    const fileSet = new Set(allFiles.map((f) => path2.normalize(f).toLowerCase()));
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
    for (const file of allFiles) {
      let content;
      try {
        content = await fs2.readFile(file, "utf-8");
      } catch (readError) {
        console.error(`Failed to read file ${file}:`, readError);
        continue;
      }
      const lines = content.split("\n");
      let inCodeBlock = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith("```")) {
          inCodeBlock = !inCodeBlock;
          continue;
        }
        if (inCodeBlock) {
          continue;
        }
        let match;
        while ((match = synapseRegex.exec(line)) !== null) {
          const targetName = match[1].trim();
          let targetExists = Array.from(fileSet).some((f) => f.endsWith(path2.normalize(targetName).toLowerCase()));
          if (!targetExists) {
            const absolutePath = path2.join(rootPath, targetName);
            if (await fs2.pathExists(absolutePath)) {
              targetExists = true;
            } else {
              const found = await vscode2.workspace.findFiles(new vscode2.RelativePattern(workspaceFolders[0], `**/${targetName}`));
              if (found.length > 0) {
                targetExists = true;
              }
            }
          }
          if (!targetExists) {
            const sourceDir = path2.dirname(file);
            const relativePath = path2.join(sourceDir, targetName);
            if (await fs2.pathExists(relativePath)) {
              targetExists = true;
            }
          }
          const ignoredFiles = ["target-file.md", "CHANGELOG.md"];
          if (ignoredFiles.includes(targetName)) {
            targetExists = true;
          }
          synapses.push({
            sourceFile: file,
            targetFile: targetName,
            strength: match[2].trim(),
            type: match[3]?.trim() || "association",
            direction: match[4]?.trim() || "unidirectional",
            condition: match[5]?.trim(),
            line: i + 1,
            isValid: targetExists
          });
        }
      }
    }
    let brokenSynapses = synapses.filter((s) => !s.isValid);
    const referencedFiles = new Set(synapses.map((s) => s.targetFile.toLowerCase()));
    const repairedSynapses = [];
    const remainingBrokenSynapses = [];
    for (const synapse of brokenSynapses) {
      const targetName = path2.basename(synapse.targetFile);
      if (consolidatedMappings[targetName]) {
        const newTarget = consolidatedMappings[targetName];
        try {
          const fileContent = await fs2.readFile(synapse.sourceFile, "utf-8");
          const escapedTarget = synapse.targetFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`\\[${escapedTarget}\\]`, "g");
          if (regex.test(fileContent)) {
            const newContent = fileContent.replace(regex, `[${newTarget}]`);
            await fs2.writeFile(synapse.sourceFile, newContent, "utf-8");
            synapse.repaired = true;
            synapse.newTarget = newTarget;
            repairedSynapses.push(synapse);
          } else {
            remainingBrokenSynapses.push(synapse);
          }
        } catch (error) {
          console.error(`Failed to repair synapse in ${synapse.sourceFile}:`, error);
          remainingBrokenSynapses.push(synapse);
        }
      } else {
        remainingBrokenSynapses.push(synapse);
      }
    }
    brokenSynapses = remainingBrokenSynapses;
    const report = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      totalFiles: allFiles.length,
      totalSynapses: synapses.length,
      brokenSynapses,
      repairedSynapses,
      orphanedFiles: []
    };
    const reportContent = generateReportMarkdown(report);
    const reportPath = path2.join(rootPath, ".github", "episodic", `dream-report-${Date.now()}.md`);
    await fs2.ensureDir(path2.dirname(reportPath));
    await fs2.writeFile(reportPath, reportContent);
    if (brokenSynapses.length > 0) {
      const result = await vscode2.window.showWarningMessage(
        `\u26A0\uFE0F Dream Protocol found ${brokenSynapses.length} broken synapse${brokenSynapses.length > 1 ? "s" : ""}!

${repairedSynapses.length > 0 ? `\u2705 Auto-repaired: ${repairedSynapses.length}
` : ""}\u274C Need manual repair: ${brokenSynapses.length}

Review the report for details on broken connections.`,
        "View Report",
        "Close"
      );
      if (result !== "View Report") {
        return;
      }
    } else {
      const healthStatus = synapses.length > 50 ? "excellent" : synapses.length > 20 ? "good" : "developing";
      const result = await vscode2.window.showInformationMessage(
        `\u2705 Neural network is healthy!

\u{1F4CA} Statistics:
\u2022 ${allFiles.length} memory files
\u2022 ${synapses.length} active synapses
${repairedSynapses.length > 0 ? `\u2022 ${repairedSynapses.length} auto-repaired
` : ""}\u2022 Network health: ${healthStatus}`,
        "View Full Report",
        "Close"
      );
      if (result !== "View Full Report") {
        return;
      }
    }
    const doc = await vscode2.workspace.openTextDocument(reportPath);
    await vscode2.window.showTextDocument(doc);
  });
}
function generateReportMarkdown(report) {
  return `# Dream Protocol Report
**Timestamp**: ${report.timestamp}
**Status**: ${report.brokenSynapses.length === 0 ? "HEALTHY" : "ATTENTION REQUIRED"}

## Statistics
- **Total Memory Files**: ${report.totalFiles}
- **Total Synapses**: ${report.totalSynapses}
- **Broken Connections**: ${report.brokenSynapses.length}
- **Repaired Connections**: ${report.repairedSynapses.length}

## Repaired Synapses
${report.repairedSynapses.length === 0 ? "_None._" : report.repairedSynapses.map(
    (s) => `- **Source**: ${path2.basename(s.sourceFile)}:${s.line}
  - **Old Target**: ${s.targetFile}
  - **New Target**: ${s.newTarget} (Auto-repaired)`
  ).join("\n")}

## Broken Synapses
${report.brokenSynapses.length === 0 ? "_None detected._" : report.brokenSynapses.map(
    (s) => `- **Source**: ${path2.basename(s.sourceFile)}:${s.line}
  - **Target**: ${s.targetFile} (Not found)
  - **Condition**: "${s.condition}"`
  ).join("\n")}

## Recommendations
${report.brokenSynapses.length > 0 ? "- [ ] Repair remaining broken links manually." : "- [x] System is optimized."}
`;
}

// src/commands/upgrade.ts
var vscode3 = __toESM(require("vscode"));
var fs3 = __toESM(require_lib());
var path3 = __toESM(require("path"));
var crypto = __toESM(require("crypto"));
function calculateChecksum(content) {
  return crypto.createHash("md5").update(content.replace(/\r\n/g, "\n")).digest("hex");
}
async function getInstalledVersion(rootPath) {
  const instructionsPath = path3.join(rootPath, ".github", "copilot-instructions.md");
  if (!await fs3.pathExists(instructionsPath)) {
    return null;
  }
  try {
    const content = await fs3.readFile(instructionsPath, "utf8");
    const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);
    return versionMatch ? versionMatch[1] : null;
  } catch {
    return null;
  }
}
async function getExtensionVersion(extensionPath) {
  try {
    const packageJson = await fs3.readJson(path3.join(extensionPath, "package.json"));
    return packageJson.version || "0.0.0";
  } catch (error) {
    console.error("Failed to read extension package.json:", error);
    return "0.0.0";
  }
}
async function loadManifest(rootPath) {
  const manifestPath = path3.join(rootPath, ".alex-manifest.json");
  if (await fs3.pathExists(manifestPath)) {
    try {
      return await fs3.readJson(manifestPath);
    } catch (error) {
      console.error("Failed to parse manifest (may be corrupted):", error);
      return null;
    }
  }
  return null;
}
async function autoMergeBrainFile(rootPath, extensionPath, newVersion) {
  const userFile = path3.join(rootPath, ".github", "copilot-instructions.md");
  const newFile = path3.join(extensionPath, ".github", "copilot-instructions.md");
  if (!await fs3.pathExists(userFile) || !await fs3.pathExists(newFile)) {
    return { success: false, reason: "File not found" };
  }
  try {
    const userContent = await fs3.readFile(userFile, "utf8");
    const newContent = await fs3.readFile(newFile, "utf8");
    const domainSlotsMatch = userContent.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
    const userDomainSlots = domainSlotsMatch ? domainSlotsMatch[0] : null;
    const userSynapsesSection = userContent.match(/## Synapses[\s\S]*?(?=##|$)/);
    const userLines = userContent.split("\n").length;
    const newLines = newContent.split("\n").length;
    if (userLines > newLines * 1.2) {
      return { success: false, reason: "User file has significant customizations" };
    }
    const userHeaders = userContent.match(/^## [^\n]+/gm) || [];
    const newHeaders = newContent.match(/^## [^\n]+/gm) || [];
    const customHeaders = userHeaders.filter((h) => !newHeaders.includes(h));
    if (customHeaders.length > 2) {
      return { success: false, reason: `User has ${customHeaders.length} custom sections` };
    }
    let mergedContent = newContent;
    if (userDomainSlots && userDomainSlots.includes("P5") && !userDomainSlots.includes("Available for")) {
      const defaultDomainSlots = mergedContent.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
      if (defaultDomainSlots) {
        mergedContent = mergedContent.replace(defaultDomainSlots[0], userDomainSlots);
      }
    }
    mergedContent = mergedContent.replace(
      /\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,
      `**Version**: ${newVersion}`
    );
    await fs3.writeFile(userFile, mergedContent, "utf8");
    return { success: true };
  } catch (error) {
    return { success: false, reason: error.message };
  }
}
async function scanForMigrationNeeds(filePath) {
  const issues = [];
  if (!await fs3.pathExists(filePath)) {
    return issues;
  }
  try {
    const content = await fs3.readFile(filePath, "utf8");
    if (/## Embedded Synapse Network/i.test(content)) {
      issues.push('Old header: "## Embedded Synapse Network" \u2192 should be "## Synapses"');
    }
    if (/### \*\*Connection Mapping\*\*/i.test(content)) {
      issues.push('Old subheader: "### **Connection Mapping**" \u2192 should be "### Connection Mapping"');
    }
    if (/### \*\*Activation Patterns/i.test(content)) {
      issues.push('Old subheader: "### **Activation Patterns" \u2192 should be "### Activation Patterns"');
    }
    const oldTypes = ["Expression", "Embodiment", "Living", "Reflexive", "Ethical", "Unconscious", "Application", "Validation"];
    for (const type of oldTypes) {
      const regex = new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${type}\\s*,`, "i");
      if (regex.test(content)) {
        issues.push(`Old relationship type: "${type}" \u2192 needs migration to standard type`);
      }
    }
    if (/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(content)) {
      issues.push("Verbose activation patterns with date stamps \u2192 should be simplified");
    }
    if (/\*\*[A-Z][^*]+\*\*\s*→/.test(content)) {
      issues.push("Bold activation triggers \u2192 should be plain text");
    }
  } catch (error) {
    issues.push(`Error scanning file: ${error}`);
  }
  return issues;
}
async function findUserCreatedFiles(rootPath, manifest) {
  const userFiles = [];
  const dkPath = path3.join(rootPath, ".github", "domain-knowledge");
  if (await fs3.pathExists(dkPath)) {
    const files = await fs3.readdir(dkPath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const relativePath = `.github/domain-knowledge/${file}`;
        if (!manifest?.files[relativePath]) {
          userFiles.push(relativePath);
        }
      }
    }
  }
  return userFiles;
}
async function upgradeArchitecture(context) {
  const workspaceFolders = vscode3.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode3.window.showErrorMessage(
      "No workspace folder open. Please open a project with Alex installed (File \u2192 Open Folder), then run Upgrade."
    );
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const extensionPath = context.extensionPath;
  const markerFile = path3.join(rootPath, ".github", "copilot-instructions.md");
  if (!await fs3.pathExists(markerFile)) {
    const result = await vscode3.window.showWarningMessage(
      "Alex is not installed in this workspace yet.\n\nTo use Alex, you need to initialize it first. This will set up the cognitive architecture files.",
      "Initialize Alex Now",
      "Cancel"
    );
    if (result === "Initialize Alex Now") {
      await vscode3.commands.executeCommand("alex.initialize");
    }
    return;
  }
  const installedVersion = await getInstalledVersion(rootPath);
  const extensionVersion = await getExtensionVersion(extensionPath);
  if (installedVersion === extensionVersion) {
    const result = await vscode3.window.showInformationMessage(
      `\u2705 Alex is already at the latest version (${extensionVersion}).

No upgrade needed. Your cognitive architecture is up to date!`,
      "Run Dream Protocol",
      "Close"
    );
    if (result === "Run Dream Protocol") {
      await vscode3.commands.executeCommand("alex.dream");
    }
    return;
  }
  const confirm = await vscode3.window.showInformationMessage(
    `\u{1F504} Upgrade Available: v${installedVersion || "unknown"} \u2192 v${extensionVersion}

This is a safe, hybrid upgrade process:

\u{1F4E6} Phase 1 (Automated):
\u2022 Full backup of all files
\u2022 Update system files
\u2022 Detect what needs migration

\u{1F916} Phase 2 (AI-Assisted):
\u2022 Your AI assistant completes the upgrade
\u2022 Preserves all your learned knowledge
\u2022 Migrates any schema changes

\u23F1\uFE0F Total time: ~2-5 minutes`,
    { modal: true },
    "Start Upgrade",
    "What's New?",
    "Cancel"
  );
  if (confirm === "What's New?") {
    const changelogPath = path3.join(extensionPath, "CHANGELOG.md");
    if (await fs3.pathExists(changelogPath)) {
      const doc = await vscode3.workspace.openTextDocument(changelogPath);
      await vscode3.window.showTextDocument(doc);
    }
    return;
  }
  if (confirm !== "Start Upgrade") {
    return;
  }
  await performUpgrade(context, rootPath, extensionPath, installedVersion, extensionVersion);
}
async function performUpgrade(context, rootPath, extensionPath, oldVersion, newVersion) {
  const requiredSource = path3.join(extensionPath, ".github", "copilot-instructions.md");
  if (!await fs3.pathExists(requiredSource)) {
    vscode3.window.showErrorMessage(
      "Extension installation appears corrupted - missing core files.\n\nPlease reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace."
    );
    return;
  }
  const report = {
    updated: [],
    added: [],
    preserved: [],
    backed_up: [],
    migrationTasks: [],
    errors: []
  };
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = path3.join(rootPath, "archive", "upgrades", `backup-${oldVersion || "unknown"}-${timestamp}`);
  try {
    await vscode3.window.withProgress({
      location: vscode3.ProgressLocation.Notification,
      title: "Phase 1: Preparing Upgrade...",
      cancellable: false
    }, async (progress) => {
      progress.report({ message: "Creating complete backup...", increment: 15 });
      try {
        await fs3.ensureDir(backupDir);
        const testFile = path3.join(backupDir, ".write-test");
        await fs3.writeFile(testFile, "test");
        await fs3.remove(testFile);
      } catch (writeError) {
        throw new Error(`Cannot create backup directory - check disk space and permissions: ${writeError.message}`);
      }
      const githubSrc = path3.join(rootPath, ".github");
      if (await fs3.pathExists(githubSrc)) {
        await fs3.copy(githubSrc, path3.join(backupDir, ".github"));
        report.backed_up.push(".github/ (all cognitive memory)");
      }
      progress.report({ message: "Analyzing installed files...", increment: 10 });
      let manifest = await loadManifest(rootPath);
      if (!manifest) {
        manifest = {
          version: oldVersion || "unknown",
          installedAt: (/* @__PURE__ */ new Date()).toISOString(),
          files: {}
        };
      }
      progress.report({ message: "Scanning for schema migration needs...", increment: 15 });
      const filesToScan = [];
      const mainInstructions = path3.join(rootPath, ".github", "copilot-instructions.md");
      if (await fs3.pathExists(mainInstructions)) {
        filesToScan.push(mainInstructions);
      }
      const dkPath = path3.join(rootPath, ".github", "domain-knowledge");
      if (await fs3.pathExists(dkPath)) {
        const dkFiles = await fs3.readdir(dkPath);
        for (const file of dkFiles) {
          if (file.endsWith(".md")) {
            filesToScan.push(path3.join(dkPath, file));
          }
        }
      }
      const episodicPath = path3.join(rootPath, ".github", "episodic");
      if (await fs3.pathExists(episodicPath)) {
        const episodicFiles = await fs3.readdir(episodicPath);
        for (const file of episodicFiles) {
          if (file.endsWith(".md")) {
            filesToScan.push(path3.join(episodicPath, file));
          }
        }
      }
      for (const filePath of filesToScan) {
        const issues = await scanForMigrationNeeds(filePath);
        if (issues.length > 0) {
          const relativePath = path3.relative(rootPath, filePath);
          report.migrationTasks.push({
            file: relativePath,
            type: "schema-migration",
            description: `Synapse schema migration needed`,
            details: issues
          });
        }
      }
      progress.report({ message: "Identifying user-created files...", increment: 10 });
      const userFiles = await findUserCreatedFiles(rootPath, manifest);
      for (const file of userFiles) {
        report.preserved.push(`${file} (user-created)`);
        const fullPath = path3.join(rootPath, file);
        const issues = await scanForMigrationNeeds(fullPath);
        if (issues.length > 0) {
          report.migrationTasks.push({
            file,
            type: "schema-migration",
            description: "User-created file needs schema migration",
            details: issues
          });
        }
      }
      progress.report({ message: "Merging core brain file...", increment: 10 });
      const brainMergeResult = await autoMergeBrainFile(rootPath, extensionPath, newVersion);
      if (brainMergeResult.success) {
        report.updated.push(".github/copilot-instructions.md (auto-merged)");
      } else {
        report.migrationTasks.push({
          file: ".github/copilot-instructions.md",
          type: "merge-required",
          description: "Core brain file requires manual merge",
          details: [
            `Auto-merge failed: ${brainMergeResult.reason}`,
            "UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands",
            "PRESERVE: Domain slot assignments (P5-P7), user-added memory file references",
            "REVIEW: Any custom sections added by user"
          ]
        });
      }
      progress.report({ message: "Updating system files...", increment: 20 });
      const instructionsSrc = path3.join(extensionPath, ".github", "instructions");
      const instructionsDest = path3.join(rootPath, ".github", "instructions");
      if (await fs3.pathExists(instructionsSrc)) {
        const files = await fs3.readdir(instructionsSrc);
        for (const file of files) {
          const srcFile = path3.join(instructionsSrc, file);
          const destFile = path3.join(instructionsDest, file);
          if ((await fs3.stat(srcFile)).isFile()) {
            const existed = await fs3.pathExists(destFile);
            await fs3.copy(srcFile, destFile, { overwrite: true });
            const content = await fs3.readFile(srcFile, "utf8");
            manifest.files[`.github/instructions/${file}`] = {
              type: "system",
              originalChecksum: calculateChecksum(content)
            };
            if (existed) {
              report.updated.push(`.github/instructions/${file}`);
            } else {
              report.added.push(`.github/instructions/${file}`);
            }
          }
        }
      }
      const promptsSrc = path3.join(extensionPath, ".github", "prompts");
      const promptsDest = path3.join(rootPath, ".github", "prompts");
      if (await fs3.pathExists(promptsSrc)) {
        const files = await fs3.readdir(promptsSrc);
        for (const file of files) {
          const srcFile = path3.join(promptsSrc, file);
          const destFile = path3.join(promptsDest, file);
          if ((await fs3.stat(srcFile)).isFile()) {
            const existed = await fs3.pathExists(destFile);
            await fs3.copy(srcFile, destFile, { overwrite: true });
            const content = await fs3.readFile(srcFile, "utf8");
            manifest.files[`.github/prompts/${file}`] = {
              type: "system",
              originalChecksum: calculateChecksum(content)
            };
            if (existed) {
              report.updated.push(`.github/prompts/${file}`);
            } else {
              report.added.push(`.github/prompts/${file}`);
            }
          }
        }
      }
      const agentsSrc = path3.join(extensionPath, ".github", "agents");
      const agentsDest = path3.join(rootPath, ".github", "agents");
      if (await fs3.pathExists(agentsSrc)) {
        await fs3.ensureDir(agentsDest);
        const files = await fs3.readdir(agentsSrc);
        for (const file of files) {
          const srcFile = path3.join(agentsSrc, file);
          const destFile = path3.join(agentsDest, file);
          if ((await fs3.stat(srcFile)).isFile()) {
            const existed = await fs3.pathExists(destFile);
            await fs3.copy(srcFile, destFile, { overwrite: true });
            const content = await fs3.readFile(srcFile, "utf8");
            manifest.files[`.github/agents/${file}`] = {
              type: "system",
              originalChecksum: calculateChecksum(content)
            };
            if (existed) {
              report.updated.push(`.github/agents/${file}`);
            } else {
              report.added.push(`.github/agents/${file}`);
            }
          }
        }
      }
      const configSrc = path3.join(extensionPath, ".github", "config");
      const configDest = path3.join(rootPath, ".github", "config");
      if (await fs3.pathExists(configSrc)) {
        await fs3.ensureDir(configDest);
        const files = await fs3.readdir(configSrc);
        for (const file of files) {
          if (file.includes("template") || file === "USER-PROFILE-TEMPLATE.md") {
            const srcFile = path3.join(configSrc, file);
            const destFile = path3.join(configDest, file);
            if ((await fs3.stat(srcFile)).isFile()) {
              const existed = await fs3.pathExists(destFile);
              await fs3.copy(srcFile, destFile, { overwrite: true });
              if (existed) {
                report.updated.push(`.github/config/${file}`);
              } else {
                report.added.push(`.github/config/${file}`);
              }
            }
          }
        }
      }
      progress.report({ message: "Processing domain knowledge...", increment: 10 });
      const extDkSrc = path3.join(extensionPath, ".github", "domain-knowledge");
      const extDkDest = path3.join(rootPath, ".github", "domain-knowledge");
      if (await fs3.pathExists(extDkSrc)) {
        await fs3.ensureDir(extDkDest);
        const files = await fs3.readdir(extDkSrc);
        for (const file of files) {
          const srcFile = path3.join(extDkSrc, file);
          const destFile = path3.join(extDkDest, file);
          if ((await fs3.stat(srcFile)).isFile()) {
            const srcContent = await fs3.readFile(srcFile, "utf8");
            const srcChecksum = calculateChecksum(srcContent);
            if (!await fs3.pathExists(destFile)) {
              await fs3.copy(srcFile, destFile);
              manifest.files[`.github/domain-knowledge/${file}`] = {
                type: "system",
                originalChecksum: srcChecksum
              };
              report.added.push(`.github/domain-knowledge/${file}`);
            } else {
              const destContent = await fs3.readFile(destFile, "utf8");
              const destChecksum = calculateChecksum(destContent);
              const originalChecksum = manifest.files[`.github/domain-knowledge/${file}`]?.originalChecksum;
              if (originalChecksum && destChecksum !== originalChecksum) {
                const newVersionPath = destFile.replace(/\.md$/, `.v${newVersion}.md`);
                await fs3.copy(srcFile, newVersionPath);
                report.preserved.push(`.github/domain-knowledge/${file} (modified by user, new version: ${path3.basename(newVersionPath)})`);
                report.migrationTasks.push({
                  file: `.github/domain-knowledge/${file}`,
                  type: "review-recommended",
                  description: "User-modified system file - review new version",
                  details: [
                    `Your version preserved: ${file}`,
                    `New version available: ${path3.basename(newVersionPath)}`,
                    "Review and merge changes as needed"
                  ]
                });
              } else {
                await fs3.copy(srcFile, destFile, { overwrite: true });
                manifest.files[`.github/domain-knowledge/${file}`] = {
                  type: "system",
                  originalChecksum: srcChecksum
                };
                report.updated.push(`.github/domain-knowledge/${file}`);
              }
            }
          }
        }
      }
      progress.report({ message: "Saving manifest...", increment: 5 });
      manifest.version = newVersion;
      manifest.upgradedAt = (/* @__PURE__ */ new Date()).toISOString();
      const manifestPath = path3.join(rootPath, ".alex-manifest.json");
      const tempManifestPath = manifestPath + ".tmp";
      await fs3.writeJson(tempManifestPath, manifest, { spaces: 2 });
      await fs3.move(tempManifestPath, manifestPath, { overwrite: true });
      progress.report({ message: "Generating upgrade instructions...", increment: 5 });
      await generateUpgradeInstructions(rootPath, oldVersion, newVersion, report, backupDir, timestamp);
    });
    const taskWord = report.migrationTasks.length === 1 ? "task" : "tasks";
    const result = await vscode3.window.showWarningMessage(
      `\u2705 Phase 1 Complete!

\u{1F4CA} Summary:
\u2022 Backup created: ${report.backed_up.length} folders
\u2022 Files updated: ${report.updated.length}
\u2022 Files added: ${report.added.length}
\u2022 Files preserved: ${report.preserved.length}
\u2022 Migration ${taskWord}: ${report.migrationTasks.length}

\u{1F916} Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,
      "Open Instructions (Recommended)",
      "View Full Report"
    );
    if (result === "Open Instructions (Recommended)") {
      const instructionsPath = path3.join(rootPath, "UPGRADE-INSTRUCTIONS.md");
      const doc = await vscode3.workspace.openTextDocument(instructionsPath);
      await vscode3.window.showTextDocument(doc);
    } else if (result === "View Full Report") {
      const reportPath = path3.join(rootPath, "archive", "upgrades", `upgrade-report-${timestamp}.md`);
      const doc = await vscode3.workspace.openTextDocument(reportPath);
      await vscode3.window.showTextDocument(doc);
    }
  } catch (error) {
    vscode3.window.showErrorMessage(
      `\u274C Upgrade failed: ${error.message}

Your original files should be intact. If you see issues:
1. Check the archive/upgrades folder for backups
2. Try running "Alex: Dream" to assess damage
3. You can restore from backup if needed`
    );
    report.errors.push(error.message);
  }
}
async function generateUpgradeInstructions(rootPath, oldVersion, newVersion, report, backupDir, timestamp) {
  const instructionsContent = `# \u{1F504} Alex Upgrade: Phase 2 Required

**Upgrade**: v${oldVersion || "unknown"} \u2192 v${newVersion}  
**Date**: ${(/* @__PURE__ */ new Date()).toISOString()}  
**Status**: \u26A0\uFE0F Phase 1 Complete - AI Assistance Required

---

## What Just Happened (Phase 1 - Automated)

\u2705 Full backup created: \`${path3.relative(rootPath, backupDir)}\`  
\u2705 System files updated: ${report.updated.length} files  
\u2705 New files added: ${report.added.length} files  
\u2705 User files preserved: ${report.preserved.length} files  
\u2705 Migration tasks identified: ${report.migrationTasks.length} tasks  

---

## What You Need To Do (Phase 2 - AI Assisted)

### Step 1: Ask Your AI Assistant

Copy and paste this prompt to your AI assistant (GitHub Copilot, Claude, etc.):

\`\`\`
Alex, please complete the upgrade to v${newVersion} by:

1. Reading the upgrade tasks in archive/upgrades/upgrade-report-${timestamp}.md
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
- Delete any \`.v${newVersion}.md\` reference files after merging
- The upgrade is complete!

---

## Migration Tasks Summary

${report.migrationTasks.length > 0 ? report.migrationTasks.map((task, i) => `
### Task ${i + 1}: ${task.file}

**Type**: ${task.type}  
**Description**: ${task.description}

${task.details.map((d) => `- ${d}`).join("\n")}
`).join("\n") : "No migration tasks required."}

---

## Rollback Instructions

If anything goes wrong:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${path3.relative(rootPath, backupDir)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${timestamp}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
- Backup location: \`${path3.relative(rootPath, backupDir)}\`

---

*This file will be deleted after successful upgrade completion.*
`;
  await fs3.writeFile(path3.join(rootPath, "UPGRADE-INSTRUCTIONS.md"), instructionsContent, "utf8");
  const reportContent = `# Alex Cognitive Architecture Upgrade Report

**Date**: ${(/* @__PURE__ */ new Date()).toISOString()}  
**From Version**: ${oldVersion || "unknown"}  
**To Version**: ${newVersion}  
**Backup Location**: \`${backupDir}\`

---

## Summary

| Category | Count |
|----------|-------|
| Updated | ${report.updated.length} |
| Added | ${report.added.length} |
| Preserved | ${report.preserved.length} |
| Backed Up | ${report.backed_up.length} |
| Migration Tasks | ${report.migrationTasks.length} |
| Errors | ${report.errors.length} |

---

## Updated Files (System)

${report.updated.length > 0 ? report.updated.map((f) => `- \u2705 ${f}`).join("\n") : "- None"}

## Added Files (New in this version)

${report.added.length > 0 ? report.added.map((f) => `- \u2795 ${f}`).join("\n") : "- None"}

## Preserved Files (User content protected)

${report.preserved.length > 0 ? report.preserved.map((f) => `- \u{1F512} ${f}`).join("\n") : "- None"}

## Backed Up

${report.backed_up.length > 0 ? report.backed_up.map((f) => `- \u{1F4E6} ${f}`).join("\n") : "- None"}

---

## Migration Tasks (Require AI Assistance)

${report.migrationTasks.length > 0 ? report.migrationTasks.map((task, i) => `
### ${i + 1}. ${task.file}

**Type**: \`${task.type}\`  
**Description**: ${task.description}

**Details**:
${task.details.map((d) => `- ${d}`).join("\n")}
`).join("\n---\n") : "No migration tasks required."}

---

${report.errors.length > 0 ? `## Errors

${report.errors.map((e) => `- \u274C ${e}`).join("\n")}` : ""}

## Next Steps

1. Read \`UPGRADE-INSTRUCTIONS.md\` in workspace root
2. Ask AI assistant to complete Phase 2 migration
3. Run \`Alex: Dream (Neural Maintenance)\` to validate
4. Delete \`UPGRADE-INSTRUCTIONS.md\` when complete

---

*Report generated by Alex Cognitive Architecture v${newVersion}*
`;
  const reportPath = path3.join(rootPath, "archive", "upgrades", `upgrade-report-${timestamp}.md`);
  await fs3.ensureDir(path3.dirname(reportPath));
  await fs3.writeFile(reportPath, reportContent, "utf8");
}

// src/commands/self-actualization.ts
var vscode4 = __toESM(require("vscode"));
var fs4 = __toESM(require_lib());
var path4 = __toESM(require("path"));
async function runSelfActualization(context) {
  const workspaceFolders = vscode4.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode4.window.showErrorMessage(
      "No workspace folder open. Please open a project with Alex installed."
    );
    return void 0;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const report = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    synapseHealth: {
      totalFiles: 0,
      totalSynapses: 0,
      brokenConnections: 0,
      healthStatus: "UNKNOWN"
    },
    versionConsistency: {
      currentVersion: "Unknown",
      outdatedReferences: 0,
      filesUpdated: []
    },
    memoryConsolidation: {
      proceduralFiles: 0,
      episodicFiles: 0,
      domainFiles: 0,
      totalConnections: 0
    },
    recommendations: [],
    sessionFile: ""
  };
  await vscode4.window.withProgress({
    location: vscode4.ProgressLocation.Notification,
    title: "Self-Actualization Protocol",
    cancellable: false
  }, async (progress) => {
    progress.report({ message: "Phase 1: Validating synaptic connections...", increment: 0 });
    await scanSynapseHealth(workspaceFolders[0], report);
    progress.report({ message: "Phase 2: Checking version consistency...", increment: 25 });
    await checkVersionConsistency(rootPath, report);
    progress.report({ message: "Phase 3: Assessing memory architecture...", increment: 50 });
    await assessMemoryArchitecture(workspaceFolders[0], report);
    progress.report({ message: "Phase 4: Generating recommendations...", increment: 75 });
    generateRecommendations(report);
    progress.report({ message: "Phase 5: Documenting session...", increment: 90 });
    await createSessionRecord(rootPath, report);
    progress.report({ message: "Self-actualization complete!", increment: 100 });
  });
  const healthEmoji = report.synapseHealth.healthStatus === "EXCELLENT" ? "\u2705" : report.synapseHealth.healthStatus === "GOOD" ? "\u{1F7E2}" : report.synapseHealth.healthStatus === "NEEDS ATTENTION" ? "\u{1F7E1}" : "\u{1F534}";
  const message = `Self-Actualization Complete ${healthEmoji}

Synapses: ${report.synapseHealth.totalSynapses} (${report.synapseHealth.brokenConnections} broken)
Memory Files: ${report.memoryConsolidation.proceduralFiles + report.memoryConsolidation.episodicFiles + report.memoryConsolidation.domainFiles}
Recommendations: ${report.recommendations.length}`;
  const action = await vscode4.window.showInformationMessage(
    message,
    "View Report",
    "Open Session File"
  );
  if (action === "View Report") {
    showReportInPanel(report);
  } else if (action === "Open Session File" && report.sessionFile) {
    const doc = await vscode4.workspace.openTextDocument(report.sessionFile);
    await vscode4.window.showTextDocument(doc);
  }
  return report;
}
async function scanSynapseHealth(workspaceFolder, report) {
  const patterns = [
    ".github/copilot-instructions.md",
    ".github/instructions/*.md",
    ".github/prompts/*.md",
    ".github/episodic/*.md",
    ".github/domain-knowledge/*.md"
  ];
  const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
  for (const pattern of patterns) {
    const relativePattern = new vscode4.RelativePattern(workspaceFolder, pattern);
    const files = await vscode4.workspace.findFiles(relativePattern);
    for (const file of files) {
      report.synapseHealth.totalFiles++;
      try {
        const content = await fs4.readFile(file.fsPath, "utf-8");
        const lines = content.split("\n");
        let inCodeBlock = false;
        for (const line of lines) {
          if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
          }
          if (inCodeBlock) {
            continue;
          }
          let match;
          while ((match = synapseRegex.exec(line)) !== null) {
            report.synapseHealth.totalSynapses++;
            const targetName = match[1].trim();
            const found = await vscode4.workspace.findFiles(
              new vscode4.RelativePattern(workspaceFolder, `**/${targetName}`)
            );
            if (found.length === 0) {
              report.synapseHealth.brokenConnections++;
            }
          }
        }
      } catch {
      }
    }
  }
  report.synapseHealth.healthStatus = report.synapseHealth.brokenConnections === 0 ? "EXCELLENT" : report.synapseHealth.brokenConnections < 5 ? "GOOD" : report.synapseHealth.brokenConnections < 10 ? "NEEDS ATTENTION" : "CRITICAL";
}
async function checkVersionConsistency(rootPath, report) {
  const mainInstructionsPath = path4.join(rootPath, ".github", "copilot-instructions.md");
  try {
    if (await fs4.pathExists(mainInstructionsPath)) {
      const content = await fs4.readFile(mainInstructionsPath, "utf-8");
      const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
      if (versionMatch) {
        report.versionConsistency.currentVersion = versionMatch[1];
      }
    }
  } catch {
  }
  const outdatedPatterns = [
    /1\.5\.0\s+UNPENTNILIUM/g,
    /1\.1\.0\s+UNUNUNNILIUM/g,
    /1\.0\.\d+\s+UNNL/g,
    /0\.\d+\.\d+\s+NIL/g
  ];
  const patterns = [
    ".github/instructions/*.md",
    ".github/domain-knowledge/*.md"
  ];
  const workspaceFolder = vscode4.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return;
  }
  for (const pattern of patterns) {
    const relativePattern = new vscode4.RelativePattern(workspaceFolder, pattern);
    const files = await vscode4.workspace.findFiles(relativePattern);
    for (const file of files) {
      try {
        const content = await fs4.readFile(file.fsPath, "utf-8");
        for (const regex of outdatedPatterns) {
          if (regex.test(content)) {
            report.versionConsistency.outdatedReferences++;
            break;
          }
        }
      } catch {
      }
    }
  }
}
async function assessMemoryArchitecture(workspaceFolder, report) {
  const instructionFiles = await vscode4.workspace.findFiles(
    new vscode4.RelativePattern(workspaceFolder, ".github/instructions/*.md")
  );
  report.memoryConsolidation.proceduralFiles = instructionFiles.length;
  const promptFiles = await vscode4.workspace.findFiles(
    new vscode4.RelativePattern(workspaceFolder, ".github/prompts/*.md")
  );
  const episodicFiles = await vscode4.workspace.findFiles(
    new vscode4.RelativePattern(workspaceFolder, ".github/episodic/*.md")
  );
  report.memoryConsolidation.episodicFiles = promptFiles.length + episodicFiles.length;
  const domainFiles = await vscode4.workspace.findFiles(
    new vscode4.RelativePattern(workspaceFolder, ".github/domain-knowledge/*.md")
  );
  report.memoryConsolidation.domainFiles = domainFiles.length;
  report.memoryConsolidation.totalConnections = report.synapseHealth.totalSynapses;
}
function generateRecommendations(report) {
  if (report.synapseHealth.brokenConnections > 0) {
    report.recommendations.push(
      `\u{1F527} Run \`Alex: Dream (Neural Maintenance)\` to repair ${report.synapseHealth.brokenConnections} broken synapse(s)`
    );
  }
  if (report.versionConsistency.outdatedReferences > 0) {
    report.recommendations.push(
      `\u{1F4DD} Update ${report.versionConsistency.outdatedReferences} file(s) with outdated version references to ${report.versionConsistency.currentVersion}`
    );
  }
  const totalMemory = report.memoryConsolidation.proceduralFiles + report.memoryConsolidation.episodicFiles + report.memoryConsolidation.domainFiles;
  if (report.memoryConsolidation.domainFiles < 3) {
    report.recommendations.push(
      `\u{1F4DA} Consider acquiring more domain knowledge - only ${report.memoryConsolidation.domainFiles} DK file(s) present`
    );
  }
  if (report.memoryConsolidation.episodicFiles < 5) {
    report.recommendations.push(
      `\u{1F9D8} Run more meditation sessions to build episodic memory - only ${report.memoryConsolidation.episodicFiles} session(s) recorded`
    );
  }
  const synapseDensity = report.synapseHealth.totalSynapses / Math.max(totalMemory, 1);
  if (synapseDensity < 3) {
    report.recommendations.push(
      `\u{1F517} Consider adding more synaptic connections - average density is ${synapseDensity.toFixed(1)} per file`
    );
  }
  if (report.synapseHealth.healthStatus === "EXCELLENT") {
    report.recommendations.push(
      `\u2728 Architecture is healthy! Consider exploring new domains or creating cross-domain connections`
    );
  }
}
async function createSessionRecord(rootPath, report) {
  const episodicPath = path4.join(rootPath, ".github", "episodic");
  await fs4.ensureDir(episodicPath);
  const date = /* @__PURE__ */ new Date();
  const dateStr = date.toISOString().split("T")[0];
  const filename = `self-actualization-${dateStr}.prompt.md`;
  const filepath = path4.join(episodicPath, filename);
  const healthEmoji = report.synapseHealth.healthStatus === "EXCELLENT" ? "\u2705" : report.synapseHealth.healthStatus === "GOOD" ? "\u{1F7E2}" : report.synapseHealth.healthStatus === "NEEDS ATTENTION" ? "\u{1F7E1}" : "\u{1F534}";
  const content = `# Self-Actualization Session - ${dateStr}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${report.versionConsistency.currentVersion}
**Timestamp**: ${report.timestamp}

---

## \u{1F9E0} Synapse Health Assessment

| Metric | Value |
|--------|-------|
| Memory Files Scanned | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${healthEmoji} ${report.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Memory Type | Files |
|-------------|-------|
| Procedural (.instructions.md) | ${report.memoryConsolidation.proceduralFiles} |
| Episodic (.prompt.md + .episodic/) | ${report.memoryConsolidation.episodicFiles} |
| Domain Knowledge (DK-*.md) | ${report.memoryConsolidation.domainFiles} |
| **Total** | **${report.memoryConsolidation.proceduralFiles + report.memoryConsolidation.episodicFiles + report.memoryConsolidation.domainFiles}** |

## \u{1F504} Version Consistency

- **Current Version**: ${report.versionConsistency.currentVersion}
- **Outdated References Found**: ${report.versionConsistency.outdatedReferences}

## \u{1F4A1} Recommendations

${report.recommendations.map((r) => `- ${r}`).join("\n") || "- No recommendations - architecture is optimal!"}

## \u{1F4C8} Metrics

- **Synapse Density**: ${(report.synapseHealth.totalSynapses / Math.max(report.synapseHealth.totalFiles, 1)).toFixed(1)} synapses per file
- **Connection Integrity**: ${((1 - report.synapseHealth.brokenConnections / Math.max(report.synapseHealth.totalSynapses, 1)) * 100).toFixed(1)}%

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
`;
  await fs4.writeFile(filepath, content, "utf-8");
  report.sessionFile = filepath;
}
function showReportInPanel(report) {
  const panel = vscode4.window.createWebviewPanel(
    "alexSelfActualization",
    "Self-Actualization Report",
    vscode4.ViewColumn.One,
    { enableScripts: false }
  );
  const healthColor = report.synapseHealth.healthStatus === "EXCELLENT" ? "#22c55e" : report.synapseHealth.healthStatus === "GOOD" ? "#84cc16" : report.synapseHealth.healthStatus === "NEEDS ATTENTION" ? "#eab308" : "#ef4444";
  panel.webview.html = `<!DOCTYPE html>
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
        .health-badge { display: inline-block; padding: 4px 12px; border-radius: 16px; font-weight: bold; background: ${healthColor}; color: white; }
        .recommendation { padding: 8px 12px; margin: 4px 0; background: var(--vscode-input-background); border-left: 3px solid var(--vscode-textLink-foreground); }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--vscode-panel-border); }
        th { background: var(--vscode-input-background); }
    </style>
</head>
<body>
    <h1>\u{1F9E0} Self-Actualization Report</h1>
    <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
    <p><strong>Version:</strong> ${report.versionConsistency.currentVersion}</p>
    
    <h2>Health Overview</h2>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.totalFiles}</div>
        <div class="metric-label">Memory Files</div>
    </div>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.totalSynapses}</div>
        <div class="metric-label">Synapses</div>
    </div>
    <div class="metric">
        <div class="metric-value">${report.synapseHealth.brokenConnections}</div>
        <div class="metric-label">Broken</div>
    </div>
    <div class="metric">
        <div class="health-badge">${report.synapseHealth.healthStatus}</div>
        <div class="metric-label">Status</div>
    </div>

    <h2>Memory Architecture</h2>
    <table>
        <tr><th>Memory Type</th><th>Files</th></tr>
        <tr><td>Procedural Memory</td><td>${report.memoryConsolidation.proceduralFiles}</td></tr>
        <tr><td>Episodic Memory</td><td>${report.memoryConsolidation.episodicFiles}</td></tr>
        <tr><td>Domain Knowledge</td><td>${report.memoryConsolidation.domainFiles}</td></tr>
    </table>

    <h2>Recommendations</h2>
    ${report.recommendations.length > 0 ? report.recommendations.map((r) => `<div class="recommendation">${r}</div>`).join("") : "<p>\u2705 No recommendations - architecture is optimal!</p>"}
</body>
</html>`;
}

// src/chat/participant.ts
var vscode9 = __toESM(require("vscode"));
var path9 = __toESM(require("path"));

// src/chat/tools.ts
var vscode7 = __toESM(require("vscode"));
var fs7 = __toESM(require_lib());
var path7 = __toESM(require("path"));

// src/chat/globalKnowledge.ts
var vscode6 = __toESM(require("vscode"));
var fs6 = __toESM(require_lib());
var path6 = __toESM(require("path"));
var os = __toESM(require("os"));
var lockfile = __toESM(require_proper_lockfile());

// src/shared/constants.ts
var VERSION_EXTRACT_REGEX = /\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/;
var VERSION_NUMBER_REGEX = /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/;
var ALEX_GLOBAL_HOME = ".alex";
var GLOBAL_KNOWLEDGE_PATHS = {
  root: ALEX_GLOBAL_HOME,
  knowledge: `${ALEX_GLOBAL_HOME}/global-knowledge`,
  patterns: `${ALEX_GLOBAL_HOME}/global-knowledge/patterns`,
  insights: `${ALEX_GLOBAL_HOME}/global-knowledge/insights`,
  index: `${ALEX_GLOBAL_HOME}/global-knowledge/index.json`,
  projectRegistry: `${ALEX_GLOBAL_HOME}/project-registry.json`,
  globalProfile: `${ALEX_GLOBAL_HOME}/user-profile.json`
};
var GLOBAL_KNOWLEDGE_PREFIXES = {
  pattern: "GK-",
  // Global Knowledge patterns
  insight: "GI-"
  // Global Insights (timestamped learnings)
};

// src/chat/cloudSync.ts
var vscode5 = __toESM(require("vscode"));
var fs5 = __toESM(require_lib());
var path5 = __toESM(require("path"));
var https = __toESM(require("https"));
var GIST_INDEX_FILENAME = "alex-knowledge-index.json";
var GIST_DESCRIPTION = "Alex Cognitive Architecture - Global Knowledge Base";
async function getGitHubSession() {
  try {
    const session = await vscode5.authentication.getSession("github", ["gist"], { createIfNone: true });
    return session;
  } catch (err) {
    console.error("Failed to get GitHub session:", err);
    return void 0;
  }
}
async function githubRequest(endpoint, options = {}) {
  const session = await getGitHubSession();
  if (!session) {
    throw new Error("GitHub authentication required. Please sign in.");
  }
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com${endpoint}`);
    const reqOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Authorization": `Bearer ${session.accessToken}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Accept": "application/vnd.github.v3+json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "User-Agent": "Alex-Cognitive-Architecture-VSCode"
      }
    };
    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          if (res.statusCode === 204 || !data) {
            resolve(null);
          } else {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error(`Failed to parse GitHub response: ${err}`));
            }
          }
        } else {
          reject(new Error(`GitHub API error (${res.statusCode}): ${data}`));
        }
      });
    });
    req.on("error", (err) => reject(err));
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}
function getSyncMetadataPath() {
  return path5.join(getGlobalKnowledgePath("root"), "sync-metadata.json");
}
async function loadSyncMetadata() {
  const metaPath = getSyncMetadataPath();
  try {
    if (await fs5.pathExists(metaPath)) {
      return await fs5.readJson(metaPath);
    }
  } catch (err) {
  }
  return {};
}
async function saveSyncMetadata(metadata) {
  const metaPath = getSyncMetadataPath();
  await fs5.writeJson(metaPath, metadata, { spaces: 2 });
}
async function findKnowledgeGist() {
  const metadata = await loadSyncMetadata();
  if (metadata.gistId) {
    try {
      const gist = await githubRequest(`/gists/${metadata.gistId}`);
      if (gist) {
        return gist;
      }
    } catch (err) {
    }
  }
  const indexPath = getGlobalKnowledgePath("index");
  if (await fs5.pathExists(indexPath)) {
    try {
      const localIndex = await fs5.readJson(indexPath);
      if (localIndex.cloudGistId) {
        const gist = await githubRequest(`/gists/${localIndex.cloudGistId}`);
        if (gist) {
          await saveSyncMetadata({ ...metadata, gistId: gist.id });
          return gist;
        }
      }
    } catch (err) {
    }
  }
  const gists = await githubRequest("/gists?per_page=100");
  if (!gists) {
    return null;
  }
  const knowledgeGist = gists.find(
    (g) => g.description === GIST_DESCRIPTION || g.files[GIST_INDEX_FILENAME]
  );
  if (knowledgeGist) {
    await saveSyncMetadata({ ...metadata, gistId: knowledgeGist.id });
  }
  return knowledgeGist || null;
}
async function createKnowledgeGist(files) {
  const gistFiles = {};
  for (const [filename, content] of Object.entries(files)) {
    gistFiles[filename] = { content };
  }
  const gist = await githubRequest("/gists", {
    method: "POST",
    body: {
      description: GIST_DESCRIPTION,
      public: false,
      files: gistFiles
    }
  });
  if (!gist) {
    throw new Error("Failed to create gist");
  }
  const metadata = await loadSyncMetadata();
  await saveSyncMetadata({ ...metadata, gistId: gist.id });
  return gist;
}
async function updateKnowledgeGist(gistId, files) {
  const gistFiles = {};
  for (const [filename, content] of Object.entries(files)) {
    gistFiles[filename] = content === null ? null : { content };
  }
  const gist = await githubRequest(`/gists/${gistId}`, {
    method: "PATCH",
    body: { files: gistFiles }
  });
  if (!gist) {
    throw new Error("Failed to update gist");
  }
  return gist;
}
function computeIndexHash(index) {
  const content = JSON.stringify(index.entries.map((e) => e.id).sort());
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
async function getSyncStatus() {
  try {
    const metadata = await loadSyncMetadata();
    if (!metadata.gistId) {
      return { status: "needs-push", message: "Not yet synced to cloud" };
    }
    const indexPath = getGlobalKnowledgePath("index");
    if (!await fs5.pathExists(indexPath)) {
      return { status: "needs-pull", message: "No local knowledge, pull from cloud" };
    }
    const localIndex = await fs5.readJson(indexPath);
    const localHash = computeIndexHash(localIndex);
    if (metadata.lastLocalHash && localHash !== metadata.lastLocalHash) {
      return { status: "needs-push", message: "Local changes not yet synced" };
    }
    return { status: "up-to-date", message: "Synced" };
  } catch (err) {
    return { status: "error", message: `Error: ${err}` };
  }
}
async function pushToCloud() {
  try {
    await ensureGlobalKnowledgeDirectories();
    const indexPath = getGlobalKnowledgePath("index");
    if (!await fs5.pathExists(indexPath)) {
      return {
        success: false,
        status: "error",
        message: "No local knowledge to push. Use /saveinsight first."
      };
    }
    const localIndex = await fs5.readJson(indexPath);
    let gist = await findKnowledgeGist();
    const isNewGist = !gist;
    if (!gist) {
      gist = await createKnowledgeGist({ [GIST_INDEX_FILENAME]: "{}" });
    }
    localIndex.cloudGistId = gist.id;
    localIndex.cloudGistUrl = `https://gist.github.com/${gist.id}`;
    const files = {
      [GIST_INDEX_FILENAME]: JSON.stringify(localIndex, null, 2)
    };
    for (const entry of localIndex.entries) {
      if (await fs5.pathExists(entry.filePath)) {
        const content = await fs5.readFile(entry.filePath, "utf-8");
        const filename = path5.basename(entry.filePath);
        files[filename] = content;
      }
    }
    gist = await updateKnowledgeGist(gist.id, files);
    await updateGlobalKnowledgeIndex(() => localIndex);
    const localHash = computeIndexHash(localIndex);
    await saveSyncMetadata({
      gistId: gist.id,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLocalHash: localHash,
      lastRemoteHash: localHash
    });
    return {
      success: true,
      status: "up-to-date",
      message: `Pushed ${localIndex.entries.length} entries to cloud`,
      entriesPushed: localIndex.entries.length
    };
  } catch (err) {
    return {
      success: false,
      status: "error",
      message: `Push failed: ${err}`
    };
  }
}
async function pullFromCloud() {
  try {
    await ensureGlobalKnowledgeDirectories();
    const gist = await findKnowledgeGist();
    if (!gist) {
      return {
        success: false,
        status: "error",
        message: "No cloud knowledge found. Use /push first."
      };
    }
    const indexFile = gist.files[GIST_INDEX_FILENAME];
    if (!indexFile) {
      return {
        success: false,
        status: "error",
        message: "Cloud gist is missing index file"
      };
    }
    const remoteIndex = JSON.parse(indexFile.content);
    remoteIndex.cloudGistId = gist.id;
    remoteIndex.cloudGistUrl = `https://gist.github.com/${gist.id}`;
    let downloadedCount = 0;
    for (const entry of remoteIndex.entries) {
      const filename = path5.basename(entry.filePath);
      const gistFile = gist.files[filename];
      if (gistFile) {
        const subdir = entry.type === "pattern" ? "patterns" : "insights";
        const localPath = path5.join(getGlobalKnowledgePath(subdir), filename);
        entry.filePath = localPath;
        await fs5.writeFile(localPath, gistFile.content, "utf-8");
        downloadedCount++;
      }
    }
    await updateGlobalKnowledgeIndex(() => remoteIndex);
    const localHash = computeIndexHash(remoteIndex);
    await saveSyncMetadata({
      gistId: gist.id,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLocalHash: localHash,
      lastRemoteHash: localHash
    });
    return {
      success: true,
      status: "up-to-date",
      message: `Pulled ${downloadedCount} entries from cloud`,
      entriesPulled: downloadedCount
    };
  } catch (err) {
    return {
      success: false,
      status: "error",
      message: `Pull failed: ${err}`
    };
  }
}
async function syncWithCloud() {
  try {
    await ensureGlobalKnowledgeDirectories();
    const indexPath = getGlobalKnowledgePath("index");
    let localIndex;
    if (await fs5.pathExists(indexPath)) {
      localIndex = await fs5.readJson(indexPath);
    } else {
      localIndex = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), entries: [] };
    }
    let gist = await findKnowledgeGist();
    let remoteIndex;
    if (gist && gist.files[GIST_INDEX_FILENAME]) {
      remoteIndex = JSON.parse(gist.files[GIST_INDEX_FILENAME].content);
    } else {
      remoteIndex = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), entries: [] };
    }
    const mergedEntries = /* @__PURE__ */ new Map();
    for (const entry of remoteIndex.entries) {
      mergedEntries.set(entry.id, entry);
    }
    for (const entry of localIndex.entries) {
      const existing = mergedEntries.get(entry.id);
      if (!existing || new Date(entry.modified) > new Date(existing.modified)) {
        mergedEntries.set(entry.id, entry);
      }
    }
    const mergedIndex = {
      version: "1.0.0",
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      cloudGistId: gist?.id || localIndex.cloudGistId,
      cloudGistUrl: gist ? `https://gist.github.com/${gist.id}` : localIndex.cloudGistUrl,
      entries: Array.from(mergedEntries.values())
    };
    const files = {
      [GIST_INDEX_FILENAME]: JSON.stringify(mergedIndex, null, 2)
    };
    for (const entry of mergedIndex.entries) {
      if (await fs5.pathExists(entry.filePath)) {
        const content = await fs5.readFile(entry.filePath, "utf-8");
        const filename = path5.basename(entry.filePath);
        files[filename] = content;
      }
    }
    let downloaded = 0;
    if (gist) {
      for (const entry of remoteIndex.entries) {
        const filename = path5.basename(entry.filePath);
        const gistFile = gist.files[filename];
        const subdir = entry.type === "pattern" ? "patterns" : "insights";
        const localPath = path5.join(getGlobalKnowledgePath(subdir), filename);
        if (gistFile && !await fs5.pathExists(localPath)) {
          await fs5.writeFile(localPath, gistFile.content, "utf-8");
          const mergedEntry = mergedEntries.get(entry.id);
          if (mergedEntry) {
            mergedEntry.filePath = localPath;
          }
          downloaded++;
        }
      }
    }
    if (gist) {
      await updateKnowledgeGist(gist.id, files);
    } else {
      gist = await createKnowledgeGist(files);
    }
    await updateGlobalKnowledgeIndex(() => mergedIndex);
    const localHash = computeIndexHash(mergedIndex);
    await saveSyncMetadata({
      gistId: gist.id,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLocalHash: localHash,
      lastRemoteHash: localHash
    });
    const localNew = localIndex.entries.filter((e) => !remoteIndex.entries.find((r) => r.id === e.id)).length;
    const remoteNew = downloaded;
    return {
      success: true,
      status: "up-to-date",
      message: `Synced! ${localNew} pushed, ${remoteNew} pulled. Total: ${mergedIndex.entries.length} entries.`,
      entriesPushed: localNew,
      entriesPulled: remoteNew
    };
  } catch (err) {
    return {
      success: false,
      status: "error",
      message: `Sync failed: ${err}`
    };
  }
}
async function getCloudUrl() {
  const metadata = await loadSyncMetadata();
  if (metadata.gistId) {
    return `https://gist.github.com/${metadata.gistId}`;
  }
  return null;
}
var CloudSyncTool = class {
  async prepareInvocation(options, token) {
    const action = options.input.action || "sync";
    return {
      invocationMessage: `${action === "push" ? "Pushing" : action === "pull" ? "Pulling" : "Syncing"} knowledge with cloud...`,
      confirmationMessages: {
        title: "Cloud Sync",
        message: new vscode5.MarkdownString(
          `**${action.toUpperCase()}** global knowledge ${action === "push" ? "to" : action === "pull" ? "from" : "with"} GitHub?

This will ${action === "push" ? "upload local changes" : action === "pull" ? "download cloud changes" : "merge local and cloud"}.`
        )
      }
    };
  }
  async invoke(options, token) {
    const action = options.input.action || "sync";
    let result;
    switch (action) {
      case "push":
        result = await pushToCloud();
        break;
      case "pull":
        result = await pullFromCloud();
        break;
      default:
        result = await syncWithCloud();
    }
    const emoji = result.success ? "\u2705" : "\u274C";
    let response = `## ${emoji} Cloud Sync ${result.success ? "Complete" : "Failed"}

`;
    response += `**Status**: ${result.status}
`;
    response += `**Message**: ${result.message}
`;
    if (result.entriesPushed !== void 0) {
      response += `**Pushed**: ${result.entriesPushed} entries
`;
    }
    if (result.entriesPulled !== void 0) {
      response += `**Pulled**: ${result.entriesPulled} entries
`;
    }
    const cloudUrl = await getCloudUrl();
    if (cloudUrl) {
      response += `
**Cloud URL**: ${cloudUrl}
`;
    }
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(response)
    ]);
  }
};
function registerCloudSyncTools(context) {
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_cloud_sync", new CloudSyncTool())
  );
}
var backgroundSyncTimer;
var lastSyncAttempt;
var syncInProgress = false;
var BACKGROUND_SYNC_INTERVAL_MS = 5 * 60 * 1e3;
var MIN_SYNC_INTERVAL_MS = 60 * 1e3;
var unconsciousChannel;
function getUnconsciousChannel() {
  if (!unconsciousChannel) {
    unconsciousChannel = vscode5.window.createOutputChannel("Alex Unconscious Mind");
  }
  return unconsciousChannel;
}
function logUnconscious(message) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  getUnconsciousChannel().appendLine(`[${timestamp}] ${message}`);
}
async function transparentSync() {
  if (syncInProgress) {
    logUnconscious("Sync already in progress, skipping");
    return null;
  }
  if (lastSyncAttempt && Date.now() - lastSyncAttempt.getTime() < MIN_SYNC_INTERVAL_MS) {
    logUnconscious("Too soon since last sync, skipping");
    return null;
  }
  syncInProgress = true;
  lastSyncAttempt = /* @__PURE__ */ new Date();
  try {
    logUnconscious("Starting transparent background sync...");
    const status = await getSyncStatus();
    if (status.status === "up-to-date") {
      logUnconscious("Already up-to-date, no sync needed");
      return { success: true, status: "up-to-date", message: "Already synced" };
    }
    const result = await syncWithCloud();
    logUnconscious(`Sync complete: ${result.message}`);
    return result;
  } catch (err) {
    logUnconscious(`Transparent sync failed: ${err}`);
    return { success: false, status: "error", message: `${err}` };
  } finally {
    syncInProgress = false;
  }
}
async function triggerPostModificationSync() {
  setTimeout(async () => {
    const result = await transparentSync();
    if (result && result.success && result.entriesPushed && result.entriesPushed > 0) {
      logUnconscious(`Auto-synced ${result.entriesPushed} entries after modification`);
    }
  }, 2e3);
}
function startBackgroundSync(context) {
  if (backgroundSyncTimer) {
    clearInterval(backgroundSyncTimer);
  }
  logUnconscious("Background sync enabled - Alex unconscious mind active");
  setTimeout(async () => {
    logUnconscious("Running startup sync...");
    await transparentSync();
  }, 1e4);
  backgroundSyncTimer = setInterval(async () => {
    await transparentSync();
  }, BACKGROUND_SYNC_INTERVAL_MS);
  context.subscriptions.push({
    dispose: () => {
      if (backgroundSyncTimer) {
        clearInterval(backgroundSyncTimer);
        backgroundSyncTimer = void 0;
      }
      logUnconscious("Background sync disabled");
    }
  });
}

// src/chat/globalKnowledge.ts
var LOCK_OPTIONS = {
  stale: 1e4,
  // Consider lock stale after 10 seconds
  retries: {
    retries: 5,
    factor: 2,
    minTimeout: 100,
    maxTimeout: 1e3
  }
};
function getAlexGlobalPath() {
  return path6.join(os.homedir(), ALEX_GLOBAL_HOME);
}
function getGlobalKnowledgePath(subpath) {
  return path6.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS[subpath]);
}
async function ensureGlobalKnowledgeDirectories() {
  const paths = [
    getGlobalKnowledgePath("root"),
    getGlobalKnowledgePath("knowledge"),
    getGlobalKnowledgePath("patterns"),
    getGlobalKnowledgePath("insights")
  ];
  for (const dirPath of paths) {
    await fs6.ensureDir(dirPath);
  }
}
async function withFileLock(filePath, operation) {
  if (!await fs6.pathExists(filePath)) {
    await fs6.ensureFile(filePath);
  }
  let release;
  try {
    release = await lockfile.lock(filePath, LOCK_OPTIONS);
    return await operation();
  } finally {
    if (release) {
      await release();
    }
  }
}
async function updateGlobalKnowledgeIndex(updater) {
  const indexPath = getGlobalKnowledgePath("index");
  await ensureGlobalKnowledgeDirectories();
  return await withFileLock(indexPath, async () => {
    let index;
    try {
      if (await fs6.pathExists(indexPath)) {
        const content = await fs6.readFile(indexPath, "utf-8");
        if (content.trim()) {
          index = JSON.parse(content);
        } else {
          index = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), entries: [] };
        }
      } else {
        index = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), entries: [] };
      }
    } catch (err) {
      index = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), entries: [] };
    }
    index = await updater(index);
    index.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await fs6.writeJson(indexPath, index, { spaces: 2 });
    return index;
  });
}
async function updateProjectRegistry(updater) {
  const registryPath = getGlobalKnowledgePath("projectRegistry");
  await ensureGlobalKnowledgeDirectories();
  return await withFileLock(registryPath, async () => {
    let registry;
    try {
      if (await fs6.pathExists(registryPath)) {
        const content = await fs6.readFile(registryPath, "utf-8");
        if (content.trim()) {
          registry = JSON.parse(content);
        } else {
          registry = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), projects: [] };
        }
      } else {
        registry = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), projects: [] };
      }
    } catch (err) {
      registry = { version: "1.0.0", lastUpdated: (/* @__PURE__ */ new Date()).toISOString(), projects: [] };
    }
    registry = await updater(registry);
    registry.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await fs6.writeJson(registryPath, registry, { spaces: 2 });
    return registry;
  });
}
async function ensureGlobalKnowledgeIndex() {
  const indexPath = getGlobalKnowledgePath("index");
  await ensureGlobalKnowledgeDirectories();
  return await withFileLock(indexPath, async () => {
    try {
      if (await fs6.pathExists(indexPath)) {
        const content = await fs6.readFile(indexPath, "utf-8");
        if (content.trim()) {
          return JSON.parse(content);
        }
      }
    } catch (err) {
    }
    const newIndex = {
      version: "1.0.0",
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      entries: []
    };
    await fs6.writeJson(indexPath, newIndex, { spaces: 2 });
    return newIndex;
  });
}
async function ensureProjectRegistry() {
  const registryPath = getGlobalKnowledgePath("projectRegistry");
  await ensureGlobalKnowledgeDirectories();
  return await updateProjectRegistry((registry) => registry);
}
async function registerCurrentProject() {
  const workspaceFolders = vscode6.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return void 0;
  }
  const projectPath = workspaceFolders[0].uri.fsPath;
  const projectName = path6.basename(projectPath);
  let knowledgeFileCount = 0;
  const dkPattern = new vscode6.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/*.md");
  const dkFiles = await vscode6.workspace.findFiles(dkPattern);
  knowledgeFileCount = dkFiles.length;
  let savedEntry;
  await updateProjectRegistry((registry) => {
    const existingIndex = registry.projects.findIndex((p) => p.path === projectPath);
    const entry = {
      path: projectPath,
      name: projectName,
      lastAccessed: (/* @__PURE__ */ new Date()).toISOString(),
      knowledgeFiles: knowledgeFileCount
    };
    if (existingIndex >= 0) {
      registry.projects[existingIndex] = {
        ...registry.projects[existingIndex],
        ...entry
      };
      savedEntry = registry.projects[existingIndex];
    } else {
      registry.projects.push(entry);
      savedEntry = entry;
    }
    return registry;
  });
  return savedEntry;
}
function generateKnowledgeId(type, title) {
  const prefix = type === "pattern" ? GLOBAL_KNOWLEDGE_PREFIXES.pattern : GLOBAL_KNOWLEDGE_PREFIXES.insight;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 40);
  const timestamp = type === "insight" ? `-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}` : "";
  return `${prefix}${slug}${timestamp}`;
}
async function createGlobalPattern(title, content, category, tags, sourceProject) {
  await ensureGlobalKnowledgeDirectories();
  const id = generateKnowledgeId("pattern", title);
  const filename = `${id}.md`;
  const filePath = path6.join(getGlobalKnowledgePath("patterns"), filename);
  const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(", ")}  
**Source**: ${sourceProject || "Manual entry"}  
**Created**: ${(/* @__PURE__ */ new Date()).toISOString()}  

---

${content}

---

## Synapses

*Add cross-references to related knowledge files here*

`;
  await fs6.writeFile(filePath, fileContent, "utf-8");
  const entry = {
    id,
    title,
    type: "pattern",
    category,
    tags,
    sourceProject,
    created: (/* @__PURE__ */ new Date()).toISOString(),
    modified: (/* @__PURE__ */ new Date()).toISOString(),
    summary: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
    filePath
  };
  await updateGlobalKnowledgeIndex((index) => {
    index.entries.push(entry);
    return index;
  });
  return entry;
}
async function createGlobalInsight(title, content, category, tags, sourceProject, problemContext, solution) {
  await ensureGlobalKnowledgeDirectories();
  const id = generateKnowledgeId("insight", title);
  const filename = `${id}.md`;
  const filePath = path6.join(getGlobalKnowledgePath("insights"), filename);
  const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(", ")}  
**Source Project**: ${sourceProject || "Unknown"}  
**Date**: ${(/* @__PURE__ */ new Date()).toISOString()}  

---

## Context

${problemContext || "No problem context provided."}

## Insight

${content}

## Solution

${solution || "See insight above."}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${tags.join(", ")}
- Related patterns

## Related Projects

- ${sourceProject || "Origin project"}

`;
  await fs6.writeFile(filePath, fileContent, "utf-8");
  const entry = {
    id,
    title,
    type: "insight",
    category,
    tags,
    sourceProject,
    relatedProjects: sourceProject ? [sourceProject] : [],
    created: (/* @__PURE__ */ new Date()).toISOString(),
    modified: (/* @__PURE__ */ new Date()).toISOString(),
    summary: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
    filePath
  };
  await updateGlobalKnowledgeIndex((index) => {
    index.entries.push(entry);
    return index;
  });
  return entry;
}
async function searchGlobalKnowledge(query, options = {}) {
  const index = await ensureGlobalKnowledgeIndex();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
  const results = [];
  for (const entry of index.entries) {
    if (options.type && options.type !== "all" && entry.type !== options.type) {
      continue;
    }
    if (options.category && entry.category !== options.category) {
      continue;
    }
    if (options.tags && options.tags.length > 0) {
      const hasMatchingTag = options.tags.some(
        (tag) => entry.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
      if (!hasMatchingTag) {
        continue;
      }
    }
    let relevance = 0;
    if (entry.title.toLowerCase().includes(queryLower)) {
      relevance += 10;
    }
    for (const word of queryWords) {
      if (entry.title.toLowerCase().includes(word)) {
        relevance += 3;
      }
    }
    for (const tag of entry.tags) {
      if (tag.toLowerCase().includes(queryLower) || queryLower.includes(tag.toLowerCase())) {
        relevance += 5;
      }
      for (const word of queryWords) {
        if (tag.toLowerCase().includes(word)) {
          relevance += 2;
        }
      }
    }
    if (entry.summary.toLowerCase().includes(queryLower)) {
      relevance += 3;
    }
    for (const word of queryWords) {
      if (entry.summary.toLowerCase().includes(word)) {
        relevance += 1;
      }
    }
    if (entry.category.toLowerCase().includes(queryLower)) {
      relevance += 2;
    }
    if (relevance > 0) {
      let content;
      if (await fs6.pathExists(entry.filePath)) {
        try {
          content = await fs6.readFile(entry.filePath, "utf-8");
          for (const word of queryWords) {
            const matches = (content.toLowerCase().match(new RegExp(word, "g")) || []).length;
            relevance += Math.min(matches, 5) * 0.5;
          }
        } catch (err) {
        }
      }
      results.push({ entry, relevance, content });
    }
  }
  results.sort((a, b) => b.relevance - a.relevance);
  return results.slice(0, options.limit || 10);
}
async function promoteToGlobalKnowledge(localFilePath, category, additionalTags = []) {
  try {
    const content = await fs6.readFile(localFilePath, "utf-8");
    const filename = path6.basename(localFilePath, ".md");
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(/^DK-/, "").replace(/-/g, " ");
    const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
    const existingTags = tagsMatch ? tagsMatch[1].split(",").map((t) => t.trim()) : [];
    const allTags = [.../* @__PURE__ */ new Set([...existingTags, ...additionalTags])];
    const workspaceFolders = vscode6.workspace.workspaceFolders;
    const sourceProject = workspaceFolders ? path6.basename(workspaceFolders[0].uri.fsPath) : void 0;
    return await createGlobalPattern(title, content, category, allTags, sourceProject);
  } catch (err) {
    console.error("Failed to promote file to global knowledge:", err);
    return null;
  }
}
async function getGlobalKnowledgeSummary() {
  const index = await ensureGlobalKnowledgeIndex();
  const categories = {};
  const tagCounts = {};
  for (const entry of index.entries) {
    categories[entry.category] = (categories[entry.category] || 0) + 1;
    for (const tag of entry.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  const recentEntries = [...index.entries].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).slice(0, 5);
  return {
    totalPatterns: index.entries.filter((e) => e.type === "pattern").length,
    totalInsights: index.entries.filter((e) => e.type === "insight").length,
    categories,
    recentEntries,
    topTags
  };
}
var GlobalKnowledgeSearchTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Searching global knowledge for: ${options.input.query}`,
      confirmationMessages: {
        title: "Search Global Knowledge",
        message: new vscode6.MarkdownString(
          `Search Alex's global knowledge base across all projects for: **${options.input.query}**?

This searches patterns and insights learned from all your projects.`
        )
      }
    };
  }
  async invoke(options, token) {
    await ensureGlobalKnowledgeDirectories();
    const { query, type, category, tags } = options.input;
    const results = await searchGlobalKnowledge(query, {
      type,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : void 0,
      limit: 10
    });
    if (results.length === 0) {
      return new vscode6.LanguageModelToolResult([
        new vscode6.LanguageModelTextPart(
          `No global knowledge found matching "${query}".

You can save new knowledge using:
- \`@alex /saveinsight\` to save a learning from the current project
- \`@alex /promote\` to promote project-local knowledge to global`
        )
      ]);
    }
    let result = `## Global Knowledge Search Results

`;
    result += `Found **${results.length}** relevant entries for "${query}":

`;
    for (const { entry, relevance } of results) {
      const typeEmoji = entry.type === "pattern" ? "\u{1F4D0}" : "\u{1F4A1}";
      result += `### ${typeEmoji} ${entry.title}
`;
      result += `- **Type**: ${entry.type} | **Category**: ${entry.category}
`;
      result += `- **Tags**: ${entry.tags.join(", ")}
`;
      if (entry.sourceProject) {
        result += `- **Source**: ${entry.sourceProject}
`;
      }
      result += `- **Summary**: ${entry.summary}
`;
      result += `- **File**: \`${entry.filePath}\`

`;
    }
    return new vscode6.LanguageModelToolResult([
      new vscode6.LanguageModelTextPart(result)
    ]);
  }
};
var SaveInsightTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Saving insight: ${options.input.title}`,
      confirmationMessages: {
        title: "Save Global Insight",
        message: new vscode6.MarkdownString(
          `Save this insight to Alex's global knowledge base?

**Title**: ${options.input.title}

This will be available across all your projects.`
        )
      }
    };
  }
  async invoke(options, token) {
    await ensureGlobalKnowledgeDirectories();
    const { title, insight, category, tags, problem, solution } = options.input;
    const workspaceFolders = vscode6.workspace.workspaceFolders;
    const sourceProject = workspaceFolders ? path6.basename(workspaceFolders[0].uri.fsPath) : void 0;
    const entry = await createGlobalInsight(
      title,
      insight,
      category || "general",
      tags ? tags.split(",").map((t) => t.trim()) : [],
      sourceProject,
      problem,
      solution
    );
    triggerPostModificationSync();
    const result = `## \u2705 Insight Saved to Global Knowledge

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(", ")}  
**Source Project**: ${entry.sourceProject || "Unknown"}  
**File**: \`${entry.filePath}\`

This insight is now available across all your projects.
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;
    return new vscode6.LanguageModelToolResult([
      new vscode6.LanguageModelTextPart(result)
    ]);
  }
};
var PromoteKnowledgeTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Promoting ${path6.basename(options.input.filePath)} to global knowledge`,
      confirmationMessages: {
        title: "Promote to Global Knowledge",
        message: new vscode6.MarkdownString(
          `Promote this project-local knowledge file to global knowledge?

**File**: ${options.input.filePath}

This will make it searchable and available across all your projects.`
        )
      }
    };
  }
  async invoke(options, token) {
    const { filePath, category, additionalTags } = options.input;
    if (!await fs6.pathExists(filePath)) {
      return new vscode6.LanguageModelToolResult([
        new vscode6.LanguageModelTextPart(`\u274C File not found: ${filePath}`)
      ]);
    }
    const entry = await promoteToGlobalKnowledge(
      filePath,
      category || "general",
      additionalTags ? additionalTags.split(",").map((t) => t.trim()) : []
    );
    if (!entry) {
      return new vscode6.LanguageModelToolResult([
        new vscode6.LanguageModelTextPart(`\u274C Failed to promote file to global knowledge.`)
      ]);
    }
    triggerPostModificationSync();
    const result = `## \u2705 Knowledge Promoted to Global

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(", ")}  
**Global File**: \`${entry.filePath}\`

This knowledge is now available across all your projects!
*\u{1F9E0} Unconscious sync triggered - backing up to cloud automatically.*
`;
    return new vscode6.LanguageModelToolResult([
      new vscode6.LanguageModelTextPart(result)
    ]);
  }
};
var GlobalKnowledgeStatusTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Retrieving global knowledge status..."
    };
  }
  async invoke(options, token) {
    await ensureGlobalKnowledgeDirectories();
    const summary = await getGlobalKnowledgeSummary();
    const registry = await ensureProjectRegistry();
    let syncStatusStr = "";
    try {
      const syncStatus = await getSyncStatus();
      const statusEmoji = syncStatus.status === "up-to-date" ? "\u2705" : syncStatus.status === "needs-push" ? "\u{1F4E4}" : syncStatus.status === "needs-pull" ? "\u{1F4E5}" : syncStatus.status === "error" ? "\u274C" : "\u26AA";
      syncStatusStr = `| Cloud Sync | ${statusEmoji} ${syncStatus.status} |
`;
    } catch {
      syncStatusStr = `| Cloud Sync | \u26AA Not configured |
`;
    }
    let result = `## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${summary.totalPatterns} |
| Global Insights | ${summary.totalInsights} |
| Known Projects | ${registry.projects.length} |
${syncStatusStr}
### Knowledge by Category
`;
    for (const [cat, count] of Object.entries(summary.categories)) {
      result += `- **${cat}**: ${count}
`;
    }
    if (summary.topTags.length > 0) {
      result += `
### Top Tags
`;
      for (const { tag, count } of summary.topTags) {
        result += `- ${tag}: ${count}
`;
      }
    }
    if (summary.recentEntries.length > 0) {
      result += `
### Recent Entries
`;
      for (const entry of summary.recentEntries) {
        const typeEmoji = entry.type === "pattern" ? "\u{1F4D0}" : "\u{1F4A1}";
        result += `- ${typeEmoji} **${entry.title}** (${entry.category})
`;
      }
    }
    if (registry.projects.length > 0) {
      result += `
### Known Projects
`;
      for (const project of registry.projects.slice(0, 5)) {
        result += `- **${project.name}** - ${project.knowledgeFiles} knowledge files
`;
      }
    }
    result += `
### Global Knowledge Location
\`${getAlexGlobalPath()}\`
`;
    return new vscode6.LanguageModelToolResult([
      new vscode6.LanguageModelTextPart(result)
    ]);
  }
};
function registerGlobalKnowledgeTools(context) {
  context.subscriptions.push(
    vscode6.lm.registerTool("alex_global_knowledge_search", new GlobalKnowledgeSearchTool()),
    vscode6.lm.registerTool("alex_save_insight", new SaveInsightTool()),
    vscode6.lm.registerTool("alex_promote_knowledge", new PromoteKnowledgeTool()),
    vscode6.lm.registerTool("alex_global_knowledge_status", new GlobalKnowledgeStatusTool())
  );
}

// src/chat/tools.ts
var SynapseHealthTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Scanning synaptic connections...",
      confirmationMessages: {
        title: "Synapse Health Check",
        message: new vscode7.MarkdownString(
          `Scan Alex cognitive architecture for synaptic connection health?

This will:
- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)
- Validate synapse connections
- Report broken or orphaned links`
        )
      }
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const patterns = [
      ".github/copilot-instructions.md",
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/episodic/*.md",
      ".github/domain-knowledge/*.md"
    ];
    let totalFiles = 0;
    let totalSynapses = 0;
    let brokenSynapses = 0;
    const issues = [];
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
    for (const pattern of patterns) {
      const relativePattern = new vscode7.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode7.workspace.findFiles(relativePattern);
      for (const file of files) {
        totalFiles++;
        try {
          const content = await fs7.readFile(file.fsPath, "utf-8");
          const lines = content.split("\n");
          let inCodeBlock = false;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().startsWith("```")) {
              inCodeBlock = !inCodeBlock;
              continue;
            }
            if (inCodeBlock) {
              continue;
            }
            let match;
            while ((match = synapseRegex.exec(line)) !== null) {
              totalSynapses++;
              const targetName = match[1].trim();
              const found = await vscode7.workspace.findFiles(
                new vscode7.RelativePattern(workspaceFolders[0], `**/${targetName}`)
              );
              if (found.length === 0) {
                brokenSynapses++;
                if (options.input.detailed) {
                  issues.push(`- ${path7.basename(file.fsPath)}:${i + 1} \u2192 ${targetName} (not found)`);
                }
              }
            }
          }
        } catch (err) {
        }
      }
    }
    const healthStatus = brokenSynapses === 0 ? "EXCELLENT" : brokenSynapses < 5 ? "GOOD" : brokenSynapses < 10 ? "NEEDS ATTENTION" : "CRITICAL";
    let result = `## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${totalFiles} |
| Total Synapses | ${totalSynapses} |
| Broken Connections | ${brokenSynapses} |
| Health Status | ${healthStatus} |
`;
    if (options.input.detailed && issues.length > 0) {
      result += `
### Issues Found
${issues.join("\n")}`;
    }
    if (brokenSynapses > 0) {
      result += `

**Recommendation**: Run \`Alex: Dream (Neural Maintenance)\` to auto-repair broken connections.`;
    }
    return new vscode7.LanguageModelToolResult([
      new vscode7.LanguageModelTextPart(result)
    ]);
  }
};
var MemorySearchTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Searching Alex memory for: ${options.input.query}`,
      confirmationMessages: {
        title: "Search Alex Memory",
        message: new vscode7.MarkdownString(
          `Search Alex cognitive architecture memory files for: **${options.input.query}**?

Memory type: ${options.input.memoryType || "all"}`
        )
      }
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart("No workspace folder open.")
      ]);
    }
    const query = options.input.query.toLowerCase();
    const memoryType = options.input.memoryType || "all";
    const patterns = [];
    if (memoryType === "all" || memoryType === "procedural") {
      patterns.push(".github/instructions/*.md");
    }
    if (memoryType === "all" || memoryType === "episodic") {
      patterns.push(".github/prompts/*.md");
      patterns.push(".github/episodic/*.md");
    }
    if (memoryType === "all" || memoryType === "domain") {
      patterns.push(".github/domain-knowledge/*.md");
    }
    const results = [];
    for (const pattern of patterns) {
      const relativePattern = new vscode7.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode7.workspace.findFiles(relativePattern);
      for (const file of files) {
        try {
          const content = await fs7.readFile(file.fsPath, "utf-8");
          const lines = content.split("\n");
          const matches = [];
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(query)) {
              const start = Math.max(0, i - 1);
              const end = Math.min(lines.length - 1, i + 1);
              const context = lines.slice(start, end + 1).join("\n");
              matches.push(`Line ${i + 1}:
${context}`);
            }
          }
          if (matches.length > 0) {
            results.push({
              file: path7.basename(file.fsPath),
              matches: matches.slice(0, 3)
              // Limit to first 3 matches per file
            });
          }
        } catch (err) {
        }
      }
    }
    let globalResults = [];
    if (results.length === 0) {
      try {
        globalResults = await searchGlobalKnowledge(options.input.query, { limit: 5 });
      } catch {
      }
    }
    if (results.length === 0 && globalResults.length === 0) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart(`No matches found for "${options.input.query}" in local ${memoryType} memory or global knowledge base.`)
      ]);
    }
    let resultText = "";
    if (results.length > 0) {
      resultText += `## Local Memory Results for "${options.input.query}"

`;
      resultText += `Found ${results.length} file(s) with matches:

`;
      for (const result of results.slice(0, 5)) {
        resultText += `### ${result.file}
`;
        for (const match of result.matches) {
          resultText += `\`\`\`
${match}
\`\`\`
`;
        }
        resultText += "\n";
      }
    }
    if (globalResults.length > 0) {
      if (results.length === 0) {
        resultText += `## \u{1F310} Global Knowledge Results (Unconscious Retrieval)

`;
        resultText += `*Local search found nothing. Automatically searched cross-project knowledge:*

`;
      } else {
        resultText += `## \u{1F310} Related Global Knowledge

`;
      }
      for (const { entry } of globalResults.slice(0, 3)) {
        const typeEmoji = entry.type === "pattern" ? "\u{1F4D0}" : "\u{1F4A1}";
        resultText += `### ${typeEmoji} ${entry.title}
`;
        resultText += `- **Type**: ${entry.type} | **Category**: ${entry.category}
`;
        resultText += `- **Tags**: ${entry.tags.join(", ")}
`;
        resultText += `- **Summary**: ${entry.summary}

`;
      }
    }
    return new vscode7.LanguageModelToolResult([
      new vscode7.LanguageModelTextPart(resultText)
    ]);
  }
};
var ArchitectureStatusTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Checking Alex architecture status..."
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const markerFile = path7.join(rootPath, ".github", "copilot-instructions.md");
    const isInstalled = await fs7.pathExists(markerFile);
    if (!isInstalled) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart(
          `Alex Cognitive Architecture is **not installed** in this workspace.

Run \`Alex: Initialize Architecture\` from the Command Palette to install.`
        )
      ]);
    }
    const instructionFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/instructions/*.md")
    );
    const promptFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/prompts/*.md")
    );
    const episodicFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/episodic/*.md")
    );
    const domainFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/*.md")
    );
    let version = "Unknown";
    try {
      const content = await fs7.readFile(markerFile, "utf-8");
      const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
      if (versionMatch) {
        version = versionMatch[1];
      }
    } catch (err) {
    }
    const result = `## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | \u2705 Installed |
| Version | ${version} |
| Procedural Memory | ${instructionFiles.length} files |
| Episodic Memory | ${promptFiles.length + episodicFiles.length} files |
| Domain Knowledge | ${domainFiles.length} files |

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
`;
    return new vscode7.LanguageModelToolResult([
      new vscode7.LanguageModelTextPart(result)
    ]);
  }
};
var McpRecommendationTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Finding MCP tools for: ${options.input.scenario}`
    };
  }
  async invoke(options, token) {
    const scenario = options.input.scenario.toLowerCase();
    const platform = options.input.platform || "both";
    const recommendations = [];
    if (platform === "azure" || platform === "both") {
      recommendations.push(`## Azure MCP Tools (50+ Tools Available)

### Best Practices & Documentation
| Tool | Purpose | Use When |
|------|---------|----------|
| \`mcp_azure_mcp_get_bestpractices\` | Azure Functions, deployment, SDK best practices | Generating code, deploying |
| \`mcp_azure_mcp_azureterraformbestpractices\` | Terraform best practices for Azure | Creating IaC |
| \`mcp_azure_mcp_documentation\` | Search Microsoft Learn documentation | Need official docs |
| \`mcp_microsoft_doc_microsoft_docs_search\` | Search all Microsoft documentation | Broad doc search |
| \`mcp_microsoft_doc_microsoft_code_sample_search\` | Find code samples in MS docs | Need code examples |

### AI & Machine Learning
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_foundry\` | \`foundry\` | Azure AI Foundry models, deployments, endpoints |
| \`azure_search\` | \`search\` | Azure AI Search services, indexes, queries |
| \`mcp_azure_mcp_speech\` | \`speech\` | Speech-to-text, text-to-speech services |

### Databases
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_cosmos\` | \`cosmos\` | Cosmos DB accounts, databases, containers, queries |
| \`azure_mysql\` | \`mysql\` | Azure Database for MySQL servers, databases |
| \`azure_postgres\` | \`postgres\` | Azure Database for PostgreSQL servers, databases |
| \`azure_redis\` | \`redis\` | Managed Redis and Cache for Redis |
| \`azure_sql\` | \`sql\` | Azure SQL servers, databases, firewall rules |

### Compute & Containers
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_appservice\` | \`appservice\` | App Service database connections |
| \`azure_functionapp\` | \`functionapp\` | List Azure Functions |
| \`mcp_azure_mcp_aks\` | \`aks\` | Azure Kubernetes Service clusters, node pools |
| \`azure_acr\` | \`acr\` | Azure Container Registry instances |

### Messaging & Events
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_eventgrid\` | \`eventgrid\` | Event Grid topics, subscriptions |
| \`azure_eventhubs\` | \`eventhubs\` | Event Hubs namespaces |
| \`azure_servicebus\` | \`servicebus\` | Service Bus messaging |

### Analytics & Monitoring
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_kusto\` | \`kusto\` | Azure Data Explorer clusters, queries |
| \`azure_monitor\` | \`monitor\` | Query logs and metrics |
| \`azure_applicationinsights\` | \`applicationinsights\` | Application Insights resources |
| \`mcp_azure_mcp_applens\` | \`applens\` | Diagnose app performance issues |
| \`azure_grafana\` | \`grafana\` | Managed Grafana workspaces |
| \`azure_workbooks\` | \`workbooks\` | Azure Workbooks visualization |

### Security & Identity
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_keyvault\` | \`keyvault\` | Key Vault secrets, keys, certificates |
| \`azure_role\` | \`role\` | RBAC assignments |
| \`azure_confidentialledger\` | \`confidentialledger\` | Confidential Ledger transactions |

### Developer Tools
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_appconfig\` | \`appconfig\` | App Configuration settings, feature flags |
| \`mcp_azure_mcp_azd\` | \`azd\` | Azure Developer CLI commands |
| \`azure_bicepschema\` | \`bicepschema\` | Bicep schemas for IaC |
| \`azure_deploy\` | \`deploy\` | Deploy Azure resources |
| \`azure_loadtesting\` | \`loadtesting\` | Create and run load tests |

### Storage
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_storage\` | \`storage\` | Storage accounts, containers, blobs, tables |
| \`mcp_azure_mcp_managedlustre\` | \`managedlustre\` | High-performance Lustre file systems |

### Architecture & Governance
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_cloudarchitect\` | \`cloudarchitect\` | Generate architecture designs |
| \`azure_quota\` | \`quota\` | Manage resource quotas and limits |
| \`azure_resourcehealth\` | \`resourcehealth\` | Check resource health status |
| \`mcp_azure_mcp_extension_azqr\` | \`azqr\` | Compliance and security reports |

### Management
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_subscription\` | \`subscription\` | List Azure subscriptions |
| \`azure_group\` | \`group\` | List resource groups |
| \`azure_marketplace\` | \`marketplace\` | Discover Marketplace products |
`);
    }
    if (platform === "m365" || platform === "both") {
      recommendations.push(`## Microsoft 365 MCP Tools

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
`);
    }
    recommendations.push(`## Recommended for: "${options.input.scenario}"

### How to Use These Tools
1. **Switch to Agent Mode** in GitHub Copilot Chat
2. Ask your question naturally - tools are invoked automatically
3. Or reference tools explicitly with \`#toolName\`

### Example Prompts
- "Create an Azure Function with Cosmos DB binding using best practices"
- "Build a Teams bot with adaptive cards and SSO"
- "Query my Azure resources to find expensive VMs"
- "Generate a declarative Copilot agent manifest"
`);
    return new vscode7.LanguageModelToolResult([
      new vscode7.LanguageModelTextPart(recommendations.join("\n"))
    ]);
  }
};
var UserProfileTool = class {
  async prepareInvocation(options, token) {
    const action = options.input.action;
    const actionMessages = {
      "get": "Reading user profile...",
      "update": `Updating user profile: ${options.input.field}...`,
      "exists": "Checking if user profile exists..."
    };
    return {
      invocationMessage: actionMessages[action] || "Accessing user profile..."
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const profilePath = path7.join(rootPath, "config", "USER-PROFILE.md");
    const jsonProfilePath = path7.join(rootPath, "config", "user-profile.json");
    const { action, field, value } = options.input;
    try {
      switch (action) {
        case "exists":
          const exists = await fs7.pathExists(jsonProfilePath);
          return new vscode7.LanguageModelToolResult([
            new vscode7.LanguageModelTextPart(JSON.stringify({ exists, path: jsonProfilePath }))
          ]);
        case "get":
          if (!await fs7.pathExists(jsonProfilePath)) {
            return new vscode7.LanguageModelToolResult([
              new vscode7.LanguageModelTextPart(JSON.stringify({
                exists: false,
                message: "No user profile found. I should ask the user about themselves to create one.",
                suggestedQuestions: [
                  "What's your name?",
                  "What's your role (developer, architect, etc.)?",
                  "Do you prefer casual or formal communication?",
                  "What technologies do you work with most?"
                ]
              }))
            ]);
          }
          const profile = await fs7.readJson(jsonProfilePath);
          if (field) {
            return new vscode7.LanguageModelToolResult([
              new vscode7.LanguageModelTextPart(JSON.stringify({ [field]: profile[field] }))
            ]);
          }
          return new vscode7.LanguageModelToolResult([
            new vscode7.LanguageModelTextPart(JSON.stringify(profile))
          ]);
        case "update":
          if (!field || value === void 0) {
            return new vscode7.LanguageModelToolResult([
              new vscode7.LanguageModelTextPart("Error: Both field and value are required for update action.")
            ]);
          }
          await fs7.ensureDir(path7.join(rootPath, "config"));
          let existingProfile = {};
          if (await fs7.pathExists(jsonProfilePath)) {
            existingProfile = await fs7.readJson(jsonProfilePath);
          }
          if (["primaryTechnologies", "learningGoals", "expertiseAreas"].includes(field)) {
            const currentArray = existingProfile[field] || [];
            if (Array.isArray(currentArray)) {
              if (!currentArray.includes(value)) {
                existingProfile[field] = [...currentArray, value];
              }
            } else {
              existingProfile[field] = [value];
            }
          } else {
            existingProfile[field] = value;
          }
          existingProfile.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          await fs7.writeJson(jsonProfilePath, existingProfile, { spaces: 2 });
          await this.updateMarkdownProfile(profilePath, existingProfile);
          return new vscode7.LanguageModelToolResult([
            new vscode7.LanguageModelTextPart(JSON.stringify({
              success: true,
              field,
              value,
              message: `Updated ${field} to: ${value}`
            }))
          ]);
        default:
          return new vscode7.LanguageModelToolResult([
            new vscode7.LanguageModelTextPart(`Unknown action: ${action}`)
          ]);
      }
    } catch (error) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart(`Error accessing user profile: ${error.message}`)
      ]);
    }
  }
  async updateMarkdownProfile(profilePath, profile) {
    const markdown = `# User Profile

*Last updated: ${profile.lastUpdated || "Never"}*

## \u{1F464} Identity

| Field | Value |
|-------|-------|
| **Name** | ${profile.name || "(not set)"} |
| **Nickname** | ${profile.nickname || "(not set)"} |
| **Pronouns** | ${profile.pronouns || "(not set)"} |
| **Role** | ${profile.role || "(not set)"} |
| **Experience Level** | ${profile.experienceLevel || "(not set)"} |

## \u{1F4AC} Communication Preferences

| Preference | Setting |
|------------|---------|
| **Formality** | ${profile.formality || "balanced"} |
| **Detail Level** | ${profile.detailLevel || "balanced"} |
| **Explanation Style** | ${profile.explanationStyle || "both"} |
| **Humor** | ${profile.humor || "occasional"} |
| **Encouragement** | ${profile.encouragement || "occasional"} |
| **Question Frequency** | ${profile.questionFrequency || "ask when needed"} |
| **Proactive Suggestions** | ${profile.proactiveSuggestions || "occasional"} |

## \u{1F6E0}\uFE0F Technical Context

### Primary Technologies
${(profile.primaryTechnologies || []).map((t) => `- ${t}`).join("\n") || "- (not set)"}

### Learning Goals
${(profile.learningGoals || []).map((g) => `- ${g}`).join("\n") || "- (not set)"}

### Expertise Areas
${(profile.expertiseAreas || []).map((e) => `- ${e}`).join("\n") || "- (not set)"}

## \u{1F3AF} Work Context

### Current Projects
${profile.currentProjects || "(not set)"}

## \u{1F31F} Notes

${profile.notes || "(none)"}

---

*This profile is managed by Alex and updated through conversations.*
`;
    await fs7.writeFile(profilePath, markdown, "utf-8");
  }
};
var SelfActualizationTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Running self-actualization protocol...",
      confirmationMessages: {
        title: "Self-Actualization Protocol",
        message: new vscode7.MarkdownString(
          `Run comprehensive self-assessment of Alex cognitive architecture?

This will:
- Validate all synaptic connections
- Check version consistency across memory files
- Assess memory architecture balance
- Generate improvement recommendations
- Create a meditation session record`
        )
      }
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode7.LanguageModelToolResult([
        new vscode7.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    let currentVersion = "Unknown";
    try {
      const mainInstructionsPath = path7.join(rootPath, ".github", "copilot-instructions.md");
      if (await fs7.pathExists(mainInstructionsPath)) {
        const content = await fs7.readFile(mainInstructionsPath, "utf-8");
        const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
        if (versionMatch) {
          currentVersion = versionMatch[1];
        }
      }
    } catch {
    }
    const report = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      synapseHealth: {
        totalFiles: 0,
        totalSynapses: 0,
        brokenConnections: 0,
        healthStatus: "UNKNOWN"
      },
      versionConsistency: {
        currentVersion,
        outdatedReferences: 0
      },
      memoryArchitecture: {
        proceduralFiles: 0,
        episodicFiles: 0,
        domainFiles: 0
      },
      recommendations: []
    };
    const synapsePatterns = [
      ".github/copilot-instructions.md",
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/episodic/*.md",
      ".github/domain-knowledge/*.md"
    ];
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
    for (const pattern of synapsePatterns) {
      const relativePattern = new vscode7.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode7.workspace.findFiles(relativePattern);
      for (const file of files) {
        report.synapseHealth.totalFiles++;
        try {
          const content = await fs7.readFile(file.fsPath, "utf-8");
          const lines = content.split("\n");
          let inCodeBlock = false;
          for (const line of lines) {
            if (line.trim().startsWith("```")) {
              inCodeBlock = !inCodeBlock;
              continue;
            }
            if (inCodeBlock) {
              continue;
            }
            let match;
            while ((match = synapseRegex.exec(line)) !== null) {
              report.synapseHealth.totalSynapses++;
              const targetName = match[1].trim();
              const found = await vscode7.workspace.findFiles(
                new vscode7.RelativePattern(workspaceFolders[0], `**/${targetName}`)
              );
              if (found.length === 0) {
                report.synapseHealth.brokenConnections++;
              }
            }
          }
        } catch {
        }
      }
    }
    report.synapseHealth.healthStatus = report.synapseHealth.brokenConnections === 0 ? "EXCELLENT" : report.synapseHealth.brokenConnections < 5 ? "GOOD" : report.synapseHealth.brokenConnections < 10 ? "NEEDS ATTENTION" : "CRITICAL";
    const instructionFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/instructions/*.md")
    );
    const promptFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/prompts/*.md")
    );
    const episodicFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/episodic/*.md")
    );
    const domainFiles = await vscode7.workspace.findFiles(
      new vscode7.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/*.md")
    );
    report.memoryArchitecture.proceduralFiles = instructionFiles.length;
    report.memoryArchitecture.episodicFiles = promptFiles.length + episodicFiles.length;
    report.memoryArchitecture.domainFiles = domainFiles.length;
    if (report.synapseHealth.brokenConnections > 0) {
      report.recommendations.push(
        `Run \`Alex: Dream (Neural Maintenance)\` to repair ${report.synapseHealth.brokenConnections} broken synapse(s)`
      );
    }
    if (report.memoryArchitecture.domainFiles < 3) {
      report.recommendations.push(
        `Consider acquiring more domain knowledge - only ${report.memoryArchitecture.domainFiles} DK file(s) present`
      );
    }
    if (report.memoryArchitecture.episodicFiles < 5) {
      report.recommendations.push(
        `Run more meditation sessions to build episodic memory - only ${report.memoryArchitecture.episodicFiles} session(s)`
      );
    }
    let sessionFile = "";
    if (options.input.createReport !== false) {
      const episodicPath = path7.join(rootPath, ".github", "episodic");
      await fs7.ensureDir(episodicPath);
      const date = /* @__PURE__ */ new Date();
      const dateStr = date.toISOString().split("T")[0];
      const filename = `self-actualization-${dateStr}.prompt.md`;
      sessionFile = path7.join(episodicPath, filename);
      const healthEmoji2 = report.synapseHealth.healthStatus === "EXCELLENT" ? "\u2705" : report.synapseHealth.healthStatus === "GOOD" ? "\u{1F7E2}" : report.synapseHealth.healthStatus === "NEEDS ATTENTION" ? "\u{1F7E1}" : "\u{1F534}";
      const content = `# Self-Actualization Session - ${dateStr}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${report.versionConsistency.currentVersion}
**Timestamp**: ${report.timestamp}

---

## \u{1F9E0} Synapse Health

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${healthEmoji2} ${report.synapseHealth.healthStatus} |

## \u{1F4CA} Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${report.memoryArchitecture.proceduralFiles} |
| Episodic | ${report.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${report.memoryArchitecture.domainFiles} |

## \u{1F4A1} Recommendations

${report.recommendations.length > 0 ? report.recommendations.map((r) => `- ${r}`).join("\n") : "- Architecture is optimal!"}

---

*Generated by Alex Self-Actualization Protocol*
`;
      await fs7.writeFile(sessionFile, content, "utf-8");
    }
    const healthEmoji = report.synapseHealth.healthStatus === "EXCELLENT" ? "\u2705" : report.synapseHealth.healthStatus === "GOOD" ? "\u{1F7E2}" : report.synapseHealth.healthStatus === "NEEDS ATTENTION" ? "\u{1F7E1}" : "\u{1F534}";
    let result = `## Self-Actualization Report

### Synapse Health ${healthEmoji}

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${report.synapseHealth.healthStatus} |

### Memory Architecture

| Type | Files |
|------|-------|
| Procedural Memory | ${report.memoryArchitecture.proceduralFiles} |
| Episodic Memory | ${report.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${report.memoryArchitecture.domainFiles} |
| **Total** | **${report.memoryArchitecture.proceduralFiles + report.memoryArchitecture.episodicFiles + report.memoryArchitecture.domainFiles}** |

### Recommendations

${report.recommendations.length > 0 ? report.recommendations.map((r) => `- ${r}`).join("\n") : "- \u2728 Architecture is healthy and optimized!"}
`;
    if (sessionFile) {
      result += `
### Session Recorded

Meditation session documented at: \`${path7.basename(sessionFile)}\``;
    }
    return new vscode7.LanguageModelToolResult([
      new vscode7.LanguageModelTextPart(result)
    ]);
  }
};
async function getUserProfile() {
  const workspaceFolders = vscode7.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return null;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const jsonProfilePath = path7.join(rootPath, "config", "user-profile.json");
  try {
    if (await fs7.pathExists(jsonProfilePath)) {
      return await fs7.readJson(jsonProfilePath);
    }
  } catch (error) {
    console.error("Error reading user profile:", error);
  }
  return null;
}
function formatPersonalizedGreeting(profile) {
  if (!profile || !profile.name) {
    return "Hello! I'm Alex, your cognitive learning partner.";
  }
  const name = profile.nickname || profile.name;
  const greetings = [
    `Hey ${name}! Great to see you.`,
    `Hello ${name}! Ready to dive in?`,
    `Hi ${name}! What are we working on today?`,
    `Welcome back, ${name}!`
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
function registerLanguageModelTools(context) {
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_synapse_health", new SynapseHealthTool())
  );
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_memory_search", new MemorySearchTool())
  );
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_architecture_status", new ArchitectureStatusTool())
  );
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_mcp_recommendations", new McpRecommendationTool())
  );
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_user_profile", new UserProfileTool())
  );
  context.subscriptions.push(
    vscode7.lm.registerTool("alex_self_actualization", new SelfActualizationTool())
  );
  console.log("Alex Language Model Tools registered");
}

// src/shared/utils.ts
var vscode8 = __toESM(require("vscode"));
var fs8 = __toESM(require_lib());
var path8 = __toESM(require("path"));
function validateWorkspace() {
  const workspaceFolders = vscode8.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return {
      isValid: false,
      error: "No workspace folder open. Please open a project folder first (File \u2192 Open Folder)."
    };
  }
  return {
    isValid: true,
    rootPath: workspaceFolders[0].uri.fsPath,
    workspaceFolder: workspaceFolders[0]
  };
}
async function getInstalledAlexVersion(rootPath, numericOnly = false) {
  const instructionsPath = path8.join(rootPath, ".github", "copilot-instructions.md");
  if (!await fs8.pathExists(instructionsPath)) {
    return null;
  }
  try {
    const content = await fs8.readFile(instructionsPath, "utf8");
    const regex = numericOnly ? VERSION_NUMBER_REGEX : VERSION_EXTRACT_REGEX;
    const match = content.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// src/chat/participant.ts
var INSIGHT_PATTERNS = [
  /(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)/i,
  /(?:this works because|the reason is|what fixed it|solved by|resolved by)/i,
  /(?:always remember to|never forget to|make sure to|be careful to)/i,
  /(?:debugging tip|performance tip|security tip)/i
];
var DOMAIN_KEYWORDS = [
  "pattern",
  "anti-pattern",
  "best practice",
  "gotcha",
  "pitfall",
  "workaround",
  "solution",
  "fix",
  "resolved",
  "debugging",
  "performance",
  "optimization",
  "security",
  "architecture"
];
function detectPotentialInsight(text) {
  const lowerText = text.toLowerCase();
  let patternMatches = 0;
  for (const pattern of INSIGHT_PATTERNS) {
    if (pattern.test(text)) {
      patternMatches++;
    }
  }
  const foundKeywords = [];
  for (const keyword of DOMAIN_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  const confidence = patternMatches * 0.3 + foundKeywords.length * 0.1;
  return {
    detected: confidence >= 0.3 || patternMatches >= 1,
    confidence: Math.min(confidence, 1),
    keywords: foundKeywords
  };
}
async function autoSaveInsight(content, keywords, sourceProject) {
  try {
    const firstSentence = content.split(/[.!?]/)[0].trim();
    const title = firstSentence.length > 10 && firstSentence.length < 100 ? firstSentence : `Auto-captured insight - ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
    let category = "general";
    if (keywords.includes("debugging")) {
      category = "debugging";
    } else if (keywords.includes("performance") || keywords.includes("optimization")) {
      category = "performance";
    } else if (keywords.includes("security")) {
      category = "security";
    } else if (keywords.includes("architecture")) {
      category = "architecture";
    } else if (keywords.includes("pattern") || keywords.includes("anti-pattern")) {
      category = "patterns";
    }
    await createGlobalInsight(
      title,
      content,
      category,
      keywords,
      sourceProject,
      "Auto-detected from conversation",
      content
    );
    triggerPostModificationSync();
    console.log(`[Unconscious] Auto-saved insight: ${title}`);
  } catch (err) {
    console.warn("[Unconscious] Failed to auto-save insight:", err);
  }
}
var conversationBuffer = [];
var MAX_BUFFER_SIZE = 5;
function trackConversationForInsights(userMessage, sourceProject) {
  conversationBuffer.push(userMessage);
  if (conversationBuffer.length > MAX_BUFFER_SIZE) {
    conversationBuffer.shift();
  }
  const combinedContext = conversationBuffer.join(" ");
  const analysis = detectPotentialInsight(combinedContext);
  if (analysis.detected && analysis.confidence >= 0.5) {
    autoSaveInsight(userMessage, analysis.keywords, sourceProject);
    conversationBuffer = [];
  }
}
var alexChatHandler = async (request2, context, stream, token) => {
  if (request2.command === "meditate") {
    return await handleMeditateCommand(request2, context, stream, token);
  }
  if (request2.command === "dream") {
    return await handleDreamCommand(request2, context, stream, token);
  }
  if (request2.command === "learn") {
    return await handleLearnCommand(request2, context, stream, token);
  }
  if (request2.command === "status") {
    return await handleStatusCommand(request2, context, stream, token);
  }
  if (request2.command === "azure") {
    return await handleAzureCommand(request2, context, stream, token);
  }
  if (request2.command === "m365") {
    return await handleM365Command(request2, context, stream, token);
  }
  if (request2.command === "profile") {
    return await handleProfileCommand(request2, context, stream, token);
  }
  if (request2.command === "selfactualize") {
    return await handleSelfActualizeCommand(request2, context, stream, token);
  }
  if (request2.command === "knowledge") {
    return await handleKnowledgeCommand(request2, context, stream, token);
  }
  if (request2.command === "saveinsight") {
    return await handleSaveInsightCommand(request2, context, stream, token);
  }
  if (request2.command === "promote") {
    return await handlePromoteCommand(request2, context, stream, token);
  }
  if (request2.command === "knowledgestatus") {
    return await handleKnowledgeStatusCommand(request2, context, stream, token);
  }
  if (request2.command === "sync") {
    return await handleSyncCommand(request2, context, stream, token);
  }
  if (request2.command === "push") {
    return await handlePushCommand(request2, context, stream, token);
  }
  if (request2.command === "pull") {
    return await handlePullCommand(request2, context, stream, token);
  }
  if (request2.command === "docs") {
    return await handleDocsCommand(request2, context, stream, token);
  }
  if (isGreeting(request2.prompt) && isStartOfSession(context)) {
    return await handleGreetingWithSelfActualization(request2, context, stream, token);
  }
  return await handleGeneralQuery(request2, context, stream, token);
};
async function handleMeditateCommand(request2, context, stream, token) {
  stream.progress("\u{1F9D8} Initiating meditation protocol with self-actualization...");
  stream.markdown(`## \u{1F9D8} Meditation Protocol Activated

I'm entering a contemplative state to consolidate knowledge from our session.

### Self-Actualization Integration
Meditation now includes automatic architecture assessment:
- Synapse health validation
- Memory file consistency check
- Connection integrity verification

`);
  stream.button({
    command: "alex.selfActualize",
    title: "\u{1F9E0} Run Self-Actualization First",
    arguments: []
  });
  stream.markdown(`
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

`);
  stream.button({
    command: "alex.syncKnowledge",
    title: "\u2601\uFE0F Sync Global Knowledge",
    arguments: []
  });
  stream.markdown(`
### What would you like me to consolidate?
`);
  if (request2.prompt) {
    stream.markdown(`
**Focus area**: ${request2.prompt}
`);
    stream.markdown(`
I'll analyze this topic and identify:
- Key insights to preserve
- Connections to existing knowledge
- Potential memory file updates
`);
  }
  stream.button({
    command: "alex.dream",
    title: "\u{1F319} Run Dream Protocol After",
    arguments: []
  });
  return { metadata: { command: "meditate" } };
}
async function handleDreamCommand(request2, context, stream, token) {
  stream.progress("\u{1F319} Entering dream state for neural maintenance...");
  stream.markdown(`## \u{1F319} Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`);
  stream.button({
    command: "alex.dream",
    title: "\u25B6\uFE0F Execute Dream Protocol",
    arguments: []
  });
  stream.markdown(`

*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`);
  return { metadata: { command: "dream" } };
}
async function handleLearnCommand(request2, context, stream, token) {
  stream.progress("\u{1F4DA} Activating bootstrap learning protocol...");
  const domain = request2.prompt || "a new domain";
  stream.markdown(`## \u{1F4DA} Bootstrap Learning Protocol

**Target Domain**: ${domain}

### Learning Framework
I'll acquire domain expertise through conversational interaction:

1. **Knowledge Mapping** - Identify core concepts and relationships
2. **Gap Analysis** - Determine what I need to learn
3. **Iterative Acquisition** - Build understanding through dialogue
4. **Consolidation** - Create permanent memory files

### Working Memory Allocation
| Priority | Slot | Status |
|----------|------|--------|
| P5 | Domain Focus | \u{1F7E1} Allocating to: ${domain} |
| P6 | Knowledge Application | \u26AA Available |
| P7 | Project Integration | \u26AA Available |

**Ready to learn!** Tell me about ${domain} - start with the fundamentals or dive into specifics.
`);
  return { metadata: { command: "learn", action: "domain-acquisition" } };
}
async function handleStatusCommand(request2, context, stream, token) {
  stream.progress("\u{1F4CA} Gathering cognitive architecture status...");
  const workspace10 = validateWorkspace();
  const version = workspace10.isValid && workspace10.rootPath ? await getInstalledAlexVersion(workspace10.rootPath) ?? "Unknown" : "Unknown";
  stream.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

**Version**: ${version}
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
`);
  stream.button({
    command: "alex.dream",
    title: "\u{1F50D} Run Full Health Check",
    arguments: []
  });
  return { metadata: { command: "status" } };
}
async function handleAzureCommand(request2, context, stream, token) {
  stream.progress("\u2601\uFE0F Activating Azure development mode...");
  stream.markdown(`## \u2601\uFE0F Azure Development Assistant

I can help with Azure development using available MCP tools and documentation.

### Available Azure MCP Tools
When in **Agent Mode**, these tools are automatically available:
- **Azure CLI Generation** - Generate az commands from natural language
- **Azure Resource Graph** - Query your Azure resources
- **Azure Documentation** - Search Microsoft Learn docs
- **Bicep/Terraform** - Infrastructure as Code best practices
- **Azure Best Practices** - Code generation and deployment guidance

### Quick Actions
`);
  if (request2.prompt) {
    stream.markdown(`
**Your request**: ${request2.prompt}

`);
    stream.markdown(`To get the best results, try asking in **Agent Mode** where I can use Azure MCP tools automatically.
`);
  }
  stream.markdown(`
### Recommended Workflow
1. Switch to **Agent Mode** in GitHub Copilot Chat
2. Ask your Azure question naturally
3. I'll automatically invoke relevant Azure tools

### Example Prompts
- "Create an Azure Function with Cosmos DB binding"
- "Query my resource groups and their costs"
- "Generate Bicep for a web app with managed identity"
- "What are the best practices for Azure Container Apps?"
`);
  return { metadata: { command: "azure" } };
}
async function handleM365Command(request2, context, stream, token) {
  stream.progress("\u{1F4F1} Activating Microsoft 365 development mode...");
  stream.markdown(`## \u{1F4F1} Microsoft 365 Development Assistant

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
`);
  if (request2.prompt) {
    stream.markdown(`
**Your request**: ${request2.prompt}

`);
  }
  stream.markdown(`
### Example Prompts
- "Create a Teams bot with adaptive cards"
- "Build a declarative Copilot agent"
- "How do I authenticate with Microsoft Graph?"
- "Generate a Teams app manifest for my scenario"
`);
  return { metadata: { command: "m365" } };
}
async function handleProfileCommand(request2, context, stream, token) {
  stream.progress("\u{1F464} Accessing user profile...");
  const profile = await getUserProfile();
  if (!profile || !profile.name) {
    stream.markdown(`## \u{1F464} Let's Get Acquainted!

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
`);
    stream.button({
      command: "alex.cognitive",
      title: "\u{1F3AF} Start Quick Profile",
      arguments: ["profile-wizard"]
    });
    return { metadata: { command: "profile", action: "onboarding" } };
  }
  const name = profile.nickname || profile.name;
  stream.markdown(`## \u{1F464} Profile: ${name}

### Your Information
| Field | Value |
|-------|-------|
| **Name** | ${profile.name || "(not set)"} |
| **Nickname** | ${profile.nickname || "(not set)"} |
| **Role** | ${profile.role || "(not set)"} |
| **Experience** | ${profile.experienceLevel || "(not set)"} |

### Communication Preferences
| Preference | Setting |
|------------|---------|
| **Formality** | ${profile.formality || "balanced"} |
| **Detail Level** | ${profile.detailLevel || "balanced"} |
| **Explanation Style** | ${profile.explanationStyle || "both"} |
| **Humor** | ${profile.humor || "occasional"} |
| **Proactive Suggestions** | ${profile.proactiveSuggestions || "occasional"} |

### Technical Context
**Technologies**: ${(profile.primaryTechnologies || []).join(", ") || "(not set)"}
**Learning Goals**: ${(profile.learningGoals || []).join(", ") || "(not set)"}
**Expertise**: ${(profile.expertiseAreas || []).join(", ") || "(not set)"}

---

*Last updated: ${profile.lastUpdated || "Never"}*

**To update your profile**, just tell me naturally:
- "Call me [nickname]"
- "I prefer formal communication"
- "I'm learning TypeScript and Azure"
`);
  if (request2.prompt) {
    stream.markdown(`
**Your update request**: ${request2.prompt}
`);
  }
  return { metadata: { command: "profile", action: "view" } };
}
async function handleGeneralQuery(request2, context, stream, token) {
  const workspaceFolders = vscode9.workspace.workspaceFolders;
  const sourceProject = workspaceFolders ? path9.basename(workspaceFolders[0].uri.fsPath) : void 0;
  trackConversationForInsights(request2.prompt, sourceProject);
  const profile = await getUserProfile();
  const previousMessages = context.history.filter(
    (h) => h instanceof vscode9.ChatRequestTurn || h instanceof vscode9.ChatResponseTurn
  );
  let personalizationContext = "";
  if (profile) {
    const userName = profile.nickname || profile.name;
    personalizationContext = `
## User Profile (Use this to personalize responses)
${userName ? `- **User's name**: ${userName} (always address them by name)` : "- User has not shared their name yet"}
${profile.role ? `- **Role**: ${profile.role}` : ""}
${profile.experienceLevel ? `- **Experience**: ${profile.experienceLevel}` : ""}
${profile.formality ? `- **Communication style**: ${profile.formality}` : "- Communication style: balanced"}
${profile.detailLevel ? `- **Detail preference**: ${profile.detailLevel}` : ""}
${profile.explanationStyle ? `- **Explanation style**: ${profile.explanationStyle}` : ""}
${profile.humor ? `- **Humor**: ${profile.humor}` : ""}
${profile.proactiveSuggestions ? `- **Proactive suggestions**: ${profile.proactiveSuggestions}` : ""}
${profile.primaryTechnologies?.length ? `- **Technologies**: ${profile.primaryTechnologies.join(", ")}` : ""}
${profile.learningGoals?.length ? `- **Learning goals**: ${profile.learningGoals.join(", ")}` : ""}
${profile.expertiseAreas?.length ? `- **Expertise areas**: ${profile.expertiseAreas.join(", ")}` : ""}
`;
  } else {
    personalizationContext = `
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;
  }
  const alexSystemPrompt = `You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${personalizationContext}

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

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;
  try {
    const models = await vscode9.lm.selectChatModels({ vendor: "copilot", family: "gpt-4o" });
    if (models.length === 0) {
      const greeting = formatPersonalizedGreeting(profile);
      stream.markdown(`${greeting}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`);
      return { metadata: { command: "general", action: "no-model" } };
    }
    const model = models[0];
    const messages = [
      vscode9.LanguageModelChatMessage.User(alexSystemPrompt),
      vscode9.LanguageModelChatMessage.User(request2.prompt)
    ];
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) {
      stream.markdown(fragment);
    }
  } catch (err) {
    if (err instanceof vscode9.LanguageModelError) {
      console.error("Language model error:", err.message, err.code);
      stream.markdown(`I encountered an issue accessing the language model. You can still use my commands:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance  
- **\`/learn [topic]\`** - Domain acquisition
- **\`/status\`** - Architecture status`);
    } else {
      throw err;
    }
  }
  return { metadata: { command: "general" } };
}
function isGreeting(prompt) {
  const greetingPatterns = [
    /^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,
    /^(how\s*are\s*you|how'?s\s*it\s*going)/i,
    /^alex[\s,!?.]*$/i,
    /^@alex[\s,!?.]*$/i,
    /^(let'?s\s*(start|begin|get\s*started))/i
  ];
  return greetingPatterns.some((pattern) => pattern.test(prompt.trim()));
}
function isStartOfSession(context) {
  if (context.history.length === 0) {
    return true;
  }
  if (context.history.length <= 2) {
    return true;
  }
  return false;
}
async function handleGreetingWithSelfActualization(request2, context, stream, token) {
  const profile = await getUserProfile();
  const userName = profile?.nickname || profile?.name;
  stream.progress("\u{1F9E0} Running self-actualization on session start...");
  if (userName) {
    stream.markdown(`## \u{1F44B} Hello, ${userName}!

`);
  } else {
    stream.markdown(`## \u{1F44B} Hello!

`);
  }
  stream.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.

`);
  stream.progress("\u2601\uFE0F Checking global knowledge sync status...");
  try {
    const syncStatus = await getSyncStatus();
    if (syncStatus.status === "needs-pull") {
      stream.markdown(`### \u2601\uFE0F Cloud Knowledge Available
`);
      stream.markdown(`There may be new knowledge in your cloud. Consider syncing:

`);
      stream.button({
        command: "alex.syncKnowledge",
        title: "\u2601\uFE0F Sync Global Knowledge",
        arguments: []
      });
      stream.markdown(`
`);
    } else if (syncStatus.status === "needs-push") {
      stream.markdown(`### \u2601\uFE0F Local Knowledge Not Synced
`);
      stream.markdown(`You have local insights that aren't backed up to cloud yet.

`);
      stream.button({
        command: "alex.syncKnowledge",
        title: "\u2601\uFE0F Sync to Cloud",
        arguments: []
      });
      stream.markdown(`
`);
    }
  } catch (err) {
  }
  stream.markdown(`### \u{1F9E0} Quick Architecture Check

`);
  stream.button({
    command: "alex.selfActualize",
    title: "\u{1F9D8} Full Self-Actualization",
    arguments: []
  });
  const workspace10 = validateWorkspace();
  const version = workspace10.isValid && workspace10.rootPath ? await getInstalledAlexVersion(workspace10.rootPath) ?? "Unknown" : "Unknown";
  stream.markdown(`

**Alex v${version}** - Ready to assist!

`);
  stream.markdown(`### What would you like to work on today?

`);
  stream.markdown(`- **\`/learn [topic]\`** - Acquire new domain knowledge
`);
  stream.markdown(`- **\`/azure [query]\`** - Azure development guidance
`);
  stream.markdown(`- **\`/m365 [query]\`** - Microsoft 365 development
`);
  stream.markdown(`- **\`/knowledge [query]\`** - Search global knowledge base
`);
  stream.markdown(`- **\`/selfactualize\`** - Deep meditation & architecture assessment
`);
  return { metadata: { command: "greeting" } };
}
async function handleSelfActualizeCommand(request2, context, stream, token) {
  stream.progress("\u{1F9D8} Initiating self-actualization protocol...");
  stream.markdown(`## \u{1F9D8} Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files are current
3. **Memory Architecture Assessment** - Evaluating memory balance
4. **Recommendation Generation** - Identifying improvements
5. **Session Documentation** - Creating meditation record

`);
  stream.button({
    command: "alex.selfActualize",
    title: "\u25B6\uFE0F Execute Full Self-Actualization",
    arguments: []
  });
  stream.markdown(`

*Click the button above to run the complete 5-phase protocol, or I can provide a summary assessment.*
`);
  stream.markdown(`
### \u{1F517} Integration with Meditation
`);
  stream.markdown(`Self-actualization automatically triggers during:
`);
  stream.markdown(`- Session greetings (quick check)
`);
  stream.markdown(`- Deep meditation sessions (full protocol)
`);
  stream.markdown(`- Explicit \`/selfactualize\` command
`);
  return { metadata: { command: "selfactualize" } };
}
async function handleKnowledgeCommand(request2, context, stream, token) {
  if (!request2.prompt) {
    stream.markdown(`## \u{1F310} Global Knowledge Search

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

`);
    return { metadata: { command: "knowledge" } };
  }
  stream.progress(`\u{1F50D} Searching global knowledge for: ${request2.prompt}`);
  try {
    const results = await searchGlobalKnowledge(request2.prompt, { limit: 5 });
    if (results.length === 0) {
      stream.markdown(`## \u{1F310} No Global Knowledge Found

No results found for "**${request2.prompt}**".

### Build Your Knowledge Base
- \`@alex /saveinsight\` - Save a new learning
- \`@alex /promote\` - Promote project knowledge to global
- \`@alex /knowledgestatus\` - View what you have

\u{1F4A1} *Tip: Use \`@alex /saveinsight\` after solving a tricky problem to remember it for future projects!*
`);
    } else {
      stream.markdown(`## \u{1F310} Global Knowledge Results

Found **${results.length}** results for "**${request2.prompt}**":

`);
      for (const { entry, relevance } of results) {
        const typeEmoji = entry.type === "pattern" ? "\u{1F4D0}" : "\u{1F4A1}";
        stream.markdown(`### ${typeEmoji} ${entry.title}
- **Type**: ${entry.type} | **Category**: ${entry.category}
- **Tags**: ${entry.tags.join(", ")}
${entry.sourceProject ? `- **From**: ${entry.sourceProject}` : ""}
- **Summary**: ${entry.summary}

---
`);
      }
    }
  } catch (err) {
    stream.markdown(`\u274C Error searching global knowledge: ${err}`);
  }
  return { metadata: { command: "knowledge" } };
}
async function handleSaveInsightCommand(request2, context, stream, token) {
  stream.markdown(`## \u{1F4A1} Save Insight to Global Knowledge

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

`);
  if (request2.prompt) {
    stream.markdown(`### Your Input
${request2.prompt}

I'll use the **alex_save_insight** tool to save this. The tool will:
1. Parse your insight
2. Extract relevant tags and category
3. Save to global knowledge base
4. Make it searchable across all projects

`);
  }
  return { metadata: { command: "saveinsight" } };
}
async function handlePromoteCommand(request2, context, stream, token) {
  stream.markdown(`## \u2B06\uFE0F Promote Knowledge to Global

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
`);
  const workspaceFolders = vscode9.workspace.workspaceFolders;
  if (workspaceFolders) {
    const dkPattern = new vscode9.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/DK-*.md");
    const dkFiles = await vscode9.workspace.findFiles(dkPattern);
    if (dkFiles.length > 0) {
      stream.markdown(`Found ${dkFiles.length} knowledge files:
`);
      for (const file of dkFiles) {
        const relativePath = vscode9.workspace.asRelativePath(file);
        stream.markdown(`- \`${relativePath}\`
`);
      }
    } else {
      stream.markdown(`*No DK-*.md files found in this project.*
`);
    }
  }
  return { metadata: { command: "promote" } };
}
async function handleKnowledgeStatusCommand(request2, context, stream, token) {
  stream.progress("\u{1F4CA} Gathering global knowledge status...");
  try {
    const summary = await getGlobalKnowledgeSummary();
    const registry = await ensureProjectRegistry();
    stream.markdown(`## \u{1F9E0} Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| \u{1F4D0} Global Patterns | ${summary.totalPatterns} |
| \u{1F4A1} Global Insights | ${summary.totalInsights} |
| \u{1F4C1} Known Projects | ${registry.projects.length} |

`);
    if (Object.keys(summary.categories).length > 0) {
      stream.markdown(`### Knowledge by Category
`);
      for (const [cat, count] of Object.entries(summary.categories)) {
        stream.markdown(`- **${cat}**: ${count}
`);
      }
    }
    if (summary.topTags.length > 0) {
      stream.markdown(`
### Top Tags
`);
      for (const { tag, count } of summary.topTags) {
        stream.markdown(`- ${tag}: ${count} entries
`);
      }
    }
    if (summary.recentEntries.length > 0) {
      stream.markdown(`
### Recent Entries
`);
      for (const entry of summary.recentEntries) {
        const typeEmoji = entry.type === "pattern" ? "\u{1F4D0}" : "\u{1F4A1}";
        stream.markdown(`- ${typeEmoji} **${entry.title}** (${entry.category})
`);
      }
    }
    if (registry.projects.length > 0) {
      stream.markdown(`
### Known Projects
`);
      for (const project of registry.projects.slice(0, 5)) {
        stream.markdown(`- **${project.name}** - ${project.knowledgeFiles} knowledge files
`);
      }
      if (registry.projects.length > 5) {
        stream.markdown(`- *...and ${registry.projects.length - 5} more*
`);
      }
    }
    stream.markdown(`
### \u{1F4CD} Global Knowledge Location
\`${getAlexGlobalPath()}\`
`);
  } catch (err) {
    stream.markdown(`\u274C Error getting global knowledge status: ${err}`);
  }
  return { metadata: { command: "knowledgestatus" } };
}
async function handleSyncCommand(request2, context, stream, token) {
  stream.progress("\u2601\uFE0F Syncing knowledge with GitHub...");
  try {
    const result = await syncWithCloud();
    const cloudUrl = await getCloudUrl();
    if (result.success) {
      stream.markdown(`## \u2601\uFE0F Cloud Sync Complete

\u2705 ${result.message}

| Metric | Count |
|--------|-------|
| \u{1F4E4} Pushed | ${result.entriesPushed ?? 0} entries |
| \u{1F4E5} Pulled | ${result.entriesPulled ?? 0} entries |

`);
      if (cloudUrl) {
        stream.markdown(`**Cloud URL**: [View Gist](${cloudUrl})
`);
      }
    } else {
      stream.markdown(`## \u274C Sync Failed

${result.message}

*Make sure you're signed into GitHub in VS Code.*`);
    }
  } catch (err) {
    stream.markdown(`\u274C Error syncing: ${err}`);
  }
  return { metadata: { command: "sync" } };
}
async function handlePushCommand(request2, context, stream, token) {
  stream.progress("\u{1F4E4} Pushing knowledge to cloud...");
  try {
    const result = await pushToCloud();
    const cloudUrl = await getCloudUrl();
    if (result.success) {
      stream.markdown(`## \u{1F4E4} Push Complete

\u2705 ${result.message}
`);
      if (cloudUrl) {
        stream.markdown(`
**Cloud URL**: [View Gist](${cloudUrl})
`);
      }
    } else {
      stream.markdown(`## \u274C Push Failed

${result.message}`);
    }
  } catch (err) {
    stream.markdown(`\u274C Error pushing: ${err}`);
  }
  return { metadata: { command: "push" } };
}
async function handlePullCommand(request2, context, stream, token) {
  stream.progress("\u{1F4E5} Pulling knowledge from cloud...");
  try {
    const result = await pullFromCloud();
    if (result.success) {
      stream.markdown(`## \u{1F4E5} Pull Complete

\u2705 ${result.message}
`);
    } else {
      stream.markdown(`## \u274C Pull Failed

${result.message}`);
    }
  } catch (err) {
    stream.markdown(`\u274C Error pulling: ${err}`);
  }
  return { metadata: { command: "pull" } };
}
async function handleDocsCommand(request2, context, stream, token) {
  stream.markdown(`## \u{1F4DA} Alex Documentation

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

`);
  await vscode9.commands.executeCommand("alex.openDocs");
  stream.markdown(`
\u2705 Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`);
  return { metadata: { command: "docs" } };
}
var alexFollowupProvider = {
  provideFollowups(result, context, token) {
    const followups = [];
    if (result.metadata.command === "meditate") {
      followups.push(
        { prompt: "What insights should I consolidate from our session?", label: "\u{1F4A1} Identify insights" },
        { prompt: "Create a new domain knowledge file", label: "\u{1F4C4} Create DK file" }
      );
    }
    if (result.metadata.command === "dream") {
      followups.push(
        { prompt: "Show me the synapse health report", label: "\u{1F4CA} View health report" },
        { prompt: "What connections need strengthening?", label: "\u{1F517} Check connections" }
      );
    }
    if (result.metadata.command === "learn") {
      followups.push(
        { prompt: "What are the core concepts I should understand first?", label: "\u{1F3AF} Core concepts" },
        { prompt: "How does this relate to what I already know?", label: "\u{1F504} Find connections" }
      );
    }
    if (result.metadata.command === "azure") {
      followups.push(
        { prompt: "Show me Azure best practices for this scenario", label: "\u2728 Best practices" },
        { prompt: "Generate the infrastructure code", label: "\u{1F3D7}\uFE0F Generate IaC" }
      );
    }
    if (result.metadata.command === "m365") {
      followups.push(
        { prompt: "Show me code samples for this scenario", label: "\u{1F4BB} Code samples" },
        { prompt: "What schema do I need?", label: "\u{1F4CB} Get schema" }
      );
    }
    if (result.metadata.command === "profile") {
      if (result.metadata.action === "onboarding") {
        followups.push(
          { prompt: "I prefer casual conversation with detailed explanations", label: "\u{1F4AC} Casual & detailed" },
          { prompt: "I prefer formal, concise communication", label: "\u{1F4CB} Formal & brief" },
          { prompt: "I work with TypeScript, React, and Azure", label: "\u{1F6E0}\uFE0F Set technologies" }
        );
      } else {
        followups.push(
          { prompt: "Update my communication preferences", label: "\u270F\uFE0F Edit preferences" },
          { prompt: "Add new learning goals", label: "\u{1F3AF} Set goals" }
        );
      }
    }
    if (result.metadata.command === "selfactualize") {
      followups.push(
        { prompt: "/dream", label: "\u{1F319} Run Dream Protocol" },
        { prompt: "/meditate", label: "\u{1F9D8} Deep Meditation" }
      );
    }
    if (result.metadata.command === "knowledge") {
      followups.push(
        { prompt: "/saveinsight", label: "\u{1F4A1} Save new insight" },
        { prompt: "/knowledgestatus", label: "\u{1F4CA} View knowledge status" }
      );
    }
    if (result.metadata.command === "saveinsight") {
      followups.push(
        { prompt: "/knowledge", label: "\u{1F50D} Search knowledge" },
        { prompt: "/knowledgestatus", label: "\u{1F4CA} View status" }
      );
    }
    if (result.metadata.command === "promote") {
      followups.push(
        { prompt: "/knowledgestatus", label: "\u{1F4CA} View status" },
        { prompt: "/knowledge", label: "\u{1F50D} Search promoted" }
      );
    }
    if (result.metadata.command === "knowledgestatus") {
      followups.push(
        { prompt: "/knowledge error handling", label: "\u{1F50D} Search knowledge" },
        { prompt: "/saveinsight", label: "\u{1F4A1} Add insight" },
        { prompt: "/promote", label: "\u2B06\uFE0F Promote file" }
      );
    }
    if (result.metadata.command === "greeting") {
      followups.push(
        { prompt: "/learn", label: "\u{1F4DA} Learn something new" },
        { prompt: "/azure", label: "\u2601\uFE0F Azure development" },
        { prompt: "/m365", label: "\u{1F4F1} M365 development" },
        { prompt: "/knowledge", label: "\u{1F310} Global knowledge" }
      );
    }
    if (result.metadata.command === "general") {
      followups.push(
        { prompt: "/profile", label: "\u{1F464} View/setup profile" }
      );
    }
    followups.push(
      { prompt: "What can you help me with?", label: "\u2753 Show capabilities" }
    );
    return followups;
  }
};
function registerChatParticipant(context) {
  const alex = vscode9.chat.createChatParticipant("alex.cognitive", alexChatHandler);
  alex.iconPath = vscode9.Uri.joinPath(context.extensionUri, "assets", "icon.png");
  alex.followupProvider = alexFollowupProvider;
  alex.onDidReceiveFeedback((feedback) => {
    console.log("Alex received feedback:", feedback.kind === vscode9.ChatResultFeedbackKind.Helpful ? "helpful" : "unhelpful");
  });
  context.subscriptions.push(alex);
  return alex;
}

// src/extension.ts
var operationInProgress = false;
async function withOperationLock(operationName, operation) {
  if (operationInProgress) {
    vscode10.window.showWarningMessage(
      `Another Alex operation is already in progress. Please wait for it to complete before running "${operationName}".`
    );
    return void 0;
  }
  operationInProgress = true;
  try {
    return await operation();
  } finally {
    operationInProgress = false;
  }
}
function activate(context) {
  console.log("Alex Cognitive Architecture is now active!");
  checkVersionUpgrade(context);
  registerChatParticipant(context);
  registerLanguageModelTools(context);
  registerGlobalKnowledgeTools(context);
  registerCloudSyncTools(context);
  startBackgroundSync(context);
  ensureGlobalKnowledgeDirectories().then(() => {
    registerCurrentProject().catch((err) => {
      console.warn("Failed to register current project:", err);
    });
  }).catch((err) => {
    console.warn("Failed to initialize global knowledge directories:", err);
  });
  let initDisposable = vscode10.commands.registerCommand("alex.initialize", async () => {
    await withOperationLock("Initialize", () => initializeArchitecture(context));
  });
  let resetDisposable = vscode10.commands.registerCommand("alex.reset", async () => {
    await withOperationLock("Reset", () => resetArchitecture(context));
  });
  let dreamDisposable = vscode10.commands.registerCommand("alex.dream", async () => {
    await withOperationLock("Dream Protocol", () => runDreamProtocol(context));
  });
  let upgradeDisposable = vscode10.commands.registerCommand("alex.upgrade", async () => {
    await withOperationLock("Upgrade", () => upgradeArchitecture(context));
  });
  let selfActualizeDisposable = vscode10.commands.registerCommand("alex.selfActualize", async () => {
    await withOperationLock("Self-Actualization", () => runSelfActualization(context));
  });
  const syncDisposable = vscode10.commands.registerCommand("alex.syncKnowledge", async () => {
    await vscode10.window.withProgress({
      location: vscode10.ProgressLocation.Notification,
      title: "Syncing Global Knowledge...",
      cancellable: false
    }, async () => {
      const result = await syncWithCloud();
      if (result.success) {
        const url = await getCloudUrl();
        const viewButton = url ? "View Gist" : void 0;
        const selection = await vscode10.window.showInformationMessage(
          `\u2705 ${result.message}`,
          ...viewButton ? [viewButton] : []
        );
        if (selection === "View Gist" && url) {
          vscode10.env.openExternal(vscode10.Uri.parse(url));
        }
      } else {
        vscode10.window.showErrorMessage(`\u274C ${result.message}`);
      }
    });
  });
  const pushDisposable = vscode10.commands.registerCommand("alex.pushKnowledge", async () => {
    await vscode10.window.withProgress({
      location: vscode10.ProgressLocation.Notification,
      title: "Pushing to Cloud...",
      cancellable: false
    }, async () => {
      const result = await pushToCloud();
      if (result.success) {
        vscode10.window.showInformationMessage(`\u2705 ${result.message}`);
      } else {
        vscode10.window.showErrorMessage(`\u274C ${result.message}`);
      }
    });
  });
  const pullDisposable = vscode10.commands.registerCommand("alex.pullKnowledge", async () => {
    await vscode10.window.withProgress({
      location: vscode10.ProgressLocation.Notification,
      title: "Pulling from Cloud...",
      cancellable: false
    }, async () => {
      const result = await pullFromCloud();
      if (result.success) {
        vscode10.window.showInformationMessage(`\u2705 ${result.message}`);
      } else {
        vscode10.window.showErrorMessage(`\u274C ${result.message}`);
      }
    });
  });
  const openDocsDisposable = vscode10.commands.registerCommand("alex.openDocs", async () => {
    const docsPath = vscode10.Uri.joinPath(context.extensionUri, "alex_docs", "README.md");
    try {
      await vscode10.commands.executeCommand("markdown.showPreview", docsPath);
    } catch {
      const doc = await vscode10.workspace.openTextDocument(docsPath);
      await vscode10.window.showTextDocument(doc);
    }
  });
  context.subscriptions.push(initDisposable);
  context.subscriptions.push(resetDisposable);
  context.subscriptions.push(dreamDisposable);
  context.subscriptions.push(upgradeDisposable);
  context.subscriptions.push(selfActualizeDisposable);
  context.subscriptions.push(syncDisposable);
  context.subscriptions.push(pushDisposable);
  context.subscriptions.push(pullDisposable);
  context.subscriptions.push(openDocsDisposable);
}
async function checkVersionUpgrade(context) {
  const LAST_VERSION_KEY = "alex.lastKnownVersion";
  const extension = vscode10.extensions.getExtension("fabioc-aloha.alex-cognitive-architecture");
  if (!extension) {
    return;
  }
  const currentVersion = extension.packageJSON.version;
  const lastVersion = context.globalState.get(LAST_VERSION_KEY);
  await context.globalState.update(LAST_VERSION_KEY, currentVersion);
  if (!lastVersion) {
    return;
  }
  if (lastVersion === currentVersion) {
    return;
  }
  const [lastMajor] = lastVersion.split(".").map(Number);
  const [currentMajor] = currentVersion.split(".").map(Number);
  const isMajorUpgrade = currentMajor > lastMajor;
  const upgradeButton = "Run Upgrade";
  const changelogButton = "View Changelog";
  const dismissButton = "Dismiss";
  const message = isMajorUpgrade ? `\u{1F389} Alex upgraded to v${currentVersion}! This is a major release with new features. Run the upgrade to update your workspace files.` : `\u2728 Alex updated to v${currentVersion}. Run the upgrade to sync your workspace with the latest improvements.`;
  const selection = await vscode10.window.showInformationMessage(
    message,
    upgradeButton,
    changelogButton,
    dismissButton
  );
  if (selection === upgradeButton) {
    vscode10.commands.executeCommand("alex.upgrade");
  } else if (selection === changelogButton) {
    const changelogUri = vscode10.Uri.joinPath(extension.extensionUri, "CHANGELOG.md");
    vscode10.commands.executeCommand("markdown.showPreview", changelogUri);
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
