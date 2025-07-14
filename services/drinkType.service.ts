// services/drinkType.service.ts
import { getAllDrinkTypes } from "@/repositories/drinkType.repository";

export async function fetchAllDrinkTypes() {
  return await getAllDrinkTypes();
}
