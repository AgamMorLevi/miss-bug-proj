import express from 'express' 
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js' 
import { authService } from './services/auth.servic.js'


const app = express() 

//Express config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) 

//express routing

// REST API for bugs
app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

   bugService.query(queryOptions)
   .then(bugs => res.send(bugs))
   .catch(err => {
    loggerService.error('Cannot get bugs', err)
    res.status(400).send('Cannot load bugs')
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}

}) 

//POST - add new bug
app.post('/api/bug', (req, res) => {

    const bugToSave = req.body 

    bugService.save(bugToSave)
    .then(savedBug => {res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot add bug', err)
        res.status(400).send('Cannot add bug')
    })
})


//PUT - update bug
app.put('/api/bug/:bugId', (req, res) => {
id
    const bugToSave = req.body

    bugService.save(bugToSave)
    .then(savedBug => {res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot update bug', err)
        res.status(400).send('Cannot update bug')
    })
})


//get by  + visit count
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap =[] } = req.cookies

    if (visitCountMap.length >= 3) return res.status(400).send('Wait for 10 sec') //the msg will show at the network
    if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)   

    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 }) // after 10 sec it will remove from the browser

 //get by id 
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot load bug')
        })

}) 

//remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(() => res.send(bugId + ' bug Removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })


}) 

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

//User API
app.get('/api/user', (req, res) => {
    userService.query()
    .then(users => res.send(users))
    .catch(err => {
        loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot load users')
    })
})  

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})


// Aunt API
app.post('/api/auth/signup', (res, req) => {
    const credential = req.body

    userService.save(credential)
    .then(user=>{
        if(user){
            const loginToken = authService.getLoginToken(user)
            res.cookies('loginToken', loginToken) 
            res.send(user)

        }else{
            res.status(400).send('Cannot signup')
        }
    })
})

app.post('/api/auth/login', (req, res) => {
  const credential = req.body

  authService.checkLogin(credential)
    .then(user => {
        if (user) {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken) 
            res.send(user)
        } else {
            res.status(401).send('Cannot login')
        }
    })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})
