import { defineConfig } from "vite"
import { wasp } from "wasp/client/vite"

export default defineConfig({
  plugins: [wasp()],
  test: {
    exclude: ["e2e/**", "node_modules/**", ".wasp/**"],
  },
})
