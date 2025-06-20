import { Hono } from "hono";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
    
}>();

blogRouter.post('/', (c) => {
  return c.text('Blog endpoint')
})

blogRouter.put('/', (c) => {
  return c.text(`Update blog with ID: ${c.req.param('id')}`)
})

blogRouter.get('/', (c) => {
  return c.text(`Get blog with ID: ${c.req.param('id')}`)
})

blogRouter.get('/bulk',(c)=>{
    return c.text('Get all blogs')
})