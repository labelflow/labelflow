// /* eslint-disable no-restricted-globals */
// const importClassicScript = (url) => {
//   const script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = url;
//   script.async = false;
//   const p = new Promise((resolve) => {
//     script.onload = resolve;
//   });
//   document.body.appendChild(script);
//   return p;
// };

// @ts-ignore
import Vips from "wasm-vips";

globalThis.Module =
  typeof globalThis.Module !== "undefined" ? globalThis.Module : {};

export const getVips = async () => {
  const initRuntime = (async () => {
    const p = new Promise((resolve) => {
      // @ts-ignore
      globalThis.Module.onRuntimeInitialized = resolve;
    });
    if (globalThis && globalThis.document) {
      // In window
      // await importClassicScript("static/wasm-vips/vips.js");
      console.log("No vips in window");
    } else if (globalThis && globalThis.importScripts) {
      // In worker
      // Sync.
      // importScripts("http://localhost:3000/static/wasm-vips/vips.js");
      console.log("No vips in worker");
    } else {
      // In node
      // @ts-ignore
      // globalThis.Vips = await import("wasm-vips");
    }
    return p;
  })();
  await initRuntime;
  // const vips = await globalThis.Vips();
  const vips = await Vips();
  return vips;
};
