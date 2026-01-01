import { View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPickerField({ value, onChange }: Props) {
  return (
    <View style={{ marginBottom: 0 }}>
      <ColorPicker
        color={value}
        onColorChange={onChange}
        thumbSize={20}
        sliderSize={30}
        noSnap
        row={false}
      />
    </View>
  );
}
