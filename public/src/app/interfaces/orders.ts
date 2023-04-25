declare interface Orders {
  order_transaccion_id?: string;
  order_total?: string;
  order_user_address?: string;
  order_user_city?: string;
  order_user_document?: string;
  order_user_email?: string;
  order_user_name?: string;
  order_user_phone?: string;
  order_time?: string;
  order_date?: string;
  order_state?: number;
  order_state_one?: boolean;
  order_state_two?: boolean;
  order_state_three?: boolean;
  order_reference?:any,
  arrayProductCart?: Product[];
  order_time_accepted?: string;
}
