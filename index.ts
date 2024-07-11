import express, { Request, Response } from "express";
import { syncDataDigitalAgenciesDay, syncDataEsav } from "./controllers/leadController";
import cors from 'cors'

const app = express();
app.use(express.json()); 
app.use(cors())


app.post("/sync-digital-agencies", syncDataDigitalAgenciesDay)

app.post("/sync-esav", syncDataEsav)



app.listen(4000, () => {
  console.log("app runing in 4000 port ")
})
export default app;
