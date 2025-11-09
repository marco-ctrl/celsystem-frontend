export interface User {
  id:                number;
  name:              string;
  email:             string;
  email_verified_at: Date;
  tipe:              number;
  status:            number;
  lider:             Lider;
}

export interface Lider {
  id:        number;
  name:      string;
  lastname:  string;
  birthdate: Date;
  addres:    string;
  contact:   string;
  foto:      string;
  user_id:   number;
  status:    number;
}
