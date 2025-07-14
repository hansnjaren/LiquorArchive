// services/bottle.service.ts

import {
  FindBottleByCategoryQuery,
  FindBottleBySearchQuery,
  FindBottleByIdParams,
  FindAllBottleParams,
} from "@/types/bottle.types";
import {
  findByCategory,
  findBySearch,
  findById,
  findAllBottles,
} from "@/repositories/bottle.repository";

/**
 * 카테고리 기반 bottle 목록 조회 서비스
 */
export async function getBottlesByCategory(params: FindBottleByCategoryQuery) {
  // 서비스 계층에서 필요한 경우 로깅/권한 체크/필터 조정 등도 가능
  return await findByCategory(params);
}

export async function getBottlesBySearch(params: FindBottleBySearchQuery) {
  // 검색 쿼리에서 q, category, skip, take 등을 처리
  return await findBySearch(params);
}

export async function getBottleById(params: FindBottleByIdParams) {
  // ID로 단일 bottle 조회
  return await findById(params);
}

export async function getAllBottles(params: FindAllBottleParams) {
  // 전체 bottle 목록 조회
  return await findAllBottles(params);
}
