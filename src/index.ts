import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/signup',(c)=>{
  return c.text('Signup endpoint')
})

app.post('/api/v1/signin',(c)=>{
  return c.text('Signin endpoint')
})

app.post('/api/v1/blog',(c)=>{
  return c.text('Blog endpoint')
})

app.put('/api/v1/blog/:id',(c)=>{
  return c.text(`Update blog with ID: ${c.req.param('id')}`)
})

app.get('/api/v1/blog/:id',(c)=>{
  return c.text(`Get blog with ID: ${c.req.param('id')}`)
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})



export default app
