/// <reference types="vite/client" />

// eslint-disable-next-line
// declare module '*.vue' {

//   const component: DefineComponent<{}, {}, any>
//   export default component
// }
declare module "*.vue";

declare module "vue-video-player";

declare module "version";

declare module "@vitejs/plugin-legacy";

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_API_BASE_URL: string;
  readonly VITE_BUILD_SOURCEMAP: string;
  readonly VITE_BUILD_DROP_CONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
