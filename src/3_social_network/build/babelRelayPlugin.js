const getbabelRelayPlugin = require('babel-relay-plugin')
const schema = require('../../../schema/schema.json')

module.exports = getbabelRelayPlugin(schema.data)
