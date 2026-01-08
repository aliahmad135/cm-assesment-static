import { Offer, OfferRecord } from "../../src/models/Offer";

describe("Offer", () => {
  const mockRecord: OfferRecord = {
    id: "123",
    name: "Test Offer",
    description: "This is a test offer",
    image_url: "https://example.com/image.jpg",
    state_restriction: "TX",
  };

  test("should create Offer from database record", () => {
    const offer = Offer.fromDatabaseRecord(mockRecord);

    expect(offer.id).toBe("123");
    expect(offer.name).toBe("Test Offer");
    expect(offer.description).toBe("This is a test offer");
    expect(offer.imageUrl).toBe("https://example.com/image.jpg");
    expect(offer.stateRestriction).toBe("TX");
  });

  test("should handle null image_url", () => {
    const recordWithoutImage: OfferRecord = {
      ...mockRecord,
      image_url: null,
    };

    const offer = Offer.fromDatabaseRecord(recordWithoutImage);
    expect(offer.imageUrl).toBeNull();
  });

  test("should handle null state_restriction", () => {
    const recordWithoutRestriction: OfferRecord = {
      ...mockRecord,
      state_restriction: null,
    };

    const offer = Offer.fromDatabaseRecord(recordWithoutRestriction);
    expect(offer.stateRestriction).toBeNull();
  });

  test("isAvailableForState should return true for unrestricted offers", () => {
    const recordWithoutRestriction: OfferRecord = {
      ...mockRecord,
      state_restriction: null,
    };

    const offer = Offer.fromDatabaseRecord(recordWithoutRestriction);
    expect(offer.isAvailableForState("TX")).toBe(true);
    expect(offer.isAvailableForState("CA")).toBe(true);
  });

  test("isAvailableForState should return true only for matching state", () => {
    const offer = Offer.fromDatabaseRecord(mockRecord);
    expect(offer.isAvailableForState("TX")).toBe(true);
    expect(offer.isAvailableForState("CA")).toBe(false);
  });

  test("should convert to JSON correctly", () => {
    const offer = Offer.fromDatabaseRecord(mockRecord);
    const json = offer.toJSON();

    expect(json.id).toBe("123");
    expect(json.name).toBe("Test Offer");
    expect(json.description).toBe("This is a test offer");
    expect(json.imageUrl).toBe("https://example.com/image.jpg");
    expect(json.stateRestriction).toBe("TX");
  });
});
