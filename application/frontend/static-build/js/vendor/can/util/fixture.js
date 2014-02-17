/*!
 * CanJS - 2.0.5
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Tue, 04 Feb 2014 22:36:26 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */

define(["can/util/library","can/util/string","can/util/object"],function(t){if(!t.Object)throw new Error("can.fixture depends on can.Object. Please include it before can.fixture.");var e=function(e){return"undefined"!=typeof steal?t.isFunction(steal.config)?steal.config().root.mapJoin(e).toString():steal.root.join(e).toString():(t.fixture.rootUrl||"")+e},n=function(n,i){if(t.fixture.on){var r=function(){};n.type=n.type||n.method||"GET";var o=u(n);if(!n.fixture)return"file:"===window.location.protocol&&r("ajax request to "+n.url+", no fixture found"),void 0;if("string"==typeof n.fixture&&t.fixture[n.fixture]&&(n.fixture=t.fixture[n.fixture]),"string"==typeof n.fixture){var a=n.fixture;/^\/\//.test(a)&&(a=e(n.fixture.substr(2))),o&&(a=t.sub(a,o)),delete n.fixture,n.url=a,n.data=null,n.type="GET",n.error||(n.error=function(t,e,n){throw"fixtures.js Error "+e+" "+n})}else n.dataTypes&&n.dataTypes.splice(0,0,"fixture"),o&&i&&t.extend(i.data,o)}},i=function(t,e,n,i){return"number"!=typeof t&&(i=e,n=t,e="success",t=200),"string"!=typeof e&&(i=n,n=e,e="success"),t>=400&&599>=t&&(this.dataType="text"),[t,e,r(this,n),i]},r=function(t,e){var n=t.dataTypes?t.dataTypes[0]:t.dataType||"json";if(!e||!e[n]){var i={};i[n]=e,e=i}return e};if(t.ajaxPrefilter&&t.ajaxTransport)t.ajaxPrefilter(n),t.ajaxTransport("fixture",function(e,n){e.dataTypes.shift();var o,a=!1;return{send:function(s,u){o=setTimeout(function(){var t=function(){a===!1&&u.apply(null,i.apply(e,arguments))},o=e.fixture(n,t,s,e);void 0!==o&&u(200,"success",r(e,o),{})},t.fixture.delay)},abort:function(){a=!0,clearTimeout(o)}}});else{var o=t.ajax;t.ajax=function(e){if(n(e,e),e.fixture){var r,a=new t.Deferred,s=!1;return a.getResponseHeader=function(){},a.then(e.success,e.fail),a.abort=function(){clearTimeout(r),s=!0,a.reject(a)},r=setTimeout(function(){var t=function(){var t=i.apply(e,arguments),n=t[0];(n>=200&&300>n||304===n)&&s===!1?a.resolve(t[2][e.dataType]):a.reject(a,"error",t[1])},n=e.fixture(e,t,e.headers,e);void 0!==n&&a.resolve(n)},t.fixture.delay),a}return o(e)}}var a=[],s=function(t,e){for(var n=0;n<a.length;n++)if(c._similar(t,a[n],e))return n;return-1},u=function(t){var e=s(t);return e>-1?(t.fixture=a[e].fixture,c._getData(a[e].url,t.url)):void 0},l=function(t){var e=t.data.id;return void 0===e&&"number"==typeof t.data&&(e=t.data),void 0===e&&t.url.replace(/\/(\d+)(\/|$|\.)/g,function(t,n){e=n}),void 0===e&&(e=t.url.replace(/\/(\w+)(\/|$|\.)/g,function(t,n){"update"!==n&&(e=n)})),void 0===e&&(e=Math.round(1e3*Math.random())),e},c=t.fixture=function(e,n){if(void 0!==n){if("string"==typeof e){var i=e.match(/(GET|POST|PUT|DELETE) (.+)/i);e=i?{url:i[2],type:i[1]}:{url:e}}var r=s(e,!!n);if(r>-1&&a.splice(r,1),null==n)return;e.fixture=n,a.push(e)}else t.each(e,function(t,e){c(e,t)})},d=t.replacer;return t.extend(t.fixture,{_similar:function(e,n,i){return i?t.Object.same(e,n,{fixture:null}):t.Object.subset(e,n,t.fixture._compare)},_compare:{url:function(t,e){return!!c._getData(e,t)},fixture:null,type:"i"},_getData:function(e,n){var i=[],r=e.replace(".","\\.").replace("?","\\?"),o=new RegExp(r.replace(d,function(t,e){return i.push(e),"([^/]+)"})+"$").exec(n),a={};return o?(o.shift(),t.each(i,function(t){a[t]=o.shift()}),a):null},store:function(e,n,i,r){var o=[],a=0,s=function(t){for(var e=0;e<o.length;e++)if(t==o[e].id)return o[e]},u={};"string"==typeof e?e=[e+"s",e]:t.isArray(e)||(r=i,i=n,n=e),t.extend(u,{findAll:function(e){e=e||{};var n=o.slice(0);e.data=e.data||{},t.each((e.data.order||[]).slice(0).reverse(),function(t){var e=t.split(" ");n=n.sort(function(t,n){return"ASC"!==e[1].toUpperCase()?t[e[0]]<n[e[0]]?1:t[e[0]]===n[e[0]]?0:-1:t[e[0]]<n[e[0]]?-1:t[e[0]]===n[e[0]]?0:1})}),t.each((e.data.group||[]).slice(0).reverse(),function(t){var e=t.split(" ");n=n.sort(function(t,n){return t[e[0]]>n[e[0]]})});var i=parseInt(e.data.offset,10)||0,a=parseInt(e.data.limit,10)||o.length-i,s=0;for(var u in e.data)if(s=0,void 0!==e.data[u]&&(-1!==u.indexOf("Id")||-1!==u.indexOf("_id")))for(;s<n.length;)e.data[u]!==n[s][u]?n.splice(s,1):s++;if(r)for(s=0;s<n.length;)r(n[s],e)?s++:n.splice(s,1);return{count:n.length,limit:e.data.limit,offset:e.data.offset,data:n.slice(i,i+a)}},findOne:function(t,e){var n=s(l(t));e(n?n:void 0)},update:function(e,n){var i=l(e);t.extend(s(i),e.data),n({id:l(e)},{location:e.url||"/"+l(e)})},destroy:function(e){for(var n=l(e),i=0;i<o.length;i++)if(o[i].id===n){o.splice(i,1);break}return t.extend(s(n)||{},e.data),{}},create:function(e,n){var r=i(o.length,o);t.extend(r,e.data),r.id||(r.id=a++),o.push(r),n({id:r.id},{location:e.url+"/"+r.id})}});var c=function(){o=[];for(var r=0;n>r;r++){var s=i(r,o);s.id||(s.id=r),a=Math.max(s.id+1,a+1)||o.length,o.push(s)}t.isArray(e)&&(t.fixture["~"+e[0]]=o,t.fixture["-"+e[0]]=u.findAll,t.fixture["-"+e[1]]=u.findOne,t.fixture["-"+e[1]+"Update"]=u.update,t.fixture["-"+e[1]+"Destroy"]=u.destroy,t.fixture["-"+e[1]+"Create"]=u.create)};return c(),t.extend({getId:l,find:function(t){return s(l(t))},reset:c},u)},rand:function f(t,e,n){if("number"==typeof t)return"number"==typeof e?t+Math.floor(Math.random()*(e-t)):Math.floor(Math.random()*t);var i=f;if(void 0===e)return i(t,i(t.length+1));var r=[];t=t.slice(0),n||(n=e),n=e+Math.round(i(n-e));for(var o=0;n>o;o++)r.push(t.splice(i(t.length),1)[0]);return r},xhr:function(e){return t.extend({},{abort:t.noop,getAllResponseHeaders:function(){return""},getResponseHeader:function(){return""},open:t.noop,overrideMimeType:t.noop,readyState:4,responseText:"",responseXML:null,send:t.noop,setRequestHeader:t.noop,status:200,statusText:"OK"},e)},on:!0}),t.fixture.delay=200,t.fixture.rootUrl=e(""),t.fixture["-handleFunction"]=function(e){return"string"==typeof e.fixture&&t.fixture[e.fixture]&&(e.fixture=t.fixture[e.fixture]),"function"==typeof e.fixture?(setTimeout(function(){e.success&&e.success.apply(null,e.fixture(e,"success")),e.complete&&e.complete.apply(null,e.fixture(e,"complete"))},t.fixture.delay),!0):!1},t.fixture.overwrites=a,t.fixture.make=t.fixture.store,t.fixture});