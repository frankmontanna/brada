export type IdentificationBody = Partial<{
  usuario: string;
  senha: string;
  token: string;   
  tokenqr: string; 
  contato: string; 
  name: string;
  numSerie: string;
}>;
export type IdentificationResponse =
  | {} 
  | {
      s: number | null;
      ils1l: boolean;
      ils1e: boolean;
      ils1v: boolean;
      n: string | null;  
      ns: string | null; 
      tt: 1 | 2; 
      ils2l: boolean;
      ils2e: boolean;
      ils2v: boolean;
      ils3l: boolean;
      ils3e: boolean;
      qr: string | null;
    };
