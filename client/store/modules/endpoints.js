// determine URL base for production or development environment
let base
if (process.env.NODE_ENV === 'production') {
  // production environment
  base = '/api/v1'
} else {
  // development environment
  // prefix base URL with localhost and port
  // base = 'http://localhost:3037/api/v1'
  // use production REST API
  base = 'https://mm-brand.cxdemo.net/api/v1'
}

const state = {
  endpoints: {
    // This REST API endpoint software version.'
    version: base + '/version',
    // Retrieves the dCloud session config for given session and datacenter (and userId if instant demo).'
    session: base + '/session',
    // Retrieves the brand config.'
    brand: base + '/brand',
    // Retrieves the base demo config.'
    demo: base + '/demo',
    // Sends an email into the demo on behalf of the user.'
    email: base + '/email',
    // Sends an SMS to the user from the demo SMS number.'
    sms: base + '/sms',
    // Sends a request to an agent to call the user back using agent request API for PCCE or UCCX web trigger callback.'
    callback: base + '/callback',
    // Initiates a SocialMiner Task Request. For use with PCCE.'
    task: base + '/task',
    // Context Service REST API middleware, for looking up customers.'
    contextService: base + '/cs',
    // Configuration defaults for demo phone number, email address, feed IDs, etc.'
    defaults: base + '/defaults',
    // ECE chat proxy'
    eceProxy: 'https://mm-ece.cxdemo.net',
    // Sparky - Chat bot interface'
    sparky: 'https://mm-chat.cxdemo.net',
    // Upstream Works chat proxy'
    upstreamProxy: 'https://mm-uwf.cxdemo.net',
    // webex teams guest issuer
    webexGuest: base + '/webex/guest',
    // webex teams agent request
    webexAgent: base + '/webex/agent',
    // multichannel options list
    multichannel: base + '/multichannel'
  }
}

const getters = {
  // REST API endpoints
  endpoints: state => state.endpoints
}

export default {
  state,
  getters
}
