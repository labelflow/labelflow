module.exports = {
  provider: "supabase",
  providerOptions: {
    apiUrl: process.env.SUPABASE_API_URL,
    apiKey: process.env.SUPABASE_API_KEY,
    bucket: "strapi-uploads",
    directory: "",
    options: {}
  }
}
