define(["can/util/can"],function(t){var e=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},n=function(t){return this instanceof n?(this._doneFuncs=[],this._failFuncs=[],this._resultArgs=null,this._status="",t&&t.call(this,this),void 0):new n};t.Deferred=n,t.when=n.when=function(){var e=t.makeArray(arguments);if(e.length<2){var r=e[0];return r&&t.isFunction(r.isResolved)&&t.isFunction(r.isRejected)?r:n().resolve(r)}var i=n(),o=0,s=[];return t.each(e,function(t,n){t.done(function(){s[n]=arguments.length<2?arguments[0]:arguments,++o==e.length&&i.resolve.apply(i,s)}).fail(function(){i.reject(1===arguments.length?arguments[0]:arguments)})}),i};var r=function(t,e){return function(n){var r=this._resultArgs=arguments.length>1?arguments[1]:[];return this.exec(n,this[t],r,e)}},i=function(e,n){return function(){var r=this;return t.each(Array.prototype.slice.call(arguments),function(t,i,o){t&&(t.constructor===Array?o.callee.apply(r,t):(r._status===n&&t.apply(r,r._resultArgs||[]),r[e].push(t)))}),this}};return e(n.prototype,{pipe:function(e,n){var r=t.Deferred();return this.done(function(){r.resolve(e.apply(this,arguments))}),this.fail(function(){n?r.reject(n.apply(this,arguments)):r.reject.apply(r,arguments)}),r},resolveWith:r("_doneFuncs","rs"),rejectWith:r("_failFuncs","rj"),done:i("_doneFuncs","rs"),fail:i("_failFuncs","rj"),always:function(){var e=t.makeArray(arguments);return e.length&&e[0]&&this.done(e[0]).fail(e[0]),this},then:function(){var e=t.makeArray(arguments);return e.length>1&&e[1]&&this.fail(e[1]),e.length&&e[0]&&this.done(e[0]),this},state:function(){switch(this._status){case"rs":return"resolved";case"rj":return"rejected";default:return"pending"}},isResolved:function(){return"rs"===this._status},isRejected:function(){return"rj"===this._status},reject:function(){return this.rejectWith(this,arguments)},resolve:function(){return this.resolveWith(this,arguments)},exec:function(e,n,r,i){return""!==this._status?this:(this._status=i,t.each(n,function(t){t.apply(e,r)}),this)}}),t});