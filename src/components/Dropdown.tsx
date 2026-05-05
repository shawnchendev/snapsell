import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useState } from 'react';
import { Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const Dropdown = ({ label, value, options, onSelect, placeholder = 'Select...' }: DropdownProps) => {
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (option: string) => {
      onSelect(option);
      setOpen(false);
    },
    [onSelect],
  );

  return (
    <Box>
      <Text color="textSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Text>

      <Pressable onPress={() => setOpen(true)}>
        <Box
          marginTop="xs"
          borderRadius="m"
          backgroundColor="card"
          borderWidth={1}
          borderColor="border"
          paddingHorizontal="m"
          paddingVertical="s"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          minHeight={42}
        >
          <Text
            color={value ? 'textPrimary' : 'textSecondary'}
            fontSize={14}
            fontWeight="600"
          >
            {value || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </Box>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Box
            marginHorizontal="xl"
            borderRadius="l"
            backgroundColor="card"
            borderWidth={1}
            borderColor="border"
            overflow="hidden"
            style={styles.modal}
          >
            <Box paddingHorizontal="m" paddingVertical="m" borderBottomWidth={1} borderBottomColor="border">
              <Text color="textPrimary" fontSize={15} fontWeight="800">
                {label}
              </Text>
            </Box>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <Pressable onPress={() => handleSelect(item)}>
                    <Box
                      paddingHorizontal="m"
                      paddingVertical="m"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor={isSelected ? 'chipBlueBg' : 'card'}
                    >
                      <Text
                        color={isSelected ? 'chipBlueText' : 'textPrimary'}
                        fontSize={14}
                        fontWeight={isSelected ? '700' : '500'}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={theme.colors.chipBlueText} />
                      )}
                    </Box>
                  </Pressable>
                );
              }}
            />
          </Box>
        </Pressable>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modal: {
    maxHeight: 400,
  },
  list: {
    maxHeight: 340,
  },
});
