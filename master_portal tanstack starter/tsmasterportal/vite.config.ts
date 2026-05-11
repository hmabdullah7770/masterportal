import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

loadEnv()

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
