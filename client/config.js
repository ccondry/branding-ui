// determine initial REST API endpoint
let endpoint
let loginEndpoint
let instanceEndpoint
if (process.env.NODE_ENV === 'production') {
  endpoint = '/api/v1/pcce/endpoints'
  loginEndpoint = '/api/v1/auth/login'
  instanceEndpoint = '/api/v1/pcce/instances'
} else {
  endpoint = 'http://localhost:3035/api/v1/pcce/endpoints'
  loginEndpoint = 'http://localhost:3032/api/v1/auth/login'
  instanceEndpoint = 'http://localhost:3034/api/v1/pcce/instances'
  // endpoint = 'http://dcloud-sjc-toolbox.cisco.com/api/v1/pcce/endpoints'
  // loginEndpoint = 'http://dcloud-sjc-toolbox.cisco.com/api/v1/auth/login'
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
  lab: {
    vpnDomain: 'cxdemo.net',
    shortDomain: 'DCLOUD',
    upnDomain: 'dcloud.cisco.com',
    caName: 'DCLOUDROOT-CA',
    subCaName: 'DCLOUDSUB-CA',
    caCertUrl: '/static/dcloud-root-ca.crt',
    subCaCertUrl: '/static/dcloud-sub-ca.crt',
    intentsZipUrl: '/static/intents.zip',
    whatsappQrUrl: '/static/whatsapp-qr.png'
  },
  sms: {
    // production: '+12142736887'
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
