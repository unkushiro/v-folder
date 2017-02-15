!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):e.VFolder=n()}(this,function(){"use strict";function e(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function n(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var n={},t=0;t<10;t++)n["_"+String.fromCharCode(t)]=t;var a=Object.getOwnPropertyNames(n).map(function(e){return n[e]});if("0123456789"!==a.join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}function t(e,n,a,r){void 0===e&&(e={}),r=r.replace(/^\s*\/+/,"/");var o=n.node,c=n.branch,i=n.leaf,s=n.check,h=n.open,f=e[o]||"/",u=e[c]||[],d=e[i]||[],l=u.length>0||d.length>0;r||(r="/"===f?f:"/"+f),u=u.map(function(e,c){return"string"==typeof e&&(e={},e[o]=e),t(e,n,a+"."+c,r+"/"+e[o])}),d=d.map(function(e,n){return{name:e,type:"leaf",check:s,level:a+"."+n,path:r+"/"+e}});var p=l?"filled":"empty";return{name:f,type:"branch",level:a,path:r,node:{name:f,open:0==a||h,canOpen:l,check:s,level:a,path:r,type:"node",status:p},branches:u,leafs:d}}var a=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,c=n()?Object.assign:function(n,t){for(var c,i,s=arguments,h=e(n),f=1;f<arguments.length;f++){c=Object(s[f]);for(var u in c)r.call(c,u)&&(h[u]=c[u]);if(a){i=a(c);for(var d=0;d<i.length;d++)o.call(c,i[d])&&(h[i[d]]=c[i[d]])}}return h},i=function e(n){var t={};return n&&"object"==typeof n?(n instanceof Array&&(t=[]),Object.keys(n).forEach(function(a){"object"==typeof n[a]?t[a]=e(n[a]):t[a]=n[a]}),t):n},s=[].push,h={node:"name",branch:"dirs",leaf:"files",open:!1,check:-1},f=function(e,n){this.conf=c({},h,n);var a=e.path||e[this.conf.node]||"/",r=a.split("/").filter(function(e){return!!e}).slice(-1)[0]||e.name;e.name=r,this.dataStore=t(e,this.conf,"0",a)};f.prototype.replace=function(e){this.dataStore=e},f.prototype.findParentBranch=function(e){void 0===e&&(e="");var n=e.length,t=this.dataStore;if(n<=1)return null;for(var a=e.split(".").slice(1,-1),r=0;t&&(r=a.shift());)t=t.branches[r];return t},f.prototype.findCurrentBranch=function(e){void 0===e&&(e="");for(var n=e.split(".").slice(1),t=0,a=this.dataStore;a&&(t=n.shift());)a=a.branches[t];return a},f.prototype.checkBranchAscendents=function(e,n){if(e){var t=e.branches,a=e.leafs,r=e.node,o=e.level,c=0;switch(n){case 1:var i=!t.length||!t.some(function(e){return e.node.check<1}),s=!a.length||!a.some(function(e){return e.check<1});c=i&&s?1:0;break;case 0:c=0;break;case-1:var h=!t.length||!t.some(function(e){return e.node.check>-1}),f=!a.length||!a.some(function(e){return e.check>-1});c=h&&f?-1:0}r.check=c,this.checkBranchAscendents(this.findParentBranch(o),c)}},f.prototype.checkBranchDescendents=function(e,n){var t=this;e.node.check=n,n&&(e.leafs.forEach(function(e){return e.check=n}),e.branches.forEach(function(e){e.node.check=n,t.checkBranchDescendents(e,n)}))},f.prototype.checkNode=function(e){var n=this.findCurrentBranch(e.level),t=n.node.check,a=t<1?1:-1;this.checkBranchDescendents(n,a),this.checkBranchAscendents(this.findParentBranch(n.level),a)},f.prototype.checkLeaf=function(e){var n=this.findParentBranch(e.level),t=-1*e.check;e.check=t,this.checkBranchAscendents(n,t)},f.prototype.merge=function(e,n){void 0===e&&(e={}),void 0===n&&(n={level:"0",path:""});var a=n.level,r=n.path,o=n.check,c=a.split(".").slice(1),s=t(e,this.conf,a,r);if(s.node.open=!0,s.node.check=o,s.node.status="done",0===c.length)this.replace(s);else{for(var h=i(this.dataStore),f=h,u=c.pop(),d=0;d=c.shift();)f=f.branches[d];f.branches.splice(u,1,s),f.node.canOpen=!0,this.replace(h)}this.checkBranchDescendents(s,o)},f.prototype.commit=function(e,n){var t=this;return new Promise(function(a,r){var o="node"===n.type;return"change"===e?(t[o?"checkNode":"checkLeaf"](n),a(t.getPathResult())):void("unfold"===e&&o&&(n.open=!n.open,n.canOpen||"done"===n.status?r():(n.status="loading",a())))})},f.prototype.getPathResult=function(e){var n=this;e=e||this.dataStore;var t=[],a=e.node,r=e.branches,o=e.leafs;e.path;return a.check>0?t.push(e.path):(o.forEach(function(e){var n=e.check,a=e.path;n>0&&t.push(a)}),r.forEach(function(e){s.apply(t,n.getPathResult(e))})),t},f.prototype.raw=function(){return t.raw(this.dataStore,this.conf)};var u={methods:{notify:function(e){this.___vemit(e,this.data)},listen:function(e,n){this.___von(e,function(e){n(e)})},distroy:function(){this.___voff()}}},d=["fa-square-o","fa-minus-square-o","fa-check-square-o"],l={template:'<li class="v-node" :key="data.level"><i class="fa" :class="folderClass" @click="notify(\'unfold\')"></i> <span @click="notify(\'change\')"><i class="fa" :class="checkboxClass"></i> {{data.name}}</span></li>',name:"v-node",mixins:[u],props:{data:{type:Object,required:!0},uid:{type:[String,Number],required:!0}},computed:{folderClass:function(){var e=this.data,n="loading"===e.status,t=e.canOpen&&e.open,a=!e.canOpen&&"done"===e.status;return{"fa-spinner cursor-progress":n,"fa-folder-open-o":!n&&t,"fa-folder-o":!n&&!t,"cursor-no-ops":a}},checkboxClass:function(){return d[this.data.check+1]}}},p=["fa-square-o","fa-minus-square-o","fa-check-square-o"],v={template:'<li class="v-leaf" @click="notify(\'change\')" :key="data.level"><i class="fa" :class="className"></i> <span>{{data.name}}</span></li>',name:"v-leaf",mixins:[u],props:{data:{type:Object,required:!0},uid:{type:[String,Number],required:!0}},computed:{className:function(){return p[this.data.check+1]}}},m={template:'<li :key="node.level" class="v-branch"><ul class="v-branch-body"><v-node :data="node" :uid="uid"></v-node><v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch><v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf></ul></li>',name:"v-branch",mixins:[u],props:{data:{type:Object,required:!0},uid:{type:[String,Number],required:!0}},components:{"v-node":l,"v-leaf":v},computed:{branches:function(){return this.data.branches},leafs:function(){return this.data.leafs},node:function(){return this.data.node}}},b=0,y={template:'<ul class="v-branch-body"><v-node :data="node" :uid="uid"></v-node><v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch><v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf></ul>',name:"v-folder",mixins:[u],props:{data:Object,ajax:Object,conf:Object},components:{"v-node":l,"v-leaf":v,"v-branch":m},watch:{data:function(e,n){var t=this.conf&&this.conf.node||"name";e[t]!==n[t]&&(this.store=new f(e,this.conf))}},data:function(){return{uid:b++,store:new f(this.data,this.conf)}},computed:{root:function(){return this.store.dataStore},branches:function(){return this.root.branches},leafs:function(){return this.root.leafs},node:function(){return this.root.node}},methods:{resTransform:function(e,n){var t=this.conf||{},a=t.branch||"dirs",r=(t.leaf||"files",t.node||"name");return e[r]=n.name,e[a]=e[a].map(function(e){return n={},n[r]=e,n;var n}),e},getReqConf:function(e){var n=this.ajax||{},t=(n.url,n.method),a=n.data,r=n.params,o=n.pathAs,c=n.headers;return t||"GET"===t.toUpperCase()?(n.params=r||{},n.params[o]=e.path):(n.data=a||{},n.data[o]=e.path),n.method=t||"GET",n.headers=c||{},n},request:function(e){var n=this;if(!this.ajax)return Promise.reject("ajax:false");var t=this.ajax.process||function(e){return e};return this.$http(this.getReqConf(e)).then(function(a){var r=t(a.data);return n.resTransform(r,e)})}},created:function(){var e=this;this.listen("change",function(n){e.store.commit("change",n).then(function(n){return e.$emit("change",n)})}),this.listen("unfold",function(n){return n.open&&n.canOpen?void(n.open=!n.open):void e.store.commit("unfold",n).then(function(){e.request(n).then(function(t){if(!t)throw"empty";e.store.merge(t,n)}).catch(function(e){n.status="empty",window.console&&console.error(e)})}).catch(function(e){return n.status="done"})})},destroyed:function(){this.distroy()}},k=function(e){var n=new e,t=e.prototype;t.___von=function(e,t){var a=this.uid,r=function(e){a===e.uid&&t&&t(e.data)};n.$on("#"+a+"@"+e,r)},t.___vemit=function(e,t){var a=this.uid;n.$emit("#"+a+"@"+e,{data:t,uid:a})},t.___voff=function(e,t){var a=this.uid;if(e)n.$off("#"+a+"@"+e,t);else{a="#"+a+"@";var r=(a.length,Object.keys(n._events)),o=r.filter(function(e){return 0===e.indexOf(a)});o.forEach(function(e){n.$off(e,t)})}}};return y.install=function(e){var n=e.version.split("."),t=n[0],a=n[1],r=n[2];if(t>2||2===t&&(a>1||1===a&&r>=5))throw"You should at least get Vue.js@2.1.5.";k(e),e.component(y.name,y)},y});
//# sourceMappingURL=build.js.map
