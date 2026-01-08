import { User, UserFormData } from "../../src/models/User";

describe("User", () => {
  const mockFormData: UserFormData = {
    educationLevel: "bachelor",
    hasInternetAccess: "yes",
    hasCertifications: "no",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "(555) 555-5555",
    address: "123 Main St",
    city: "Springfield",
    state: "TX",
    agreement: true,
  };

  test("should create User from form data", () => {
    const user = User.fromFormData(mockFormData);

    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.phone).toBe("(555) 555-5555");
    expect(user.address).toBe("123 Main St");
    expect(user.city).toBe("Springfield");
    expect(user.state).toBe("TX");
    expect(user.educationLevel).toBe("bachelor");
    expect(user.hasInternetAccess).toBe(true);
    expect(user.hasCertifications).toBe(false);
    expect(user.id).toBeNull();
  });

  test("should convert yes/no strings to booleans", () => {
    const dataWithYes: UserFormData = {
      ...mockFormData,
      hasInternetAccess: "yes",
      hasCertifications: "yes",
    };

    const user = User.fromFormData(dataWithYes);
    expect(user.hasInternetAccess).toBe(true);
    expect(user.hasCertifications).toBe(true);
  });

  test("should convert to JSON correctly", () => {
    const user = User.fromFormData(mockFormData);
    const json = user.toJSON();

    expect(json.first_name).toBe("John");
    expect(json.last_name).toBe("Doe");
    expect(json.email).toBe("john@example.com");
    expect(json.phone).toBe("(555) 555-5555");
    expect(json.address).toBe("123 Main St");
    expect(json.city).toBe("Springfield");
    expect(json.state).toBe("TX");
    expect(json.education_level).toBe("bachelor");
    expect(json.has_internet_access).toBe(true);
    expect(json.has_certifications).toBe(false);
  });
});
