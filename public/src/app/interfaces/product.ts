declare interface Product {
  pro_id_internal?:any,
  pro_id?: string;
  pro_nombre?: string;
  pro_description?: string;
  pro_categoria?: string;
  pro_stock?: number,
  pro_precio?: number;
  pro_precio_desc?: number; 
  pro_url?: string;
  pro_url2?: string;
  pro_estado_novedad?: boolean;
  pro_estado_nuevo?: boolean;
  pro_estado_descuento?: boolean;
  pro_pro_cantidadCarrito?: number;
  pro_discount_percentage?: number;
  pro_subcategory?: string;
  pro_estado_mas_vendido?: boolean;
  pro_estado_pro_nuevo?: boolean;
  pro_estado_temporada?: boolean;
}