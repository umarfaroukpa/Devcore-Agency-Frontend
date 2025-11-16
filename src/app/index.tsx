import { useRouter, usePathname } from 'next/navigation';

const router = useRouter();
const pathname = usePathname();

// Navigate programmatically
router.push('/projects');

// Check active route
const isActive = pathname === '/projects';