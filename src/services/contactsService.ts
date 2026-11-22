import { ContactItem } from '../types';

export function getFallbackRawDeviceContacts(): any[] {
  const names = [
    'Abdur Rahim', 'Babul Akter', 'Chowdhury Hasan', 'Dilara Begum',
    'Enamul Haque', 'Faisal Karim', 'Golam Rabbani', 'Habibullah Misbah',
    'Ismail Hossain', 'Jahangir Alam', 'Kazi Nazrul', 'Liton Das',
    'Mahmudullah Riyad', 'Nasir Hossain', 'Omar Faruk', 'Parvez Emon',
    'Quazi Motahar', 'Rafiqul Islam', 'Shakib Khan', 'Tamim Iqbal',
    'Upoma Sen', 'Wahiduzzaman', 'Yeasin Arafat', 'Zakir Hasan',
    'Anika Tabassum', 'Biplob Kumar', 'Dipu Moni', 'Emon Mahmud',
    'Faruk Ahmed', 'Gazi Salahuddin', 'Hasan Mahmud', 'Iqbal Bahar'
  ];

  return names.map((name, i) => ({
    id: `dev-fb-${i + 1}`,
    name,
    phoneNumbers: [{ number: `+880 17${10 + i}-${100000 + i * 37}` }],
  }));
}

export function mapRawContacts(raw: any[]): ContactItem[] {
  return raw.map((c, idx) => {
    const name =
      c.name ||
      [c.firstName, c.lastName].filter(Boolean).join(' ') ||
      `Contact ${idx + 1}`;
    const phone = c.phoneNumbers?.[0]?.number || '+880 1700-000000';
    const hasImage = !!((c.imageAvailable && c.image?.uri) || c.imageUri);
    const imageUri = (c.imageAvailable && c.image?.uri) || c.imageUri || undefined;

    return {
      id: `device-${c.id || idx}`,
      name,
      subtitle: phone,
      subtitleType: 'normal',
      date: '',
      imageUri,
      isDefaultAvatar: !hasImage,
      icon: 'phone',
    };
  });
}

export async function fetchDeviceContacts(): Promise<ContactItem[]> {
  try {
    let ContactsModule: any = null;
    try {
      ContactsModule = require('expo-contacts');
    } catch (e) {
      console.warn('Could not load native expo-contacts module:', e);
    }

    if (ContactsModule?.requestPermissionsAsync) {
      const { status } = await ContactsModule.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await ContactsModule.getContactsAsync({
          fields: [
            ContactsModule.Fields?.Name || 'name',
            ContactsModule.Fields?.PhoneNumbers || 'phoneNumbers',
            ContactsModule.Fields?.Image || 'image',
          ],
          sort: ContactsModule.SortTypes?.FirstName,
        });

        const raw = (data && data.length > 0) ? (data as any[]) : getFallbackRawDeviceContacts();
        return mapRawContacts(raw);
      }
    }

    // Permission denied or module not available -> fallback
    return mapRawContacts(getFallbackRawDeviceContacts());
  } catch (err) {
    console.warn('Error fetching device contacts:', err);
    return mapRawContacts(getFallbackRawDeviceContacts());
  }
}
