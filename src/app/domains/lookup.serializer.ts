class BusinessType {
  id: string;
  name: string;
  code: string;
  constructor(model: any){
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
  }
}

export class Software {
    id: number;
    name: string;
    code: string;
    businessTypes: Array<BusinessType>;
    constructor(model: any = <any>{}){
        const  { id, name, code, businessTypes } = model;
        this.id = id;
        this.name = `${code} : ${name}`;
        this.code = code;
        this.businessTypes = (businessTypes || []).map((r: any) => new BusinessType(r));
    }
}

export class BusinessLookup {
  softwares: Array<Software>;
  constructor(model: any = <any>{}){
    const softwares = [
      {
        name: "Healthcare Management Software", description: "A Cloud-based app to manage business finances",
        code: 'HMS', sectorType:'health_care',
        businessTypes: [
          { name: "Hospital", masterType: 'hospital' }
        ]
      },
      {
        name: "Institute Management Software", description: "A Cloud-based app to manage business finances",
        code: 'IMS', sectorType:'education',
        businessTypes: [
          { name: "University", masterType: 'university' },
          { name: "College", masterType: 'college' },
          { name: "School", masterType: 'school' },
          { name: "Coaching", masterType: 'Coaching' }
        ]
      }
    ];
    this.softwares = (softwares || []).map((r: any) => new Software(r));
  }
}

