const { Tickets, Users, Events } = require("../db.js");


async function getTickets(req, res, next) {

    let { idUser } = req.query

    try {
        console.log('IDDDDDDDDDDDDDDDDDDDDDDDD', idUser)
        const dataBase = await Tickets.findAll({
            where: {
                userId: idUser
            },
            include: [
                {
                    model: Events
                },
                {
                    model: Users
                }
            ]
        });
        if (dataBase.length > 0) return res.send(dataBase);
        else {
            res.send([])
        }

    } catch (error) {
        next(error)
    }
}

async function updateTickets(req, res, next) {
    let id = req.params.id;

    const { propietario } = req.body;

    try {
        await Tickets.update(
            {
                propietario
            },
            {
                where: {
                    id: id,
                },
            }
        );

        let ticketUpdated = await Tickets.findByPk(id);
        res.json(ticketUpdated)

    } catch (error) {
        next(error)
    }
}

async function postTickets(req, res, next) { // User.addTickets(ticket)  Events.addTickets(ticket)

    let { cantidad, userId, eventId } = req.body;

    try {

        const user = await Users.findOne({
            where: {
                id: userId
            }

        });

        const event = await Events.findOne({
            where: {
                id: eventId
            }
        });

        // await Events.update({
        //     {
        //         availableTickets: availableTickets - cantidad
        //     },
        //     where: {
        //         id: eventId
        //     }
        // })

        while (cantidad > 0) {


            const createdTicket = await Tickets.create({
                propietario: user.fullName
            });
            await user.addTickets(createdTicket);


            await event.addTickets(createdTicket);

            cantidad--;

        }

        res.send('ticket creado correctamente');

    } catch (error) {
        next(error)
    }

}

async function updateAvailable(req, res, next) {
    let { id } = req.query;

    const {
        cantidad
    } = req.body;

    try {
        await Events.update(
            {
                availableTickets: availableTickets - cantidad

            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.json('available Tickets updated')

    } catch (error) {
        next(error)
    }
}




module.exports = {
    getTickets,
    updateTickets,
    postTickets,
};
