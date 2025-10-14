import { defaultStyles, fillStyles, radiusStyles } from "./shared-styles.js";
import { createStyleSheet } from "../custom-element.js";

export const defaultSheet = createStyleSheet(defaultStyles);
export const fillSheet = createStyleSheet(fillStyles);
export const radiusSheet = createStyleSheet(radiusStyles);
