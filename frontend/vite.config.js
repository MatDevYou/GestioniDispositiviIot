import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': 'http://flask-app:5000'
    }
  }
})
// This configuration sets up a Vite project with React and proxies requests to the Flask backend for the `/users` endpoint.