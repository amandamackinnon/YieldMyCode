import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function DecrementModal({
    visible,
    onClose,
    unit,
    maxQty,
    inputAmount,
    setInputAmount,
    onAction,
}) {
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 15 }}>
                        How many {unit || 'pcs'} are you removing? (Max: {maxQty})
                    </Text>

                    <TextInput
                        style={{
                            width: '60%',
                            borderBottomWidth: 2,
                            borderBottomColor: '#E07A5F',
                            fontSize: 24,
                            textAlign: 'center',
                            marginBottom: 20,
                            paddingVertical: 5,
                        }}
                        keyboardType="numeric"
                        value={inputAmount}
                        onChangeText={setInputAmount}
                        selectTextOnFocus
                        autoFocus
                    />

                    <View style={{ flexDirection: 'row', width: '100%', gap: 10, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#E07A5F', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                            onPress={() => onAction('wasted')}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>🗑️ Wasted</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#699966', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                            onPress={() => onAction('consumed')}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>🍽️ Eaten</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, borderColors: '#ccc', borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                            onPress={onClose}
                        >
                            <Text style={{ color: '#666' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}