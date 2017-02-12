import compareVersion from 'compare-versions';

export const checkVersion = function () {
  let compare = function (v1, v2) {
    return compareVersion(v1, v2) >= 0;
  };

  // if must compile template
  if (procee.env.MODE === 'compile') {
    // `compileTemplate: true` will error
    // before version 2.1.5
    if (!compare(Vue.version, '2.1.5')) {
      throw 'Vue before verison 2.1.5 will cause error.\n Pleasw consider updating vue, or just require `bundle.common.js` instead of `bundle.compile.js`';
    }
  }

  // warn that will not support vue@1
  if (!compare(Vue.version, '2.0.0')) {
    throw 'This module can only supports vue@2!';
  }
};

export const eventMix = function () {
  // inject a eventbus
  let hub = new Vue();
  let proto = Vue.prototype;

  proto.$von = function (type, cb) {
    let uid = this.uid;
    let vm = this;
    let fn = function(e) {
      if (uid === e.uid && cb) {
        cb(e.data);
      }
    };
    hub.$on(`@${uid}:${type}`, fn);
  };

  proto.$vonce = function (type, cb) {
    let uid = this.uid;
    let vm = this;
    let fn = function(e) {
      console.log(e)
      if (uid === e.uid && cb) {
        cb(e.data);
      }
    };
    hub.$once(`@${uid}:${type}`, fn);
  };

  proto.$vemit = function (type, data) {
    let uid = this.uid;
    hub.$emit(`@${uid}:${type}`, { data, uid });
  };

  proto.$voff = function (type, fn) {
    let uid = this.uid;

    if (type) {
      hub.$off(`@${uid}:${type}`, fn);
    } else {
      uid = `@${uid}:`
      let len = uid.length;
      let types = Object.keys(hub._events);
      let match = types.filter(k => key.indexOf(uid) === 0);
      match.forEach(k => {
        hub.$off(k, fn);
      })
    }
  };
};
