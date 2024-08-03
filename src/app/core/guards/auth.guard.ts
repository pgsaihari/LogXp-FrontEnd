import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const localData = localStorage.getItem("logintoken");
  const router = inject(Router);
  console.log('hg',localData);
  
  if (localData!=null) {
    
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
