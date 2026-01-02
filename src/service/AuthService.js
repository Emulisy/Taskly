import { supabase } from "./supabase.js";

class AuthService {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data.user;
  }

  async register({ email, password, name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw new Error(error.message);

    return data.user;
  }

  async updateProfile({ email, password, name }) {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password: password || undefined,
      data: { name },
    });

    if (error) throw new Error(error.message);

    return data.user;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async restoreSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session?.user ?? null;
  }
}

export default new AuthService();
