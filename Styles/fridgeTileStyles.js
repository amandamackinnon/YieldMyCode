import { StyleSheet, Platform } from 'react-native';

export const fridgeTileStyles = StyleSheet.create({ 
      tileContainer: {
    width: '48%',
    marginHorizontal: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    paddingRight: 15,
    paddingLeft: 7,
  },

    tile: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
   },

    imageBackgroundCircle: {
    width: 175,
    height: 175,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
    paddingTop: 25,
  },

    innerWhiteCircle: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

    foodImage: {
    width: 75,
    height: 75,
  },

 bannerOverlay: {
    position: 'absolute',
    bottom: '50%',
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
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

    expiredInnerCircle: {
    backgroundColor: '#D9D9D9',
    opacity: 0.7,
  },

   expiredImage: {
    opacity: 0.35,
  },

    expiredText: {
    opacity: 0.45,
  },

    itemName: {
    fontSize: 16,
    fontFamily: 'NunitoBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
  },

    tileFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 175,
    marginTop: 10,
  },

    qtyBox: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingVertical: 4,
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

   qtyText: {
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    color: '#292929',
  },

   expiryBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 4,
    marginLeft: 6,
  },

  cleanExpiryText: {
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#292929',
  },

   statusDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 10,
    top: -5,
    right: -4,
    borderWidth: 1,
    borderColor: '#292929',
  },

});