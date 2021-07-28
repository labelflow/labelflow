module.exports = ({ env }) => ({
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'contact@labelflow.ai',
      defaultReplyTo: 'contact@labelflow.ai',
      testAddress: 'contact@labelflow.ai',
    },
  },
});
