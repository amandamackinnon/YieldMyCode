import { StyleSheet, Platform } from 'react-native';

export const fridgeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingRight: -20,
    paddingTop: 15,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dropdown: {
    backgroundColor: '#D9D9D966',
    borderRadius: 2,
    padding: 12,
    marginBottom: 15,
  },

 emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    opacity: 0.8,
  },

  emptyText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },

  dropdownContainer: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,

  },

  placeholderStyle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'NunitoMedium',
  },
  selectedTextStyle: {
    fontSize: 1,
    color: 'transparent',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoMedium',
  },

  tileHeader: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    alignItems: 'center',
  },

    dateLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'NunitoMedium',
  },

  expiryText: {
    marginTop: 4,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: 'NunitoMedium',
    fontSize: 14,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
    alignSelf: 'stretch',
  },

  urgentRed: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF3800',
    color: '#FF3800',
  },

  warningYellow: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFC700',
    color: '#FFC700',
  },

  emptyText: {
    textAlign: 'center',
    fontFamily: 'NunitoSemiBold',
    marginTop: 50,
    color: '#999',
    fontSize: 30,
  },
  
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  bannerOverlay: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  bannerRed1: {
    backgroundColor: '#FF380080',
  },

  bannerRed: {
    backgroundColor: '#FF3800',
  },
  bannerOrange: {
    backgroundColor: '#FFC70080',
  },

  bannerText: {
    color: 'white',
    fontFamily: 'NunitoBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  minusButton: {
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  minusText: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold'
  },

  deleteButton: {
    marginLeft: 5,
  },

  emptyImage: {
    height: 500,
    width: 500,
    marginLeft: -30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  notificationDropdown: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 4,
    borderColor: '#E07A5F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },

  markAsRead: {
    fontFamily: "NunitoBold",
    textDecorationLine: "underline",
  },

  dropdownTitle: {
    fontFamily: "NunitoBold",
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
   
  },

  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    marginRight: 12,
  },

  notificationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "NunitoMedium",
    

  },

});
