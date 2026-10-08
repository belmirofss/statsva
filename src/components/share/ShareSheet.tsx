import { useState } from "react";
import { Modal, Pressable, ScrollView, Switch, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { Theme } from "../../theme";
import { useShare } from "../../hooks/useShare";
import {
  ShareCardStyle,
  useShareCardPrefs,
} from "../../hooks/useShareCardPrefs";
import { AppText } from "../layout/AppText";
import { SHARE_CARD_THEMES, ShareCard, ShareCardContent } from "./ShareCard";

const STYLES: { value: ShareCardStyle; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "orange", label: "Orange" },
  { value: "clear", label: "Clear" },
];

type Props = {
  visible: boolean;
  onDismiss: () => void;
  fileName: string;
  content: ShareCardContent;
};

/** Bottom sheet that previews the share image and lets the user style it. */
export const ShareSheet = ({ visible, onDismiss, fileName, content }: Props) => {
  const insets = useSafeAreaInsets();
  const { prefs, updatePrefs } = useShareCardPrefs();
  const { viewShotRef, openShareDialog } = useShare();
  const [isSharing, setIsSharing] = useState(false);

  const isClear = prefs.style === "clear";
  const format = isClear ? "png" : "jpg";

  const share = async () => {
    setIsSharing(true);
    try {
      await openShareDialog(format);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "rgba(21,23,26,0.45)" }}>
        <Pressable
          style={{ flex: 1 }}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View
          style={{
            maxHeight: "92%",
            backgroundColor: Theme.colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: insets.bottom + Theme.space.m,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: Theme.colors.gray,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: Theme.gutter,
              paddingRight: Theme.space.s,
            }}
          >
            <AppText bold size={20} accessibilityRole="header">
              Share card
            </AppText>
            <Pressable
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={Theme.colors.text}
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: Theme.gutter,
              gap: Theme.space.m,
            }}
          >
            <View
              style={{
                borderRadius: Theme.radius.l,
                overflow: "hidden",
                backgroundColor: isClear ? "#3a3f46" : Theme.colors.border,
              }}
            >
              <ViewShot
                ref={viewShotRef}
                options={{ format, quality: 1, fileName }}
              >
                <ShareCard
                  {...content}
                  cardStyle={prefs.style}
                  showRoute={prefs.showRoute}
                  showAthlete={prefs.showAthlete}
                  showWeather={prefs.showWeather}
                />
              </ViewShot>
            </View>
            {isClear && (
              <AppText size={13} color={Theme.colors.textMuted}>
                Transparent background, saved as PNG. Lay it over a photo
                in your story.
              </AppText>
            )}

            <View style={{ gap: Theme.space.s }}>
              <AppText bold size={13} color={Theme.colors.textMuted}>
                Style
              </AppText>
              <View
                accessibilityRole="radiogroup"
                style={{ flexDirection: "row", gap: Theme.space.s }}
              >
                {STYLES.map((style) => {
                  const active = style.value === prefs.style;
                  const swatch = SHARE_CARD_THEMES[style.value].background;
                  return (
                    <Pressable
                      key={style.value}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: active }}
                      onPress={() => updatePrefs({ style: style.value })}
                      style={{
                        flex: 1,
                        height: 48,
                        borderRadius: Theme.radius.m,
                        borderWidth: active ? 2 : 1,
                        borderColor: active
                          ? Theme.colors.text
                          : Theme.colors.border,
                        backgroundColor: Theme.colors.surface,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {style.value === "clear" ? (
                        <MaterialCommunityIcons
                          name="checkerboard"
                          size={16}
                          color={Theme.colors.textMuted}
                        />
                      ) : (
                        <View
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            backgroundColor: swatch,
                            borderWidth: 1,
                            borderColor: Theme.colors.border,
                          }}
                        />
                      )}
                      <AppText bold size={13}>
                        {style.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                backgroundColor: Theme.colors.surface,
                borderRadius: Theme.radius.l,
                paddingHorizontal: Theme.space.m,
              }}
            >
              {(content.polyline || content.routes) && (
                <ToggleRow
                  label={content.routes ? "Show routes" : "Show route"}
                  value={prefs.showRoute}
                  onChange={(showRoute) => updatePrefs({ showRoute })}
                />
              )}
              {content.weather && (
                <ToggleRow
                  label="Show weather"
                  value={prefs.showWeather}
                  onChange={(showWeather) => updatePrefs({ showWeather })}
                  divided={!!(content.polyline || content.routes)}
                />
              )}
              <ToggleRow
                label="Show my name and photo"
                value={prefs.showAthlete}
                onChange={(showAthlete) => updatePrefs({ showAthlete })}
                divided={!!(content.polyline || content.routes || content.weather)}
              />
            </View>
          </ScrollView>

          <View
            style={{
              paddingHorizontal: Theme.gutter,
              paddingTop: Theme.space.m,
            }}
          >
            <Pressable
              onPress={share}
              disabled={isSharing}
              accessibilityRole="button"
              style={({ pressed }) => ({
                height: 52,
                borderRadius: Theme.radius.l,
                backgroundColor: Theme.colors.primaryDark,
                opacity: pressed || isSharing ? 0.8 : 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: Theme.space.s,
              })}
            >
              <MaterialCommunityIcons
                name="export-variant"
                size={20}
                color={Theme.colors.white}
              />
              <AppText bold size={16} color={Theme.colors.white}>
                Share
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

type ToggleRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  divided?: boolean;
};

const ToggleRow = ({ label, value, onChange, divided }: ToggleRowProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 52,
      borderTopWidth: divided ? 1 : 0,
      borderTopColor: Theme.colors.border,
    }}
  >
    <AppText>{label}</AppText>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ true: Theme.colors.primary, false: Theme.colors.gray }}
      thumbColor={Theme.colors.white}
    />
  </View>
);
