import{S as O,J as Q,K as W,L as S,M as X,g as P,U as o,N as y,O as L,F as k,P as x,Q as p,z as ee,i as re,l as q,G as ae,E as ne,R as ie,V as te,W as fe,I as se,X as C,Y as F,j as G,Z as K,m as ue,_ as le,a0 as ce,b as M,a1 as ve,a2 as _e,a3 as de,n as Z,a4 as J,a5 as be,a6 as ge,f as $,a7 as oe,a8 as Ie,a9 as Pe,aa as ye,ab as Re,A as Se,ac as Ee,ad as Oe,ae as he,af as we}from"./B6xhq614.js";import{s as Ae,g as Ne}from"./DJrxW-Rq.js";function w(e,s=null,v){if(typeof e!="object"||e===null||O in e)return e;const f=p(e);if(f!==Q&&f!==W)return e;var a=new Map,u=ee(e),g=S(0);u&&a.set("length",S(e.length));var I;return new Proxy(e,{defineProperty(l,r,n){(!("value"in n)||n.configurable===!1||n.enumerable===!1||n.writable===!1)&&x();var t=a.get(r);return t===void 0?(t=S(n.value),a.set(r,t)):y(t,w(n.value,I)),!0},deleteProperty(l,r){var n=a.get(r);if(n===void 0)r in l&&a.set(r,S(o));else{if(u&&typeof r=="string"){var t=a.get("length"),i=Number(r);Number.isInteger(i)&&i<t.v&&y(t,i)}y(n,o),z(g)}return!0},get(l,r,n){var b;if(r===O)return e;var t=a.get(r),i=r in l;if(t===void 0&&(!i||(b=L(l,r))!=null&&b.writable)&&(t=S(w(i?l[r]:o,I)),a.set(r,t)),t!==void 0){var c=P(t);return c===o?void 0:c}return Reflect.get(l,r,n)},getOwnPropertyDescriptor(l,r){var n=Reflect.getOwnPropertyDescriptor(l,r);if(n&&"value"in n){var t=a.get(r);t&&(n.value=P(t))}else if(n===void 0){var i=a.get(r),c=i==null?void 0:i.v;if(i!==void 0&&c!==o)return{enumerable:!0,configurable:!0,value:c,writable:!0}}return n},has(l,r){var c;if(r===O)return!0;var n=a.get(r),t=n!==void 0&&n.v!==o||Reflect.has(l,r);if(n!==void 0||k!==null&&(!t||(c=L(l,r))!=null&&c.writable)){n===void 0&&(n=S(t?w(l[r],I):o),a.set(r,n));var i=P(n);if(i===o)return!1}return t},set(l,r,n,t){var E;var i=a.get(r),c=r in l;if(u&&r==="length")for(var b=n;b<i.v;b+=1){var R=a.get(b+"");R!==void 0?y(R,o):b in l&&(R=S(o),a.set(b+"",R))}i===void 0?(!c||(E=L(l,r))!=null&&E.writable)&&(i=S(void 0),y(i,w(n,I)),a.set(r,i)):(c=i.v!==o,y(i,w(n,I)));var d=Reflect.getOwnPropertyDescriptor(l,r);if(d!=null&&d.set&&d.set.call(t,n),!c){if(u&&typeof r=="string"){var A=a.get("length"),N=Number(r);Number.isInteger(N)&&N>=A.v&&y(A,N+1)}z(g)}return!0},ownKeys(l){P(g);var r=Reflect.ownKeys(l).filter(i=>{var c=a.get(i);return c===void 0||c.v!==o});for(var[n,t]of a)t.v!==o&&!(n in l)&&r.push(n);return r},setPrototypeOf(){X()}})}function z(e,s=1){y(e,e.v+s)}function H(e){return e!==null&&typeof e=="object"&&O in e?e[O]:e}function Le(e,s){return Object.is(H(e),H(s))}function Ue(e,s,[v,f]=[0,0]){q&&v===0&&ae();var a=e,u=null,g=null,I=o,l=v>0?ne:0,r=!1;const n=(i,c=!0)=>{r=!0,t(c,i)},t=(i,c)=>{if(I===(I=i))return;let b=!1;if(q&&f!==-1){if(v===0){const d=a.data;d===ie?f=0:d===te?f=1/0:(f=parseInt(d.substring(1)),f!==f&&(f=I?1/0:-1))}const R=f>v;!!I===R&&(a=fe(),se(a),C(!1),b=!0,f=-1)}I?(u?F(u):c&&(u=G(()=>c(a))),g&&K(g,()=>{g=null})):(g?F(g):c&&(g=G(()=>c(a,[v+1,f]))),u&&K(u,()=>{u=null})),b&&C(!0)};re(()=>{r=!1,s(n),r||t(null,null)},l),q&&(a=ue)}function V(e,s){return e===s||(e==null?void 0:e[O])===s}function Ye(e={},s,v,f){return le(()=>{var a,u;return ce(()=>{a=u,u=[],M(()=>{e!==v(...u)&&(s(e,...u),a&&V(v(...a),e)&&s(null,...a))})}),()=>{ve(()=>{u&&V(v(...u),e)&&s(null,...u)})}}),e}let D=!1,j=Symbol();function qe(e,s,v){const f=v[s]??(v[s]={store:null,source:J(void 0),unsubscribe:Z});if(f.store!==e&&!(j in v))if(f.unsubscribe(),f.store=e??null,e==null)f.source.v=void 0,f.unsubscribe=Z;else{var a=!0;f.unsubscribe=Ae(e,u=>{a?f.source.v=u:y(f.source,u)}),a=!1}return e&&j in v?Ne(e):P(f.source)}function Me(){const e={};function s(){_e(()=>{for(var v in e)e[v].unsubscribe();de(e,j,{enumerable:!1,value:!0})})}return[e,s]}function Te(e){var s=D;try{return D=!1,[e(),D]}finally{D=s}}function je(e,s,v,f){var B;var a=(v&Oe)!==0,u=!Se||(v&Ee)!==0,g=(v&ye)!==0,I=(v&he)!==0,l=!1,r;g?[r,l]=Te(()=>e[s]):r=e[s];var n=O in e||Re in e,t=g&&(((B=L(e,s))==null?void 0:B.set)??(n&&s in e&&(_=>e[s]=_)))||void 0,i=f,c=!0,b=!1,R=()=>(b=!0,c&&(c=!1,I?i=M(f):i=f),i);r===void 0&&f!==void 0&&(t&&u&&be(),r=R(),t&&t(r));var d;if(u)d=()=>{var _=e[s];return _===void 0?R():(c=!0,b=!1,_)};else{var A=(a?$:oe)(()=>e[s]);A.f|=ge,d=()=>{var _=P(A);return _!==void 0&&(i=void 0),_===void 0?i:_}}if((v&Ie)===0)return d;if(t){var N=e.$$legacy;return function(_,h){return arguments.length>0?((!u||!h||N||l)&&t(h?d():_),_):d()}}var E=!1,U=!1,m=J(r),T=$(()=>{var _=d(),h=P(m);return E?(E=!1,U=!0,h):(U=!1,m.v=_)});return a||(T.equals=Pe),function(_,h){if(we!==null&&(E=U,d(),P(m)),arguments.length>0){const Y=h?P(T):u&&g?w(_):_;return T.equals(Y)||(E=!0,y(m,Y),b&&i!==void 0&&(i=Y),M(()=>P(T))),_}return P(T)}}export{w as a,Ye as b,Le as c,qe as d,Ue as i,je as p,Me as s};
