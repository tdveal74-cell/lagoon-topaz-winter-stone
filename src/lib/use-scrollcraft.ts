import { useEffect } from "react";

export function useScrollCraft(rootId: string) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    let cancelled = false;

    const mount = () => {
      if (cancelled || !window.ScrollCraft) return;
      window.ScrollCraft.instances.length = 0;
      window.ScrollCraft.mount(root);
    };

    if (window.ScrollCraft) {
      mount();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="/scrollcraft/scrollcraft.js"]',
      );
      if (existing) {
        existing.addEventListener("load", mount);
      } else {
        const script = document.createElement("script");
        script.src = "/scrollcraft/scrollcraft.js";
        script.async = false;
        script.onload = mount;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [rootId]);
}
