
export class User {
  constructor(
    public readonly id: string | null,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly educationLevel: string,
    public readonly hasInternetAccess: boolean,
    public readonly hasCertifications: boolean,
    public readonly createdAt?: string
  ) {}

  static fromFormData(data: UserFormData): User {
    return new User(
      null,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      data.educationLevel,
      data.hasInternetAccess === 'yes',
      data.hasCertifications === 'yes'
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      state: this.state,
      education_level: this.educationLevel,
      has_internet_access: this.hasInternetAccess,
      has_certifications: this.hasCertifications,
    };
  }
}
  
export interface UserFormData {
  educationLevel: string;
  hasInternetAccess: string;
  hasCertifications: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  agreement: boolean;
}

