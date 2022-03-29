import {
  IChannel,
  IChannelDescription,
  IPhoneNumber,
  IAddress,
} from 'models/channel';

function formatAddressParts(address: IAddress): string[] {
  const streetAddress = address.streetName
    ? `${address.streetName} ${address.streetNumber}`
    : '';
  const municipality = address.municipalityName
    ? `${address.postalCode} ${address.municipalityName}`
    : '';

  return [streetAddress, municipality];
}

function formatAddressOneliner(address: IAddress): string {
  return formatAddressParts(address).join(', ');
}

function formatAddressMultiline(address: IAddress): string {
  return formatAddressParts(address).join('\n');
}

function formatPhoneNumber(number: IPhoneNumber): string {
  return `${number.prefixNumber || ''}${number.number}`;
}

function generateMapsDirectionLink(address: string): string {
  const mapsBaseUrl = 'https://www.google.com/maps/dir/?api=1';
  const destination = '' + encodeURIComponent(address);
  return `${mapsBaseUrl}&destination=${destination}`;
}

function generateMapsLocationLink(longitude: string, latitude: string): string {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=16`;
}

function getChannelDescription(channel: IChannel): {
  description: string;
  descLang: string | undefined;
} {
  const summary = channel.descriptions.find((d) => d.type == 'Summary');
  const description = channel.descriptions.find(
    (d: IChannelDescription) => d.type == 'Description',
  );

  const chosen = summary || description;

  return {
    description: chosen ? chosen.value : '',
    descLang: chosen ? chosen.language : undefined,
  };
}

function uniqueFormattedAddresses(
  addresses: IAddress[],
  formattingFunc: (a: IAddress) => string,
): string[] {
  const uniqueAddresses: string[] = addresses
    .filter((address: IAddress) => address.type === 'Location')
    .map((a) => formattingFunc(a))
    .filter((formattedAdd) => formattedAdd !== '')
    .filter((addr, index, self) => self.indexOf(addr) === index);

  return uniqueAddresses;
}

export interface IFormmattedLocation {
  address: string;
  latitude: string | undefined;
  longitude: string | undefined;
}

function uniqueFormattedLocationAddresses(
  addresses: IAddress[],
  formattingFunc: (a: IAddress) => string,
): IFormmattedLocation[] {
  const uniqueAddresses: IFormmattedLocation[] = addresses
    .filter((address: IAddress) => address.type === 'Location')
    .map((a) => {
      return {
        address: formattingFunc(a),
        latitude: a.latitude,
        longitude: a.longitude,
      };
    })
    .filter((formattedAdd) => formattedAdd.address !== '')
    .filter(
      (addr, index, self) =>
        self.findIndex((a) => a.address === addr.address) === index,
    );

  return uniqueAddresses;
}

function uniqueFormattedPhoneNumbers(numbers: IPhoneNumber[]): string[] {
  const uniqueNumbers: string[] = numbers
    .map((n) => formatPhoneNumber(n))
    .filter((num, index, self) => self.indexOf(num) === index);
  return uniqueNumbers;
}

export {
  formatAddressMultiline,
  formatAddressOneliner,
  formatPhoneNumber,
  generateMapsDirectionLink,
  generateMapsLocationLink,
  getChannelDescription,
  uniqueFormattedAddresses,
  uniqueFormattedLocationAddresses,
  uniqueFormattedPhoneNumbers,
};
