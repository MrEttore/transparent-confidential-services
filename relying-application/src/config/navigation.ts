import { CloudUpload, SearchCheck } from 'lucide-react';

import { NavigationItem } from '../types/navigation';

export const navigationItems: NavigationItem[] = [
    { icon: CloudUpload, name: 'Data Sharing', to: '/app/data-sharing' },
    {
        icon: SearchCheck,
        name: 'Attestation',
        to: '/app/attestation',
    },
];
