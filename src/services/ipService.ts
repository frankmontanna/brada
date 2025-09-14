export interface IpInfo {
  status: string;
  country: string;
  region: string;
  regionName: string;
  city: string;
}
export class IpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://ip-api.com/json") {
    this.baseUrl = baseUrl;
  }
  async getIpInfo(ipAddress: string): Promise<IpInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${ipAddress}`);
      if (!response.ok) throw new Error("Erro na requisição");
      const data = await response.json();
      const filteredData: IpInfo = {
        status: data.status,
        country: data.country,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
      };

      return filteredData;
    } catch (error) {
      console.error("Falha ao buscar informações do IP:", error);
      return null;
    }
  }
}

