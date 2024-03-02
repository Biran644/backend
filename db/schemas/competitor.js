const competitorSchema = {
    type: 'object',
    properties: {
        number: {
            type: 'number',
        },
        horse: {
            type: 'string',
        },
        rider: {
            type: 'string',
        },
        owner: {
            type: 'string',
        },
        year: {
            type: 'number',
        },
        city: {
            type: 'string',
        },
        class: {
            type: 'number',
        },
        time1: {
            type: 'number',
        },
        faults1: {
            type: 'number',
        },
        time2: {
            type: 'number',
        },
        faults2: {
            type: 'number',
        },
    },
};

module.exports = competitorSchema;