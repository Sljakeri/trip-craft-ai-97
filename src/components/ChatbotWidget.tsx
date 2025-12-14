import { useEffect } from 'react';

declare global {
  interface Window {
    VG_CONFIG: {
      ID: string;
      region: string;
      render: string;
      stylesheets: string[];
      color?: string;
    };
  }
}

const ChatbotWidget = () => {
  useEffect(() => {
    // Add custom styles to override Voiceglow's inline positioning
    const style = document.createElement('style');
    style.textContent = `
      #VG_OVERLAY_CONTAINER {
        left: 16px !important;
        right: unset !important;
      }
    `;
    document.head.appendChild(style);

    // Configure the widget
    window.VG_CONFIG = {
      ID: "7293lniv2pgm1czk",
      region: 'eu',
      render: 'popup',
      color: 'light',
      stylesheets: [
        "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css",
      ],
    };

    // Load the script
    const script = document.createElement("script");
    script.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const container = document.getElementById('VG_OVERLAY_CONTAINER');
      if (container) {
        container.remove();
      }
      script.remove();
      style.remove();
    };
  }, []);

  return <div id="VG_OVERLAY_CONTAINER" className="fixed bottom-4 left-4 z-[9999]" />;
};

export default ChatbotWidget;
