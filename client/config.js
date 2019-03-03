// determine initial REST API endpoint
let endpoint
let loginEndpoint
let instanceEndpoint
if (process.env.NODE_ENV === 'production') {
  endpoint = '/api/v1/endpoints'
} else {
  endpoint = 'http://localhost:3037/api/v1/endpoints'
}

export default {
  app: {
    // endpoints list
    endpoints: {
      // initial REST API endpoints
      endpoints: endpoint,
      login: loginEndpoint,
      instances: instanceEndpoint
    }
  },
  ece: {
    defaultChatEntryPointId: '1005'
  },
  bot: {
    defaultToken: 'a88ffa6256174c198e62e882d68af6fa'
  },
  sms: {
    production: '+19728539759'
  },
  sm: {
    agentRequestFeedId: '100003',
    taskFeedId: '100000',
    taskScript: 'Dynamic_Task'
  },
  cvp: {
    locales: ['en-us', 'es-mx', 'pt-br']
  },
  whatsapp: {
    betaCode: 'cerulean-lyrdbird',
    dnis: '+1 (415) 523-8886'
  }
}
