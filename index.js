import express from "express";
const app = express();
import "./src/config/db.js";

import roleRouter from "./src/routes/roleRoute.js";
import adminRouter from './src/routes/adminRoute.js';
import userRouter from './src/routes/userRoute.js';


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/v1", roleRouter);
app.use("/api/v1", adminRouter)
app.use("/api/v1", userRouter)

app.get('/', function(req, res) {
  res.send('Welcome')
})

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}... `);
  const error = false;
  if (error) {
    console.log(`Error running in server`, error);
  }
});
