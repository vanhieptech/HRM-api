module.exports = {
  port: process.env.PORT || 3000,
  mongoURL:
    process.env.MONGO_URL ||
    "mongodb+srv://admin:root@cluster0.apeq2.mongodb.net/HRM-DATABASE?retryWrites=true&w=majority",
  secret_key: "hrmbackend",
  sk_time_life: 2678400,
};
