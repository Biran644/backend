const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const competitorSchema = require('../schemas/competitor');

class competitorStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(competitorSchema);
        const dbPath = `${process.cwd()}/competitorData.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    validate(data) {
        return this.schemaValidator(data);
    }

    create(data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.insert(data);
        }
    }

    read(_id) {
        return this.db.findOne({_id}).exec()
    }

    readAll() {
        return this.db.find()
    }

    update(_id, data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.update({_id}, {$set: data});
        }
    }

    delete(_id) {
        return this.db.remove({_id});
    }

    deleteAll() {
        return this.db.remove({}, {multi: true});
    }


}
module.exports = new competitorStore();
