import { Hono } from 'hono'

import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

app.use('/api/vi/blog/*', async (c, next) => {

  //get the header
  const authHeader = c.req.header('authorization') || "";
  const token = authHeader.split(' ')[1];

  //verify the header
  const response = await verify(token, c.env.JWT_SECRET);
  //if correct we can proceed
  if (response.id) {
    await next();
  } else {
    //if not then return 403 status code
    c.status(403);
    return c.json({
      error: 'Unauthorized',
    });
  }

  await next();
})

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog", blogRouter);






app.get('/', (c) => {
  return c.text('Hello Hono!')
})



export default app
