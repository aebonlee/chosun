import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(chosun.dreamitbiz.com)이므로 base는 '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
