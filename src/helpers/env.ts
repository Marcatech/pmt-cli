import path from 'path'

import { envPaths } from '../../../shared/src'

export const loadEnv = (): void => {
  try {
    require('dotenv').config()

    for (const envPath of envPaths) {
      require('dotenv').config({
        path: path.resolve(process.cwd(), envPath),
      })
    }
  } catch {}
}
