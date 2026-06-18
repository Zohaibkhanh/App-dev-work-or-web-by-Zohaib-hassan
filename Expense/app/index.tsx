import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, redirect to login
    // In a real app, you'd check authentication state here
    // Delay navigation to ensure Root Layout is mounted
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}

