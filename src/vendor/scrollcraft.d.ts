export {};

declare global {
  interface Window {
    ScrollCraft: {
      mount: (root?: Document | HTMLElement) => { layout: () => void; read: () => void };
      reduce: boolean;
      instances: unknown[];
    };
  }
}
