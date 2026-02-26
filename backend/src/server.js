import app from './app.js';
import sequelize from './database.js';
import './models/Note.js';

const PORT = process.env.PORT || 3000;

await sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
