export class SoftwareLicenseFeature {
    id: number;
    licenseTypeId: number;
    licenseType: string;
    value: string;
    sortOrder: number;
    constructor(model: any = <any>{}){
        const { id, value, licenseTypeId, licenseType, sortOrder } = model;
        this.id = id;
        this.value = value;
        this.licenseTypeId = licenseTypeId;
        this.licenseType = licenseType;
        this.sortOrder = sortOrder;
    }
}

export class LicensingFeature {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    softwareLicenseFeatures: Array<SoftwareLicenseFeature>;

    constructor(model: any = <any>{}){
        const { id, name, description, sortOrder, softwareLicenseFeatures } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        /*const temp = (softwareLicenseFeatures || []).reduce(
            (prev, next) => {
                prev[`${id}${next.licenseTypeId}`] = next;
                return prev
            },
            {}
        );
        this.softwareLicenseFeatures = temp;*/
        this.softwareLicenseFeatures = (softwareLicenseFeatures || []).map((r: any) => new SoftwareLicenseFeature(r));
    }
}

export class LicenseType {
    id: number;
    name: string;
    sortOrder: number;
    isDefault: boolean;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder, isDefault } = model || {};
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault
    }
}

export class SoftwarePrice {
    id: string;
    name: string;
    description: string;
    licenseTypes: Array<LicenseType>;
    licensingFeatures: Array<LicensingFeature>;

    constructor(model: any = <any>{}){
        const { id, name, description, licenseTypes, licensingFeatures } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.licenseTypes = (licenseTypes || []).map((r: any) => new LicenseType(r));
        this.licensingFeatures = (licensingFeatures || []).map((r: any) => new LicensingFeature(r));
    }
}
