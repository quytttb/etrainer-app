import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexRedirect() {
  useEffect(() => {
    // Delay điều hướng sau khi Root Layout đã mount
    const timeout = setTimeout(() => {
      router.replace('/splash');  // Hoặc router.replace('/login')
    }, 100); // Thực hiện sau 100ms (hoặc điều chỉnh tùy ý)

    return () => clearTimeout(timeout); // Hủy timeout khi component unmount
  }, []);  // Chạy chỉ một lần khi component mount

  return null;  // Không cần render gì khi đang chuyển hướng
}
