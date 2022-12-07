const t=t=>new Promise((e=>{setTimeout((()=>{e(void 0)}),t||100)}));
/*
 * @Author: 赵治林
 * @Description: "indexDB操作类"
 * @Date: 2022-11-14 15:50:25
 * @Last Modified by: 赵治林
 * @Last Modified time: 2022-11-18 14:23:22
 */
class e{dbName="Logger";version=1;storeName="Logger";request;db;constructor(){this.request=indexedDB.open(this.dbName,this.version),this.init()}init(){this.request.onsuccess=t=>{this.db=t.target.result},this.request.onupgradeneeded=t=>{this.db=t.target.result,this.db.objectStoreNames.contains(this.storeName)||this.db.createObjectStore(this.storeName,{keyPath:"id"})}}async get(e){await t();const s=this.db.transaction([this.storeName]).objectStore(this.storeName).get(e);return new Promise((t=>{s.onsuccess=function(){t(s.result)}}))}async add(e){await t();this.db.transaction([this.storeName],"readwrite").objectStore(this.storeName).add(e).onerror=function(t){throw new Error(t.target.error)}}async put(e){await t();this.db.transaction([this.storeName],"readwrite").objectStore(this.storeName).put(e).onerror=function(t){throw new Error(t.target.error)}}async delete(e){await t(),this.db.transaction([this.storeName],"readwrite").objectStore(this.storeName).delete(e)}}
/*
 * @Author: 赵治林
 * @Description: "控制台日志输出类"
 * @Date: 2022-11-14 14:08:55
 * @Last Modified by: 赵治林
 * @Last Modified time: 2022-12-07 11:32:08
 */class s{static showLogger="true"===sessionStorage.showLogger;static allowApis=sessionStorage.allowApis?JSON.parse(sessionStorage.allowApis):[];static store=new e;static getStackTrace(t){const e={};Error.captureStackTrace(e,t);const s=/(?<urlString>http:\/\/\S+\d+:\d+).*/u.exec(e.stack)?.groups?.urlString||"";if(!s)return"[-]";const o=new URL(s),{pathname:r}=o,a=o.searchParams.get("t")?.split(":")||[];return`[${(t=>{let e=new Date(t);const s=t.toString().length;if(s<13){let o=13-s;o=10**o,e=new Date(t*o)}const o=`${e.getFullYear()}-`;let r=e.getMonth()+1;r=`${r<10?`0${r}`:r}-`;let a=e.getDate();a=`${a<10?`0${a}`:a} `;let n=e.getHours();n=`${n<10?`0${n}`:n}:`;let i=e.getMinutes();i=`${i<10?`0${i}`:i}:`;let c=e.getSeconds();return c=c<10?`0${c}`:c,o+r+a+n+i+c})(Number(a[0]))}][${r}][${`${a[1]}:${a[2]}`}]`}static async saveLog(...t){const e=await s.store.get("Logger.log");let o=e?.content||"",r="";t.forEach((t=>{r+="object"==typeof t?`${JSON.stringify(t)} `:`${t} `})),o=(o+r).slice(0,-1);const a={id:"Logger.log",content:`${o}\n`};return e?s.store.put(a):s.store.add(a),r}static async log(...t){const e=s.getStackTrace(s.log);return s.showLogger&&
// eslint-disable-next-line no-console
console.log(`%c${e}:\n`,"color:blue",...t),s.saveLog(e,...t)}static async export(){const t=(await s.store.get("Logger.log"))?.content;if(t){const e=new Blob([t],{type:"text/plain"});((t,e)=>{const s=document.createElement("a");s.download=e||"",s.target="_blank",s.style.display="none",s.href=t,document.body.appendChild(s),s.click(),document.body.removeChild(s)})(window.URL.createObjectURL(e),"邮件系统前端日志文件")}}static setShowLogger(t){s.showLogger=t,sessionStorage.showLogger=t}static async apiLog(t,e,o){const r=s.getStackTrace(s.apiLog);return s.allowApis.some((t=>e.includes(t)))&&
// eslint-disable-next-line no-console
console.log(`%c${r}:\n`,"color:blue",`${e} RequestParam:\n`,o,`\n ${e} ResponseData:\n`,t),s.saveLog(r,`ResponseData ${e}:\n`,t)}static setAllowApis(t){if(!t)throw Error("require 1 array params!");s.allowApis=t,sessionStorage.allowApis=JSON.stringify(s.allowApis)}}window.Logger=s;export{s as default};
