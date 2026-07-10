import { StyleSheet, Platform } from 'react-native';

export const profileStyle = StyleSheet.create({
    
container: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    paddingTop: 7
    },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
    },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
    },
  filterButton: { 
    flex: 1, 
    paddingVertical: 10, 
    marginHorizontal: 4, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#4F6BB7', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
    },
  activeFilterButton: { 
    backgroundColor: '#4F6BB7' 
    },
  filterText: { 
    fontSize: 13, 
    color: '#4F6BB7', 
    fontWeight: '600' 
    },
  activeFilterText: { 
    color: '#FFF' 
    },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#222', 
    marginBottom: 14 
    },
  lineChartWrapper: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    overflow: 'hidden' 
    },
  chartStyle: { 
    marginVertical: 8, 
    borderRadius: 16, 
    paddingRight: 40 
    },
  donutCardContainer: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    paddingVertical: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 0, 
    borderColor: '#F2F2F2', 
    marginBottom: 8 
    },
  legendContainer: { 
    flexDirection: 'column', 
    width: '80%', 
    marginTop: 20, 
    paddingHorizontal: 10 
    },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 6 
    },
  legendDot: { 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    marginRight: 12 
    },
  legendLabel: { 
    fontSize: 15, 
    color: '#444', 
    fontWeight: '500' 
    },
  seeMoreButton: { 
    backgroundColor: '#EC6039', 
    paddingVertical: 14, 
    borderRadius: 6, 
    alignItems: 'center', 
    marginTop: 28 
    },
  seeMoreButtonText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 16, 
    letterSpacing: 0.5 
    },
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    paddingHorizontal: 24, 
    paddingTop: 24 
    },
  modalHeader: { 
    width: '100%', 
    alignItems: 'flex-end', 
    marginBottom: 10 
    },
  modalTitle: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#111', 
    marginBottom: 24, 
    textAlign: 'center' 
    },
  listItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
    },
  listItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
    },
  colorDot: { 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    marginRight: 14 
    },
  itemNameText: { 
    fontSize: 17, 
    color: '#333', 
    textTransform: 'capitalize' 
    },
  itemCountText: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#333' 
    },
  emptyText: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 40, 
    fontSize: 16 
    },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  halfColumn: {
    width: '48%', 
  },
  smallSectionTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#222', 
    marginBottom: 8,
    textAlign: 'center' 
  },
  donutCardContainer: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    paddingVertical: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 0, 
    borderColor: '#F2F2F2',
    minHeight: 200 // Ensures both containers stay perfectly uniform in height
  },
  legendContainer: { 
    flexDirection: 'column', 
    width: '90%', 
    marginTop: 12, 
    paddingHorizontal: 4 
  },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 4 
  },
  legendDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 6 
  },
  legendLabel: { 
    fontSize: 12, 
    color: '#444', 
    fontWeight: '500',
    flex: 1, 
  },
unitText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    textTransform: 'lowercase', 
  },

})