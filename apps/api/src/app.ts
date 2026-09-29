import { Hono } from 'hono'
import { type HonoBindings, type HonoVariables } from '@mastra/hono'
import { cors } from 'hono/cors'
import { logger } from "hono/logger";

export const app = new Hono<{ Bindings: HonoBindings; Variables: HonoVariables }>()
  .use(cors({
    origin: '*',
    credentials: true,
  }))
  .use(logger()).get('/', c => {
  return c.text('Hello Hono!')
})

export type AppType = typeof app;