import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(config => ({
    plugins: [
        tailwindcss(),
        {
            ...babel({
                filter: /\.(ts|tsx)$/,
                babelConfig: {
                    presets: ['@babel/preset-typescript'],
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
        },
        reactRouterDevTools(),
        reactRouter(),
        tsconfigPaths(),
    ],
    ssr: {
        noExternal: [/@syncfusion/],
    },
    //added to mitigate https://github.com/remix-run/react-router/issues/12568
    resolve:
        config.command === 'build'
            ? {
                  alias: {
                      'react-dom/server': 'react-dom/server.node',
                  },
              }
            : undefined,
}));
