import{a as O}from"./chunk-7R3FD7XB.js";import{a as L,b as N,c,d as W}from"./chunk-LBDTBMT6.js";import"./chunk-MOL5YHFZ.js";import{a as U}from"./chunk-RZXOIYP6.js";import"./chunk-YPGXW24G.js";import{a as M}from"./chunk-NOU4FTAX.js";import{E,M as A,N as I,ka as X,la as F,v as u}from"./chunk-SUTMR7BC.js";import{Db as l,Hb as C,Ib as P,Jb as w,Kb as k,Lb as T,Pa as g,Qa as f,_ as x,gb as h,mb as r,nb as a,ob as p,tb as d}from"./chunk-XTY2SKW2.js";import{g as B}from"./chunk-66YHNWRR.js";var D=B(W());var te=(()=>{class m{messageService;userService;displayPopup=!1;constructor(o,e){this.messageService=o,this.userService=e}showPopup(){this.displayPopup=!0}triggerFileInput(){document.getElementById("fileInput").click()}onFileSelected(o){let e=o.target;if(e.files&&e.files.length>0){let t=e.files[0];this.readFile(t)}}readFile(o){let e=new FileReader;e.onload=t=>{let n=new Uint8Array(t.target.result);this.processExcel(n)},e.readAsArrayBuffer(o)}processExcel(o){let e=L(o,{type:"array"}),t=e.SheetNames[0],n=e.Sheets[t],b=c.sheet_to_json(n,{header:1}).slice(1).map((i,j)=>{let _=i[0]?.toString().trim(),S=i[1]?.toString().trim(),v=i[2]?.toString().trim(),z=i[3]?.toString().toLowerCase()==="true",y=Number(i[4])||0;return!_||!S||!v||y===0?(console.error(`Row ${j+2} contains invalid data:`,i),null):{userId:_,name:S,email:v,isActive:!0,batchId:y,role:"trainee"}}).filter(i=>i!==null);if(b.length===0){this.showError(new Error("No valid data found in Excel sheet."));return}this.userService.addUsers(b).subscribe({next:()=>this.showSuccess(),error:i=>this.showError(i)}),this.displayPopup=!1}showSuccess(){this.messageService.add({severity:"success",summary:"Success",detail:"Excel sheet uploaded and users added successfully!"})}showError(o){this.messageService.add({severity:"error",summary:"Error",detail:`Failed to upload users: ${o.message}`})}downloadTemplate(){let o=[["User ID","Name","Email","Is Active (true/false)","Batch ID"]],e=c.aoa_to_sheet(o),t=c.book_new();c.book_append_sheet(t,e,"User Template");let n=N(t,{bookType:"xlsx",type:"array"}),s=new Blob([n],{type:"application/octet-stream"});(0,D.saveAs)(s,"User_Template.xlsx")}static \u0275fac=function(e){return new(e||m)(f(u),f(U))};static \u0275cmp=x({type:m,selectors:[["app-add-trainees-page"]],standalone:!0,features:[k([u]),T],decls:25,vars:4,consts:[[1,"enter-trainee-details"],[1,"upload-container"],["type","file","id","fileInput","accept",".xlsx, .xls",2,"display","none",3,"change"],[1,"open-popup-button",3,"click"],[1,"pi","pi-cog"],["header","Upload trainee details",3,"visibleChange","visible","modal","closable"],[2,"font-size","small"],[1,"popup-options"],[1,"info-icon-container"],[1,"tooltip-content"],["href","javascript:void(0);",2,"color","var(--primary-color)","font-size","small",3,"click"],[1,"upload-button",3,"click"],[1,"pi","pi-upload"],[1,"formui"],[3,"bdColor"]],template:function(e,t){e&1&&(p(0,"p-toast"),r(1,"div",0)(2,"h3"),l(3,"Add New Trainee"),a(),r(4,"div",1)(5,"p"),l(6,"Upload an Excel sheet with the trainee data for bulk entry."),a(),r(7,"input",2),d("change",function(s){return t.onFileSelected(s)}),a(),r(8,"button",3),d("click",function(){return t.showPopup()}),p(9,"i",4),l(10," Upload sheet "),a()(),r(11,"p-dialog",5),w("visibleChange",function(s){return P(t.displayPopup,s)||(t.displayPopup=s),s}),r(12,"p",6),l(13,"Please download the template"),a(),r(14,"div",7)(15,"div",8)(16,"div",9)(17,"a",10),d("click",function(){return t.downloadTemplate()}),l(18,"Download Template"),a()()(),r(19,"button",11),d("click",function(){return t.triggerFileInput()}),p(20,"i",12),l(21," Upload Sheet "),a()()(),r(22,"div",13),p(23,"app-form"),a()(),p(24,"ngx-spinner",14)),e&2&&(g(11),C("visible",t.displayPopup),h("modal",!0)("closable",!0),g(13),h("bdColor","rgba(0, 0, 0, 0.8)"))},dependencies:[I,A,F,X,M,E,O],styles:[".enter-trainee-details[_ngcontent-%COMP%]{padding:20px;border-radius:5px}.upload-container[_ngcontent-%COMP%]{display:flex;gap:10%;margin-bottom:10px;justify-content:space-around;align-items:center;background-color:#fff;padding:10px;border:1px solid #ddd;border-radius:5px}.upload-button[_ngcontent-%COMP%], .download-template-button[_ngcontent-%COMP%]{background-color:#f44336;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer}.open-popup-button[_ngcontent-%COMP%]{background-color:#f44336;color:#fff;border:none;padding:10px 20px;cursor:pointer;border-radius:5px;margin-top:10px}[_ngcontent-%COMP%]:hover.open-popup-button{background-color:var(--secondary-color)}.upload-button[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-right:5px}.formui[_ngcontent-%COMP%]{height:fit-content;gap:10px}h3[_ngcontent-%COMP%]{padding:0%;margin-top:-10px}.popup-options[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:20px}.info-icon-container[_ngcontent-%COMP%]{display:flex;gap:5px}"]})}return m})();export{te as AddTraineesPageComponent};