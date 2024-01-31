import { Router } from 'express'

const route = Router()
route.get('/', (req, res) => {
    const user = req.cookies
    res.json({ message: `votre requête est passée GET ! bonjour: ${user}` })
})

route.post('/', (req, res) => {
    const user = req.cookies
    res.json({ message: `votre requête est passée POST ! bonjour: ${user}` })
})

export default route
