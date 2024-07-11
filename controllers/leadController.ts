import { Request, Response } from "express";
import { addLeadEsav, authorize, writeData } from "./spreadSheet";

export async function syncDataDigitalAgenciesDay(req:Request , res : Response) {
    const { lead } = req.body
    try {
        const auth = await authorize();
        writeData(auth, lead)
        res.json({msg : "lead succeffly added "})
      } catch (error) {
      }
}

export async function syncDataEsav(req:Request , res : Response) {
    const { lead } = req.body
    try {
        const auth = await authorize();
        addLeadEsav(auth, lead)
        res.json({msg : "lead succeffly added "})
      } catch (error) {
      }
}


