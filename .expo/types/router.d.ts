/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/inventory` | `/(tabs)/profile` | `/(tabs)/recipes` | `/(tabs)/scan` | `/_sitemap` | `/inventory` | `/oboarding` | `/profile` | `/recipes` | `/scan`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
