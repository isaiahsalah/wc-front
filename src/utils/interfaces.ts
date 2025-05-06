import {z} from "zod";

export interface ISesion {
  user: IUser;
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
  description: z.string(),
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
  description: z.string(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Process
export const ProcessSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Group
export const GroupSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  type_turn: z.number().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: User
export const UserSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  lastname: z.string(),
  birthday: z.date(),
  image: z.string(),
  phone: z.string(),
  user: z.string(),
  pass: z.string(),
  id_group: z.number(),
  group: GroupSchema.nullable().optional(),
  permissions: z.array(z.any()).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Inventory
export const InventorySchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Model
export const ModelSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  id_process: z.number(),
  process: ProcessSchema.nullable().optional(),
  id_sector: z.number(),
  sector: SectorSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Product
export const ProductSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  type_product: z.number(),
  micronage: z.number(),
  amount: z.number(),
  id_unity: z.number(),
  unity: UnitySchema.nullable().optional(),
  id_color: z.number(),
  color: ColorSchema.nullable().optional(),
  id_model: z.number(),
  model: ModelSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  isRawMaterial: z.boolean(),
  isFinishedProductz: z.boolean(),
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

// Tabla: Lote
export const LoteSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  id_inventory: z.number(),
  inventory: InventorySchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Machine
export const MachineSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  id_process: z.number(),
  process: ProcessSchema.nullable().optional(),
  active: z.boolean().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Order
export const OrderSchema = z.object({
  id: z.number().nullable().optional(),
  init_date: z.date(),
  end_date: z.date(),
  id_user: z.number(),
  user: UserSchema.nullable().optional(),
  order_details: z.array(z.any()).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: OrderDetail
export const OrderDetailSchema = z.object({
  id: z.number().nullable().optional(),
  amount: z.number(),
  id_product: z.number(),
  product: ProductSchema.nullable().optional(),
  productions: z.array(z.any()).nullable().optional(),
  id_order: z.number(),
  order: OrderSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Permission
export const PermissionSchema = z.object({
  id: z.number().nullable().optional(),
  id_user: z.number(),
  user: UserSchema.nullable().optional(),
  id_sector: z.number(),
  sector: SectorSchema.nullable().optional(),
  degree: z.number(),
  screen: z.number(),
  type_module: z.number(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Production
export const ProductionSchema = z.object({
  id: z.number().nullable().optional(),
  description: z.string(),
  date: z.date(),
  duration: z.number(),
  micronage: z.array(z.number()).nullable().optional(),
  amount: z.number(),
  type_quality: z.number(),
  id_unity: z.number(),
  unity: UnitySchema.nullable().optional(),
  id_machine: z.number(),
  machine: MachineSchema.nullable().optional(),
  id_lote: z.number(),
  lote: LoteSchema.nullable().optional(),
  id_order_detail: z.number(),
  order_detail: OrderDetailSchema.nullable().optional(),
  id_user: z.number(),
  user: UserSchema.nullable().optional(),
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

export type IGroup = z.infer<typeof GroupSchema>;

export type IColor = z.infer<typeof ColorSchema>;
export type IFormulaDetail = z.infer<typeof FormulaDetailSchema>;
export type IFormula = z.infer<typeof FormulaSchema>;
export type IInventory = z.infer<typeof InventorySchema>;
export type ILote = z.infer<typeof LoteSchema>;
export type IMachine = z.infer<typeof MachineSchema>;
export type IModel = z.infer<typeof ModelSchema>;
export type IOrderDetail = z.infer<typeof OrderDetailSchema>;
export type IOrder = z.infer<typeof OrderSchema>;
export type IPermission = z.infer<typeof PermissionSchema>;
export type IProcess = z.infer<typeof ProcessSchema>;
export type IProduct = z.infer<typeof ProductSchema>;
export type IProductionDetail = z.infer<typeof ProductionDetailSchema>;
export type IProduction = z.infer<typeof ProductionSchema>;
export type ISector = z.infer<typeof SectorSchema>;
export type IUnity = z.infer<typeof UnitySchema>;
export type IUser = z.infer<typeof UserSchema>;

export type IGeneral =
  | IGroup
  | IFormula
  | IColor
  | IFormulaDetail
  | IInventory
  | ILote
  | IMachine
  | IModel
  | IOrderDetail
  | IOrder
  | IPermission
  | IProcess
  | IProduct
  | IProductionDetail
  | IProduction
  | ISector
  | IUnity
  | IUser;
