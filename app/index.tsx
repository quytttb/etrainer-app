import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexRedirect() {
  useEffect(() => {
    // Delay điều hướng sau khi Root Layout đã mount
    const timeout = setTimeout(() => {
      router.replace('/splash');  
    }, 100); 

    return () => clearTimeout(timeout); 
  }, []);  

  return null;  
}
