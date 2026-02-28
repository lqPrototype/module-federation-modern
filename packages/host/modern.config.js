"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_tools_1 = require("@modern-js/app-tools");
const modern_js_v3_1 = require("@module-federation/modern-js-v3");
// https://modernjs.dev/en/configure/app/usage
exports.default = (0, app_tools_1.defineConfig)({
    server: {
        port: 8080,
    },
    source: {
        transformImport: [
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css',
            },
        ],
    },
    plugins: [(0, app_tools_1.appTools)(), (0, modern_js_v3_1.moduleFederationPlugin)()],
});
