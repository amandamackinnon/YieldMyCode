import { StyleSheet, Platform } from 'react-native';

export const addToFridgeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderWidth: 4,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  illustrationBadge: {
    width: 105,
    height: 105,
    position: 'absolute',
    marginTop: -30,
    marginLeft: 3,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderWidth: 1,
    borderRadius: 52.5,
    backgroundColor: 'rgba(236, 96, 57, 1)',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  illustrationImage: {
    width: 135,
    height: 135,
    marginRight: 14,
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },

  circle: {
    width: 25,
    height: 25,
    borderRadius: 52.5,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 24,
    fontFamily: 'NunitoBold',
    color: '#333',
    marginLeft: 80,
    marginTop: 20,
  },

  subheading: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
    marginBottom: 20,
    marginLeft: 80,

  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    marginVertical: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  dateText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#333',
  },

  dropdown: {
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  dropdownPlaceholder: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },

  dropdownSelectedText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoBold',
  },

  dropdownItemText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'NunitoMedium',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 4,
    borderColor: "rgba(236, 96, 57, 1)",
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 24,
    width: '60%',
    alignSelf: 'center',
  },

  buttonText: {
    color: 'rgba(236, 96, 57, 1)',
    fontFamily: 'NunitoBold',
    fontSize: 15,
    textTransform: 'uppercase',
  },

  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    gap: 12,
  },

  halfInput: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#EC6039',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000000',
    fontFamily: 'NunitoMedium'
  },

  halfDropdown: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#EC6039',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontFamily: 'NunitoBold',
  },

  dropdownOverlayMenu: {
    backgroundColor: '#FFFFFF',
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
    maxHeight: 250,
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#EC6039',
    textAlign: 'center',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'NunitoMedium',
  },

  iosModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iosModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  iosDoneButton: {
    backgroundColor: '#EC6039',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  iosDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NunitoBold',
  },

});
