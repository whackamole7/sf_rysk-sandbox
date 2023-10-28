import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react()
	],
	base: "/",
	css: {
		devSourcemap: true,
	},
	build: {
		chunkSizeWarningLimit: 700,
		rollupOptions: {
			output:{
				manualChunks(id) {
					if (id.includes('node_modules') && !id.includes("viem")) {
						return 'node_modules/' + id.toString().split('node_modules/')[1].split('/')[0].toString();
					}
				}
			}
		}
	}
})
