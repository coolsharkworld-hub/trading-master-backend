import { Request, Response } from 'express'
import path from 'path'
import { app, config, init, run } from 'src/system'
import router from './routes'

const bootstrap = async () => {
  await init()
  run()
  load()
}

const load = () => {
  // Load workload
  app.use('/api', router)
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(`${path.resolve('./')}/${config.frontend.bucket}/index.html`)
  })
}

bootstrap().catch(error => {
  console.error(error)
})
