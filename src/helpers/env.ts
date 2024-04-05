import path from 'path'

import { envPaths } from 'prisma-multi-tenant-shared-updated'

export const loadEnv = (): void => {
  try {
    require('dotenv').config()

    for (const envPath of envPaths) {
      if(envPath)
      require('dotenv').config({
        path: path.resolve(process.cwd(), envPath),
      })
    }
  } catch {}
}
