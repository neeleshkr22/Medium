import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

app.use('/api/vi/blog/*',async (c, next)=>{

  //get the header
  const authHeader = c.req.header('authorization') || "";

  const token = authHeader.split(' ')[1];

  //verify the header
  const response = await verify(token, c.env.JWT_SECRET);
  //if correct we can proceed
  if(response.id){
    await next();
  }else{
    //if not then return 403 status code
    c.status(403);
    return c.json({
      error: 'Unauthorized',
    });
  }

  await next();
})

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try{
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    })
    const token  = sign({ userId: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt:token,
    })
  }catch(error){
    c.status(403);
    return c.json({
      error: 'error while creating user',
    })
  }
})

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
  
  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!user) {
    c.status(404);
    return c.json({
      error: 'User not found',
    });
  }
  const jwt = await sign({id:user.id}, c.env.JWT_SECRET);
  return c.json({
    jwt,
  });
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
