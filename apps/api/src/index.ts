import 'dotenv/config'
import { serve } from '@hono/node-server'
import { MastraServer } from '@mastra/hono'
import { mastra } from './mastra/index.js'
import { app } from './app.js'

const server = new MastraServer({ app, mastra })

await server.init()

serve(
  {
    fetch: app.fetch,
    port: 4111,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
