const { Router } = require('express');
const { AddEvent, updateEvent, deleteEvent } = require('../controllers/event')


const router = Router();

router.post('/', AddEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent)



module.exports = router;
