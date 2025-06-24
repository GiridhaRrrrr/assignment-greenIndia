import config from "../../envConfig/config";
import { Client, Account, ID, Models } from "appwrite";

interface CreateAccountParams {
  email: string;
  password: string;
  name: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export class AuthServices {
  client: Client;
  account: Account;

  constructor() {
    this.client = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }: CreateAccountParams): Promise<Models.Session | void> {
    try {
      const user = await this.account.create(ID.unique(), email, password, name);
      if (user) {
        return this.logIn({ email, password });
      }
    } catch (error) {
      throw error;
    }
  }

  async logIn({ email, password }: LoginParams): Promise<Models.Session> {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: Error", error);
      return null;
    }
  }

  async logOut(): Promise<void> {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logOut :: Error", error);
    }
  }
}

const authServices = new AuthServices();
export default authServices;
