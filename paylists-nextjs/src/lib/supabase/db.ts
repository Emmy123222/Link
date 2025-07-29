import { supabase } from "../supabaseClient";

export async function addDocument(table: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function getDocument(table: string, id: string) {
  const { data, error } = await supabase
    .from(table)
    .select()
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(table: string, id: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function deleteDocument(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function queryDocuments(table: string, conditions: any) {
  let query = supabase.from(table).select();

  conditions.forEach(([field, operator, value]: any) => {
    switch (operator) {
      case "==":
        query = query.eq(field as string, value);
        break;
      case ">":
        query = query.gt(field as string, value);
        break;
      case "<":
        query = query.lt(field as string, value);
        break;
      case ">=":
        query = query.gte(field as string, value);
        break;
      case "<=":
        query = query.lte(field as string, value);
        break;
      case "array-contains":
        query = query.contains(field as string, [value]);
        break;
    }
  });

  const { data, error } = await query;
  if (error) throw error;
  return { docs: data };
}

export async function listenToChanges(table: string, callback: any) {
  const subscription = supabase
    .channel("table-db-changes")
    .on("postgres_changes", { event: "*", schema: "public", table }, callback)
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export async function getDocuments(collection: string, query: any = {}) {
  let queryBuilder = supabase.from(collection).select();

  // Apply filters
  if (query.where) {
    Object.entries(query.where).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
  }

  // Apply ordering
  if (query.orderBy) {
    queryBuilder = queryBuilder.order(query.orderBy.field, {
      ascending: query.orderBy.direction === "asc",
    });
  }

  // Apply limit
  if (query.limit) {
    queryBuilder = queryBuilder.limit(query.limit);
  }

  const { data, error } = await queryBuilder;
  if (error) throw error;
  return data;
}

export async function createDocument(collection: string, data: any) {
  const { data: result, error } = await supabase
    .from(collection)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export default {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  listenToChanges,
};
