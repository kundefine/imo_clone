import { FontAwesome5 } from '@expo/vector-icons';
import { Check, Search, UserPlus, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { ContactItem } from '../../types';
import { Avatar } from '../common/Avatar';

type AddContactModalProps = {
  visible: boolean;
  onClose: () => void;
  deviceContacts: ContactItem[];
  isLoadingContacts: boolean;
  onSelectContact: (contact: ContactItem) => void;
  onAddManualContact: (contact: ContactItem) => void;
  initialShowManual?: boolean;
};

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
  deviceContacts,
  isLoadingContacts,
  onSelectContact,
  onAddManualContact,
  initialShowManual = false,
}) => {
  const [showManualForm, setShowManualForm] = useState(initialShowManual);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [contactSearchText, setContactSearchText] = useState('');

  const filteredContacts = useMemo(() => {
    if (!contactSearchText.trim()) return deviceContacts;
    const q = contactSearchText.toLowerCase();
    return deviceContacts.filter((c) => {
      const name = c.name.toLowerCase();
      const phone = c.subtitle.toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [deviceContacts, contactSearchText]);

  const handleManualSubmit = () => {
    if (!manualName.trim()) {
      Alert.alert('Name Required', 'Please enter a contact name.');
      return;
    }

    const newContact: ContactItem = {
      id: `c-${Date.now()}`,
      name: manualName.trim(),
      subtitle: manualPhone.trim() || 'imo Friend',
      subtitleType: 'normal',
      date: 'Just now',
      isDefaultAvatar: true,
      icon: 'phone',
    };

    onAddManualContact(newContact);
    setManualName('');
    setManualPhone('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleWrap}>
              <UserPlus color={Colors.imoBlue} size={22} strokeWidth={2.2} />
              <Text style={styles.modalHeaderTitle}>Add Contacts</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.modalCloseBtn}
              onPress={onClose}
            >
              <X color="#9AA0A6" size={22} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Mode Selector */}
          <View style={styles.modalTabs}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalTabBtn, !showManualForm && styles.modalTabBtnActive]}
              onPress={() => setShowManualForm(false)}
            >
              <Text style={[styles.modalTabText, !showManualForm && styles.modalTabTextActive]}>
                Phone Contacts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalTabBtn, showManualForm && styles.modalTabBtnActive]}
              onPress={() => setShowManualForm(true)}
            >
              <Text style={[styles.modalTabText, showManualForm && styles.modalTabTextActive]}>
                Manual Add
              </Text>
            </TouchableOpacity>
          </View>

          {showManualForm ? (
            /* Manual Add Form */
            <View style={styles.manualFormContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Shakib Al Hasan"
                placeholderTextColor={Colors.placeholderText}
                value={manualName}
                onChangeText={setManualName}
              />

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. +880 1712-345678"
                placeholderTextColor={Colors.placeholderText}
                keyboardType="phone-pad"
                value={manualPhone}
                onChangeText={setManualPhone}
              />

              <View style={styles.defaultAvatarNote}>
                <View style={styles.defaultMiniAvatar}>
                  <FontAwesome5 name="user" solid size={14} color={Colors.defaultAvatarIcon} />
                </View>
                <Text style={styles.defaultAvatarNoteText}>
                  Will be added with imo's default profile avatar
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addSubmitBtn}
                onPress={handleManualSubmit}
              >
                <Check color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.addSubmitBtnText}>Add to Contacts</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Device Contacts List */
            <>
              <View style={styles.modalSearchWrap}>
                <Search color={Colors.textMuted} size={18} strokeWidth={2.2} />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search phone contacts..."
                  placeholderTextColor={Colors.placeholderText}
                  value={contactSearchText}
                  onChangeText={setContactSearchText}
                />
                {contactSearchText.length > 0 && (
                  <TouchableOpacity onPress={() => setContactSearchText('')}>
                    <X color="#727780" size={16} />
                  </TouchableOpacity>
                )}
              </View>

              {isLoadingContacts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.imoBlue} />
                  <Text style={styles.loadingText}>Reading phone contacts...</Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.deviceContactsScroll}
                  contentContainerStyle={styles.deviceContactsScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {filteredContacts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No matching contacts found</Text>
                    </View>
                  ) : (
                    filteredContacts.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={styles.deviceContactRow}
                        activeOpacity={0.7}
                        onPress={() => {
                          onSelectContact(c);
                          onClose();
                        }}
                      >
                        <View style={styles.deviceContactAvatar}>
                          <Avatar contact={c} size={44} />
                        </View>

                        <View style={styles.deviceContactInfo}>
                          <Text style={styles.deviceContactName}>{c.name}</Text>
                          <Text style={styles.deviceContactPhone}>{c.subtitle}</Text>
                        </View>

                        <View style={styles.deviceAddPill}>
                          <Text style={styles.deviceAddPillText}>Chat</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.modalBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282C35',
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTabs: {
    flexDirection: 'row',
    backgroundColor: '#121418',
    borderRadius: 10,
    padding: 4,
    marginVertical: 14,
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalTabBtnActive: {
    backgroundColor: '#282D36',
  },
  modalTabText: {
    color: '#8A9099',
    fontSize: 14,
    fontWeight: '600',
  },
  modalTabTextActive: {
    color: '#00A3FF',
    fontWeight: '700',
  },
  manualFormContainer: {
    paddingTop: 6,
  },
  inputLabel: {
    color: '#BAC0C9',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#121418',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#292E38',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  defaultAvatarNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#16191F',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#242933',
  },
  defaultMiniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.defaultAvatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultAvatarNoteText: {
    flex: 1,
    color: '#8F95A0',
    fontSize: 12.5,
  },
  addSubmitBtn: {
    backgroundColor: Colors.imoBlue,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },
  addSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121418',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#282D36',
    marginBottom: 10,
  },
  modalSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    padding: 0,
  },
  deviceContactsScroll: {
    maxHeight: 360,
  },
  deviceContactsScrollContent: {
    paddingVertical: 4,
  },
  deviceContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#20242D',
  },
  deviceContactAvatar: {
    marginRight: 12,
  },
  deviceContactInfo: {
    flex: 1,
  },
  deviceContactName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  deviceContactPhone: {
    color: '#8A9099',
    fontSize: 12.5,
  },
  deviceAddPill: {
    backgroundColor: '#1A3347',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  deviceAddPillText: {
    color: Colors.imoBlue,
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    color: '#8A9099',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#727780',
    fontSize: 14,
  },
});
