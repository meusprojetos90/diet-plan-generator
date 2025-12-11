"use client"

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface TrackingSettings {
    facebook_pixel_id?: string
    google_analytics_id?: string
    google_tag_manager_id?: string
}

export default function TrackingScripts() {
    const [settings, setSettings] = useState<TrackingSettings>({})

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings/public')
                const data = await res.json()
                if (data.settings) {
                    setSettings(data.settings)
                }
            } catch (error) {
                console.error('Failed to load tracking settings:', error)
            }
        }
        loadSettings()
    }, [])

    return (
        <>
            {/* Google Tag Manager */}
            {settings.google_tag_manager_id && (
                <>
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
                            `
                        }}
                    />
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                </>
            )}

            {/* Google Analytics */}
            {settings.google_analytics_id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="ga-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${settings.google_analytics_id}', {
                                    page_path: window.location.pathname,
                                });
                            `
                        }}
                    />
                </>
            )}

            {/* Facebook Pixel */}
            {settings.facebook_pixel_id && (
                <Script
                    id="fb-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${settings.facebook_pixel_id}');
                            fbq('track', 'PageView');
                        `
                    }}
                />
            )}
        </>
    )
}
