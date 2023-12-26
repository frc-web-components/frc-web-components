import{s as xr,i as S,k as Ge,X as ke,Y as J,d as gt}from"./property-293dc01c-d6840d48.js";import{n as vr}from"./state-6b86eede-5fd1e84e.js";import{h as Ie}from"./query-b33b5ea2-b51c1579.js";import{E as xe,A as Je,j as Mr,P as mt,M as pt,l as br}from"./transform-bc2573b1-2dde8094.js";import{r as wr}from"./directive-helpers-6b2c92c9-aa4f1afd.js";import{T as Tr,_ as Cr,s as $r}from"./directive-daf4e9b6-78860a76.js";import{m as De}from"./style-map-d5dd5db8-059c0b16.js";import{x as ve}from"./lit-element-37c36932.js";import{o as kr}from"./style-map-4c049cd0.js";function Le(e,t){return e==null||t==null?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function Dr(e,t){return e==null||t==null?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function nt(e){let t,r,n;e.length!==2?(t=Le,r=(l,c)=>Le(e(l),c),n=(l,c)=>e(l)-c):(t=e===Le||e===Dr?e:Ar,r=e,n=e);function i(l,c,s=0,d=l.length){if(s<d){if(t(c,c)!==0)return d;do{const f=s+d>>>1;r(l[f],c)<0?s=f+1:d=f}while(s<d)}return s}function a(l,c,s=0,d=l.length){if(s<d){if(t(c,c)!==0)return d;do{const f=s+d>>>1;r(l[f],c)<=0?s=f+1:d=f}while(s<d)}return s}function o(l,c,s=0,d=l.length){const f=i(l,c,s,d-1);return f>s&&n(l[f-1],c)>-n(l[f],c)?f-1:f}return{left:i,center:o,right:a}}function Ar(){return 0}function Sr(e){return e===null?NaN:+e}const Ur=nt(Le),Lr=Ur.right;nt(Sr).center;const Fr=Lr;class yt extends Map{constructor(t,r=Yr){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:r}}),t!=null)for(const[n,i]of t)this.set(n,i)}get(t){return super.get(xt(this,t))}has(t){return super.has(xt(this,t))}set(t,r){return super.set(Nr(this,t),r)}delete(t){return super.delete(Pr(this,t))}}function xt({_intern:e,_key:t},r){const n=t(r);return e.has(n)?e.get(n):r}function Nr({_intern:e,_key:t},r){const n=t(r);return e.has(n)?e.get(n):(e.set(n,r),r)}function Pr({_intern:e,_key:t},r){const n=t(r);return e.has(n)&&(r=e.get(n),e.delete(n)),r}function Yr(e){return e!==null&&typeof e=="object"?e.valueOf():e}const Vr=Math.sqrt(50),Hr=Math.sqrt(10),_r=Math.sqrt(2);function Pe(e,t,r){const n=(t-e)/Math.max(0,r),i=Math.floor(Math.log10(n)),a=n/Math.pow(10,i),o=a>=Vr?10:a>=Hr?5:a>=_r?2:1;let l,c,s;return i<0?(s=Math.pow(10,-i)/o,l=Math.round(e*s),c=Math.round(t*s),l/s<e&&++l,c/s>t&&--c,s=-s):(s=Math.pow(10,i)*o,l=Math.round(e/s),c=Math.round(t/s),l*s<e&&++l,c*s>t&&--c),c<l&&.5<=r&&r<2?Pe(e,t,r*2):[l,c,s]}function zr(e,t,r){if(t=+t,e=+e,r=+r,!(r>0))return[];if(e===t)return[e];const n=t<e,[i,a,o]=n?Pe(t,e,r):Pe(e,t,r);if(!(a>=i))return[];const l=a-i+1,c=new Array(l);if(n)if(o<0)for(let s=0;s<l;++s)c[s]=(a-s)/-o;else for(let s=0;s<l;++s)c[s]=(a-s)*o;else if(o<0)for(let s=0;s<l;++s)c[s]=(i+s)/-o;else for(let s=0;s<l;++s)c[s]=(i+s)*o;return c}function Ke(e,t,r){return t=+t,e=+e,r=+r,Pe(e,t,r)[2]}function et(e,t,r){t=+t,e=+e,r=+r;const n=t<e,i=n?Ke(t,e,r):Ke(e,t,r);return(n?-1:1)*(i<0?1/-i:i)}function jr(e){return e}var Be=1,Fe=2,tt=3,ye=4,vt=1e-6;function Gr(e){return"translate("+e+",0)"}function Ir(e){return"translate(0,"+e+")"}function Or(e){return t=>+e(t)}function Er(e,t){return t=Math.max(0,e.bandwidth()-t*2)/2,e.round()&&(t=Math.round(t)),r=>+e(r)+t}function Br(){return!this.__axis}function it(e,t){var r=[],n=null,i=null,a=6,o=6,l=3,c=typeof window<"u"&&window.devicePixelRatio>1?0:.5,s=e===Be||e===ye?-1:1,d=e===ye||e===Fe?"x":"y",f=e===Be||e===tt?Gr:Ir;function h(m){var $=n??(t.ticks?t.ticks.apply(t,r):t.domain()),P=i??(t.tickFormat?t.tickFormat.apply(t,r):jr),F=Math.max(a,0)+l,Y=t.range(),_=+Y[0]+c,T=+Y[Y.length-1]+c,L=(t.bandwidth?Er:Or)(t.copy(),c),C=m.selection?m.selection():m,p=C.selectAll(".domain").data([null]),b=C.selectAll(".tick").data($,t).order(),j=b.exit(),q=b.enter().append("g").attr("class","tick"),I=b.select("line"),y=b.select("text");p=p.merge(p.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),b=b.merge(q),I=I.merge(q.append("line").attr("stroke","currentColor").attr(d+"2",s*a)),y=y.merge(q.append("text").attr("fill","currentColor").attr(d,s*F).attr("dy",e===Be?"0em":e===tt?"0.71em":"0.32em")),m!==C&&(p=p.transition(m),b=b.transition(m),I=I.transition(m),y=y.transition(m),j=j.transition(m).attr("opacity",vt).attr("transform",function(A){return isFinite(A=L(A))?f(A+c):this.getAttribute("transform")}),q.attr("opacity",vt).attr("transform",function(A){var k=this.parentNode.__axis;return f((k&&isFinite(k=k(A))?k:L(A))+c)})),j.remove(),p.attr("d",e===ye||e===Fe?o?"M"+s*o+","+_+"H"+c+"V"+T+"H"+s*o:"M"+c+","+_+"V"+T:o?"M"+_+","+s*o+"V"+c+"H"+T+"V"+s*o:"M"+_+","+c+"H"+T),b.attr("opacity",1).attr("transform",function(A){return f(L(A)+c)}),I.attr(d+"2",s*a),y.attr(d,s*F).text(P),C.filter(Br).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",e===Fe?"start":e===ye?"end":"middle"),C.each(function(){this.__axis=L})}return h.scale=function(m){return arguments.length?(t=m,h):t},h.ticks=function(){return r=Array.from(arguments),h},h.tickArguments=function(m){return arguments.length?(r=m==null?[]:Array.from(m),h):r.slice()},h.tickValues=function(m){return arguments.length?(n=m==null?null:Array.from(m),h):n&&n.slice()},h.tickFormat=function(m){return arguments.length?(i=m,h):i},h.tickSize=function(m){return arguments.length?(a=o=+m,h):a},h.tickSizeInner=function(m){return arguments.length?(a=+m,h):a},h.tickSizeOuter=function(m){return arguments.length?(o=+m,h):o},h.tickPadding=function(m){return arguments.length?(l=+m,h):l},h.offset=function(m){return arguments.length?(c=+m,h):c},h}function Wr(e){return it(Fe,e)}function Bt(e){return it(tt,e)}function Mt(e){return it(ye,e)}function Zr(e,t){t||(t=[]);var r=e?Math.min(t.length,e.length):0,n=t.slice(),i;return function(a){for(i=0;i<r;++i)n[i]=e[i]*(1-a)+t[i]*a;return n}}function qr(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Xr(e,t){var r=t?t.length:0,n=e?Math.min(r,e.length):0,i=new Array(n),a=new Array(r),o;for(o=0;o<n;++o)i[o]=at(e[o],t[o]);for(;o<r;++o)a[o]=t[o];return function(l){for(o=0;o<n;++o)a[o]=i[o](l);return a}}function Qr(e,t){var r=new Date;return e=+e,t=+t,function(n){return r.setTime(e*(1-n)+t*n),r}}function Rr(e,t){var r={},n={},i;(e===null||typeof e!="object")&&(e={}),(t===null||typeof t!="object")&&(t={});for(i in t)i in e?r[i]=at(e[i],t[i]):n[i]=t[i];return function(a){for(i in r)n[i]=r[i](a);return n}}function at(e,t){var r=typeof t,n;return t==null||r==="boolean"?Mr(t):(r==="number"?Je:r==="string"?(n=mt(t))?(t=n,pt):br:t instanceof mt?pt:t instanceof Date?Qr:qr(t)?Zr:Array.isArray(t)?Xr:typeof t.valueOf!="function"&&typeof t.toString!="function"||isNaN(t)?Rr:Je)(e,t)}function Jr(e,t){return e=+e,t=+t,function(r){return Math.round(e*(1-r)+t*r)}}function Kr(e){return Math.abs(e=Math.round(e))>=1e21?e.toLocaleString("en").replace(/,/g,""):e.toString(10)}function Ye(e,t){if((r=(e=t?e.toExponential(t-1):e.toExponential()).indexOf("e"))<0)return null;var r,n=e.slice(0,r);return[n.length>1?n[0]+n.slice(2):n,+e.slice(r+1)]}function ue(e){return e=Ye(Math.abs(e)),e?e[1]:NaN}function en(e,t){return function(r,n){for(var i=r.length,a=[],o=0,l=e[0],c=0;i>0&&l>0&&(c+l+1>n&&(l=Math.max(1,n-c)),a.push(r.substring(i-=l,i+l)),!((c+=l+1)>n));)l=e[o=(o+1)%e.length];return a.reverse().join(t)}}function tn(e){return function(t){return t.replace(/[0-9]/g,function(r){return e[+r]})}}var rn=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Ve(e){if(!(t=rn.exec(e)))throw new Error("invalid format: "+e);var t;return new ot({fill:t[1],align:t[2],sign:t[3],symbol:t[4],zero:t[5],width:t[6],comma:t[7],precision:t[8]&&t[8].slice(1),trim:t[9],type:t[10]})}Ve.prototype=ot.prototype;function ot(e){this.fill=e.fill===void 0?" ":e.fill+"",this.align=e.align===void 0?">":e.align+"",this.sign=e.sign===void 0?"-":e.sign+"",this.symbol=e.symbol===void 0?"":e.symbol+"",this.zero=!!e.zero,this.width=e.width===void 0?void 0:+e.width,this.comma=!!e.comma,this.precision=e.precision===void 0?void 0:+e.precision,this.trim=!!e.trim,this.type=e.type===void 0?"":e.type+""}ot.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?",":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function nn(e){e:for(var t=e.length,r=1,n=-1,i;r<t;++r)switch(e[r]){case".":n=i=r;break;case"0":n===0&&(n=r),i=r;break;default:if(!+e[r])break e;n>0&&(n=0);break}return n>0?e.slice(0,n)+e.slice(i+1):e}var Wt;function an(e,t){var r=Ye(e,t);if(!r)return e+"";var n=r[0],i=r[1],a=i-(Wt=Math.max(-8,Math.min(8,Math.floor(i/3)))*3)+1,o=n.length;return a===o?n:a>o?n+new Array(a-o+1).join("0"):a>0?n.slice(0,a)+"."+n.slice(a):"0."+new Array(1-a).join("0")+Ye(e,Math.max(0,t+a-1))[0]}function bt(e,t){var r=Ye(e,t);if(!r)return e+"";var n=r[0],i=r[1];return i<0?"0."+new Array(-i).join("0")+n:n.length>i+1?n.slice(0,i+1)+"."+n.slice(i+1):n+new Array(i-n.length+2).join("0")}const wt={"%":(e,t)=>(e*100).toFixed(t),b:e=>Math.round(e).toString(2),c:e=>e+"",d:Kr,e:(e,t)=>e.toExponential(t),f:(e,t)=>e.toFixed(t),g:(e,t)=>e.toPrecision(t),o:e=>Math.round(e).toString(8),p:(e,t)=>bt(e*100,t),r:bt,s:an,X:e=>Math.round(e).toString(16).toUpperCase(),x:e=>Math.round(e).toString(16)};function Tt(e){return e}var Ct=Array.prototype.map,$t=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function on(e){var t=e.grouping===void 0||e.thousands===void 0?Tt:en(Ct.call(e.grouping,Number),e.thousands+""),r=e.currency===void 0?"":e.currency[0]+"",n=e.currency===void 0?"":e.currency[1]+"",i=e.decimal===void 0?".":e.decimal+"",a=e.numerals===void 0?Tt:tn(Ct.call(e.numerals,String)),o=e.percent===void 0?"%":e.percent+"",l=e.minus===void 0?"−":e.minus+"",c=e.nan===void 0?"NaN":e.nan+"";function s(f){f=Ve(f);var h=f.fill,m=f.align,$=f.sign,P=f.symbol,F=f.zero,Y=f.width,_=f.comma,T=f.precision,L=f.trim,C=f.type;C==="n"?(_=!0,C="g"):wt[C]||(T===void 0&&(T=12),L=!0,C="g"),(F||h==="0"&&m==="=")&&(F=!0,h="0",m="=");var p=P==="$"?r:P==="#"&&/[boxX]/.test(C)?"0"+C.toLowerCase():"",b=P==="$"?n:/[%p]/.test(C)?o:"",j=wt[C],q=/[defgprs%]/.test(C);T=T===void 0?6:/[gprs]/.test(C)?Math.max(1,Math.min(21,T)):Math.max(0,Math.min(20,T));function I(y){var A=p,k=b,X,$e,ie;if(C==="c")k=j(y)+k,y="";else{y=+y;var ae=y<0||1/y<0;if(y=isNaN(y)?c:j(Math.abs(y),T),L&&(y=nn(y)),ae&&+y==0&&$!=="+"&&(ae=!1),A=(ae?$==="("?$:l:$==="-"||$==="("?"":$)+A,k=(C==="s"?$t[8+Wt/3]:"")+k+(ae&&$==="("?")":""),q){for(X=-1,$e=y.length;++X<$e;)if(ie=y.charCodeAt(X),48>ie||ie>57){k=(ie===46?i+y.slice(X+1):y.slice(X))+k,y=y.slice(0,X);break}}}_&&!F&&(y=t(y,1/0));var oe=A.length+y.length+k.length,G=oe<Y?new Array(Y-oe+1).join(h):"";switch(_&&F&&(y=t(G+y,G.length?Y-k.length:1/0),G=""),m){case"<":y=A+y+k+G;break;case"=":y=A+G+y+k;break;case"^":y=G.slice(0,oe=G.length>>1)+A+y+k+G.slice(oe);break;default:y=G+A+y+k;break}return a(y)}return I.toString=function(){return f+""},I}function d(f,h){var m=s((f=Ve(f),f.type="f",f)),$=Math.max(-8,Math.min(8,Math.floor(ue(h)/3)))*3,P=Math.pow(10,-$),F=$t[8+$/3];return function(Y){return m(P*Y)+F}}return{format:s,formatPrefix:d}}var Ae,Zt,qt;sn({thousands:",",grouping:[3],currency:["$",""]});function sn(e){return Ae=on(e),Zt=Ae.format,qt=Ae.formatPrefix,Ae}function ln(e){return Math.max(0,-ue(Math.abs(e)))}function cn(e,t){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(ue(t)/3)))*3-ue(Math.abs(e)))}function un(e,t){return e=Math.abs(e),t=Math.abs(t)-e,Math.max(0,ue(t)-ue(e))+1}function st(e,t){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(t).domain(e);break}return this}const kt=Symbol("implicit");function Xt(){var e=new yt,t=[],r=[],n=kt;function i(a){let o=e.get(a);if(o===void 0){if(n!==kt)return n;e.set(a,o=t.push(a)-1)}return r[o%r.length]}return i.domain=function(a){if(!arguments.length)return t.slice();t=[],e=new yt;for(const o of a)e.has(o)||e.set(o,t.push(o)-1);return i},i.range=function(a){return arguments.length?(r=Array.from(a),i):r.slice()},i.unknown=function(a){return arguments.length?(n=a,i):n},i.copy=function(){return Xt(t,r).unknown(n)},st.apply(i,arguments),i}function fn(e){return function(){return e}}function hn(e){return+e}var Dt=[0,1];function le(e){return e}function rt(e,t){return(t-=e=+e)?function(r){return(r-e)/t}:fn(isNaN(t)?NaN:.5)}function dn(e,t){var r;return e>t&&(r=e,e=t,t=r),function(n){return Math.max(e,Math.min(t,n))}}function gn(e,t,r){var n=e[0],i=e[1],a=t[0],o=t[1];return i<n?(n=rt(i,n),a=r(o,a)):(n=rt(n,i),a=r(a,o)),function(l){return a(n(l))}}function mn(e,t,r){var n=Math.min(e.length,t.length)-1,i=new Array(n),a=new Array(n),o=-1;for(e[n]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());++o<n;)i[o]=rt(e[o],e[o+1]),a[o]=r(t[o],t[o+1]);return function(l){var c=Fr(e,l,1,n)-1;return a[c](i[c](l))}}function Qt(e,t){return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())}function pn(){var e=Dt,t=Dt,r=at,n,i,a,o=le,l,c,s;function d(){var h=Math.min(e.length,t.length);return o!==le&&(o=dn(e[0],e[h-1])),l=h>2?mn:gn,c=s=null,f}function f(h){return h==null||isNaN(h=+h)?a:(c||(c=l(e.map(n),t,r)))(n(o(h)))}return f.invert=function(h){return o(i((s||(s=l(t,e.map(n),Je)))(h)))},f.domain=function(h){return arguments.length?(e=Array.from(h,hn),d()):e.slice()},f.range=function(h){return arguments.length?(t=Array.from(h),d()):t.slice()},f.rangeRound=function(h){return t=Array.from(h),r=Jr,d()},f.clamp=function(h){return arguments.length?(o=h?!0:le,d()):o!==le},f.interpolate=function(h){return arguments.length?(r=h,d()):r},f.unknown=function(h){return arguments.length?(a=h,f):a},function(h,m){return n=h,i=m,d()}}function Rt(){return pn()(le,le)}function yn(e,t,r,n){var i=et(e,t,r),a;switch(n=Ve(n??",f"),n.type){case"s":{var o=Math.max(Math.abs(e),Math.abs(t));return n.precision==null&&!isNaN(a=cn(i,o))&&(n.precision=a),qt(n,o)}case"":case"e":case"g":case"p":case"r":{n.precision==null&&!isNaN(a=un(i,Math.max(Math.abs(e),Math.abs(t))))&&(n.precision=a-(n.type==="e"));break}case"f":case"%":{n.precision==null&&!isNaN(a=ln(i))&&(n.precision=a-(n.type==="%")*2);break}}return Zt(n)}function xn(e){var t=e.domain;return e.ticks=function(r){var n=t();return zr(n[0],n[n.length-1],r??10)},e.tickFormat=function(r,n){var i=t();return yn(i[0],i[i.length-1],r??10,n)},e.nice=function(r){r==null&&(r=10);var n=t(),i=0,a=n.length-1,o=n[i],l=n[a],c,s,d=10;for(l<o&&(s=o,o=l,l=s,s=i,i=a,a=s);d-- >0;){if(s=Ke(o,l,r),s===c)return n[i]=o,n[a]=l,t(n);if(s>0)o=Math.floor(o/s)*s,l=Math.ceil(l/s)*s;else if(s<0)o=Math.ceil(o*s)/s,l=Math.floor(l*s)/s;else break;c=s}return e},e}function Jt(){var e=Rt();return e.copy=function(){return Qt(e,Jt())},st.apply(e,arguments),xn(e)}function vn(e,t){e=e.slice();var r=0,n=e.length-1,i=e[r],a=e[n],o;return a<i&&(o=r,r=n,n=o,o=i,i=a,a=o),e[r]=t.floor(i),e[n]=t.ceil(a),e}const We=new Date,Ze=new Date;function D(e,t,r,n){function i(a){return e(a=arguments.length===0?new Date:new Date(+a)),a}return i.floor=a=>(e(a=new Date(+a)),a),i.ceil=a=>(e(a=new Date(a-1)),t(a,1),e(a),a),i.round=a=>{const o=i(a),l=i.ceil(a);return a-o<l-a?o:l},i.offset=(a,o)=>(t(a=new Date(+a),o==null?1:Math.floor(o)),a),i.range=(a,o,l)=>{const c=[];if(a=i.ceil(a),l=l==null?1:Math.floor(l),!(a<o)||!(l>0))return c;let s;do c.push(s=new Date(+a)),t(a,l),e(a);while(s<a&&a<o);return c},i.filter=a=>D(o=>{if(o>=o)for(;e(o),!a(o);)o.setTime(o-1)},(o,l)=>{if(o>=o)if(l<0)for(;++l<=0;)for(;t(o,-1),!a(o););else for(;--l>=0;)for(;t(o,1),!a(o););}),r&&(i.count=(a,o)=>(We.setTime(+a),Ze.setTime(+o),e(We),e(Ze),Math.floor(r(We,Ze))),i.every=a=>(a=Math.floor(a),!isFinite(a)||!(a>0)?null:a>1?i.filter(n?o=>n(o)%a===0:o=>i.count(0,o)%a===0):i)),i}const He=D(()=>{},(e,t)=>{e.setTime(+e+t)},(e,t)=>t-e);He.every=e=>(e=Math.floor(e),!isFinite(e)||!(e>0)?null:e>1?D(t=>{t.setTime(Math.floor(t/e)*e)},(t,r)=>{t.setTime(+t+r*e)},(t,r)=>(r-t)/e):He);He.range;const O=1e3,z=O*60,E=z*60,B=E*24,lt=B*7,At=B*30,qe=B*365,ce=D(e=>{e.setTime(e-e.getMilliseconds())},(e,t)=>{e.setTime(+e+t*O)},(e,t)=>(t-e)/O,e=>e.getUTCSeconds());ce.range;const ct=D(e=>{e.setTime(e-e.getMilliseconds()-e.getSeconds()*O)},(e,t)=>{e.setTime(+e+t*z)},(e,t)=>(t-e)/z,e=>e.getMinutes());ct.range;const Mn=D(e=>{e.setUTCSeconds(0,0)},(e,t)=>{e.setTime(+e+t*z)},(e,t)=>(t-e)/z,e=>e.getUTCMinutes());Mn.range;const ut=D(e=>{e.setTime(e-e.getMilliseconds()-e.getSeconds()*O-e.getMinutes()*z)},(e,t)=>{e.setTime(+e+t*E)},(e,t)=>(t-e)/E,e=>e.getHours());ut.range;const bn=D(e=>{e.setUTCMinutes(0,0,0)},(e,t)=>{e.setTime(+e+t*E)},(e,t)=>(t-e)/E,e=>e.getUTCHours());bn.range;const we=D(e=>e.setHours(0,0,0,0),(e,t)=>e.setDate(e.getDate()+t),(e,t)=>(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*z)/B,e=>e.getDate()-1);we.range;const ft=D(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/B,e=>e.getUTCDate()-1);ft.range;const wn=D(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/B,e=>Math.floor(e/B));wn.range;function ee(e){return D(t=>{t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},(t,r)=>{t.setDate(t.getDate()+r*7)},(t,r)=>(r-t-(r.getTimezoneOffset()-t.getTimezoneOffset())*z)/lt)}const Oe=ee(0),_e=ee(1),Tn=ee(2),Cn=ee(3),fe=ee(4),$n=ee(5),kn=ee(6);Oe.range;_e.range;Tn.range;Cn.range;fe.range;$n.range;kn.range;function te(e){return D(t=>{t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},(t,r)=>{t.setUTCDate(t.getUTCDate()+r*7)},(t,r)=>(r-t)/lt)}const Kt=te(0),ze=te(1),Dn=te(2),An=te(3),he=te(4),Sn=te(5),Un=te(6);Kt.range;ze.range;Dn.range;An.range;he.range;Sn.range;Un.range;const ht=D(e=>{e.setDate(1),e.setHours(0,0,0,0)},(e,t)=>{e.setMonth(e.getMonth()+t)},(e,t)=>t.getMonth()-e.getMonth()+(t.getFullYear()-e.getFullYear())*12,e=>e.getMonth());ht.range;const Ln=D(e=>{e.setUTCDate(1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCMonth(e.getUTCMonth()+t)},(e,t)=>t.getUTCMonth()-e.getUTCMonth()+(t.getUTCFullYear()-e.getUTCFullYear())*12,e=>e.getUTCMonth());Ln.range;const W=D(e=>{e.setMonth(0,1),e.setHours(0,0,0,0)},(e,t)=>{e.setFullYear(e.getFullYear()+t)},(e,t)=>t.getFullYear()-e.getFullYear(),e=>e.getFullYear());W.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:D(t=>{t.setFullYear(Math.floor(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},(t,r)=>{t.setFullYear(t.getFullYear()+r*e)});W.range;const K=D(e=>{e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCFullYear(e.getUTCFullYear()+t)},(e,t)=>t.getUTCFullYear()-e.getUTCFullYear(),e=>e.getUTCFullYear());K.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:D(t=>{t.setUTCFullYear(Math.floor(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},(t,r)=>{t.setUTCFullYear(t.getUTCFullYear()+r*e)});K.range;function Fn(e,t,r,n,i,a){const o=[[ce,1,O],[ce,5,5*O],[ce,15,15*O],[ce,30,30*O],[a,1,z],[a,5,5*z],[a,15,15*z],[a,30,30*z],[i,1,E],[i,3,3*E],[i,6,6*E],[i,12,12*E],[n,1,B],[n,2,2*B],[r,1,lt],[t,1,At],[t,3,3*At],[e,1,qe]];function l(s,d,f){const h=d<s;h&&([s,d]=[d,s]);const m=f&&typeof f.range=="function"?f:c(s,d,f),$=m?m.range(s,+d+1):[];return h?$.reverse():$}function c(s,d,f){const h=Math.abs(d-s)/f,m=nt(([,,F])=>F).right(o,h);if(m===o.length)return e.every(et(s/qe,d/qe,f));if(m===0)return He.every(Math.max(et(s,d,f),1));const[$,P]=o[h/o[m-1][2]<o[m][2]/h?m-1:m];return $.every(P)}return[l,c]}const[Nn,Pn]=Fn(W,ht,Oe,we,ut,ct);function Xe(e){if(0<=e.y&&e.y<100){var t=new Date(-1,e.m,e.d,e.H,e.M,e.S,e.L);return t.setFullYear(e.y),t}return new Date(e.y,e.m,e.d,e.H,e.M,e.S,e.L)}function Qe(e){if(0<=e.y&&e.y<100){var t=new Date(Date.UTC(-1,e.m,e.d,e.H,e.M,e.S,e.L));return t.setUTCFullYear(e.y),t}return new Date(Date.UTC(e.y,e.m,e.d,e.H,e.M,e.S,e.L))}function ge(e,t,r){return{y:e,m:t,d:r,H:0,M:0,S:0,L:0}}function Yn(e){var t=e.dateTime,r=e.date,n=e.time,i=e.periods,a=e.days,o=e.shortDays,l=e.months,c=e.shortMonths,s=me(i),d=pe(i),f=me(a),h=pe(a),m=me(o),$=pe(o),P=me(l),F=pe(l),Y=me(c),_=pe(c),T={a:ae,A:oe,b:G,B:cr,c:null,d:Pt,e:Pt,f:ii,g:gi,G:pi,H:ti,I:ri,j:ni,L:er,m:ai,M:oi,p:ur,q:fr,Q:Ht,s:_t,S:si,u:li,U:ci,V:ui,w:fi,W:hi,x:null,X:null,y:di,Y:mi,Z:yi,"%":Vt},L={a:hr,A:dr,b:gr,B:mr,c:null,d:Yt,e:Yt,f:bi,g:Li,G:Ni,H:xi,I:vi,j:Mi,L:rr,m:wi,M:Ti,p:pr,q:yr,Q:Ht,s:_t,S:Ci,u:$i,U:ki,V:Di,w:Ai,W:Si,x:null,X:null,y:Ui,Y:Fi,Z:Pi,"%":Vt},C={a:I,A:y,b:A,B:k,c:X,d:Ft,e:Ft,f:Rn,g:Lt,G:Ut,H:Nt,I:Nt,j:Zn,L:Qn,m:Wn,M:qn,p:q,q:Bn,Q:Kn,s:ei,S:Xn,u:jn,U:Gn,V:In,w:zn,W:On,x:$e,X:ie,y:Lt,Y:Ut,Z:En,"%":Jn};T.x=p(r,T),T.X=p(n,T),T.c=p(t,T),L.x=p(r,L),L.X=p(n,L),L.c=p(t,L);function p(g,x){return function(v){var u=[],N=-1,w=0,V=g.length,H,R,dt;for(v instanceof Date||(v=new Date(+v));++N<V;)g.charCodeAt(N)===37&&(u.push(g.slice(w,N)),(R=St[H=g.charAt(++N)])!=null?H=g.charAt(++N):R=H==="e"?" ":"0",(dt=x[H])&&(H=dt(v,R)),u.push(H),w=N+1);return u.push(g.slice(w,N)),u.join("")}}function b(g,x){return function(v){var u=ge(1900,void 0,1),N=j(u,g,v+="",0),w,V;if(N!=v.length)return null;if("Q"in u)return new Date(u.Q);if("s"in u)return new Date(u.s*1e3+("L"in u?u.L:0));if(x&&!("Z"in u)&&(u.Z=0),"p"in u&&(u.H=u.H%12+u.p*12),u.m===void 0&&(u.m="q"in u?u.q:0),"V"in u){if(u.V<1||u.V>53)return null;"w"in u||(u.w=1),"Z"in u?(w=Qe(ge(u.y,0,1)),V=w.getUTCDay(),w=V>4||V===0?ze.ceil(w):ze(w),w=ft.offset(w,(u.V-1)*7),u.y=w.getUTCFullYear(),u.m=w.getUTCMonth(),u.d=w.getUTCDate()+(u.w+6)%7):(w=Xe(ge(u.y,0,1)),V=w.getDay(),w=V>4||V===0?_e.ceil(w):_e(w),w=we.offset(w,(u.V-1)*7),u.y=w.getFullYear(),u.m=w.getMonth(),u.d=w.getDate()+(u.w+6)%7)}else("W"in u||"U"in u)&&("w"in u||(u.w="u"in u?u.u%7:"W"in u?1:0),V="Z"in u?Qe(ge(u.y,0,1)).getUTCDay():Xe(ge(u.y,0,1)).getDay(),u.m=0,u.d="W"in u?(u.w+6)%7+u.W*7-(V+5)%7:u.w+u.U*7-(V+6)%7);return"Z"in u?(u.H+=u.Z/100|0,u.M+=u.Z%100,Qe(u)):Xe(u)}}function j(g,x,v,u){for(var N=0,w=x.length,V=v.length,H,R;N<w;){if(u>=V)return-1;if(H=x.charCodeAt(N++),H===37){if(H=x.charAt(N++),R=C[H in St?x.charAt(N++):H],!R||(u=R(g,v,u))<0)return-1}else if(H!=v.charCodeAt(u++))return-1}return u}function q(g,x,v){var u=s.exec(x.slice(v));return u?(g.p=d.get(u[0].toLowerCase()),v+u[0].length):-1}function I(g,x,v){var u=m.exec(x.slice(v));return u?(g.w=$.get(u[0].toLowerCase()),v+u[0].length):-1}function y(g,x,v){var u=f.exec(x.slice(v));return u?(g.w=h.get(u[0].toLowerCase()),v+u[0].length):-1}function A(g,x,v){var u=Y.exec(x.slice(v));return u?(g.m=_.get(u[0].toLowerCase()),v+u[0].length):-1}function k(g,x,v){var u=P.exec(x.slice(v));return u?(g.m=F.get(u[0].toLowerCase()),v+u[0].length):-1}function X(g,x,v){return j(g,t,x,v)}function $e(g,x,v){return j(g,r,x,v)}function ie(g,x,v){return j(g,n,x,v)}function ae(g){return o[g.getDay()]}function oe(g){return a[g.getDay()]}function G(g){return c[g.getMonth()]}function cr(g){return l[g.getMonth()]}function ur(g){return i[+(g.getHours()>=12)]}function fr(g){return 1+~~(g.getMonth()/3)}function hr(g){return o[g.getUTCDay()]}function dr(g){return a[g.getUTCDay()]}function gr(g){return c[g.getUTCMonth()]}function mr(g){return l[g.getUTCMonth()]}function pr(g){return i[+(g.getUTCHours()>=12)]}function yr(g){return 1+~~(g.getUTCMonth()/3)}return{format:function(g){var x=p(g+="",T);return x.toString=function(){return g},x},parse:function(g){var x=b(g+="",!1);return x.toString=function(){return g},x},utcFormat:function(g){var x=p(g+="",L);return x.toString=function(){return g},x},utcParse:function(g){var x=b(g+="",!0);return x.toString=function(){return g},x}}}var St={"-":"",_:" ",0:"0"},U=/^\s*\d+/,Vn=/^%/,Hn=/[\\^$*+?|[\]().{}]/g;function M(e,t,r){var n=e<0?"-":"",i=(n?-e:e)+"",a=i.length;return n+(a<r?new Array(r-a+1).join(t)+i:i)}function _n(e){return e.replace(Hn,"\\$&")}function me(e){return new RegExp("^(?:"+e.map(_n).join("|")+")","i")}function pe(e){return new Map(e.map((t,r)=>[t.toLowerCase(),r]))}function zn(e,t,r){var n=U.exec(t.slice(r,r+1));return n?(e.w=+n[0],r+n[0].length):-1}function jn(e,t,r){var n=U.exec(t.slice(r,r+1));return n?(e.u=+n[0],r+n[0].length):-1}function Gn(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.U=+n[0],r+n[0].length):-1}function In(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.V=+n[0],r+n[0].length):-1}function On(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.W=+n[0],r+n[0].length):-1}function Ut(e,t,r){var n=U.exec(t.slice(r,r+4));return n?(e.y=+n[0],r+n[0].length):-1}function Lt(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.y=+n[0]+(+n[0]>68?1900:2e3),r+n[0].length):-1}function En(e,t,r){var n=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r,r+6));return n?(e.Z=n[1]?0:-(n[2]+(n[3]||"00")),r+n[0].length):-1}function Bn(e,t,r){var n=U.exec(t.slice(r,r+1));return n?(e.q=n[0]*3-3,r+n[0].length):-1}function Wn(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.m=n[0]-1,r+n[0].length):-1}function Ft(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.d=+n[0],r+n[0].length):-1}function Zn(e,t,r){var n=U.exec(t.slice(r,r+3));return n?(e.m=0,e.d=+n[0],r+n[0].length):-1}function Nt(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.H=+n[0],r+n[0].length):-1}function qn(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.M=+n[0],r+n[0].length):-1}function Xn(e,t,r){var n=U.exec(t.slice(r,r+2));return n?(e.S=+n[0],r+n[0].length):-1}function Qn(e,t,r){var n=U.exec(t.slice(r,r+3));return n?(e.L=+n[0],r+n[0].length):-1}function Rn(e,t,r){var n=U.exec(t.slice(r,r+6));return n?(e.L=Math.floor(n[0]/1e3),r+n[0].length):-1}function Jn(e,t,r){var n=Vn.exec(t.slice(r,r+1));return n?r+n[0].length:-1}function Kn(e,t,r){var n=U.exec(t.slice(r));return n?(e.Q=+n[0],r+n[0].length):-1}function ei(e,t,r){var n=U.exec(t.slice(r));return n?(e.s=+n[0],r+n[0].length):-1}function Pt(e,t){return M(e.getDate(),t,2)}function ti(e,t){return M(e.getHours(),t,2)}function ri(e,t){return M(e.getHours()%12||12,t,2)}function ni(e,t){return M(1+we.count(W(e),e),t,3)}function er(e,t){return M(e.getMilliseconds(),t,3)}function ii(e,t){return er(e,t)+"000"}function ai(e,t){return M(e.getMonth()+1,t,2)}function oi(e,t){return M(e.getMinutes(),t,2)}function si(e,t){return M(e.getSeconds(),t,2)}function li(e){var t=e.getDay();return t===0?7:t}function ci(e,t){return M(Oe.count(W(e)-1,e),t,2)}function tr(e){var t=e.getDay();return t>=4||t===0?fe(e):fe.ceil(e)}function ui(e,t){return e=tr(e),M(fe.count(W(e),e)+(W(e).getDay()===4),t,2)}function fi(e){return e.getDay()}function hi(e,t){return M(_e.count(W(e)-1,e),t,2)}function di(e,t){return M(e.getFullYear()%100,t,2)}function gi(e,t){return e=tr(e),M(e.getFullYear()%100,t,2)}function mi(e,t){return M(e.getFullYear()%1e4,t,4)}function pi(e,t){var r=e.getDay();return e=r>=4||r===0?fe(e):fe.ceil(e),M(e.getFullYear()%1e4,t,4)}function yi(e){var t=e.getTimezoneOffset();return(t>0?"-":(t*=-1,"+"))+M(t/60|0,"0",2)+M(t%60,"0",2)}function Yt(e,t){return M(e.getUTCDate(),t,2)}function xi(e,t){return M(e.getUTCHours(),t,2)}function vi(e,t){return M(e.getUTCHours()%12||12,t,2)}function Mi(e,t){return M(1+ft.count(K(e),e),t,3)}function rr(e,t){return M(e.getUTCMilliseconds(),t,3)}function bi(e,t){return rr(e,t)+"000"}function wi(e,t){return M(e.getUTCMonth()+1,t,2)}function Ti(e,t){return M(e.getUTCMinutes(),t,2)}function Ci(e,t){return M(e.getUTCSeconds(),t,2)}function $i(e){var t=e.getUTCDay();return t===0?7:t}function ki(e,t){return M(Kt.count(K(e)-1,e),t,2)}function nr(e){var t=e.getUTCDay();return t>=4||t===0?he(e):he.ceil(e)}function Di(e,t){return e=nr(e),M(he.count(K(e),e)+(K(e).getUTCDay()===4),t,2)}function Ai(e){return e.getUTCDay()}function Si(e,t){return M(ze.count(K(e)-1,e),t,2)}function Ui(e,t){return M(e.getUTCFullYear()%100,t,2)}function Li(e,t){return e=nr(e),M(e.getUTCFullYear()%100,t,2)}function Fi(e,t){return M(e.getUTCFullYear()%1e4,t,4)}function Ni(e,t){var r=e.getUTCDay();return e=r>=4||r===0?he(e):he.ceil(e),M(e.getUTCFullYear()%1e4,t,4)}function Pi(){return"+0000"}function Vt(){return"%"}function Ht(e){return+e}function _t(e){return Math.floor(+e/1e3)}var se,ir;Yi({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});function Yi(e){return se=Yn(e),ir=se.format,se.parse,se.utcFormat,se.utcParse,se}function Vi(e){return new Date(e)}function Hi(e){return e instanceof Date?+e:+new Date(+e)}function ar(e,t,r,n,i,a,o,l,c,s){var d=Rt(),f=d.invert,h=d.domain,m=s(".%L"),$=s(":%S"),P=s("%I:%M"),F=s("%I %p"),Y=s("%a %d"),_=s("%b %d"),T=s("%B"),L=s("%Y");function C(p){return(c(p)<p?m:l(p)<p?$:o(p)<p?P:a(p)<p?F:n(p)<p?i(p)<p?Y:_:r(p)<p?T:L)(p)}return d.invert=function(p){return new Date(f(p))},d.domain=function(p){return arguments.length?h(Array.from(p,Hi)):h().map(Vi)},d.ticks=function(p){var b=h();return e(b[0],b[b.length-1],p??10)},d.tickFormat=function(p,b){return b==null?C:s(b)},d.nice=function(p){var b=h();return(!p||typeof p.range!="function")&&(p=t(b[0],b[b.length-1],p??10)),p?h(vn(b,p)):d},d.copy=function(){return Qt(d,ar(e,t,r,n,i,a,o,l,c,s))},d}function _i(){return st.apply(ar(Nn,Pn,W,ht,Oe,we,ut,ct,ce,ir).domain([new Date(2e3,0,1),new Date(2e3,0,2)]),arguments)}function zi(e){for(var t=e.length/6|0,r=new Array(t),n=0;n<t;)r[n]="#"+e.slice(n*6,++n*6);return r}const ji=zi("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=(e,t)=>{var r;const n=e._$AN;if(n===void 0)return!1;for(const i of n)(r=i._$AO)==null||r.call(i,t,!1),Me(i,t);return!0},je=e=>{let t,r;do{if((t=e._$AM)===void 0)break;r=t._$AN,r.delete(e),e=t}while((r==null?void 0:r.size)===0)},or=e=>{for(let t;t=e._$AM;e=t){let r=t._$AN;if(r===void 0)t._$AN=r=new Set;else if(r.has(e))break;r.add(e),Oi(t)}};function Gi(e){this._$AN!==void 0?(je(this),this._$AM=e,or(this)):this._$AM=e}function Ii(e,t=!1,r=0){const n=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(n))for(let a=r;a<n.length;a++)Me(n[a],!1),je(n[a]);else n!=null&&(Me(n,!1),je(n));else Me(this,e)}const Oi=e=>{e.type==$r.CHILD&&(e._$AP??(e._$AP=Ii),e._$AQ??(e._$AQ=Gi))};class Ei extends Cr{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,r,n){super._$AT(t,r,n),or(this),this.isConnected=t._$AU}_$AO(t,r=!0){var n,i;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(i=this.disconnected)==null||i.call(this)),r&&(Me(this,t),je(this))}setValue(t){if(wr(this._$Ct))this._$Ct._$AI(t,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=t,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}const Re=new WeakMap,be=Tr(class extends Ei{render(e){return gt}update(e,[t]){var r;const n=t!==this.G;return n&&this.G!==void 0&&this.ot(void 0),(n||this.rt!==this.lt)&&(this.G=t,this.ct=(r=e.options)==null?void 0:r.host,this.ot(this.lt=e.element)),gt}ot(e){if(typeof this.G=="function"){const t=this.ct??globalThis;let r=Re.get(t);r===void 0&&(r=new WeakMap,Re.set(t,r)),r.get(this.G)!==void 0&&this.G.call(this.ct,void 0),r.set(this.G,e),e!==void 0&&this.G.call(this.ct,e)}else this.G.value=e}get rt(){var e,t;return typeof this.G=="function"?(e=Re.get(this.ct??globalThis))==null?void 0:e.get(this.G):(t=this.G)==null?void 0:t.value}disconnected(){this.rt===this.lt&&this.ot(void 0)}reconnected(){this.ot(this.lt)}});function Bi(e,t,r){return _i().domain([r-t,r]).range([0,e])}function Wi(e){const t=Bt(e).tickFormat(r=>`${r.getTime()/1e3}`);return J`
    <g 
      class="axis axis--x" 
      ${be(r=>{t(xe(r))})}>
    </g> 
  `}function Zi(e,t){const r=Bt(e).tickSize(-t).tickFormat("");return J`
    <g 
      class="axis-x-grid" 
      ${be(n=>{r(xe(n))})}>
    </g> 
  `}var qi=Object.defineProperty,Xi=Object.getOwnPropertyDescriptor,Te=(e,t,r,n)=>{for(var i=n>1?void 0:n?Xi(t,r):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,r,i):o(i))||i);return n&&i&&qi(t,r,i),i};class de extends Ge{constructor(){super(...arguments),this.value=0,this.color="",this.hide=!1,this.yAxis=0,this.displayName=""}}Te([S({type:Number})],de.prototype,"value",2);Te([S({type:String})],de.prototype,"color",2);Te([S({type:Boolean})],de.prototype,"hide",2);Te([S({type:Number,attribute:"y-axis"})],de.prototype,"yAxis",2);Te([S({type:String,attribute:"display-name"})],de.prototype,"displayName",2);customElements.get("frc-line-chart-data")||customElements.define("frc-line-chart-data",de);var Qi=Object.defineProperty,Ri=Object.getOwnPropertyDescriptor,re=(e,t,r,n)=>{for(var i=n>1?void 0:n?Ri(t,r):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,r,i):o(i))||i);return n&&i&&Qi(t,r,i),i};const Ji=Xt().domain(Array(8).fill(0).map((e,t)=>t)).range(ji),Z=class Ne extends Ge{constructor(){super(...arguments),this.viewTime=10,this.chartTitle="",this.data=[],this.startTime=0,this.elapsedTimeMs=0}firstUpdated(){this.startTime=Date.now(),requestAnimationFrame(()=>{this.updateChart()})}getFilteredData(t){const r=t.findIndex(({timeMs:n})=>this.elapsedTimeMs-n<Math.round(this.viewTime*1e3))-1;return r<0?t:t.slice(r)}updateChart(){this.elapsedTimeMs=Date.now()-this.startTime;const t=[...this.children].filter(r=>r.tagName.toLowerCase()==="frc-line-chart-data");this.data=t.map((r,n)=>{var i;const a=((i=this.data[n])==null?void 0:i.data)??[];return a.push({value:r.value??0,timeMs:this.elapsedTimeMs}),{data:this.getFilteredData(a),color:r.color||Ji(n%8),hide:r.hide??!1,yAxis:r.yAxis??0,displayName:r.displayName||`Data ${n}`}}),requestAnimationFrame(()=>{this.updateChart()})}static getYScale(t,r,n){const{invert:i,lockMin:a,lockMax:o}=n;let{min:l,max:c}=n;(!a||!o)&&r.forEach(d=>{d.data.forEach(({value:f})=>{a||(l=Math.min(l,f)),o||(c=Math.max(c,f))})});const s=i?[0,t]:[t,0];return Jt().domain([l,c]).range(s)}getDimensions(){var t;const r={top:0,right:40,bottom:20,left:40},n=((t=this.chartContainer)==null?void 0:t.getBoundingClientRect())??{width:960,height:500},i=n.width,a=n.height,o=i-r.left-r.right,l=a-r.top-r.bottom;return{margin:r,svgWidth:i,svgHeight:a,width:o,height:l}}getYScales(){const{height:t}=this.getDimensions(),r=[...this.children].filter(n=>n.tagName.toLowerCase()==="frc-line-chart-axis");if(r.length===0){const n={min:-1,max:1,lockMin:!1,lockMax:!1,invert:!1,side:"left",hideGridLines:!1};return[{chartAxis:n,scale:Ne.getYScale(t,this.data.filter(({yAxis:i})=>i===0),n)}]}return r.map((n,i)=>{const a=n,o={min:a.min??-1,max:a.max??1,lockMin:a.lockMin??!1,lockMax:a.lockMax??!1,invert:a.invert??!1,side:a.side??"left",hideGridLines:a.hideGridLines??!1};return{chartAxis:o,scale:Ne.getYScale(t,this.data.filter(({yAxis:l})=>l===i),o)}})}static getPath(t,r,n){return`M${t.map(i=>[r(i).toFixed(3),n(i).toFixed(3)].join(",")).join("L")}`}getLegend(){const t=[...this.children].find(n=>n.tagName.toLowerCase()==="frc-line-chart-legend");if(!t)return{direction:"horizontal",position:"n",inside:!1,hide:!1};const r=t;return{direction:r.direction??"horizontal",position:r.position??"n",inside:r.inside??!1,hide:r.hide??!1}}render(){const{inside:t,position:r,direction:n,hide:i}=this.getLegend(),a=r==="w"||r==="e"||["ne","nw","se","sw"].includes(r)&&n==="vertical",o=a&&["ne","e","se"].includes(r)||!a&&["sw","s","se"].includes(r),l=De({display:t?"block":"flex",flexDirection:`${a?"row":"column"}${o?"-reverse":""}`}),c=t?{width:"100%",height:"100%"}:{flex:"1"};return ke`
      <div class="chart-and-header">
        ${this.chartTitle?ke`<header>${this.chartTitle}</header>`:""}
        <div class="chart-and-legend" style=${l}>
          ${i?"":this.renderLegend()}
          <div class="chart-container" style=${De(c)}>
            ${this.renderChart()}
          </div>
        </div>
      </div>
    `}renderLegend(){const{margin:t}=this.getDimensions(),{inside:r,direction:n,position:i}=this.getLegend(),a=(()=>["n","s","e","w"].includes(i)?"center":i==="nw"?"flex-start":i==="se"?"flex-end":i==="ne"?n==="horizontal"?"flex-end":"flex-start":n==="vertical"?"flex-end":"flex-start")(),o=(()=>{if(!r)return{};const c={alignItems:"center"};return i.includes("n")?c.top=`${t.top}px`:i.includes("s")&&(c.bottom=`${t.bottom}px`),i.includes("w")?c.left=`${t.left}px`:i.includes("e")&&(c.right=`${t.right}px`),["n","s","e","w"].includes(i)&&(c.justifyContent="center"),["n","s"].includes(i)&&(c.left="0",c.right="0"),["e","w"].includes(i)&&(c.top="0",c.bottom="0"),c})(),l=De({alignSelf:a,...o});return ke`
      <div
        class="legend ${r?"inside":"outside"} ${n==="horizontal"?"horizontal":"vertical"}"
        style=${l}
      >
        ${this.data.map(({color:c,displayName:s})=>ke`
            <div class="legend-item">
              <div
                class="legend-item-box"
                style=${De({background:c})}
              ></div>
              <span class="legend-item-label">${s}</span>
            </div>
          `)}
      </div>
    `}renderChart(){const{margin:t,svgWidth:r,svgHeight:n,width:i,height:a}=this.getDimensions(),o=Bi(i,Math.round(this.viewTime*1e3),this.elapsedTimeMs),l=this.getYScales(),c=l.map(s=>d=>Ne.getPath(d,f=>o(new Date(f.timeMs)),f=>s.scale(f.value)));return J`
      <svg width=${r} height=${n} style="position: absolute">
        <g transform="translate(${t.left},${t.top})">
          <defs>
            <clipPath id="clip">
              <rect width=${i} height=${a}></rect>
            </clipPath>
          </defs>
          <g transform="translate(0,${a})">
            ${Wi(o)}
            ${Zi(o,a)}
          </g>
          ${this.renderScales(l,"left")}
          ${this.renderScales(l,"right")}
          <rect class="chart-border" width=${i} height=${a}></rect>
          ${this.data.filter(({hide:s,yAxis:d})=>!s&&d<l.length&&d>=0).map(s=>J`
            <g clip-path="url(#clip)">
              <path 
                class="data-path"
                ${be(d=>{const f=xe(d),h=c[s.yAxis](s.data);f.attr("class","line").attr("stroke",s.color).attr("d",h)})}>
              ></path>
            </g>
          `)}
        </g>
      </svg>
    `}renderScales(t,r){const{width:n}=this.getDimensions();return J`
     ${t.filter(i=>i.chartAxis.side===r).map((i,a)=>{const o=i.chartAxis.side==="left"?-a*25:n;return J`
              <g 
                class="axis axis--y" 
                transform="translate(${o}, 0)"
                ${be(l=>{(i.chartAxis.side==="left"?Mt:Wr)(i.scale)(xe(l))})}>
              </g>
              ${i.chartAxis.hideGridLines?"":J`
                    <g 
                      class="axis-y-grid" 
                      ${be(l=>{Mt(i.scale).tickSize(-n).tickFormat("")(xe(l))})}>
                    </g> 
                  `}
            `})}
    `}};Z.styles=xr`
    :host {
      display: inline-block;
      width: 700px;
      height: 400px;
      color: var(--frc-line-chart-text-color, black);
    }

    .chart-and-header {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .chart-and-header header {
      font-size: 18px;
      font-family: sans-serif;
      margin: 3px 0;
    }

    .chart-and-legend {
      flex: 1;
      width: 100%;
      position: relative;
    }

    .legend-container {
      position: relative;
    }

    .legend {
      display: flex;
      z-index: 100;
    }

    .legend.outside {
      position: relative;
    }

    .legend.inside {
      position: absolute;
    }

    .legend-item {
      display: flex;
      flex-wrap: no-wrap;
      gap: 5px;
      align-items: center;
      padding: 5px;
    }

    .legend.horizontal {
      flex-direction: row;
    }

    .legend.vertical {
      flex-direction: column;
    }

    .legend-item-box {
      width: 15px;
      height: 15px;
    }

    .legend-item-label {
      font-family: sans-serif;
      font-size: 15px;
    }

    .line {
      fill: none;
      stroke-width: 1.5px;
    }

    .chart-border {
      fill: none;
      stroke-width: 1;
      stroke: var(--frc-line-chart-border-color, black);
    }

    .axis-x-grid line,
    .axis-y-grid line {
      stroke: var(--frc-line-chart-grid-color, #eee);
    }

    .axis--y {
      font-family: monospace;
    }

    svg {
      overflow: visible;
    }
  `;re([S({type:Number,attribute:"view-time"})],Z.prototype,"viewTime",2);re([S({type:String,attribute:"chart-title"})],Z.prototype,"chartTitle",2);re([vr()],Z.prototype,"data",2);re([Ie(".data-path")],Z.prototype,"path",2);re([Ie("svg")],Z.prototype,"svg",2);re([Ie(".axis--x")],Z.prototype,"xAxis",2);re([Ie(".chart-container")],Z.prototype,"chartContainer",2);let Ki=Z;customElements.get("frc-line-chart")||customElements.define("frc-line-chart",Ki);var ea=Object.defineProperty,ta=Object.getOwnPropertyDescriptor,ne=(e,t,r,n)=>{for(var i=n>1?void 0:n?ta(t,r):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,r,i):o(i))||i);return n&&i&&ea(t,r,i),i};class Q extends Ge{constructor(){super(...arguments),this.min=-1,this.max=1,this.lockMin=!1,this.lockMax=!1,this.invert=!1,this.side="left",this.hideGridLines=!1}}ne([S({type:Number})],Q.prototype,"min",2);ne([S({type:Number})],Q.prototype,"max",2);ne([S({type:Boolean,attribute:"lock-min"})],Q.prototype,"lockMin",2);ne([S({type:Boolean,attribute:"lock-max"})],Q.prototype,"lockMax",2);ne([S({type:Boolean})],Q.prototype,"invert",2);ne([S({type:String})],Q.prototype,"side",2);ne([S({type:Boolean,attribute:"hide-grid-lines"})],Q.prototype,"hideGridLines",2);customElements.get("frc-line-chart-axis")||customElements.define("frc-line-chart-axis",Q);var ra=Object.defineProperty,na=Object.getOwnPropertyDescriptor,Ee=(e,t,r,n)=>{for(var i=n>1?void 0:n?na(t,r):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,r,i):o(i))||i);return n&&i&&ra(t,r,i),i};const ia=["nw","n","ne","w","e","sw","s","se"];class Ce extends Ge{constructor(){super(...arguments),this.position="n",this.direction="horizontal",this.hide=!1,this.inside=!1}}Ee([S({type:String})],Ce.prototype,"position",2);Ee([S({type:String})],Ce.prototype,"direction",2);Ee([S({type:Boolean})],Ce.prototype,"hide",2);Ee([S({type:Boolean})],Ce.prototype,"inside",2);customElements.get("frc-line-chart-legend")||customElements.define("frc-line-chart-legend",Ce);const sr={viewTime:10,chartTitle:"",dataValue:0,dataColor:"",dataHide:!1,dataYAxis:0,dataDisplayName:"",data2Value:0,data2Color:"",data2Hide:!1,data2YAxis:0,data2DisplayName:"",axisMin:-1,axisMax:1,axisLockMin:!1,axisLockMax:!1,axisInvert:!1,axisSide:"left",axisHideGridLines:!1,axis2Min:-1,axis2Max:1,axis2LockMin:!1,axis2LockMax:!1,axis2Invert:!1,axis2Side:"right",axis2HideGridLines:!1,legendPosition:"n",legendDirection:"horizontal",legendHide:!1,legendInside:!1,theme:"light","background-color":"#fff","--frc-line-chart-text-color":"black","--frc-line-chart-border-color":"black","--frc-line-chart-grid-color":"#eee"},ma={title:"FRC Line Chart/Basic Chart",tags:["autodocs"],component:"frc-line-chart",args:sr,argTypes:{viewTime:{table:{category:"Chart Properties",defaultValue:{summary:10}},control:{type:"number",min:0}},chartTitle:{table:{category:"Chart Properties",defaultValue:{summary:""}}},dataValue:{table:{category:"Data Properties",defaultValue:{summary:0}}},dataColor:{control:"color",table:{category:"Data Properties",defaultValue:{summary:""}}},dataHide:{table:{category:"Data Properties",defaultValue:{summary:!1}}},dataYAxis:{control:"radio",options:[0,1],table:{category:"Data Properties",defaultValue:0}},dataDisplayName:{table:{category:"Data Properties",defaultValue:{summary:""}}},data2Value:{table:{category:"Data 2 Properties",defaultValue:{summary:0}}},data2Color:{control:"color",table:{category:"Data 2 Properties",defaultValue:{summary:""}}},data2Hide:{table:{category:"Data 2 Properties",defaultValue:{summary:!1}}},data2YAxis:{control:"radio",options:[0,1],table:{category:"Data 2 Properties",defaultValue:0}},data2DisplayName:{table:{category:"Data 2 Properties",defaultValue:{summary:""}}},axisMin:{table:{category:"Axis Properties",defaultValue:{summary:-1}}},axisMax:{table:{category:"Axis Properties",defaultValue:{summary:1}}},axisLockMin:{table:{category:"Axis Properties",defaultValue:{summary:!1}}},axisLockMax:{table:{category:"Axis Properties",defaultValue:{summary:!1}}},axisInvert:{table:{category:"Axis Properties",defaultValue:{summary:!1}}},axisSide:{control:"radio",options:["left","right"],table:{category:"Axis Properties",defaultValue:"left"}},axisHideGridLines:{table:{category:"Axis Properties",defaultValue:{summary:!1}}},axis2Min:{table:{category:"Axis 2 Properties",defaultValue:{summary:-1}}},axis2Max:{table:{category:"Axis 2 Properties",defaultValue:{summary:1}}},axis2LockMin:{table:{category:"Axis 2 Properties",defaultValue:{summary:!1}}},axis2LockMax:{table:{category:"Axis 2 Properties",defaultValue:{summary:!1}}},axis2Invert:{table:{category:"Axis 2 Properties",defaultValue:{summary:!1}}},axis2Side:{control:"radio",options:["left","right"],table:{category:"Axis 2 Properties",defaultValue:"right"}},axis2HideGridLines:{table:{category:"Axis 2 Properties",defaultValue:{summary:!1}}},legendPosition:{control:"select",options:ia,table:{category:"Legend Properties",defaultValue:"n"}},legendDirection:{control:"radio",options:["horizontal","vertical"],table:{category:"Legend Properties",defaultValue:"horizontal"}},legendHide:{table:{category:"Legend Properties",defaultValue:{summary:!1}}},legendInside:{table:{category:"Legend Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-line-chart-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-line-chart-border-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-line-chart-grid-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"#eee"}}}},decorators:[(e,t)=>{const n=t.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",i=t.args["background-color"];return ve` <div
        style=${kr({padding:"20px 10px",marginBottom:"5px",background:t.args.theme==="custom"?i:n})}
      >
        ${e()}
      </div>`}]};function aa(e){return e.theme==="custom"?ve`
      <style>
        .custom {
          --frc-line-chart-text-color: ${e["--frc-line-chart-text-color"]};
          --frc-line-chart-border-color: ${e["--frc-line-chart-border-color"]};
          --frc-line-chart-grid-color: ${e["--frc-line-chart-grid-color"]};
        }
      </style>
    `:e.theme==="dark"?ve`
      <style>
        .dark {
          --frc-line-chart-text-color: white;
          --frc-line-chart-border-color: white;
          --frc-line-chart-grid-color: rgba(22, 22, 22, 0.2);
        }
      </style>
    `:ve`
    <style>
      .light {
        --frc-line-chart-text-color: black;
        --frc-line-chart-border-color: black;
        --frc-line-chart-grid-color: #eee;
      }
    </style>
  `}function lr(e={}){return{args:{...sr,...e},render:r=>ve`
      ${aa(r)}
      <frc-line-chart
        class=${r.theme}
        view-time=${r.viewTime}
        chart-title=${r.chartTitle}
      >
        <frc-line-chart-data
          value=${r.dataValue}
          color=${r.dataColor}
          ?hide=${r.dataHide}
          y-axis=${r.dataYAxis}
          display-name=${r.dataDisplayName}
        ></frc-line-chart-data>
        <frc-line-chart-data
          value=${r.data2Value}
          color=${r.data2Color}
          ?hide=${r.data2Hide}
          y-axis=${r.data2YAxis}
          display-name=${r.data2DisplayName}
        ></frc-line-chart-data>
        <frc-line-chart-axis
          min=${r.axisMin}
          max=${r.axisMax}
          ?lock-min=${r.axisLockMin}
          ?lock-max=${r.axisLockMax}
          ?invert=${r.axisInvert}
          side=${r.axisSide}
          ?hide-grid-lines=${r.axisHideGridLines}
        ></frc-line-chart-axis>
        <frc-line-chart-axis
          min=${r.axis2Min}
          max=${r.axis2Max}
          ?lock-min=${r.axis2LockMin}
          ?lock-max=${r.axis2LockMax}
          ?invert=${r.axis2Invert}
          side=${r.axis2Side}
          ?hide-grid-lines=${r.axis2HideGridLines}
        ></frc-line-chart-axis>
        <frc-line-chart-legend
          position=${r.legendPosition}
          direction=${r.legendDirection}
          ?hide=${r.legendHide}
          ?inside=${r.legendInside}
        ></frc-line-chart-legend>
      </frc-line-chart>
    `}}const Se=lr({theme:"light"}),Ue=lr({theme:"dark"});var zt,jt,Gt;Se.parameters={...Se.parameters,docs:{...(zt=Se.parameters)==null?void 0:zt.docs,source:{originalSource:`createLineChartStory({
  theme: 'light'
})`,...(Gt=(jt=Se.parameters)==null?void 0:jt.docs)==null?void 0:Gt.source}}};var It,Ot,Et;Ue.parameters={...Ue.parameters,docs:{...(It=Ue.parameters)==null?void 0:It.docs,source:{originalSource:`createLineChartStory({
  theme: 'dark'
})`,...(Et=(Ot=Ue.parameters)==null?void 0:Ot.docs)==null?void 0:Et.source}}};const pa=["LightTheme","DarkTheme"];export{Ue as DarkTheme,Se as LightTheme,pa as __namedExportsOrder,ma as default};
