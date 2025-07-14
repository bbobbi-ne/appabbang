import { prisma } from '@/lib/prisma';

// 공통 코드들을 미리 캐싱합니다.
const userRoleMap = new Map<string, string>();
const breadStatusMap = new Map<string, string>();
const materialTypeMap = new Map<string, string>();
const orderStatusMap = new Map<string, string>();
const purchaseStatusMap = new Map<string, string>();
const deliveryTypeMap = new Map<string, string>();
const imageTargetTypeMap = new Map<string, string>();
const providerTypeMap = new Map<string, string>();

export const commonCodeMap = {
  userRoleMap,
  breadStatusMap,
  materialTypeMap,
  orderStatusMap,
  purchaseStatusMap,
  deliveryTypeMap,
  imageTargetTypeMap,
  providerTypeMap,
};

export async function loadAllCommonCodes() {
  await Promise.all([
    loadUserRoleCodes(),
    loadBreadStatusCodes(),
    loadMaterialTypeCodes(),
    loadOrderStatusCodes(),
    loadPurchaseStatusCodes(),
    loadDeliveryTypeCodes(),
    loadImageTargetTypeCodes(),
    loadProviderTypeCodes(),
  ]);
}

async function loadUserRoleCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'user_role' },
  });

  codes.forEach((code: any) => {
    userRoleMap.set(code.code, code.name);
  });
}

async function loadBreadStatusCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'bread_status' },
  });

  codes.forEach((code: any) => {
    breadStatusMap.set(code.code, code.name);
  });
}

async function loadMaterialTypeCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'material_type' },
  });

  codes.forEach((code: any) => {
    materialTypeMap.set(code.code, code.name);
  });
}

async function loadOrderStatusCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'order_status' },
  });

  codes.forEach((code: any) => {
    orderStatusMap.set(code.code, code.name);
  });
}

async function loadPurchaseStatusCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'purchase_status' },
  });

  codes.forEach((code: any) => {
    purchaseStatusMap.set(code.code, code.name);
  });
}

async function loadDeliveryTypeCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'delivery_type' },
  });

  codes.forEach((code: any) => {
    deliveryTypeMap.set(code.code, code.name);
  });
}

async function loadImageTargetTypeCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'image_target_type' },
  });

  codes.forEach((code: any) => {
    imageTargetTypeMap.set(code.code, code.name);
  });
}

async function loadProviderTypeCodes() {
  const codes = await prisma.commonCode.findMany({
    where: { groupName: 'provider_type' },
  });

  codes.forEach((code: any) => {
    providerTypeMap.set(code.code, code.name);
  });
}

/** 공통 코드 목록 조회 */
export const getList = async () => {
  const list = await prisma.commonCode.findMany({
    // select: { groupName: true, code: true, name: true, remarkTxt: true },
  });
  return list;
};

/** 공통 코드 그룹별 조회 */
export const getListByGroupName = async (groupName: string) => {
  const list = await prisma.commonCode.findMany({
    where: { groupName },
    select: { code: true, name: true },
  });
  return list;
};

/** 공통 코드 생성 */
export const create = async (groupName: string, code: string, name: string, remarkTxt: string) => {
  const created = await prisma.commonCode.create({
    data: { groupName, code, name, remarkTxt },
  });
  return created;
};

/** 공통 코드 수정 */
export const update = async (
  no: number,
  groupName: string,
  code: string,
  name: string,
  remarkTxt: string,
) => {
  const updated = await prisma.commonCode.update({
    where: { no },
    data: { groupName, code, name, remarkTxt },
  });
  return updated;
};

/** 공통 코드 삭제 */
export const remove = async (no: number) => {
  const deleted = await prisma.commonCode.delete({
    where: { no },
  });
  return deleted;
};
