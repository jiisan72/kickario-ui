// Side-effect import so consumers of "@kickario/ui" get the component
// styles by importing the package's stylesheet export, e.g.:
//   import "@kickario/ui/styles.css";
import "./styles.css";

// Tokens
export { colors, spacing, spacingScalePx, radius, elevation, fontFamily, typography, kickarioTheme, eyebrowLetterSpacing } from "./tokens";

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonTone } from "./components/Button";

export { Chip } from "./components/Chip";
export type { ChipProps, ChipTone } from "./components/Chip";

export { chipCatalog } from "./chipCatalog";
export type { ChipCatalogEntry } from "./chipCatalog";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Toggle } from "./components/Toggle";
export type { ToggleProps } from "./components/Toggle";

export { Radio } from "./components/Radio";
export type { RadioProps } from "./components/Radio";

export { Card } from "./components/Card";
export type { CardProps, CardTone } from "./components/Card";

export { SegmentedControl } from "./components/SegmentedControl";
export type { SegmentedControlProps, SegmentedControlOption } from "./components/SegmentedControl";

export { Icon } from "./components/Icon";
export type { IconProps, IconName } from "./components/Icon";

export { BottomNav } from "./components/BottomNav";
export type { BottomNavProps, BottomNavItem } from "./components/BottomNav";

export { BackHeader } from "./components/BackHeader";
export type { BackHeaderProps } from "./components/BackHeader";

export { PostCard } from "./components/PostCard";
export type { PostCardProps, PostCardKind } from "./components/PostCard";
