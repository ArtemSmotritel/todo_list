function RestfulRoutes(router, controller) {
    let listId;
    router.all('*', (req, res, next) => {
        if (req.query.listId) {
            listId = +req.query.listId;
        } else {
            listId = +req.originalUrl.split('/')[2]; //getting listId param from /lists/:listId/tasks
        }
        next();
    })
    router.get('/', async (req, res) => {
        try {
            const done = req.query.all == 'true';
            const data = await controller.find(listId, done);            
            res.json(data);
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
    router.get('/:id', async (req, res) => {
        try {
            const data = await controller.findById(req.params.id);
            if (data) {
                res.json(data);
            } else {
                res.status(404).json('Error');
            }            
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
    router.post('/', async (req, res) => {
        try {
            const data = await controller.create(listId, req.body);
            res.status(201).json(data);            
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
    router.patch('/:id', async (req, res) => {
        try {
            const data = await controller.partialUpdateById(req.params.id, req.body);
            res.json(data);
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
    router.put('/:id', async (req, res) => {
        try {
            const data = await controller.replaceById(req.params.id, req.body);
            res.json(data);            
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
    router.delete('/:id', async (req, res) => {
        try {
            await controller.deleteById(req.params.id);
            res.status(204).json('OK');            
        } catch (error) {
            res.status(500).json('something went very wrong...')
        }
    })
}

module.exports = RestfulRoutes;