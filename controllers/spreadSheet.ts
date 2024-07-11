
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { BaseExternalAccountClient, GoogleAuth, OAuth2Client } from "google-auth-library";


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH, 'utf8');
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client: any){
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize() {
    let client : any  = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    console.log(client)
    return client;
}

export async function addLeadToSpreadSheets(auth  : string | BaseExternalAccountClient | OAuth2Client , lead : any ) {

    console.log(auth)
    const sheets = google.sheets({ version: 'v4', auth });
    let values = [
        [

            lead.name,
            lead.email,
            lead.phone,
            lead.societe,
            lead.poste,
            lead.message,
        ]
    ]

    const resource = {
        values
    };
    sheets.spreadsheets.values.append(
        {
            spreadsheetId: '1-aUXQnFfeqtP7nBPelw9lVjIe_G8qPc6tX9aqdR8eJc',
            range: 'Feuille 1',
            valueInputOption: 'RAW',
            requestBody : resource,
        },
        async (err, result) => {
            if (err) {
                console.log(err);
            } 
        }
    );

}


export async function addLeadEsav(auth  : string | BaseExternalAccountClient | OAuth2Client , lead : any) {

    const sheets = google.sheets({ version: 'v4', auth });
    let values = [
        [

            lead.civility,
            lead.firstName,
            lead.lastName,
            lead.email,
            lead.phone,
            lead.formation,
            lead.niveau,
            lead.programme,
            lead.city,
            lead.createdAt,
            lead.updatedAt,
        ]
    ]

    const resource = {
        values
    };
    sheets.spreadsheets.values.append(
        {
            spreadsheetId: '1MClf3i_xpvQD-JVYDhmbgh3sMKiaHt4j-jbgBe4vGhQ',
            range: 'Data',
            valueInputOption: 'RAW',
            requestBody : resource,
        },
        async (err, result) => {
            if (err) {
                console.log(err);
            } 
        }
    );

}

export function writeData(auth  : string | BaseExternalAccountClient | OAuth2Client , lead : any ) {
    addLeadToSpreadSheets(auth,lead)

}

