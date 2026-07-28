import { Text as DefaultText, View as DefaultView, type TextProps, type ViewProps } from 'react-native';

export type TextPropsWithTheme = TextProps;
export type ViewPropsWithTheme = ViewProps;

export function Text(props: TextPropsWithTheme) {
  return <DefaultText {...props} />;
}

export function View(props: ViewPropsWithTheme) {
  return <DefaultView {...props} />;
}
