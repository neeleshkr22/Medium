import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId : string;
    }
    
}>();

blogRouter.use('/*',async (c,next)=>{
    //extraxt userId and passed it down to blog handler
    const authHeader = c.req.header('authorization') || "";
    const user = verify(authHeader, c.env.JWT_SECRET);
    if(user){
        //@ts-ignore
        c.set("userId", user.id);
        next();
    }else{
        c.status(403);
        return c.json({
            error: 'Unauthorized',
        });
    }
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const authorId = c.get("userId");

  const blog = await prisma.blog.create({
    data:{
        title: body.title,
        content: body.content,
        authorId: body.authorId, 
    }
  })


  return c.json({
    id: blog.id,
  })
})

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  

  const blog = await prisma.blog.Update({
    where:{
        id: body.id,
    },
    data:{
        title: body.title,
        content: body.content,
    }
  })


  return c.json({
    id: blog.id,
  })

})

blogRouter.get('/',async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const blog = await prisma.blog.findUnique({
    where:{
        id: body.id,
    },
    data:{
        title: body.title,
        content: body.content,
        authorId: body.authorId, 
    }
  })


  return c.json({
    id: blog.id,
  })
  
})

blogRouter.get('/bulk',async (c)=>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = prisma.blog.findMany();
    
    return c.json({
        blogs,
    })
})