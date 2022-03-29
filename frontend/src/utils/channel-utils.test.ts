import {
  uniqueFormattedPhoneNumbers,
  uniqueFormattedLocationAddresses,
  formatAddressMultiline,
  formatAddressOneliner,
} from './channel-utils';

describe('Test uniqueFormattedPhoneNumbers', () => {
  it('Filters out repeated phone numbers', () => {
    const testData = [
      {
        number: '1234567',
        prefixNumber: '040',
        chargeDescription: '',
        serviceChargeType: '',
      },
      {
        number: '1234567',
        prefixNumber: '040',
        chargeDescription: '100 € per hour',
        serviceChargeType: 'Chargeable',
      },
      {
        number: '9234567',
        prefixNumber: '+358',
        chargeDescription: '100 € per hour',
        serviceChargeType: 'Chargeable',
      },
    ];

    const filtered = uniqueFormattedPhoneNumbers(testData);
    expect(filtered.length).toBe(2);
    expect(filtered.includes('0401234567')).toBe(true);
    expect(filtered.includes('+3589234567')).toBe(true);
  });
});

describe('Test uniqueFormattedLocationAddresses', () => {
  it('Filters out addresses that would look the same when formatted', () => {
    const testData = [
      {
        type: 'Location',
        subtype: 'does not matter',
        streetNumber: '5',
        postalCode: '123456',
        streetName: 'Test Street',
        municipalityName: 'Testville',
        latitude: '60.478353371052805',
        longitude: '22.260701842207496',
      },
      {
        type: 'Location',
        subtype: 'irrelevant',
        streetNumber: '5',
        postalCode: '123456',
        streetName: 'Test Street',
        municipalityName: 'Testville',
      },
      {
        type: 'Location',
        subtype: 'irrelevant',
        streetNumber: '6', // Different number
        postalCode: '123456',
        streetName: 'Test Street',
        municipalityName: 'Testville',
      },
    ];

    const convertedOneliners = uniqueFormattedLocationAddresses(
      testData,
      formatAddressOneliner,
    );
    expect(convertedOneliners.length).toBe(2);

    const convertedMultiline = uniqueFormattedLocationAddresses(
      testData,
      formatAddressMultiline,
    );
    expect(convertedMultiline.length).toBe(2);
  });
});
