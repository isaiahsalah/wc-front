import {z} from "zod";

export interface ISesion {
  sys_user: ISystemUser;
  token: string;
}

/*
export interface UsuarioInterface {
  id?: number | null;
  name: string;
  lastname: string;
  birthday: Date;
  image: string;
  phone: string;
  user: string;
  pass: string;
  id_rol: number;

  //rol?: RolInterface | null;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

//tabla general
export const GeneralSchema = z.object({
  id: z.number().nullable().optional(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede exceder los 100 caracteres.")
    .nonempty("El nombre es obligatorio."),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres.")
    .max(500, "La descripción no puede exceder los 500 caracteres.")
    .nonempty("La descripción es obligatoria."),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});
*/

// Tabla: Color
export const ColorSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Unity
export const UnitySchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  shortname: z.string(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Sector
export const SectorSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Process
export const ProcessSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: SectorProces
export const SectorProcessSchema = z.object({
  id: z.number().nullable().optional(),
  id_sector: z.number(),
  id_process: z.number(),
  sector: SectorSchema.nullable().optional(),
  process: ProcessSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: WorkGroupSchema
export const WorkGroupSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: User
export const SystemUserSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  lastname: z.string(),
  birthday: z.date(),
  phone: z.string(),
  user: z.string(),
  pass: z.string(),
  id_work_group: z.number().nullable().optional(),
  work_group: WorkGroupSchema.nullable().optional(),
  permissions: z.array(z.any()).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Inventory
export const InventorySchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Model
export const ProductModelSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  id_sector_process: z.number(),
  sector_process: SectorProcessSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Product
export const ProductSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  type_product: z.number(),
  micronage: z.number().optional(),
  weight: z.number(),
  equivalent_amount: z.number(),
  id_unit: z.number(),
  id_equivalent_unit: z.number(),
  product_unit: UnitySchema.nullable().optional(),
  product_equivalent_unit: UnitySchema.nullable().optional(),

  id_color: z.number().nullable().optional(),
  color: ColorSchema.nullable().optional(),
  id_product_model: z.number(),
  product_model: ProductModelSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Formula
export const FormulaSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  active: z.boolean().optional(),
  id_product: z.number(),
  product: ProductSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: FormulaDetail
export const FormulaDetailSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  amount: z.number(),
  id_product_material: z.number(),
  product_material: ProductSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Machine
export const MachineSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),

  id_sector_process: z.number(),
  sector_process: SectorProcessSchema.nullable().optional(),

  active: z.boolean().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Order
export const ProductionOrderSchema = z.object({
  id: z.number().nullable().optional(),
  init_date: z.date(),
  end_date: z.date(),
  type_turn: z.number(),
  id_work_group: z.number(),
  work_group: WorkGroupSchema.nullable().optional(),
  id_sys_user: z.number(),
  sys_user: SystemUserSchema.nullable().optional(),
  production_order_details: z.array(z.any()).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: OrderDetail
export const ProductionOrderDetailSchema = z.object({
  id: z.number().nullable().optional(),
  amount: z.number(),
  id_product: z.number(),
  product: ProductSchema.nullable().optional(),
  productions: z.array(z.any()).nullable().optional(),
  id_production_order: z.number(),
  production_order: ProductionOrderSchema.nullable().optional(),
  id_machine: z.number(),
  machine: MachineSchema.nullable().optional(),

  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Permission
export const PermissionSchema = z.object({
  id: z.number().nullable().optional(),
  id_sys_user: z.number(),
  sys_user: SystemUserSchema.nullable().optional(),
  id_sector_process: z.number(),
  sector_process: SectorProcessSchema.nullable().optional(),
  type_degree: z.number(),
  type_screen: z.number(),
  type_module: z.number(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Production
export const ProductionSchema = z.object({
  id: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  date: z.date(),
  threshold_date: z.date().nullable().optional(),
  duration: z.number(),
  micronage: z.array(z.number()).nullable().optional(),
  type_quality: z.number(),

  weight: z.number(),
  type_size: z.number().nullable().optional(),
  equivalent_amount: z.number(),
  lote: z.string().nullable().optional(),

  id_unit: z.number(),
  id_equivalent_unit: z.number(),
  id_machine: z.number(),
  id_production_order_detail: z.number(),

  production_unit: UnitySchema.nullable().optional(),
  production_equivalent_unit: UnitySchema.nullable().optional(),
  machine: MachineSchema.nullable().optional(),
  production_order_detail: ProductionOrderDetailSchema.nullable().optional(),

  production_users: z.array(z.any()).nullable().optional(),

  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Production
export const ProductionUserSchema = z.object({
  id: z.number().nullable().optional(),

  id_sys_user: z.number().nullable().optional(),
  id_production: z.number().nullable().optional(),
  sys_user: SystemUserSchema.nullable().optional(),
  production: ProductSchema.nullable().optional(),

  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: ProductionDetail
export const ProductionDetailSchema = z.object({
  id: z.number().nullable().optional(),
  amount: z.number(),
  id_production: z.number(),
  production: ProductionSchema.nullable().optional(),
  id_product_material: z.number(),
  product_material: ProductSchema.nullable().optional(),
  id_production_material: z.number(),
  production_material: ProductionSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Work
export const WorkSchema = z.object({
  id: z.number().nullable().optional(),
  type_work: z.number(),
  id_production: z.number(),
  production: ProductionSchema.nullable().optional(),
  id_sys_user: z.number(),
  sys_user: SystemUserSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

export type IWorkGroup = z.infer<typeof WorkGroupSchema>;
export type IProductionUser = z.infer<typeof ProductionUserSchema>;

export type IColor = z.infer<typeof ColorSchema>;
export type IFormulaDetail = z.infer<typeof FormulaDetailSchema>;
export type IFormula = z.infer<typeof FormulaSchema>;
export type IInventory = z.infer<typeof InventorySchema>;
export type IMachine = z.infer<typeof MachineSchema>;
export type IProductModel = z.infer<typeof ProductModelSchema>;
export type IProductionOrderDetail = z.infer<typeof ProductionOrderDetailSchema>;
export type IProductionOrder = z.infer<typeof ProductionOrderSchema>;
export type IPermission = z.infer<typeof PermissionSchema>;
export type IProcess = z.infer<typeof ProcessSchema>;
export type IProduct = z.infer<typeof ProductSchema>;
export type IProductionDetail = z.infer<typeof ProductionDetailSchema>;
export type IProduction = z.infer<typeof ProductionSchema>;

export type ISector = z.infer<typeof SectorSchema>;

export type IUnity = z.infer<typeof UnitySchema>;
export type ISystemUser = z.infer<typeof SystemUserSchema>;
export type IWork = z.infer<typeof WorkSchema>;
export type ISectorProcess = z.infer<typeof SectorProcessSchema>;

export type IGeneral =
  | IWorkGroup
  | IFormula
  | IColor
  | IFormulaDetail
  | IInventory
  | IMachine
  | IProductModel
  | IProductionOrderDetail
  | IProductionOrder
  | IPermission
  | IProcess
  | IProduct
  | IProductionDetail
  | IProduction
  | ISector
  | IUnity
  | ISystemUser
  | IWork
  | ISectorProcess
  | IProductionUser;

export type IResponse = {
  data: IGeneral[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};
