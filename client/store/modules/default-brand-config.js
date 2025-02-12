const brandConfig = {
  // basic config
  title: '',
  favicon: '',
  iframe: '',
  color1: '#2357af',
  color2: '#4881e2',
  // advanced config
  contactButtonText: 'Talk to an Expert',
  menuTitle: 'Need Help?',
  chatMenuTitle: 'Now Chatting',
  phoneLabel: 'Your Phone Number',
  phoneLabelSms: 'Your Phone Number (including the country code prefix, but without leading 0 or +)',
  nameLabel: 'Your Name',
  emailLabel: 'Your Email Address',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  requestTypeLabel: 'Request Type',
  okButton: 'OK',
  sendButton: 'Send',
  cancelButton: 'Cancel',
  // advisor
  advisorEnabled: true,
  advisorImage: 'https://mm.cxdemo.net/static/images/cumulus/common/author1.png',
  advisorHeading: 'Expert Advisor',
  advisorText: 'We\'re here to help',
  // chat
  chatEnabled: true,
  chatIcon: 'message-processing',
  chatHeading: 'Chat Live',
  chatText: 'An expert will chat with you live',
  chatWaitTime: '1 min wait time',
  // chat bot
  chatBotEnabled: true,
  chatBotIcon: 'message-processing',
  chatBotHeading: 'Chat with Bot',
  chatBotText: 'An AI-driven chat bot will assist you',
  chatBotWaitTime: 'No wait time',
  // chat bot with translation
  chatTranslationEnabled: true,
  chatTranslationIcon: 'message-processing',
  chatTranslationHeading: 'Chat Translation',
  chatTranslationText: 'Live chat with automatic translation',
  chatTranslationWaitTime: 'No wait time',
  // sms
  smsEnabled: true,
  smsIcon: 'message-processing',
  smsHeading: 'Text Us Live',
  // smsText: '{0}',
  // smsText: 'An expert will text with you live',
  smsText: 'Text with one of our experts',
  smsWaitTime: '1 min wait time',
  smsModalText: `Enter your mobile phone number and we will text you.
    Reply to begin texting with one of our experts.`,
  smsMessage: encodeURIComponent('Hello! Please reply to this text message to begin chatting with us.'),
  // sms bot
  smsBotEnabled: true,
  smsBotIcon: 'message-processing',
  // smsBotHeading: 'Text with Bot',
  smsBotHeading: 'Message an Expert on SMS',
  // smsBotText: '{0}',
  smsBotText: 'Text with an AI-driven chat bot',
  smsBotWaitTime: 'No wait time',
  smsBotModalText: `Enter your mobile phone number and we will text you.
    Reply to begin texting with an AI-driven chat bot.`,
  smsBotMessage: encodeURIComponent('Hello! Please reply to this text message to begin chatting with us.'),
  // call
  callEnabled: true,
  callIcon: 'phone',
  callHeading: 'Call Us',
  callText: 'Call an expert now',
  callWaitTime: '8 min wait time',
  callModalText: 'You can reach one of our experts by phone:',
  callModalMainLabel: 'Main',
  callModalWxmLabel: 'WXM',
  callModalWxmVoiceLabel: 'WXM (Voice)',
  callModalWxmEmailLabel: 'WXM (Email)',
  callModalWxmSmsLabel: 'WXM (SMS)',
  callModalCrmLabel: 'CRM',
  callModalGoldLabel: 'Gold',
  callModalVivrLabel: 'VIVR',
  callModalAiLabel: 'AI',
  callModalCvaAiLabel: 'CVA AI',
  callModalCustomAiLabel: 'Custom AI',
  callModal2RingLabel: '2Ring',
  callModalSalesforceLabel: 'Salesforce',
  callModalCcaiLabel: 'CCAI',
  // call QR
  callQrIcon: 'phone',
  callQrHeading: 'Call Us',
  callQrText: 'Call an expert now',
  callQrWaitTime: '8 min wait time',
  // callback
  callbackEnabled: true,
  callbackIcon: 'phone-forward',
  callbackHeading: 'We\'ll Call You',
  callbackText: 'Receive a call back from an expert',
  callbackWaitTime: '8 min wait time',
  callbackModalText: `Enter your name and phone number and one of our
    experts will call you.`,
  // email
  emailEnabled: true,
  emailIcon: 'email',
  emailHeading: 'Email an Expert',
  emailText: 'An expert will respond to your email',
  emailWaitTime: '12-24 hour wait time',
  emailModalText: `Enter your information and question and one of our
    experts will email you back.`,
  // task
  taskEnabled: true,
  taskIcon: 'clipboard-check',
  // taskHeading: 'Request',
  taskHeading: 'Send a Request',
  taskText: 'An expert will handle your task',
  taskWaitTime: 'No wait time',
  taskOptions: [{
    text: 'Report a Problem'
  }],
  taskModalText: `Enter your information and choose the task
    you would like to submit to our experts.`,
  // cobrowse
  cobrowseEnabled: true,
  cobrowseIcon: 'lan-connect',
  cobrowseHeading: 'Cobrowse',
  cobrowseText: 'An expert will cobrowse with you live',
  cobrowseWaitTime: '8 min wait time'
}

module.exports = brandConfig
