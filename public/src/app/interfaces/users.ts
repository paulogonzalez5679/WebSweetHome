declare interface Users {
  user_id?: string;
  user_email?: string;
  user_name?: string;
  user_lastname?: string;
  user_password?: string;
  user_confirPassword?: string;
  user_cell_phone?: string;
  user_type?: number;
  user_city?: string;
  user_product?: Array<Product>;
}