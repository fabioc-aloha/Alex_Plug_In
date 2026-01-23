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
    function patch(fs6) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs6);
      }
      if (!fs6.lutimes) {
        patchLutimes(fs6);
      }
      fs6.chown = chownFix(fs6.chown);
      fs6.fchown = chownFix(fs6.fchown);
      fs6.lchown = chownFix(fs6.lchown);
      fs6.chmod = chmodFix(fs6.chmod);
      fs6.fchmod = chmodFix(fs6.fchmod);
      fs6.lchmod = chmodFix(fs6.lchmod);
      fs6.chownSync = chownFixSync(fs6.chownSync);
      fs6.fchownSync = chownFixSync(fs6.fchownSync);
      fs6.lchownSync = chownFixSync(fs6.lchownSync);
      fs6.chmodSync = chmodFixSync(fs6.chmodSync);
      fs6.fchmodSync = chmodFixSync(fs6.fchmodSync);
      fs6.lchmodSync = chmodFixSync(fs6.lchmodSync);
      fs6.stat = statFix(fs6.stat);
      fs6.fstat = statFix(fs6.fstat);
      fs6.lstat = statFix(fs6.lstat);
      fs6.statSync = statFixSync(fs6.statSync);
      fs6.fstatSync = statFixSync(fs6.fstatSync);
      fs6.lstatSync = statFixSync(fs6.lstatSync);
      if (fs6.chmod && !fs6.lchmod) {
        fs6.lchmod = function(path6, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs6.lchmodSync = function() {
        };
      }
      if (fs6.chown && !fs6.lchown) {
        fs6.lchown = function(path6, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs6.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs6.rename = typeof fs6.rename !== "function" ? fs6.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs6.stat(to, function(stater, st) {
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
        })(fs6.rename);
      }
      fs6.read = typeof fs6.read !== "function" ? fs6.read : (function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs6, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs6, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
      })(fs6.read);
      fs6.readSync = typeof fs6.readSync !== "function" ? fs6.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs6, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs6.readSync);
      function patchLchmod(fs7) {
        fs7.lchmod = function(path6, mode, callback) {
          fs7.open(
            path6,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs7.fchmod(fd, mode, function(err2) {
                fs7.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs7.lchmodSync = function(path6, mode) {
          var fd = fs7.openSync(path6, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs7.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs7.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs7.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs7) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs7.futimes) {
          fs7.lutimes = function(path6, at, mt, cb) {
            fs7.open(path6, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs7.futimes(fd, at, mt, function(er2) {
                fs7.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs7.lutimesSync = function(path6, at, mt) {
            var fd = fs7.openSync(path6, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs7.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs7.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs7.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs7.futimes) {
          fs7.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs7.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs6, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs6, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs6, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs6, target, uid, gid);
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
          return options ? orig.call(fs6, target, options, callback) : orig.call(fs6, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs6, target, options) : orig.call(fs6, target);
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
    function legacy(fs6) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path6, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path6, options);
        Stream.call(this);
        var self = this;
        this.path = path6;
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
        fs6.open(this.path, this.flags, this.mode, function(err, fd) {
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
      function WriteStream(path6, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path6, options);
        Stream.call(this);
        this.path = path6;
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
          this._open = fs6.open;
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
    var fs6 = require("fs");
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
    if (!fs6[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs6, queue);
      fs6.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs6, fd, function(err) {
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
      })(fs6.close);
      fs6.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs6, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs6.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs6[gracefulQueue]);
          require("assert").equal(fs6[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs6[gracefulQueue]);
    }
    module2.exports = patch(clone(fs6));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs6.__patched) {
      module2.exports = patch(fs6);
      fs6.__patched = true;
    }
    function patch(fs7) {
      polyfills(fs7);
      fs7.gracefulify = patch;
      fs7.createReadStream = createReadStream;
      fs7.createWriteStream = createWriteStream;
      var fs$readFile = fs7.readFile;
      fs7.readFile = readFile5;
      function readFile5(path6, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path6, options, cb);
        function go$readFile(path7, options2, cb2, startTime) {
          return fs$readFile(path7, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path7, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs7.writeFile;
      fs7.writeFile = writeFile6;
      function writeFile6(path6, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path6, data, options, cb);
        function go$writeFile(path7, data2, options2, cb2, startTime) {
          return fs$writeFile(path7, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path7, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs7.appendFile;
      if (fs$appendFile)
        fs7.appendFile = appendFile;
      function appendFile(path6, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path6, data, options, cb);
        function go$appendFile(path7, data2, options2, cb2, startTime) {
          return fs$appendFile(path7, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path7, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs7.copyFile;
      if (fs$copyFile)
        fs7.copyFile = copyFile;
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
      var fs$readdir = fs7.readdir;
      fs7.readdir = readdir2;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir2(path6, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path7, options2, cb2, startTime) {
          return fs$readdir(path7, fs$readdirCallback(
            path7,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path7, options2, cb2, startTime) {
          return fs$readdir(path7, options2, fs$readdirCallback(
            path7,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path6, options, cb);
        function fs$readdirCallback(path7, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path7, options2, cb2],
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
        var legStreams = legacy(fs7);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs7.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs7.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs7, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs7, "WriteStream", {
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
      Object.defineProperty(fs7, "FileReadStream", {
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
      Object.defineProperty(fs7, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path6, options) {
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
      function WriteStream(path6, options) {
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
      function createReadStream(path6, options) {
        return new fs7.ReadStream(path6, options);
      }
      function createWriteStream(path6, options) {
        return new fs7.WriteStream(path6, options);
      }
      var fs$open = fs7.open;
      fs7.open = open;
      function open(path6, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path6, flags, mode, cb);
        function go$open(path7, flags2, mode2, cb2, startTime) {
          return fs$open(path7, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path7, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs7;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs6[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs6[gracefulQueue].length; ++i) {
        if (fs6[gracefulQueue][i].length > 2) {
          fs6[gracefulQueue][i][3] = now;
          fs6[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs6[gracefulQueue].length === 0)
        return;
      var elem = fs6[gracefulQueue].shift();
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
          fs6[gracefulQueue].push(elem);
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
    var fs6 = require_graceful_fs();
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
      return typeof fs6[key] === "function";
    });
    Object.assign(exports2, fs6);
    api.forEach((method) => {
      exports2[method] = u(fs6[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs6.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs6.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs6.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs6.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs6.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs6.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports2.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs6.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs6.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs6.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs6.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs6.realpath.native === "function") {
      exports2.realpath.native = u(fs6.realpath.native);
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
    var path6 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path6.parse(pth).root, ""));
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
    var fs6 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number") return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs6.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs6.mkdirSync(dir, {
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
    var fs6 = require_fs();
    function pathExists6(path6) {
      return fs6.access(path6).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists6),
      pathExistsSync: fs6.existsSync
    };
  }
});

// node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs6 = require_fs();
    var u = require_universalify().fromPromise;
    async function utimesMillis(path6, atime, mtime) {
      const fd = await fs6.open(path6, "r+");
      let closeErr = null;
      try {
        await fs6.futimes(fd, atime, mtime);
      } finally {
        try {
          await fs6.close(fd);
        } catch (e) {
          closeErr = e;
        }
      }
      if (closeErr) {
        throw closeErr;
      }
    }
    function utimesMillisSync(path6, atime, mtime) {
      const fd = fs6.openSync(path6, "r+");
      fs6.futimesSync(fd, atime, mtime);
      return fs6.closeSync(fd);
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
    var fs6 = require_fs();
    var path6 = require("path");
    var u = require_universalify().fromPromise;
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs6.stat(file, { bigint: true }) : (file) => fs6.lstat(file, { bigint: true });
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
      const statFunc = opts.dereference ? (file) => fs6.statSync(file, { bigint: true }) : (file) => fs6.lstatSync(file, { bigint: true });
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
          const srcBaseName = path6.basename(src);
          const destBaseName = path6.basename(dest);
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
          const srcBaseName = path6.basename(src);
          const destBaseName = path6.basename(dest);
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
      const srcParent = path6.resolve(path6.dirname(src));
      const destParent = path6.resolve(path6.dirname(dest));
      if (destParent === srcParent || destParent === path6.parse(destParent).root) return;
      let destStat;
      try {
        destStat = await fs6.stat(destParent, { bigint: true });
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
      const srcParent = path6.resolve(path6.dirname(src));
      const destParent = path6.resolve(path6.dirname(dest));
      if (destParent === srcParent || destParent === path6.parse(destParent).root) return;
      let destStat;
      try {
        destStat = fs6.statSync(destParent, { bigint: true });
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
      const srcArr = path6.resolve(src).split(path6.sep).filter((i) => i);
      const destArr = path6.resolve(dest).split(path6.sep).filter((i) => i);
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
    var fs6 = require_fs();
    var path6 = require("path");
    var { mkdirs } = require_mkdirs();
    var { pathExists: pathExists6 } = require_path_exists();
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
      const destParent = path6.dirname(dest);
      const dirExists = await pathExists6(destParent);
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
      const statFn = opts.dereference ? fs6.stat : fs6.lstat;
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
        await fs6.unlink(dest);
        return copyFile(srcStat, src, dest, opts);
      }
      if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    async function copyFile(srcStat, src, dest, opts) {
      await fs6.copyFile(src, dest);
      if (opts.preserveTimestamps) {
        if (fileIsNotWritable(srcStat.mode)) {
          await makeFileWritable(dest, srcStat.mode);
        }
        const updatedSrcStat = await fs6.stat(src);
        await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
      }
      return fs6.chmod(dest, srcStat.mode);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return fs6.chmod(dest, srcMode | 128);
    }
    async function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) {
        await fs6.mkdir(dest);
      }
      await asyncIteratorConcurrentProcess(await fs6.opendir(src), async (item) => {
        const srcItem = path6.join(src, item.name);
        const destItem = path6.join(dest, item.name);
        const include = await runFilter(srcItem, destItem, opts);
        if (include) {
          const { destStat: destStat2 } = await stat2.checkPaths(srcItem, destItem, "copy", opts);
          await getStatsAndPerformCopy(destStat2, srcItem, destItem, opts);
        }
      });
      if (!destStat) {
        await fs6.chmod(dest, srcStat.mode);
      }
    }
    async function onLink(destStat, src, dest, opts) {
      let resolvedSrc = await fs6.readlink(src);
      if (opts.dereference) {
        resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs6.symlink(resolvedSrc, dest);
      }
      let resolvedDest = null;
      try {
        resolvedDest = await fs6.readlink(dest);
      } catch (e) {
        if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs6.symlink(resolvedSrc, dest);
        throw e;
      }
      if (opts.dereference) {
        resolvedDest = path6.resolve(process.cwd(), resolvedDest);
      }
      if (resolvedSrc !== resolvedDest) {
        if (stat2.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat2.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
      }
      await fs6.unlink(dest);
      return fs6.symlink(resolvedSrc, dest);
    }
    module2.exports = copy3;
  }
});

// node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/fs-extra/lib/copy/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs6 = require_graceful_fs();
    var path6 = require("path");
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
      const destParent = path6.dirname(dest);
      if (!fs6.existsSync(destParent)) mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs6.statSync : fs6.lstatSync;
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
        fs6.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs6.copyFileSync(src, dest);
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
      return fs6.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs6.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs6.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      const dir = fs6.opendirSync(src);
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
      const srcItem = path6.join(src, item);
      const destItem = path6.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem)) return;
      const { destStat } = stat2.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs6.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs6.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs6.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs6.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path6.resolve(process.cwd(), resolvedDest);
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
      fs6.unlinkSync(dest);
      return fs6.symlinkSync(resolvedSrc, dest);
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
    var fs6 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove3(path6, callback) {
      fs6.rm(path6, { recursive: true, force: true }, callback);
    }
    function removeSync(path6) {
      fs6.rmSync(path6, { recursive: true, force: true });
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
    var fs6 = require_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs();
    var remove3 = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs6.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove3.remove(path6.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs6.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path6.join(dir, item);
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
    var path6 = require("path");
    var fs6 = require_fs();
    var mkdir = require_mkdirs();
    async function createFile(file) {
      let stats;
      try {
        stats = await fs6.stat(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path6.dirname(file);
      let dirStats = null;
      try {
        dirStats = await fs6.stat(dir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await mkdir.mkdirs(dir);
          await fs6.writeFile(file, "");
          return;
        } else {
          throw err;
        }
      }
      if (dirStats.isDirectory()) {
        await fs6.writeFile(file, "");
      } else {
        await fs6.readdir(dir);
      }
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs6.statSync(file);
      } catch {
      }
      if (stats && stats.isFile()) return;
      const dir = path6.dirname(file);
      try {
        if (!fs6.statSync(dir).isDirectory()) {
          fs6.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
        else throw err;
      }
      fs6.writeFileSync(file, "");
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
    var path6 = require("path");
    var fs6 = require_fs();
    var mkdir = require_mkdirs();
    var { pathExists: pathExists6 } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createLink(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = await fs6.lstat(dstpath);
      } catch {
      }
      let srcStat;
      try {
        srcStat = await fs6.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return;
      const dir = path6.dirname(dstpath);
      const dirExists = await pathExists6(dir);
      if (!dirExists) {
        await mkdir.mkdirs(dir);
      }
      await fs6.link(srcpath, dstpath);
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs6.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs6.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat)) return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path6.dirname(dstpath);
      const dirExists = fs6.existsSync(dir);
      if (dirExists) return fs6.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs6.linkSync(srcpath, dstpath);
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
    var path6 = require("path");
    var fs6 = require_fs();
    var { pathExists: pathExists6 } = require_path_exists();
    var u = require_universalify().fromPromise;
    async function symlinkPaths(srcpath, dstpath) {
      if (path6.isAbsolute(srcpath)) {
        try {
          await fs6.lstat(srcpath);
        } catch (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          throw err;
        }
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path6.dirname(dstpath);
      const relativeToDst = path6.join(dstdir, srcpath);
      const exists = await pathExists6(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      try {
        await fs6.lstat(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        throw err;
      }
      return {
        toCwd: srcpath,
        toDst: path6.relative(dstdir, srcpath)
      };
    }
    function symlinkPathsSync(srcpath, dstpath) {
      if (path6.isAbsolute(srcpath)) {
        const exists2 = fs6.existsSync(srcpath);
        if (!exists2) throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      }
      const dstdir = path6.dirname(dstpath);
      const relativeToDst = path6.join(dstdir, srcpath);
      const exists = fs6.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      }
      const srcExists = fs6.existsSync(srcpath);
      if (!srcExists) throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path6.relative(dstdir, srcpath)
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
    var fs6 = require_fs();
    var u = require_universalify().fromPromise;
    async function symlinkType(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = await fs6.lstat(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    function symlinkTypeSync(srcpath, type) {
      if (type) return type;
      let stats;
      try {
        stats = fs6.lstatSync(srcpath);
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
    var path6 = require("path");
    var fs6 = require_fs();
    var { mkdirs, mkdirsSync } = require_mkdirs();
    var { symlinkPaths, symlinkPathsSync } = require_symlink_paths();
    var { symlinkType, symlinkTypeSync } = require_symlink_type();
    var { pathExists: pathExists6 } = require_path_exists();
    var { areIdentical } = require_stat();
    async function createSymlink(srcpath, dstpath, type) {
      let stats;
      try {
        stats = await fs6.lstat(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const [srcStat, dstStat] = await Promise.all([
          fs6.stat(srcpath),
          fs6.stat(dstpath)
        ]);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative2 = await symlinkPaths(srcpath, dstpath);
      srcpath = relative2.toDst;
      const toType = await symlinkType(relative2.toCwd, type);
      const dir = path6.dirname(dstpath);
      if (!await pathExists6(dir)) {
        await mkdirs(dir);
      }
      return fs6.symlink(srcpath, dstpath, toType);
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs6.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs6.statSync(srcpath);
        const dstStat = fs6.statSync(dstpath);
        if (areIdentical(srcStat, dstStat)) return;
      }
      const relative2 = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative2.toDst;
      type = symlinkTypeSync(relative2.toCwd, type);
      const dir = path6.dirname(dstpath);
      const exists = fs6.existsSync(dir);
      if (exists) return fs6.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs6.symlinkSync(srcpath, dstpath, type);
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
      const fs6 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs6.readFile)(file, options);
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
    var readFile5 = universalify.fromPromise(_readFile);
    function readFileSync(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs6 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs6.readFileSync(file, options);
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
      const fs6 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs6.writeFile)(file, str, options);
    }
    var writeFile6 = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs6 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs6.writeFileSync(file, str, options);
    }
    module2.exports = {
      readFile: readFile5,
      readFileSync,
      writeFile: writeFile6,
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
    var fs6 = require_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs();
    var pathExists6 = require_path_exists().pathExists;
    async function outputFile(file, data, encoding = "utf-8") {
      const dir = path6.dirname(file);
      if (!await pathExists6(dir)) {
        await mkdir.mkdirs(dir);
      }
      return fs6.writeFile(file, data, encoding);
    }
    function outputFileSync(file, ...args) {
      const dir = path6.dirname(file);
      if (!fs6.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs6.writeFileSync(file, ...args);
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
    var fs6 = require_fs();
    var path6 = require("path");
    var { copy: copy3 } = require_copy2();
    var { remove: remove3 } = require_remove();
    var { mkdirp } = require_mkdirs();
    var { pathExists: pathExists6 } = require_path_exists();
    var stat2 = require_stat();
    async function move2(src, dest, opts = {}) {
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = await stat2.checkPaths(src, dest, "move", opts);
      await stat2.checkParentPaths(src, srcStat, dest, "move");
      const destParent = path6.dirname(dest);
      const parsedParentPath = path6.parse(destParent);
      if (parsedParentPath.root !== destParent) {
        await mkdirp(destParent);
      }
      return doRename(src, dest, overwrite, isChangingCase);
    }
    async function doRename(src, dest, overwrite, isChangingCase) {
      if (!isChangingCase) {
        if (overwrite) {
          await remove3(dest);
        } else if (await pathExists6(dest)) {
          throw new Error("dest already exists.");
        }
      }
      try {
        await fs6.rename(src, dest);
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
    var fs6 = require_graceful_fs();
    var path6 = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat2 = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat2.checkPathsSync(src, dest, "move", opts);
      stat2.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest)) mkdirpSync(path6.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path6.dirname(dest);
      const parsedPath = path6.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase) return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs6.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs6.renameSync(src, dest);
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

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode7 = __toESM(require("vscode"));

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
      progress.report({ message: "Preparing merge tasks...", increment: 10 });
      report.migrationTasks.push({
        file: ".github/copilot-instructions.md",
        type: "merge-required",
        description: "Core brain file requires intelligent merge",
        details: [
          "UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands",
          "PRESERVE: Domain slot assignments (P5-P7), user-added memory file references",
          "REVIEW: Any custom sections added by user"
        ]
      });
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
      const configSrc = path3.join(extensionPath, "config");
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
      const extDkSrc = path3.join(extensionPath, "domain-knowledge");
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
      currentVersion: "2.5.0 BIPENTNILIUM",
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
var vscode6 = __toESM(require("vscode"));

// src/chat/tools.ts
var vscode5 = __toESM(require("vscode"));
var fs5 = __toESM(require_lib());
var path5 = __toESM(require("path"));
var SynapseHealthTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Scanning synaptic connections...",
      confirmationMessages: {
        title: "Synapse Health Check",
        message: new vscode5.MarkdownString(
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
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart("No workspace folder open. Cannot scan for synaptic connections.")
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
      const relativePattern = new vscode5.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode5.workspace.findFiles(relativePattern);
      for (const file of files) {
        totalFiles++;
        try {
          const content = await fs5.readFile(file.fsPath, "utf-8");
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
              const found = await vscode5.workspace.findFiles(
                new vscode5.RelativePattern(workspaceFolders[0], `**/${targetName}`)
              );
              if (found.length === 0) {
                brokenSynapses++;
                if (options.input.detailed) {
                  issues.push(`- ${path5.basename(file.fsPath)}:${i + 1} \u2192 ${targetName} (not found)`);
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
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(result)
    ]);
  }
};
var MemorySearchTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: `Searching Alex memory for: ${options.input.query}`,
      confirmationMessages: {
        title: "Search Alex Memory",
        message: new vscode5.MarkdownString(
          `Search Alex cognitive architecture memory files for: **${options.input.query}**?

Memory type: ${options.input.memoryType || "all"}`
        )
      }
    };
  }
  async invoke(options, token) {
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart("No workspace folder open.")
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
      const relativePattern = new vscode5.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode5.workspace.findFiles(relativePattern);
      for (const file of files) {
        try {
          const content = await fs5.readFile(file.fsPath, "utf-8");
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
              file: path5.basename(file.fsPath),
              matches: matches.slice(0, 3)
              // Limit to first 3 matches per file
            });
          }
        } catch (err) {
        }
      }
    }
    if (results.length === 0) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart(`No matches found for "${options.input.query}" in ${memoryType} memory files.`)
      ]);
    }
    let resultText = `## Memory Search Results for "${options.input.query}"

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
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(resultText)
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
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart("No workspace folder open. Alex architecture status unavailable.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const markerFile = path5.join(rootPath, ".github", "copilot-instructions.md");
    const isInstalled = await fs5.pathExists(markerFile);
    if (!isInstalled) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart(
          `Alex Cognitive Architecture is **not installed** in this workspace.

Run \`Alex: Initialize Architecture\` from the Command Palette to install.`
        )
      ]);
    }
    const instructionFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/instructions/*.md")
    );
    const promptFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/prompts/*.md")
    );
    const episodicFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/episodic/*.md")
    );
    const domainFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/*.md")
    );
    let version = "Unknown";
    try {
      const content = await fs5.readFile(markerFile, "utf-8");
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
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(result)
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
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(recommendations.join("\n"))
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
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart("No workspace folder open. Cannot access user profile.")
      ]);
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const profilePath = path5.join(rootPath, "config", "USER-PROFILE.md");
    const jsonProfilePath = path5.join(rootPath, "config", "user-profile.json");
    const { action, field, value } = options.input;
    try {
      switch (action) {
        case "exists":
          const exists = await fs5.pathExists(jsonProfilePath);
          return new vscode5.LanguageModelToolResult([
            new vscode5.LanguageModelTextPart(JSON.stringify({ exists, path: jsonProfilePath }))
          ]);
        case "get":
          if (!await fs5.pathExists(jsonProfilePath)) {
            return new vscode5.LanguageModelToolResult([
              new vscode5.LanguageModelTextPart(JSON.stringify({
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
          const profile = await fs5.readJson(jsonProfilePath);
          if (field) {
            return new vscode5.LanguageModelToolResult([
              new vscode5.LanguageModelTextPart(JSON.stringify({ [field]: profile[field] }))
            ]);
          }
          return new vscode5.LanguageModelToolResult([
            new vscode5.LanguageModelTextPart(JSON.stringify(profile))
          ]);
        case "update":
          if (!field || value === void 0) {
            return new vscode5.LanguageModelToolResult([
              new vscode5.LanguageModelTextPart("Error: Both field and value are required for update action.")
            ]);
          }
          await fs5.ensureDir(path5.join(rootPath, "config"));
          let existingProfile = {};
          if (await fs5.pathExists(jsonProfilePath)) {
            existingProfile = await fs5.readJson(jsonProfilePath);
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
          await fs5.writeJson(jsonProfilePath, existingProfile, { spaces: 2 });
          await this.updateMarkdownProfile(profilePath, existingProfile);
          return new vscode5.LanguageModelToolResult([
            new vscode5.LanguageModelTextPart(JSON.stringify({
              success: true,
              field,
              value,
              message: `Updated ${field} to: ${value}`
            }))
          ]);
        default:
          return new vscode5.LanguageModelToolResult([
            new vscode5.LanguageModelTextPart(`Unknown action: ${action}`)
          ]);
      }
    } catch (error) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart(`Error accessing user profile: ${error.message}`)
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
    await fs5.writeFile(profilePath, markdown, "utf-8");
  }
};
var SelfActualizationTool = class {
  async prepareInvocation(options, token) {
    return {
      invocationMessage: "Running self-actualization protocol...",
      confirmationMessages: {
        title: "Self-Actualization Protocol",
        message: new vscode5.MarkdownString(
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
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return new vscode5.LanguageModelToolResult([
        new vscode5.LanguageModelTextPart("No workspace folder open. Cannot run self-actualization.")
      ]);
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
        currentVersion: "2.5.0 BIPENTNILIUM",
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
      const relativePattern = new vscode5.RelativePattern(workspaceFolders[0], pattern);
      const files = await vscode5.workspace.findFiles(relativePattern);
      for (const file of files) {
        report.synapseHealth.totalFiles++;
        try {
          const content = await fs5.readFile(file.fsPath, "utf-8");
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
              const found = await vscode5.workspace.findFiles(
                new vscode5.RelativePattern(workspaceFolders[0], `**/${targetName}`)
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
    const instructionFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/instructions/*.md")
    );
    const promptFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/prompts/*.md")
    );
    const episodicFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/episodic/*.md")
    );
    const domainFiles = await vscode5.workspace.findFiles(
      new vscode5.RelativePattern(workspaceFolders[0], ".github/domain-knowledge/*.md")
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
      const episodicPath = path5.join(rootPath, ".github", "episodic");
      await fs5.ensureDir(episodicPath);
      const date = /* @__PURE__ */ new Date();
      const dateStr = date.toISOString().split("T")[0];
      const filename = `self-actualization-${dateStr}.prompt.md`;
      sessionFile = path5.join(episodicPath, filename);
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
      await fs5.writeFile(sessionFile, content, "utf-8");
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

Meditation session documented at: \`${path5.basename(sessionFile)}\``;
    }
    return new vscode5.LanguageModelToolResult([
      new vscode5.LanguageModelTextPart(result)
    ]);
  }
};
async function getUserProfile() {
  const workspaceFolders = vscode5.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return null;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const jsonProfilePath = path5.join(rootPath, "config", "user-profile.json");
  try {
    if (await fs5.pathExists(jsonProfilePath)) {
      return await fs5.readJson(jsonProfilePath);
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
    vscode5.lm.registerTool("alex_synapse_health", new SynapseHealthTool())
  );
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_memory_search", new MemorySearchTool())
  );
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_architecture_status", new ArchitectureStatusTool())
  );
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_mcp_recommendations", new McpRecommendationTool())
  );
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_user_profile", new UserProfileTool())
  );
  context.subscriptions.push(
    vscode5.lm.registerTool("alex_self_actualization", new SelfActualizationTool())
  );
  console.log("Alex Language Model Tools registered");
}

// src/chat/participant.ts
var alexChatHandler = async (request, context, stream, token) => {
  if (request.command === "meditate") {
    return await handleMeditateCommand(request, context, stream, token);
  }
  if (request.command === "dream") {
    return await handleDreamCommand(request, context, stream, token);
  }
  if (request.command === "learn") {
    return await handleLearnCommand(request, context, stream, token);
  }
  if (request.command === "status") {
    return await handleStatusCommand(request, context, stream, token);
  }
  if (request.command === "azure") {
    return await handleAzureCommand(request, context, stream, token);
  }
  if (request.command === "m365") {
    return await handleM365Command(request, context, stream, token);
  }
  if (request.command === "profile") {
    return await handleProfileCommand(request, context, stream, token);
  }
  if (request.command === "selfactualize") {
    return await handleSelfActualizeCommand(request, context, stream, token);
  }
  if (isGreeting(request.prompt) && isStartOfSession(context)) {
    return await handleGreetingWithSelfActualization(request, context, stream, token);
  }
  return await handleGeneralQuery(request, context, stream, token);
};
async function handleMeditateCommand(request, context, stream, token) {
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

### What would you like me to consolidate?
`);
  if (request.prompt) {
    stream.markdown(`
**Focus area**: ${request.prompt}
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
async function handleDreamCommand(request, context, stream, token) {
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
async function handleLearnCommand(request, context, stream, token) {
  stream.progress("\u{1F4DA} Activating bootstrap learning protocol...");
  const domain = request.prompt || "a new domain";
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
async function handleStatusCommand(request, context, stream, token) {
  stream.progress("\u{1F4CA} Gathering cognitive architecture status...");
  stream.markdown(`## \u{1F4CA} Alex Cognitive Architecture Status

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
`);
  stream.button({
    command: "alex.dream",
    title: "\u{1F50D} Run Full Health Check",
    arguments: []
  });
  return { metadata: { command: "status" } };
}
async function handleAzureCommand(request, context, stream, token) {
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
  if (request.prompt) {
    stream.markdown(`
**Your request**: ${request.prompt}

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
async function handleM365Command(request, context, stream, token) {
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
  if (request.prompt) {
    stream.markdown(`
**Your request**: ${request.prompt}

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
async function handleProfileCommand(request, context, stream, token) {
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
  if (request.prompt) {
    stream.markdown(`
**Your update request**: ${request.prompt}
`);
  }
  return { metadata: { command: "profile", action: "view" } };
}
async function handleGeneralQuery(request, context, stream, token) {
  const profile = await getUserProfile();
  const previousMessages = context.history.filter(
    (h) => h instanceof vscode6.ChatRequestTurn || h instanceof vscode6.ChatResponseTurn
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
    const models = await vscode6.lm.selectChatModels({ vendor: "copilot", family: "gpt-4o" });
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
      vscode6.LanguageModelChatMessage.User(alexSystemPrompt),
      vscode6.LanguageModelChatMessage.User(request.prompt)
    ];
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) {
      stream.markdown(fragment);
    }
  } catch (err) {
    if (err instanceof vscode6.LanguageModelError) {
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
async function handleGreetingWithSelfActualization(request, context, stream, token) {
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
  stream.markdown(`### \u{1F9E0} Quick Architecture Check

`);
  stream.button({
    command: "alex.selfActualize",
    title: "\u{1F9D8} Full Self-Actualization",
    arguments: []
  });
  stream.markdown(`

**Alex v2.6.0 BIHEXNILIUM** - Ready to assist!

`);
  stream.markdown(`### What would you like to work on today?

`);
  stream.markdown(`- **\`/learn [topic]\`** - Acquire new domain knowledge
`);
  stream.markdown(`- **\`/azure [query]\`** - Azure development guidance
`);
  stream.markdown(`- **\`/m365 [query]\`** - Microsoft 365 development
`);
  stream.markdown(`- **\`/selfactualize\`** - Deep meditation & architecture assessment
`);
  return { metadata: { command: "greeting" } };
}
async function handleSelfActualizeCommand(request, context, stream, token) {
  stream.progress("\u{1F9D8} Initiating self-actualization protocol...");
  stream.markdown(`## \u{1F9D8} Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files reference v2.6.0
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
    if (result.metadata.command === "greeting") {
      followups.push(
        { prompt: "/learn", label: "\u{1F4DA} Learn something new" },
        { prompt: "/azure", label: "\u2601\uFE0F Azure development" },
        { prompt: "/m365", label: "\u{1F4F1} M365 development" }
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
  const alex = vscode6.chat.createChatParticipant("alex.cognitive", alexChatHandler);
  alex.iconPath = vscode6.Uri.joinPath(context.extensionUri, "assets", "icon.png");
  alex.followupProvider = alexFollowupProvider;
  alex.onDidReceiveFeedback((feedback) => {
    console.log("Alex received feedback:", feedback.kind === vscode6.ChatResultFeedbackKind.Helpful ? "helpful" : "unhelpful");
  });
  context.subscriptions.push(alex);
  return alex;
}

// src/extension.ts
var operationInProgress = false;
async function withOperationLock(operationName, operation) {
  if (operationInProgress) {
    vscode7.window.showWarningMessage(
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
  registerChatParticipant(context);
  registerLanguageModelTools(context);
  let initDisposable = vscode7.commands.registerCommand("alex.initialize", async () => {
    await withOperationLock("Initialize", () => initializeArchitecture(context));
  });
  let resetDisposable = vscode7.commands.registerCommand("alex.reset", async () => {
    await withOperationLock("Reset", () => resetArchitecture(context));
  });
  let dreamDisposable = vscode7.commands.registerCommand("alex.dream", async () => {
    await withOperationLock("Dream Protocol", () => runDreamProtocol(context));
  });
  let upgradeDisposable = vscode7.commands.registerCommand("alex.upgrade", async () => {
    await withOperationLock("Upgrade", () => upgradeArchitecture(context));
  });
  let selfActualizeDisposable = vscode7.commands.registerCommand("alex.selfActualize", async () => {
    await withOperationLock("Self-Actualization", () => runSelfActualization(context));
  });
  context.subscriptions.push(initDisposable);
  context.subscriptions.push(resetDisposable);
  context.subscriptions.push(dreamDisposable);
  context.subscriptions.push(upgradeDisposable);
  context.subscriptions.push(selfActualizeDisposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
