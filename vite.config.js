import { defineConfig } from "vite";

// Relative base: the same build works at a domain root and under a
// project path such as https://<user>.github.io/<repo>/ on GitHub Pages.
export default defineConfig({
  base: "./",
});
