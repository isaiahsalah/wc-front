import {z} from "zod";

export interface SesionInterface {
  user: UserInterfaces;
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
  turn: z.number().optional(),
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
  type: z.number(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Product
export const ProductSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  price: z.number(),
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
  productMaterial: ProductSchema.nullable().optional(),
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
  production_count: z.number().nullable().optional(),
  id_order: z.number(),
  order: OrderSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Tabla: Permission
export const PermissionSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  id_user: z.number(),
  user: UserSchema.nullable().optional(),
  degree: z.number().optional(),
  screen: z.number().optional(),
  module: z.number().optional(),
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
  id_machine: z.number(),
  machine: MachineSchema.nullable().optional(),
  id_lote: z.number(),
  lote: LoteSchema.nullable().optional(),
  id_order_detail: z.number(),
  order_detail: OrderDetailSchema.nullable().optional(),
  id_user: z.number(),
  user: UserSchema.nullable().optional(),
  quality: z.number().optional(),
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
  id_product_materia: z.number(),
  productMaterial: ProductSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

export type GroupInterfaces = z.infer<typeof GroupSchema>;

export type ColorInterfaces = z.infer<typeof ColorSchema>;
export type FormulaDetailInterfaces = z.infer<typeof FormulaDetailSchema>;
export type FormulaInterfaces = z.infer<typeof FormulaSchema>;
export type InventoryInterfaces = z.infer<typeof InventorySchema>;
export type LoteInterfaces = z.infer<typeof LoteSchema>;
export type MachineInterfaces = z.infer<typeof MachineSchema>;
export type ModelInterfaces = z.infer<typeof ModelSchema>;
export type OrderDetailInterfaces = z.infer<typeof OrderDetailSchema>;
export type OrderInterfaces = z.infer<typeof OrderSchema>;
export type PermissionInterfaces = z.infer<typeof PermissionSchema>;
export type ProcessInterfaces = z.infer<typeof ProcessSchema>;
export type ProductInterfaces = z.infer<typeof ProductSchema>;
export type ProductionDetailInterfaces = z.infer<typeof ProductionDetailSchema>;
export type ProductionInterfaces = z.infer<typeof ProductionSchema>;
export type SectorInterfaces = z.infer<typeof SectorSchema>;
export type UnityInterfaces = z.infer<typeof UnitySchema>;
export type UserInterfaces = z.infer<typeof UserSchema>;

export type GeneralInterfaces =
  | GroupInterfaces
  | FormulaInterfaces
  | ColorInterfaces
  | FormulaDetailInterfaces
  | InventoryInterfaces
  | LoteInterfaces
  | MachineInterfaces
  | ModelInterfaces
  | OrderDetailInterfaces
  | OrderInterfaces
  | PermissionInterfaces
  | ProcessInterfaces
  | ProductInterfaces
  | ProductionDetailInterfaces
  | ProductionInterfaces
  | SectorInterfaces
  | UnityInterfaces
  | UserInterfaces;
