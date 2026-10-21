/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Google Apps Script web app URL that receives feedback (see docs/feedback-setup.md)
  readonly VITE_FEEDBACK_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
