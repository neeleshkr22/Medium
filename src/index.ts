import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  await prisma.user.create({
    data:{
      email: body.email,
      password: body.password,
    },
  })
  return c.text('Signup endpoint')
})

app.post('/api/v1/signin', (c) => {
  return c.text('Signin endpoint')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Blog endpoint')
})

app.put('/api/v1/blog/:id', (c) => {
  return c.text(`Update blog with ID: ${c.req.param('id')}`)
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text(`Get blog with ID: ${c.req.param('id')}`)
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})



export default app
