import { Client, Account, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('674cd159002870de2972')

  const account = new Account(client);

  const databases = new Databases(client);
export { account, databases }

