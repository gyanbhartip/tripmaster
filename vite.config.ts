import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(config => ({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
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
