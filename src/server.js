const app = require('./app')
const {monitorUrl} = require('../utils/monitor')


app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on port: ${process.env.PORT}`);
  monitorUrl()
});
