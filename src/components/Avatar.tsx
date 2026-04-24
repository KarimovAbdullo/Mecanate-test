import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, layout, radius } from "../theme/tokens";

interface Props {
  uri?: string;
  size?: number;
}

export const Avatar = memo(({ uri, size = layout.avatarMd }: Props) => {
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={uri ? { uri } : undefined}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        transition={150}
        onError={(e) => console.log("[Avatar] load error:", uri, e)}
        onLoad={() => console.log("[Avatar] loaded:", uri)}
      />
    </View>
  );
});

Avatar.displayName = "Avatar";

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
    borderRadius: radius.pill,
  },
});
