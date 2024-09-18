import{F as s,a as d,b as p}from"./chunk-SUTMR7BC.js";import{Q as n,V as o,k as c,l,o as u,x as i}from"./chunk-XTY2SKW2.js";var E=(()=>{class e{http;apiUrl=s.apiUrl+"/trainee";constructor(t){this.http=t}getTrainees(){return this.http.get(this.apiUrl).pipe(u(t=>t.trainees))}getTraineesCount(t){let r=`${this.apiUrl}/active-count?batchId=${t}`;return this.http.get(r)}getTraineeByEmployeeCode(t){let r=`${this.apiUrl}/${t}`;return this.http.get(r)}addTrainee(t){return this.http.post(`${this.apiUrl}/add-trainee`,t)}addTrainees(t){let r=new d({"Content-Type":"application/json"});return this.http.post(this.apiUrl,t,{headers:r})}updateTrainee(t,r){let a=`${this.apiUrl}/${t}`;return this.http.put(a,r).pipe(i(h=>(console.error("Error updating trainee:",h),l(()=>new Error(h.message||"Server error")))))}updateTraineeStatus(t,r){let a=`${this.apiUrl}/${t}/status`;return this.http.patch(a,{isActive:r})}deleteTrainee(t){let r=`${this.apiUrl}/${t}`;return this.http.delete(r)}static \u0275fac=function(r){return new(r||e)(o(p))};static \u0275prov=n({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var j=(()=>{class e{http;apiUrl=s.apiUrl+"/batch";constructor(t){this.http=t}getBatches(){return this.http.get(this.apiUrl).pipe(i(this.handleError("getBatches",[])))}addBatch(t){return this.http.post(this.apiUrl,t)}deleteBatch(t){return this.http.delete(`${this.apiUrl}/delete/${t}`).pipe(i(this.handleError("deleteBatch",!1)))}updateBatch(t,r){return this.http.put(`${this.apiUrl}/update/${t}`,r).pipe(i(this.handleError("updateBatch",!1)))}handleError(t="operation",r){return a=>(console.error(`${t} failed: ${a.message}`),c(r))}static \u0275fac=function(r){return new(r||e)(o(p))};static \u0275prov=n({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();export{E as a,j as b};