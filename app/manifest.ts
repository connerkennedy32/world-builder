import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'World Builder',
        short_name: 'World Builder',
        description: 'Build your world here!',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/384x384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}