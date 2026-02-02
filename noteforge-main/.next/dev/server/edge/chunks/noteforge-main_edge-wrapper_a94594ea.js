(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/noteforge-main_edge-wrapper_a94594ea.js",
"[project]/noteforge-main/edge-wrapper.js { MODULE => \"[project]/noteforge-main/node_modules/.pnpm/next@16.0.3_@babel+core@7.2_a6e7fe7b2107bfd5c9e45031e322c5c3/node_modules/next/dist/esm/build/templates/middleware.js { INNER_MIDDLEWARE_MODULE => \\\"[project]/noteforge-main/middleware.ts [middleware-edge] (ecmascript)\\\" } [middleware-edge] (ecmascript)\" } [middleware-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i('[project]/noteforge-main/node_modules/.pnpm/next@16.0.3_@babel+core@7.2_a6e7fe7b2107bfd5c9e45031e322c5c3/node_modules/next/dist/esm/build/templates/middleware.js { INNER_MIDDLEWARE_MODULE => "[project]/noteforge-main/middleware.ts [middleware-edge] (ecmascript)" } [middleware-edge] (ecmascript)'));
modProm.catch(()=>{});
self._ENTRIES["middleware_middleware"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=noteforge-main_edge-wrapper_a94594ea.js.map