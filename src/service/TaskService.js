import { supabase } from "../service/supabase.js";

class TaskService {
  constructor(storageKey = "tasks") {
    this.storageKey = storageKey;
  }

  //save to local storage
  saveToLocal(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  //load from local storage
  loadFromLocal() {
    const cached = localStorage.getItem(this.storageKey);
    return cached ? JSON.parse(cached) : [];
  }

  //clear local storage
  clearLocal() {
    localStorage.removeItem(this.storageKey);
  }

  //load from supabase
  async loadTasksFromDB(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  }

  //add task to supabase
  async addTaskToDB(task) {
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  //update task to supabase
  async updateTaskInDB(task) {
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", task.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  //delete task from supabase
  async deleteTaskFromDB(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  }
}

export default new TaskService();
