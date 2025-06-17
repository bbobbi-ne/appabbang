import { prisma } from '@/lib/prisma';

// 공통 코드들을 미리 캐싱합니다.
const userRoleMap = new Map<string, string>();
const breadStatusMap = new Map<string, string>();
const materialTypeMap = new Map<string, string>();
const orderStatusMap = new Map<string, string>();
const purchaseStatusMap = new Map<string, string>();
const deliveryTypeMap = new Map<string, string>();
const imageTargetTypeMap = new Map<string, string>();

export const commonCodeMap = {
  userRoleMap,
  breadStatusMap,
  materialTypeMap,
  orderStatusMap,
  purchaseStatusMap,
  deliveryTypeMap,
  imageTargetTypeMap,
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
    console.log(code);
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
