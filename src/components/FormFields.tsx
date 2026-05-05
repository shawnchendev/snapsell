import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const TextField = ({ label, value, onChangeText, placeholder }: TextFieldProps) => {
  const theme = useTheme<Theme>();
  const [focused, setFocused] = useState(false);

  return (
    <Box>
      <Text color="textSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Text>
      <Box
        marginTop="xs"
        borderRadius="m"
        backgroundColor="card"
        borderWidth={1}
        borderColor={focused ? 'brandDark' : 'border'}
        paddingHorizontal="m"
      >
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Box>
    </Box>
  );
};

interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const TextArea = ({ label, value, onChangeText, placeholder, minHeight = 80 }: TextAreaProps) => {
  const theme = useTheme<Theme>();
  const [focused, setFocused] = useState(false);

  return (
    <Box>
      <Text color="textSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Text>
      <Box
        marginTop="xs"
        borderRadius="m"
        backgroundColor="card"
        borderWidth={1}
        borderColor={focused ? 'brandDark' : 'border'}
        paddingHorizontal="m"
        paddingVertical="s"
        minHeight={minHeight}
      >
        <TextInput
          style={[styles.textArea, { color: theme.colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          textAlignVertical="top"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },
  textArea: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    flex: 1,
  },
});
