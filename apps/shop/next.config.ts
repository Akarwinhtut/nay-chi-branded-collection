import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(appDirectory, "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
