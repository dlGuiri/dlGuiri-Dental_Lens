export default /* GraphQL */ `
    createScanRecord(
      user: ID!
      date: String
      notes: String
      imageUrls: [String]
      result: String
    ): ScanRecord

    updateScanRecord(
      recordId: ID!
      date: String
      notes: String
      imageUrls: [String]
      result: String
    ): ScanRecord

    deleteScanRecord(recordId: ID!): ScanRecord
`;
